import { Router, Response } from "express";
import { Connection, type IConnection } from "../models/Connection";
import { ProfileView } from "../models/ProfileView";
import { User, type IUser } from "../models/User";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "./auth";
import {
  notifyParentConnectionAccepted,
  notifyParentConnectionDeclined,
  notifyParentTeacherOutreach,
} from "../services/parent-notifications";

const router = Router();

router.use(ensureDb);
router.use(requireAuth);

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

/** wa.me needs a country code — assume India for bare 10-digit numbers */
function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function connectionSource(c: IConnection): "parent" | "profile" | "board" {
  if (c.requestedBy === "parent") return "parent";
  return c.requirement ? "board" : "profile";
}

function serializeForParent(
  c: IConnection,
  extras?: { phone?: string | null; teacherImageUrl?: string | null },
) {
  return {
    id: c._id.toString(),
    teacherId: c.teacher.toString(),
    teacherName: c.teacherName?.trim() || "Deleted user",
    teacherArea: c.teacherArea ?? null,
    teacherImageUrl: extras?.teacherImageUrl?.trim() || null,
    message: c.message,
    status: c.status,
    requestedBy: c.requestedBy ?? "parent",
    source: connectionSource(c),
    /** Only present once the connection is accepted */
    phone: c.status === "accepted" ? (extras?.phone ?? null) : null,
    sentAt: c.createdAt,
    respondedAt: c.respondedAt ?? null,
  };
}

function serializeForTeacher(c: IConnection) {
  return {
    id: c._id.toString(),
    parentName: c.parentName?.trim() || "Deleted user",
    parentArea: c.parentArea ?? null,
    message: c.message,
    status: c.status,
    sentAt: c.createdAt,
    respondedAt: c.respondedAt ?? null,
  };
}

/**
 * Parent → teacher connection request. The intro message is compulsory:
 * the teacher reviews it before their WhatsApp number is shared.
 */
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res
        .status(403)
        .json({ error: "Only parent accounts can send connection requests" });
      return;
    }

    const teacherId = String(req.body?.teacherId || "");
    const message = String(req.body?.message || "").trim();

    if (!/^[a-f\d]{24}$/i.test(teacherId)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    if (message.length < MESSAGE_MIN) {
      res.status(400).json({
        error: `Add a short message (at least ${MESSAGE_MIN} characters) so the tutor knows what you need`,
      });
      return;
    }
    if (message.length > MESSAGE_MAX) {
      res
        .status(400)
        .json({ error: `Message must be under ${MESSAGE_MAX} characters` });
      return;
    }

    const [parent, teacher] = await Promise.all([
      User.findById(req.auth!.sub),
      User.findById(teacherId),
    ]);
    if (!parent?.parentProfile?.name) {
      res
        .status(400)
        .json({ error: "Complete your details before connecting" });
      return;
    }
    if (
      !teacher ||
      teacher.role === "parent" ||
      !isProfileComplete(teacher as IUser)
    ) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const existing = (await Connection.findOne({
      parent: parent._id,
      teacher: teacher._id,
    })) as IConnection | null;

    if (existing?.status === "pending") {
      res.status(409).json({
        error: "Request already sent — waiting for the tutor to respond",
        code: "ALREADY_PENDING",
      });
      return;
    }
    if (existing?.status === "accepted") {
      res.status(409).json({
        error: "You're already connected with this tutor",
        code: "ALREADY_CONNECTED",
      });
      return;
    }

    const tp = teacher.profile!;
    const fields = {
      message,
      status: "pending" as const,
      parentName: parent.parentProfile.name,
      parentArea:
        parent.parentProfile.area || parent.parentProfile.city || undefined,
      teacherName: tp.name,
      teacherArea: [tp.area, tp.city].filter(Boolean).join(", ") || undefined,
      respondedAt: undefined,
    };

    let connection: IConnection;
    if (existing) {
      // Declined earlier — allow a fresh request with a new message
      existing.set(fields);
      connection = await existing.save();
    } else {
      connection = await Connection.create({
        parent: parent._id,
        teacher: teacher._id,
        ...fields,
      });
    }

    res.status(201).json({
      connection: serializeForParent(connection, {
        teacherImageUrl: (teacher.profileImageUrl || "").trim() || null,
      }),
      message: "Request sent — we'll notify you when the tutor responds",
    });
  } catch (error) {
    console.error("send connection error:", error);
    res.status(500).json({ error: "Failed to send request" });
  }
});

