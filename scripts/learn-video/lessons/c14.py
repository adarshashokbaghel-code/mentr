"""C14 · Angles and Turns — visuals."""
import math

import build as K

SHIRT = (72, 118, 214)
SHIRT_DARK = (50, 88, 170)
SHORTS = (52, 60, 76)
SHOE = (40, 44, 56)
KAVYA = (123, 97, 214)
GROUND = (232, 214, 172)
GROUND_DARK = (210, 188, 140)
GRASS = (150, 200, 120)
SHELL = (96, 176, 84)
SHELL_DARK = (64, 136, 60)
TURTLE_SKIN = (150, 206, 120)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
SHADE = (255, 214, 190)
FULL_SOFT = (196, 234, 224)
DIRS = ["N", "E", "S", "W"]
DIR_NAMES = {"N": "North", "E": "East", "S": "South", "W": "West"}


def rot(cx, cy, a_deg, x, y):
    a = math.radians(a_deg)
    ca, sa = math.cos(a), math.sin(a)
    return cx + x * ca - y * sa, cy + x * sa + y * ca


def ell_pts(cx, cy, a_deg, ox, oy, rx, ry, n=28):
    return [rot(cx, cy, a_deg, ox + rx * math.cos(2 * math.pi * k / n), oy + ry * math.sin(2 * math.pi * k / n))
            for k in range(n)]


def circ(draw, x, y, r, col):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=col)


