"""B17 · AI and Privacy — visuals."""
import math

import build as K

SKY = (214, 236, 250)
WALL = (250, 232, 206)
WALL_DARK = (226, 196, 160)
GROUND = (214, 204, 186)
SIGN = (24, 128, 84)
SAMOSA = (226, 160, 70)
SAMOSA_DARK = (176, 110, 40)
MAP_BG = (234, 241, 226)
MAP_ROAD = (255, 255, 255)
PARK = (176, 216, 160)
RIVER = (160, 204, 240)
DIARY = (214, 84, 96)
DIARY_DARK = (168, 56, 70)
OFF = (204, 204, 210)
SCREEN = (250, 250, 252)
APP = (123, 97, 214)


def S_(s):
    return lambda v: v * s


def sparkle(draw, cx, cy, r, col):
    k = r * 0.28
    draw.polygon([(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k), (cx, cy + r), (cx - k, cy + k),
                  (cx - r, cy), (cx - k, cy - k)], fill=col)


def aarav(draw, cx, cy, s, t=0.0):
    """Aarav: the kit's kid with a blue cricket cap. cy = face centre."""
    K.draw_person(draw, cx, cy, s, "kid", t)
    y = cy + 6 * s * math.sin(t * math.pi * 4)
    r = 64 * s
    draw.chord((cx - r * 1.05, y - r * 1.2, cx + r * 1.05, y - r * 0.02), 180, 360, fill=K.BOT)
    draw.rounded_rectangle((cx - r * 0.2, y - r * 0.7, cx + r * 1.5, y - r * 0.5), radius=r * 0.1, fill=K.BOT_DARK)
    draw.ellipse((cx - r * 0.12, y - r * 1.3, cx + r * 0.12, y - r * 1.06), fill=K.BOT_DARK)


def tablet(draw, box, screen=SCREEN):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=40, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=40, fill=K.DEV_DARK)
    sb = (x0 + 22, y0 + 22, x1 - 22, y1 - 22)
    draw.rounded_rectangle(sb, radius=24, fill=screen)
    return sb


def app_bar(draw, sb, title, col=APP, size=34):
    x0, y0, x1, _ = sb
    draw.rounded_rectangle((x0, y0, x1, y0 + 80), radius=24, fill=col)
    draw.rectangle((x0, y0 + 40, x1, y0 + 80), fill=col)
    sparkle(draw, x0 + 46, y0 + 40, 22, (255, 255, 255))
    draw.text((x0 + 82, y0 + 40 - size * 0.62), title, fill=(255, 255, 255), font=K.load_font(size, bold=True))


def bubble(draw, x, y, text, side, maxw, fill, fg, size=32, out=None):
    """side 'l': x is the left edge; side 'r': x is the right edge. Returns the box."""
    f = K.load_font(size, bold=True)
    lines = K.wrap_text(text, f, maxw - 44)
    tw = max(draw.textbbox((0, 0), ln, font=f)[2] for ln in lines)
    lh = int(size * 1.3)
    bw, bh = tw + 44, len(lines) * lh + 26
    bx = x if side == "l" else x - bw
    draw.rounded_rectangle((bx, y, bx + bw, y + bh), radius=22, fill=fill, outline=out, width=4 if out else 0)
    for j, ln in enumerate(lines):
        draw.text((bx + 22, y + 12 + j * lh), ln, fill=fg, font=f)
    return (bx, y, bx + bw, y + bh)


def phone(draw, cx, cy, s, screen=SCREEN):
    S = S_(s)
    box = (cx - S(110), cy - S(200), cx + S(110), cy + S(200))
    draw.rounded_rectangle((box[0] + S(8), box[1] + S(10), box[2] + S(8), box[3] + S(10)), radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=S(34), fill=K.DEV_DARK)
    sb = (box[0] + S(14), box[1] + S(34), box[2] - S(14), box[3] - S(30))
    draw.rounded_rectangle(sb, radius=S(16), fill=screen)
    draw.rounded_rectangle((cx - S(30), box[1] + S(14), cx + S(30), box[1] + S(22)), radius=S(4), fill=K.DEV_MID)
    return sb


def phone_digits(draw, cx, cy, s, col):
    sb = phone(draw, cx, cy, s)
    for r in range(3):
        for c in range(3):
            x = sb[0] + (sb[2] - sb[0]) * (0.22 + 0.28 * c)
            y = sb[1] + (sb[3] - sb[1]) * (0.3 + 0.22 * r)
            rr = 20 * s
            draw.ellipse((x - rr, y - rr, x + rr, y + rr), fill=col)


def crayons(draw, cx, by, s, t):
    S = S_(s)
    cols = [K.DANGER, K.CORAL, K.GOLD, K.LEAF, K.ROAD, K.BOTH_COLOR, (206, 110, 160), (120, 80, 50)]
    n = len(cols)
    cw = S(40)
    for i, c in enumerate(cols):
        x = cx + (i - (n - 1) / 2) * cw * 1.2
        top = by - S(230) + S(26) * (i % 3) + S(6) * math.sin(t * 8 + i)
        draw.rectangle((x - cw / 2, top + S(34), x + cw / 2, by), fill=c)
        draw.polygon([(x - cw / 2, top + S(34)), (x + cw / 2, top + S(34)), (x, top)], fill=c)
    bw = n * cw * 1.2 + S(40)
    draw.rounded_rectangle((cx - bw / 2 + S(8), by - S(110) + S(10), cx + bw / 2 + S(8), by + S(40) + S(10)),
                           radius=S(16), fill=K.SHADOW)
    draw.rounded_rectangle((cx - bw / 2, by - S(110), cx + bw / 2, by + S(40)), radius=S(16), fill=K.GOLD,
                           outline=K.DEV_DARK, width=max(2, int(S(5))))
    K.text_at(draw, "CRAYONS", cx, by - S(66), K.load_font(max(10, int(S(44))), bold=True), K.DEV_DARK)


def diary(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.rounded_rectangle((cx - S(170) + S(10), cy - S(220) + S(12), cx + S(170) + S(10), cy + S(220) + S(12)),
                           radius=S(26), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(170), cy - S(220), cx + S(170), cy + S(220)), radius=S(26), fill=DIARY)
    draw.rounded_rectangle((cx - S(170), cy - S(220), cx - S(120), cy + S(220)), radius=S(20), fill=DIARY_DARK)
    for k in range(3):
        draw.line((cx + S(150) + k * S(6), cy - S(200), cx + S(150) + k * S(6), cy + S(200)), fill=(255, 246, 236),
                  width=max(1, int(S(3))))
    draw.rounded_rectangle((cx - S(70), cy - S(150), cx + S(110), cy - S(80)), radius=S(14), fill=(255, 246, 236))
    K.text_at(draw, "MY DIARY", cx + S(20), cy - S(140), K.load_font(max(10, int(S(36))), bold=True), DIARY_DARK)
    draw.rectangle((cx + S(110), cy - S(30), cx + S(190), cy + S(30)), fill=DIARY_DARK)
    K.draw_padlock(draw, cx + S(190), cy + S(10), s * 0.62, K.GOLD, keyhole=K.DEV_DARK)
    K.draw_heart(draw, cx - S(10), cy + S(90), S(40), (255, 246, 236))


