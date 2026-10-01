"""C18 · Working Backwards — visuals."""
import math

import build as K

LADDOO = (255, 168, 40)
LADDOO_DARK = (220, 128, 20)
LADDOO_DOT = (255, 214, 130)
NOTE_20 = (236, 150, 80)
NOTE_10 = (196, 150, 110)
NOTE_50 = (110, 196, 200)
MARBLE = (64, 124, 226)
MARBLE_DARK = (40, 88, 180)
CARD = (123, 97, 214)
CARD_DARK = (88, 66, 170)
SOCK = (255, 106, 26)
SOCK_DARK = (214, 80, 16)
SHOE = (52, 60, 76)
STICKER = (255, 196, 40)
GRASS = (150, 200, 110)
PITCH = (226, 200, 150)
TREE = (70, 150, 84)
TRUNK = (140, 96, 60)
SUN = (255, 196, 60)
SCRIBBLE = (226, 62, 70)
FWD = (92, 102, 120)
BACK = (255, 106, 26)
KABIR = (70, 156, 92)
CAP = (64, 124, 226)
ZOYA = (238, 104, 158)
DEV = (123, 97, 214)
RIYA = (255, 138, 20)
MINA = (13, 148, 136)


def S_(s):
    return lambda v: v * s


def boy(draw, cx, cy, s, body, t=0.0, cap=None):
    """cy = face centre; hair top ≈ cy-72s (cap ≈ cy-100s), body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    draw.polygon([(cx - S(22), cy + S(52)), (cx + S(22), cy + S(52)), (cx, cy + S(84))], fill=(255, 255, 255))
    K.draw_face(draw, cx, cy, S(64), "kid", 0.6)
    if cap:
        draw.chord((cx - S(70), cy - S(100), cx + S(70), cy + S(10)), 180, 360, fill=cap)
        draw.rounded_rectangle((cx - S(10), cy - S(52), cx + S(110), cy - S(36)), radius=S(8), fill=cap)
        draw.ellipse((cx - S(10), cy - S(108), cx + S(10), cy - S(90)), fill=cap)
    else:
        for k in range(3):
            x = cx - S(24) + k * S(22)
            draw.polygon([(x - S(12), cy - S(62)), (x + S(14), cy - S(62)), (x + S(6), cy - S(86))], fill=K.HAIR)


def girl(draw, cx, cy, s, body, t=0.0):
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                     fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    draw.ellipse((cx + r * 0.5, cy - r * 1.05, cx + r * 0.95, cy - r * 0.6), fill=body)


def laddoo(draw, x, y, r):
    draw.ellipse((x - r + r * 0.1, y - r + r * 0.16, x + r + r * 0.1, y + r + r * 0.16), fill=K.SHADOW)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=LADDOO_DARK)
    draw.ellipse((x - r * 0.9, y - r * 0.94, x + r * 0.84, y + r * 0.8), fill=LADDOO)
    for dx, dy in ((-0.4, -0.3), (0.2, -0.45), (0.35, 0.15), (-0.15, 0.3), (-0.5, 0.2), (0.05, -0.05)):
        draw.ellipse((x + dx * r - r * 0.08, y + dy * r - r * 0.08, x + dx * r + r * 0.08, y + dy * r + r * 0.08),
                     fill=LADDOO_DOT)


def tiffin(draw, cx, cy, s, n_peek=3, lid=True):
    """Open steel tiffin. cy = box centre; box ≈ ±150s wide, cy-60s..cy+70s."""
    S = S_(s)
    draw.rounded_rectangle((cx - S(150) + S(8), cy - S(60) + S(10), cx + S(150) + S(8), cy + S(70) + S(10)),
                           radius=S(30), fill=K.SHADOW)
    for k in range(n_peek):
        laddoo(draw, cx - S(70) + k * S(70), cy - S(56), S(34))
    draw.rounded_rectangle((cx - S(150), cy - S(60), cx + S(150), cy + S(70)), radius=S(30), fill=K.STEEL,
                           outline=K.STEEL_DARK, width=max(2, int(S(5))))
    draw.line((cx - S(130), cy - S(20), cx + S(130), cy - S(20)), fill=(206, 212, 222), width=max(2, int(S(6))))
    if lid:
        draw.rounded_rectangle((cx + S(90), cy - S(190), cx + S(250), cy - S(120)), radius=S(20), fill=K.STEEL,
                               outline=K.STEEL_DARK, width=max(2, int(S(5))))
        draw.ellipse((cx + S(150), cy - S(206), cx + S(190), cy - S(186)), fill=K.STEEL_DARK)


def rupee(draw, x, y, sz, col):
    """Hand-drawn rupee mark, centred at x, y; sz ≈ glyph height."""
    w = max(3, int(sz * 0.12))
    draw.line((x - sz * 0.3, y - sz * 0.42, x + sz * 0.3, y - sz * 0.42), fill=col, width=w)
    draw.line((x - sz * 0.3, y - sz * 0.18, x + sz * 0.3, y - sz * 0.18), fill=col, width=w)
    draw.arc((x - sz * 0.42, y - sz * 0.42, x + sz * 0.1, y + sz * 0.06), 270, 450, fill=col, width=w)
    draw.line((x - sz * 0.3, y + sz * 0.06, x - sz * 0.16, y + sz * 0.06), fill=col, width=w)
    draw.line((x - sz * 0.2, y + sz * 0.06, x + sz * 0.26, y + sz * 0.5), fill=col, width=w)


def note(draw, cx, cy, w, h, amount, col):
    draw.rounded_rectangle((cx - w / 2 + 6, cy - h / 2 + 8, cx + w / 2 + 6, cy + h / 2 + 8), radius=10, fill=K.SHADOW)
    draw.rounded_rectangle((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), radius=10, fill=col,
                           outline=tuple(int(c * 0.75) for c in col), width=4)
    draw.ellipse((cx + w * 0.12, cy - h * 0.32, cx + w * 0.42, cy + h * 0.32), fill=tuple(min(255, c + 40) for c in col))
    f = K.load_font(max(26, int(h * 0.42)), bold=True)
    rupee(draw, cx - w * 0.28, cy + h * 0.02, h * 0.42, (40, 44, 56))
    draw.text((cx - w * 0.18, cy - h * 0.26), str(amount), font=f, fill=(40, 44, 56))


def marble(draw, x, y, r, col=MARBLE):
    draw.ellipse((x - r + r * 0.12, y - r + r * 0.16, x + r + r * 0.12, y + r + r * 0.16), fill=K.SHADOW)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=MARBLE_DARK if col == MARBLE else col)
    draw.ellipse((x - r * 0.86, y - r * 0.9, x + r * 0.8, y + r * 0.76), fill=col)
    draw.ellipse((x - r * 0.5, y - r * 0.6, x - r * 0.1, y - r * 0.22), fill=(255, 255, 255))


def card(draw, cx, cy, s, rot=0.0, col=CARD):
    S = S_(s)
    hw, hh = S(46), S(64)
    ca, sa = math.cos(rot), math.sin(rot)

    def P(x, y):
        return (cx + x * ca - y * sa, cy + x * sa + y * ca)

    draw.polygon([P(-hw + S(6), -hh + S(8)), P(hw + S(6), -hh + S(8)), P(hw + S(6), hh + S(8)), P(-hw + S(6), hh + S(8))],
                 fill=K.SHADOW)
    draw.polygon([P(-hw, -hh), P(hw, -hh), P(hw, hh), P(-hw, hh)], fill=(255, 255, 255), outline=CARD_DARK)
    draw.polygon([P(-hw + S(8), -hh + S(8)), P(hw - S(8), -hh + S(8)), P(hw - S(8), hh - S(8)), P(-hw + S(8), hh - S(8))],
                 fill=col)
    sx, sy = P(0, 0)
    K.draw_star(draw, sx, sy, S(24), K.GOLD, rot=rot)


def sticker(draw, x, y, r):
    draw.ellipse((x - r + 4, y - r + 6, x + r + 4, y + r + 6), fill=K.SHADOW)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255), outline=(220, 210, 196), width=3)
    K.draw_star(draw, x, y, r * 0.78, STICKER)


def footprint(draw, x, y, s, col):
    """Bare footprint walking left (toes on the left)."""
    S = S_(s)
    draw.ellipse((x - S(36), y - S(18), x + S(36), y + S(18)), fill=col)
    for k in range(4):
        ty = y - S(15) + k * S(10)
        draw.ellipse((x - S(54), ty - S(6), x - S(42), ty + S(6)), fill=col)


def sock(draw, x, y, s):
    """Sock on a foot; (x, y) = heel bottom."""
    S = S_(s)
    draw.rounded_rectangle((x - S(26), y - S(150), x + S(28), y - S(20)), radius=S(16), fill=SOCK)
    draw.rounded_rectangle((x - S(26), y - S(56), x + S(96), y), radius=S(28), fill=SOCK)
    draw.rectangle((x - S(26), y - S(150), x + S(28), y - S(130)), fill=SOCK_DARK)


def shoe(draw, x, y, s):
    S = S_(s)
    draw.rounded_rectangle((x - S(34), y - S(78), x + S(108), y + S(6)), radius=S(34), fill=SHOE)
    draw.rounded_rectangle((x - S(40), y - S(6), x + S(114), y + S(14)), radius=S(8), fill=(236, 230, 220))
    for k in range(3):
        lx = x + S(14) + k * S(20)
        draw.line((lx, y - S(66), lx + S(14), y - S(50)), fill=(255, 255, 255), width=max(2, int(S(5))))


def undo_icon(draw, x, y, r, col, width=None):
    wd = width or max(4, int(r * 0.22))
    draw.arc((x - r, y - r, x + r, y + r), 200, 520, fill=col, width=wd)
    a = math.radians(200)
    px, py = x + math.cos(a) * r, y + math.sin(a) * r
    draw.polygon([(px - r * 0.5, py - r * 0.1), (px + r * 0.35, py - r * 0.25), (px - r * 0.05, py + r * 0.55)], fill=col)


def tree(draw, x, by, s):
    S = S_(s)
    draw.rectangle((x - S(14), by - S(110), x + S(14), by), fill=TRUNK)
    for dx, dy, r in ((-40, -130, 56), (40, -130, 56), (0, -180, 66)):
        draw.ellipse((x + S(dx) - S(r), by + S(dy) - S(r), x + S(dx) + S(r), by + S(dy) + S(r)), fill=TREE)


def sun(draw, x, y, r, t=0.0):
    for k in range(10):
        a = k * math.pi / 5 + t
        draw.line((x + math.cos(a) * r * 1.3, y + math.sin(a) * r * 1.3, x + math.cos(a) * r * 1.75,
                   y + math.sin(a) * r * 1.75), fill=SUN, width=max(3, int(r * 0.14)))
    draw.ellipse((x - r, y - r, x + r, y + r), fill=SUN)


def scribble(draw, x0, y0, x1, y1):
    pts = []
    n = 14
    for k in range(n + 1):
        pts.append((K.lerp(x0, x1, k / n), y0 if k % 2 == 0 else y1))
    draw.line(pts, fill=SCRIBBLE, width=12, joint="curve")


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    lav_soft = K.hex_rgb("#EFEAFB")
    blue_soft = K.hex_rgb("#E6EEFB")
    gold_soft = (255, 244, 214)
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def num_box(x, y, bw, bh, txt, state="known", size=None, round_=False):
        """Centred at (x, y)."""
        box = (x - bw / 2, y - bh / 2, x + bw / 2, y + bh / 2)
        rad = int(bh / 2) if round_ else 30
        fs = size or int(bh * 0.5)
        if state == "unknown":
            draw.rounded_rectangle(box, radius=rad, fill=coral_soft)
            dashed_box(box, coral) if not round_ else draw.rounded_rectangle(box, radius=rad, outline=coral, width=5)
            K.text_at(draw, "?", x, y - fs * 0.62, font(int(fs * 1.1 + 10 * pulse), bold=True), coral)
            return
        out = sage if state == "found" else line
        draw.rounded_rectangle((box[0] + 8, box[1] + 10, box[2] + 8, box[3] + 10), radius=rad, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=rad, fill=sage_soft if state == "found" else panel, outline=out,
                               width=6 if state == "found" else 3)
        if txt:
            K.text_at(draw, txt, x, y - fs * 0.58, font(fs, bold=True), sage if state == "found" else ink)

    def fwd_arrow(x0, x1, y, label, col=FWD, a=1.0, size=36):
        if a <= 0:
            return
        K.draw_arrow(draw, x0, y, K.lerp(x0, x1, a), y, col, width=10, head=30)
        if a > 0.5:
            K.pill(draw, (x0 + x1) / 2, y - 74, label, col, size=size)

    def back_arrow(x_from, x_to, y, depth, label, col=BACK, a=1.0, size=36, label_dy=0):
        if a <= 0:
            return
        p0, p2 = (x_from, y), (x_to, y)
        p1 = ((x_from + x_to) / 2, y + depth)
        n = 60
        m = max(2, int(n * a))
        pts = [K.qbez(p0, p1, p2, k / n) for k in range(m + 1)]
        draw.line(pts, fill=col, width=10, joint="curve")
        (ax, ay), (bx, by) = pts[-2], pts[-1]
        ang = math.atan2(by - ay, bx - ax)
        hd = 30
        left = (bx - hd * math.cos(ang) + hd * 0.62 * math.sin(ang), by - hd * math.sin(ang) - hd * 0.62 * math.cos(ang))
        right = (bx - hd * math.cos(ang) - hd * 0.62 * math.sin(ang), by - hd * math.sin(ang) + hd * 0.62 * math.cos(ang))
        draw.polygon([(bx + 6 * math.cos(ang), by + 6 * math.sin(ang)), left, right], fill=col)
        if a > 0.4:
            mxp, myp = K.qbez(p0, p1, p2, 0.5)
            K.pill(draw, mxp, myp + (14 if depth > 0 else -70) + label_dy, label, col, size=size)

    def laddoo_row(x_mid, y, n, r=26, gap=62, per_row=None, a_start=0):
        per_row = per_row or n
        for k in range(n):
            a = K.stagger(progress, a_start + k, step=0.03, speed=8)
            if a <= 0:
                continue
            r_, c_ = divmod(k, per_row)
            cnt = min(per_row, n - r_ * per_row)
            laddoo(draw, x_mid + (c_ - (cnt - 1) / 2) * gap, y + r_ * (gap - 4), r * a + 1)

    # ---- opening -----------------------------------------------------------
    if visual == "c18-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            boy(draw, cx + 280, 440, 1.3, KABIR, t, cap=CAP)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            laddoo(draw, cx - 620, 360 + bounce, 40)
            undo_icon(draw, cx + 620, 360, 40, coral)
            star_spots([(cx - 560, 580), (cx + 560, 580), (cx, 280)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · CHANCES", cx, 326 + lift, font(34, bold=True), sage)
            items = [("Impossible", (224, 62, 62), 0.0), ("Unlikely", (240, 140, 40), 0.25),
                     ("Likely", (110, 172, 60), 0.75), ("Certain", (13, 148, 136), 1.0)]
            for i, (lab, col, frac) in enumerate(items):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 330
                y = 540 + int((1 - a) * 40)
                draw.ellipse((x - 100, y - 100, x + 100, y + 100), fill=(255, 255, 255), outline=col, width=12)
                if frac >= 1:
                    draw.ellipse((x - 76, y - 76, x + 76, y + 76), fill=col)
                elif frac > 0:
                    draw.pieslice((x - 76, y - 76, x + 76, y + 76), -90, -90 + 360 * frac, fill=col)
                K.text_at(draw, lab, x, y + 126, font(40, bold=True), col)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Working Backwards", cx, 360 + lift, font(90, bold=True), ink)
            xs = [cx - 480, cx, cx + 480]
            a = K.stagger(progress, 1, step=0.12, speed=4)
            if a > 0:
                num_box(xs[0], 680, 200, 140, "?", "unknown", size=70)
                fwd_arrow(xs[0] + 120, xs[1] - 120, 680, "+", a=a)
                num_box(xs[1], 680, 200, 140, "", "known")
                fwd_arrow(xs[1] + 120, xs[2] - 120, 680, "+", a=a)
                num_box(xs[2], 680, 200, 140, "END", "known", size=60)
            b = K.ease_out_cubic(K.clamp01((progress - 0.35) * 2))
            back_arrow(xs[2], xs[0], 760, 100, "undo!", a=b, label_dy=-6)
            return True
        # promise
        draw.ellipse((460 - 250, 560 - 250, 460 + 250, 560 + 250), fill=lav_soft)
        boy(draw, 460, 510, 1.6, KABIR, t, cap=CAP)
        K.draw_magnifier(draw, 640, 690, 0.8, coral)
        K.pill(draw, 1640, 300, "END", sage, size=44)
        K.pill(draw, 960, 300, "START ?", coral, size=44)
        for k in range(5):
            a = K.stagger(progress, k + 1, step=0.1, speed=5)
            if a > 0:
                fx = 1540 - k * 130
                footprint(draw, fx, 470 + (30 if k % 2 else -10), 1.0, K.DEV_MID)
        K.text_at(draw, "Walk back,", 1300, 600 + lift, font(76, bold=True), ink)
        K.text_at(draw, "step by step!", 1300, 700 + lift, font(76, bold=True), coral)
        return True

    # ---- Kabir's laddoos ------------------------------------------------------------
    if visual == "c18-hook":
        if focus == "meet":
            draw.ellipse((560 - 280, 560 - 280, 560 + 280, 560 + 280), fill=gold_soft)
            boy(draw, 560, 470, 1.6, KABIR, t, cap=CAP)
            K.text_at(draw, "Meet", 1320, 260 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Kabir!", 1320, 330 + lift, font(130, bold=True), KABIR)
            tiffin(draw, 1260, 680, 1.1, n_peek=3)
            K.pill(draw, 1260, 790, "some laddoos…", coral, size=34)
            question_marks([(1620, 560)], size=80)
            return True
        if focus == "gift":
            boy(draw, 300, 460, 1.1, KABIR, t, cap=CAP)
            girl(draw, 1620, 460, 1.1, ZOYA, t + 0.3)
            K.text_at(draw, "Kabir", 300, 640, font(34, bold=True), KABIR)
            K.text_at(draw, "Zoya", 1620, 640, font(34, bold=True), ZOYA)
            for k in range(4):
                a = K.ease_in_out(K.clamp01((progress - 0.03 - k * 0.08) * 3))
                if a >= 1:
                    continue
                x = K.lerp(1480 - k * 10, 560 + (k - 1.5) * 50, a)
                y = K.lerp(600, 660, a) - 220 * math.sin(a * math.pi)
                laddoo(draw, x, y, 30)
            tiffin(draw, 560, 730, 1.0, n_peek=0, lid=False)
            K.pill(draw, 560, 250, "4 more!", coral, size=44)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.text_at(draw, "Now: 12 laddoos!", 1100, 560 + int((1 - a) * 20), font(52, bold=True), ink)
                laddoo_row(1100, 700, 12, r=24, gap=60, per_row=6, a_start=6)
            return True
        if focus == "ask":
            K.draw_person(draw, 360, 470, 1.15, "nani", t)
            K.draw_bubble(draw, (520, 240, 1260, 420), brand, "Kabir, how many did you have before?", tail="left",
                          size=42)
            boy(draw, 1530, 520, 1.15, KABIR, t, cap=CAP)
            question_marks([(1360, 380), (1720, 360)], size=80)
            K.text_at(draw, "I forgot!", 1530, 760, font(44, bold=True), coral)
            K.draw_stopwatch(draw, 900, 680, 70, progress, brand)
            return True
        # clue
        xs = [380, 960, 1540]
        num_box(xs[0], 470, 280, 220, "?", "unknown", size=100)
        fwd_arrow(xs[0] + 160, xs[2] - 160, 470, "+4", col=K.BOTH_COLOR, size=44)
        num_box(xs[2], 470, 280, 220, "12", "known", size=110)
        tags = [("START", "We don't know", coral), ("STEP", "4 more added", K.BOTH_COLOR), ("END", "We know!", sage)]
        for i, (title, sub, col) in enumerate(tags):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            y = 640 + int((1 - a) * 20)
            K.text_at(draw, title, xs[i], y, font(40, bold=True), col)
            K.text_at(draw, sub, xs[i], y + 56, font(36, bold=True), ink)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, cx, 250, "Enough to solve it!", sage, size=40)
        return True

    # ---- definition ---------------------------------------------------------------------
    if visual == "c18-define":
        if focus == "name":
            draw.ellipse((440 - 260, 560 - 260, 440 + 260, 560 + 260), fill=coral_soft)
            undo_icon(draw, 440, 560, 150 + 6 * pulse, coral, width=34)
            K.shadow_card(draw, (800, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "WORKING BACKWARDS", 1290, 320 + lift, font(44, bold=True), muted)
            parts = [("Start at the END,", sage), ("undo each step,", coral), ("find the START!", K.BOTH_COLOR)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a > 0:
                    K.text_at(draw, txt, 1290, 430 + i * 120 + lift + int((1 - a) * 30), font(66, bold=True), col)
            return True
        if focus == "when":
            draw.rounded_rectangle((180, 560, 1740, 640), radius=40, fill=(230, 222, 210))
            K.draw_dashed(draw, 240, 600, 1680, 600, (255, 255, 255), width=8)
            for x, lab, col, known in ((280, "START", coral, False), (1640, "END", sage, True)):
                draw.line((x, 560, x, 330), fill=K.DEV_DARK, width=10)
                draw.polygon([(x, 330), (x + 150, 370), (x, 410)], fill=col)
                K.text_at(draw, lab, x, 270, font(38, bold=True), col)
                if known:
                    K.pill(draw, x, 680, "We know it!", sage, size=36)
                else:
                    K.pill(draw, x, 680, "Not known", coral, size=36)
                    K.text_at(draw, "?", x + 80, 334, font(64, bold=True), (255, 255, 255))
            kx = K.lerp(1460, 640, K.ease_in_out(progress))
            for k in range(6):
                fx = 1520 - k * 140
                if fx > kx + 60:
                    footprint(draw, fx, 590 + (14 if k % 2 else -14), 0.8, K.DEV_MID)
            boy(draw, kx, 420, 0.9, KABIR, t, cap=CAP)
            K.draw_arrow(draw, 1020, 790, 720, 790, coral, width=14, head=36)
            K.text_at(draw, "Walk back from the end", 1300, 768, font(40, bold=True), coral)
            return True
        # rewind
        draw.rounded_rectangle((330 + 12, 250 + 14, 1590 + 12, 840 + 14), radius=40, fill=K.SHADOW)
        draw.rounded_rectangle((330, 250, 1590, 840), radius=40, fill=K.DEV_DARK)
        draw.rounded_rectangle((370, 290, 1550, 800), radius=24, fill=GRASS)
        draw.polygon([(860, 300), (1060, 300), (1160, 790), (760, 790)], fill=PITCH)
        for sx in (900, 1020):
            for k in range(3):
                draw.rectangle((sx - 14 + k * 12, 320, sx - 8 + k * 12, 370), fill=(250, 246, 236))
        for sx in (840, 1080):
            for k in range(3):
                draw.rectangle((sx - 18 + k * 16, 690, sx - 10 + k * 16, 770), fill=(250, 246, 236))
        K.draw_person(draw, 960, 470, 0.55, "kid", 0)
        p0, p1, p2 = (960, 720), (1160, 420), (960, 400)
        bt = 1.0 - K.ease_in_out(progress)
        K.draw_curve(draw, p2, p1, p0, (255, 255, 255), width=5, dashed=True, phase=progress * 40)
        bx, by = K.qbez(p2, p1, p0, bt)
        draw.ellipse((bx - 22, by - 22, bx + 22, by + 22), fill=(200, 40, 50))
        draw.arc((bx - 14, by - 22, bx + 14, by + 22), 250, 290, fill=(255, 255, 255), width=3)
        for k in range(2):
            x = 430 + k * 50
            draw.polygon([(x + 50, 320), (x + 50, 380), (x, 350)], fill=(255, 255, 255))
        K.pill(draw, 620, 322, "REPLAY", coral, size=30)
        K.pill(draw, 1340, 322, "Back to the start!", sage, size=32)
        return True

    # ---- draw the story -------------------------------------------------------------------
    if visual == "c18-draw":
        xs = [460, 1460]
        y = 400
        st_start = "unknown" if focus in ("forward", "reverse") else "found"
        num_box(xs[0], y, 280, 220, "8" if st_start == "found" else "?", st_start, size=110)
        a_f = K.ease_out_cubic(K.clamp01(progress * 2.2)) if focus == "forward" else 1.0
        fcol = sage if focus == "check" else K.BOTH_COLOR
        fwd_arrow(xs[0] + 160, xs[1] - 160, y, "+4", col=fcol, a=a_f, size=48)
        if focus != "forward" or progress > 0.4:
            num_box(xs[1], y, 280, 220, "12", "known", size=110)
        K.text_at(draw, "start", xs[0], 244, font(34, bold=True), muted)
        if focus != "forward" or progress > 0.4:
            K.text_at(draw, "end", xs[1], 244, font(34, bold=True), muted)
        if focus == "forward":
            K.pill(draw, cx, 236, "Draw the story", K.BOTH_COLOR, size=36)
            laddoo_row(xs[1], 680, 12, r=22, gap=56, per_row=6, a_start=6)
            return True
        if focus in ("reverse", "solve"):
            a_b = K.ease_out_cubic(K.clamp01(progress * 1.8)) if focus == "reverse" else 1.0
            back_arrow(xs[1], xs[0], 520, 260, "−4", a=a_b, size=48)
        if focus == "reverse":
            K.pill(draw, cx, 236, "Reverse the arrow!", coral, size=36)
            if progress > 0.5:
                K.text_at(draw, "Opposite of +4 is −4", cx, 790, font(46, bold=True), ink)
            return True
        if focus == "solve":
            K.text_at(draw, "12 − 4 = 8", cx + 80, 750 + lift, font(80, bold=True), coral)
            laddoo_row(xs[0], 680, 8, r=22, gap=56, per_row=4, a_start=2)
            K.draw_check(draw, xs[0] + 140, y - 110, 30, sage)
            return True
        # check
        K.text_at(draw, "8 + 4 = 12", cx, 640 + lift, font(90, bold=True), sage)
        K.draw_check(draw, xs[1] + 140, y - 110, 30, sage)
        K.pill(draw, cx, 236, "Check going forwards", sage, size=36)
        K.text_at(draw, "It matches the end!", cx, 780, font(44, bold=True), ink)
        return True

    # ---- flips ---------------------------------------------------------------------------
    if visual == "c18-flip":
        if focus == "intro":
            for i, (txt, col, soft) in enumerate((("+5", K.BOTH_COLOR, lav_soft), ("−5", coral, coral_soft))):
                x = cx + (i * 2 - 1) * 380
                draw.ellipse((x - 190, 540 - 190, x + 190, 540 + 190), fill=soft, outline=col, width=8)
                K.text_at(draw, txt, x, 470, font(130, bold=True), col)
                K.text_at(draw, "add 5" if i == 0 else "subtract 5", x, 760, font(42, bold=True), ink)
            K.draw_curve(draw, (cx - 220, 420), (cx, 300), (cx + 200, 420), K.BOTH_COLOR, width=10)
            draw.polygon([(cx + 220, 440), (cx + 176, 412), (cx + 214, 394)], fill=K.BOTH_COLOR)
            K.draw_curve(draw, (cx + 220, 660), (cx, 780), (cx - 200, 660), coral, width=10)
            draw.polygon([(cx - 220, 640), (cx - 176, 668), (cx - 214, 686)], fill=coral)
            K.pill(draw, cx, 236, "Undo = do the opposite", sage, size=38)
            return True
        if focus in ("more", "less"):
            more = focus == "more"
            labs = ["Got more", "Found", "Bought"] if more else ["Lost", "Gave away", "Ate"]
            col = K.BOTH_COLOR if more else K.ROAD
            for i, lab in enumerate(labs):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 470
                y0 = 250 + int((1 - a) * 30)
                K.shadow_card(draw, (x - 200, y0, x + 200, y0 + 360), brand, radius=32, outline=col, outline_w=4)
                iy = y0 + 150
                if more and i == 0:
                    draw.rounded_rectangle((x - 70, iy - 50, x + 70, iy + 60), radius=10, fill=coral)
                    draw.rectangle((x - 12, iy - 50, x + 12, iy + 60), fill=K.GOLD)
                    draw.rectangle((x - 80, iy - 70, x + 80, iy - 40), fill=coral)
                    draw.rectangle((x - 12, iy - 70, x + 12, iy - 40), fill=K.GOLD)
                elif more and i == 1:
                    K.draw_magnifier(draw, x - 20, iy - 10, 0.7, K.BOTH_COLOR)
                    laddoo(draw, x - 20, iy - 10, 26)
                elif more and i == 2:
                    draw.rounded_rectangle((x - 70, iy - 40, x + 70, iy + 70), radius=12, fill=K.LEAF)
                    draw.arc((x - 40, iy - 90, x + 40, iy - 10), 180, 360, fill=K.DEV_DARK, width=8)
                    note(draw, x + 40, iy - 60, 110, 56, 10, NOTE_10)
                elif i == 0:
                    draw.ellipse((x - 90, iy + 30, x + 90, iy + 74), fill=K.DEV_DEEP)
                    marble(draw, x + 10, iy - 30 + 40 * K.clamp01(progress * 1.5), 26)
                elif i == 1:
                    draw.rounded_rectangle((x - 90, iy - 10, x + 10, iy + 40), radius=20, fill=K.SKIN)
                    for k in range(3):
                        marble(draw, x + 40 + k * 10, iy - 20 - k * 30 + 8 * math.sin(t * 8 + k), 18)
                else:
                    laddoo(draw, x, iy, 64)
                    for k in range(3):
                        draw.ellipse((x + 32 + k * 12 - 24, iy - 70 + k * 30 - 24, x + 32 + k * 12 + 24,
                                      iy - 70 + k * 30 + 24), fill=bg_col(brand))
                K.text_at(draw, lab, x, y0 + 270, font(44, bold=True), ink)
                K.pill(draw, x + 160, y0 - 18, "+" if more else "−", col, size=34)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                y = 680 + int((1 - a) * 20)
                undo_icon(draw, 640, y + 50, 40, coral)
                txt = "Undo: SUBTRACT" if more else "Undo: ADD back"
                K.pill(draw, 1010, y, txt, coral if more else sage, size=50)
            return True
        # double
        draw.rounded_rectangle((170, 270, 1050, 840), radius=36, fill=panel, outline=line, width=3)
        for k in range(2):
            laddoo(draw, 330 + k * 90, 420, 38)
        K.draw_arrow(draw, 480, 420, 680, 420, K.BOTH_COLOR, width=10, head=28)
        K.pill(draw, 580, 330, "double", K.BOTH_COLOR, size=32)
        for k in range(4):
            laddoo(draw, 760 + (k % 2) * 90, 380 + (k // 2) * 84, 38)
        a = K.ease_out_cubic(K.clamp01((progress - 0.15) * 2.5))
        back_arrow(810, 375, 520, 150, "halve", a=a, size=32)
        K.text_at(draw, "Undo double → halve", 610, 750, font(42, bold=True), coral)
        for i, (l, r_, col) in enumerate((("+ add", "− subtract", K.BOTH_COLOR), ("× 2 double", "½ halve", coral))):
            b = K.stagger(progress, i + 3, step=0.12, speed=4)
            if b <= 0:
                continue
            y = 330 + i * 230 + int((1 - b) * 20)
            draw.rounded_rectangle((1110, y, 1780, y + 170), radius=40, fill=sage_soft, outline=sage, width=4)
            K.text_at(draw, "undo each other", 1445, y + 16, font(30, bold=True), muted)
            K.text_at(draw, l, 1260, y + 70, font(46, bold=True), col)
            K.text_at(draw, "↔", 1445, y + 64, font(54, bold=True), sage)
            K.text_at(draw, r_, 1630, y + 70, font(46, bold=True), col)
        return True

    # ---- try it ---------------------------------------------------------------------------
    if visual == "c18-try":
        riya = focus.startswith("riya")
        ans = focus.endswith("_ans")
        xs = [330, 1000]
        y = 420
        if riya:
            num_box(xs[0], y, 240, 190, "30" if ans else "?", "found" if ans else "unknown", size=96)
            fwd_arrow(xs[0] + 140, xs[1] - 140, y, "+20", col=K.BOTH_COLOR, size=42)
            num_box(xs[1], y, 240, 190, "50", "known", size=96)
            if not ans:
                girl(draw, 1510, 440, 1.15, RIYA, t)
                K.text_at(draw, "Riya", 1510, 620, font(36, bold=True), RIYA)
                note(draw, 1500, 750, 220, 110, 20, NOTE_20)
                K.text_at(draw, "from Mum", 1500, 820, font(30, bold=True), muted)
                K.draw_stopwatch(draw, 665, 700, 60, progress, brand)
                K.text_at(draw, "How much before?", 665, 236, font(46, bold=True), ink)
            else:
                back_arrow(xs[1], xs[0], 530, 170, "−20", a=K.ease_out_cubic(K.clamp01(progress * 2)), size=42)
                eq = [("50 − 20 = 30", coral), ("Check: 30 + 20 = 50", sage)]
                for i, (txt, col) in enumerate(eq):
                    a = K.stagger(progress, i + 2, step=0.14, speed=4)
                    if a > 0:
                        K.text_at(draw, txt, 1490, 330 + i * 120 + int((1 - a) * 20), font(56, bold=True), col)
                a = K.stagger(progress, 4, step=0.14, speed=4)
                if a > 0:
                    note(draw, 1390, 680, 200, 100, 20, NOTE_20)
                    note(draw, 1610, 680, 200, 100, 10, NOTE_10)
                    K.text_at(draw, "Riya had 30 rupees", 1500, 760, font(40, bold=True), ink)
                K.text_at(draw, "Got more → subtract", 665, 236, font(46, bold=True), K.BOTH_COLOR)
            return True
        num_box(xs[0], y, 240, 190, "15" if ans else "?", "found" if ans else "unknown", size=96)
        fwd_arrow(xs[0] + 140, xs[1] - 140, y, "−5", col=K.ROAD, size=42)
        num_box(xs[1], y, 240, 190, "10", "known", size=96)
        if not ans:
            boy(draw, 1400, 440, 1.0, K.ROAD, t)
            girl(draw, 1700, 470, 0.85, ZOYA, t + 0.3)
            K.text_at(draw, "Arjun", 1400, 600, font(34, bold=True), K.ROAD)
            K.text_at(draw, "sister", 1700, 600, font(34, bold=True), ZOYA)
            for k in range(5):
                a = K.ease_in_out(K.clamp01((progress - k * 0.08) * 2.4))
                x = K.lerp(1470, 1640, a) + (k - 2) * 8
                yy = 700 - 120 * math.sin(a * math.pi) + (k % 2) * 30
                marble(draw, x, yy, 20)
            K.draw_stopwatch(draw, 665, 700, 60, progress, brand)
            K.text_at(draw, "How many at first?", 665, 236, font(46, bold=True), ink)
        else:
            back_arrow(xs[1], xs[0], 530, 170, "+5", col=sage, a=K.ease_out_cubic(K.clamp01(progress * 2)), size=42)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                K.text_at(draw, "10 + 5 = 15", 1490, 300 + int((1 - a) * 20), font(64, bold=True), sage)
            for k in range(15):
                b = K.stagger(progress, 3 + k * 0.4, step=0.08, speed=6)
                if b <= 0:
                    continue
                r_, c_ = divmod(k, 5)
                col = MARBLE if k < 10 else K.LEAF
                marble(draw, 1300 + c_ * 92, 470 + r_ * 92, 30 * b + 1, col)
            if K.stagger(progress, 9, step=0.08, speed=6) > 0:
                K.text_at(draw, "10 kept + 5 given", 1490, 760, font(38, bold=True), muted)
            K.text_at(draw, "Gave away → add back", 665, 236, font(46, bold=True), sage)
        return True

    # ---- spot the mistake -----------------------------------------------------------------
    if visual == "c18-trap":
        if focus == "intro":
            K.shadow_card(draw, (420, 280 + lift, w - 420, 800 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "DETECTIVE GAME", cx, 360 + lift, font(40, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "Spot the mistake!", cx, 430 + lift, font(84, bold=True), ink)
            K.draw_magnifier(draw, cx - 240, 650 + lift, 0.9, coral)
            K.draw_cross(draw, cx + 60, 650 + lift, 50, K.DANGER)
            K.draw_check(draw, cx + 240, 650 + lift, 50, sage)
            return True
        ans = focus == "answer"
        boy(draw, 300, 470, 1.15, DEV, t)
        K.text_at(draw, "Dev", 300, 660, font(36, bold=True), DEV)
        K.draw_bubble(draw, (460, 240, 1300, 400), brand, "To undo \"gave away 3\", subtract 3!", tail="left", size=40)
        chips = [("− 3", K.DANGER), ("+ 3", sage)]
        if not ans:
            draw.rounded_rectangle((520, 500, 1300, 800), radius=36, fill=panel, outline=line, width=3)
            K.text_at(draw, "Gave away 3 → undo with…", 910, 530, font(42, bold=True), ink)
            K.text_at(draw, "− 3 ?", 910, 620, font(100, bold=True), muted)
            question_marks([(1480, 400), (1700, 560)], size=90)
            K.draw_stopwatch(draw, 1600, 760, 56, progress, brand)
            return True
        K.draw_cross(draw, 1300, 250, 34, K.DANGER)
        draw.rounded_rectangle((460, 470, 1800, 850), radius=36, fill=panel, outline=line, width=3)
        K.text_at(draw, "Example: had 10, gave away 3 → 7", 1130, 500, font(40, bold=True), muted)
        for i, (txt, res, ok) in enumerate((("7 + 3 =", "10", True), ("7 − 3 =", "4", False))):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 590 + i * 130 + int((1 - a) * 20)
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((560, y, 1700, y + 110), radius=55, fill=sage_soft if ok else (253, 232, 230))
            draw.text((620, y + 22), txt, font=font(56, bold=True), fill=col)
            draw.text((900, y + 22), res, font=font(56, bold=True), fill=col)
            sub = "back to 10. Add it back!" if ok else "even smaller!"
            draw.text((1020, y + 34), sub, font=font(40, bold=True), fill=ink)
            (K.draw_check if ok else K.draw_cross)(draw, 1640, y + 55, 30, col)
        return True

    # ---- two steps -------------------------------------------------------------------------
    if visual == "c18-two":
        xs = [300, 960, 1620]
        y = 430
        if focus == "socks":
            for i, (title, order, col, soft) in enumerate((("Putting ON", ["socks", "shoes"], sage, sage_soft),
                                                         ("Taking OFF", ["shoes", "socks"], coral, coral_soft))):
                a = K.stagger(progress, i * 2, step=0.18, speed=4)
                if a <= 0:
                    continue
                x0 = 150 + i * 840
                y0 = 250 + int((1 - a) * 30)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 780 + 10, y0 + 590 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 780, y0 + 590), radius=40, fill=soft, outline=col, width=5)
                K.pill(draw, x0 + 390, y0 + 26, title, col, size=40)
                for k, item in enumerate(order):
                    b = K.stagger(progress, i * 2 + k + 1, step=0.18, speed=4)
                    if b <= 0:
                        continue
                    ix = x0 + 210 + k * 360
                    iy = y0 + 400
                    draw.ellipse((ix - 40, y0 + 130, ix + 40, y0 + 210), fill=col)
                    K.text_at(draw, str(k + 1), ix, y0 + 142, font(52, bold=True), (255, 255, 255))
                    sock(draw, ix - 30, iy, 1.0)
                    if item == "shoes":
                        shoe(draw, ix - 30, iy, 1.0)
                    if i == 1 and item == "shoes":
                        K.draw_arrow(draw, ix + 20, iy - 100, ix + 110, iy - 160, coral, width=8, head=22)
                    K.text_at(draw, item, ix + 20, iy + 40, font(40, bold=True), ink)
                    if k == 0:
                        K.draw_arrow(draw, ix + 120, y0 + 170, ix + 240, y0 + 170, col, width=8, head=22)
            return True
        solve = focus == "solve"
        check = focus == "check"
        start_txt = "8" if check else "?"
        mid_txt = "14" if (check or (solve and progress > 0.35)) else ""
        if solve and progress > 0.75:
            start_txt = "8"
        num_box(xs[0], y, 240, 190, start_txt, "found" if start_txt == "8" else "unknown", size=96)
        num_box(xs[1], y, 240, 190, mid_txt, "found" if mid_txt else "known", size=96)
        num_box(xs[2], y, 240, 190, "10", "known", size=96)
        fc = sage if check else K.BOTH_COLOR
        fwd_arrow(xs[0] + 140, xs[1] - 140, y, "got 6", col=fc, size=36)
        fwd_arrow(xs[1] + 140, xs[2] - 140, y, "gave 4", col=sage if check else K.ROAD, size=36)
        K.text_at(draw, "start", xs[0], 286, font(32, bold=True), muted)
        K.text_at(draw, "now", xs[2], 286, font(32, bold=True), muted)
        if focus == "story":
            for k in range(3):
                card(draw, 630 + k * 26, 660, 0.9, rot=-0.2 + k * 0.2)
            K.text_at(draw, "+6 cards", 660, 770, font(38, bold=True), K.BOTH_COLOR)
            for k in range(2):
                card(draw, 1270 + k * 30, 660, 0.9, rot=0.15 - k * 0.3, col=coral)
            K.text_at(draw, "−4 cards", 1290, 770, font(38, bold=True), K.ROAD)
            K.pill(draw, cx, 236, "A two-step story", K.BOTH_COLOR, size=36)
            question_marks([(xs[0] + 150, 300)], size=60)
            return True
        if solve:
            a1 = K.ease_out_cubic(K.clamp01(progress * 3))
            a2 = K.ease_out_cubic(K.clamp01((progress - 0.4) * 3))
            back_arrow(xs[2], xs[1], 540, 180, "1st: +4", a=a1, size=34)
            back_arrow(xs[1], xs[0], 540, 180, "2nd: −6", a=a2, size=34)
            if progress > 0.3:
                K.text_at(draw, "10 + 4 = 14", 1290, 236, font(48, bold=True), coral)
            if progress > 0.7:
                K.text_at(draw, "14 − 6 = 8", 630, 236, font(48, bold=True), coral)
            return True
        K.text_at(draw, "8 + 6 = 14", 630, 640 + lift, font(64, bold=True), sage)
        K.text_at(draw, "14 − 4 = 10", 1290, 640 + lift, font(64, bold=True), sage)
        K.draw_check(draw, xs[2] + 120, y - 95, 30, sage)
        K.pill(draw, cx, 236, "Kabir started with 8 cards", sage, size=36)
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            K.text_at(draw, "Perfect!", cx, 760, font(56, bold=True), coral)
        return True

    # ---- number puzzle ---------------------------------------------------------------------
    if visual == "c18-puzzle":
        xs = [330, 960, 1590]
        y = 470

        def machine(x, lab, col):
            draw.polygon([(x - 70, y - 120), (x + 70, y - 120), (x + 40, y - 80), (x - 40, y - 80)], fill=K.DEV_MID)
            draw.rounded_rectangle((x - 110 + 8, y - 80 + 10, x + 110 + 8, y + 80 + 10), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((x - 110, y - 80, x + 110, y + 80), radius=24, fill=col)
            for k in range(2):
                gx = x - 70 + k * 140
                draw.ellipse((gx - 16, y + 40, gx + 16, y + 72), fill=(255, 255, 255))
            K.text_at(draw, lab, x, y - 44, font(54, bold=True), (255, 255, 255))

        ask = focus == "ask"
        start = "8" if focus in ("sub", "check") and (focus == "check" or progress > 0.45) else "?"
        mid = "15" if focus in ("sub", "check") or (focus == "halve" and progress > 0.45) else ""
        num_box(xs[0] - 150, y, 180, 180, start, "found" if start == "8" else "unknown", size=84, round_=True)
        machine(xs[0] + 150, "+7", K.BOTH_COLOR)
        num_box(xs[1], y, 180, 180, mid, "found" if mid else "known", size=84, round_=True)
        machine(xs[1] + 300, "×2", K.ROAD)
        num_box(xs[2] + 130, y, 180, 180, "30", "known", size=84, round_=True)
        for xa, xb in ((xs[0] - 50, xs[0] + 34), (xs[0] + 266, xs[1] - 96), (xs[1] + 96, xs[1] + 184),
                       (xs[1] + 416, xs[2] + 34)):
            K.draw_arrow(draw, xa, y, xb, y, sage if focus == "check" else FWD, width=8, head=22)
        if ask:
            K.draw_mascot(draw, 250, 750, 70, sage, panel, bounce)
            K.draw_bubble(draw, (360, 650, 1100, 780), brand, "What was my number?", tail="left", size=40)
            K.draw_stopwatch(draw, 1400, 730, 56, progress, brand)
            question_marks([(xs[0] - 150, 260)], size=70)
            return True
        if focus in ("halve", "sub"):
            a1 = K.ease_out_cubic(K.clamp01(progress * 2.5)) if focus == "halve" else 1.0
            back_arrow(xs[2] + 130, xs[1], 570, 170, "half", a=a1, size=36)
            K.text_at(draw, "30 ÷ 2 = 15", 1380, 760, font(52, bold=True), coral)
        if focus == "sub":
            a2 = K.ease_out_cubic(K.clamp01(progress * 2.5))
            back_arrow(xs[1], xs[0] - 150, 570, 170, "−7", a=a2, size=36)
            if progress > 0.35:
                K.text_at(draw, "15 − 7 = 8", 560, 760, font(52, bold=True), coral)
        if focus == "halve":
            K.pill(draw, cx, 236, "Last step first: undo the double", coral, size=34)
        elif focus == "sub":
            K.pill(draw, cx, 236, "My number was 8!", sage, size=36)
        else:
            K.pill(draw, cx, 236, "Check going forwards", sage, size=36)
            K.text_at(draw, "8 + 7 = 15", 560, 680 + lift, font(56, bold=True), sage)
            K.text_at(draw, "double 15 = 30", 1380, 680 + lift, font(56, bold=True), sage)
            K.draw_check(draw, xs[2] + 230, y - 90, 30, sage)
        return True

    # ---- undo button -----------------------------------------------------------------------
    if visual == "c18-undo":
        def undo_button(x, y, pressed):
            dy = 8 if pressed else 0
            draw.rounded_rectangle((x - 150 + 8, y - 60 + 14, x + 150 + 8, y + 60 + 14), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x - 150, y - 60 + dy, x + 150, y + 60 + dy), radius=30,
                                   fill=coral if pressed else panel, outline=coral, width=6)
            col = (255, 255, 255) if pressed else coral
            undo_icon(draw, x - 80, y + dy, 30, col)
            K.text_at(draw, "Undo", x + 30, y - 26 + dy, font(48, bold=True), col)

        if focus == "button":
            draw.ellipse((cx - 300, 520 - 260, cx + 300, 520 + 260), fill=coral_soft)
            undo_button(cx, 520, int(t * 4) % 2 == 1)
            K.draw_device(draw, "laptop", 420, 560, 0.9, brand, t=t)
            undo_icon(draw, 420, 500, 46, coral)
            K.draw_device(draw, "laptop", 1500, 560, 0.9, brand, t=t)
            K.text_at(draw, "</>", 1500, 470, font(64, bold=True), K.BOT)
            K.text_at(draw, "Apps", 420, 680, font(40, bold=True), ink)
            K.text_at(draw, "Code", 1500, 680, font(40, bold=True), ink)
            K.text_at(draw, "Reverses your last action", cx, 790, font(44, bold=True), muted)
            return True
        draw.rounded_rectangle((130 + 10, 250 + 12, 1150 + 10, 860 + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((130, 250, 1150, 860), radius=30, fill=K.DEV_DARK)
        draw.rounded_rectangle((160, 280, 1120, 830), radius=18, fill=(255, 255, 255))
        steps = ["Tree", "Sun", "Scribble"]
        again = focus == "again"
        gone_scribble = again or progress > 0.62
        gone_sun = again and progress > 0.35
        n_drawn = 3 if again else min(3, int(progress * 5) + 1)
        if n_drawn >= 1:
            tree(draw, 420, 760, 1.4)
        if n_drawn >= 2 and not gone_sun:
            sun(draw, 880, 420, 70, t)
        if n_drawn >= 3 and not gone_scribble:
            scribble(draw, 300, 520, 1000, 640)
        draw.rounded_rectangle((1240, 250, 1790, 640), radius=30, fill=panel, outline=line, width=3)
        K.text_at(draw, "Your steps", 1515, 272, font(38, bold=True), muted)
        for i, lab in enumerate(steps):
            if i >= n_drawn:
                continue
            yy = 340 + i * 96
            undone = (i == 2 and gone_scribble) or (i == 1 and gone_sun)
            draw.rounded_rectangle((1280, yy, 1750, yy + 80), radius=24,
                                   fill=(246, 243, 238) if undone else sage_soft)
            K.pill(draw, 0, yy + 16, str(i + 1), muted if undone else sage, size=26, left=1300)
            draw.text((1380, yy + 18), lab, font=font(40, bold=True), fill=muted if undone else ink)
            if undone:
                draw.line((1370, yy + 42, 1600, yy + 42), fill=K.DANGER, width=6)
        pressed = (not again and 0.55 < progress < 0.75) or (again and 0.25 < progress < 0.45)
        undo_button(1515, 750, pressed)
        if again and progress > 0.5:
            K.pill(draw, 640, 300, "Last step first!", sage, size=36)
        elif not again and gone_scribble:
            K.pill(draw, 560, 300, "Scribble gone!", coral, size=36)
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "c18-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Work backwards!", cx, 450 + lift, font(64, bold=True), ink)
            for k in range(5):
                sticker(draw, cx - 240 + k * 120, 640 + lift, 44)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "9 stickers after losing 3.", 695, 256, font(46, bold=True), coral)
        K.text_at(draw, "How many at the start?", 695, 316, font(46, bold=True), ink)
        bx = [330, 1060]
        num_box(bx[0], 500, 220, 170, "12" if ans else "?", "found" if ans else "unknown", size=84)
        fwd_arrow(bx[0] + 130, bx[1] - 130, 500, "lost 3", col=K.ROAD, size=34)
        num_box(bx[1], 500, 220, 170, "9", "known", size=84)
        if ans:
            back_arrow(bx[1], bx[0], 595, 110, "+3", col=sage, a=K.ease_out_cubic(K.clamp01(progress * 2.5)), size=34)
            a = K.stagger(progress, 3, step=0.1, speed=4)
            if a > 0:
                draw.text((190, 760 + int((1 - a) * 10)), "9 + 3 = 12.  Check: 12 − 3 = 9", fill=ink,
                          font=font(44, bold=True))
        else:
            for i in range(2):
                draw.line((180, 720 + i * 80, 1210, 720 + i * 80), fill=(220, 210, 232), width=3)
        girl(draw, 1560, 500, 1.3, MINA, t)
        K.text_at(draw, "Mina", 1560, 700, font(36, bold=True), MINA)
        for k in range(3):
            sticker(draw, 1420 + k * 140, 300 + 8 * math.sin(t * 6 + k), 36)
        if ans:
            K.draw_heart(draw, 1740, 420 + bounce, 30, coral)
            star_spots([(1380, 760), (1760, 760)])
        else:
            K.draw_stopwatch(draw, 1560, 810, 44, progress, brand)
        return True

    # ---- recap -----------------------------------------------------------------------------
    if visual == "c18-recap":
        recap = [(("Know the end?", "Work backwards"), coral, "back"), (("Add ↔ subtract", "Double ↔ halve"), K.BOTH_COLOR, "flip"),
                 (("Undo the last", "step first"), sage, "last"), (("Check going", "forwards"), K.ROAD, "check")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, font(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "back":
                    draw.rounded_rectangle((ix - 150, iy - 90, ix - 70, iy - 10), radius=16, fill=coral_soft,
                                           outline=coral, width=4)
                    K.text_at(draw, "?", ix - 110, iy - 86, font(52, bold=True), coral)
                    draw.rounded_rectangle((ix + 70, iy - 90, ix + 150, iy - 10), radius=16, fill=panel,
                                           outline=line, width=4)
                    K.text_at(draw, "12", ix + 110, iy - 78, font(40, bold=True), ink)
                    K.draw_curve(draw, (ix + 100, iy + 10), (ix, iy + 110), (ix - 90, iy + 10), coral, width=8)
                    draw.polygon([(ix - 110, iy - 4), (ix - 70, iy + 6), (ix - 100, iy + 36)], fill=coral)
                elif kind == "flip":
                    K.text_at(draw, "+  −", ix, iy - 110, font(80, bold=True), K.BOTH_COLOR)
                    K.text_at(draw, "×2  ½", ix, iy - 10, font(70, bold=True), coral)
                elif kind == "last":
                    sock(draw, ix - 100, iy + 80, 0.8)
                    shoe(draw, ix + 40, iy + 80, 0.8)
                    K.draw_arrow(draw, ix + 90, iy - 30, ix + 150, iy - 110, coral, width=8, head=20)
                else:
                    K.draw_arrow(draw, ix - 150, iy - 20, ix + 80, iy - 20, sage, width=12, head=30)
                    K.draw_check(draw, ix + 130, iy - 20, 40, sage)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            boy(draw, cx + 300, 420, 1.2, KABIR, t, cap=CAP)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Story rewinder", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False


def bg_col(brand):
    return K.hex_rgb(brand["panel"])
