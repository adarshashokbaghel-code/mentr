"""C1 · Counting the Computer Way — visuals."""
import math

import build as K

BULB_ON = (255, 212, 70)
BULB_RIM = (226, 160, 30)
GLOW_1 = (255, 244, 204)
GLOW_2 = (255, 230, 150)
BULB_OFF = (214, 216, 224)
FILAMENT_ON = (255, 120, 20)
NIGHT = (40, 52, 98)
NIGHT_DEEP = (30, 38, 76)
WALL_A = (226, 150, 110)
WALL_A_DARK = (186, 112, 80)
WALL_B = (120, 150, 206)
WALL_B_DARK = (86, 112, 168)
WINDOW_LIT = (255, 236, 170)
WINDOW_DARK = (64, 78, 124)
LADDOO = (247, 168, 46)
LADDOO_DARK = (212, 124, 24)
LADDOO_HI = (255, 214, 130)
PLACE_COLS = [(123, 97, 214), (72, 118, 214), (13, 148, 136)]
PLACE_VALS = [4, 2, 1]
PAPER = (255, 250, 238)


def S_(s):
    return lambda v: v * s


def flower_clip(draw, cx, cy, r):
    for k in range(5):
        a = k * 2 * math.pi / 5
        px, py = cx + math.cos(a) * r * 0.6, cy + math.sin(a) * r * 0.6
        draw.ellipse((px - r * 0.5, py - r * 0.5, px + r * 0.5, py + r * 0.5), fill=(238, 104, 158))
    draw.ellipse((cx - r * 0.4, cy - r * 0.4, cx + r * 0.4, cy + r * 0.4), fill=K.GOLD)