def arjun_top(draw, cx, cy, s, heading, arrow=True, ghost=False):
    """Arjun seen from above. heading 0 = facing up (north), clockwise degrees."""
    def P(x, y):
        return rot(cx, cy, heading, x * s, y * s)

    body = (200, 210, 230) if ghost else SHIRT
    draw.polygon(ell_pts(cx + 6 * s, cy + 10 * s, heading, 0, 6 * s, 80 * s, 40 * s), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.polygon(ell_pts(*P(sx * 22, -50), heading, 0, 0, 14 * s, 24 * s), fill=SHOE)
    draw.polygon(ell_pts(cx, cy, heading, 0, 6 * s, 74 * s, 36 * s), fill=body)
    for sx in (-1, 1):
        circ(draw, *P(sx * 78, -6), 17 * s, K.SKIN)
    hx, hy = P(0, 0)
    circ(draw, hx, hy, 40 * s, K.SKIN)
    bx, by = P(0, 12)
    circ(draw, bx, by, 38 * s, K.HAIR)
    nx, ny = P(0, -38)
    circ(draw, nx, ny, 8 * s, (226, 172, 136))
    if arrow:
        x0, y0 = P(0, -74)
        x1, y1 = P(0, -168)
        K.draw_arrow(draw, x0, y0, x1, y1, (214, 206, 196) if ghost else K.CORAL, width=max(4, int(14 * s)),
                     head=int(36 * s))


def turtle_top(draw, cx, cy, s, heading):
    def P(x, y):
        return rot(cx, cy, heading, x * s, y * s)

    draw.polygon(ell_pts(cx + 6 * s, cy + 10 * s, heading, 0, 0, 78 * s, 92 * s), fill=K.SHADOW)
    for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        draw.polygon(ell_pts(*P(sx * 64, sy * 50), heading, 0, 0, 22 * s, 16 * s), fill=TURTLE_SKIN)
    draw.polygon([P(-12, 80), P(12, 80), P(0, 118)], fill=TURTLE_SKIN)
    draw.polygon(ell_pts(*P(0, -102), heading, 0, 0, 28 * s, 30 * s), fill=TURTLE_SKIN)
    for sx in (-1, 1):
        circ(draw, *P(sx * 11, -112), 5 * s, K.DEV_DEEP)
    draw.polygon(ell_pts(cx, cy, heading, 0, 0, 70 * s, 86 * s), fill=SHELL)
    hexa = [P(34 * math.cos(math.pi / 3 * k + math.pi / 6), 34 * math.sin(math.pi / 3 * k + math.pi / 6))
            for k in range(6)]
    draw.polygon(hexa, outline=SHELL_DARK, width=max(2, int(5 * s)))
    for k in range(6):
        a = math.pi / 3 * k + math.pi / 6
        p = P(34 * math.cos(a), 34 * math.sin(a))
        q = P(70 * math.cos(a) * 0.98, 86 * math.sin(a) * 0.98)
        draw.line((p[0], p[1], q[0], q[1]), fill=SHELL_DARK, width=max(2, int(5 * s)))


def kid(draw, cx, cy, s, body, t=0.0, bun=False):
    """Child bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    cy = cy + 6 * s * math.sin(t * math.pi * 4)
    draw.chord((cx - 90 * s, cy + 54 * s, cx + 102 * s, cy + 244 * s), 180, 360, fill=K.SHADOW)
    draw.chord((cx - 96 * s, cy + 46 * s, cx + 96 * s, cy + 236 * s), 180, 360, fill=body)
    r = 64 * s
    if bun:
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.95 - r * 0.32, cy - r * 0.2, cx + sx * r * 0.95 + r * 0.32, cy + r * 0.55),
                         fill=K.HAIR)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    if not bun:
        draw.polygon([(cx - r * 0.9, cy - r * 0.55), (cx - r * 0.2, cy - r * 1.25), (cx + r * 0.5, cy - r * 0.6)],
                     fill=K.HAIR)


def arjun(draw, cx, cy, s, t=0.0):
    kid(draw, cx, cy, s, SHIRT, t)
    draw.polygon([(cx - 14 * s, cy + 60 * s), (cx + 14 * s, cy + 60 * s), (cx + 8 * s, cy + 120 * s),
                  (cx - 8 * s, cy + 120 * s)], fill=K.DANGER)


def kavya(draw, cx, cy, s, t=0.0):
    kid(draw, cx, cy, s, KAVYA, t, bun=True)


def pt_sir(draw, cx, cy, s, t=0.0):
    K.draw_person(draw, cx, cy, s, "teacher", t)
    yy = cy + 6 * s * math.sin(t * math.pi * 4)
    draw.line((cx - 30 * s, yy + 52 * s, cx, yy + 100 * s, cx + 30 * s, yy + 52 * s), fill=K.GOLD,
              width=max(2, int(4 * s)))
    draw.rounded_rectangle((cx - 16 * s, yy + 96 * s, cx + 22 * s, yy + 118 * s), radius=8 * s, fill=K.STEEL)
    circ(draw, cx + 22 * s, yy + 107 * s, 9 * s, K.STEEL_DARK)


def spot(draw, cx, cy, r, col=(255, 255, 255)):
    draw.ellipse((cx - r, cy - r * 0.9, cx + r, cy + r * 0.9), outline=col, width=6)
    for sx in (-1, 1):
        draw.line((cx + sx * r * 0.25 - 14, cy - 14, cx + sx * r * 0.25 + 14, cy + 14), fill=col, width=5)
        draw.line((cx + sx * r * 0.25 - 14, cy + 14, cx + sx * r * 0.25 + 14, cy - 14), fill=col, width=5)


def turn_arc(draw, cx, cy, r, start, sweep, fill, outline, width=6):
    """start = heading in degrees (0 = up), sweep > 0 clockwise, < 0 anticlockwise."""
    if abs(sweep) < 1:
        return
    a0, a1 = (start - 90, start - 90 + sweep) if sweep > 0 else (start - 90 + sweep, start - 90)
    box = (cx - r, cy - r, cx + r, cy + r)
    if abs(sweep) >= 359.5:
        draw.ellipse(box, fill=fill, outline=outline, width=width)
        return
    draw.pieslice(box, a0, a1, fill=fill)
    draw.arc(box, a0, a1, fill=outline, width=width)
    for a in (a0, a1):
        ra = math.radians(a)
        draw.line((cx, cy, cx + r * math.cos(ra), cy + r * math.sin(ra)), fill=outline, width=width)


def arc_arrow(draw, cx, cy, r, start, sweep, col, width=8):
    """Curved arrow around (cx, cy) from heading start through sweep degrees."""
    if abs(sweep) < 8:
        return
    a0, a1 = (start - 90, start - 90 + sweep) if sweep > 0 else (start - 90 + sweep, start - 90)
    trim = 10 if sweep > 0 else -10
    if sweep > 0:
        draw.arc((cx - r, cy - r, cx + r, cy + r), a0, a1 - trim, fill=col, width=width)
    else:
        draw.arc((cx - r, cy - r, cx + r, cy + r), a0 - trim, a1, fill=col, width=width)
    end = math.radians(start - 90 + sweep)
    tip = (cx + r * math.cos(end), cy + r * math.sin(end))
    back = math.radians(start - 90 + sweep - trim * 1.4)
    bx, by = cx + r * math.cos(back), cy + r * math.sin(back)
    nx, ny = math.cos(back), math.sin(back)
    hw = width * 1.6
    draw.polygon([tip, (bx + nx * hw, by + ny * hw), (bx - nx * hw, by - ny * hw)], fill=col)


def clock(draw, cx, cy, R, minute_deg, shade=0.0, ink=(28, 36, 52), marks=None):
    draw.ellipse((cx - R + 10, cy - R + 12, cx + R + 10, cy + R + 12), fill=K.SHADOW)
    draw.ellipse((cx - R, cy - R, cx + R, cy + R), fill=(255, 255, 255), outline=ink, width=max(4, int(R * 0.05)))
    if shade > 0:
        box = (cx - R * 0.86, cy - R * 0.86, cx + R * 0.86, cy + R * 0.86)
        if shade >= 359.5:
            draw.ellipse(box, fill=SHADE)
        else:
            draw.pieslice(box, -90, -90 + shade, fill=SHADE)
    for k in range(12):
        a = math.radians(k * 30 - 90)
        big = k % 3 == 0
        r0 = R * (0.8 if big else 0.86)
        draw.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * R * 0.93,
                   cy + math.sin(a) * R * 0.93), fill=ink, width=max(2, int(R * (0.03 if big else 0.015))))
    a = math.radians(minute_deg - 90)
    K.draw_arrow(draw, cx, cy, cx + math.cos(a) * R * 0.5, cy + math.sin(a) * R * 0.5, K.CORAL,
                 width=max(4, int(R * 0.05)), head=int(R * 0.16))
    circ(draw, cx, cy, R * 0.06, ink)
    f = K.load_font(max(26, int(R * 0.2)), bold=True)
    for k, lab in ((0, "12"), (3, "3"), (6, "6"), (9, "9")):
        a = math.radians(k * 30 - 90)
        hot = marks is not None and k in marks
        x, y = cx + math.cos(a) * R * 0.66, cy + math.sin(a) * R * 0.66
        bb = draw.textbbox((0, 0), lab, font=f)
        K.text_at(draw, lab, x, y - (bb[3] - bb[1]) / 2 - bb[1], f, K.CORAL if hot else ink)


def compass(draw, cx, cy, R, ink, hot=None, words=False):
    draw.ellipse((cx - R + 8, cy - R + 10, cx + R + 8, cy + R + 10), fill=K.SHADOW)
    draw.ellipse((cx - R, cy - R, cx + R, cy + R), fill=(255, 252, 244), outline=ink, width=5)
    for k in range(8):
        a = math.radians(k * 45 - 90)
        r0 = R * (0.84 if k % 2 == 0 else 0.9)
        draw.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * R * 0.97,
                   cy + math.sin(a) * R * 0.97), fill=ink, width=4 if k % 2 == 0 else 2)
    f = K.load_font(max(30, int(R * 0.2)), bold=True)
    for k, d in enumerate(DIRS):
        a = math.radians(k * 90 - 90)
        x, y = cx + math.cos(a) * (R + 48), cy + math.sin(a) * (R + 48)
        is_hot = hot == d
        if is_hot:
            circ(draw, x, y, 38, K.CORAL)
        label = DIR_NAMES[d] if words else d
        ff = K.load_font(34, bold=True) if words else f
        bb = draw.textbbox((0, 0), label, font=ff)
        K.text_at(draw, label, x, y - (bb[3] - bb[1]) / 2 - bb[1], ff, (255, 255, 255) if is_hot else ink)


def code_block(draw, x, y, text, col, active=False, wd=430):
    h = 76
    if active:
        draw.rounded_rectangle((x - 8, y - 8, x + wd + 8, y + h + 8), radius=22, outline=K.GOLD, width=6)
    draw.rounded_rectangle((x + 6, y + 8, x + wd + 6, y + h + 8), radius=16, fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + wd, y + h), radius=16, fill=col)
    draw.rectangle((x + 30, y - 6, x + 80, y + 4), fill=col)
    draw.text((x + 28, y + 18), text, fill=(255, 255, 255), font=K.load_font(36, bold=True))


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
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def ground(box, grass=False):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=36, fill=GRASS if grass else GROUND)

    def move(a, b, speed=1.4, delay=0.0):
        return K.lerp(a, b, K.ease_in_out(K.clamp01((progress - delay) * speed)))

    def deg_label(x, y, text, col, size=56):
        K.text_at(draw, text, x, y, font(size, bold=True), col)

    def pie_icon(x, y, r, sweep, col, soft):
        draw.ellipse((x - r, y - r, x + r, y + r), fill=panel, outline=line, width=4)
        if sweep >= 359.5:
            draw.ellipse((x - r, y - r, x + r, y + r), fill=soft, outline=col, width=5)
        else:
            turn_arc(draw, x, y, r, 0, sweep, soft, col, width=5)
        circ(draw, x, y, 7, col)

    # ---- opening ------------------------------------------------------------------
    if visual == "c14-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            arjun(draw, cx + 280, 430, 1.3, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            arc_arrow(draw, cx - 640, 420, 70, 0, 270 * K.clamp01(progress * 1.5), coral)
            arc_arrow(draw, cx + 640, 420, 70, 0, -270 * K.clamp01(progress * 1.5), sage)
            star_spots([(cx - 640, 640), (cx + 640, 640)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 250 + lift, w - 260, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · SYMMETRY & PATTERNS", cx, 326 + lift, font(34, bold=True), sage)
            a = K.stagger(progress, 0, step=0.2, speed=4)
            if a > 0:
                y = 570 + int((1 - a) * 30)
                draw.ellipse((620 - 190, y - 190, 620 + 190, y + 190), fill=coral_soft)
                K.draw_heart(draw, 620, y, 110, (238, 104, 158))
                K.draw_dashed(draw, 620, y - 170, 620, y + 170, coral, width=6)
                K.text_at(draw, "Fold lines", 620, y + 200, font(36, bold=True), ink)
            b = K.stagger(progress, 1, step=0.2, speed=4)
            if b > 0:
                y = 570 + int((1 - b) * 30)
                draw.ellipse((1300 - 190, y - 190, 1300 + 190, y + 190), fill=sage_soft)
                for k, kd in enumerate(("star", "dot", "dot", "star", "dot", "dot")):
                    px = 1300 - 150 + k * 60
                    if kd == "star":
                        K.draw_star(draw, px, y, 30, K.GOLD)
                    else:
                        circ(draw, px, y, 12, coral)
                K.text_at(draw, "Patterns", 1300, y + 200, font(36, bold=True), ink)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Angles and Turns", cx, 360 + lift, font(88, bold=True), ink)
            specs = [(90, "90°", coral, SHADE), (180, "180°", K.ROAD, (214, 226, 250)), (360, "360°", sage, FULL_SOFT)]
            for i, (sw, lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i + 1, step=0.14, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 360
                y = 660 + int((1 - a) * 30)
                pie_icon(x, y, 100, sw, col, soft)
                K.text_at(draw, lab, x, y + 120, font(40, bold=True), col)
            return True
        # promise
        draw.ellipse((620 - 250, 560 - 250, 620 + 250, 560 + 250), fill=sage_soft)
        turtle_top(draw, 620, 570, 1.5, 90 * K.ease_in_out(K.clamp01(progress * 1.5)))
        K.text_at(draw, "Turn like a", 1300, 300 + lift, font(80, bold=True), ink)
        K.text_at(draw, "coding robot!", 1300, 400 + lift, font(80, bold=True), coral)
        code_block(draw, 1085, 600, "turn right 90°", K.BOTH_COLOR, active=True)
        return True

    # ---- assembly story -----------------------------------------------------------
    if visual == "c14-hook":
        if focus == "meet":
            draw.rounded_rectangle((120, 470, 1800, 870), radius=30, fill=GROUND)
            for k in range(3):
                draw.line((180, 560 + k * 110, 1740, 560 + k * 110), fill=GROUND_DARK, width=3)
            K.draw_school(draw, 1500, 400, 0.9, brand)
            pt_sir(draw, 290, 500, 1.2, t)
            K.pill(draw, 290, 700, "PT sir", sage, size=34)
            K.draw_bubble(draw, (120, 230, 520, 360), brand, "Attention!", tail="left", size=44)
            for k, x in enumerate((640, 860, 1080)):
                if k == 1:
                    arjun(draw, x, 560, 1.15, t)
                else:
                    kid(draw, x, 590, 0.95, [K.GOLD, sage][k // 2], t + k * 0.2, bun=k == 2)
            K.pill(draw, 860, 760, "Arjun", coral, size=40)
            return True
        if focus in ("right", "about", "ask", "answer"):
            ground((520, 250, 1400, 860))
            ax, ay = 960, 570
            spot(draw, ax, ay, 120)
            if focus == "right":
                hd = move(0, 90, speed=1.6)
                turn_arc(draw, ax, ay, 230, 0, hd, SHADE, coral)
                arjun_top(draw, ax, ay, 1.15, hd)
                pt_sir(draw, 250, 560, 1.0, t)
                K.draw_bubble(draw, (90, 250, 430, 380), brand, "Right turn!", tail="left", size=44)
                K.pill(draw, 1640, 300, "Top view", K.BOTH_COLOR, size=34)
                kid(draw, 1640, 600, 1.0, SHIRT, t)
                return True
            if focus == "about":
                hd = move(90, 270, speed=1.5)
                turn_arc(draw, ax, ay, 230, 90, hd - 90, SHADE, coral)
                arjun_top(draw, ax, ay, 1.15, hd)
                pt_sir(draw, 250, 560, 1.0, t)
                K.draw_bubble(draw, (90, 250, 430, 380), brand, "About turn!", tail="left", size=44)
                K.pill(draw, 1640, 300, "Opposite way!", coral, size=34)
                kid(draw, 1640, 600, 1.0, SHIRT, t)
                return True
            if focus == "ask":
                arjun_top(draw, ax, ay, 1.15, 270)
                K.text_at(draw, "Did he walk?", 1650, 300, font(50, bold=True), ink)
                question_marks([(1560, 450), (1740, 520)], size=90)
                K.draw_stopwatch(draw, 1650, 760, 50, progress, brand)
                K.draw_feet(draw, 300, 560, 1.2)
                return True
            for hd0 in (0, 90):
                arjun_top(draw, ax, ay, 1.15, hd0, ghost=True)
            arjun_top(draw, ax, ay, 1.15, 270)
            spot(draw, ax, ay, 120, sage)
            K.draw_check(draw, ax + 150, ay + 150, 34, sage)
            K.pill(draw, 1650, 330, "Same spot!", sage, size=40)
            K.text_at(draw, "Only the way", 1650, 470, font(44, bold=True), ink)
            K.text_at(draw, "he faces", 1650, 526, font(44, bold=True), ink)
            K.text_at(draw, "changed", 1650, 582, font(44, bold=True), coral)
            K.text_at(draw, "That's a", 290, 420, font(48, bold=True), muted)
            K.text_at(draw, "TURN!", 290, 490, font(84, bold=True), coral)
            star_spots([(220, 700), (380, 760)])
            return True

    # ---- definition ------------------------------------------------------------------
    if visual == "c14-define":
        if focus == "turn":
            draw.ellipse((600 - 280, 560 - 280, 600 + 280, 560 + 280), fill=blue_soft)
            spot(draw, 600, 570, 120, K.ROAD)
            hd = 360 * K.ease_in_out(K.clamp01(progress * 1.2)) * 0.75
            arjun_top(draw, 600, 570, 1.1, hd)
            K.shadow_card(draw, (980, 260 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A TURN", 1380, 320 + lift, font(44, bold=True), muted)
            parts = [("changes the way", ink), ("you face,", coral), ("but you stay", ink), ("on the spot!", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.14, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1380, 410 + i * 100 + lift + int((1 - a) * 30), font(62, bold=True), col)
            return True
        if focus == "angle":
            vx, vy, L = 560, 700, 360
            sweep = 90 * K.ease_in_out(K.clamp01(progress * 1.6))
            turn_arc(draw, vx, vy, 150, 0, sweep, SHADE, coral)
            draw.line((vx, vy, vx, vy - L), fill=ink, width=12)
            ex, ey = rot(vx, vy, sweep, 0, -L)
            draw.line((vx, vy, ex, ey), fill=coral, width=12)
            circ(draw, vx, vy, 16, ink)
            if sweep > 30:
                lx, ly = rot(vx, vy, sweep / 2, 0, -210)
                deg_label(lx + 10, ly - 30, f"{int(round(sweep))}°", coral, size=54)
            K.text_at(draw, "the angle", 560, 760, font(40, bold=True), muted)
            K.shadow_card(draw, (1000, 280 + lift, 1760, 820 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "Angles are measured in", 1380, 350 + lift, font(40, bold=True), muted)
            K.text_at(draw, "DEGREES", 1380, 410 + lift, font(84, bold=True), K.BOTH_COLOR)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                y = 560 + int((1 - a) * 20)
                K.text_at(draw, "90", 1320, y, font(120, bold=True), ink)
                draw.ellipse((1400, y + 20, 1440, y + 60), outline=coral, width=9)
                rr = 46 + 6 * pulse
                draw.ellipse((1420 - rr, y + 40 - rr, 1420 + rr, y + 40 + rr), outline=K.GOLD, width=5)
                K.text_at(draw, "° means degrees", 1380, 730, font(40, bold=True), coral)
            return True
        # full
        hd = 360 * K.ease_in_out(K.clamp01(progress * 1.3))
        turn_arc(draw, 620, 570, 250, 0, hd, SHADE, coral)
        spot(draw, 620, 570, 110, (255, 255, 255))
        arjun_top(draw, 620, 570, 1.1, hd)
        K.text_at(draw, f"{int(round(hd))}°", 1350, 300, font(140, bold=True), coral)
        if hd >= 359.5:
            K.pill(draw, 1350, 520, "Full turn", sage, size=48)
            K.text_at(draw, "Same way again!", 1350, 650, font(46, bold=True), ink)
            K.draw_check(draw, 900, 330, 34, sage)
        else:
            K.text_at(draw, "all the way round…", 1350, 520, font(44, bold=True), muted)
        return True

    # ---- quarter turn -------------------------------------------------------------------
    if visual == "c14-quarter":
        if focus == "corner":
            qx, qy, R = 600, 570, 260
            draw.ellipse((qx - R, qy - R, qx + R, qy + R), fill=panel, outline=line, width=5)
            for k in range(4):
                a = K.stagger(progress, k, step=0.1, speed=5)
                if a > 0:
                    ra = math.radians(k * 90 - 90)
                    draw.line((qx, qy, qx + R * math.cos(ra), qy + R * math.sin(ra)), fill=muted, width=5)
            b = K.stagger(progress, 4, step=0.1, speed=4)
            if b > 0:
                turn_arc(draw, qx, qy, R, 0, 90, SHADE, coral, width=7)
                draw.rectangle((qx, qy - 60, qx + 60, qy), outline=coral, width=6)
                K.text_at(draw, "1 of 4", qx + 130, qy - 170, font(40, bold=True), coral)
            nb = K.stagger(progress, 6, step=0.1, speed=4)
            if nb > 0:
                y0 = 330 + int((1 - nb) * 30)
                draw.polygon([(1100 + 10, y0 + 12), (1720 + 10, y0 + 12), (1720 + 10, y0 + 470 + 12),
                              (1100 + 10, y0 + 470 + 12)], fill=K.SHADOW)
                draw.rectangle((1100, y0, 1720, y0 + 470), fill=(255, 250, 238), outline=line, width=4)
                for k in range(6):
                    draw.line((1130, y0 + 90 + k * 64, 1690, y0 + 90 + k * 64), fill=(214, 226, 246), width=3)
                draw.line((1170, y0, 1170, y0 + 470), fill=(246, 180, 180), width=3)
                draw.line((1100, y0, 1100, y0 + 470), fill=coral, width=12)
                draw.line((1100, y0, 1720, y0), fill=coral, width=12)
                draw.rectangle((1100, y0, 1170, y0 + 70), outline=sage, width=7)
                K.text_at(draw, "square corner", 1420, y0 + 380, font(44, bold=True), sage)
            return True
        if focus == "ninety":
            ground((330, 250, 1130, 860))
            ax, ay = 730, 570
            spot(draw, ax, ay, 110)
            hd = move(0, 90, speed=1.6)
            turn_arc(draw, ax, ay, 230, 0, hd, SHADE, coral)
            if hd > 89:
                draw.rectangle((ax, ay - 70, ax + 70, ay), outline=coral, width=6)
                deg_label(ax + 150, ay - 200, "90°", coral, size=64)
            arjun_top(draw, ax, ay, 1.1, hd)
            K.text_at(draw, "Quarter turn", 1480, 380 + lift, font(68, bold=True), ink)
            K.text_at(draw, "= 90°", 1480, 470 + lift, font(110, bold=True), coral)
            K.draw_bubble(draw, (1290, 680, 1670, 800), brand, "Right turn!", tail="left", size=40)
            return True
        if focus == "around":
            specs = [("Door", coral_soft), ("Window", blue_soft), ("Carrom board", sage_soft)]
            for i, (lab, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 540
                y0 = 280 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 230 + 10, y0 + 12, x + 230 + 10, y0 + 560 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x - 230, y0, x + 230, y0 + 560), radius=40, fill=soft)
                if i == 0:
                    bx0, by0, bx1, by1 = x - 100, y0 + 60, x + 100, y0 + 420
                    draw.rectangle((bx0, by0, bx1, by1), fill=WOOD, outline=WOOD_DARK, width=6)
                    draw.rectangle((bx0 + 24, by0 + 24, bx1 - 24, by0 + 160), outline=WOOD_DARK, width=4)
                    draw.rectangle((bx0 + 24, by0 + 190, bx1 - 24, by1 - 24), outline=WOOD_DARK, width=4)
                    circ(draw, bx1 - 30, by0 + 200, 10, K.GOLD)
                elif i == 1:
                    bx0, by0, bx1, by1 = x - 140, y0 + 90, x + 140, y0 + 390
                    draw.rectangle((bx0, by0, bx1, by1), fill=(200, 228, 250), outline=WOOD_DARK, width=10)
                    draw.line((x, by0, x, by1), fill=WOOD_DARK, width=8)
                    draw.line((bx0, (by0 + by1) / 2, bx1, (by0 + by1) / 2), fill=WOOD_DARK, width=8)
                else:
                    bx0, by0, bx1, by1 = x - 160, y0 + 80, x + 160, y0 + 400
                    draw.rectangle((bx0, by0, bx1, by1), fill=WOOD_DARK)
                    draw.rectangle((bx0 + 22, by0 + 22, bx1 - 22, by1 - 22), fill=(246, 222, 170))
                    for px, py in ((bx0 + 34, by0 + 34), (bx1 - 34, by0 + 34), (bx0 + 34, by1 - 34),
                                   (bx1 - 34, by1 - 34)):
                        circ(draw, px, py, 14, K.DEV_DEEP)
                    draw.ellipse((x - 50, (by0 + by1) / 2 - 50, x + 50, (by0 + by1) / 2 + 50), outline=K.DANGER,
                                 width=4)
                    for k, (dx, dy) in enumerate(((-30, 0), (30, 0), (0, -30), (0, 30))):
                        circ(draw, x + dx, (by0 + by1) / 2 + dy, 12, (40, 40, 40) if k % 2 else (250, 246, 236))
                draw.rectangle((bx0, by0, bx0 + 54, by0 + 54), outline=coral, width=7)
                deg_label(bx0 + 30, by0 - 50, "90°", coral, size=36)
                K.text_at(draw, lab, x, y0 + 470, font(46, bold=True), ink)
            return True
        # clock
        md = move(0, 90, speed=1.6)
        clock(draw, 620, 570, 270, md, shade=md, ink=ink, marks=(0, 3) if md > 89 else (0,))
        K.text_at(draw, "12 → 3", 1360, 320 + lift, font(110, bold=True), ink)
        K.text_at(draw, "Quarter turn", 1360, 490 + lift, font(64, bold=True), coral)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            K.pill(draw, 1360, 620 + int((1 - a) * 20), "90 degrees", sage, size=48)
        return True

    # ---- half, three quarters, full -------------------------------------------------------
    if visual == "c14-half":
        if focus == "two":
            px, py, R = 560, 560, 230
            draw.ellipse((px - R, py - R, px + R, py + R), fill=panel, outline=line, width=5)
            turn_arc(draw, px, py, R, 0, 90, SHADE, coral, width=6)
            b = K.ease_in_out(K.clamp01((progress - 0.2) * 2.5))
            if b > 0:
                turn_arc(draw, px, py, R, 90, 90 * b, (214, 226, 250), K.ROAD, width=6)
            circ(draw, px, py, 10, ink)
            deg_label(px + 110, py - 150, "90°", coral, size=44)
            if b > 0.95:
                deg_label(px + 110, py + 70, "90°", K.ROAD, size=44)
            K.text_at(draw, "90° + 90°", 1340, 320 + lift, font(90, bold=True), ink)
            c = K.stagger(progress, 5, step=0.1, speed=4)
            if c > 0:
                K.text_at(draw, "= 180°", 1340, 440 + int((1 - c) * 20), font(110, bold=True), coral)
                K.pill(draw, 1340, 640, "Half turn", sage, size=48)
            return True
        if focus == "opposite":
            ground((150, 270, 850, 850))
            ax, ay = 500, 560
            spot(draw, ax, ay, 100)
            hd = move(0, 180, speed=1.5)
            turn_arc(draw, ax, ay, 210, 0, hd, SHADE, coral)
            arjun_top(draw, ax, ay, 1.0, hd)
            if hd > 179:
                deg_label(ax + 280, ay - 120, "180°", coral, size=48)
            md = move(0, 180, speed=1.5)
            clock(draw, 1360, 540, 230, md, shade=md, ink=ink, marks=(0, 6) if md > 179 else (0,))
            K.text_at(draw, "12 → 6", 1360, 800, font(56, bold=True), ink)
            return True
        if focus == "three":
            md = move(0, 270, speed=1.4)
            hot = tuple(k for k in (0, 3, 6, 9) if md >= k * 30 - 1)
            clock(draw, 560, 560, 260, md, shade=md, ink=ink, marks=hot)
            K.text_at(draw, "12 → 9", 1360, 300 + lift, font(100, bold=True), ink)
            for i, lab in enumerate(("1", "2", "3")):
                a = K.clamp01((md - i * 90) / 90)
                if a <= 0:
                    continue
                x = 1180 + i * 180
                pie_icon(x, 520, 70, 90, [coral, K.ROAD, sage][i], [SHADE, (214, 226, 250), sage_soft][i])
                K.text_at(draw, lab, x, 600, font(36, bold=True), muted)
            if md > 269:
                K.text_at(draw, "= 270°", 1360, 680, font(90, bold=True), coral)
            return True
        # four
        px, py, R = 560, 560, 240
        draw.ellipse((px - R, py - R, px + R, py + R), fill=panel, outline=line, width=5)
        cols = [(coral, SHADE), (K.ROAD, (214, 226, 250)), (sage, sage_soft), (K.BOTH_COLOR, lav_soft)]
        n = 0
        for k in range(4):
            a = K.clamp01((progress - 0.08 - k * 0.15) * 6)
            if a <= 0:
                continue
            n += 1
            turn_arc(draw, px, py, R, k * 90, 90 * a, cols[k][1], cols[k][0], width=6)
        circ(draw, px, py, 10, ink)
        if n >= 4 and progress > 0.7:
            arjun_top(draw, px, py, 0.8, 0)
            K.draw_check(draw, px + 200, py - 220, 34, sage)
        terms = ["90", "90", "90", "90"]
        x = 1000
        for k in range(n):
            K.text_at(draw, terms[k], 1060 + k * 190, 330, font(76, bold=True), cols[k][0])
            if k < 3 and k < n - 1:
                K.text_at(draw, "+", 1155 + k * 190, 336, font(64, bold=True), muted)
        if n >= 4:
            K.text_at(draw, "= 360°", 1340, 470, font(110, bold=True), coral)
            K.pill(draw, 1340, 650, "Full turn: back to the start!", sage, size=40)
        return True

    # ---- directions -------------------------------------------------------------------
    if visual == "c14-compass":
        if focus == "intro":
            draw.rounded_rectangle((260, 260, 980, 860), radius=30, fill=(244, 236, 214))
            for k in range(5):
                draw.line((300, 330 + k * 120, 940, 330 + k * 120), fill=(230, 218, 190), width=3)
            compass(draw, 620, 560, 190, ink, words=False)
            arjun_top(draw, 620, 560, 0.75, 0, arrow=False)
            rows = [("N", "North", "top"), ("E", "East", "right"), ("S", "South", "bottom"), ("W", "West", "left")]
            for i, (d, name, where) in enumerate(rows):
                a = K.stagger(progress, i + 1, step=0.13, speed=4)
                if a <= 0:
                    continue
                y = 290 + i * 140 + int((1 - a) * 20)
                draw.rounded_rectangle((1100, y, 1760, y + 110), radius=55, fill=panel, outline=line, width=3)
                circ(draw, 1160, y + 55, 40, coral)
                K.text_at(draw, d, 1160, y + 30, font(44, bold=True), (255, 255, 255))
                draw.text((1230, y + 30), name, fill=ink, font=font(46, bold=True))
                draw.text((1460, y + 34), "· " + where, fill=muted, font=font(40, bold=True))
            return True
        if focus in ("right", "left"):
            sign = 1 if focus == "right" else -1
            hd = sign * 270 * K.ease_in_out(K.clamp01(progress * 1.3))
            idx = int(round(hd / 90)) % 4
            compass(draw, 620, 560, 210, ink, hot=DIRS[idx])
            arc_arrow(draw, 620, 560, 150, 0, hd, coral if sign > 0 else sage, width=10)
            arjun_top(draw, 620, 560, 0.8, hd)
            seq = ["N", "E", "S", "W"] if sign > 0 else ["N", "W", "S", "E"]
            reached = int(abs(hd) / 90 + 0.02)
            K.text_at(draw, "Right turn" if sign > 0 else "Left turn", 1360, 280 + lift, font(64, bold=True), ink)
            K.text_at(draw, "= clockwise" if sign > 0 else "= anticlockwise", 1360, 360 + lift, font(56, bold=True),
                      coral if sign > 0 else sage)
            for i, d in enumerate(seq):
                x = 1090 + i * 180
                on = i <= reached
                circ(draw, x, 560, 52, (coral if sign > 0 else sage) if on else line)
                K.text_at(draw, d, x, 532, font(50, bold=True), (255, 255, 255) if on else muted)
                if i < 3:
                    K.draw_arrow(draw, x + 58, 560, x + 122, 560, muted, width=6, head=18)
            if sign > 0:
                clock(draw, 1300, 760, 80, (t * 360) % 360, ink=ink)
                K.text_at(draw, "like a clock", 1500, 740, font(36, bold=True), muted)
            else:
                K.text_at(draw, "the other way", 1360, 740, font(40, bold=True), muted)
            return True
        # trick
        ox, oy = 960, 560
        compass(draw, ox, oy, 110, ink)
        arc_arrow(draw, ox, oy, 70, 0, 300 * K.clamp01(progress * 1.4), coral, width=8)
        words = [("N", "ever", ox, 250), ("E", "at", ox + 430, oy - 40), ("S", "oggy", ox, 770),
                 ("W", "heat", ox - 440, oy - 40)]
        for i, (first, rest, x, y) in enumerate(words):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            f1, f2 = font(96, bold=True), font(64, bold=True)
            w1 = draw.textbbox((0, 0), first, font=f1)[2]
            w2 = draw.textbbox((0, 0), rest, font=f2)[2]
            x0 = x - (w1 + w2) / 2
            yy = y + int((1 - a) * 20)
            draw.rounded_rectangle((x0 - 30, yy - 10, x0 + w1 + w2 + 30, yy + 110), radius=30, fill=panel,
                                   outline=coral, width=4)
            draw.text((x0, yy), first, fill=coral, font=f1)
            draw.text((x0 + w1, yy + 26), rest, fill=ink, font=f2)
        return True

    # ---- turning game ------------------------------------------------------------------
    if visual == "c14-game":
        games = {"q1": (0, 90, "NORTH", "1 quarter turn RIGHT", "EAST!"),
                 "q2": (90, -90, "EAST", "1 quarter turn LEFT", "NORTH!"),
                 "q3": (0, 270, "NORTH", "3 quarter turns RIGHT", "WEST!")}
        if focus == "intro":
            ground((240, 250, 1000, 860), grass=True)
            compass(draw, 620, 560, 210, ink, hot="N")
            arjun_top(draw, 620, 560, 0.85, 0)
            K.shadow_card(draw, (1100, 280 + lift, 1760, 820 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "GAME TIME", 1430, 340 + lift, font(40, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "Arjun faces", 1430, 430 + lift, font(56, bold=True), ink)
            K.text_at(draw, "NORTH", 1430, 500 + lift, font(80, bold=True), coral)
            K.pill(draw, 1430, 640 + lift, "Right = clockwise", coral, size=32)
            K.pill(draw, 1430, 730 + lift, "Left = anticlockwise", sage, size=32)
            return True
        key = "q" + focus[1]
        start, sweep, face, cmd, ans_txt = games[key]
        ans = focus.startswith("a")
        ground((240, 250, 1000, 860), grass=True)
        if ans:
            hd = start + sweep * K.ease_in_out(K.clamp01(progress * 1.6))
        else:
            hd = start
        idx = int(round(hd / 90)) % 4
        done = ans and abs(hd - (start + sweep)) < 0.5
        compass(draw, 620, 560, 210, ink, hot=DIRS[idx] if (done or not ans) else None)
        if ans:
            arc_arrow(draw, 620, 560, 150, start, hd - start, coral if sweep > 0 else sage, width=10)
            if key == "q3":
                for k in range(1, 4):
                    if hd - start >= k * 90 - 1:
                        lx, ly = rot(620, 560, start + k * 90 - 45, 0, -150)
                        circ(draw, lx, ly, 26, K.GOLD)
                        K.text_at(draw, str(k), lx, ly - 20, font(32, bold=True), ink)
        arjun_top(draw, 620, 560, 0.85, hd)
        K.shadow_card(draw, (1100, 270, 1760, 830), brand, radius=40, outline=sage if done else None,
                      outline_w=6 if done else 3)
        K.text_at(draw, "Facing", 1430, 310, font(40, bold=True), muted)
        K.text_at(draw, face, 1430, 360, font(70, bold=True), ink)
        K.pill(draw, 1430, 470, cmd, coral if sweep > 0 else sage, size=34)
        if not ans:
            K.text_at(draw, "?", 1430, 560, font(int(130 + 16 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1660, 760, 36, progress, brand)
        elif done:
            K.text_at(draw, ans_txt, 1430, 580, font(96, bold=True), sage)
            K.draw_check(draw, 1680, 330, 30, sage)
            if key == "q3":
                K.text_at(draw, "270°", 1430, 720, font(56, bold=True), coral)
        return True

    # ---- spot the mistake ---------------------------------------------------------------
    if visual == "c14-mistake":
        if focus == "ask":
            draw.ellipse((420 - 250, 600 - 250, 420 + 250, 600 + 250), fill=lav_soft)
            kavya(draw, 420, 560, 1.5, t)
            K.pill(draw, 420, 800, "Kavya", K.BOTH_COLOR, size=36)
            K.draw_bubble(draw, (760, 250, 1500, 450), brand, "Turn right 90° is a quarter turn anticlockwise!",
                          tail="left", size=42)
            K.text_at(draw, "True or false?", 1130, 580, font(64, bold=True), coral)
            K.draw_stopwatch(draw, 1130, 780, 50, progress, brand)
            question_marks([(1650, 520)], size=90)
            return True
        K.text_at(draw, "FALSE!", cx, 240, font(80, bold=True), K.DANGER)
        for k, (lab, sub, sgn, col) in enumerate((("Right turn", "clockwise", 1, coral),
                                                  ("Left turn", "anticlockwise", -1, sage))):
            x = cx + (k * 2 - 1) * 400
            a = K.stagger(progress, k, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 560 + int((1 - a) * 30)
            clock(draw, x, y, 170, (sgn * 90 * K.clamp01(progress * 1.5)) % 360, ink=ink)
            arc_arrow(draw, x, y, 215, 0, sgn * 120, col, width=10)
            K.text_at(draw, lab, x, y + 225, font(48, bold=True), ink)
            K.text_at(draw, sub, x, y - 300, font(40, bold=True), col)
        kavya(draw, cx, 600, 0.7, t)
        return True

    # ---- coding turtle -------------------------------------------------------------------
    if visual == "c14-robot":
        def board(x0, y0, x1, y1):
            draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x1, y1), radius=30, fill=panel, outline=line, width=3)
            for gx in range(int(x0) + 60, int(x1), 80):
                draw.line((gx, y0 + 20, gx, y1 - 20), fill=(240, 236, 228), width=2)
            for gy in range(int(y0) + 60, int(y1), 80):
                draw.line((x0 + 20, gy, x1 - 20, gy), fill=(240, 236, 228), width=2)

        if focus == "turtle":
            draw.rounded_rectangle((180, 270, 820, 850), radius=30, fill=(246, 241, 233))
            K.text_at(draw, "Block code", 500, 300, font(40, bold=True), muted)
            code_block(draw, 280, 400, "when start", K.GOLD)
            code_block(draw, 280, 500, "turn right 90°", K.BOTH_COLOR, active=True)
            board(960, 260, 1760, 860)
            hd = move(0, 90, speed=1.6, delay=0.15)
            turn_arc(draw, 1360, 560, 200, 0, hd, SHADE, coral)
            turtle_top(draw, 1360, 560, 1.3, hd)
            return True
        if focus == "spin":
            board(560, 260, 1360, 860)
            hd = (progress * 360 * 1.2) % 360
            spot(draw, 960, 560, 150, K.ROAD)
            arc_arrow(draw, 960, 560, 220, hd - 120, 100, coral, width=10)
            turtle_top(draw, 960, 560, 1.3, hd)
            K.pill(draw, 1640, 380, "Spins on the spot", sage, size=34)
            K.draw_arrow(draw, 1520, 600, 1760, 600, muted, width=12, head=34)
            K.draw_cross(draw, 1640, 600, 40, K.DANGER)
            K.text_at(draw, "No walking!", 1640, 670, font(40, bold=True), K.DANGER)
            return True
        if focus == "four":
            draw.rounded_rectangle((160, 260, 820, 860), radius=30, fill=(246, 241, 233))
            step = min(4, int(progress * 5))
            for k in range(4):
                code_block(draw, 250, 300 + k * 130, "turn right 90°", K.BOTH_COLOR, active=k == step)
                if k < step:
                    K.draw_check(draw, 740, 338 + k * 130, 22, sage)
            frac = progress * 5 - step
            hd = step * 90 + (90 * K.ease_in_out(K.clamp01(frac * 1.5)) if step < 4 else 0)
            compass(draw, 1260, 560, 200, ink, hot=DIRS[int(round(hd / 90)) % 4])
            turtle_top(draw, 1260, 560, 0.95, hd)
            if step >= 4:
                K.draw_check(draw, 1690, 430, 34, sage)
                K.pill(draw, 1690, 500, "Back to start!", sage, size=30)
            return True
        # next
        board(560, 250, 1360, 860)
        pts = [(760, 760), (760, 360), (1160, 360), (1160, 760), (760, 760)]
        d = K.clamp01(progress * 1.3) * 4
        k = min(3, int(d))
        f = d - k if d < 4 else 1.0
        for j in range(k):
            draw.line((pts[j], pts[j + 1]), fill=coral, width=12)
        hx = K.lerp(pts[k][0], pts[k + 1][0], f)
        hy = K.lerp(pts[k][1], pts[k + 1][1], f)
        draw.line((pts[k], (hx, hy)), fill=coral, width=12)
        hd = [0, 90, 180, 270][k]
        turtle_top(draw, hx, hy, 0.6, hd)
        K.text_at(draw, "Next chapter:", 1640, 380 + lift, font(44, bold=True), muted)
        K.text_at(draw, "Draw shapes!", 1640, 440 + lift, font(56, bold=True), coral)
        code_block(draw, 1450, 560, "forward 4", K.ROAD, wd=380)
        code_block(draw, 1450, 660, "turn right 90°", K.BOTH_COLOR, wd=380)
        return True

    # ---- checkpoint ------------------------------------------------------------------
    if visual == "c14-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 800 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Which way now?", cx, 450 + lift, font(64, bold=True), ink)
            arjun_top(draw, cx, 660 + lift, 0.6, 0)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 240 + 12, 960 + 10, 860 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 960, 860), radius=24, fill=(255, 250, 238))
        rows = [("You face", "NORTH", ink), ("2 quarter turns", "RIGHT", coral), ("Which way now?", "", ink)]
        for i, (a_, b_, col) in enumerate(rows):
            y = 300 + i * 120
            draw.text((190, y), a_, fill=ink, font=font(48, bold=True))
            if b_:
                bw = draw.textbbox((0, 0), a_ + " ", font=font(48, bold=True))[2]
                draw.text((190 + bw, y), b_, fill=col, font=font(48, bold=True))
        if ans:
            K.text_at(draw, "SOUTH!", 545, 640, font(96, bold=True), sage)
            K.pill(draw, 545, 770, "Half turn = 180°", K.BOTH_COLOR, size=36)
        else:
            for i in range(2):
                draw.line((190, 700 + i * 80, 900, 700 + i * 80), fill=(220, 210, 232), width=3)
        hd = 180 * K.ease_in_out(K.clamp01(progress * 1.5)) if ans else 0
        idx = int(round(hd / 90)) % 4
        compass(draw, 1400, 560, 220, ink, hot=DIRS[idx] if (not ans or hd > 179) else None)
        if ans:
            arc_arrow(draw, 1400, 560, 160, 0, hd, coral, width=10)
            for k in range(1, 3):
                if hd >= k * 90 - 1:
                    lx, ly = rot(1400, 560, k * 90 - 45, 0, -160)
                    circ(draw, lx, ly, 26, K.GOLD)
                    K.text_at(draw, str(k), lx, ly - 20, font(32, bold=True), ink)
        arjun_top(draw, 1400, 560, 0.85, hd)
        if not ans:
            K.draw_stopwatch(draw, 1730, 300, 40, progress, brand)
        elif hd > 179:
            star_spots([(1100, 300), (1740, 820)])
        return True

    # ---- recap ---------------------------------------------------------------------------
    if visual == "c14-recap":
        recap = [(("90° quarter,", "180° half, 360° full"), coral, "pies"),
                 (("4 quarter turns", "bring you back"), K.ROAD, "four"),
                 (("Right turn =", "clockwise"), sage, "right"),
                 (("Turn = change", "where you face"), K.BOTH_COLOR, "face")]
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
                if kind == "pies":
                    for k, (sw, lb, c_) in enumerate(((90, "90°", coral), (180, "180°", K.ROAD),
                                                      (360, "360°", sage))):
                        px = ix - 120 + k * 120
                        pie_icon(px, iy - 20, 48, sw, c_, [SHADE, (214, 226, 250), FULL_SOFT][k])
                        K.text_at(draw, lb, px, iy + 44, font(30, bold=True), c_)
                elif kind == "four":
                    for k in range(4):
                        turn_arc(draw, ix, iy, 110, k * 90, 90,
                                 [SHADE, (214, 226, 250), sage_soft, lav_soft][k],
                                 [coral, K.ROAD, sage, K.BOTH_COLOR][k], width=4)
                    arjun_top(draw, ix, iy + 10, 0.5, 0)
                elif kind == "right":
                    compass(draw, ix, iy - 10, 88, ink)
                    arc_arrow(draw, ix, iy - 10, 56, 0, 270, coral, width=7)
                else:
                    spot(draw, ix, iy + 10, 80, K.BOTH_COLOR)
                    arjun_top(draw, ix, iy + 10, 0.6, 90)
                    arc_arrow(draw, ix, iy + 10, 130, -20, 120, K.BOTH_COLOR, width=7)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font(34, bold=True), ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            arjun(draw, cx + 300, 410, 1.2, t)
            K.text_at(draw, "Chapter 4 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Turning champion", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
