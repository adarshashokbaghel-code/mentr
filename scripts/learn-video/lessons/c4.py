"""C4 · Skip Counting & Sequences — visuals."""
import math

import build as K

COIN = (246, 200, 70)
COIN_DARK = (204, 148, 30)
COIN_INK = (130, 86, 10)
CLAY = (200, 104, 62)
CLAY_DARK = (156, 72, 40)
STICK = (236, 198, 136)
STICK_DARK = (186, 140, 80)
BAND = (220, 48, 72)
WATER = (150, 204, 240)
STONE = (170, 176, 186)
STONE_DARK = (130, 136, 148)
FROG = (96, 182, 86)
FROG_DARK = (62, 140, 58)
BOARD = (34, 92, 70)
BOARD_DARK = (22, 66, 50)
WOOD = (214, 170, 120)
WOOD_DARK = (170, 124, 78)
TENS = K.ROAD
ONES = (13, 148, 136)
CHAPPAL = [((230, 80, 90), (180, 50, 60)), ((70, 130, 220), (40, 90, 170)), ((250, 180, 40), (200, 130, 20)),
           ((120, 190, 110), (80, 140, 70)), ((180, 110, 210), (130, 70, 160)), ((240, 130, 60), (190, 90, 30))]


def S_(s):
    return lambda v: v * s


def ctext(draw, text, cx, cy, size, col, bold=True):
    f = K.load_font(int(size), bold=bold)
    b = draw.textbbox((0, 0), text, font=f)
    draw.text((cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2), text, font=f, fill=col)


def hair_flower(draw, cx, cy, r, col):
    for k in range(5):
        a = k * math.tau / 5
        px, py = cx + math.cos(a) * r * 0.6, cy + math.sin(a) * r * 0.6
        draw.ellipse((px - r * 0.5, py - r * 0.5, px + r * 0.5, py + r * 0.5), fill=col)
    draw.ellipse((cx - r * 0.35, cy - r * 0.35, cx + r * 0.35, cy + r * 0.35), fill=K.GOLD)


def kid(draw, cx, cy, s, body, t=0.0, bun=True, hat=False):
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
    if bun:
        hair_flower(draw, cx + r * 0.75, cy - r * 0.8, r * 0.32, (238, 104, 158))
    if hat:
        draw.polygon([(cx - r * 0.6, cy - r * 0.85), (cx + r * 0.5, cy - r * 0.95), (cx - r * 0.1, cy - r * 2.0)],
                     fill=K.BOTH_COLOR)
        for k in range(3):
            f = (k + 1) / 4
            px = K.lerp(cx - r * 0.55, cx - r * 0.1, f)
            draw.ellipse((px - r * 0.08 + r * 0.25 * (1 - f), cy - r * 0.9 - r * f - r * 0.08,
                          px + r * 0.08 + r * 0.25 * (1 - f), cy - r * 0.9 - r * f + r * 0.08), fill=K.GOLD)
        draw.ellipse((cx - r * 0.1 - r * 0.14, cy - r * 2.0 - r * 0.14, cx - r * 0.1 + r * 0.14, cy - r * 2.0 + r * 0.14),
                     fill=K.GOLD)


def coin(draw, cx, cy, r, label="5"):
    draw.ellipse((cx - r + r * 0.1, cy - r + r * 0.14, cx + r + r * 0.1, cy + r + r * 0.14), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=COIN_DARK)
    draw.ellipse((cx - r * 0.88, cy - r * 0.9, cx + r * 0.86, cy + r * 0.84), fill=COIN)
    draw.ellipse((cx - r * 0.7, cy - r * 0.72, cx + r * 0.68, cy + r * 0.66), outline=COIN_DARK,
                 width=max(2, int(r * 0.06)))
    if label and r >= 22:
        ctext(draw, label, cx, cy - r * 0.03, max(26, r * 0.95), COIN_INK)
    draw.arc((cx - r * 0.8, cy - r * 0.82, cx + r * 0.2, cy + r * 0.2), 200, 250, fill=(255, 236, 170),
             width=max(2, int(r * 0.1)))


def gullak(draw, cx, cy, s, broken=False):
    S = S_(s)
    draw.ellipse((cx - S(150), cy + S(100), cx + S(150), cy + S(140)), fill=K.SHADOW)
    draw.ellipse((cx - S(140), cy - S(100), cx + S(140), cy + S(130)), fill=CLAY)
    draw.ellipse((cx - S(110), cy - S(70), cx + S(30), cy + S(40)), fill=(220, 130, 86))
    if broken:
        draw.polygon([(cx - S(90), cy - S(82)), (cx - S(50), cy - S(40)), (cx - S(10), cy - S(78)), (cx + S(30), cy - S(36)),
                      (cx + S(70), cy - S(80)), (cx + S(96), cy - S(70)), (cx + S(60), cy - S(110)),
                      (cx - S(60), cy - S(112))], fill=K.hex_rgb("#FFF8EF"))
        draw.line([(cx - S(90), cy - S(82)), (cx - S(50), cy - S(40)), (cx - S(10), cy - S(78)), (cx + S(30), cy - S(36)),
                   (cx + S(70), cy - S(80)), (cx + S(96), cy - S(70))], fill=CLAY_DARK, width=max(2, int(S(6))))
        for dx, dy in ((-175, 128), (170, 132)):
            px, py = cx + S(dx), cy + S(dy)
            draw.polygon([(px - S(24), py), (px + S(20), py - S(12)), (px + S(14), py + S(10))], fill=CLAY_DARK)
    else:
        draw.rounded_rectangle((cx - S(60), cy - S(130), cx + S(60), cy - S(90)), radius=S(14), fill=CLAY_DARK)
        draw.rounded_rectangle((cx - S(40), cy - S(118), cx + S(40), cy - S(104)), radius=S(6), fill=K.DEV_DEEP)
    for k in range(3):
        yy = cy + S(10) + k * S(36)
        draw.arc((cx - S(130), yy - S(60), cx + S(130), yy + S(60)), 20, 160, fill=CLAY_DARK, width=max(2, int(S(4))))


def stick(draw, x, cy, s, h=100):
    S = S_(s)
    draw.line((x, cy - S(h), x, cy + S(h)), fill=STICK_DARK, width=max(3, int(S(17))))
    for yy in (cy - S(h), cy + S(h)):
        draw.ellipse((x - S(8.5), yy - S(8.5), x + S(8.5), yy + S(8.5)), fill=STICK_DARK)
    draw.line((x, cy - S(h) + S(2), x, cy + S(h) - S(2)), fill=STICK, width=max(2, int(S(11))))