def samosa(draw, cx, cy, s):
    S = S_(s)
    pts = [(cx, cy - S(62)), (cx + S(70), cy + S(46)), (cx - S(70), cy + S(46))]
    draw.polygon([(x + S(6), y + S(8)) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=SAMOSA, outline=SAMOSA_DARK, width=max(2, int(S(5))))
    draw.line((cx, cy - S(50), cx - S(20), cy + S(40)), fill=SAMOSA_DARK, width=max(2, int(S(4))))
    for k in range(5):
        x = cx - S(54) + k * S(27)
        draw.line((x, cy + S(46), x + S(8), cy + S(34)), fill=SAMOSA_DARK, width=max(1, int(S(3))))


def cloud(draw, cx, cy, s, col):
    S = S_(s)
    for dx, dy, r in ((-70, 10, 60), (0, -20, 80), (75, 10, 60)):
        draw.ellipse((cx + S(dx) - S(r) + S(8), cy + S(dy) - S(r) + S(10), cx + S(dx) + S(r) + S(8),
                      cy + S(dy) + S(r) + S(10)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(130) + S(8), cy + S(10), cx + S(130) + S(8), cy + S(70) + S(10)), radius=S(30),
                           fill=K.SHADOW)
    for dx, dy, r in ((-70, 10, 60), (0, -20, 80), (75, 10, 60)):
        draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r), cx + S(dx) + S(r), cy + S(dy) + S(r)), fill=col)
    draw.rounded_rectangle((cx - S(130), cy + S(10), cx + S(130), cy + S(70)), radius=S(30), fill=col)


def map_card(draw, box, t, pin_col=K.DANGER, pin=True, pulse_on=True):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=MAP_BG, outline=K.DEV_DARK, width=4)
    draw.ellipse((x0 + w * 0.06, y0 + h * 0.08, x0 + w * 0.36, y0 + h * 0.4), fill=PARK)
    K.draw_curve(draw, (x0 + w * 0.62, y0 + 6), (x0 + w * 0.84, y0 + h * 0.5), (x1 - 6, y0 + h * 0.62), RIVER,
                 width=max(6, int(h * 0.07)))
    rw = max(6, int(h * 0.06))
    draw.line((x0 + 4, y0 + h * 0.56, x1 - 4, y0 + h * 0.56), fill=MAP_ROAD, width=rw)
    draw.line((x0 + w * 0.46, y0 + 4, x0 + w * 0.46, y1 - 4), fill=MAP_ROAD, width=rw)
    draw.line((x0 + w * 0.1, y1 - 4, x0 + w * 0.7, y0 + h * 0.3), fill=MAP_ROAD, width=max(4, rw // 2))
    for bx, by in ((0.12, 0.66), (0.26, 0.74), (0.58, 0.68), (0.74, 0.8), (0.56, 0.14)):
        draw.rounded_rectangle((x0 + w * bx, y0 + h * by, x0 + w * bx + w * 0.09, y0 + h * by + h * 0.12),
                               radius=6, fill=(214, 220, 206))
    if pin:
        px, py = x0 + w * 0.46, y0 + h * 0.56
        if pulse_on:
            for k in range(2):
                r = (h * 0.12) + ((t * 2 + k * 0.5) % 1) * h * 0.22
                draw.ellipse((px - r, py - r * 0.5, px + r, py + r * 0.5), outline=pin_col, width=4)
        K.draw_map_pin(draw, px, py, h / 380, pin_col)


def house_front(draw, cx, by, s, num="12"):
    S = S_(s)
    draw.rectangle((cx - S(150) + S(8), by - S(220) + S(10), cx + S(150) + S(8), by + S(10)), fill=K.SHADOW)
    draw.rectangle((cx - S(150), by - S(220), cx + S(150), by), fill=WALL, outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.polygon([(cx - S(186), by - S(216)), (cx, by - S(330)), (cx + S(186), by - S(216))], fill=K.CORAL)
    draw.rectangle((cx - S(40), by - S(120), cx + S(40), by), fill=K.TERRACOTTA, outline=K.DEV_DARK,
                   width=max(2, int(S(4))))
    draw.rectangle((cx - S(124), by - S(180), cx - S(64), by - S(120)), fill=K.DEV_SCREEN, outline=K.DEV_DARK,
                   width=max(2, int(S(3))))
    draw.rounded_rectangle((cx + S(62), by - S(186), cx + S(132), by - S(126)), radius=S(8), fill=(255, 255, 255),
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    K.text_at(draw, num, cx + S(97), by - S(182), K.load_font(max(10, int(S(40))), bold=True), K.DEV_DARK)


def cat_face(draw, cx, cy, s):
    S = S_(s)
    col = (244, 170, 80)
    draw.polygon([(cx - S(70), cy - S(20)), (cx - S(60), cy - S(96)), (cx - S(16), cy - S(54))], fill=col)
    draw.polygon([(cx + S(70), cy - S(20)), (cx + S(60), cy - S(96)), (cx + S(16), cy - S(54))], fill=col)
    draw.ellipse((cx - S(80), cy - S(66), cx + S(80), cy + S(70)), fill=col)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(32) - S(10), cy - S(16), cx + sx * S(32) + S(10), cy + S(6)), fill=K.DEV_DEEP)
        for k in (-1, 1):
            draw.line((cx + sx * S(30), cy + S(28) + k * S(8), cx + sx * S(96), cy + S(22) + k * S(16)),
                      fill=K.DEV_DARK, width=max(1, int(S(3))))
    draw.polygon([(cx - S(10), cy + S(16)), (cx + S(10), cy + S(16)), (cx, cy + S(28))], fill=(214, 84, 96))


def toggle(draw, x, y, on, col, s=1.0):
    w, h = 124 * s, 66 * s
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h / 2, fill=col if on else OFF)
    kx = x + w - h / 2 if on else x + h / 2
    r = h / 2 - 7 * s
    draw.ellipse((kx - r, y + h / 2 - r, kx + r, y + h / 2 + r), fill=(255, 255, 255))


def photo_frame(draw, box):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=14, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=14, fill=(255, 255, 255), outline=K.STEEL, width=3)
    return (x0 + 22, y0 + 22, x1 - 22, y1 - 70)


def cycle(draw, cx, cy, s, col=K.ROAD):
    S = S_(s)
    wr = S(56)
    lw = max(3, int(S(10)))
    for wx in (cx - S(84), cx + S(84)):
        draw.ellipse((wx - wr, cy - wr, wx + wr, cy + wr), outline=K.DEV_DARK, width=max(3, int(S(9))))
        draw.ellipse((wx - S(8), cy - S(8), wx + S(8), cy + S(8)), fill=K.DEV_DARK)
    pts = [(cx - S(84), cy), (cx - S(10), cy), (cx + S(40), cy - S(70)), (cx - S(40), cy - S(70)), (cx - S(10), cy)]
    draw.line(pts, fill=col, width=lw, joint="curve")
    draw.line((cx + S(40), cy - S(70), cx + S(84), cy), fill=col, width=lw)
    draw.line((cx - S(84), cy, cx - S(40), cy - S(70)), fill=col, width=lw)
    draw.line((cx + S(40), cy - S(70), cx + S(30), cy - S(100)), fill=K.DEV_DARK, width=lw)
    draw.line((cx + S(14), cy - S(104), cx + S(54), cy - S(100)), fill=K.DEV_DARK, width=lw)
    draw.rounded_rectangle((cx - S(64), cy - S(92), cx - S(20), cy - S(78)), radius=S(6), fill=K.DEV_DARK)


