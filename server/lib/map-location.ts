import { geocodeAddress, geocodeIp } from "../services/geocode";
import { type IFacultyProfile, type IUser } from "../models/User";

export type MapLocationSource = "profile" | "ip";

function locationKey(p: IFacultyProfile): string {
  return [p.area, p.city, p.country]
    .map((s) => String(s || "").trim().toLowerCase())
    .join("|");
}

function needsProfileGeocode(p: IFacultyProfile): boolean {
  const key = locationKey(p);
  const hasCoords =
    p.mapLat != null &&
    p.mapLng != null &&
    Number.isFinite(p.mapLat) &&
    Number.isFinite(p.mapLng);

  return (
    !hasCoords ||
    p.mapLocationSource !== "profile" ||
    p.mapLocationKey !== key
  );
}

/** Geocode profile address; mutates profile in memory (caller saves). */
export async function resolveFacultyMapLocation(
  profile: IFacultyProfile,
  opts?: { ip?: string },
): Promise<{ updated: boolean; source?: MapLocationSource }> {
  const hasProfileLocation = Boolean(profile.city?.trim());

  if (hasProfileLocation) {
    const geo = await geocodeAddress({
      area: profile.area,
      city: profile.city,
      country: profile.country,
    });
    if (geo) {
      profile.mapLat = geo.lat;
      profile.mapLng = geo.lng;
      profile.mapLocationSource = "profile";
      profile.mapLocationKey = locationKey(profile);
      return { updated: true, source: "profile" };
    }
  }

  if (
    opts?.ip &&
    (profile.mapLat == null ||
      profile.mapLng == null ||
      !Number.isFinite(profile.mapLat) ||
      !Number.isFinite(profile.mapLng))
  ) {
    const ipGeo = await geocodeIp(opts.ip);
    if (ipGeo) {
      profile.mapLat = ipGeo.lat;
      profile.mapLng = ipGeo.lng;
      profile.mapLocationSource = "ip";
      return { updated: true, source: "ip" };
    }
  }

  return { updated: false };
}

/** Backfill map coords from profile city/area — profile always beats IP. */
export async function ensureFacultyMapLocation(
  user: IUser,
  ip?: string,
): Promise<boolean> {
  const p = user.profile;
  if (!p?.city?.trim()) return false;
  if (!needsProfileGeocode(p)) return false;

  const before = `${p.mapLat},${p.mapLng},${p.mapLocationSource},${p.mapLocationKey}`;
  const { updated } = await resolveFacultyMapLocation(p, { ip });
  if (!updated) return false;

  const after = `${p.mapLat},${p.mapLng},${p.mapLocationSource},${p.mapLocationKey}`;
  if (before === after) return false;

  user.profile = p;
  await user.save();
  return true;
}

/** Batch backfill — processes all faculty needing profile geocode. */
export async function backfillMapCoords(
  users: IUser[],
  ip?: string,
): Promise<number> {
  const queue = users.filter((u) => {
    const p = u.profile;
    return p?.city?.trim() && needsProfileGeocode(p);
  });

  let count = 0;
  const concurrency = 4;
  for (let i = 0; i < queue.length; i += concurrency) {
    const slice = queue.slice(i, i + concurrency);
    const results = await Promise.all(
      slice.map((user) => ensureFacultyMapLocation(user, ip)),
    );
    count += results.filter(Boolean).length;
  }
  return count;
}