def bundle(draw, cx, cy, s, h=100):
    S = S_(s)
    for i in range(10):
        stick(draw, cx + (i - 4.5) * S(15), cy, s, h)
    draw.rounded_rectangle((cx - S(82), cy - S(13), cx + S(82), cy + S(13)), radius=S(10), fill=BAND)


def chappal(draw, cx, cy, s, col, dark):
    S = S_(s)
    for sx in (-1, 1):
        x = cx + sx * S(40)
        draw.ellipse((x - S(32) + S(6), cy - S(80) + S(8), x + S(32) + S(6), cy + S(80) + S(8)), fill=K.SHADOW)
        draw.ellipse((x - S(32), cy - S(80), x + S(32), cy + S(80)), fill=dark)
        draw.ellipse((x - S(26), cy - S(74), x + S(26), cy + S(72)), fill=col)
        draw.line([(x - S(28), cy + S(4)), (x, cy - S(46)), (x + S(28), cy + S(4))], fill=dark, width=max(3, int(S(10))),
                  joint="curve")
        draw.ellipse((x - S(6), cy - S(52), x + S(6), cy - S(40)), fill=dark)


def frog(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.ellipse((cx - S(60), cy + S(20), cx + S(60), cy + S(44)), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(46) - S(26), cy + S(4), cx + sx * S(46) + S(26), cy + S(40)), fill=FROG_DARK)
    draw.ellipse((cx - S(56), cy - S(44), cx + S(56), cy + S(34)), fill=FROG)
    for sx in (-1, 1):
        ex = cx + sx * S(28)
        draw.ellipse((ex - S(20), cy - S(68), ex + S(20), cy - S(28)), fill=FROG)
        draw.ellipse((ex - S(12), cy - S(60), ex + S(12), cy - S(36)), fill=(255, 255, 255))
        draw.ellipse((ex - S(6), cy - S(54), ex + S(6), cy - S(42)), fill=K.DEV_DEEP)
    draw.arc((cx - S(28), cy - S(20), cx + S(28), cy + S(10)), 20, 160, fill=FROG_DARK, width=max(2, int(S(5))))
    draw.ellipse((cx - S(30), cy - S(4), cx + S(30), cy + S(26)), fill=(196, 230, 160))


def hand(draw, cx, cy, s, n_up, thumb_side, col_up):
    """Open hand. thumb_side=+1 thumb on right. Fingers raised in left-to-right order. Returns tip points."""
    S = S_(s)
    fingers = [(-54, 100), (-18, 124), (18, 118), (54, 94)]
    order = []
    if thumb_side < 0:
        order.append(("thumb", None))
    order += [("finger", f) for f in fingers]
    if thumb_side > 0:
        order.append(("thumb", None))
    tips = []
    draw.rounded_rectangle((cx - S(78) + S(8), cy - S(24) + S(10), cx + S(78) + S(8), cy + S(116) + S(10)),
                           radius=S(36), fill=K.SHADOW)
    for k, (kind, f) in enumerate(order):
        up = k < n_up
        col = col_up if up else K.SKIN
        if kind == "finger":
            dx, hh = f
            x = cx + S(dx)
            top = cy - S(hh if up else 22)
            draw.rounded_rectangle((x - S(17), top, x + S(17), cy + S(20)), radius=S(16), fill=col,
                                   outline=(214, 160, 124), width=max(1, int(S(3))))
            tips.append((x, top))
        else:
            bx, by = cx + thumb_side * S(64), cy + S(64)
            ex, ey = (cx + thumb_side * S(132), cy - S(10)) if up else (cx + thumb_side * S(70), cy + S(20))
            draw.line((bx, by, ex, ey), fill=(214, 160, 124), width=max(3, int(S(40))))
            draw.line((bx, by, ex, ey), fill=col, width=max(3, int(S(33))))
            draw.ellipse((ex - S(17), ey - S(17), ex + S(17), ey + S(17)), fill=col)
            tips.append((ex, ey - S(18)))
    draw.rounded_rectangle((cx - S(78), cy - S(24), cx + S(78), cy + S(116)), radius=S(36), fill=K.SKIN)
    draw.arc((cx - S(40), cy + S(20), cx + S(40), cy + S(80)), 200, 340, fill=(214, 160, 124), width=max(2, int(S(4))))
    for k, (kind, f) in enumerate(order):
        if k < n_up or kind != "finger":
            continue
        x = cx + S(f[0])
        draw.rounded_rectangle((x - S(17), cy - S(34), x + S(17), cy + S(14)), radius=S(16), fill=K.SKIN,
                               outline=(214, 160, 124), width=max(1, int(S(3))))
    return tips


def bat(draw, x, y, s, ang):
    S = S_(s)
    ca, sa = math.cos(ang), math.sin(ang)

    def P(px, py):
        return (x + px * ca - py * sa, y + px * sa + py * ca)
    draw.polygon([P(-S(8), 0), P(S(8), 0), P(S(8), -S(60)), P(-S(8), -S(60))], fill=K.DEV_DARK)
    draw.polygon([P(-S(20), -S(60)), P(S(20), -S(60)), P(S(18), -S(250)), P(-S(18), -S(250))], fill=WOOD,
                 outline=WOOD_DARK)


def stumps(draw, cx, by, s):
    S = S_(s)
    for k in (-1, 0, 1):
        x = cx + k * S(22)
        draw.rounded_rectangle((x - S(6), by - S(150), x + S(6), by), radius=S(4), fill=WOOD, outline=WOOD_DARK)
    draw.rectangle((cx - S(30), by - S(156), cx + S(30), by - S(148)), fill=WOOD_DARK)


def ball(draw, cx, cy, r):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(200, 40, 50))
    draw.arc((cx - r * 0.7, cy - r, cx + r * 0.7, cy + r), 70, 110, fill=(255, 255, 255), width=max(2, int(r * 0.15)))
    draw.arc((cx - r * 0.7, cy - r, cx + r * 0.7, cy + r), 250, 290, fill=(255, 255, 255), width=max(2, int(r * 0.15)))


