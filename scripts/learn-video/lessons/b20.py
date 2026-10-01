"""B20 · Capstone: Imagine Your Own AI Helper — visuals."""
import math

import build as K

PAPER = (255, 250, 238)
RULE = (220, 210, 232)
WOOD = (196, 150, 98)
WOOD_DARK = (150, 106, 64)
STONE = (214, 204, 188)
STONE_DARK = (176, 164, 146)
LAV_SOFT = (239, 234, 251)
BLUE_SOFT = (230, 238, 251)
GOLD_SOFT = (255, 242, 214)
SPOT = (255, 246, 214)
PENCIL = (255, 200, 60)
RAIL = (120, 132, 150)
BROWN_LEAF = (176, 120, 60)
ROSE = (232, 70, 110)
PHOTO_BG = (236, 246, 232)


def F(size: float):
    return K.load_font(max(26, int(size)), bold=True)


# ---- small illustrations ---------------------------------------------------------------

def phone(draw, cx, cy, s, screen=K.DEV_SCREEN):
    W, H = 110 * s, 200 * s
    draw.rounded_rectangle((cx - W + 8 * s, cy - H + 10 * s, cx + W + 8 * s, cy + H + 10 * s), radius=30 * s,
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=30 * s, fill=K.DEV_DARK)
    box = (cx - W + 12 * s, cy - H + 34 * s, cx + W - 12 * s, cy + H - 34 * s)
    draw.rectangle(box, fill=screen)
    draw.rounded_rectangle((cx - 26 * s, cy - H + 14 * s, cx + 26 * s, cy - H + 22 * s), radius=4 * s, fill=K.DEV_MID)
    draw.ellipse((cx - 9 * s, cy + H - 26 * s, cx + 9 * s, cy + H - 8 * s), fill=K.DEV_MID)
    return box


def leaf_shape(draw, x, y, L, W, ang, col, vein=None):
    dx, dy = math.cos(ang), math.sin(ang)
    nx, ny = -dy, dx
    left, right = [], []
    for k in range(15):
        u = k / 14
        hw = W * math.sin(math.pi * u) ** 0.8
        px, py = x + dx * L * u, y + dy * L * u
        left.append((px + nx * hw, py + ny * hw))
        right.append((px - nx * hw, py - ny * hw))
    draw.polygon(left + right[::-1], fill=col)
    if vein:
        draw.line((x, y, x + dx * L * 0.9, y + dy * L * 0.9), fill=vein, width=max(2, int(W * 0.12)))


def leaf_photo(draw, cx, cy, wd, ht, healthy=True, k=0, ring=None):
    x0, y0, x1, y1 = cx - wd / 2, cy - ht / 2, cx + wd / 2, cy + ht / 2
    draw.rounded_rectangle((x0 + 5, y0 + 7, x1 + 5, y1 + 7), radius=12, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=12, fill=(255, 255, 255), outline=ring or (220, 214, 204),
                           width=6 if ring else 3)
    draw.rectangle((x0 + 10, y0 + 10, x1 - 10, y1 - 10), fill=PHOTO_BG if healthy else (246, 238, 222))
    L = ht * 0.62
    if healthy:
        col = [K.LEAF, (58, 128, 74), (96, 170, 90)][k % 3]
        leaf_shape(draw, cx, cy + L / 2, L, wd * 0.16, -math.pi / 2 + (k % 3 - 1) * 0.2, col, (150, 210, 150))
    else:
        col = [BROWN_LEAF, (190, 150, 70), (160, 110, 60)][k % 3]
        leaf_shape(draw, cx - wd * 0.18, cy - L * 0.25, L, wd * 0.14, 0.9 + (k % 3) * 0.12, col, (220, 190, 140))


def plant_pal(draw, cx, cy, s, t=0.0, mood="happy"):
    def S(v):
        return v * s
    y = cy + S(5) * math.sin(t * math.pi * 4)
    draw.ellipse((cx - S(100), cy + S(98), cx + S(100), cy + S(122)), fill=K.SHADOW)
    draw.line((cx, y - S(80), cx, y - S(140)), fill=K.LEAF, width=max(3, int(S(10))))
    sway = 0.12 * math.sin(t * 6)
    leaf_shape(draw, cx, y - S(126), S(80), S(26), -0.45 + sway, K.LEAF, (150, 210, 150))
    leaf_shape(draw, cx, y - S(116), S(70), S(24), math.pi + 0.5 + sway, (96, 170, 90), (170, 220, 160))
    body = [(cx - S(100), y - S(60)), (cx + S(100), y - S(60)), (cx + S(78), y + S(100)), (cx - S(78), y + S(100))]
    draw.polygon([(x + S(8), yy + S(10)) for x, yy in body], fill=K.SHADOW)
    draw.polygon(body, fill=K.TERRACOTTA)
    draw.rounded_rectangle((cx - S(112), y - S(84), cx + S(112), y - S(48)), radius=S(12), fill=(178, 88, 56))
    draw.rounded_rectangle((cx - S(64), y - S(34), cx + S(64), y + S(60)), radius=S(20), fill=K.DEV_DEEP)
    ew = max(2, int(S(7)))
    ey = y - S(4)
    for sd in (-1, 1):
        ex = cx + sd * S(28)
        if mood == "happy":
            draw.arc((ex - S(14), ey - S(8), ex + S(14), ey + S(18)), 200, 340, fill=K.LED_ON, width=ew)
        elif mood == "sad":
            draw.arc((ex - S(14), ey - S(2), ex + S(14), ey + S(22)), 20, 160, fill=K.LED_ON, width=ew)
        else:
            draw.ellipse((ex - S(10), ey - S(4), ex + S(10), ey + S(16)), fill=K.LED_ON)
    if mood == "sad":
        draw.arc((cx - S(20), y + S(30), cx + S(20), y + S(52)), 200, 340, fill=K.LED_ON, width=ew)
    else:
        draw.arc((cx - S(22), y + S(14), cx + S(22), y + S(42)), 20, 160, fill=K.LED_ON, width=ew)
    for sd in (-1, 1):
        draw.ellipse((cx + sd * S(48) - S(9), y + S(26), cx + sd * S(48) + S(9), y + S(40)), fill=(255, 150, 140))


def drop(draw, cx, cy, s, col=K.WATER_DEEP):
    def S(v):
        return v * s
    draw.polygon([(cx, cy - S(40)), (cx - S(24), cy + S(2)), (cx + S(24), cy + S(2))], fill=col)
    draw.ellipse((cx - S(25), cy - S(14), cx + S(25), cy + S(34)), fill=col)
    draw.ellipse((cx - S(12), cy - S(2), cx - S(4), cy + S(10)), fill=(255, 255, 255))


def rose_pot(draw, cx, by, s, health=1.0, t=0.0):
    K.draw_plant(draw, cx, by, s, health, 0.0, t)
    if health > 0.5:
        def S(v):
            return v * s
        top = by - S(120) - S(150) * (0.7 + 0.3 * health)
        for k, dx in enumerate((-50, 50)):
            x, y = cx + S(dx), top + S(60)
            draw.ellipse((x - S(22), y - S(22), x + S(22), y + S(22)), fill=ROSE)
            draw.arc((x - S(12), y - S(12), x + S(12), y + S(12)), 0, 270, fill=(190, 40, 80), width=max(2, int(S(4))))