def badge(draw, cx, cy, s):
    S = S_(s)
    shape = [(0, -40), (34, -28), (30, 8), (0, 42), (-30, 8), (-34, -28)]
    draw.polygon([(cx + S(x), cy + S(y)) for x, y in shape], fill=K.ROAD, outline=(255, 255, 255))
    K.text_at(draw, "GV", cx, cy - S(22), K.load_font(max(10, int(S(28))), bold=True), (255, 255, 255))


def cycle_photo(draw, box, t):
    """Aarav with his new cycle outside home. Returns hotspot centres (number plate, sign, badge)."""
    px0, py0, px1, py1 = photo_frame(draw, box)
    W, H = px1 - px0, py1 - py0
    draw.rectangle((px0, py0, px1, py1), fill=SKY)
    draw.ellipse((px1 - W * 0.32, py0 + H * 0.06, px1 - W * 0.22, py0 + H * 0.06 + W * 0.1), fill=K.GOLD)
    gy = py1 - H * 0.2
    draw.rectangle((px0, py0 + H * 0.22, px0 + W * 0.6, gy), fill=WALL)
    draw.rectangle((px0, py0 + H * 0.18, px0 + W * 0.62, py0 + H * 0.26), fill=K.CORAL)
    draw.rectangle((px0 + W * 0.06, py0 + H * 0.36, px0 + W * 0.2, py0 + H * 0.56), fill=K.DEV_SCREEN,
                   outline=K.DEV_DARK, width=3)
    gx = px0 + W * 0.3
    draw.rectangle((gx - W * 0.03, py0 + H * 0.3, gx + W * 0.03, gy), fill=WALL_DARK, outline=K.DEV_DARK, width=3)
    draw.rectangle((gx + W * 0.03, py0 + H * 0.44, gx + W * 0.24, gy), fill=K.STEEL)
    for k in range(6):
        bx = gx + W * 0.05 + k * W * 0.032
        draw.line((bx, py0 + H * 0.46, bx, gy - 4), fill=K.STEEL_DARK, width=4)
    plate = (gx - W * 0.055, py0 + H * 0.33, gx + W * 0.055, py0 + H * 0.44)
    draw.rounded_rectangle(plate, radius=6, fill=(255, 255, 255), outline=K.DEV_DARK, width=3)
    K.text_at(draw, "12", gx, plate[1] + 4, K.load_font(int(H * 0.075), bold=True), K.DEV_DARK)
    draw.rectangle((px0, gy, px1, py1), fill=GROUND)
    sx = px1 - W * 0.1
    draw.line((sx, gy + 6, sx, py0 + H * 0.24), fill=K.STEEL_DARK, width=8)
    sign = (sx - W * 0.1, py0 + H * 0.12, sx + W * 0.08, py0 + H * 0.26)
    draw.rounded_rectangle(sign, radius=8, fill=SIGN, outline=(255, 255, 255), width=3)
    f = K.load_font(int(H * 0.05), bold=True)
    K.text_at(draw, "LOTUS", (sign[0] + sign[2]) / 2, sign[1] + H * 0.012, f, (255, 255, 255))
    K.text_at(draw, "LANE", (sign[0] + sign[2]) / 2, sign[1] + H * 0.068, f, (255, 255, 255))
    ax, ay = px0 + W * 0.72, py0 + H * 0.5
    s = H / 560
    aarav(draw, ax, ay, s, 0)
    bx, by = ax + 40 * s, ay + 96 * s
    badge(draw, bx, by, s * 0.9)
    cycle(draw, px0 + W * 0.5, py1 - H * 0.14, s * 1.05)
    cap = (box[0] + box[2]) / 2
    K.text_at(draw, "My new cycle!", cap, box[3] - 58, K.load_font(32, bold=True), K.DEV_DARK)
    return [((plate[0] + plate[2]) / 2, (plate[1] + plate[3]) / 2, W * 0.08),
            ((sign[0] + sign[2]) / 2, (sign[1] + sign[3]) / 2, W * 0.1),
            (bx, by, W * 0.07)]


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
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(84 + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def chip(x, y, label, ok, size=34):
        col = sage if ok else K.DANGER
        f = font(size, bold=True)
        tw = draw.textbbox((0, 0), label, font=f)[2]
        bw = tw + 110
        draw.rounded_rectangle((x, y, x + bw, y + 74), radius=37, fill=sage_soft if ok else K.DANGER_SOFT,
                               outline=col, width=3)
        draw.text((x + 28, y + 37 - size * 0.62), label, fill=ink, font=f)
        (K.draw_check if ok else K.draw_cross)(draw, x + bw - 40, y + 37, 20, col)
        return x + bw

    def homework_chat(sb, n_me, flag=False, typed=1.0):
        app_bar(draw, sb, "Homework Helper")
        x0, y0, x1, y1 = sb
        maxw = int((x1 - x0) * 0.86)
        bubble(draw, x0 + 24, y0 + 104, "Hi! How can I help?", "l", maxw, lav_soft, ink, size=38)
        msgs = ["My name is Aarav Sharma", "I study at Green Valley School", "I live at 12 Lotus Lane"]
        y = y0 + 216
        for i, m in enumerate(msgs):
            a = K.clamp01(n_me - i)
            if a <= 0:
                continue
            bb = bubble(draw, x1 - 24, y + (1 - a) * 20, m, "r", maxw, coral, panel, size=38,
                        out=K.DANGER if flag else None)
            if flag:
                K.draw_red_flag(draw, bb[0] - 40, (bb[1] + bb[3]) / 2, 0.9)
            y = bb[3] + 24

    # ---- opening -----------------------------------------------------------
    if visual == "b17-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            aarav(draw, cx + 300, 470, 1.15, t)
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · FAIR AI", cx, 326 + lift, font(34, bold=True), sage)
            crayons(draw, cx - 300, 650 + lift, 1.0, t)
            lines = [("Many kinds", ink), ("of examples", ink), ("= fairer AI", sage)]
            for i, (txt, col) in enumerate(lines):
                a = K.stagger(progress, i + 1, step=0.14, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, cx + 330, 430 + i * 90 + lift + int((1 - a) * 24), font(60, bold=True), col)
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx + 330, 720 + lift + int((1 - a) * 20), "Chapter 1 done!", coral, size=34)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "AI and Privacy", cx, 360 + lift, font(86, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                sb = tablet(draw, (cx - 560, 580 + yy, cx - 220, 830 + yy))
                sparkle(draw, (sb[0] + sb[2]) / 2, (sb[1] + sb[3]) / 2, 60, APP)
                K.draw_shield(draw, cx, 710 + yy, 0.95, sage, mark="lock")
                diary(draw, cx + 400, 710 + yy, 0.48, t)
            return True
        # word
        for i, (syl, col) in enumerate((("Pri", coral), ("va", K.BOTH_COLOR), ("cy", sage))):
            a = K.stagger(progress, i, step=0.12, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 1) * 380
            y = 320 + int((1 - a) * 50)
            draw.rounded_rectangle((x - 170, y, x + 170, y + 200), radius=40, fill=panel, outline=col, width=6)
            K.text_at(draw, syl, x, y + 40, font(100, bold=True), col)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            question_marks([(cx - 700, 340), (cx + 700, 360)])
            K.text_at(draw, "What does it mean?", cx, 600, font(54, bold=True), muted)
            K.draw_padlock(draw, cx, 760, 0.55, K.GOLD, open_t=0.5 + 0.5 * math.sin(t * 6))
        return True

    # ---- Aarav and the homework helper --------------------------------------------
    if visual == "b17-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=blue_soft)
            aarav(draw, 560, 500, 1.6, t)
            draw.line((842, 330, 822, 450), fill=K.DEV_DARK, width=24)
            draw.polygon([(806, 440), (846, 446), (790, 790), (730, 778)], fill=(226, 190, 140), outline=(176, 128, 84))
            draw.line((812, 470, 768, 760), fill=(196, 156, 104), width=5)
            K.text_at(draw, "Meet", 1330, 290 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Aarav!", 1330, 360 + lift, font(124, bold=True), coral)
            K.pill(draw, 1330, 540, "9 years old · loves cricket", sage, size=34)
            nb = (1110, 640, 1550, 850)
            draw.rounded_rectangle((nb[0] + 8, nb[1] + 10, nb[2] + 8, nb[3] + 10), radius=18, fill=K.SHADOW)
            draw.rounded_rectangle(nb, radius=18, fill=(255, 250, 238), outline=K.DEV_DARK, width=4)
            draw.rectangle((nb[0], nb[1], nb[0] + 36, nb[3]), fill=K.ROAD)
            K.text_at(draw, "Science", 1350, 664, font(44, bold=True), K.ROAD)
            for k in range(2):
                draw.line((1170, 752 + k * 50, 1520, 752 + k * 50), fill=(220, 210, 232), width=3)
            question_marks([(1640, 650), (1700, 760)])
            return True
        if focus == "app":
            aarav(draw, 380, 480, 1.3, t)
            sb = tablet(draw, (820, 240, 1720, 840))
            app_bar(draw, sb, "Homework Helper")
            bubble(draw, sb[0] + 24, sb[1] + 104, "Hi! How can I help?", "l", 700, lav_soft, ink, size=36)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                y = 470 + int((1 - a) * 20)
                draw.rounded_rectangle((sb[0] + 40, y, sb[2] - 40, y + 230), radius=26, fill=blue_soft)
                labs = [("Type a question", coral), ("It explains!", sage)]
                for k, (lab, col) in enumerate(labs):
                    x = sb[0] + 210 + k * 420
                    K.text_at(draw, lab, x, y + 150, font(34, bold=True), col)
                k_x = sb[0] + 210
                draw.rounded_rectangle((k_x - 120, y + 40, k_x + 120, y + 130), radius=14, fill=K.DEV_KEY,
                                       outline=K.DEV_DARK, width=3)
                for r in range(2):
                    for c in range(6):
                        kx = k_x - 100 + c * 34
                        draw.rounded_rectangle((kx, y + 54 + r * 36, kx + 26, y + 80 + r * 36), radius=5,
                                               fill=(255, 255, 255))
                K.draw_arrow(draw, k_x + 140, y + 85, k_x + 270, y + 85, muted, width=8, head=22)
                sparkle(draw, sb[0] + 630, y + 85, 46 + 6 * pulse, APP)
            K.pill(draw, 380, 720, "Mum's tablet", K.BOTH_COLOR, size=34)
            K.draw_arrow(draw, 560, 750, 790, 650, K.BOTH_COLOR, width=8, head=24)
            return True
        if focus in ("typing", "ask"):
            ask = focus == "ask"
            aarav(draw, 360, 480, 1.25, t)
            sb = tablet(draw, (760, 230, 1760, 860))
            homework_chat(sb, 3.0 if ask else progress * 4.2 - 0.3, flag=ask)
            if ask:
                question_marks([(260, 260), (480, 230)])
                K.draw_stopwatch(draw, 360, 760, 56, progress, brand)
            else:
                for k in range(3):
                    if int(t * 10 + k) % 3 == 0:
                        K.draw_star(draw, 220 + k * 140, 280 + (k % 2) * 30, 22, K.GOLD, rot=t * 4)
                K.text_at(draw, "So excited!", 360, 720, font(40, bold=True), coral)
            return True
        # answer
        sb = tablet(draw, (180, 260, 1000, 820))
        app_bar(draw, sb, "Homework Helper")
        bubble(draw, sb[2] - 24, sb[1] + 120, "How do plants make food?", "r", 700, coral, panel, size=36)
        a = K.stagger(progress, 1, step=0.12, speed=4)
        if a > 0:
            K.draw_check(draw, (sb[0] + sb[2]) / 2, 600, 70 * a, sage)
            K.text_at(draw, "Just the question", (sb[0] + sb[2]) / 2, 690, font(40, bold=True), sage)
        K.text_at(draw, "Not needed:", 1430, 280, font(44, bold=True), muted)
        for i, lab in enumerate(("Full name", "School", "Where he lives")):
            a = K.stagger(progress, i + 2, step=0.12, speed=4)
            if a <= 0:
                continue
            y = 380 + i * 140 + int((1 - a) * 24)
            f = font(40, bold=True)
            tw = draw.textbbox((0, 0), lab, font=f)[2]
            x0 = 1430 - (tw + 130) / 2
            draw.rounded_rectangle((x0, y, x0 + tw + 130, y + 96), radius=48, fill=K.DANGER_SOFT, outline=K.DANGER,
                                   width=4)
            draw.text((x0 + 30, y + 24), lab, fill=ink, font=f)
            K.draw_cross(draw, x0 + tw + 84, y + 48, 26, K.DANGER)
        return True

    # ---- what privacy means ----------------------------------------------------------
    if visual == "b17-define":
        if focus == "name":
            draw.ellipse((480 - 280, 560 - 280, 480 + 280, 560 + 280), fill=coral_soft)
            diary(draw, 460, 560, 1.0, t)
            K.text_at(draw, "PRIVACY", 1300, 330 + lift, font(110, bold=True), coral)
            parts = [("Keeping some things", ink), ("about you safe,", ink), ("and to yourself", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i + 1, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1300, 490 + i * 84 + int((1 - a) * 24), font(56, bold=True), col)
            return True
        if focus == "meaning":
            ccx, ccy = 700, 585
            draw.ellipse((ccx - 300, ccy - 285, ccx + 300, ccy + 285), fill=sage_soft, outline=sage, width=6)
            aarav(draw, ccx, ccy - 60, 1.0, t)
            fam = [("mom", -200, 150), ("dad", 0, 210), ("nani", 200, 150)]
            for i, (kind, dx, dy) in enumerate(fam):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a > 0:
                    K.draw_person(draw, ccx + dx, ccy + dy - 80 + int((1 - a) * 20), 0.62, kind, t)
            K.draw_heart(draw, ccx, ccy - 230 + bounce, 34, coral)
            K.pill(draw, ccx, 230, "People you trust", sage, size=32)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.draw_person(draw, 1440, 470, 1.0, "mystery", t)
                K.draw_cross(draw, 1560, 380, 34, K.DANGER)
                K.text_at(draw, "Strangers?", 1440, 650, font(44, bold=True), K.DANGER)
                K.text_at(draw, "Keep it private", 1440, 720, font(40, bold=True), muted)
            return True
        # personal
        items = [("Full name", "tag"), ("School", "school"), ("Address", "house"), ("Phone number", "phone"),
                 ("Photos", "photo")]
        K.text_at(draw, "Personal info = things about YOU", cx, 236, font(48, bold=True), ink)
        for i, (lab, kind) in enumerate(items):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 2) * 340
            y = 340 + int((1 - a) * 40)
            K.shadow_card(draw, (x - 150, y, x + 150, y + 470), brand, radius=30)
            ix, iy = x, y + 200
            if kind == "tag":
                K.draw_name_tag(draw, ix, iy, 0.8, brand)
            elif kind == "school":
                K.draw_school(draw, ix, iy + 40, 0.62, brand)
            elif kind == "house":
                K.draw_house(draw, ix, iy + 20, 0.6, brand)
            elif kind == "phone":
                phone_digits(draw, ix, iy, 0.6, coral)
            else:
                fb = photo_frame(draw, (ix - 100, iy - 120, ix + 100, iy + 110))
                draw.rectangle(fb, fill=SKY)
                K.draw_face(draw, (fb[0] + fb[2]) / 2, fb[3] - 50, 40, "kid", 1.0)
            K.text_at(draw, lab, x, y + 390, font(34, bold=True), ink)
        return True

    # ---- what an AI helper needs -----------------------------------------------------
    if visual == "b17-need":
        if focus == "shop":
            K.draw_shop(draw, 470, 540, 1.15, brand, name="SAMOSAS")
            draw.rounded_rectangle((250 + 8, 760 + 10, 690 + 8, 800 + 10), radius=14, fill=K.SHADOW)
            draw.rounded_rectangle((250, 760, 690, 800), radius=14, fill=(214, 170, 120), outline=(176, 128, 84),
                                   width=4)
            for k in range(4):
                samosa(draw, 320 + k * 100, 726, 0.5)
            aarav(draw, 1000, 560, 1.0, t)
            bubble(draw, 1120, 270, "Two samosas, please!", "l", 640, sage_soft, ink, size=40, out=sage)
            K.draw_check(draw, 1720, 310, 28, sage)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                bb = bubble(draw, 1120, 470 + int((1 - a) * 20), "Your home address?", "l", 640, K.DANGER_SOFT, ink,
                            size=40, out=K.DANGER)
                K.draw_cross(draw, bb[2] + 50, (bb[1] + bb[3]) / 2, 28, K.DANGER)
                K.text_at(draw, "Not needed!", 1400, 640, font(48, bold=True), K.DANGER)
            return True
        if focus == "helper":
            sb = tablet(draw, (200, 240, 1180, 850))
            app_bar(draw, sb, "Homework Helper")
            bubble(draw, sb[2] - 24, sb[1] + 110, "Explain how plants make food.", "r", 760, coral, panel, size=36)
            a = K.stagger(progress, 1, step=0.14, speed=4)
            if a > 0:
                bb = bubble(draw, sb[0] + 24, sb[1] + 230 + int((1 - a) * 20),
                            "Plants use sunlight, water and air to make their own food!", "l", 560, lav_soft, ink,
                            size=34)
                px = sb[2] - 150
                draw.ellipse((px - 46, bb[1] + 10, px + 46, bb[1] + 102), fill=K.GOLD)
                K.draw_plant(draw, px, sb[3] - 30, 0.8, 1.0, t=t)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                y = 360 + int((1 - a) * 30)
                draw.ellipse((1490 - 170, y - 10, 1490 + 170, y + 330), fill=sage_soft)
                K.draw_shield(draw, 1490, y + 160, 1.0, sage)
                K.text_at(draw, "Perfect question!", 1490, y + 360, font(44, bold=True), sage)
                K.text_at(draw, "Nothing private", 1490, y + 420, font(36, bold=True), muted)
            return True
        # saved
        sb = tablet(draw, (160, 300, 820, 800))
        app_bar(draw, sb, "Any app", size=32)
        bubble(draw, sb[2] - 24, sb[1] + 120, "Hi, I'm Aarav!", "r", 520, coral, panel, size=34)
        fb = photo_frame(draw, (sb[0] + 40, sb[1] + 230, sb[0] + 230, sb[1] + 420))
        draw.rectangle(fb, fill=SKY)
        K.draw_face(draw, (fb[0] + fb[2]) / 2, fb[3] - 34, 30, "kid", 1.0)
        p = K.clamp01(progress * 1.6)
        for k in range(4):
            q = (p + k * 0.25) % 1
            x = K.lerp(860, 1180, q)
            yy = 520 - math.sin(q * math.pi) * 80
            draw.ellipse((x - 10, yy - 10, x + 10, yy + 10), fill=coral)
        K.draw_arrow(draw, 860, 600, 1180, 600, muted, width=10, head=30)
        cloud(draw, 1450, 480, 1.3, blue_soft)
        K.text_at(draw, "Saved", 1450, 420, font(54, bold=True), K.ROAD)
        for k in range(3):
            draw.rounded_rectangle((1340 + k * 80, 500, 1400 + k * 80, 560), radius=10, fill=K.ROAD)
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1450, 680 + int((1 - a) * 20), "Can't always take it back", K.DANGER, size=34)
            K.pill(draw, 1450, 780 + int((1 - a) * 20), "Think before you type!", sage, size=34)
        return True

    # ---- extra-careful info ------------------------------------------------------------
    if visual == "b17-extra":
        if focus == "why":
            nb = (150, 330, 700, 620)
            draw.rounded_rectangle((nb[0] + 8, nb[1] + 10, nb[2] + 8, nb[3] + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle(nb, radius=20, fill=(255, 250, 238), outline=K.DEV_DARK, width=4)
            K.draw_name_tag(draw, 290, 470, 0.62, brand)
            K.text_at(draw, "Aarav Sharma", 520, 400, font(36, bold=True), ink)
            K.text_at(draw, "+", 520, 450, font(44, bold=True), coral)
            K.text_at(draw, "12 Lotus Lane", 520, 510, font(36, bold=True), ink)
            p = K.ease_in_out(K.clamp01(progress * 1.4))
            K.draw_dashed(draw, 720, 480, K.lerp(720, 1240, p), 480, coral, width=8, phase=t * 120)
            if p > 0.95:
                K.draw_arrow(draw, 1200, 480, 1260, 480, coral, width=8, head=26)
            K.draw_person(draw, K.lerp(820, 1120, p), 610, 0.7, "mystery", t)
            house_front(draw, 1480, 760, 1.25)
            K.draw_red_flag(draw, 1730, 340, 1.2)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.draw_padlock(draw, 425, 740 + int((1 - a) * 20), 0.6, K.GOLD)
                K.text_at(draw, "Keep these safe!", 425, 810, font(40, bold=True), sage)
            return True
        n = {"intro": 0, "name": 1, "location": 2, "photos": 3}[focus]
        specs = [("Real full name", "and school", coral), ("Home address", "and live location", K.DANGER),
                 ("Photos of home", "number · sign · badge", K.BOTH_COLOR)]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (title, sub, col) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            mx = x0 + cw / 2
            if i >= n:
                draw.rounded_rectangle((x0, 290, x0 + cw, 860), radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.pill(draw, 0, 310, str(i + 1), muted, size=30, left=x0 + 24)
                K.text_at(draw, "?", mx, 460, font(140, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 290 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            K.pill(draw, 0, 310 + yy, str(i + 1), col, size=30, left=x0 + 24)
            iy = 490 + yy
            if i == 0:
                K.draw_name_tag(draw, mx - 100, iy - 30, 0.7, brand)
                K.draw_school(draw, mx + 120, iy + 80, 0.5, brand)
            elif i == 1:
                map_card(draw, (x0 + 40, 370 + yy, x0 + cw - 40, 650 + yy), t)
            else:
                fb = photo_frame(draw, (x0 + 70, 350 + yy, x0 + cw - 70, 660 + yy))
                draw.rectangle(fb, fill=SKY)
                draw.rectangle((fb[0], fb[3] - 30, fb[2], fb[3]), fill=GROUND)
                house_front(draw, (fb[0] + fb[2]) / 2, fb[3] - 30, 0.62)
                badge(draw, fb[2] - 50, fb[1] + 60, 1.0)
            K.text_at(draw, title, mx, 700 + yy, font(44, bold=True), col)
            K.text_at(draw, sub, mx, 764 + yy, font(34, bold=True), muted)
        if n == 0:
            K.pill(draw, cx, 222, "Extra care!", K.DANGER, size=32)
        return True

    # ---- photo detective --------------------------------------------------------------
    if visual == "b17-photo":
        if focus == "parent":
            K.draw_person(draw, 440, 450, 1.35, "mom", t)
            aarav(draw, 840, 540, 1.0, t)
            K.draw_bubble(draw, (780, 250, 1560, 390), brand, "Mum, is this photo okay to share?", tail="left", size=40)
            fb = photo_frame(draw, (1080, 480, 1460, 800))
            draw.rectangle(fb, fill=SKY)
            draw.rectangle((fb[0], fb[3] - 40, fb[2], fb[3]), fill=GROUND)
            cycle(draw, (fb[0] + fb[2]) / 2, fb[3] - 50, 0.7)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.draw_shield(draw, 1640, 640 + int((1 - a) * 20), 0.9, sage)
                K.pill(draw, 440, 780, "Ask a parent first", sage, size=36)
            return True
        hot = cycle_photo(draw, (120, 240, 1180, 860), t)
        if focus == "intro":
            sb = phone(draw, 1500, 560, 1.3)
            app_bar(draw, sb, "Upload?", size=30)
            fb = photo_frame(draw, (sb[0] + 30, sb[1] + 110, sb[2] - 30, sb[1] + 330))
            draw.rectangle(fb, fill=SKY)
            cycle(draw, (fb[0] + fb[2]) / 2, fb[3] - 30, 0.5)
            bx = (sb[0] + 30, sb[3] - 100, sb[2] - 30, sb[3] - 30)
            draw.rounded_rectangle(bx, radius=35, fill=coral)
            K.text_at(draw, "Send", (bx[0] + bx[2]) / 2, bx[1] + 14, font(36, bold=True), panel)
            return True
        if focus == "ask":
            mx = 1500 + 60 * math.sin(t * 5)
            K.draw_magnifier(draw, mx, 440, 1.3)
            question_marks([(1330, 260), (1720, 300)])
            K.draw_stopwatch(draw, 1500, 740, 60, progress, brand)
            return True
        labs = ["House number", "Street sign", "School badge"]
        for i, ((hx, hy, r), lab) in enumerate(zip(hot, labs)):
            a = K.stagger(progress, i, step=0.18, speed=5)
            if a <= 0:
                continue
            rr = r * (0.6 + 0.4 * a) + 4 * pulse
            draw.ellipse((hx - rr, hy - rr, hx + rr, hy + rr), outline=K.DANGER, width=8)
            y = 330 + i * 170
            K.pill(draw, 0, y, str(i + 1), K.DANGER, size=34, left=1250)
            draw.text((1340, y + 6), lab, fill=ink, font=font(48, bold=True))
        return True

    # ---- share or don't share -----------------------------------------------------------
    cards = [("question", ("Your homework", "question"), True), ("nick", ("A nickname",), True),
             ("animal", ("Favourite", "animal"), True), ("house", ("Home address",), False),
             ("phone", ("Phone number",), False), ("password", ("Password",), False)]

    def card_icon(kind, x, y):
        if kind == "question":
            draw.rounded_rectangle((x - 70, y - 56, x + 70, y + 44), radius=24, fill=lav_soft, outline=K.BOTH_COLOR,
                                   width=4)
            draw.polygon([(x - 40, y + 40), (x - 10, y + 40), (x - 50, y + 74)], fill=K.BOTH_COLOR)
            K.text_at(draw, "?", x, y - 50, font(70, bold=True), K.BOTH_COLOR)
        elif kind == "nick":
            draw.rounded_rectangle((x - 84, y - 34, x + 84, y + 34), radius=34, fill=K.GOLD)
            K.draw_star(draw, x - 52, y, 20, panel)
            draw.text((x - 26, y - 20), "Star", fill=ink, font=font(32, bold=True))
        elif kind == "animal":
            cat_face(draw, x, y + 10, 0.72)
        elif kind == "house":
            K.draw_house(draw, x, y + 10, 0.36, brand)
        elif kind == "phone":
            phone_digits(draw, x, y, 0.34, K.DANGER)
        else:
            K.draw_padlock(draw, x, y + 10, 0.55, K.GOLD)

    if visual == "b17-sort":
        if focus == "intro":
            for k, (lab, col, soft) in enumerate((("SHARE", sage, sage_soft), ("DON'T SHARE", K.DANGER, K.DANGER_SOFT))):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 480
                y = 340 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 300 + 8, y + 10, x + 300 + 8, y + 330), radius=44, fill=K.SHADOW)
                draw.rounded_rectangle((x - 300, y, x + 300, y + 320), radius=44, fill=soft, outline=col, width=6)
                (K.draw_check if k == 0 else K.draw_cross)(draw, x, y + 100, 60, col)
                K.text_at(draw, lab, x, y + 200, font(60, bold=True), col)
            aarav(draw, cx, 560, 0.9, t)
            return True
        ans = focus == "answer"
        cw, chh, gx, gy = 520, 270, 40, 30
        x_start = cx - (3 * cw + 2 * gx) / 2
        for i, (kind, lab, ok) in enumerate(cards):
            col_i, row = i % 3, i // 3
            x0 = x_start + col_i * (cw + gx)
            y0 = 290 + row * (chh + gy)
            reveal = ans and progress > (0.05 if ok else 0.45)
            col = (sage if ok else K.DANGER) if reveal else line
            K.shadow_card(draw, (x0, y0, x0 + cw, y0 + chh), brand, radius=30, outline=col,
                          outline_w=6 if reveal else 3)
            if reveal:
                draw.rounded_rectangle((x0 + 6, y0 + 6, x0 + cw - 6, y0 + chh - 6), radius=26,
                                       fill=sage_soft if ok else K.DANGER_SOFT)
            card_icon(kind, x0 + 120, y0 + 140)
            tx = x0 + 360
            n = len(lab)
            label_lines(lab, tx, y0 + 150 - n * 22, size=38)
            if reveal:
                K.pill(draw, tx, y0 + 26, "SHARE" if ok else "PRIVATE", sage if ok else K.DANGER, size=28)
            elif not ans:
                K.pill(draw, tx, y0 + 26, "?", K.BOTH_COLOR, size=28)
        if ans:
            K.pill(draw, cx, 222, "Not sure? Ask a grown-up first", ink, size=30)
        else:
            K.pill(draw, cx - 40, 222, "Okay to share?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 210, 252, 32, progress, brand)
        return True

    # ---- friendly isn't the same as safe -------------------------------------------------
    if visual == "b17-friendly":
        if focus == "intro":
            aarav(draw, 400, 480, 1.3, t)
            K.text_at(draw, "Aww, thanks!", 400, 720, font(40, bold=True), coral)
            sb = tablet(draw, (820, 240, 1720, 840))
            app_bar(draw, sb, "Homework Helper")
            msgs = ["Great question!", "You're so smart!", "I love helping you!"]
            for i, m in enumerate(msgs):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                bubble(draw, sb[0] + 30, sb[1] + 120 + i * 130 + int((1 - a) * 20), m, "l", 700, lav_soft, ink,
                       size=40)
            for k in range(3):
                K.draw_heart(draw, 620 + k * 60, 380 - k * 60 + 10 * math.sin(t * 8 + k), 22 + 4 * k, coral)
            return True
        if focus == "truth":
            sb = tablet(draw, (160, 300, 760, 760))
            draw.rounded_rectangle(sb, radius=24, fill=K.DEV_DEEP)
            for r in range(4):
                for c in range(5):
                    x = sb[0] + 60 + c * 100
                    y = sb[1] + 60 + r * 90
                    on = int(t * 8 + r * 2 + c) % 4 == 0
                    draw.rounded_rectangle((x - 34, y - 18, x + 34, y + 18), radius=9,
                                           fill=K.LED_ON if on else K.DEV_MID)
                    if c < 4:
                        draw.line((x + 34, y, x + 66, y), fill=K.DEV_MID, width=3)
            K.text_at(draw, "Patterns in words", 460, 790, font(38, bold=True), muted)
            rows = [("A person?", False), ("A friend who keeps secrets?", False), ("A computer program", True)]
            for i, (lab, ok) in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 170 + int((1 - a) * 24)
                col = sage if ok else K.DANGER
                draw.rounded_rectangle((880, y, 1760, y + 130), radius=40, fill=sage_soft if ok else K.DANGER_SOFT,
                                       outline=col, width=5)
                draw.text((930, y + 38), lab, fill=ink, font=font(46, bold=True))
                (K.draw_check if ok else K.draw_cross)(draw, 1690, y + 65, 32, col)
            return True
        # rule
        K.text_at(draw, "Friendly", 560, 270 + lift, font(90, bold=True), K.BOTH_COLOR)
        K.text_at(draw, "doesn't mean", 560, 380 + lift, font(56, bold=True), muted)
        K.text_at(draw, "safe!", 560, 450 + lift, font(90, bold=True), K.DANGER)
        K.draw_heart(draw, 330, 670, 70, coral)
        K.draw_shield(draw, 760, 690, 0.8, sage, mark="lock")
        for dy in (-18, 18):
            draw.line((500, 690 + dy, 590, 690 + dy), fill=ink, width=12)
        draw.line((565, 630, 525, 750), fill=ink, width=12)
        K.text_at(draw, "Never tell an app:", 1380, 290, font(44, bold=True), ink)
        for i, lab in enumerate(("Your school name", "Where you live")):
            a = K.stagger(progress, i + 1, step=0.18, speed=4)
            if a <= 0:
                continue
            y = 400 + i * 160 + int((1 - a) * 24)
            f = font(44, bold=True)
            tw = draw.textbbox((0, 0), lab, font=f)[2]
            x0 = 1380 - (tw + 140) / 2
            draw.rounded_rectangle((x0, y, x0 + tw + 140, y + 110), radius=55, fill=K.DANGER_SOFT, outline=K.DANGER,
                                   width=4)
            draw.text((x0 + 32, y + 28), lab, fill=ink, font=f)
            K.draw_cross(draw, x0 + tw + 92, y + 55, 28, K.DANGER)
        return True

    # ---- settings -------------------------------------------------------------------
    def settings_screen(sb, states):
        x0, y0, x1, y1 = sb
        draw.rounded_rectangle((x0, y0, x1, y0 + 90), radius=16, fill=K.DEV_MID)
        draw.rectangle((x0, y0 + 50, x1, y0 + 90), fill=K.DEV_MID)
        draw.text((x0 + 30, y0 + 22), "Settings", fill=panel, font=font(40, bold=True))
        rows = ["Location", "Camera", "Contacts"]
        for i, (lab, on) in enumerate(zip(rows, states)):
            y = y0 + 130 + i * 140
            draw.rounded_rectangle((x0 + 20, y, x1 - 20, y + 110), radius=20, fill=panel, outline=line, width=3)
            ix = x0 + 70
            if i == 0:
                K.draw_map_pin(draw, ix, y + 88, 0.5, K.DANGER)
            elif i == 1:
                draw.rounded_rectangle((ix - 30, y + 36, ix + 30, y + 80), radius=8, fill=K.DEV_DARK)
                draw.ellipse((ix - 14, y + 44, ix + 14, y + 72), fill=K.STEEL)
            else:
                K.draw_face(draw, ix, y + 58, 24, "kid", 0.5)
            draw.text((x0 + 120, y + 32), lab, fill=ink, font=font(40, bold=True))
            toggle(draw, x1 - 170, y + 22, on, sage)

    if visual == "b17-settings":
        if focus == "intro":
            sb = tablet(draw, (200, 250, 920, 860))
            states = [int(t * 3 + k * 0.5) % 2 == 0 for k in range(3)]
            settings_screen(sb, states)
            K.text_at(draw, "Settings are", 1380, 300 + lift, font(56, bold=True), muted)
            K.text_at(draw, "like switches", 1380, 380 + lift, font(80, bold=True), coral)
            for k, lab in enumerate(("What can it see?", "What can it share?")):
                a = K.stagger(progress, k + 2, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.pill(draw, 1380, 540 + k * 120 + int((1 - a) * 20), lab, K.BOTH_COLOR, size=38)
            return True
        if focus == "parents":
            K.draw_person(draw, 250, 450, 1.3, "mom", t)
            aarav(draw, 450, 580, 0.75, t)
            sb = tablet(draw, (640, 250, 1320, 860))
            states = [progress < 0.25 + 0.2 * k for k in range(3)]
            settings_screen(sb, states)
            k = min(2, int(K.clamp01((progress - 0.15) / 0.6) * 3))
            fy = sb[1] + 130 + k * 140 + 60
            draw.ellipse((sb[2] - 150 - 26, fy - 26, sb[2] - 150 + 26, fy + 26), fill=K.SKIN, outline=K.DEV_DARK,
                         width=3)
            a = K.stagger(progress, 5, step=0.13, speed=4)
            if a > 0:
                K.draw_shield(draw, 1530, 520 + int((1 - a) * 20), 1.1, sage, mark="lock")
                K.text_at(draw, "Limit what", 1530, 700, font(44, bold=True), ink)
                K.text_at(draw, "apps can see", 1530, 756, font(44, bold=True), ink)
            K.text_at(draw, "Mum helps", 330, 720, font(40, bold=True), K.BOTH_COLOR)
            return True
        ans = focus == "answer"
        opts = [("Always on", True), ("Off", False)]
        for k, (lab, on) in enumerate(opts):
            x0 = 230 + k * 760
            bx = (x0, 290, x0 + 700, 750)
            win = ans and not on
            bad = ans and on
            K.shadow_card(draw, bx, brand, radius=36, outline=sage if win else K.DANGER if bad else line,
                          outline_w=6 if ans else 3)
            if win:
                draw.rounded_rectangle((x0 + 6, 296, x0 + 694, 744), radius=32, fill=sage_soft)
            mx = x0 + 350
            K.text_at(draw, "Location:", mx - 100, 320, font(46, bold=True), muted)
            toggle(draw, mx + 110, 312, on, K.DANGER if on else sage, s=1.0)
            mb = (x0 + 60, 400, x0 + 640, 610)
            map_card(draw, mb, t, pin=on, pulse_on=on)
            if not on:
                draw.rounded_rectangle(mb, radius=24, fill=(236, 236, 240), outline=K.DEV_DARK, width=4)
                K.draw_map_pin(draw, (mb[0] + mb[2]) / 2, (mb[1] + mb[3]) / 2 + 60, 0.9, OFF)
                K.text_at(draw, "Can't see you", (mb[0] + mb[2]) / 2, mb[3] - 60, font(34, bold=True), muted)
            K.text_at(draw, lab, mx, 650, font(56, bold=True), ink)
            if win:
                K.pill(draw, mx, 222, "SAFER", sage, size=32)
                K.draw_check(draw, x0 + 650, 340, 30, sage)
            elif bad:
                K.draw_cross(draw, x0 + 650, 340, 30, K.DANGER)
            elif not ans:
                K.pill(draw, mx, 222, "?", K.BOTH_COLOR, size=32)
        if ans:
            for k, lab in enumerate(("Share contacts: Off", "Real name to all: Off")):
                a = K.stagger(progress, k + 3, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 390
                K.pill(draw, x, 784 + int((1 - a) * 20), lab, sage, size=34)
        else:
            K.draw_stopwatch(draw, cx, 826, 40, progress, brand)
        return True

    # ---- checkpoint ----------------------------------------------------------------
    def drawing_game(sb, ans):
        app_bar(draw, sb, "Doodle Fun", col=coral)
        x0, y0, x1, y1 = sb
        draw.ellipse((x0 + 60, y0 + 130, x0 + 160, y0 + 230), outline=K.GOLD, width=10)
        draw.line([(x0 + 80, y1 - 80), (x0 + 200, y1 - 200), (x0 + 320, y1 - 80)], fill=K.ROAD, width=10)
        draw.line([(x1 - 260, y1 - 90), (x1 - 180, y1 - 170), (x1 - 100, y1 - 90)], fill=K.LEAF, width=10)
        for k, c in enumerate((K.DANGER, K.GOLD, K.LEAF, K.ROAD)):
            draw.ellipse((x1 - 70, y0 + 120 + k * 60, x1 - 30, y0 + 160 + k * 60), fill=c)
        px0, py0, px1, py1 = x0 + 110, y0 + 190, x1 - 110, y1 - 60
        draw.rounded_rectangle((px0 + 8, py0 + 10, px1 + 8, py1 + 10), radius=26, fill=K.SHADOW)
        draw.rounded_rectangle((px0, py0, px1, py1), radius=26, fill=panel, outline=ink, width=4)
        K.draw_map_pin(draw, (px0 + px1) / 2, py0 + 110, 0.75, K.DANGER)
        K.text_at(draw, "Can I use your", (px0 + px1) / 2, py0 + 126, font(36, bold=True), ink)
        K.text_at(draw, "live location?", (px0 + px1) / 2, py0 + 172, font(36, bold=True), ink)
        bw = (px1 - px0 - 60) / 2
        for k, lab in enumerate(("Allow", "Don't allow")):
            bx0 = px0 + 20 + k * (bw + 20)
            box = (bx0, py1 - 100, bx0 + bw, py1 - 24)
            hl = ans and k == 1
            dim = ans and k == 0
            draw.rounded_rectangle(box, radius=38, fill=sage if hl else (240, 240, 244) if dim else blue_soft,
                                   outline=sage if hl else line, width=3)
            K.text_at(draw, lab, (box[0] + box[2]) / 2, box[1] + 18, font(32, bold=True),
                      panel if hl else muted if dim else K.ROAD)
            if hl:
                K.draw_check(draw, box[2] - 4, box[1] - 4, 22, sage)

    if visual == "b17-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Keep your info safe!", cx, 450 + lift, font(60, bold=True), ink)
            K.draw_shield(draw, cx, 620 + lift, 0.6, sage, mark="lock")
            return True
        ans = focus == "answer"
        sb = tablet(draw, (1000, 240, 1780, 860))
        drawing_game(sb, ans)
        draw.rounded_rectangle((130 + 10, 240 + 12, 920 + 10, 860 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 920, 860), radius=24, fill=(255, 250, 238))
        label_lines(("A drawing game wants", "your live location.", "What should you do?"), 525, 270, size=44,
                    col=coral)
        rows = ["Say no. Don't allow it", "Drawing doesn't need it", "Ask a grown-up to check"]
        for i, lab in enumerate(rows):
            y = 470 + i * 125
            draw.line((180, y + 90, 870, y + 90), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 205, y + 42, 24, sage)
                draw.text((245, y + 18), lab, fill=ink, font=font(40, bold=True))
        if not ans:
            K.text_at(draw, "?", 525, 520, font(150, bold=True), line)
            K.draw_stopwatch(draw, 525, 790, 40, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b17-recap":
        recap = [(("No life story,", "just the question"), coral, "q"), (("Keep name, place,", "home photos safe"),
                                                                          K.DANGER, "lock"),
                 (("Ask a parent", "before photos"), K.BOTH_COLOR, "parent"), (("Settings limit", "what's shared"),
                                                                                sage, "toggle")]
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
                ix, iy = x0 + 200, y0 + 190
                if kind == "q":
                    sb = tablet(draw, (ix - 140, iy - 130, ix + 140, iy + 110))
                    bubble(draw, sb[2] - 14, sb[1] + 30, "Why is the sky blue?", "r", 230, coral, panel, size=26)
                    K.draw_check(draw, ix, iy + 50, 30, sage)
                elif kind == "lock":
                    map_card(draw, (ix - 150, iy - 110, ix + 70, iy + 90), t)
                    K.draw_padlock(draw, ix + 90, iy + 30, 0.6, K.GOLD)
                elif kind == "parent":
                    K.draw_person(draw, ix - 70, iy - 30, 0.8, "mom", t)
                    fb = photo_frame(draw, (ix + 10, iy - 30, ix + 170, iy + 120))
                    draw.rectangle(fb, fill=SKY)
                    cycle(draw, (fb[0] + fb[2]) / 2, fb[3] - 22, 0.36)
                    K.draw_check(draw, ix + 140, iy - 20, 24, sage)
                else:
                    for k in range(3):
                        toggle(draw, ix - 62, iy - 110 + k * 90, k == 2 and int(t * 4) % 2 == 0, sage)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            aarav(draw, cx + 300, 450, 1.0, t)
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Smart and safe!", coral, size=36)
            stars_around(320, 540, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