/**
 * Tutor → parent connect request after the parent viewed the tutor's profile.
 * The parent reviews the compulsory message before WhatsApp is shared.
 */
router.post("/outreach", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role === "parent") {
      res
        .status(403)
        .json({ error: "Only tutor accounts can reach out to profile viewers" });
      return;
    }

    const parentId = String(req.body?.parentId || "");
    const message = String(req.body?.message || "").trim();

    if (!/^[a-f\d]{24}$/i.test(parentId)) {
      res.status(404).json({ error: "Parent not found" });
      return;
    }
    if (message.length < MESSAGE_MIN) {
      res.status(400).json({
        error: `Add a short message (at least ${MESSAGE_MIN} characters) so the parent knows why you're reaching out`,
      });
      return;
    }
    if (message.length > MESSAGE_MAX) {
      res
        .status(400)
        .json({ error: `Message must be under ${MESSAGE_MAX} characters` });
      return;
    }

    const [teacher, parent, viewed] = await Promise.all([
      User.findById(req.auth!.sub),
      User.findById(parentId),
      ProfileView.findOne({ teacher: req.auth!.sub, viewer: parentId }),
    ]);

    if (!teacher?.profile?.name) {
      res.status(400).json({ error: "Complete your profile before reaching out" });
      return;
    }
    if (!parent?.parentProfile?.name) {
      res.status(404).json({ error: "Parent not found" });
      return;
    }
    if (!viewed) {
      res.status(403).json({
        error: "You can only reach out to parents who viewed your profile",
        code: "NOT_A_VIEWER",
      });
      return;
    }

    const existing = (await Connection.findOne({
      parent: parent._id,
      teacher: teacher._id,
    })) as IConnection | null;

    if (existing?.status === "pending") {
      res.status(409).json({
        error:
          existing.requestedBy === "parent"
            ? "This parent already sent you a request — check your inbox"
            : "Request already sent — waiting for the parent to respond",
        code: "ALREADY_PENDING",
      });
      return;
    }
    if (existing?.status === "accepted") {
      res.status(409).json({
        error: "You're already connected with this parent",
        code: "ALREADY_CONNECTED",
      });
      return;
    }

    const tp = teacher.profile;
    const fields = {
      message,
      status: "pending" as const,
      requestedBy: "teacher" as const,
      requirement: undefined,
      parentName: parent.parentProfile.name,
      parentArea:
        parent.parentProfile.area || parent.parentProfile.city || undefined,
      teacherName: tp.name,
      teacherArea: [tp.area, tp.city].filter(Boolean).join(", ") || undefined,
      respondedAt: undefined,
    };

    let connection: IConnection;
    if (existing) {
      existing.set(fields);
      connection = await existing.save();
    } else {
      connection = await Connection.create({
        parent: parent._id,
        teacher: teacher._id,
        ...fields,
      });
    }

    res.status(201).json({
      outreach: {
        parentId,
        parentName: connection.parentName,
        parentArea: connection.parentArea ?? null,
        message: connection.message,
        status: connection.status,
        sentAt: connection.createdAt,
      },
      message: "Sent — the parent will review your message on their dashboard",
    });

    void notifyParentTeacherOutreach(
      parent._id.toString(),
      connection.teacherName,
      teacher._id.toString(),
      connection._id.toString(),
    );
  } catch (error) {
    console.error("profile outreach error:", error);
    res.status(500).json({ error: "Failed to send connect request" });
  }
});

/** Parent: my connection history, most recent activity first. */
router.get("/mine", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have connections" });
      return;
    }

    const connections = (await Connection.find({ parent: req.auth!.sub })
      .sort({ updatedAt: -1 })
      .limit(100)) as IConnection[];

    // Phone + headshots for all teachers in this parent's history
    const teacherIds = [...new Set(connections.map((c) => c.teacher.toString()))];
    const teachers = teacherIds.length
      ? await User.find({ _id: { $in: teacherIds } }).select(
          "profile.phoneNumber profileImageUrl",
        )
      : [];
    const byId = new Map(
      teachers.map((t: IUser) => [
        t._id.toString(),
        {
          phone: waPhone(t.profile?.phoneNumber || ""),
          teacherImageUrl: (t.profileImageUrl || "").trim() || null,
        },
      ]),
    );

    res.json({
      connections: connections.map((c) => {
        const extra = byId.get(c.teacher.toString());
        return serializeForParent(c, {
          phone: extra?.phone,
          teacherImageUrl: extra?.teacherImageUrl,
        });
      }),
    });
  } catch (error) {
    console.error("list my connections error:", error);
    res.status(500).json({ error: "Failed to load connections" });
  }
});