def railing(draw, x0, x1, y, s=1.0):
    draw.rectangle((x0, y, x1, y + 16 * s), fill=RAIL)
    draw.rectangle((x0, y + 170 * s, x1, y + 184 * s), fill=RAIL)
    n = int((x1 - x0) / (60 * s))
    for k in range(n + 1):
        x = x0 + k * (x1 - x0) / n
        draw.rectangle((x - 5 * s, y, x + 5 * s, y + 180 * s), fill=RAIL)


def bulb(draw, cx, cy, s, t=0.0):
    def S(v):
        return v * s
    for k in range(8):
        a = k * math.pi / 4 + t * 0.5
        r0, r1 = S(92), S(122 + 8 * math.sin(t * 10 + k))
        draw.line((cx + math.cos(a) * r0, cy - S(10) + math.sin(a) * r0,
                   cx + math.cos(a) * r1, cy - S(10) + math.sin(a) * r1), fill=K.GOLD, width=max(3, int(S(9))))
    draw.ellipse((cx - S(70), cy - S(80), cx + S(70), cy + S(60)), fill=K.GOLD)
    draw.polygon([(cx - S(36), cy + S(44)), (cx + S(36), cy + S(44)), (cx + S(28), cy + S(78)), (cx - S(28), cy + S(78))],
                 fill=K.GOLD)
    for k in range(3):
        y = cy + S(80) + k * S(16)
        draw.rounded_rectangle((cx - S(30), y, cx + S(30), y + S(12)), radius=S(6), fill=K.STEEL_DARK)


def pencil(draw, cx, cy, s, ang=-0.7):
    def S(v):
        return v * s
    ca, sa = math.cos(ang), math.sin(ang)

    def P(x, y):
        return (cx + x * ca - y * sa, cy + x * sa + y * ca)
    draw.polygon([P(-S(130), -S(16)), P(S(90), -S(16)), P(S(90), S(16)), P(-S(130), S(16))], fill=PENCIL)
    draw.polygon([P(-S(150), -S(16)), P(-S(130), -S(16)), P(-S(130), S(16)), P(-S(150), S(16))], fill=(240, 150, 170))
    draw.polygon([P(S(90), -S(16)), P(S(130), 0), P(S(90), S(16))], fill=(240, 214, 170))
    draw.polygon([P(S(116), -S(5)), P(S(130), 0), P(S(116), S(5))], fill=K.DEV_DARK)


def clipboard(draw, box, title=None):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=26, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=26, fill=WOOD)
    draw.rounded_rectangle((x0 + 22, y0 + 34, x1 - 22, y1 - 22), radius=12, fill=(255, 255, 255))
    mx = (x0 + x1) / 2
    draw.rounded_rectangle((mx - 90, y0 - 16, mx + 90, y0 + 44), radius=14, fill=K.STEEL_DARK)
    draw.rounded_rectangle((mx - 60, y0 - 4, mx + 60, y0 + 16), radius=8, fill=K.STEEL)
    if title:
        K.text_at(draw, title, mx, y0 + 64, F(42), K.CORAL)


def trophy(draw, cx, cy, s, label=None):
    def S(v):
        return v * s
    for sx in (-1, 1):
        draw.arc((cx + sx * S(64) - S(30), cy - S(70), cx + sx * S(64) + S(30), cy - S(10)),
                 *((90, 270) if sx < 0 else (270, 90)), fill=(214, 150, 40), width=max(3, int(S(12))))
    draw.pieslice((cx - S(66), cy - S(150), cx + S(66), cy + S(20)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(66), cy - S(84), cx + S(66), cy - S(62)), fill=K.GOLD)
    draw.rectangle((cx - S(70), cy - S(92), cx + S(70), cy - S(78)), fill=(214, 150, 40))
    draw.rectangle((cx - S(12), cy + S(16), cx + S(12), cy + S(48)), fill=(214, 150, 40))
    draw.rounded_rectangle((cx - S(52), cy + S(46), cx + S(52), cy + S(74)), radius=S(8), fill=K.DEV_DARK)
    if label:
        K.text_at(draw, label, cx, cy - S(70), F(S(48)), K.DEV_DARK)


def arch(draw, cx, base_y, s, cap_drop):
    def S(v):
        return v * s
    for side in (-1, 1):
        px = cx + side * S(170)
        for k in range(5):
            y = base_y - (k + 1) * S(56)
            draw.rounded_rectangle((px - S(56), y, px + S(56), y + S(52)), radius=S(6),
                                   fill=STONE if k % 2 else STONE_DARK)
    top = base_y - 5 * S(56)
    n = 7
    r0, r1 = S(114), S(226)

    def seg(k, dy=0.0):
        a0 = math.pi + k * math.pi / n
        a1 = a0 + math.pi / n
        return [(cx + math.cos(a0) * r1, top + math.sin(a0) * r1 + dy), (cx + math.cos(a1) * r1, top + math.sin(a1) * r1 + dy),
                (cx + math.cos(a1) * r0, top + math.sin(a1) * r0 + dy), (cx + math.cos(a0) * r0, top + math.sin(a0) * r0 + dy)]
    for k in range(n):
        if k == n // 2:
            continue
        draw.polygon(seg(k), fill=STONE if k % 2 else STONE_DARK, outline=(150, 138, 120), width=max(2, int(S(3))))
    pts = seg(n // 2, -cap_drop)
    draw.polygon(pts, fill=K.GOLD, outline=(214, 150, 40), width=max(2, int(S(4))))
    draw.rectangle((cx - S(280), base_y, cx + S(280), base_y + S(20)), fill=STONE_DARK)
    return pts


def face_photo(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(70) + S(5), cy - S(60) + S(7), cx + S(70) + S(5), cy + S(60) + S(7)), radius=S(12),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(70), cy - S(60), cx + S(70), cy + S(60)), radius=S(12), fill=(255, 255, 255),
                           outline=(220, 214, 204), width=max(2, int(S(3))))
    draw.rectangle((cx - S(60), cy - S(50), cx + S(60), cy + S(50)), fill=BLUE_SOFT)
    draw.chord((cx - S(44), cy + S(10), cx + S(44), cy + S(90)), 180, 360, fill=K.CORAL)
    K.draw_face(draw, cx, cy - S(8), S(26), "kid", 0.6)


def shield_lock(draw, cx, cy, s, col):
    K.draw_shield(draw, cx, cy, s, col, mark="lock")


def stage(draw, cx):
    draw.rectangle((140, 760, 1780, 800), fill=WOOD_DARK)
    draw.rectangle((140, 740, 1780, 762), fill=WOOD)
    for side in (-1, 1):
        xe = 140 if side < 0 else 1780
        xi = xe - side * 230
        draw.polygon([(xe, 230), (xi, 230), (xi + side * 40, 420), (xe, 740)], fill=(206, 70, 60))
        for k in range(3):
            fx = xe - side * (50 + k * 60)
            draw.line((fx, 240, fx + side * 10, 720), fill=(176, 50, 44), width=6)
    draw.rectangle((140, 222, 1780, 250), fill=(176, 50, 44))
    draw.polygon([(cx - 60, 250), (cx + 60, 250), (cx + 300, 740), (cx - 300, 740)], fill=SPOT)