def kid(draw, cx, cy, s, body, t=0.0, bun=True, flower=False):
    """Child bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    if bun:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    if flower:
        flower_clip(draw, cx + r * 0.75, cy - r * 0.8, r * 0.32)


def bulb(draw, cx, cy, r, on, t=0.0):
    """Light bulb; glass centre (cx, cy). Rays reach cy-1.95r, base reaches cy+1.5r."""
    if on:
        g = 1 + 0.05 * math.sin(t * 20)
        draw.ellipse((cx - r * 1.55 * g, cy - r * 1.55 * g, cx + r * 1.55 * g, cy + r * 1.55 * g), fill=GLOW_1)
        draw.ellipse((cx - r * 1.25, cy - r * 1.25, cx + r * 1.25, cy + r * 1.25), fill=GLOW_2)
        for deg in (-180, -150, -120, -90, -60, -30, 0):
            a = math.radians(deg)
            draw.line((cx + math.cos(a) * r * 1.62, cy + math.sin(a) * r * 1.62,
                       cx + math.cos(a) * r * 1.95, cy + math.sin(a) * r * 1.95), fill=K.GOLD,
                      width=max(3, int(r * 0.11)))
    nw = r * 0.48
    lw = max(2, int(r * 0.05))
    draw.rounded_rectangle((cx - nw, cy + r * 0.6, cx + nw, cy + r * 1.3), radius=r * 0.12, fill=K.STEEL,
                           outline=K.STEEL_DARK, width=lw)
    for k in range(2):
        yy = cy + r * (0.9 + k * 0.2)
        draw.line((cx - nw, yy, cx + nw, yy), fill=K.STEEL_DARK, width=lw)
    draw.chord((cx - nw * 0.7, cy + r * 1.12, cx + nw * 0.7, cy + r * 1.5), 0, 180, fill=K.DEV_DARK)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r * 0.95), fill=BULB_ON if on else BULB_OFF,
                 outline=BULB_RIM if on else K.DEV_MID, width=max(3, int(r * 0.07)))
    fcol = FILAMENT_ON if on else K.DEV_MID
    fw = max(2, int(r * 0.07))
    pts = [(cx - r * 0.32 + k * r * 0.16, cy - r * 0.05 + (r * 0.12 if k % 2 else -r * 0.12)) for k in range(5)]
    draw.line([(cx - r * 0.3, cy + r * 0.62), pts[0]], fill=fcol, width=fw)
    draw.line(pts, fill=fcol, width=fw, joint="curve")
    draw.line([pts[-1], (cx + r * 0.3, cy + r * 0.62)], fill=fcol, width=fw)
    draw.arc((cx - r * 0.72, cy - r * 0.72, cx + r * 0.1, cy + r * 0.1), 190, 250, fill=(255, 255, 255),
             width=max(2, int(r * 0.12)))


def mini_lamp(draw, x, y, r, on):
    if on:
        draw.ellipse((x - r * 1.45, y - r * 1.45, x + r * 1.45, y + r * 1.45), fill=GLOW_2)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=BULB_ON, outline=BULB_RIM, width=max(2, int(r * 0.14)))
    else:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=BULB_OFF, outline=K.DEV_MID, width=max(2, int(r * 0.14)))


def value_tag(draw, x, y, val, col, size=44):
    """Rounded tag with a place value; (x, y) = top centre."""
    f = K.load_font(size, bold=True)
    hw, hh = size * 1.3, size * 1.45
    draw.rounded_rectangle((x - hw + 5, y + 6, x + hw + 5, y + hh + 6), radius=int(hh / 2), fill=K.SHADOW)
    if val == "?":
        draw.rounded_rectangle((x - hw, y, x + hw, y + hh), radius=int(hh / 2), fill=(255, 240, 230), outline=col,
                               width=4)
        K.text_at(draw, "?", x, y + hh * 0.12, f, col)
    else:
        draw.rounded_rectangle((x - hw, y, x + hw, y + hh), radius=int(hh / 2), fill=col)
        K.text_at(draw, str(val), x, y + hh * 0.12, f, (255, 255, 255))


def laddoo(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.12, cy - r + r * 0.18, cx + r + r * 0.12, cy + r + r * 0.18), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LADDOO)
    for dx, dy in ((-0.4, -0.2), (0.1, -0.5), (0.45, 0.05), (-0.1, 0.35), (0.3, 0.5), (-0.5, 0.3)):
        d = r * 0.11
        draw.ellipse((cx + dx * r - d, cy + dy * r - d, cx + dx * r + d, cy + dy * r + d), fill=LADDOO_DARK)
    draw.ellipse((cx - r * 0.55, cy - r * 0.6, cx - r * 0.15, cy - r * 0.3), fill=LADDOO_HI)


def laddoo_plate(draw, cx, cy, n, r):
    """Steel plate centred at (cx, cy) with n laddoos sitting on it."""
    front = (n + 2) // 2 if n > 3 else n
    back = n - front
    rw = max(2.2, front * 1.1 + 0.6) * r
    draw.ellipse((cx - rw + 6, cy - rw * 0.3 + 8, cx + rw + 6, cy + rw * 0.3 + 8), fill=K.SHADOW)
    draw.ellipse((cx - rw, cy - rw * 0.3, cx + rw, cy + rw * 0.3), fill=K.STEEL, outline=K.STEEL_DARK, width=3)
    draw.ellipse((cx - rw * 0.75, cy - rw * 0.2, cx + rw * 0.75, cy + rw * 0.2), fill=(206, 212, 222))
    for k in range(back):
        laddoo(draw, cx + (k - (back - 1) / 2) * r * 2.1, cy - r * 0.9, r)
    for k in range(front):
        laddoo(draw, cx + (k - (front - 1) / 2) * r * 2.1, cy - r * 0.15, r)


def hand(draw, cx, by, s, bits, sleeve):
    """Hand with three fingers (left to right = bits). by = wrist line; fingers reach by-340s."""
    S = S_(s)
    fold = (228, 176, 140)
    draw.rounded_rectangle((cx - S(100), by - S(20), cx + S(100), by + S(60)), radius=S(20), fill=sleeve)
    draw.rounded_rectangle((cx - S(115) + S(8), by - S(190) + S(10), cx + S(115) + S(8), by + S(10)), radius=S(50),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(115), by - S(190), cx + S(115), by), radius=S(50), fill=K.SKIN)
    for i, b in enumerate(bits):
        fx = cx + (i - 1) * S(70)
        if b:
            top = by - S(190) - S(150 if i == 1 else 130)
            draw.rounded_rectangle((fx - S(30), top, fx + S(30), by - S(150)), radius=S(29), fill=K.SKIN)
            draw.rounded_rectangle((fx - S(18), top + S(10), fx + S(18), top + S(42)), radius=S(14),
                                   fill=(250, 216, 192))
            draw.line((fx - S(16), top + S(86), fx + S(16), top + S(86)), fill=fold, width=max(2, int(S(4))))
        else:
            draw.rounded_rectangle((fx - S(30), by - S(226), fx + S(30), by - S(140)), radius=S(29), fill=fold)
            draw.arc((fx - S(22), by - S(214), fx + S(22), by - S(170)), 200, 340, fill=(206, 150, 116),
                     width=max(2, int(S(4))))
    draw.ellipse((cx + S(96), by - S(176), cx + S(140), by - S(116)), fill=fold)
    draw.rounded_rectangle((cx - S(126), by - S(112), cx + S(6), by - S(60)), radius=S(26), fill=fold)


def wall_switch(draw, cx, cy, s, on):
    S = S_(s)
    draw.rounded_rectangle((cx - S(44) + S(5), cy - S(58) + S(6), cx + S(44) + S(5), cy + S(58) + S(6)), radius=S(14),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(44), cy - S(58), cx + S(44), cy + S(58)), radius=S(14), fill=(255, 255, 255),
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(20), cy - S(40), cx + S(20), cy + S(40)), radius=S(8), fill=K.DEV_DEEP)
    if on:
        draw.rounded_rectangle((cx - S(17), cy - S(37), cx + S(17), cy), radius=S(7), fill=K.LED_ON)
    else:
        draw.rounded_rectangle((cx - S(17), cy, cx + S(17), cy + S(37)), radius=S(7), fill=K.DEV_MID)


def chip(draw, cx, cy, s):
    S = S_(s)
    for k in range(5):
        o = S(-60 + k * 30)
        draw.rectangle((cx + o - S(6), cy - S(100), cx + o + S(6), cy - S(80)), fill=K.STEEL_DARK)
        draw.rectangle((cx + o - S(6), cy + S(80), cx + o + S(6), cy + S(100)), fill=K.STEEL_DARK)
        draw.rectangle((cx - S(100), cy + o - S(6), cx - S(80), cy + o + S(6)), fill=K.STEEL_DARK)
        draw.rectangle((cx + S(80), cy + o - S(6), cx + S(100), cy + o + S(6)), fill=K.STEEL_DARK)
    draw.rounded_rectangle((cx - S(82), cy - S(82), cx + S(82), cy + S(82)), radius=S(14), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(54), cy - S(54), cx + S(54), cy + S(54)), radius=S(8), fill=K.DEV_MID)


def gamepad(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(6), cy - S(52) + S(8), cx + S(110) + S(6), cy + S(52) + S(8)),
                           radius=S(50), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(52), cx + S(110), cy + S(52)), radius=S(50), fill=K.DEV_DARK)
    draw.rectangle((cx - S(74), cy - S(8), cx - S(34), cy + S(8)), fill=(230, 230, 236))
    draw.rectangle((cx - S(62), cy - S(20), cx - S(46), cy + S(20)), fill=(230, 230, 236))
    draw.ellipse((cx + S(30), cy - S(4), cx + S(54), cy + S(20)), fill=K.CORAL)
    draw.ellipse((cx + S(56), cy - S(26), cx + S(80), cy - S(2)), fill=K.LED_ON)


def photo(draw, cx, cy, s):
    S = S_(s)
    draw.rectangle((cx - S(96) + S(6), cy - S(72) + S(8), cx + S(96) + S(6), cy + S(72) + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - S(96), cy - S(72), cx + S(96), cy + S(72)), fill=(255, 255, 255), outline=K.DEV_MID, width=3)
    draw.rectangle((cx - S(82), cy - S(58), cx + S(82), cy + S(58)), fill=(200, 226, 250))
    draw.polygon([(cx - S(82), cy + S(58)), (cx - S(30), cy - S(10)), (cx + S(10), cy + S(30)), (cx + S(40), cy),
                  (cx + S(82), cy + S(58))], fill=K.LEAF)
    draw.ellipse((cx + S(30), cy - S(46), cx + S(62), cy - S(14)), fill=K.GOLD)


def night_panel(draw, box, t):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=36, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=36, fill=NIGHT)
    for k, (sx, sy) in enumerate(((0.08, 0.1), (0.3, 0.06), (0.47, 0.17), (0.62, 0.08), (0.9, 0.14), (0.4, 0.3),
                                   (0.56, 0.36), (0.2, 0.22))):
        x, y = x0 + (x1 - x0) * sx, y0 + (y1 - y0) * sy
        rr = 4 + 2 * math.sin(t * 12 + k)
        draw.ellipse((x - rr, y - rr, x + rr, y + rr), fill=(255, 250, 220))
    mx, my = x1 - 150, y0 + 90
    draw.ellipse((mx - 46, my - 46, mx + 46, my + 46), fill=(255, 246, 210))
    draw.ellipse((mx - 20, my - 58, mx + 64, my + 30), fill=NIGHT)


def building(draw, x0, y0, x1, y1, col, dark, lit_seed=0):
    draw.rectangle((x0, y0, x1, y1), fill=col)
    draw.rectangle((x0 - 12, y0 - 18, x1 + 12, y0), fill=dark)
    k = 0
    ww, wh = 70, 64
    y = y0 + 40
    while y + wh < y1 - 20:
        x = x0 + 34
        while x + ww < x1 - 20:
            lit = (k * 7 + lit_seed) % 5 < 2
            draw.rectangle((x, y, x + ww, y + wh), fill=WINDOW_LIT if lit else WINDOW_DARK)
            x += ww + 34
            k += 1
        y += wh + 36


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
    gold_soft = (255, 246, 214)
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font
    kabir_col = K.ROAD

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

    def lamp_row(lcx, lcy, r, bits, gap, tags=None, digits=True, under=None, n_tags=3):
        """Three bulbs. tags: list of values/'?' drawn above; digits: 0/1 under each bulb."""
        xs = [lcx + (i - 1) * gap for i in range(3)]
        for i, x in enumerate(xs):
            bulb(draw, x, lcy, r, bool(bits[i]), t + i * 0.2)
            if tags and i < n_tags:
                value_tag(draw, x, lcy - r * 2.05 - 66, tags[i], PLACE_COLS[i] if tags[i] != "?" else coral)
            if under:
                K.text_at(draw, under[i], x, lcy + r * 1.62, font(max(30, int(r * 0.6)), bold=True), muted)
            elif digits:
                K.text_at(draw, str(bits[i]), x, lcy + r * 1.6, font(max(32, int(r * 0.85)), bold=True),
                          coral if bits[i] else muted)
        return xs

    def sum_line(xs, y, parts, total, size=76, n_show=None, total_col=None):
        """parts under each bulb x, '+' between, '= total' to the right."""
        f = font(size, bold=True)
        items = []
        for i, p in enumerate(parts):
            items.append((xs[i], str(p), ink))
            if i < 2:
                items.append(((xs[i] + xs[i + 1]) / 2, "+", muted))
        gap = xs[1] - xs[0]
        items.append((xs[2] + gap * 0.5, "=", muted))
        items.append((xs[2] + gap * 0.95, str(total), total_col or coral))
        for k, (x, txt, col) in enumerate(items):
            if n_show is not None and k >= n_show:
                break
            K.text_at(draw, txt, x, y, f, col)

    def night_scene(bits, kabir_thought=False):
        night_panel(draw, (120, 236, 1800, 866), t)
        building(draw, 200, 330, 790, 866, WALL_A, WALL_A_DARK, 1)
        wx0, wy0, wx1, wy1 = 270, 400, 720, 610
        draw.rectangle((wx0 - 14, wy0 - 14, wx1 + 14, wy1 + 14), fill=WALL_A_DARK)
        draw.rectangle((wx0, wy0, wx1, wy1), fill=(60, 52, 70))
        lamp_row((wx0 + wx1) / 2, 500, 44, bits, 140, digits=False)
        building(draw, 1180, 380, 1720, 866, WALL_B, WALL_B_DARK, 3)
        kx0, ky0, kx1, ky1 = 1270, 440, 1630, 690
        draw.rectangle((kx0 - 14, ky0 - 14, kx1 + 14, ky1 + 14), fill=WALL_B_DARK)
        draw.rectangle((kx0, ky0, kx1, ky1), fill=WINDOW_LIT)
        kid(draw, (kx0 + kx1) / 2, 560, 0.72, kabir_col, t, bun=False)
        draw.rectangle((kx0, ky1 - 26, kx1, ky1), fill=WALL_B_DARK)
        draw.polygon([(790, 866), (1180, 866), (1120, 760), (850, 760)], fill=(70, 78, 100))
        K.draw_dashed(draw, 985, 770, 985, 860, (240, 230, 200), width=6, dash=18, gap=14)
        if bits and any(bits):
            for k in range(3):
                a = ((t * 2 + k / 3) % 1)
                x = K.lerp(740, 1250, a)
                y = K.lerp(500, 540, a) - 50 * math.sin(a * math.pi)
                draw.ellipse((x - 10, y - 10, x + 10, y + 10), fill=K.GOLD)
        if kabir_thought:
            bx = (840, 270, 1240, 560)
            draw.ellipse((bx[0] + 8, bx[1] + 10, bx[2] + 8, bx[3] + 10), fill=NIGHT_DEEP)
            draw.ellipse(bx, fill=(255, 255, 255))
            for k, r in enumerate((20, 13)):
                px, py = K.lerp(1180, 1290, (k + 1) / 3), K.lerp(540, 480, (k + 1) / 3)
                draw.ellipse((px - r, py - r, px + r, py + r), fill=(255, 255, 255))
            laddoo_plate(draw, 1040, 470, 5, 28)
            K.text_at(draw, "5!", 1040, 312, font(64, bold=True), coral)

    # ---- opening -----------------------------------------------------------------
    if visual == "c1-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            kid(draw, cx + 300, 430, 1.3, coral, t, flower=True)
            K.text_at(draw, "Welcome, champ!", cx, 730, font(64, bold=True), ink)
            star_spots([(cx - 580, 320), (cx + 580, 320), (cx - 660, 540), (cx + 660, 540)])
            return True
        if focus == "track":
            K.text_at(draw, "Something new:", cx, 240 + lift, font(44, bold=True), muted)
            K.text_at(draw, "the Maths track!", cx, 298 + lift, font(80, bold=True), coral)
            specs = [("Computers", blue_soft, False), ("AI", lav_soft, False), ("Maths", gold_soft, True)]
            for i, (lab, soft, hot) in enumerate(specs):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                y0 = 440 + int((1 - a) * 40) - (int(8 * pulse) if hot else 0)
                draw.rounded_rectangle((x - 210 + 10, y0 + 12, x + 210 + 10, y0 + 400 + 12), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((x - 210, y0, x + 210, y0 + 400), radius=36, fill=soft,
                                       outline=coral if hot else line, width=6 if hot else 3)
                iy = y0 + 170
                if i == 0:
                    K.draw_device(draw, "laptop", x, iy + 10, 0.6, brand, t=t)
                elif i == 1:
                    K.draw_robot(draw, x, iy + 40, 0.42, t, mood="happy")
                else:
                    for k, (d, col) in enumerate((("1", coral), ("2", sage), ("3", K.BOTH_COLOR))):
                        bx = x - 130 + k * 90
                        draw.rounded_rectangle((bx - 38, iy - 70 + (k % 2) * 30, bx + 38, iy + 10 + (k % 2) * 30),
                                               radius=16, fill=col)
                        K.text_at(draw, d, bx, iy - 64 + (k % 2) * 30, font(54, bold=True), (255, 255, 255))
                    mini_lamp(draw, x + 160, iy - 40, 22, True)
                    mini_lamp(draw, x + 160, iy + 30, 22, False)
                K.text_at(draw, lab, x, y0 + 300, font(48, bold=True), coral if hot else ink)
                if hot:
                    K.pill(draw, x + 150, y0 - 26, "NEW!", coral, size=30)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "NUMBERS COMPUTERS LOVE · CHAPTER 1", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Counting the Computer Way", cx, 362 + lift, font(82, bold=True), ink)
            bits = (1, 0, 1)
            for i in range(3):
                a = K.stagger(progress, i + 1, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 220
                y = 690 + int((1 - a) * 30)
                bulb(draw, x, y, 50, bool(bits[i]), t + i)
            return True
        # question
        a = K.stagger(progress, 0, step=0.2, speed=4)
        x0, y0 = 140, 260 + int((1 - a) * 30)
        draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 760 + 10, y0 + 560 + 12), radius=40, fill=K.SHADOW)
        draw.rounded_rectangle((x0, y0, x0 + 760, y0 + 560), radius=40, fill=coral_soft, outline=coral, width=5)
        K.text_at(draw, "We use 10 digits", x0 + 380, y0 + 36, font(50, bold=True), coral)
        for d in range(10):
            r_, c_ = divmod(d, 5)
            tx = x0 + 380 + (c_ - 2) * 136
            ty = y0 + 140 + r_ * 150
            draw.rounded_rectangle((tx - 56, ty, tx + 56, ty + 120), radius=22, fill=panel, outline=line, width=3)
            K.text_at(draw, str(d), tx, ty + 18, font(70, bold=True), ink)
        K.text_at(draw, "0 to 9", x0 + 380, y0 + 460, font(44, bold=True), muted)
        b = K.stagger(progress, 2, step=0.2, speed=4)
        if b > 0:
            x0, y0 = 1020, 260 + int((1 - b) * 30)
            draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 760 + 10, y0 + 560 + 12), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 760, y0 + 560), radius=40, fill=blue_soft, outline=K.ROAD, width=5)
            K.text_at(draw, "Computers use 2!", x0 + 380, y0 + 36, font(50, bold=True), K.ROAD)
            for k, d in enumerate(("0", "1")):
                tx = x0 + 380 + (k * 2 - 1) * 130
                draw.rounded_rectangle((tx - 100, y0 + 140, tx + 100, y0 + 380), radius=36, fill=panel, outline=K.ROAD,
                                       width=5)
                K.text_at(draw, d, tx, y0 + 170, font(150, bold=True), K.ROAD)
            K.text_at(draw, "Just 0 and 1", x0 + 380, y0 + 440, font(44, bold=True), muted)
            question_marks([(x0 + 80, y0 + 420), (x0 + 690, y0 + 420)], size=70)
        return True

    # ---- Meera and Kabir -----------------------------------------------------------
    if visual == "c1-hook":
        if focus == "meet":
            draw.ellipse((520 - 270, 540 - 270, 520 + 270, 540 + 270), fill=coral_soft)
            draw.ellipse((1400 - 270, 540 - 270, 1400 + 270, 540 + 270), fill=blue_soft)
            kid(draw, 520, 470, 1.6, coral, t, flower=True)
            kid(draw, 1400, 470, 1.6, kabir_col, t + 0.3, bun=False)
            K.pill(draw, 520, 736, "Meera, 9", coral, size=40)
            K.pill(draw, 1400, 736, "Kabir", kabir_col, size=40)
            K.draw_heart(draw, cx, 450 + bounce, 46, coral)
            K.text_at(draw, "best friends", cx, 530, font(36, bold=True), muted)
            return True
        if focus == "plan":
            bits = [(1, 0, 0), (0, 1, 0), (0, 0, 1), (1, 1, 0), (0, 1, 1)][int(t * 6) % 5]
            night_scene(bits)
            K.pill(draw, 985, 270, "Secret lamp signal!", coral, size=34)
            laddoo_plate(draw, 985, 420, 3, 26)
            question_marks([(1100, 360)], size=64)
            return True
        if focus == "puzzle":
            xs = [360, 600, 840]
            for i, x in enumerate(xs):
                on = (int(t * 6) + i) % 2 == 0
                bulb(draw, x, 470, 82, on, t + i)
                K.text_at(draw, "ON" if on else "OFF", x, 610, font(40, bold=True), coral if on else muted)
            K.text_at(draw, "Only ON or OFF", 600, 680, font(44, bold=True), ink)
            K.draw_stopwatch(draw, 600, 806, 44, progress, brand)
            K.shadow_card(draw, (1080, 270, 1760, 820), brand, radius=40, accent=coral)
            K.text_at(draw, "Send this number:", 1420, 340, font(42, bold=True), muted)
            K.text_at(draw, "5", 1420, 380, font(170, bold=True), coral)
            laddoo_plate(draw, 1420, 730, 5, 34)
            question_marks([(1000, 360), (1000, 620)], size=70)
            return True
        # tease
        draw.ellipse((560 - 280, 520 - 280, 560 + 280, 520 + 280), fill=blue_soft)
        K.draw_device(draw, "laptop", 560, 540, 1.2, brand, t=t)
        f = font(40, bold=True)
        for r_ in range(4):
            row = "".join("1" if (r_ * 5 + c + int(t * 20)) % 3 else "0" for c in range(9))
            K.text_at(draw, " ".join(row), 560, 420 + r_ * 50, f, K.BOT)
        K.text_at(draw, "Millions of times a second!", 560, 730, font(42, bold=True), coral)
        kid(draw, 1420, 450, 1.3, coral, t, flower=True)
        K.pill(draw, 1420, 680, "Meera's trick", sage, size=40)
        star_spots([(1150, 330), (1700, 330), (1720, 600)])
        return True

    # ---- switches inside -------------------------------------------------------------
    if visual == "c1-switch":
        if focus == "inside":
            K.draw_device(draw, "laptop", 400, 560, 1.0, brand, t=t)
            chip(draw, 400, 540, 0.62)
            zx, zy, zr = 1260, 580, 280
            draw.line((470, 500, zx - 200, zy - 196), fill=K.DEV_MID, width=4)
            draw.line((470, 580, zx - 200, zy + 196), fill=K.DEV_MID, width=4)
            draw.ellipse((zx - zr + 10, zy - zr + 12, zx + zr + 10, zy + zr + 12), fill=K.SHADOW)
            draw.ellipse((zx - zr, zy - zr, zx + zr, zy + zr), fill=(232, 240, 250), outline=K.DEV_DARK, width=8)
            for k in range(12):
                r_, c_ = divmod(k, 4)
                on = (k * 5 + int(t * 8)) % 3 != 0
                wall_switch(draw, zx + (c_ - 1.5) * 110, zy + (r_ - 1) * 130, 0.85, on)
            K.pill(draw, zx, 232, "Tiny on/off switches", K.BOTH_COLOR, size=32)
            return True
        if focus == "code":
            for k, (on, title, col, soft) in enumerate(((True, "ON = 1", sage, sage_soft),
                                                       (False, "OFF = 0", muted, (240, 238, 236)))):
                a = K.stagger(progress, k, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 180 if k == 0 else 1020
                y0 = 260 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 720 + 10, y0 + 580 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 580), radius=40, fill=soft, outline=col, width=5)
                wall_switch(draw, x0 + 200, y0 + 250, 2.0, on)
                bulb(draw, x0 + 500, y0 + 230, 86, on, t)
                K.text_at(draw, title, x0 + 360, y0 + 440, font(84, bold=True), col if on else ink)
            return True
        # everything
        specs = [("Games", "0110 1001"), ("Photos", "1011 0010"), ("Songs", "0101 1100")]
        for i, (lab, code) in enumerate(specs):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y0 = 240 + int((1 - a) * 30)
            draw.rounded_rectangle((x - 200 + 8, y0 + 10, x + 200 + 8, y0 + 300 + 10), radius=32, fill=K.SHADOW)
            draw.rounded_rectangle((x - 200, y0, x + 200, y0 + 300), radius=32, fill=panel, outline=line, width=3)
            if i == 0:
                gamepad(draw, x, y0 + 100, 0.9)
            elif i == 1:
                photo(draw, x, y0 + 100, 0.85)
            else:
                K.draw_notes(draw, x, y0 + 100, 1.2, t, K.BOTH_COLOR)
            K.text_at(draw, lab, x, y0 + 176, font(40, bold=True), ink)
            K.text_at(draw, code, x, y0 + 234, font(32, bold=True), K.BOT)
            K.draw_arrow(draw, x, y0 + 312, K.lerp(x, cx, 0.6), 640, muted, width=8, head=24)
        K.draw_device(draw, "laptop", cx, 770, 0.62, brand, t=t)
        f = font(30, bold=True)
        for r_ in range(2):
            row = " ".join("1" if (r_ * 3 + c + int(t * 16)) % 2 else "0" for c in range(7))
            K.text_at(draw, row, cx, 712 + r_ * 38, f, K.BOT)
        return True

    # ---- definition ---------------------------------------------------------------------
    if visual == "c1-define":
        if focus == "name":
            draw.rounded_rectangle((130, 280, 760, 800), radius=40, fill=gold_soft)
            lamp_row(445, 500, 62, (1, 0, 1), 190)
            a = K.ease_out_cubic(K.clamp01((progress - 0.3) * 2.5))
            if a > 0:
                K.draw_arrow(draw, 790, 540, 790 + 160 * a, 540, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.45) * 2.5))
            if b > 0:
                s = 0.8 + 0.2 * b
                mxc, myc = 1390, 540
                hw, hh = 400 * s, 200 * s
                K.shadow_card(draw, (mxc - hw, myc - hh, mxc + hw, myc + hh), brand, radius=40, outline=coral,
                              outline_w=6)
                K.text_at(draw, "It's called", mxc, myc - 150 * s, font(int(42 * s), bold=True), muted)
                K.text_at(draw, "BINARY", mxc, myc - 90 * s, font(int(116 * s), bold=True), coral)
                K.pill(draw, mxc, myc + 70 * s, "bi = two", sage, size=int(34 * s))
            return True
        if focus == "compare":
            K.text_at(draw, "Our numbers: 10 digits", cx, 236, font(44, bold=True), ink)
            for d in range(10):
                a = K.stagger(progress, d, step=0.03, speed=6)
                if a <= 0:
                    continue
                tx = cx + (d - 4.5) * 150
                ty = 310 + int((1 - a) * 20)
                draw.rounded_rectangle((tx - 62, ty, tx + 62, ty + 130), radius=24, fill=coral_soft, outline=coral,
                                       width=4)
                K.text_at(draw, str(d), tx, ty + 22, font(76, bold=True), coral)
            b = K.ease_out_cubic(K.clamp01((progress - 0.4) * 4))
            if b > 0:
                dy = int((1 - b) * 30)
                K.text_at(draw, "Binary: just 2 digits", cx, 520 + dy, font(44, bold=True), ink)
                for k, d in enumerate(("0", "1")):
                    tx = cx + (k * 2 - 1) * 260
                    draw.rounded_rectangle((tx - 90, 600 + dy, tx + 90, 800 + dy), radius=32, fill=blue_soft,
                                           outline=K.ROAD, width=5)
                    K.text_at(draw, d, tx, 622 + dy, font(130, bold=True), K.ROAD)
                    mini_lamp(draw, tx + (-200 if k == 0 else 200), 700 + dy, 40, k == 1)
                K.draw_check(draw, cx, 700 + dy, 40, sage)
            return True
        # bit
        draw.ellipse((520 - 240, 520 - 240, 520 + 240, 520 + 240), fill=gold_soft)
        bulb(draw, 520, 500, 104, True, t)
        K.pill(draw, 520, 700, "1 bit", coral, size=44)
        a = K.stagger(progress, 1, step=0.2, speed=4)
        if a > 0:
            xs = [1100, 1290, 1480]
            for i, x in enumerate(xs):
                bulb(draw, x, 460 + int((1 - a) * 20), 56, i != 1, t + i)
            draw.line((1040, 610, 1040, 630, 1540, 630, 1540, 610), fill=K.BOTH_COLOR, width=6)
            K.text_at(draw, "3 bits", 1290, 646, font(44, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "A bit = one 0 or 1", 1290, 740, font(46, bold=True), ink)
        return True

    # ---- fingers -------------------------------------------------------------------------
    if visual == "c1-fingers":
        if focus == "intro":
            draw.ellipse((560 - 280, 560 - 280, 560 + 280, 560 + 280), fill=coral_soft)
            hand(draw, 560, 790, 1.12, (1, 1, 1), coral)
            K.draw_arrow(draw, 860, 560, 1010, 560, coral, width=14, head=40)
            for i in range(3):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                wall_switch(draw, 1170 + i * 190, 500 + int((1 - a) * 20), 1.4, True)
            K.text_at(draw, "3 light switches", 1360, 640, font(52, bold=True), ink)
            return True
        if focus == "rule":
            for k, (bits, title, col, soft, on) in enumerate((((0, 1, 0), "UP = 1", sage, sage_soft, True),
                                                             ((0, 0, 0), "DOWN = 0", muted, (240, 238, 236), False))):
                a = K.stagger(progress, k, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 180 if k == 0 else 1020
                y0 = 250 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 720 + 10, y0 + 600 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 600), radius=40, fill=soft, outline=col, width=5)
                hand(draw, x0 + 250, y0 + 520, 0.95, bits, coral)
                K.text_at(draw, "1" if on else "0", x0 + 250, y0 + 30, font(90, bold=True), coral if on else muted)
                mini_lamp(draw, x0 + 560, y0 + 200, 50, on)
                K.text_at(draw, title, x0 + 560, y0 + 300, font(54, bold=True), col if on else ink)
                K.text_at(draw, "ON" if on else "OFF", x0 + 560, y0 + 380, font(40, bold=True), muted)
            return True
        # try
        for k, (bits, title) in enumerate((((0, 0, 0), "All down"), ((1, 1, 1), "All up"))):
            a = 1.0 if k == 0 else K.ease_out_cubic(K.clamp01((progress - 0.4) * 3))
            if a <= 0:
                continue
            x = 560 if k == 0 else 1360
            draw.ellipse((x - 250, 560 - 250 + int((1 - a) * 30), x + 250, 560 + 250 + int((1 - a) * 30)),
                         fill=coral_soft if k else (240, 238, 236))
            hand(draw, x, 800 + int((1 - a) * 30), 1.0, bits, coral)
            K.text_at(draw, "  ".join(str(b) for b in bits), x, 300, font(76, bold=True), coral if k else muted)
            K.text_at(draw, title, x, 236, font(40, bold=True), ink)
        if progress > 0.7:
            star_spots([(1700, 420), (1040, 420)])
        return True

    # ---- place values -------------------------------------------------------------------
    if visual == "c1-places":
        if focus == "intro":
            lamp_row(cx, 540, 80, (0, 0, 0), 320, tags=["?", "?", "?"], under=["left", "middle", "right"])
            K.text_at(draw, "Each place has a value", cx, 790, font(50, bold=True), ink)
            return True
        if focus == "values":
            n = 1 + int(K.clamp01(progress * 1.4) * 2.99)
            xs = lamp_row(cx, 500, 80, (1, 1, 1), 360, tags=PLACE_VALS, digits=False, n_tags=n)
            for i in range(n):
                laddoo_plate(draw, xs[i], 780, PLACE_VALS[i], 30)
            return True
        if focus == "rule":
            for k, (on, txt, sub, col, soft) in enumerate(((True, "+ 2", "ON: add its value", sage, sage_soft),
                                                          (False, "+ 0", "OFF: adds nothing", muted,
                                                           (240, 238, 236)))):
                a = K.stagger(progress, k, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 180 if k == 0 else 1020
                y0 = 250 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 720 + 10, y0 + 600 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 600), radius=40, fill=soft, outline=col, width=5)
                value_tag(draw, x0 + 220, y0 + 50, 2, PLACE_COLS[1])
                bulb(draw, x0 + 220, y0 + 290, 84, on, t)
                K.text_at(draw, txt, x0 + 530, y0 + 220, font(110, bold=True), col if on else muted)
                K.text_at(draw, sub, x0 + 360, y0 + 500, font(42, bold=True), ink)
            return True
        if focus == "meera":
            kid(draw, 220, 500, 0.9, coral, t, flower=True)
            xs = lamp_row(cx - 60, 450, 76, (1, 0, 1), 320, tags=PLACE_VALS)
            n = int(K.clamp01((progress - 0.2) * 1.8) * 7.99)
            sum_line(xs, 690, (4, 0, 1), 5, size=84, n_show=n)
            if n >= 7:
                draw.ellipse((xs[2] + 304 - 70, 690 - 6, xs[2] + 304 + 70, 690 + 134), outline=coral, width=6)
            return True
        # kabir
        night_scene((1, 0, 1), kabir_thought=True)
        return True

    # ---- counting 0 to 5 ----------------------------------------------------------------
    if visual == "c1-count":
        if focus == "zero":
            cur = 0
        elif focus == "onetwo":
            cur = 1 if progress < 0.5 else 2
        elif focus == "three":
            cur = 3
        elif focus == "fourfive":
            cur = 4 if progress < 0.5 else 5
        else:
            cur = min(5, int(progress * 7))
        grow = focus == "grow"
        draw.rounded_rectangle((110 + 10, 236 + 12, 760 + 10, 866 + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((110, 236, 760, 866), radius=36, fill=panel, outline=line, width=3)
        for n in range(6):
            if not grow and n > cur:
                break
            y = 262 + n * 100
            hot = n == cur
            if hot:
                draw.rounded_rectangle((130, y - 8, 740, y + 84), radius=26, fill=gold_soft)
            draw.ellipse((150, y, 226, y + 76), fill=coral if hot else muted)
            K.text_at(draw, str(n), 188, y + 8, font(50, bold=True), (255, 255, 255))
            bits = [(n >> 2) & 1, (n >> 1) & 1, n & 1]
            for i, b in enumerate(bits):
                mini_lamp(draw, 310 + i * 84, y + 38, 22, bool(b))
            K.text_at(draw, "".join(str(b) for b in bits), 620, y + 8, font(56, bold=True), ink if hot else muted)
        bits = [(cur >> 2) & 1, (cur >> 1) & 1, cur & 1]
        xs = lamp_row(1300, 470, 72, bits, 250, tags=PLACE_VALS, digits=False)
        parts = [PLACE_VALS[i] * bits[i] for i in range(3)]
        if grow:
            K.pill(draw, 1330, 610, "+1 laddoo each time!", sage, size=36)
        else:
            sum_line(xs, 600, parts, cur, size=64)
        if cur:
            laddoo_plate(draw, 1330, 810, cur, 26)
        else:
            draw.ellipse((1330 - 120, 810 - 36, 1330 + 120, 810 + 36), fill=K.STEEL, outline=K.STEEL_DARK, width=3)
            K.text_at(draw, "empty plate", 1330, 720, font(32, bold=True), muted)
        return True

    # ---- the place matters ----------------------------------------------------------------
    if visual == "c1-matters":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            for k, (bits, val) in enumerate((((0, 0, 1), 1), ((1, 0, 0), 4))):
                x0 = 150 if k == 0 else 1030
                K.shadow_card(draw, (x0, 270, x0 + 740, 790), brand, radius=36, outline=sage if ans else None,
                              outline_w=5 if ans else 3)
                xs = lamp_row(x0 + 370, 510, 58, bits, 200, tags=PLACE_VALS if ans else None)
                if ans:
                    K.text_at(draw, f"= {val}", x0 + 370, 676, font(72, bold=True), coral)
                else:
                    K.text_at(draw, "= ?", x0 + 370, 676, font(72, bold=True), muted)
                    hot = xs[2] if k == 0 else xs[0]
                    draw.ellipse((hot - 92, 510 - 92, hot + 92, 510 + 92), outline=K.GOLD, width=6)
            if ans:
                draw.line((cx - 34, 500, cx + 34, 500), fill=coral, width=12)
                draw.line((cx - 34, 540, cx + 34, 540), fill=coral, width=12)
                draw.line((cx + 26, 460, cx - 26, 580), fill=coral, width=10)
                K.pill(draw, cx, 198, "The place matters!", sage, size=34)
            else:
                question_marks([(cx, 440)], size=100)
            return True
        # like
        K.pill(draw, cx, 232, "Our numbers do it too!", K.BOTH_COLOR, size=32)
        for k, (digs, word) in enumerate(((("2", "3"), "twenty-three"), (("3", "2"), "thirty-two"))):
            a = K.stagger(progress, k, step=0.25, speed=4)
            if a <= 0:
                continue
            x = 520 if k == 0 else 1400
            y0 = 320 + int((1 - a) * 30)
            for j, d in enumerate(digs):
                tx = x + (j * 2 - 1) * 80
                draw.rounded_rectangle((tx - 70, y0, tx + 70, y0 + 160), radius=28,
                                       fill=lav_soft if j == 0 else coral_soft,
                                       outline=K.BOTH_COLOR if j == 0 else coral, width=5)
                K.text_at(draw, d, tx, y0 + 18, font(110, bold=True), K.BOTH_COLOR if j == 0 else coral)
            tens, ones = int(digs[0]), int(digs[1])
            gx = x - (tens * 44 + ones * 44 + 30) / 2
            for j in range(tens):
                sx = gx + j * 44
                draw.rectangle((sx, y0 + 210, sx + 34, y0 + 410), fill=K.BOTH_COLOR)
                for q in range(1, 10):
                    draw.line((sx, y0 + 210 + q * 20, sx + 34, y0 + 210 + q * 20), fill=lav_soft, width=2)
            for j in range(ones):
                sx = gx + tens * 44 + 30 + j * 44
                draw.rectangle((sx, y0 + 376, sx + 34, y0 + 410), fill=coral)
            K.text_at(draw, word, x, y0 + 440, font(42, bold=True), ink)
        if progress > 0.5:
            draw.line((cx - 34, 470, cx + 34, 470), fill=coral, width=12)
            draw.line((cx - 34, 510, cx + 34, 510), fill=coral, width=12)
            draw.line((cx + 26, 430, cx - 26, 550), fill=coral, width=10)
        return True

    # ---- light-reading game --------------------------------------------------------------------
    if visual == "c1-read":
        if focus in ("q1", "a1"):
            ans = focus == "a1"
            xs = lamp_row(cx - 120, 480, 86, (0, 1, 0), 320, tags=PLACE_VALS)
            if ans:
                sum_line(xs, 720, (0, 2, 0), 2, size=76)
                K.draw_check(draw, xs[2] + 450, 760, 34, sage)
                star_spots([(220, 400), (220, 700)])
            else:
                K.text_at(draw, "= ?", cx - 120, 720, font(80, bold=True), muted)
                K.draw_stopwatch(draw, 1640, 520, 60, progress, brand)
                K.pill(draw, 1640, 640, "What number?", coral, size=32)
            return True
        ans = focus == "a2"
        K.shadow_card(draw, (150, 290, 590, 800), brand, radius=36, accent=coral)
        K.text_at(draw, "Show", 370, 370, font(44, bold=True), muted)
        K.text_at(draw, "4", 370, 410, font(170, bold=True), coral)
        laddoo_plate(draw, 370, 720, 4, 30)
        bits = (1, 0, 0) if ans else (0, 0, 0)
        xs = lamp_row(1210, 480, 80, bits, 320, tags=PLACE_VALS, digits=ans)
        if ans:
            sum_line([x - 60 for x in xs], 720, (4, 0, 0), 4, size=72)
        else:
            for x in xs:
                K.text_at(draw, "?", x, 610, font(70, bold=True), K.GOLD)
            K.text_at(draw, "Which lights go ON?", 1210, 740, font(48, bold=True), ink)
            K.draw_stopwatch(draw, 1700, 790, 40, progress, brand)
        return True

    # ---- what comes next -------------------------------------------------------------------------
    if visual == "c1-next":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            seq = [1, 2, 3, 4]
            cw, gap = 330, 60
            x_start = cx - (4 * cw + 3 * gap) / 2
            for i, n in enumerate(seq):
                x0 = x_start + i * (cw + gap)
                mx = x0 + cw / 2
                if i == 3 and not ans:
                    draw.rounded_rectangle((x0, 300, x0 + cw, 760), radius=30, fill=coral_soft)
                    dashed_box((x0, 300, x0 + cw, 760), coral)
                    K.text_at(draw, "?", mx, 410, font(int(150 + 20 * pulse), bold=True), coral)
                    continue
                win = i == 3
                K.shadow_card(draw, (x0, 300, x0 + cw, 760), brand, radius=30, outline=sage if win else None,
                              outline_w=6 if win else 3)
                bits = [(n >> 2) & 1, (n >> 1) & 1, n & 1]
                for j, b in enumerate(bits):
                    mini_lamp(draw, mx + (j - 1) * 90, 420, 32, bool(b))
                K.text_at(draw, "".join(str(b) for b in bits), mx, 510, font(72, bold=True), ink)
                K.text_at(draw, f"= {n}", mx, 630, font(52, bold=True), coral if win else muted)
                if win:
                    K.draw_check(draw, x0 + cw - 34, 334, 26, sage)
                if i < 3:
                    K.draw_arrow(draw, x0 + cw + 8, 530, x0 + cw + gap - 8, 530, muted, width=8, head=22)
            if ans:
                K.pill(draw, cx, 790, "3 + 1 = 4 → 100", sage, size=36)
            else:
                K.pill(draw, cx - 50, 790, "What comes next?", coral, size=36)
                K.draw_stopwatch(draw, cx + 250, 826, 34, progress, brand)
            return True
        # trap
        kid(draw, 280, 500, 1.1, coral, t, flower=True)
        question_marks([(430, 340)], size=70)
        for k, d in enumerate(("0", "1", "2")):
            x = 820 + k * 300
            bad = d == "2"
            draw.rounded_rectangle((x - 110 + 8, 300 + 10, x + 110 + 8, 560 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x - 110, 300, x + 110, 560), radius=36, fill=K.DANGER_SOFT if bad else blue_soft,
                                   outline=K.DANGER if bad else K.ROAD, width=6)
            K.text_at(draw, d, x, 330, font(150, bold=True), K.DANGER if bad else K.ROAD)
            if bad:
                draw.line((x - 90, 320, x + 90, 540), fill=K.DANGER, width=16)
                draw.line((x + 90, 320, x - 90, 540), fill=K.DANGER, width=16)
            else:
                K.draw_check(draw, x + 90, 316, 28, sage)
        K.text_at(draw, "No digit 2 in binary!", 1120, 640, font(60, bold=True), K.DANGER)
        K.text_at(draw, "Only 0 and 1", 1120, 730, font(44, bold=True), ink)
        return True

    # ---- checkpoint ----------------------------------------------------------------------------------
    if visual == "c1-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Show 3 with lights!", cx, 450 + lift, font(64, bold=True), ink)
            for i in range(3):
                x = cx + (i - 1) * 170
                draw.ellipse((x - 54, 600 + lift, x + 54, 708 + lift), outline=K.DEV_MID, width=6)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 236 + 12, 1260 + 10, 866 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 236, 1260, 866), radius=24, fill=PAPER)
        K.text_at(draw, "Show 3 using three lights", 695, 262, font(48, bold=True), coral)
        bits = (0, 1, 1)
        for i in range(3):
            x = 380 + i * 315
            if ans:
                on = bits[i] == 1
                if on:
                    draw.ellipse((x - 106, 488 - 106, x + 106, 488 + 106), fill=GLOW_2)
                draw.ellipse((x - 86, 402, x + 86, 574), fill=BULB_ON if on else PAPER, outline=K.DEV_DARK, width=6)
                value_tag(draw, x, 322, PLACE_VALS[i], PLACE_COLS[i], size=34)
                K.text_at(draw, str(bits[i]), x, 600, font(64, bold=True), coral if on else muted)
            else:
                draw.ellipse((x - 86, 402, x + 86, 574), outline=K.DEV_DARK, width=6)
                K.text_at(draw, "on or off?", x, 600, font(34, bold=True), muted)
        if ans:
            n = int(K.clamp01((progress - 0.2) * 1.6) * 5.99)
            items = [(530, "2", ink), (690, "+", muted), (850, "1", ink), (1010, "=", muted), (1140, "3", coral)]
            for k, (x, txt, col) in enumerate(items[:n]):
                K.text_at(draw, txt, x - 140, 720, font(84, bold=True), col)
        else:
            for i in range(2):
                draw.line((180, 740 + i * 70, 1210, 740 + i * 70), fill=(220, 210, 232), width=3)
        kid(draw, 1540, 500, 1.3, coral, t, flower=True)
        if ans:
            K.draw_heart(draw, 1720, 350 + bounce, 30, coral)
            star_spots([(1370, 330), (1730, 700)])
        else:
            question_marks([(1720, 320)], size=80)
            K.draw_stopwatch(draw, 1540, 790, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------------------
    if visual == "c1-recap":
        recap = [(("Binary: only", "0 and 1"), coral, "digits"), (("ON = 1", "OFF = 0"), sage, "switch"),
                 (("Places worth", "4, 2, 1"), K.BOTH_COLOR, "places"), (("3 = 011", "5 = 101"), K.ROAD, "nums")]
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
                if kind == "digits":
                    for k, d in enumerate(("0", "1")):
                        tx = ix + (k * 2 - 1) * 75
                        draw.rounded_rectangle((tx - 60, iy - 90, tx + 60, iy + 60), radius=24, fill=blue_soft,
                                               outline=K.ROAD, width=4)
                        K.text_at(draw, d, tx, iy - 80, font(100, bold=True), K.ROAD)
                elif kind == "switch":
                    wall_switch(draw, ix - 80, iy - 40, 1.0, True)
                    wall_switch(draw, ix + 80, iy - 40, 1.0, False)
                    K.text_at(draw, "1", ix - 80, iy + 40, font(56, bold=True), sage)
                    K.text_at(draw, "0", ix + 80, iy + 40, font(56, bold=True), muted)
                elif kind == "places":
                    for k in range(3):
                        bx = ix + (k - 1) * 110
                        value_tag(draw, bx, iy - 120, PLACE_VALS[k], PLACE_COLS[k], size=34)
                        mini_lamp(draw, bx, iy + 10, 30, True)
                else:
                    for r_, num in enumerate((3, 5)):
                        bits = [(num >> 2) & 1, (num >> 1) & 1, num & 1]
                        for k, b in enumerate(bits):
                            mini_lamp(draw, ix - 90 + k * 90, iy - 70 + r_ * 110, 24, bool(b))
                label_f = font(40, bold=True)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 50, label_f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, coral, t, flower=True)
            K.text_at(draw, "Chapter 1 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Binary counter", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