/** Teacher: incoming requests inbox (pending first, then recent history). */
router.get("/requests", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role === "parent") {
      res
        .status(403)
        .json({ error: "Only tutor accounts receive connection requests" });
      return;
    }

    // Inbox = requests parents sent to this tutor. Board interests the
    // tutor sent themselves live on the requirements board instead.
    const connections = (await Connection.find({
      teacher: req.auth!.sub,
      requestedBy: { $ne: "teacher" },
    })
      .sort({ updatedAt: -1 })
      .limit(100)) as IConnection[];

    const pending = connections.filter((c) => c.status === "pending");

    res.json({
      pendingCount: pending.length,
      requests: connections.map(serializeForTeacher),
    });
  } catch (error) {
    console.error("list connection requests error:", error);
    res.status(500).json({ error: "Failed to load requests" });
  }
});

/**
 * Recipient accepts or declines a pending request.
 *
 *  - Parent-initiated → the teacher responds.
 *  - Teacher-initiated (requirements board) → the parent responds.
 *
 * Either way, accepting reveals the teacher's WhatsApp number to the
 * parent — never the other direction.
 */
router.post(
  "/:id/respond",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = String(req.params.id || "");
      const action = String(req.body?.action || "");
      if (!/^[a-f\d]{24}$/i.test(id)) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      if (action !== "accept" && action !== "decline") {
        res.status(400).json({ error: "Invalid action" });
        return;
      }

      const isParent = req.auth!.role === "parent";
      // Only the recipient may respond, never the sender
      const connection = (await Connection.findOne(
        isParent
          ? { _id: id, parent: req.auth!.sub, requestedBy: "teacher" }
          : { _id: id, teacher: req.auth!.sub, requestedBy: { $ne: "teacher" } },
      )) as IConnection | null;
      if (!connection) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      if (connection.status !== "pending") {
        res.status(409).json({ error: "This request was already handled" });
        return;
      }

      // Counterparty may have been deleted by admin
      const counterpartId = isParent
        ? connection.teacher.toString()
        : connection.parent.toString();
      const counterpart = await User.findById(counterpartId).select("_id");
      if (!counterpart) {
        connection.status = "declined";
        connection.respondedAt = new Date();
        if (isParent) {
          connection.teacherName = "Deleted user";
          connection.teacherArea = "";
        } else {
          connection.parentName = "Deleted user";
          connection.parentArea = "";
        }
        await connection.save();
        res.status(410).json({
          error: "This account was deleted and is no longer available",
        });
        return;
      }

      connection.status = action === "accept" ? "accepted" : "declined";
      connection.respondedAt = new Date();
      await connection.save();

      if (!isParent) {
        const parentId = connection.parent.toString();
        const teacherId = connection.teacher.toString();
        const connectionId = connection._id.toString();
        if (action === "accept") {
          void notifyParentConnectionAccepted(
            parentId,
            connection.teacherName,
            teacherId,
            connectionId,
          );
        } else {
          void notifyParentConnectionDeclined(
            parentId,
            connection.teacherName,
            teacherId,
            connectionId,
          );
        }
      }

      if (isParent) {
        // Parent accepted a tutor's pitch — hand back photo + unlocked number
        const teacher = await User.findById(connection.teacher).select(
          "profile.phoneNumber profileImageUrl",
        );
        const teacherImageUrl =
          (teacher?.profileImageUrl || "").trim() || null;
        const phone =
          connection.status === "accepted" && teacher?.profile?.phoneNumber
            ? waPhone(teacher.profile.phoneNumber)
            : null;
        res.json({
          connection: serializeForParent(connection, {
            phone,
            teacherImageUrl,
          }),
          message:
            action === "accept"
              ? `You're connected — chat with ${connection.teacherName} on WhatsApp`
              : "Response declined",
        });
        return;
      }

      res.json({
        request: serializeForTeacher(connection),
        message:
          action === "accept"
            ? `You're connected — ${connection.parentName} can now see your WhatsApp number`
            : "Request declined",
      });
    } catch (error) {
      console.error("respond connection error:", error);
      res.status(500).json({ error: "Failed to update request" });
    }
  },
);

export default router;