def apple(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.ellipse((cx - S(40), cy - S(34), cx + S(4), cy + S(40)), fill=K.DANGER)
    draw.ellipse((cx - S(4), cy - S(34), cx + S(40), cy + S(40)), fill=K.DANGER)
    draw.line((cx, cy - S(30), cx + S(6), cy - S(54)), fill=WOOD_DARK, width=max(2, int(S(6))))
    leaf_shape(draw, cx + S(6), cy - S(46), S(34), S(10), -0.4, K.LEAF)


def banana(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.arc((cx - S(60), cy - S(70), cx + S(60), cy + S(40)), 20, 160, fill=K.GOLD, width=max(4, int(S(26))))
    draw.ellipse((cx - S(62), cy - S(2), cx - S(48), cy + S(12)), fill=WOOD_DARK)


# ---- render --------------------------------------------------------------------------------

def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    star_cols = [coral, sage, K.BOTH_COLOR, K.GOLD]

    def sparkle(pts):
        for i, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + i), 20 + 6 * pulse, star_cols[i % 4],
                        rot=progress * 3 + i)

    def qmarks(pts, size=80):
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(size + 20 * (pulse if k % 2 else 1 - pulse)), K.GOLD)

    def confetti(n=26, y0=230, y1=860):
        for i in range(n):
            x = (i * 137.5) % 1720 + 100
            y = y0 + ((i * 89 + progress * 900) % (y1 - y0))
            col = star_cols[i % 4]
            a = progress * 6 + i
            dx, dy = 12 * math.cos(a), 6 * math.sin(a)
            draw.polygon([(x - dx, y - dy - 6), (x + dx, y + dy - 6), (x + dx, y + dy + 6), (x - dx, y - dy + 6)],
                         fill=col)

    def label_lines(text, x, y, size, col=None, max_w=360):
        font = F(size)
        for j, ln in enumerate(K.wrap_text(text, font, max_w)):
            K.text_at(draw, ln, x, y + j * int(size * 1.2), font, col or ink)

    def row_boxes(n, cw, gap, y0, y1):
        xs = cx - (n * cw + (n - 1) * gap) / 2
        return [(xs + i * (cw + gap), y0, xs + i * (cw + gap) + cw, y1) for i in range(n)]

    def step_icon(kind, x, y, s=1.0):
        if kind == "who":
            K.draw_person(draw, x - 50 * s, y - 20 * s, 0.6 * s, "kid", t)
            K.draw_person(draw, x + 60 * s, y - 20 * s, 0.6 * s, "nani", t)
        elif kind == "data":
            for k in range(3):
                leaf_photo(draw, x - 50 * s + k * 50 * s, y - 20 * s + k * 20 * s, 110 * s, 100 * s, k != 2, k)
        elif kind == "privacy":
            shield_lock(draw, x, y, 0.75 * s, sage)
        elif kind == "pitch":
            K.draw_device(draw, "mic", x - 40 * s, y + 10 * s, 0.7 * s, brand)
            K.draw_stopwatch(draw, x + 70 * s, y - 40 * s, 40 * s, t, brand)
        elif kind == "pal":
            plant_pal(draw, x, y + 20 * s, 0.7 * s, t)
        elif kind == "pattern":
            for k in range(3):
                leaf_photo(draw, x - 90 * s + k * 90 * s, y - 30 * s, 80 * s, 90 * s, False, k)
            drop(draw, x, y + 70 * s, 0.9 * s)
        elif kind == "only":
            leaf_photo(draw, x - 60 * s, y, 100 * s, 100 * s, True, 0)
            K.draw_check(draw, x - 20 * s, y - 50 * s, 18 * s, sage)
            face_photo(draw, x + 70 * s, y + 10 * s, 0.6 * s)
            K.draw_cross(draw, x + 100 * s, y - 30 * s, 18 * s, K.DANGER)

    def icon_card(box, kind, label, num=None, col=None, label_size=36, icon_s=1.0):
        x0, y0, x1, y1 = box
        mx = (x0 + x1) / 2
        K.shadow_card(draw, box, brand, radius=30)
        if num is not None:
            K.pill(draw, 0, y0 + 20, str(num), col or coral, size=28, left=x0 + 20)
        step_icon(kind, mx, y0 + (y1 - y0) * 0.44, icon_s)
        font = F(label_size)
        lines = K.wrap_text(label, font, int(x1 - x0 - 36))
        lh = int(label_size * 1.2)
        ty = y1 - 26 - len(lines) * lh
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, mx, ty + j * lh, font, ink)

    def plan_sheet(rows, filled, title="My AI Helper", box=(130, 260, 900, 860), hi=None):
        clipboard(draw, box, title)
        x0, y0, x1, y1 = box
        top = y0 + 140
        rh = (y1 - 50 - top) / len(rows)
        for i, (k_, v) in enumerate(rows):
            ry = top + i * rh
            if hi == i:
                draw.rounded_rectangle((x0 + 36, ry + 4, x1 - 36, ry + rh - 8), radius=18, fill=sage_soft, outline=sage,
                                       width=4)
            draw.line((x0 + 50, ry + rh - 10, x1 - 50, ry + rh - 10), fill=RULE, width=3)
            draw.text((x0 + 60, ry + rh / 2 - 30), k_, fill=muted, font=F(36))
            kx = x0 + 60 + draw.textbbox((0, 0), k_ + " ", font=F(36))[2]
            if i < filled and v:
                draw.text((kx, ry + rh / 2 - 31), v, fill=ink, font=F(36))
            elif i >= filled:
                K.pill(draw, 0, ry + rh / 2 - 28, "?", K.STEEL_DARK, size=28, left=kx)

    plan_rows = [("Name:", "Plant Pal"), ("User:", "Meera's family"), ("Job:", "tells us: water me!"),
                 ("Data:", "leaf photos"), ("Never stores:", "photos of people")]

    # ---- opening -----------------------------------------------------------------------
    if visual == "b20-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 400), 470, 110, sage, panel, bounce)
            plant_pal(draw, cx + 360, 500, 1.15, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, F(64), ink)
            sparkle([(cx - 700, 320), (cx - 80, 330), (cx + 720, 320), (cx + 80, 600)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · AI HELPING PEOPLE", cx, 290 + lift, F(34), sage)
            draw.ellipse((560 - 220, 590 - 220 + lift, 560 + 220, 590 + 220 + lift), fill=BLUE_SOFT)
            K.draw_robot(draw, 470, 640 + lift, 0.55, t, mood="happy")
            K.draw_person(draw, 680, 560 + lift, 0.85, "teacher", t)
            K.draw_star(draw, 680, 440 + lift + bounce, 26, K.GOLD, rot=t)
            rows = [("AI is a tool", K.BOT), ("A helper, not the boss", K.BOTH_COLOR), ("People stay in charge", sage)]
            for i, (lab, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 370 + i * 150 + int((1 - a) * 30) + lift
                draw.rounded_rectangle((880, y, 1620, y + 120), radius=36, fill=panel, outline=col, width=5)
                K.draw_check(draw, 950, y + 60, 34, col)
                draw.text((1010, y + 32), lab, fill=ink, font=F(48))
            return True
        if focus == "chapter":
            K.shadow_card(draw, (220, 236 + lift, w - 220, 570 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5 · THE FINAL CHAPTER", cx, 290 + lift, F(32), coral)
            K.text_at(draw, "Capstone:", cx, 340 + lift, F(84), coral)
            K.text_at(draw, "Imagine Your Own AI Helper", cx, 450 + lift, F(70), ink)
            for i, kind in enumerate(("who", "data", "privacy", "pitch")):
                a = K.stagger(progress, i + 2, step=0.1, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 300
                y = 610 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 125, y, x + 125, y + 240), radius=30, fill=panel, outline=line, width=3)
                step_icon(kind, x, y + 120, 0.82)
            return True
        if focus == "word":
            drop_y = 150 * (1 - K.ease_out_cubic(K.clamp01((progress - 0.1) * 1.6)))
            pts = arch(draw, 600, 840, 0.85, drop_y)
            if drop_y < 4:
                tx = sum(p[0] for p in pts) / 4
                ty = sum(p[1] for p in pts) / 4
                for k, (ox, oy) in enumerate(((0, -100), (-150, -75), (150, -75))):
                    K.draw_star(draw, tx + ox, ty + oy + 6 * math.sin(t * 8 + k), 18 + 6 * pulse,
                                star_cols[k % 4], rot=t + k)
            K.text_at(draw, "Capstone", 1360, 300 + lift, F(100), coral)
            K.text_at(draw, "= the top stone", 1360, 430 + lift, F(56), ink)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1360, 600 + int((1 - a) * 20), "Your big, final project!", sage, size=42)
            return True
        # promise
        K.draw_person(draw, 330, 470, 1.25, "kid", t)
        draw.rounded_rectangle((620 + 10, 260 + 12, 1160 + 10, 840 + 12), radius=16, fill=K.SHADOW)
        draw.rounded_rectangle((620, 260, 1160, 840), radius=16, fill=PAPER)
        for k in range(9):
            draw.line((650, 320 + k * 60, 1130, 320 + k * 60), fill=RULE, width=3)
        n = K.clamp01(progress * 1.6)
        if n > 0:
            plant_pal(draw, 890, 560, 1.1 * (0.6 + 0.4 * n), t)
        K.text_at(draw, "Plant Pal", 890, 740, F(48), coral)
        pencil(draw, 1110, 780, 0.9)
        K.pill(draw, 1500, 440, "No coding needed!", sage, size=40)
        K.pill(draw, 1500, 560, "You're the AI designer", coral, size=34)
        bulb(draw, 1500, 740, 0.5, t)
        return True

    # ---- Meera's balcony ------------------------------------------------------------------------
    def balcony(health, sad=False):
        draw.rectangle((100, 780, 1820, 860), fill=(222, 210, 192))
        railing(draw, 820, 1800, 600)
        pots = [(960, "tulsi"), (1200, "money"), (1440, "rose"), (1660, "rose")]
        for i, (x, kind) in enumerate(pots):
            if kind == "rose":
                rose_pot(draw, x, 820, 0.85, health, t)
            else:
                K.draw_plant(draw, x, 820, 0.85 if kind == "tulsi" else 0.95, health, 0.0, t)
        K.draw_person(draw, 330, 520, 1.1, "kid", t if not sad else 0)
        K.draw_person(draw, 600, 520, 1.1, "nani", t if not sad else 0)

    if visual == "b20-hook":
        if focus == "meet":
            draw.ellipse((470 - 300, 600 - 260, 470 + 300, 600 + 260), fill=coral_soft)
            balcony(1.0)
            K.text_at(draw, "Remember Meera?", 1300, 240 + lift, F(60), coral)
            K.draw_heart(draw, 465, 360 + bounce, 28, K.DANGER)
            return True
        if focus == "droop":
            draw.ellipse((470 - 300, 600 - 260, 470 + 300, 600 + 260), fill=(240, 236, 228))
            balcony(0.1, sad=True)
            sx, sy = 1700, 300
            for k in range(8):
                a = k * math.pi / 4 + t
                draw.line((sx + math.cos(a) * 60, sy + math.sin(a) * 60, sx + math.cos(a) * 86, sy + math.sin(a) * 86),
                          fill=K.GOLD, width=8)
            draw.ellipse((sx - 48, sy - 48, sx + 48, sy + 48), fill=K.GOLD)
            K.text_at(draw, "Oh no!", 1220, 260, F(80), K.DANGER)
            K.pill(draw, 465, 760, "Nobody watered them", K.DEV_MID, size=32)
            return True
        if focus == "idea":
            K.text_at(draw, "What AI helper could help?", cx, 226, F(50), ink)
            K.draw_person(draw, 480, 540, 1.15, "kid", t)
            bulb(draw, 480, 380, 0.6, t)
            K.draw_plant(draw, 900, 820, 0.9, 0.2, 0.0, t)
            box = phone(draw, 1350, 560, 1.05)
            K.text_at(draw, "?", 1350, (box[1] + box[3]) / 2 - 90, F(170), K.GOLD)
            K.draw_stopwatch(draw, 1700, 780, 44, progress, brand)
            return True
        # reveal
        draw.ellipse((cx - 300, 560 - 280, cx + 300, 560 + 280), fill=sage_soft)
        a = K.ease_out_cubic(K.clamp01(progress * 2.5))
        plant_pal(draw, cx, 570, 1.5 * (0.7 + 0.3 * a), t)
        K.text_at(draw, "Plant Pal", cx, 760, F(70), coral)
        K.draw_person(draw, 420, 500, 1.1, "kid", t)
        K.draw_plant(draw, 1480, 820, 0.95, 1.0, 0.0, t)
        K.pill(draw, 1480, 300, "Let's design it!", sage, size=40)
        sparkle([(700, 300), (1220, 320), (1240, 720), (680, 760)])
        return True

    # ---- four steps -------------------------------------------------------------------------
    if visual == "b20-steps":
        if focus == "intro":
            p0, p1, p2 = (220, 800), (900, 300), (1700, 640)
            K.draw_curve(draw, p0, p1, p2, (214, 204, 190), width=60)
            K.draw_curve(draw, p0, p1, p2, (255, 255, 255), width=6, dashed=True, phase=t * 200)
            for i in range(4):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x, y = K.qbez(p0, p1, p2, 0.12 + i * 0.26)
                r = 56 * a
                draw.ellipse((x - r + 6, y - r + 8, x + r + 6, y + r + 8), fill=K.SHADOW)
                draw.ellipse((x - r, y - r, x + r, y + r), fill=[coral, K.BOT, sage, K.BOTH_COLOR][i])
                K.text_at(draw, str(i + 1), x, y - 36 * a, F(60 * a), (255, 255, 255))
            fx, fy = K.qbez(p0, p1, p2, 1.0)
            plant_pal(draw, fx, fy - 130, 0.6, t)
            K.text_at(draw, "Just 4 steps!", 1380, 270 + lift, F(72), ink)
            return True
        boxes = row_boxes(4, 380, 56, 280, 820)
        shown = progress * 5.0 - 0.3
        cols = [coral, K.BOT, sage, K.BOTH_COLOR]
        steps = [("who", "Who & what job"), ("data", "What data"), ("privacy", "Privacy rule"), ("pitch", "Present: 1 minute")]
        for i, ((kind, lab), box) in enumerate(zip(steps, boxes)):
            a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
            if a <= 0:
                continue
            dy = int((1 - a) * 50)
            icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, num=i + 1, col=cols[i], label_size=38,
                      icon_s=1.15)
            if i < 3 and K.clamp01((shown - i - 0.6) * 3) > 0:
                K.draw_arrow(draw, box[2] + 8, 550, box[2] + 48, 550, muted, width=8, head=22)
        return True

    # ---- step 1 · user and job --------------------------------------------------------------------
    if visual == "b20-job":
        if focus == "user":
            plan_sheet(plan_rows, 2, hi=1)
            K.pill(draw, 0, 236, "STEP 1 · WHO & WHAT JOB", coral, size=30, left=960)
            draw.ellipse((1400 - 330, 560 - 230, 1400 + 330, 560 + 230), fill=coral_soft)
            for i, (kind, dx) in enumerate((("kid", -220), ("nani", -75), ("mom", 75), ("dad", 220))):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                K.draw_person(draw, 1400 + dx, 520 + int((1 - a) * 30), 0.78, kind, t)
            K.pill(draw, 1400, 760, "USER = Meera's family", coral, size=38)
            return True
        if focus == "job":
            plan_sheet(plan_rows, 3, hi=2)
            for i, lab in enumerate(("Cook", "Homework", "Games")):
                x = 1080 + i * 230
                K.pill(draw, x, 250, lab, (210, 204, 196), size=28, fg=muted)
                K.draw_cross(draw, x + 80, 252, 18, K.DANGER)
            draw.ellipse((1380 - 260, 600 - 230, 1380 + 260, 600 + 230), fill=sage_soft)
            plant_pal(draw, 1250, 640, 0.95, t)
            K.draw_plant(draw, 1530, 820, 0.8, 0.3, 0.0, t)
            a = K.ease_out_cubic(K.clamp01((progress - 0.15) * 3))
            if a > 0:
                K.draw_bubble(draw, (1060, 350, 1600, 460), brand, "Tulsi needs water!", tail="left", size=40)
                drop(draw, 1660, 420, 1.0)
            K.pill(draw, 1660, 520, "ONE job", coral, size=34)
            return True
        # sentence
        K.shadow_card(draw, (170, 270, 1750, 820), brand, radius=40, accent=coral)
        K.text_at(draw, "It helps ____ to ____.", cx, 320, F(52), muted)
        a = K.stagger(progress, 0, step=0.2, speed=4)
        b = K.stagger(progress, 1, step=0.25, speed=4)
        font = F(66)
        parts1 = [("Plant Pal helps ", ink), ("my family", coral)]
        tw = sum(draw.textbbox((0, 0), p, font=font)[2] for p, _ in parts1)
        x = cx - tw / 2
        if a > 0:
            for txt, col in parts1:
                draw.text((x, 440), txt, fill=col, font=font)
                x += draw.textbbox((0, 0), txt, font=font)[2]
        if b > 0:
            K.text_at(draw, "to water our plants on time.", cx, 540, font, sage)
        plant_pal(draw, 360, 700, 0.5, t)
        K.pill(draw, 1560, 690, "Fun name = easy to remember", K.BOTH_COLOR, size=30)
        return True

    # ---- step 2 · data ------------------------------------------------------------------------------
    if visual == "b20-data":
        if focus == "intro":
            K.pill(draw, 0, 236, "STEP 2 · WHAT DATA?", K.BOT, size=30, left=140)
            K.text_at(draw, "Data = examples", 1180, 228, F(56), ink)
            boxes = row_boxes(3, 480, 70, 330, 840)
            kinds = [("pic", "Pictures"), ("sound", "Sounds"), ("words", "Words")]
            for i, ((kind, lab), box) in enumerate(zip(kinds, boxes)):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                dy = int((1 - a) * 40)
                x0, y0, x1, y1 = box
                K.shadow_card(draw, (x0, y0 + dy, x1, y1 + dy), brand, radius=30)
                mx, my = (x0 + x1) / 2, y0 + 200 + dy
                if kind == "pic":
                    leaf_photo(draw, mx - 50, my - 20, 180, 160, True, 0)
                    leaf_photo(draw, mx + 60, my + 30, 180, 160, False, 1)
                elif kind == "sound":
                    K.draw_device(draw, "mic", mx - 60, my, 0.7, brand)
                    K.sound_waves(draw, mx, my - 30, 1.0, K.BOTH_COLOR, t)
                else:
                    draw.rounded_rectangle((mx - 130, my - 110, mx + 130, my + 110), radius=16, fill=PAPER,
                                           outline=K.DEV_MID, width=3)
                    for k, wd in enumerate(("cat", "tree", "water")):
                        draw.text((mx - 100, my - 90 + k * 64), wd, fill=[coral, sage, K.BOT][k], font=F(44))
                K.text_at(draw, lab, mx, y1 - 100 + dy, F(48), ink)
            return True
        if focus == "examples":
            for col_i, (healthy, lab, col) in enumerate(((True, "Healthy", sage), (False, "Dry", BROWN_LEAF))):
                gx = 160 if healthy else 1240
                K.pill(draw, gx + 260, 240, lab, col, size=34)
                for k in range(6):
                    a = K.stagger(progress, k + col_i * 3, step=0.06, speed=5)
                    if a <= 0:
                        continue
                    r, c = divmod(k, 3)
                    leaf_photo(draw, gx + 90 + c * 175, 420 + r * 210 + int((1 - a) * 20), 155, 180, healthy, k)
            plant_pal(draw, cx, 620, 0.9, t)
            K.draw_arrow(draw, 720, 560, 830, 590, muted, width=10, head=28)
            K.draw_arrow(draw, 1200, 560, 1090, 590, muted, width=10, head=28)
            K.text_at(draw, "learns", cx, 340, F(40), muted)
            return True
        if focus == "pattern":
            K.text_at(draw, "Pattern = something that repeats", cx, 226, F(50), ink)
            for k in range(3):
                a = K.stagger(progress, k, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 290 + k * 260
                leaf_photo(draw, x, 520 + int((1 - a) * 20), 220, 240, False, k, ring=coral)
            if progress > 0.45:
                K.text_at(draw, "droopy + brown, again and again", 550, 700, F(36), coral)
            a = K.ease_out_cubic(K.clamp01((progress - 0.45) * 3))
            if a > 0:
                K.draw_arrow(draw, 1000, 520, 1000 + 120 * a, 520, muted, width=12, head=34)
                plant_pal(draw, 1420, 620, 0.95, t, mood="sad")
                K.draw_bubble(draw, (1260, 300, 1760, 410), brand, "I need water!", tail="left", size=44)
                drop(draw, 1700, 560, 1.1)
            return True
        # fair
        panels = [((150, 270, 820, 840), K.DANGER, "Only roses", False), ((900, 270, 1770, 840), sage, "Many kinds", True)]
        for i, (box, col, lab, ok) in enumerate(panels):
            a = K.stagger(progress, i, step=0.25, speed=4)
            if a <= 0:
                continue
            dy = int((1 - a) * 40)
            x0, y0, x1, y1 = box
            draw.rounded_rectangle((x0 + 10, y0 + 12 + dy, x1 + 10, y1 + 12 + dy), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0 + dy, x1, y1 + dy), radius=36, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=5)
            K.text_at(draw, lab, (x0 + x1) / 2, y0 + 30 + dy, F(46), col)
            if ok:
                tiles = ["big", "small", "rose", "tulsi", "sun", "cloud"]
                for k, kind in enumerate(tiles):
                    r, c = divmod(k, 3)
                    tx = x0 + 150 + c * 285
                    ty = y0 + 230 + r * 255 + dy
                    draw.rounded_rectangle((tx - 120, ty - 105, tx + 120, ty + 105), radius=18, fill=panel,
                                           outline=line, width=3)
                    if kind == "big":
                        K.draw_plant(draw, tx, ty + 95, 0.62, 1.0, 0.0, t)
                    elif kind == "small":
                        K.draw_plant(draw, tx, ty + 95, 0.4, 0.4, 0.0, t)
                    elif kind == "rose":
                        rose_pot(draw, tx, ty + 95, 0.55, 1.0, t)
                    elif kind == "tulsi":
                        leaf_photo(draw, tx, ty, 150, 170, True, 1)
                    elif kind == "sun":
                        draw.ellipse((tx - 50, ty - 50, tx + 50, ty + 50), fill=K.GOLD)
                        for q in range(8):
                            aa = q * math.pi / 4
                            draw.line((tx + math.cos(aa) * 62, ty + math.sin(aa) * 62, tx + math.cos(aa) * 84,
                                       ty + math.sin(aa) * 84), fill=K.GOLD, width=7)
                    else:
                        for dx, dy2, rr in ((-30, 10, 44), (20, -10, 52), (54, 16, 38)):
                            draw.ellipse((tx + dx - rr, ty + dy2 - rr, tx + dx + rr, ty + dy2 + rr), fill=(176, 186, 206))
                K.draw_check(draw, x1 - 46, y0 + 46 + dy, 30, sage)
            else:
                for k in range(2):
                    for c in range(2):
                        tx = x0 + 190 + c * 290
                        ty = y0 + 230 + k * 255 + dy
                        draw.rounded_rectangle((tx - 120, ty - 105, tx + 120, ty + 105), radius=18, fill=panel,
                                               outline=line, width=3)
                        rose_pot(draw, tx, ty + 95, 0.55, 1.0, t)
                K.draw_cross(draw, x1 - 46, y0 + 46 + dy, 30, K.DANGER)
        return True

    # ---- data quick check -------------------------------------------------------------------------
    if visual == "b20-dataq":
        ans = focus == "a"
        for k in range(4):
            leaf_photo(draw, 330 + k * 40, 420 + k * 70, 260, 230, k % 2 == 0, k)
        plant_pal(draw, 760, 760, 0.45, t)
        opts = [("Passwords", K.STEEL_DARK), ("Wake words", K.STEEL_DARK), ("Examples", sage)]
        for i, (lab, col) in enumerate(opts):
            y = 290 + i * 180
            win = ans and lab == "Examples"
            dim = ans and not win
            draw.rounded_rectangle((980 + 8, y + 10, 1720 + 8, y + 140 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((980, y, 1720, y + 140), radius=40,
                                   fill=sage_soft if win else (246, 243, 238) if dim else panel,
                                   outline=sage if win else line, width=6 if win else 3)
            draw.text((1040, y + 40), lab, fill=muted if dim else ink, font=F(56))
            if win:
                K.draw_check(draw, 1650, y + 70, 34, sage)
            elif dim:
                K.draw_cross(draw, 1650, y + 70, 28, K.DANGER)
        if ans:
            K.pill(draw, 1350, 830 - 40, "= its DATA", coral, size=34)
        else:
            K.draw_stopwatch(draw, 880, 300, 46, progress, brand)
        return True

    # ---- step 3 · privacy ---------------------------------------------------------------------------
    if visual == "b20-privacy":
        if focus == "intro":
            K.pill(draw, 0, 236, "STEP 3 · PRIVACY RULE", sage, size=30, left=140)
            draw.ellipse((560 - 240, 570 - 240, 560 + 240, 570 + 240), fill=sage_soft)
            shield_lock(draw, 560, 560, 1.5, sage)
            K.text_at(draw, "A promise:", 1300, 330 + lift, F(56), muted)
            K.text_at(draw, "My helper will", 1300, 420 + lift, F(66), ink)
            K.text_at(draw, "never collect", 1300, 510 + lift, F(66), coral)
            K.text_at(draw, "or store ____", 1300, 600 + lift, F(66), coral)
            return True
        if focus == "only":
            K.text_at(draw, "Only what the job needs", cx, 226, F(54), ink)
            plant_pal(draw, cx, 620, 1.0, t)
            items = [("leaf", 360, 420, True), ("face", 360, 700, False), ("home", 1560, 420, False),
                     ("pin", 1560, 700, False)]
            for i, (kind, x, y, ok) in enumerate(items):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                draw.ellipse((x - 120, y - 110, x + 120, y + 110), fill=sage_soft if ok else (246, 240, 236))
                if kind == "leaf":
                    leaf_photo(draw, x, y, 160, 170, True, 0)
                elif kind == "face":
                    face_photo(draw, x, y, 1.1)
                elif kind == "home":
                    K.draw_house(draw, x, y + 10, 0.45, brand)
                else:
                    K.draw_map_pin(draw, x, y + 60, 1.0, K.DANGER)
                if ok:
                    K.draw_check(draw, x + 100, y - 80, 30, sage)
                    K.draw_arrow(draw, x + 140, y + 40, 800, 560, sage, width=10, head=28)
                elif progress > 0.55:
                    K.draw_cross(draw, x + 100, y - 80, 30, K.DANGER)
            labels = [("Leaf photos", 360, 545), ("Your face", 360, 825), ("Home address", 1560, 545),
                      ("Where you are", 1560, 825)]
            for i, (lab, x, y) in enumerate(labels):
                if K.stagger(progress, i, step=0.12, speed=4) > 0:
                    K.text_at(draw, lab, x, y, F(30), ink)
            return True
        if focus == "rule":
            K.shadow_card(draw, (300, 260 + lift, 1620, 830 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PLANT PAL'S PRIVACY RULE", cx, 310 + lift, F(36), sage)
            face_photo(draw, 620, 560 + lift, 1.6)
            a = K.ease_out_cubic(K.clamp01((progress - 0.2) * 3))
            if a > 0:
                r = 150
                draw.ellipse((620 - r, 560 - r + lift, 620 + r, 560 + r + lift), outline=K.DANGER, width=16)
                draw.line((620 - r * 0.7, 560 - r * 0.7 + lift, 620 + r * 0.7, 560 + r * 0.7 + lift), fill=K.DANGER,
                          width=16)
            K.text_at(draw, "It must never", 1210, 420 + lift, F(60), ink)
            K.text_at(draw, "store photos", 1210, 500 + lift, F(60), coral)
            K.text_at(draw, "of people.", 1210, 580 + lift, F(60), coral)
            shield_lock(draw, 1210, 740 + lift, 0.45, sage)
            return True
        # charge
        draw.ellipse((520 - 230, 600 - 230, 520 + 230, 600 + 230), fill=sage_soft)
        plant_pal(draw, 520, 640, 1.0, t)
        K.draw_bubble(draw, (300, 260, 740, 370), brand, "Water me!", tail="left", size=46)
        K.draw_arrow(draw, 820, 560, 960, 560, muted, width=12, head=34)
        draw.ellipse((1340 - 250, 540 - 250, 1340 + 250, 540 + 250), fill=LAV_SOFT)
        K.draw_person(draw, 1280, 480, 1.15, "nani", t)
        K.draw_can(draw, 1440, 640, 0.6, t, pouring=progress > 0.4)
        draw.polygon([(1240, 330), (1240, 300), (1260, 315), (1280, 290), (1300, 315), (1320, 300), (1320, 330)],
                     fill=K.GOLD)
        K.pill(draw, 1340, 800, "Nani decides how much", K.BOTH_COLOR, size=34)
        return True

    # ---- spelling helper sort -----------------------------------------------------------------------
    if visual == "b20-needs":
        ans = focus == "a"
        box = phone(draw, 330, 560, 1.15)
        x0, y0, x1, y1 = box
        draw.rectangle(box, fill=(255, 255, 255))
        draw.rectangle((x0, y0, x1, y0 + 56), fill=K.BOTH_COLOR)
        K.text_at(draw, "Spell Helper", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
        draw.rounded_rectangle((x0 + 16, y0 + 90, x1 - 16, y0 + 160), radius=16, fill=(246, 243, 238),
                               outline=K.BOTH_COLOR, width=3)
        K.text_at(draw, "tree", (x0 + x1) / 2, y0 + 102, F(40), ink)
        K.draw_star(draw, (x0 + x1) / 2, y0 + 250, 50 + 6 * pulse, K.GOLD, rot=t)
        cards = [("words", "Spelling word list", True), ("home", "Home address", False),
                 ("oops", "Common mistakes", True), ("score", "Right or wrong words", True)]
        for i, (kind, lab, need) in enumerate(cards):
            r, c = divmod(i, 2)
            cx0 = 640 + c * 580
            cy0 = 270 + r * 300
            bad = ans and not need
            good = ans and need
            draw.rounded_rectangle((cx0 + 8, cy0 + 10, cx0 + 540 + 8, cy0 + 260 + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((cx0, cy0, cx0 + 540, cy0 + 260), radius=30,
                                   fill=K.DANGER_SOFT if bad else sage_soft if good else panel,
                                   outline=K.DANGER if bad else sage if good else line, width=6 if ans else 3)
            mx = cx0 + 270
            if kind == "words":
                draw.rounded_rectangle((mx - 90, cy0 + 26, mx + 90, cy0 + 166), radius=12, fill=PAPER, outline=K.DEV_MID,
                                       width=3)
                for k, wd in enumerate(("cat", "tree", "sun")):
                    draw.text((mx - 70, cy0 + 32 + k * 42), wd, fill=[coral, sage, K.BOT][k], font=F(32))
            elif kind == "home":
                K.draw_house(draw, mx, cy0 + 110, 0.42, brand)
            elif kind == "oops":
                draw.text((mx - 110, cy0 + 50), "tre", fill=K.DANGER, font=F(52))
                K.draw_arrow(draw, mx - 10, cy0 + 84, mx + 30, cy0 + 84, muted, width=6, head=16)
                draw.text((mx + 40, cy0 + 50), "tree", fill=sage, font=F(52))
            else:
                K.draw_check(draw, mx - 50, cy0 + 96, 34, sage)
                K.draw_cross(draw, mx + 50, cy0 + 96, 34, K.DANGER)
            K.text_at(draw, lab, mx, cy0 + 190, F(36), ink)
            if bad:
                K.draw_cross(draw, cx0 + 500, cy0 + 40, 28, K.DANGER)
                K.pill(draw, 0, cy0 + 20, "Not needed!", K.DANGER, size=26, left=cx0 + 20)
            elif good:
                K.draw_check(draw, cx0 + 500, cy0 + 40, 26, sage)
        if not ans:
            K.text_at(draw, "Which is NOT needed?", 330, 236, F(40), coral)
        else:
            K.pill(draw, 330, 236, "Just in case? Nope!", coral, size=32)
        return True

    # ---- step 4 · pitch -----------------------------------------------------------------------------
    if visual == "b20-pitch":
        if focus == "intro":
            stage(draw, cx)
            K.draw_person(draw, cx, 470, 1.2, "kid", t)
            draw.rounded_rectangle((cx + 90, 560, cx + 250, 740), radius=12, fill=PAPER, outline=K.DEV_MID, width=3)
            plant_pal(draw, cx + 170, 660, 0.3, t)
            K.draw_stopwatch(draw, 1420, 480, 70, progress * 0.5, brand)
            K.pill(draw, 1420, 590, "About 1 minute", coral, size=36)
            K.pill(draw, 520, 480, "STEP 4", K.BOTH_COLOR, size=44)
            K.text_at(draw, "Short & clear", 520, 560, F(40), ink)
            return True
        if focus == "example":
            box = phone(draw, 380, 545, 1.25)
            x0, y0, x1, y1 = box
            draw.rectangle(box, fill=GOLD_SOFT)
            draw.rectangle((x0, y0, x1, y0 + 56), fill=coral)
            K.text_at(draw, "Tiffin Buddy", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
            K.draw_tiffin(draw, (x0 + x1) / 2, y0 + 210, 0.8)
            apple(draw, x0 + 60, y1 - 70, 0.9)
            banana(draw, x1 - 60, y1 - 60, 0.8)
            parts = [("Name", "Meet Tiffin Buddy!", coral), ("User + job", "Helps Class 4 kids pick healthy snacks", K.BOT),
                     ("Data", "Learns from snack pictures", sage), ("Privacy", "Never stores anyone's face", K.BOTH_COLOR)]
            for i, (tag, txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 260 + i * 150 + int((1 - a) * 20)
                draw.rounded_rectangle((680 + 8, y + 10, 1760 + 8, y + 126 + 10), radius=30, fill=K.SHADOW)
                draw.rounded_rectangle((680, y, 1760, y + 126), radius=30, fill=panel, outline=col, width=4)
                K.pill(draw, 0, y + 10, tag, col, size=26, left=706)
                draw.text((710, y + 62), txt, fill=ink, font=F(40))
            return True
        # tips
        tips = [("slow", "Speak slowly", K.BOT), ("draw", "Show a drawing", sage), ("smile", "Smile!", coral)]
        boxes = row_boxes(3, 480, 70, 290, 830)
        for i, ((kind, lab, col), box) in enumerate(zip(tips, boxes)):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            dy = int((1 - a) * 40)
            x0, y0, x1, y1 = box
            K.shadow_card(draw, (x0, y0 + dy, x1, y1 + dy), brand, radius=30, outline=col, outline_w=5)
            mx, my = (x0 + x1) / 2, y0 + 220 + dy
            if kind == "slow":
                K.draw_snail(draw, mx, my + 20, 1.6, brand)
            elif kind == "draw":
                draw.rounded_rectangle((mx - 140, my - 130, mx + 140, my + 110), radius=12, fill=PAPER,
                                       outline=K.DEV_MID, width=3)
                plant_pal(draw, mx, my, 0.55, t)
            else:
                K.draw_person(draw, mx, my - 40, 1.05, "kid", t)
                K.draw_heart(draw, mx + 120, my - 120 + bounce, 24, K.DANGER)
            K.text_at(draw, lab, mx, y1 - 100 + dy, F(46), col)
        return True

    # ---- clearest and safest plan --------------------------------------------------------------------
    if visual == "b20-clear":
        ans = focus == "answer"
        opts = [("A", "\u201cA helper.\u201d"),
                ("B", "\u201cIt does everything for everyone and saves all data.\u201d"),
                ("C", "\u201cTiffin Buddy helps Class 4 kids pick healthy snacks. It learns from snack pictures. "
                      "It never stores faces.\u201d"),
                ("D", "\u201cA helper that knows where all my friends live.\u201d")]
        y0s = [240, 370, 500, 720]
        for i, (letter, txt) in enumerate(opts):
            y = y0s[i]
            hgt = 200 if letter == "C" else 110
            ok = letter == "C"
            win, dim = ans and ok, ans and not ok
            x0, x1 = 140, 1360
            draw.rounded_rectangle((x0 + 8, y + 10, x1 + 8, y + hgt + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y, x1, y + hgt), radius=30,
                                   fill=sage_soft if win else (246, 243, 238) if dim else panel,
                                   outline=sage if win else line, width=5 if win else 3)
            mid = y + hgt / 2
            draw.ellipse((x0 + 24, mid - 34, x0 + 92, mid + 34), fill=sage if win else K.BOTH_COLOR if not dim else muted)
            K.text_at(draw, letter, x0 + 58, mid - 26, F(40), (255, 255, 255))
            font = F(32)
            lines = K.wrap_text(txt, font, x1 - x0 - 120 - 90)
            ty = mid - len(lines) * 20
            for j, ln in enumerate(lines):
                draw.text((x0 + 120, ty + j * 40), ln, fill=muted if dim else ink, font=font)
            if dim:
                K.draw_cross(draw, x1 - 46, mid, 24, K.DANGER)
            if win:
                K.draw_check(draw, x1 - 46, mid, 28, sage)
        if ans:
            for i, lab in enumerate(("User", "Job", "Data", "Privacy rule")):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 260 + i * 140 + int((1 - a) * 20)
                draw.rounded_rectangle((1420, y, 1790, y + 110), radius=36, fill=panel, outline=sage, width=5)
                K.draw_check(draw, 1476, y + 55, 28, sage)
                draw.text((1522, y + 32), lab, fill=ink, font=F(40))
        else:
            K.text_at(draw, "Clearest", 1600, 300, F(50), ink)
            K.text_at(draw, "& safest?", 1600, 362, F(54), coral)
            K.draw_magnifier(draw, 1580, 590, 0.9, K.BOTH_COLOR)
            K.draw_stopwatch(draw, 1720, 790, 40, progress, brand)
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "b20-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "CAPSTONE CHALLENGE", cx, 350 + lift, F(40), sage)
            K.text_at(draw, "Imagine your AI helper!", cx, 420 + lift, F(62), ink)
            bulb(draw, cx - 140, 650 + lift, 0.55, t)
            plant_pal(draw, cx + 140, 640 + lift, 0.7, t)
            return True
        ans = focus == "answer"
        rows = [("Helper name:", "Plant Pal"), ("Who it helps:", "my family"), ("Learns from:", "leaf photos"),
                ("Never stores:", "photos of people")]
        n = min(4, int(progress * 5.2)) if ans else 0
        plan_sheet(rows, n, title="My AI Helper", box=(130, 250, 1060, 860))
        if ans:
            draw.ellipse((1420 - 260, 560 - 260, 1420 + 260, 560 + 260), fill=sage_soft)
            plant_pal(draw, 1360, 600, 1.1, t)
            K.draw_plant(draw, 1600, 800, 0.8, 1.0, 0.0, t)
            sparkle([(1220, 320), (1720, 330)])
        else:
            pencil(draw, 1420, 420, 1.2)
            K.pill(draw, 1420, 600, "Pause & try!", coral, size=40)
            K.text_at(draw, "Write it on paper", 1420, 700, F(38), ink)
            K.draw_stopwatch(draw, 1720, 790, 44, progress, brand)
        return True

    # ---- recap & celebration ---------------------------------------------------------------
    if visual == "b20-recap":
        recap = [("User + job + privacy rule", coral, "who"), ("Learns patterns from data", K.BOT, "pattern"),
                 ("Only what the job needs", sage, "only"), ("Present in 1 minute", K.BOTH_COLOR, "pitch")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                if kind == "who":
                    step_icon("who", x0 + 200, y0 + 150, 1.05)
                    shield_lock(draw, x0 + 200, y0 + 290, 0.35, sage)
                else:
                    step_icon(kind, x0 + 200, y0 + 210, 1.05)
                font = F(36)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 400 + j * 44, font, ink)
            return True
        if focus == "journey":
            K.text_at(draw, "Your AI journey", cx, 226, F(54), ink)
            units = [("what", "What Is AI?", ""), ("learn", "How Machines", "Learn"), ("sense", "Sees, Hears", "& Talks"),
                     ("safe", "Smart & Safe", "With AI")]
            xs = [330, 750, 1170, 1590]
            K.draw_dashed(draw, xs[0], 470, xs[-1], 470, line, width=10, phase=t * 100)
            for i, ((kind, l1, l2), x) in enumerate(zip(units, xs)):
                a = K.stagger(progress, i, step=0.17, speed=4)
                if a <= 0:
                    continue
                col = [coral, K.BOT, K.BOTH_COLOR, sage][i]
                r = 120 * (0.8 + 0.2 * a)
                draw.ellipse((x - r + 8, 470 - r + 10, x + r + 8, 470 + r + 10), fill=K.SHADOW)
                draw.ellipse((x - r, 470 - r, x + r, 470 + r), fill=panel, outline=col, width=8)
                if kind == "what":
                    K.draw_robot(draw, x, 520, 0.3, t, mood="happy")
                elif kind == "learn":
                    for k in range(3):
                        leaf_photo(draw, x - 40 + k * 40, 440 + k * 24, 80, 80, k != 1, k)
                elif kind == "sense":
                    draw.ellipse((x - 70, 420, x - 10, 470), fill=(255, 255, 255), outline=K.DEV_DARK, width=5)
                    draw.ellipse((x - 52, 430, x - 28, 460), fill=K.DEV_DARK)
                    K.sound_waves(draw, x + 10, 445, 0.5, K.BOTH_COLOR, t)
                    draw.rounded_rectangle((x - 60, 490, x + 60, 540), radius=20, fill=K.BOTH_COLOR)
                    draw.polygon([(x - 40, 538), (x - 20, 538), (x - 46, 562)], fill=K.BOTH_COLOR)
                else:
                    K.draw_shield(draw, x, 470, 0.6, sage)
                K.text_at(draw, l1, x, 620, F(34), ink)
                if l2:
                    K.text_at(draw, l2, x, 662, F(34), ink)
                K.draw_check(draw, x + 90, 470 - 92, 30, sage)
            if progress > 0.75:
                K.pill(draw, cx, 760, "All 4 AI units done!", coral, size=40)
            return True
        if focus == "done":
            confetti(y0=230, y1=600)
            K.draw_mascot(draw, int(cx - 500), 470, 110, sage, panel, bounce)
            plant_pal(draw, cx + 500, 500, 1.0, t)
            trophy(draw, cx, 500, 2.0, "AI")
            K.text_at(draw, "AI track complete!", cx, 680, F(64), ink)
            K.pill(draw, cx, 778, "You're an AI champ!", coral, size=38)
            return True
        K.draw_mascot(draw, int(cx - 600), 540, 100, sage, panel, bounce)
        plant_pal(draw, cx + 600, 560, 0.9, t)
        K.text_at(draw, "Final quiz time!", cx, 380, F(64), coral)
        K.text_at(draw, "Tap Finish, then imagine", cx, 480, F(44), ink)
        K.text_at(draw, "your own AI helper!", cx, 540, F(44), ink)
        K.draw_arrow(draw, cx - 120, 680, cx + 120 + 20 * pulse, 680, sage, width=16, head=46)
        return True

    return False