def house(draw, cx, top, wd, ht, label, col, digit, ink):
    roof = wd * 0.38
    draw.polygon([(cx - wd / 2 - 18 + 8, top + roof + 10), (cx + 8, top + 10), (cx + wd / 2 + 18 + 8, top + roof + 10)],
                 fill=K.SHADOW)
    draw.rectangle((cx - wd / 2 + 8, top + roof + 10, cx + wd / 2 + 8, top + ht + 10), fill=K.SHADOW)
    draw.rectangle((cx - wd / 2, top + roof - 2, cx + wd / 2, top + ht), fill=(255, 255, 255), outline=col, width=5)
    draw.polygon([(cx - wd / 2 - 18, top + roof), (cx, top), (cx + wd / 2 + 18, top + roof)], fill=col)
    ctext(draw, label, cx, top + roof * 0.68, 28, (255, 255, 255))
    ctext(draw, digit, cx, top + roof + (ht - roof) / 2, int((ht - roof) * 0.6), ink)


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

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            ctext(draw, "?", qx, qy, int(size + 22 * (pulse if k % 2 else 1 - pulse)), K.GOLD)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def hop(xa, xb, y, height, col, label=None, width=6, lsize=30, dashed=False):
        p0, p1, p2 = (xa, y), ((xa + xb) / 2, y - 2 * height), (xb, y)
        K.draw_curve(draw, p0, p1, p2, col, width=width, dashed=dashed, phase=progress * 100)
        ang = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
        hd = 18
        draw.polygon([(xb, y), (xb - hd * math.cos(ang - 0.45), y - hd * math.sin(ang - 0.45)),
                      (xb - hd * math.cos(ang + 0.45), y - hd * math.sin(ang + 0.45))], fill=col)
        if label:
            ctext(draw, label, (xa + xb) / 2, y - height - lsize * 0.9, lsize, col)

    def tile(x, y0, wd, ht, text, col=None, state="normal", size=None):
        x0, x1, y1 = x - wd / 2, x + wd / 2, y0 + ht
        if state == "missing":
            draw.rounded_rectangle((x0, y0, x1, y1), radius=24, fill=coral_soft)
            dashed_box((x0, y0, x1, y1), coral, width=4)
            ctext(draw, "?", x, y0 + ht / 2, int((size or ht * 0.55) + 12 * pulse), coral)
            return
        out = sage if state == "win" else K.DANGER if state == "bad" else (col or line)
        draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((x0, y0, x1, y1), radius=24, fill=sage_soft if state == "win" else panel, outline=out,
                               width=6 if state != "normal" or col else 3)
        ctext(draw, text, x, y0 + ht / 2, size or ht * 0.5, col or ink)

    def number_line(x0, x1, y, lo, hi, label_every=1, size=36, tick_every=1, hl=()):
        draw.line((x0 - 30, y, x1 + 30, y), fill=ink, width=6)
        draw.polygon([(x1 + 50, y), (x1 + 26, y - 14), (x1 + 26, y + 14)], fill=ink)
        unit_px = (x1 - x0) / (hi - lo)
        for v in range(lo, hi + 1, tick_every):
            x = x0 + (v - lo) * unit_px
            big = (v - lo) % label_every == 0
            draw.line((x, y - (16 if big else 10), x, y + (16 if big else 10)), fill=ink, width=4 if big else 3)
            if big:
                if v in hl:
                    draw.ellipse((x - size * 0.75, y + 22, x + size * 0.75, y + 22 + size * 1.5), fill=coral)
                    ctext(draw, str(v), x, y + 22 + size * 0.75, size, (255, 255, 255))
                else:
                    ctext(draw, str(v), x, y + 22 + size * 0.75, size, ink)
        return lambda v: x0 + (v - lo) * unit_px

    def loop_ring(x, y, r, col, rot=0.0, width=14):
        a0 = rot * 360
        draw.arc((x - r, y - r, x + r, y + r), a0 + 20, a0 + 330, fill=col, width=width)
        ang = math.radians(a0 + 330)
        ex, ey = x + r * math.cos(ang), y + r * math.sin(ang)
        tx, ty = -math.sin(ang), math.cos(ang)
        hd = width * 2.6
        draw.polygon([(ex + tx * hd, ey + ty * hd), (ex + math.cos(ang) * hd * 0.7, ey + math.sin(ang) * hd * 0.7),
                      (ex - math.cos(ang) * hd * 0.7, ey - math.sin(ang) * hd * 0.7)], fill=col)

    def notebook(title):
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, title, 695, 256, font(46, bold=True), coral)

    # ---- opening -----------------------------------------------------------
    if visual == "c4-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 460, 110, sage, panel, bounce)
            kid(draw, cx + 300, 440, 1.3, coral, t)
            K.text_at(draw, "Welcome back, champ!", cx, 720, font(60, bold=True), ink)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (220, 240 + lift, w - 220, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · PLACE VALUE", cx, 300 + lift, font(34, bold=True), sage)
            for i in range(4):
                a = K.stagger(progress, i, step=0.06, speed=5)
                if a > 0:
                    bundle(draw, 380 + i * 150, 520 + lift + int((1 - a) * 30), 0.85)
            for j in range(7):
                a = K.stagger(progress, 4 + j, step=0.04, speed=5)
                if a > 0:
                    stick(draw, 950 + j * 44, 520 + lift + int((1 - a) * 30), 0.85)
            K.text_at(draw, "4 tens", 605, 640 + lift, font(40, bold=True), TENS)
            K.text_at(draw, "7 ones", 1082, 640 + lift, font(40, bold=True), ONES)
            house(draw, 1400, 400 + lift, 160, 220, "Tens", TENS, "4", ink)
            house(draw, 1580, 400 + lift, 160, 220, "Ones", ONES, "7", ink)
            ctext(draw, "= 47", 1490, 720 + lift, 80, ink)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Skip Counting & Sequences", cx, 360 + lift, font(80, bold=True), ink)
            pos = number_line(420, 1500, 720, 0, 10, size=34)
            for k in range(5):
                a = K.stagger(progress, k + 1, step=0.1, speed=5)
                if a > 0:
                    hop(pos(2 * k), pos(2 * k) + (pos(2 * k + 2) - pos(2 * k)) * a, 700, 70, coral,
                        "+2" if a >= 1 else None)
            return True
        # challenge
        K.text_at(draw, "Count to 50", cx, 250 + lift, font(80, bold=True), ink)
        K.text_at(draw, "in just 10 jumps?", cx, 350 + lift, font(64, bold=True), coral)
        pos = number_line(220, 1640, 700, 0, 50, label_every=50, tick_every=5, size=40)
        for k in range(10):
            a = K.stagger(progress, k, step=0.05, speed=6)
            if a > 0:
                hop(pos(5 * k), pos(5 * k + 5), 680, 60 * a, K.BOTH_COLOR, "?" if a >= 1 else None, dashed=True,
                    lsize=34)
        fx = pos(50)
        draw.line((fx, 690, fx, 520), fill=K.DEV_DARK, width=8)
        draw.polygon([(fx, 520), (fx + 90, 550), (fx, 580)], fill=coral)
        star_spots([(fx + 140, 470), (300, 520)])
        return True

    # ---- Meera's gullak -----------------------------------------------------
    if visual == "c4-hook":
        if focus == "meet":
            gullak(draw, 560, 520, 1.3, broken=True)
            spots = [(300, 780), (420, 820), (540, 770), (660, 815), (780, 775), (360, 700), (880, 820), (240, 830),
                     (600, 700), (750, 690)]
            for k, (x, y) in enumerate(spots):
                a = K.stagger(progress, k, step=0.05, speed=5)
                if a <= 0:
                    continue
                yy = K.lerp(470, y, a) - 120 * math.sin(a * math.pi)
                coin(draw, K.lerp(560, x, a), yy, 38)
            kid(draw, 1150, 500, 1.1, coral, t, hat=True)
            kid(draw, 1520, 500, 1.1, K.ROAD, t + 0.3, bun=False, hat=True)
            K.text_at(draw, "Meera", 1150, 690, font(40, bold=True), coral)
            K.text_at(draw, "Kabir", 1520, 690, font(40, bold=True), K.ROAD)
            K.pill(draw, 1335, 770, "Happy birthday, Meera!", K.BOTH_COLOR, size=34)
            star_spots([(1000, 300), (1700, 300)])
            return True
        if focus == "slow":
            kid(draw, 260, 500, 1.0, coral, t)
            K.text_at(draw, "Meera", 260, 670, font(38, bold=True), coral)
            for c in range(2):
                x = 620 + c * 440
                coin(draw, x, 400, 90)
                for d in range(5):
                    n = c * 5 + d
                    a = K.stagger(progress, n, step=0.07, speed=6)
                    dx = x - 160 + d * 80
                    draw.ellipse((dx - 32, 560, dx + 32, 624), fill=coral if a > 0.5 else (236, 228, 216))
                    ctext(draw, str(n + 1), dx, 592, 32, (255, 255, 255) if a > 0.5 else muted)
            for k in range(8):
                coin(draw, 1500 + (k % 4) * 60, 380 + (k // 4) * 70 + (k % 2) * 10, 40)
            K.text_at(draw, "8 more coins…", 1590, 560, font(38, bold=True), muted)
            K.draw_snail(draw, 1590, 740, 0.9, brand)
            K.text_at(draw, "Phew! So slow…", 840, 700, font(48, bold=True), muted)
            return True
        if focus == "fast":
            kid(draw, 220, 500, 1.0, K.ROAD, t, bun=False)
            K.text_at(draw, "Kabir", 220, 670, font(38, bold=True), K.ROAD)
            for i in range(10):
                x = 480 + i * 132
                coin(draw, x, 480, 54)
                a = K.stagger(progress, i, step=0.07, speed=6)
                if a > 0:
                    if i > 0:
                        hop(x - 132, x, 410, 46, K.BOTH_COLOR, width=5)
                    K.pill(draw, x, 560 + int((1 - a) * 20), str(5 * (i + 1)), sage if i == 9 else K.BOTH_COLOR,
                           size=32)
            a = K.stagger(progress, 10, step=0.07, speed=4)
            if a > 0:
                K.pill(draw, 1074, 700, "50 rupees!", sage, size=44)
            return True
        if focus == "ask":
            kid(draw, 420, 520, 1.1, coral, t)
            kid(draw, 1500, 520, 1.1, K.ROAD, t + 0.3, bun=False)
            K.text_at(draw, "How did Kabir", cx, 250, font(60, bold=True), ink)
            K.text_at(draw, "count so fast?", cx, 330, font(60, bold=True), coral)
            for i in range(3):
                coin(draw, cx - 140 + i * 140, 520, 56)
            question_marks([(560, 360), (1360, 360)], size=80)
            K.draw_stopwatch(draw, cx, 740, 56, progress, brand)
            return True
        # answer
        pos = number_line(220, 1640, 680, 0, 50, label_every=5, tick_every=5, size=34)
        for k in range(10):
            a = K.stagger(progress, k, step=0.05, speed=6)
            if a <= 0:
                continue
            xa, xb = pos(5 * k), pos(5 * k + 5)
            hop(xa, K.lerp(xa, xb, a), 660, 70, coral, "+5" if a >= 1 else None, lsize=30)
            if a >= 1:
                coin(draw, xb, 470, 26, None)
        K.pill(draw, cx, 780, "10 jumps of 5 = 50", sage, size=40)
        K.text_at(draw, "Jump by 5 each time!", cx, 270, font(56, bold=True), ink)
        return True

    # ---- definition --------------------------------------------------------
    if visual == "c4-define":
        if focus == "name":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 470 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "SKIP COUNTING", cx, 296 + lift, font(36, bold=True), coral)
            K.text_at(draw, "Jump the same amount,", cx, 350 + lift, font(56, bold=True), ink)
            K.text_at(draw, "each time!", cx, 412 + lift, font(56, bold=True), sage)
            draw.rounded_rectangle((120, 640, 1800, 840), radius=60, fill=WATER)
            for k in range(3):
                yy = 690 + k * 50
                for x0 in range(180 + k * 60, 1760, 240):
                    draw.arc((x0, yy - 10, x0 + 60, yy + 10), 200, 340, fill=(255, 255, 255), width=4)
            xs = [300 + k * 330 for k in range(5)]
            for x in xs:
                draw.ellipse((x - 100, 690, x + 100, 760), fill=STONE_DARK)
                draw.ellipse((x - 100, 680, x + 100, 744), fill=STONE)
            hop_i = min(3, int(progress * 4.5))
            f = (progress * 4.5) % 1 if progress < 0.88 else 1.0
            for k in range(4):
                hop(xs[k] + 40, xs[k + 1] - 40, 650, 80, K.BOTH_COLOR, "same!" if k < hop_i or (k == hop_i and f >= 1.0) else None, width=5,
                    dashed=k > hop_i, lsize=30)
            fx = K.lerp(xs[hop_i], xs[hop_i + 1], K.ease_in_out(f))
            fy = 690 - 60 * math.sin(math.pi * K.ease_in_out(f))
            frog(draw, fx, fy, 0.9, t)
            return True
        if focus == "line":
            pos = number_line(260, 1660, 640, 0, 10, size=40, hl=tuple(2 * k for k in range(6)))
            n = int(K.clamp01(progress * 1.25) * 5 + 0.0001)
            f = (K.clamp01(progress * 1.25) * 5) % 1 if n < 5 else 1.0
            for k in range(5):
                if k < n:
                    hop(pos(2 * k), pos(2 * k + 2), 620, 110, coral, "+2", lsize=36)
                elif k == n:
                    hop(pos(2 * k), K.lerp(pos(2 * k), pos(2 * k + 2), f), 620, 110, coral)
            fv = 2 * min(n, 5) if n >= 5 else 2 * n + 2 * f
            fx = pos(fv)
            fy = 600 - (220 * math.sin(math.pi * f) if n < 5 else 0)
            frog(draw, fx, fy, 0.8, t)
            K.text_at(draw, "Every jump is the same size", cx, 790, font(46, bold=True), muted)
            return True
        # add
        eqs = ["0 + 2 = 2", "2 + 2 = 4", "4 + 2 = 6", "6 + 2 = 8", "8 + 2 = 10"]
        for i, e in enumerate(eqs):
            a = K.stagger(progress, i, step=0.1, speed=5)
            if a <= 0:
                continue
            y = 260 + i * 108 + int((1 - a) * 20)
            draw.rounded_rectangle((260, y, 900, y + 88), radius=44, fill=coral_soft if i % 2 == 0 else sage_soft)
            ctext(draw, e, 580, y + 44, 56, ink)
        loop_ring(1350, 520, 190, K.BOTH_COLOR, rot=progress * 0.6)
        ctext(draw, "+2", 1350, 520, 130, coral)
        K.text_at(draw, "again and again", 1350, 750, font(44, bold=True), K.BOTH_COLOR)
        return True

    # ---- by twos ---------------------------------------------------------------
    if visual == "c4-twos":
        if focus == "pairs":
            draw.rectangle((140 + 10, 250 + 12, 440 + 10, 860), fill=K.SHADOW)
            draw.rectangle((140, 250, 440, 860), fill=WOOD, outline=WOOD_DARK, width=8)
            draw.rectangle((180, 300, 400, 540), outline=WOOD_DARK, width=5)
            draw.rectangle((180, 580, 400, 820), outline=WOOD_DARK, width=5)
            draw.ellipse((376, 560, 404, 588), fill=K.GOLD)
            K.pill(draw, 290, 200 + 60, "Nani's door", K.BOTH_COLOR, size=30)
            draw.rounded_rectangle((520, 330, 1780, 860), radius=30, fill=(236, 214, 180))
            for k in range(6):
                r_, c_ = divmod(k, 3)
                x = 760 + c_ * 400
                y = 470 + r_ * 250
                col, dark = CHAPPAL[k]
                a = K.stagger(progress, k, step=0.1, speed=5)
                chappal(draw, x, y, 0.85, col, dark)
                if a > 0:
                    K.pill(draw, x + 140, y - 30 + int((1 - a) * 20), str(2 * (k + 1)), coral, size=40)
            return True
        if focus == "even":
            K.pill(draw, 330, 240, "Chapter 2", sage, size=32)
            for n in range(1, 21):
                r_, c_ = divmod(n - 1, 10)
                x0 = 260 + c_ * 142
                y0 = 340 + r_ * 160
                ev = n % 2 == 0
                a = K.stagger(progress, n // 2, step=0.06, speed=6) if ev else 0
                on = ev and a > 0.5
                draw.rounded_rectangle((x0 + 6, y0 + 8, x0 + 124 + 6, y0 + 124 + 8), radius=22, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 124, y0 + 124), radius=22, fill=sage if on else panel,
                                       outline=sage if ev else line, width=4)
                ctext(draw, str(n), x0 + 62, y0 + 62, 56, (255, 255, 255) if on else (ink if ev else muted))
            if progress > 0.6:
                K.pill(draw, cx, 720, "2, 4, 6, 8 … the even numbers!", sage, size=40)
            return True
        ans = focus == "answer"
        n_up = int(K.clamp01(progress * 1.15) * 10) if ans else 0
        tips = hand(draw, 720, 560, 1.4, min(5, n_up), +1, K.GOLD)
        tips += hand(draw, 1200, 560, 1.4, max(0, n_up - 5), -1, K.GOLD)
        if ans:
            for k in range(n_up):
                tx, ty = tips[k]
                ctext(draw, str(2 * (k + 1)), tx, ty - 34, 34, coral)
            if n_up >= 10:
                K.pill(draw, cx, 790, "10 numbers!", sage, size=44)
                star_spots([(380, 420), (1560, 420)])
        else:
            K.text_at(draw, "Count by 2s from 2 to 20", cx, 250, font(56, bold=True), ink)
            K.text_at(draw, "How many numbers do you say?", cx, 790, font(44, bold=True), coral)
            K.draw_stopwatch(draw, 1640, 560, 60, progress, brand)
        return True

    # ---- by fives ------------------------------------------------------------------
    if visual == "c4-fives":
        if focus == "count":
            for i in range(10):
                r_, c_ = divmod(i, 5)
                x = 460 + c_ * 250
                y = 380 + r_ * 260
                coin(draw, x, y, 70)
                a = K.stagger(progress, i, step=0.07, speed=6)
                if a > 0:
                    K.pill(draw, x, y + 90 + int((1 - a) * 16), str(5 * (i + 1)), K.BOTH_COLOR if i < 9 else sage,
                           size=36)
                if c_ < 4:
                    K.draw_arrow(draw, x + 84, y, x + 166, y, line, width=6, head=18)
            return True
        if focus == "ends":
            x0, y0, cw, ch = 360, 320, 130, 98
            K.pill(draw, x0 + 4 * cw + 60, 246, "ends in 5", coral, size=30)
            K.pill(draw, x0 + 9 * cw + 60, 246, "ends in 0", coral, size=30)
            for n in range(1, 51):
                r_, c_ = divmod(n - 1, 10)
                x, y = x0 + c_ * cw, y0 + r_ * ch
                m5 = n % 5 == 0
                a = K.stagger(progress, n // 5, step=0.06, speed=6) if m5 else 0
                on = m5 and a > 0.5
                draw.rounded_rectangle((x, y, x + cw - 10, y + ch - 10), radius=16, fill=coral_soft if on else panel,
                                       outline=coral if on else line, width=4 if on else 2)
                s = str(n)
                if on:
                    f = font(46, bold=True)
                    wd = draw.textbbox((0, 0), s, font=f)[2]
                    ctext(draw, s[:-1], x + (cw - 10) / 2 - wd / 4, y + (ch - 10) / 2, 46, ink) if len(s) > 1 else None
                    ctext(draw, s[-1], x + (cw - 10) / 2 + (wd / 4 if len(s) > 1 else 0), y + (ch - 10) / 2, 46, coral)
                else:
                    ctext(draw, s, x + (cw - 10) / 2, y + (ch - 10) / 2, 40, muted)
            return True
        ans = focus == "answer"
        K.text_at(draw, "Which do we NOT say by 5s?", cx, 236, font(56, bold=True), ink)
        opts = ["35", "42", "45"]
        for i, o in enumerate(opts):
            x = cx + (i - 1) * 420
            st = "normal"
            if ans:
                st = "bad" if o == "42" else "win"
            tile(x, 330, 300, 220, o, None, st, size=120)
            if ans:
                if o == "42":
                    K.draw_cross(draw, x + 150, 340, 30, K.DANGER)
                    K.text_at(draw, "ends in 2", x, 570, font(36, bold=True), K.DANGER)
                else:
                    K.draw_check(draw, x + 150, 340, 30, sage)
                    K.text_at(draw, "ends in 5", x, 570, font(36, bold=True), sage)
        if ans:
            pos = number_line(560, 1360, 690, 35, 45, size=30)
            hop(pos(35), pos(40), 670, 60, sage, "+5", lsize=28)
            hop(pos(40), pos(45), 670, 60, sage, "+5", lsize=28)
            K.draw_cross(draw, pos(42), 640, 18, K.DANGER)
        else:
            K.draw_stopwatch(draw, cx, 720, 60, progress, brand)
        return True

    # ---- by tens ---------------------------------------------------------------------
    if visual == "c4-tens":
        if focus == "count":
            for i in range(5):
                x = 380 + i * 290
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                bundle(draw, x, 470 + int((1 - a) * 30), 0.95)
                f = font(80, bold=True)
                ctext(draw, str(i + 1), x - 24, 680, 80, TENS)
                ctext(draw, "0", x + 24, 680, 80, (196, 190, 180))
                if i > 0:
                    hop(x - 290 + 60, x - 60, 340, 50, coral, "+10", lsize=30)
            if progress > 0.6:
                K.text_at(draw, "Only the tens digit changes!", cx, 770, font(44, bold=True), TENS)
            return True
        ans = focus == "answer"
        vals = ["10", "20", "30", "40", "50"]
        for i, v in enumerate(vals):
            x = cx + (i - 2) * 290
            if i == 2:
                tile(x, 330, 230, 200, v, None, "win" if ans else "missing", size=100)
            else:
                tile(x, 330, 230, 200, v, TENS, size=100)
        if ans:
            hop(cx - 290, cx, 320, 50, coral, "+10", lsize=32)
            for k in range(3):
                bundle(draw, cx - 120 + k * 120, 690, 0.6)
            ctext(draw, "20 + 10 = 30", 1480, 690, 64, sage)
            K.text_at(draw, "3 bundles of ten", cx, 790, font(36, bold=True), muted)
        else:
            K.draw_stopwatch(draw, cx, 700, 60, progress, brand)
        return True

    # ---- sequences --------------------------------------------------------------------
    if visual == "c4-sequence":
        if focus == "name":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 470 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "SEQUENCE", cx, 296 + lift, font(36, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "Numbers in order that", cx, 350 + lift, font(56, bold=True), ink)
            K.text_at(draw, "follow a RULE", cx, 412 + lift, font(56, bold=True), coral)
            ty = 720
            draw.rectangle((140, ty + 62, 1780, ty + 72), fill=K.DEV_MID)
            ex = 300
            draw.rounded_rectangle((ex - 150, ty - 110, ex + 110, ty + 40), radius=24, fill=coral)
            draw.rounded_rectangle((ex - 120, ty - 180, ex - 10, ty - 100), radius=14, fill=K.DEV_DARK)
            draw.rounded_rectangle((ex - 104, ty - 166, ex - 26, ty - 116), radius=10, fill=K.DEV_SCREEN)
            draw.rectangle((ex + 50, ty - 170, ex + 86, ty - 110), fill=K.DEV_DARK)
            ctext(draw, "add 2", ex - 20, ty - 38, 40, (255, 255, 255))
            for wx in (ex - 90, ex + 50):
                draw.ellipse((wx - 34, ty + 6, wx + 34, ty + 74), fill=K.DEV_DARK)
            for i in range(5):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x0 = 450 + i * 270 + int((1 - a) * 60)
                draw.line((x0 - 40, ty, x0, ty), fill=K.DEV_DARK, width=8)
                draw.rounded_rectangle((x0, ty - 100, x0 + 230, ty + 40), radius=18,
                                       fill=[K.ROAD, sage, K.BOTH_COLOR][i % 3])
                for wx in (x0 + 50, x0 + 180):
                    draw.ellipse((wx - 28, ty + 16, wx + 28, ty + 72), fill=K.DEV_DARK)
                ctext(draw, str(2 * (i + 1)), x0 + 115, ty - 30, 70, (255, 255, 255))
            return True
        seq = [3, 6, 9, 12]
        if focus == "jumps":
            xs = [480 + i * 320 for i in range(4)]
            for i, v in enumerate(seq):
                tile(xs[i], 360, 220, 180, str(v), K.ROAD, size=100)
            for i in range(3):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                hop(xs[i] + 40, xs[i + 1] - 40, 350, 50, coral, "+3", lsize=34)
                mx = (xs[i] + xs[i + 1]) / 2
                draw.rounded_rectangle((mx - 150, 620, mx + 150, 710), radius=40, fill=coral_soft)
                ctext(draw, f"{seq[i + 1]} − {seq[i]} = 3", mx, 665, 44, ink)
            if progress > 0.75:
                K.text_at(draw, "Each jump is 3!", cx, 760, font(48, bold=True), coral)
            return True
        full = [3, 6, 9, 12, 15, 18, 21]
        xs = [cx + (i - 3) * 236 for i in range(7)]
        for i, v in enumerate(full):
            new = i >= 4
            a = K.stagger(progress, i - 3, step=0.15, speed=4) if new else 1.0
            if a <= 0:
                tile(xs[i], 380, 190, 170, "", None, "missing", size=80)
                continue
            tile(xs[i], 380 + int((1 - a) * 20), 190, 170, str(v), coral if new else K.ROAD, size=90)
            if i > 0:
                hop(xs[i - 1] + 40, xs[i] - 40, 370, 46, sage if new else muted, "+3", lsize=30)
        K.pill(draw, cx, 640, "Rule: add 3", sage, size=48)
        return True

    # ---- cricket -------------------------------------------------------------------
    if visual == "c4-cricket":
        if focus == "intro":
            draw.rounded_rectangle((100, 700, 1100, 860), radius=60, fill=(186, 222, 150))
            stumps(draw, 290, 770, 1.0)
            bat(draw, 630, 610, 1.0, 0.55 + 0.25 * math.sin(t * 6))
            kid(draw, 520, 450, 1.2, K.ROAD, t, bun=False)
            bx = K.lerp(760, 1180, K.clamp01(progress * 1.4))
            by = 420 - 140 * math.sin(math.pi * K.clamp01(progress * 1.4))
            for k in range(3):
                draw.line((bx - 40 - k * 26, by + 10 + k * 8, bx - 70 - k * 26, by + 10 + k * 8), fill=K.STEEL, width=5)
            ball(draw, bx, by, 22)
            K.text_at(draw, "Kabir", 520, 640, font(38, bold=True), K.ROAD)
            K.shadow_card(draw, (1240, 300, 1760, 760), brand, radius=36, accent=sage)
            ctext(draw, "4", 1500, 500, 200, coral)
            K.text_at(draw, "runs every over", 1500, 630, font(40, bold=True), ink)
            return True
        stage = {"table": 3, "ask": 3, "answer": 5}[focus]
        draw.rounded_rectangle((300 + 10, 250 + 12, 1620 + 10, 760 + 12), radius=30, fill=K.SHADOW)
        draw.rounded_rectangle((300, 250, 1620, 760), radius=30, fill=BOARD, outline=BOARD_DARK, width=10)
        K.text_at(draw, "SCOREBOARD · KABIR", 960, 278, font(36, bold=True), K.GOLD)
        ctext(draw, "OVERS", 470, 420, 40, (220, 240, 230))
        ctext(draw, "RUNS", 470, 610, 40, (220, 240, 230))
        xs = [700 + i * 200 for i in range(5)]
        for i in range(5):
            ctext(draw, str(i + 1), xs[i], 420, 64, (255, 255, 255))
            box = (xs[i] - 80, 540, xs[i] + 80, 680)
            if focus == "table":
                a = K.stagger(progress, i, step=0.2, speed=4) if i < 3 else 0
            else:
                a = 1.0 if i < 3 or focus == "answer" else 0
            if focus == "answer" and i >= 3:
                a = K.stagger(progress, i - 3, step=0.3, speed=4)
            if a > 0:
                draw.rounded_rectangle(box, radius=20, fill=BOARD_DARK)
                col = K.GOLD if i >= 3 else (255, 255, 255)
                ctext(draw, str(4 * (i + 1)), xs[i], 610, 70, col)
                if i > 0:
                    hop(xs[i - 1] + 30, xs[i] - 30, 520, 30, K.GOLD, "+4", lsize=28, width=5)
            else:
                draw.rounded_rectangle(box, radius=20, outline=K.GOLD if focus == "ask" else BOARD_DARK, width=4)
                if focus == "ask":
                    ctext(draw, "?", xs[i], 610, int(70 + 10 * pulse), K.GOLD)
        if focus == "ask":
            K.draw_stopwatch(draw, 1760, 640, 54, progress, brand)
        elif focus == "answer" and progress > 0.6:
            K.pill(draw, cx, 790, "20 runs after 5 overs!", sage, size=40)
        elif focus == "table" and progress > 0.6:
            K.pill(draw, cx, 790, "Rule: add 4", coral, size=40)
        return True

    # ---- game ------------------------------------------------------------------------
    if visual == "c4-game":
        if focus in ("ask1", "ans1"):
            ans = focus == "ans1"
            vals = [5, 10, 15, 20, 25, 30]
            xs = [cx + (i - 2.5) * 250 for i in range(6)]
            K.pill(draw, cx, 236, "Next three numbers?", K.BOTH_COLOR, size=36)
            for i, v in enumerate(vals):
                if i >= 3 and not ans:
                    tile(xs[i], 400, 200, 190, "", None, "missing", size=90)
                    continue
                a = K.stagger(progress, i - 3, step=0.15, speed=5) if (ans and i >= 3) else 1.0
                if a <= 0:
                    tile(xs[i], 400, 200, 190, "", None, "missing", size=90)
                    continue
                tile(xs[i], 400 + int((1 - a) * 20), 200, 190, str(v), sage if i >= 3 else K.ROAD,
                     "win" if i >= 3 else "normal", size=96)
                if i > 0 and (ans or i < 3):
                    hop(xs[i - 1] + 40, xs[i] - 40, 390, 40, sage if i >= 3 else muted, "+5", lsize=30)
            if ans:
                K.pill(draw, cx, 680, "Rule: add 5", sage, size=44)
            else:
                K.draw_stopwatch(draw, cx, 720, 60, progress, brand)
            return True
        ans = focus == "ans2"
        rows = [("A", [25, 30, 35, 40], ["+5", "+5", "+5"], 260), ("B", [5, 10, 20, 40], ["+5", "+10", "+20"], 540)]
        for lab, vals, jumps, y0 in rows:
            fake = lab == "B"
            out = (K.DANGER if fake else sage) if ans else line
            draw.rounded_rectangle((260 + 10, y0 + 12, 1560 + 10, y0 + 250 + 12), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((260, y0, 1560, y0 + 250), radius=36,
                                   fill=(coral_soft if fake else sage_soft) if ans else panel, outline=out, width=5)
            draw.ellipse((300, y0 + 85, 400, y0 + 185), fill=K.BOTH_COLOR)
            ctext(draw, lab, 350, y0 + 135, 56, (255, 255, 255))
            xs = [600 + i * 260 for i in range(4)]
            for i, v in enumerate(vals):
                tile(xs[i], y0 + 100, 190, 120, str(v), ink, size=70)
                if ans and i > 0:
                    hop(xs[i - 1] + 50, xs[i] - 50, y0 + 92, 22, K.DANGER if fake else sage, jumps[i - 1], lsize=28,
                        width=5)
            if ans:
                if fake:
                    K.pill(draw, 1640, y0 + 95, "FAKE!", K.DANGER, size=36)
                else:
                    K.draw_check(draw, 1640, y0 + 125, 36, sage)
        if not ans:
            K.draw_stopwatch(draw, 1700, 520, 60, progress, brand)
        return True

    # ---- loop ----------------------------------------------------------------------
    if visual == "c4-loop":
        if focus == "remember":
            K.draw_robot(draw, 480, 560, 0.85, t, mood="happy")
            loop_ring(1280, 540, 230, K.BOTH_COLOR, rot=progress * 0.8, width=18)
            K.text_at(draw, "Same step,", 1280, 470, font(52, bold=True), ink)
            K.text_at(draw, "again & again", 1280, 540, font(52, bold=True), coral)
            K.pill(draw, 1280, 796, "LOOP", K.BOTH_COLOR, size=40)
            return True
        if focus == "code":
            draw.rounded_rectangle((180 + 10, 270 + 12, 960 + 10, 790 + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((180, 270, 960, 790), radius=30, fill=K.DEV_DEEP)
            for k, col in enumerate((K.DANGER, K.GOLD, K.LED_ON)):
                draw.ellipse((220 + k * 40, 296, 244 + k * 40, 320), fill=col)
            lines_ = [("start at 0", 0), ("repeat:", 0), ("add 2", 1), ("say the number", 1)]
            step = min(5, int(progress * 6.5))
            cur = 0 if progress < 0.08 else 2 + (int(progress * 26) % 2)
            for i, (txt, ind) in enumerate(lines_):
                y = 370 + i * 100
                if i == cur:
                    draw.rounded_rectangle((210, y - 14, 930, y + 70), radius=16, fill=(60, 70, 96))
                draw.text((240 + ind * 70, y), txt, font=font(50, bold=True),
                          fill=K.GOLD if i == 1 else (230, 236, 246))
            K.draw_curve(draw, (296, 700), (196, 640), (290, 580), K.LED_ON, width=7)
            draw.polygon([(316, 578), (286, 566), (288, 594)], fill=K.LED_ON)
            K.draw_robot(draw, 1320, 520, 0.7, t, mood="happy")
            K.draw_bubble(draw, (1480, 250, 1760, 380), brand, str(2 * step), tail="left", size=64)
            for k in range(6):
                if k <= step:
                    ctext(draw, str(2 * k), 1080 + k * 120, 790, 52, coral if k == step else ink)
            return True
        loop_ring(cx, 520, 180, K.BOTH_COLOR, rot=progress * 0.8, width=18)
        K.text_at(draw, "repeat:", cx, 450, font(48, bold=True), muted)
        K.text_at(draw, "add 2", cx, 510, font(64, bold=True), coral)
        for k in range(5):
            a = K.stagger(progress, k, step=0.12, speed=5)
            if a <= 0:
                continue
            ang = math.radians(-180 + k * 45)
            x, y = cx + math.cos(ang) * 360, 560 + math.sin(ang) * 290
            draw.ellipse((x - 50, y - 50, x + 50, y + 50), fill=sage)
            ctext(draw, str(2 * (k + 1)), x, y, 50, (255, 255, 255))
        if progress > 0.5:
            K.pill(draw, cx, 780, "Skip counting is a loop!", sage, size=40)
        return True

    # ---- checkpoint ---------------------------------------------------------------
    if visual == "c4-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Find the rule!", cx, 450 + lift, font(64, bold=True), ink)
            for i, v in enumerate((5, 10, 15, 20)):
                tile(cx - 270 + i * 180, 580 + lift, 140, 110, str(v), K.ROAD, size=60)
            return True
        ans = focus == "answer"
        notebook("What is the rule for 5, 10, 15, 20?")
        xs = [330 + i * 245 for i in range(4)]
        for i, v in enumerate((5, 10, 15, 20)):
            tile(xs[i], 410, 170, 130, str(v), K.ROAD, size=76)
        if ans:
            subs = ["10 − 5 = 5", "15 − 10 = 5", "20 − 15 = 5"]
            for i in range(3):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                hop(xs[i] + 40, xs[i + 1] - 40, 400, 30, sage, "+5", lsize=30, width=5)
                ctext(draw, subs[i], (xs[i] + xs[i + 1]) / 2, 610, 36, ink)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                ctext(draw, "Rule: add 5!", 695, 740 + int((1 - a) * 10), 72, sage)
        else:
            for i in range(3):
                mx = (xs[i] + xs[i + 1]) / 2
                draw.ellipse((mx - 30, 330, mx + 30, 390), fill=coral_soft)
                ctext(draw, "?", mx, 360, 40, coral)
            for i in range(2):
                draw.line((180, 680 + i * 90, 1210, 680 + i * 90), fill=(220, 210, 232), width=3)
        kid(draw, 1540, 520, 1.3, coral, t)
        if ans:
            K.draw_heart(draw, 1700, 380 + bounce, 30, coral)
            star_spots([(1380, 330), (1720, 660)])
        else:
            question_marks([(1700, 360)], size=80)
            K.draw_stopwatch(draw, 1540, 800, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "c4-recap":
        recap = [(("Skip counting:", "add the same"), coral, "hops"), (("The rule tells", "the next number"), K.ROAD, "rule"),
                 (("Check the jump", "between numbers"), sage, "jump"), (("Repeat add 2", "is a loop"), K.BOTH_COLOR, "loop")]
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
                if kind == "hops":
                    for k in range(3):
                        hop(ix - 150 + k * 100, ix - 50 + k * 100, iy + 30, 50, col, "+2", lsize=28, width=5)
                    for k in range(4):
                        ctext(draw, str(2 * k), ix - 150 + k * 100, iy + 70, 40, ink)
                elif kind == "rule":
                    for k, v in enumerate(("3", "6", "9")):
                        tile(ix - 120 + k * 90, iy - 60, 76, 76, v, K.ROAD, size=40)
                    tile(ix + 150, iy - 60, 76, 76, "", None, "missing", size=40)
                    K.pill(draw, ix, iy + 50, "add 3", col, size=32)
                elif kind == "jump":
                    ctext(draw, "12 − 9 = 3", ix, iy - 20, 48, ink)
                    K.draw_magnifier(draw, ix, iy + 80, 0.5, col)
                else:
                    loop_ring(ix, iy, 100, col, rot=progress, width=12)
                    ctext(draw, "+2", ix, iy, 64, coral)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font(36, bold=True), ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, coral, t)
            K.text_at(draw, "Chapter 4 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Skip-count superstar", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
