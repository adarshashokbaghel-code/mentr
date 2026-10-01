"""B18 · Real or AI-Made? — visuals."""
import math

import build as K

TIGER = (240, 140, 40)
TIGER_WHITE = (255, 248, 236)
STRIPE = (40, 34, 30)
WALL = (240, 228, 204)
BOARD = (44, 92, 72)
DESK = (190, 140, 90)
DESK_DARK = (150, 104, 62)
SKY = (214, 236, 250)
ROAD_GREY = (170, 170, 176)
CLOUD = (255, 255, 255)
BUS = (255, 196, 40)
BUS_DARK = (214, 150, 20)
PARTY = (240, 232, 252)
CAKE = (250, 214, 226)
CAKE_DARK = (214, 120, 150)
PLASTIC = (252, 216, 200)
SCREEN = (250, 250, 252)
APP = (123, 97, 214)
NIGHT = (36, 44, 66)
FIELD_DARK = (40, 86, 60)


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


def phone(draw, cx, cy, s, screen=SCREEN):
    S = S_(s)
    box = (cx - S(110), cy - S(200), cx + S(110), cy + S(200))
    draw.rounded_rectangle((box[0] + S(8), box[1] + S(10), box[2] + S(8), box[3] + S(10)), radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=S(34), fill=K.DEV_DARK)
    sb = (box[0] + S(14), box[1] + S(34), box[2] - S(14), box[3] - S(30))
    draw.rounded_rectangle(sb, radius=S(16), fill=screen)
    draw.rounded_rectangle((cx - S(30), box[1] + S(14), cx + S(30), box[1] + S(22)), radius=S(4), fill=K.DEV_MID)
    return sb


def app_bar(draw, sb, title, col=APP, size=32, icon=True):
    x0, y0, x1, _ = sb
    draw.rounded_rectangle((x0, y0, x1, y0 + 80), radius=16, fill=col)
    draw.rectangle((x0, y0 + 40, x1, y0 + 80), fill=col)
    tx = x0 + 24
    if icon:
        draw.ellipse((x0 + 18, y0 + 16, x0 + 66, y0 + 64), fill=(255, 255, 255))
        K.draw_face(draw, x0 + 42, y0 + 42, 16, "kid", 0.5)
        tx = x0 + 80
    draw.text((tx, y0 + 40 - size * 0.62), title, fill=(255, 255, 255), font=K.load_font(size, bold=True))


def photo_frame(draw, box, cap_h=70):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=14, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=14, fill=(255, 255, 255), outline=K.STEEL, width=3)
    return (x0 + 20, y0 + 20, x1 - 20, y1 - cap_h)


def camera(draw, cx, cy, s, col=K.DEV_DARK):
    S = S_(s)
    draw.rounded_rectangle((cx - S(40), cy - S(86), cx + S(20), cy - S(56)), radius=S(8), fill=col)
    draw.rounded_rectangle((cx - S(110) + S(8), cy - S(66) + S(10), cx + S(110) + S(8), cy + S(80) + S(10)),
                           radius=S(24), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(66), cx + S(110), cy + S(80)), radius=S(24), fill=col)
    draw.ellipse((cx - S(56), cy - S(48), cx + S(56), cy + S(64)), fill=K.STEEL)
    draw.ellipse((cx - S(36), cy - S(28), cx + S(36), cy + S(44)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(20), cy - S(16), cx - S(4), cy), fill=(255, 255, 255))
    draw.ellipse((cx + S(70), cy - S(50), cx + S(94), cy - S(26)), fill=K.GOLD)


def tiger(draw, cx, cy, s, glasses=True, book=True):
    """Tiger reading. cy = head centre; head ≈ ±120s wide, body to cy+210s."""
    S = S_(s)
    lw = max(2, int(S(8)))
    draw.chord((cx - S(150), cy + S(60), cx + S(150), cy + S(360)), 180, 360, fill=TIGER)
    for k in range(3):
        y = cy + S(110) + k * S(32)
        draw.line((cx - S(130) + k * S(12), y, cx - S(96) + k * S(12), y + S(10)), fill=STRIPE, width=lw)
        draw.line((cx + S(130) - k * S(12), y, cx + S(96) - k * S(12), y + S(10)), fill=STRIPE, width=lw)
    for sx in (-1, 1):
        ex = cx + sx * S(92)
        draw.ellipse((ex - S(36), cy - S(122), ex + S(36), cy - S(50)), fill=TIGER)
        draw.ellipse((ex - S(18), cy - S(104), ex + S(18), cy - S(68)), fill=(250, 200, 170))
    draw.ellipse((cx - S(120), cy - S(100), cx + S(120), cy + S(110)), fill=TIGER)
    for dx in (-34, 0, 34):
        draw.polygon([(cx + S(dx) - S(9), cy - S(96)), (cx + S(dx) + S(9), cy - S(96)), (cx + S(dx), cy - S(52))],
                     fill=STRIPE)
    for sx in (-1, 1):
        for k in range(2):
            draw.line((cx + sx * S(118), cy + S(6) + k * S(30), cx + sx * S(78), cy + S(16) + k * S(30)), fill=STRIPE,
                      width=lw)
    draw.ellipse((cx - S(68), cy + S(18), cx + S(68), cy + S(104)), fill=TIGER_WHITE)
    draw.polygon([(cx - S(20), cy + S(26)), (cx + S(20), cy + S(26)), (cx, cy + S(48))], fill=(200, 90, 90))
    draw.arc((cx - S(30), cy + S(34), cx, cy + S(70)), 0, 180, fill=STRIPE, width=max(2, int(S(5))))
    draw.arc((cx, cy + S(34), cx + S(30), cy + S(70)), 0, 180, fill=STRIPE, width=max(2, int(S(5))))
    for sx in (-1, 1):
        ex = cx + sx * S(46)
        draw.ellipse((ex - S(14), cy - S(32), ex + S(14), cy - S(4)), fill=STRIPE)
        draw.ellipse((ex - S(6), cy - S(28), ex + S(2), cy - S(20)), fill=(255, 255, 255))
        if glasses:
            draw.ellipse((ex - S(36), cy - S(54), ex + S(36), cy + S(18)), outline=STRIPE, width=lw)
    if glasses:
        draw.line((cx - S(10), cy - S(22), cx + S(10), cy - S(22)), fill=STRIPE, width=lw)
    if book:
        by = cy + S(150)
        draw.polygon([(cx, by + S(14)), (cx - S(130), by - S(10)), (cx - S(130), by + S(70)), (cx, by + S(90))],
                     fill=(255, 255, 255), outline=K.DEV_DARK)
        draw.polygon([(cx, by + S(14)), (cx + S(130), by - S(10)), (cx + S(130), by + S(70)), (cx, by + S(90))],
                     fill=(255, 255, 255), outline=K.DEV_DARK)
        for k in range(3):
            yy = by + S(18) + k * S(16)
            draw.line((cx - S(110), yy, cx - S(20), yy + S(12)), fill=K.STEEL, width=max(1, int(S(4))))
            draw.line((cx + S(20), yy + S(12), cx + S(110), yy), fill=K.STEEL, width=max(1, int(S(4))))
        draw.line((cx, by + S(14), cx, by + S(90)), fill=K.CORAL, width=max(2, int(S(6))))


def tiger_photo(draw, box, label="From: Cousin Riya"):
    px0, py0, px1, py1 = photo_frame(draw, box)
    W, H = px1 - px0, py1 - py0
    draw.rectangle((px0, py0, px1, py1), fill=WALL)
    bb = (px0 + W * 0.06, py0 + H * 0.08, px0 + W * 0.36, py0 + H * 0.5)
    draw.rectangle(bb, fill=BOARD, outline=DESK_DARK, width=6)
    f = K.load_font(max(14, int(H * 0.09)), bold=True)
    draw.text((bb[0] + W * 0.03, bb[1] + H * 0.06), "A B C", fill=(240, 240, 230), font=f)
    draw.text((bb[0] + W * 0.03, bb[1] + H * 0.22), "1 2 3", fill=(240, 240, 230), font=f)
    draw.rectangle((px1 - W * 0.22, py0 + H * 0.1, px1 - W * 0.06, py0 + H * 0.4), fill=SKY, outline=DESK_DARK,
                   width=5)
    s = H / 560
    tcx = px0 + W * 0.58
    tiger(draw, tcx, py0 + H * 0.42, s)
    dy = py1 - H * 0.14
    draw.rectangle((px0, dy, px1, py1), fill=DESK)
    draw.rectangle((px0, dy, px1, dy + H * 0.025), fill=DESK_DARK)
    cap = (box[0] + box[2]) / 2
    K.text_at(draw, label, cap, box[3] - 56, K.load_font(30, bold=True), K.DEV_DARK)


def hand(draw, cx, cy, s, fingers=4, col=K.SKIN, melt=False, outline=(196, 140, 110)):
    """Open hand. cy = palm centre. fingers = count above the palm (thumb drawn separately)."""
    S = S_(s)
    ow = max(2, int(S(4)))
    draw.polygon([(cx - S(62), cy + S(20)), (cx - S(132), cy - S(50)), (cx - S(108), cy - S(78)),
                  (cx - S(44), cy - S(16))], fill=col, outline=outline)
    span = S(150)
    fw = span / fingers * 0.84
    tips = []
    for i in range(fingers):
        fx = cx - span / 2 + span * (i + 0.5) / fingers
        fh = S(104) - abs(i - (fingers - 1) / 2) * S(12)
        draw.rounded_rectangle((fx - fw / 2, cy - S(40) - fh, fx + fw / 2, cy), radius=fw / 2, fill=col,
                               outline=outline, width=ow)
        tips.append((fx, cy - S(40) - fh))
    if melt:
        fx = cx - span / 2 + span * 2.0 / fingers
        draw.ellipse((fx - fw * 1.1, cy - S(120), fx + fw * 1.1, cy - S(30)), fill=col)
    draw.rounded_rectangle((cx - S(78), cy - S(50), cx + S(78), cy + S(84)), radius=S(40), fill=col, outline=outline,
                           width=ow)
    tips.append((cx - S(126), cy - S(72)))
    return tips


def perfect_face(draw, cx, cy, r, t=0.0):
    draw.rounded_rectangle((cx - r * 1.12, cy - r * 1.2, cx + r * 1.12, cy + r * 1.1), radius=r * 0.9,
                           fill=(92, 60, 40))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=PLASTIC)
    draw.chord((cx - r * 1.04, cy - r * 1.14, cx + r * 1.04, cy - r * 0.1), 180, 360, fill=(92, 60, 40))
    draw.ellipse((cx - r * 0.6, cy - r * 0.62, cx - r * 0.1, cy - r * 0.42), fill=(255, 250, 248))
    draw.ellipse((cx + r * 0.36, cy + r * 0.12, cx + r * 0.7, cy + r * 0.32), fill=(255, 246, 244))
    for sx in (-1, 1):
        ex = cx + sx * r * 0.38
        draw.ellipse((ex - r * 0.15, cy - r * 0.2, ex + r * 0.15, cy + r * 0.1), fill=(40, 44, 56))
        draw.ellipse((ex - r * 0.07, cy - r * 0.15, ex + r * 0.01, cy - r * 0.07), fill=(255, 255, 255))
    draw.arc((cx - r * 0.42, cy + r * 0.12, cx + r * 0.42, cy + r * 0.66), 20, 160, fill=(214, 84, 96),
             width=max(2, int(r * 0.1)))


def real_face(draw, cx, cy, r):
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    for dx, dy in ((-0.5, 0.25), (-0.36, 0.34), (-0.56, 0.4), (0.5, 0.26), (0.38, 0.36), (0.58, 0.4)):
        rr = max(2, r * 0.045)
        draw.ellipse((cx + dx * r - rr, cy + dy * r - rr, cx + dx * r + rr, cy + dy * r + rr), fill=(196, 130, 100))
    for k in range(5):
        a = math.pi * (1.15 + 0.17 * k)
        x0, y0 = cx + math.cos(a) * r * 0.95, cy + math.sin(a) * r * 1.0
        draw.line((x0, y0, x0 + math.cos(a + 0.6) * r * 0.32, y0 + math.sin(a + 0.6) * r * 0.32), fill=(40, 34, 30),
                  width=max(2, int(r * 0.08)))


def cake(draw, cx, by, s):
    S = S_(s)
    draw.ellipse((cx - S(130), by - S(20), cx + S(130), by + S(20)), fill=(255, 255, 255), outline=K.STEEL, width=3)
    draw.rounded_rectangle((cx - S(100), by - S(120), cx + S(100), by - S(6)), radius=S(16), fill=CAKE)
    draw.rectangle((cx - S(100), by - S(70), cx + S(100), by - S(52)), fill=CAKE_DARK)
    draw.chord((cx - S(100), by - S(140), cx + S(100), by - S(100)), 0, 360, fill=(255, 250, 250))
    for k in range(3):
        x = cx - S(50) + k * S(50)
        draw.rectangle((x - S(7), by - S(186), x + S(7), by - S(126)), fill=[K.ROAD, K.LEAF, K.CORAL][k])
        draw.ellipse((x - S(9), by - S(214), x + S(9), by - S(186)), fill=K.GOLD)


def balloon(draw, cx, cy, s, col):
    S = S_(s)
    draw.line((cx, cy + S(56), cx + S(10), cy + S(170)), fill=K.STEEL_DARK, width=max(1, int(S(3))))
    draw.ellipse((cx - S(42), cy - S(56), cx + S(42), cy + S(56)), fill=col)
    draw.ellipse((cx - S(24), cy - S(36), cx - S(10), cy - S(14)), fill=(255, 255, 255))


def party_photo(draw, box):
    """Returns hotspots (banner, hand, face) as (x, y, r)."""
    px0, py0, px1, py1 = photo_frame(draw, box, cap_h=20)
    W, H = px1 - px0, py1 - py0
    draw.rectangle((px0, py0, px1, py1), fill=PARTY)
    s = H / 600
    draw.line((px0, py0 + H * 0.06, px1, py0 + H * 0.06), fill=K.STEEL_DARK, width=3)
    for k in range(14):
        x = px0 + W * (k + 0.5) / 14
        draw.polygon([(x - W * 0.025, py0 + H * 0.06), (x + W * 0.025, py0 + H * 0.06), (x, py0 + H * 0.13)],
                     fill=[K.CORAL, K.GOLD, K.ROAD, K.LEAF][k % 4])
    ban = (px0 + W * 0.18, py0 + H * 0.16, px0 + W * 0.82, py0 + H * 0.31)
    draw.rounded_rectangle(ban, radius=12, fill=K.CORAL)
    K.text_at(draw, "HAPY BRITHDYA", (ban[0] + ban[2]) / 2, ban[1] + H * 0.025,
              K.load_font(int(H * 0.085), bold=True), (255, 255, 255))
    balloon(draw, px0 + W * 0.08, py0 + H * 0.36, s, K.ROAD)
    balloon(draw, px0 + W * 0.16, py0 + H * 0.46, s, K.GOLD)
    fx, fy = px0 + W * 0.72, py0 + H * 0.52
    fr = 64 * s * 1.15
    draw.chord((fx - fr * 1.5, fy + fr * 0.7, fx + fr * 1.5, fy + fr * 3.6), 180, 360, fill=K.BOTH_COLOR)
    perfect_face(draw, fx, fy, fr)
    ty = py1 - H * 0.12
    draw.rectangle((px0, ty, px1, py1), fill=DESK)
    cake(draw, px0 + W * 0.44, ty + 4, s * 1.05)
    hx, hy = px0 + W * 0.2, ty - H * 0.1
    hand(draw, hx, hy, s * 0.9, fingers=5)
    return [((ban[0] + ban[2]) / 2, (ban[1] + ban[3]) / 2, W * 0.34),
            (hx, hy - 50 * s, 110 * s),
            (fx, fy, fr * 1.35)]


def scooter(draw, cx, by, s, col=K.DANGER):
    S = S_(s)
    for wx in (cx - S(110), cx + S(110)):
        draw.ellipse((wx - S(40), by - S(80), wx + S(40), by), fill=K.DEV_DARK)
        draw.ellipse((wx - S(16), by - S(56), wx + S(16), by - S(24)), fill=K.STEEL)
    draw.polygon([(cx - S(150), by - S(70)), (cx - S(60), by - S(150)), (cx + S(40), by - S(150)),
                  (cx + S(60), by - S(70))], fill=col)
    draw.rounded_rectangle((cx - S(150), by - S(176), cx - S(30), by - S(146)), radius=S(14), fill=K.DEV_DARK)
    draw.polygon([(cx + S(60), by - S(70)), (cx + S(110), by - S(70)), (cx + S(140), by - S(240)),
                  (cx + S(110), by - S(240))], fill=col)
    draw.line((cx + S(96), by - S(250), cx + S(170), by - S(250)), fill=K.DEV_DARK, width=max(2, int(S(12))))
    draw.ellipse((cx + S(136), by - S(226), cx + S(166), by - S(196)), fill=K.GOLD)


def cow(draw, cx, by, s):
    """Cow lying down. by = ground line."""
    S = S_(s)
    body = (255, 255, 255)
    draw.ellipse((cx - S(150), by - S(140), cx + S(130), by), fill=body, outline=K.STEEL_DARK, width=max(2, int(S(4))))
    for dx, dy, r in ((-60, -90, 30), (30, -60, 26), (80, -110, 20)):
        draw.ellipse((cx + S(dx) - S(r), by + S(dy) - S(r), cx + S(dx) + S(r), by + S(dy) + S(r)), fill=K.DEV_DARK)
    for lx in (-110, 60):
        draw.rounded_rectangle((cx + S(lx), by - S(26), cx + S(lx) + S(70), by), radius=S(12), fill=body,
                               outline=K.STEEL_DARK, width=max(1, int(S(3))))
    hx, hy = cx + S(150), by - S(130)
    draw.line((hx - S(40), hy - S(40), hx - S(66), hy - S(80)), fill=(200, 180, 140), width=max(2, int(S(12))))
    draw.line((hx + S(40), hy - S(40), hx + S(66), hy - S(80)), fill=(200, 180, 140), width=max(2, int(S(12))))
    draw.ellipse((hx - S(60), hy - S(54), hx + S(60), hy + S(70)), fill=body, outline=K.STEEL_DARK,
                 width=max(2, int(S(4))))
    draw.ellipse((hx - S(44), hy + S(20), hx + S(44), hy + S(80)), fill=(244, 196, 200))
    for sx in (-1, 1):
        draw.ellipse((hx + sx * S(26) - S(8), hy - S(8), hx + sx * S(26) + S(8), hy + S(8)), fill=K.DEV_DEEP)
        draw.ellipse((hx + sx * S(16) - S(5), hy + S(44), hx + sx * S(16) + S(5), hy + S(54)), fill=(160, 90, 100))


def cow_photo(draw, box):
    px0, py0, px1, py1 = photo_frame(draw, box)
    W, H = px1 - px0, py1 - py0
    draw.rectangle((px0, py0, px1, py1), fill=SKY)
    for k in range(4):
        x = px0 + W * (0.05 + k * 0.25)
        draw.rectangle((x, py0 + H * 0.2, x + W * 0.18, py0 + H * 0.6), fill=[(246, 214, 180), (220, 232, 210),
                                                                            (250, 226, 200), (226, 220, 240)][k])
        for j in range(2):
            draw.rectangle((x + W * 0.03 + j * W * 0.07, py0 + H * 0.28, x + W * 0.08 + j * W * 0.07,
                            py0 + H * 0.38), fill=K.DEV_SCREEN)
    gy = py0 + H * 0.6
    draw.rectangle((px0, gy, px1, py1), fill=ROAD_GREY)
    for k in range(5):
        x = px0 + W * (0.05 + k * 0.2)
        draw.rectangle((x, py1 - H * 0.12, x + W * 0.1, py1 - H * 0.09), fill=(255, 255, 255))
    s = H / 520
    scooter(draw, px0 + W * 0.28, py1 - H * 0.18, s)
    cow(draw, px0 + W * 0.66, py1 - H * 0.16, s * 1.1)


def blurry_photo(draw, box, t=0.0, cap_h=70):
    px0, py0, px1, py1 = photo_frame(draw, box, cap_h=cap_h)
    W, H = px1 - px0, py1 - py0
    draw.rectangle((px0, py0, px1, py1), fill=NIGHT)
    draw.rectangle((px0, py0 + H * 0.55, px1, py1), fill=FIELD_DARK)
    for lx in (0.15, 0.5, 0.85):
        x, y = px0 + W * lx, py0 + H * 0.14
        for k, (r, c) in enumerate(((0.12, (70, 72, 80)), (0.09, (120, 116, 96)), (0.06, (190, 180, 120)),
                                    (0.035, (250, 240, 190)))):
            rr = W * r * 0.6
            draw.ellipse((x - rr, y - rr, x + rr, y + rr), fill=c)
    draw.rectangle((px0, py0 + H * 0.36, px1, py0 + H * 0.55), fill=(56, 60, 80))
    for k in range(30):
        x = px0 + W * ((k * 0.137) % 1)
        y = py0 + H * (0.38 + 0.15 * ((k * 0.31) % 1))
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=[(90, 80, 90), (110, 96, 80), (80, 90, 110)][k % 3])
    s = H / 500
    for (fx, col) in ((0.36, (180, 186, 196)), (0.66, (170, 176, 190))):
        x, y = px0 + W * fx, py0 + H * 0.7
        for k, off in enumerate((-14, 14, 0)):
            c = tuple(int(v * (0.7 + 0.15 * k)) for v in col)
            draw.ellipse((x + off * s - 26 * s, y - 90 * s, x + off * s + 26 * s, y - 38 * s), fill=c)
            draw.rounded_rectangle((x + off * s - 36 * s, y - 40 * s, x + off * s + 36 * s, y + 70 * s),
                                   radius=24 * s, fill=c)
    bx = px0 + W * 0.42
    for k, off in enumerate((-10, 10, 0)):
        draw.line((bx + off * s, py0 + H * 0.62, bx + 60 * s + off * s, py0 + H * 0.5), fill=(150, 130, 100),
                  width=int(12 * s))


def flying_bus(draw, cx, cy, s, t=0.0):
    S = S_(s)
    flap = math.sin(t * math.pi * 6) * S(30)
    for sx in (-1, 1):
        wx = cx + sx * S(40)
        draw.polygon([(wx, cy - S(70)), (wx + sx * S(160), cy - S(170) - flap), (wx + sx * S(210), cy - S(120) - flap),
                      (wx + sx * S(60), cy - S(40))], fill=CLOUD, outline=K.STEEL_DARK)
    draw.rounded_rectangle((cx - S(210) + S(8), cy - S(80) + S(10), cx + S(210) + S(8), cy + S(70) + S(10)),
                           radius=S(26), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(210), cy - S(80), cx + S(210), cy + S(70)), radius=S(26), fill=BUS,
                           outline=BUS_DARK, width=max(2, int(S(5))))
    for k in range(5):
        wx = cx - S(186) + k * S(72)
        draw.rounded_rectangle((wx, cy - S(62), wx + S(56), cy - S(16)), radius=S(8), fill=K.DEV_SCREEN,
                               outline=BUS_DARK, width=max(1, int(S(3))))
    draw.rectangle((cx - S(210), cy - S(4), cx + S(210), cy + S(10)), fill=K.DEV_DARK)
    K.text_at(draw, "SCHOOL BUS", cx, cy + S(14), K.load_font(max(10, int(S(36))), bold=True), K.DEV_DARK)
    for wx in (cx - S(130), cx + S(130)):
        draw.ellipse((wx - S(34), cy + S(46), wx + S(34), cy + S(114)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(14), cy + S(66), wx + S(14), cy + S(94)), fill=K.STEEL)


def cloud(draw, cx, cy, s, col=CLOUD):
    S = S_(s)
    for dx, dy, r in ((-70, 10, 50), (0, -16, 70), (70, 10, 50)):
        draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r), cx + S(dx) + S(r), cy + S(dy) + S(r)), fill=col)
    draw.rounded_rectangle((cx - S(120), cy, cx + S(120), cy + S(60)), radius=S(30), fill=col)


def eye(draw, cx, cy, r, look=0.0):
    draw.ellipse((cx - r * 1.4 + 8, cy - r + 10, cx + r * 1.4 + 8, cy + r + 10), fill=K.SHADOW)
    draw.ellipse((cx - r * 1.4, cy - r, cx + r * 1.4, cy + r), fill=(255, 255, 255), outline=K.DEV_DARK, width=6)
    ix = cx + look * r * 0.5
    draw.ellipse((ix - r * 0.6, cy - r * 0.6, ix + r * 0.6, cy + r * 0.6), fill=(120, 84, 50))
    draw.ellipse((ix - r * 0.3, cy - r * 0.3, ix + r * 0.3, cy + r * 0.3), fill=K.DEV_DEEP)
    draw.ellipse((ix - r * 0.24, cy - r * 0.34, ix - r * 0.04, cy - r * 0.14), fill=(255, 255, 255))


def pause_icon(draw, cx, cy, r, col):
    draw.ellipse((cx - r + 8, cy - r + 10, cx + r + 8, cy + r + 10), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    for sx in (-1, 1):
        x = cx + sx * r * 0.26
        draw.rounded_rectangle((x - r * 0.12, cy - r * 0.42, x + r * 0.12, cy + r * 0.42), radius=r * 0.06,
                               fill=(255, 255, 255))


def forward_icon(draw, cx, cy, s, col):
    S = S_(s)
    K.draw_curve(draw, (cx - S(80), cy + S(50)), (cx - S(60), cy - S(30)), (cx + S(30), cy - S(30)), col,
                 width=max(4, int(S(22))))
    draw.polygon([(cx + S(20), cy - S(70)), (cx + S(90), cy - S(30)), (cx + S(20), cy + S(10))], fill=col)


def waveform(draw, x0, cy, wd, h, col, t=0.0, n=18):
    for k in range(n):
        x = x0 + k * wd / n
        a = h * (0.3 + 0.7 * abs(math.sin(k * 1.3 + t * 8)))
        draw.rounded_rectangle((x, cy - a / 2, x + wd / n * 0.55, cy + a / 2), radius=3, fill=col)


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

    def question_marks(spots):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(84 + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def stamp(x, y, label, col, size=44):
        f = font(size, bold=True)
        tw = draw.textbbox((0, 0), label, font=f)[2]
        draw.rounded_rectangle((x - tw / 2 - 30, y, x + tw / 2 + 30, y + size + 40), radius=14, fill=panel,
                               outline=col, width=6)
        K.text_at(draw, label, x, y + 14, f, col)

    def trusted_adults(x0, y, s=0.62, gap=170):
        for k, kind in enumerate(("mom", "dad", "teacher", "nani")):
            K.draw_person(draw, x0 + k * gap, y, s, kind, t)

    # ---- opening -----------------------------------------------------------
    if visual == "b18-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            aarav(draw, cx + 300, 470, 1.15, t)
            K.draw_magnifier(draw, cx + 470, 560, 0.7)
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 580)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · AI AND PRIVACY", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("Name", coral), ("Location", K.DANGER), ("Home photos", K.BOTH_COLOR)]
            for i, (lab, col) in enumerate(specs):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 510 + int((1 - a) * 40) + lift
                draw.ellipse((x - 100, y - 100, x + 100, y + 100), fill=lav_soft if i == 2 else coral_soft)
                if i == 0:
                    K.draw_name_tag(draw, x, y, 0.55, brand)
                elif i == 1:
                    K.draw_map_pin(draw, x, y + 60, 1.0, K.DANGER)
                else:
                    K.draw_house(draw, x, y + 10, 0.4, brand)
                K.draw_padlock(draw, x + 80, y + 50, 0.32, K.GOLD)
                K.text_at(draw, lab, x, y + 118, font(36, bold=True), col)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 740 + lift + int((1 - a) * 20), "Keep it private · Ask a grown-up", coral, size=34)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Real or AI-Made?", cx, 360 + lift, font(86, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                for k, (lab, col) in enumerate((("Real?", sage), ("AI-made?", K.BOTH_COLOR))):
                    x = cx + (k * 2 - 1) * 400
                    fb = photo_frame(draw, (x - 150, 570 + yy, x + 150, 830 + yy), cap_h=64)
                    draw.rectangle(fb, fill=SKY)
                    if k == 0:
                        camera(draw, (fb[0] + fb[2]) / 2, (fb[1] + fb[3]) / 2 + 6, 0.55)
                    else:
                        sparkle(draw, (fb[0] + fb[2]) / 2, (fb[1] + fb[3]) / 2, 54, K.BOTH_COLOR)
                    K.text_at(draw, lab, x, 830 + yy - 54, font(32, bold=True), col)
                K.draw_magnifier(draw, cx - 20, 680 + yy, 0.8)
            return True
        # eyes
        look = math.sin(t * math.pi * 3)
        eye(draw, cx - 220, 450, 110, look)
        eye(draw, cx + 220, 450, 110, look)
        question_marks([(cx - 620, 330), (cx + 600, 350)])
        a = K.stagger(progress, 2, step=0.12, speed=4)
        if a > 0:
            K.text_at(draw, "Can you always", cx, 640 + int((1 - a) * 20), font(56, bold=True), muted)
            K.text_at(draw, "believe your eyes?", cx, 714 + int((1 - a) * 20), font(72, bold=True), coral)
        return True

    # ---- the tiger photo -------------------------------------------------------------
    if visual == "b18-hook":
        if focus == "meet":
            aarav(draw, 460, 480, 1.4, t)
            K.text_at(draw, "Ding!", 460, 760, font(44, bold=True), coral)
            sb = phone(draw, 1220, 560, 1.55)
            app_bar(draw, sb, "Family chat", col=sage, size=30)
            x0, y0, x1, y1 = sb
            draw.rounded_rectangle((x0 + 20, y0 + 110, x1 - 60, y0 + 170), radius=20, fill=lav_soft)
            draw.text((x0 + 40, y0 + 120), "Nani: Good night!", fill=ink, font=font(28, bold=True))
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.text((x0 + 24, y0 + 196 + yy), "Cousin Riya", fill=K.BOTH_COLOR, font=font(28, bold=True))
                pb = (x0 + 20, y0 + 240 + yy, x1 - 20, y1 - 30 + yy)
                draw.rounded_rectangle(pb, radius=20, fill=WALL, outline=line, width=3)
                tiger(draw, (pb[0] + pb[2]) / 2, pb[1] + (pb[3] - pb[1]) * 0.42, (pb[3] - pb[1]) / 560, book=False)
                draw.rectangle((pb[0] + 3, pb[3] - 50, pb[2] - 3, pb[3] - 3), fill=DESK)
            return True
        if focus == "photo":
            tiger_photo(draw, (520, 240, 1400, 860))
            aarav(draw, 260, 520, 1.0, t)
            K.text_at(draw, "Whoa!", 260, 720, font(56, bold=True), coral)
            for k, (sx, sy) in enumerate(((1520, 320), (1640, 480), (1540, 640))):
                K.draw_star(draw, sx, sy + 10 * math.sin(t * 9 + k), 24 + 6 * pulse, [coral, K.GOLD, sage][k],
                            rot=t * 3 + k)
            return True
        if focus == "ask":
            tiger_photo(draw, (160, 260, 900, 840))
            aarav(draw, 1340, 520, 1.25, t)
            K.draw_bubble(draw, (1000, 240, 1500, 360), brand, "Is this real?", tail="right", size=48)
            question_marks([(1620, 400), (1080, 520)])
            K.draw_stopwatch(draw, 1600, 760, 56, progress, brand)
            return True
        # answer
        tiger_photo(draw, (160, 260, 900, 840))
        a = K.stagger(progress, 1, step=0.12, speed=4)
        if a > 0:
            stamp(530, 470, "AI-MADE", K.BOTH_COLOR, size=64)
        for k, (lab, kind) in enumerate((("No camera", "cam"), ("Made by AI", "ai"))):
            a = K.stagger(progress, k + 1, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 280 + k * 300 + int((1 - a) * 24)
            draw.rounded_rectangle((1040, y, 1760, y + 250), radius=40, fill=K.DANGER_SOFT if k == 0 else lav_soft,
                                   outline=K.DANGER if k == 0 else K.BOTH_COLOR, width=5)
            if k == 0:
                camera(draw, 1180, y + 130, 0.6)
                K.draw_cross(draw, 1250, y + 70, 30, K.DANGER)
            else:
                sparkle(draw, 1180, y + 125, 70 + 6 * pulse, K.BOTH_COLOR)
            draw.text((1320, y + 92), lab, fill=ink, font=font(54, bold=True))
        return True

    # ---- what an AI-made image is -----------------------------------------------------
    if visual == "b18-define":
        if focus == "name":
            K.text_at(draw, "AI-made image", cx, 230 + lift, font(80, bold=True), K.BOTH_COLOR)
            for k in range(2):
                a = K.stagger(progress, k + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                x0 = 200 + k * 790
                y = 380 + int((1 - a) * 30)
                ok = k == 1
                col = K.BOTH_COLOR if ok else K.DANGER
                draw.rounded_rectangle((x0, y, x0 + 730, y + 460), radius=40, fill=lav_soft if ok else K.DANGER_SOFT,
                                       outline=col, width=5)
                mx = x0 + 365
                if ok:
                    K.draw_device(draw, "laptop", mx - 90, y + 200, 0.8, brand, t=t)
                    sparkle(draw, mx - 90, y + 170, 44 + 6 * pulse, K.BOTH_COLOR)
                    K.draw_arrow(draw, mx + 50, y + 190, mx + 140, y + 190, muted, width=8, head=22)
                    fb = photo_frame(draw, (mx + 150, y + 90, mx + 330, y + 290), cap_h=20)
                    draw.rectangle(fb, fill=WALL)
                    tiger(draw, (fb[0] + fb[2]) / 2, fb[1] + 70, 0.36, book=False)
                    K.text_at(draw, "Made from patterns", mx, y + 360, font(48, bold=True), K.BOTH_COLOR)
                else:
                    camera(draw, mx, y + 190, 0.95)
                    K.draw_cross(draw, mx + 120, y + 100, 38, K.DANGER)
                    K.text_at(draw, "Not taken with a camera", mx, y + 360, font(44, bold=True), K.DANGER)
            return True
        if focus == "learn":
            K.text_at(draw, "Millions of photos", 520, 236, font(48, bold=True), ink)
            n = int(K.clamp01(progress * 1.4) * 24) + 4
            for k in range(min(n, 24)):
                r, c = k // 6, k % 6
                x = 160 + c * 120
                y = 320 + r * 130
                draw.rounded_rectangle((x, y, x + 104, y + 110), radius=10, fill=panel, outline=K.STEEL, width=3)
                kind = (k * 7) % 3
                if kind == 0:
                    tiger(draw, x + 52, y + 46, 0.17, glasses=False, book=False)
                    draw.rectangle((x + 3, y + 84, x + 101, y + 107), fill=panel)
                elif kind == 1:
                    draw.rectangle((x + 14, y + 16, x + 66, y + 54), fill=BOARD)
                    draw.rectangle((x + 10, y + 70, x + 94, y + 86), fill=DESK)
                else:
                    for sx in (-1, 1):
                        draw.ellipse((x + 52 + sx * 22 - 16, y + 40, x + 52 + sx * 22 + 16, y + 72), outline=STRIPE,
                                     width=5)
            K.draw_arrow(draw, 900, 560, 1010, 560, muted, width=12, head=34)
            pats = [("tiger", "Tigers: orange, stripes"), ("class", "Classrooms: desks, board"),
                    ("glass", "Glasses: two circles")]
            for i, (kind, lab) in enumerate(pats):
                a = K.stagger(progress, i + 2, step=0.14, speed=4)
                if a <= 0:
                    continue
                y = 290 + i * 190 + int((1 - a) * 24)
                draw.rounded_rectangle((1050, y, 1790, y + 160), radius=34, fill=lav_soft, outline=K.BOTH_COLOR,
                                       width=4)
                ix = 1140
                if kind == "tiger":
                    tiger(draw, ix, y + 72, 0.3, glasses=False, book=False)
                    draw.rectangle((ix - 60, y + 132, ix + 60, y + 156), fill=lav_soft)
                elif kind == "class":
                    draw.rectangle((ix - 60, y + 30, ix + 40, y + 96), fill=BOARD)
                    draw.rectangle((ix - 70, y + 110, ix + 70, y + 132), fill=DESK)
                else:
                    for sx in (-1, 1):
                        draw.ellipse((ix + sx * 36 - 28, y + 52, ix + sx * 36 + 28, y + 108), outline=STRIPE, width=8)
                    draw.line((ix - 8, y + 80, ix + 8, y + 80), fill=STRIPE, width=8)
                draw.text((1240, y + 56), lab, fill=ink, font=font(40, bold=True))
            return True
        # mix
        chips = [("tiger", TIGER), ("class", BOARD), ("glass", STRIPE)]
        for i, (kind, col) in enumerate(chips):
            y = 300 + i * 190
            draw.ellipse((260 - 80, y - 10, 260 + 80, y + 150), fill=lav_soft)
            if kind == "tiger":
                tiger(draw, 260, y + 60, 0.3, glasses=False, book=False)
                draw.rectangle((180, y + 120, 340, y + 152), fill=K.hex_rgb(brand["bg"]))
            elif kind == "class":
                draw.rectangle((210, y + 24, 300, y + 84), fill=BOARD)
                draw.rectangle((200, y + 96, 320, y + 116), fill=DESK)
            else:
                for sx in (-1, 1):
                    draw.ellipse((260 + sx * 34 - 26, y + 44, 260 + sx * 34 + 26, y + 96), outline=STRIPE, width=8)
            K.draw_curve(draw, (360, y + 70), (520, y + 70 + (1 - i) * 30), (640, 560), K.BOTH_COLOR, width=6,
                         dashed=True, phase=t * 120)
        draw.ellipse((740 - 110, 560 - 110, 740 + 110, 560 + 110), fill=lav_soft, outline=K.BOTH_COLOR, width=5)
        sparkle(draw, 740, 560, 70 + 8 * pulse, K.BOTH_COLOR)
        K.draw_arrow(draw, 870, 560, 970, 560, muted, width=10, head=30)
        a = K.stagger(progress, 1, step=0.12, speed=4)
        if a > 0:
            tiger_photo(draw, (1000, 260 + int((1 - a) * 30), 1500, 640 + int((1 - a) * 30)), label="Brand-new!")
        for k, lab in enumerate(("Not magic", "Not alive", "Just patterns")):
            a = K.stagger(progress, k + 3, step=0.12, speed=4)
            if a <= 0:
                continue
            K.pill(draw, 1250, 680 + k * 66 + int((1 - a) * 16), lab, K.DANGER if k < 2 else sage, size=30)
        K.text_at(draw, "Never", 1660, 380, font(40, bold=True), muted)
        K.text_at(draw, "happened!", 1660, 430, font(40, bold=True), coral)
        return True

    # ---- AI voices ---------------------------------------------------------------------
    if visual == "b18-voice":
        if focus == "intro":
            draw.ellipse((560 - 260, 560 - 260, 560 + 260, 560 + 260), fill=lav_soft)
            K.draw_device(draw, "mic", 540, 560, 1.4, brand, t=t)
            K.sound_waves(draw, 680, 520, 1.4, K.BOTH_COLOR, t)
            sparkle(draw, 760, 360, 40 + 6 * pulse, K.BOTH_COLOR)
            K.text_at(draw, "AI can copy", 1320, 360 + lift, font(64, bold=True), muted)
            K.text_at(draw, "voices too!", 1320, 450 + lift, font(96, bold=True), K.BOTH_COLOR)
            waveform(draw, 1060, 680, 520, 110, coral, t)
            return True
        if focus == "msg":
            sb = phone(draw, 640, 560, 1.55)
            app_bar(draw, sb, "Voice message", col=sage, size=28)
            x0, y0, x1, y1 = sb
            vb = (x0 + 20, y0 + 130, x1 - 20, y0 + 240)
            draw.rounded_rectangle(vb, radius=30, fill=lav_soft)
            draw.ellipse((vb[0] + 16, vb[1] + 20, vb[0] + 86, vb[1] + 90), fill=sage)
            draw.polygon([(vb[0] + 42, vb[1] + 36), (vb[0] + 42, vb[1] + 74), (vb[0] + 72, vb[1] + 55)], fill=panel)
            waveform(draw, vb[0] + 104, vb[1] + 55, vb[2] - vb[0] - 130, 56, K.BOTH_COLOR, t, n=12)
            K.text_at(draw, "From: unknown", (x0 + x1) / 2, y0 + 270, font(28, bold=True), muted)
            K.draw_face(draw, (x0 + x1) / 2, y0 + 420, 64, "kid", 1.0)
            draw.chord(((x0 + x1) / 2 - 70, y0 + 330, (x0 + x1) / 2 + 70, y0 + 440), 180, 360, fill=K.ROAD)
            draw.rectangle(((x0 + x1) / 2 - 76, y0 + 380, (x0 + x1) / 2 + 76, y0 + 392), fill=K.ROAD)
            K.draw_bubble(draw, (980, 250, 1740, 420), brand, "Hi Aarav, you're my favourite fan!", tail="left",
                          size=40)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                y = 560 + int((1 - a) * 24)
                draw.rounded_rectangle((1040, y, 1700, y + 130), radius=65, fill=K.DANGER_SOFT, outline=K.DANGER,
                                       width=4)
                K.text_at(draw, "Might not be real!", 1370, y + 38, font(46, bold=True), K.DANGER)
                question_marks([(1100, 740), (1640, 730)])
            return True
        # check
        K.draw_person(draw, 420, 460, 1.35, "mom", t)
        aarav(draw, 760, 560, 0.95, t)
        sb = phone(draw, 1180, 560, 1.15)
        x0, y0, x1, y1 = sb
        draw.rounded_rectangle((x0 + 14, y0 + 40, x1 - 14, y0 + 130), radius=24, fill=lav_soft)
        waveform(draw, x0 + 40, y0 + 85, x1 - x0 - 80, 50, K.BOTH_COLOR, t, n=10)
        K.text_at(draw, "?", (x0 + x1) / 2, y0 + 200, font(120, bold=True), K.GOLD)
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            K.draw_shield(draw, 1580, 520 + int((1 - a) * 20), 1.0, sage)
            K.text_at(draw, "Check with", 1580, 680, font(40, bold=True), ink)
            K.text_at(draw, "a grown-up", 1580, 730, font(40, bold=True), ink)
        K.pill(draw, 420, 760, "Mum helps check", K.BOTH_COLOR, size=34)
        return True

    # ---- clues ----------------------------------------------------------------------
    if visual == "b18-clues":
        n = {"intro": 0, "hands": 1, "text": 2, "face": 3}[focus]
        specs = [("Odd hands", "six fingers?", coral), ("Weird text", "jumbled letters", K.ROAD),
                 ("Too-perfect faces", "plastic skin", K.BOTH_COLOR)]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        for i, (title, sub, col) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            mx = x0 + cw / 2
            if i >= n:
                draw.rounded_rectangle((x0, 290, x0 + cw, 860), radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.pill(draw, 0, 310, f"Clue {i + 1}", muted, size=30, left=x0 + 24)
                K.text_at(draw, "?", mx, 460, font(140, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, 290 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            K.pill(draw, 0, 310 + yy, f"Clue {i + 1}", col, size=30, left=x0 + 24)
            if i == 0:
                tips = hand(draw, mx + 20, 600 + yy, 1.2, fingers=5)
                cnt = int(K.clamp01(progress * 1.8) * 6.99) if active else 6
                for k, (fx, fy) in enumerate(tips[:cnt]):
                    dx = -24 if k == 5 else 0
                    K.text_at(draw, str(k + 1), fx + dx, fy - 46, font(32, bold=True), coral)
            elif i == 1:
                K.draw_shop(draw, mx, 540 + yy, 0.85, brand, name="SWEERTS SHPO")
            else:
                perfect_face(draw, mx, 520 + yy, 120, t)
                for k, (sx, sy) in enumerate(((mx - 170, 400 + yy), (mx + 170, 420 + yy), (mx + 150, 610 + yy))):
                    sparkle(draw, sx, sy, 18 + 6 * (pulse if k % 2 else 1 - pulse), K.GOLD)
            K.text_at(draw, title, mx, 700 + yy, font(44, bold=True), col)
            K.text_at(draw, sub, mx, 764 + yy, font(34, bold=True), muted)
        if n == 0:
            K.pill(draw, cx, 222, "Look for clues!", K.BOTH_COLOR, size=32)
        return True

    # ---- party picture detective ------------------------------------------------------
    if visual == "b18-detect":
        hot = party_photo(draw, (120, 240, 1200, 860))
        if focus == "ask":
            mx = 1500 + 60 * math.sin(t * 5)
            K.draw_magnifier(draw, mx, 440, 1.3)
            question_marks([(1330, 260), (1720, 300)])
            K.draw_stopwatch(draw, 1500, 740, 60, progress, brand)
            return True
        labs = [("Jumbled banner", K.ROAD), ("Six fingers", coral), ("Plastic face", K.BOTH_COLOR)]
        for i, ((hx, hy, r), (lab, col)) in enumerate(zip(hot, labs)):
            a = K.stagger(progress, i, step=0.18, speed=5)
            if a <= 0:
                continue
            rr = r * (0.7 + 0.3 * a) + 4 * pulse
            if i == 0:
                draw.rounded_rectangle((hx - rr, hy - 60, hx + rr, hy + 60), radius=40, outline=K.DANGER, width=8)
            else:
                draw.ellipse((hx - rr, hy - rr, hx + rr, hy + rr), outline=K.DANGER, width=8)
            y = 330 + i * 150
            K.pill(draw, 0, y, str(i + 1), K.DANGER, size=34, left=1270)
            draw.text((1360, y + 6), lab, fill=ink, font=font(46, bold=True))
        a = K.stagger(progress, 4, step=0.14, speed=4)
        if a > 0:
            K.pill(draw, 1520, 790 + int((1 - a) * 20), "Be careful!", coral, size=38)
        return True

    # ---- clues aren't proof -----------------------------------------------------------
    if visual == "b18-careful":
        if focus == "intro":
            draw.rounded_rectangle((220, 300, 760, 800), radius=40, fill=coral_soft, outline=coral, width=5)
            hand(draw, 490, 560, 1.15, fingers=5)
            K.text_at(draw, "A clue", 490, 700, font(54, bold=True), coral)
            K.draw_magnifier(draw, 680, 380, 0.6)
            K.draw_arrow(draw, 800, 550, 1000, 550, muted, width=12, head=34)
            a = K.stagger(progress, 1, step=0.14, speed=4)
            if a > 0:
                stamp(1360, 420 + int((1 - a) * 20), "PROOF?", K.DANGER, size=90)
                K.draw_cross(draw, 1600, 420, 40, K.DANGER)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.text_at(draw, "Clues help you think,", 1360, 640, font(46, bold=True), ink)
                K.text_at(draw, "but they aren't proof", 1360, 700, font(46, bold=True), K.DANGER)
            return True
        if focus == "strange":
            cow_photo(draw, (160, 250, 1160, 860))
            K.text_at(draw, "Real street!", 660, 860 - 58, font(32, bold=True), K.DEV_DARK)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                stamp(1500, 330 + int((1 - a) * 20), "REAL!", sage, size=80)
                K.text_at(draw, "Strange can", 1500, 520, font(52, bold=True), ink)
                K.text_at(draw, "still be real!", 1500, 586, font(52, bold=True), sage)
                question_marks([(1300, 690), (1700, 700)])
            return True
        if focus == "blurry":
            blurry_photo(draw, (160, 250, 1160, 860), t)
            K.text_at(draw, "My photo from the match!", 660, 860 - 58, font(32, bold=True), K.DEV_DARK)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                stamp(1500, 330 + int((1 - a) * 20), "REAL!", sage, size=80)
                K.text_at(draw, "Blurry or dark", 1500, 520, font(52, bold=True), ink)
                K.text_at(draw, "doesn't mean fake", 1500, 586, font(52, bold=True), sage)
            return True
        # better
        K.text_at(draw, "AI keeps getting better", cx, 236, font(54, bold=True), ink)
        specs = [("Before", 6, True), ("Now", 5, False), ("Later", 4, False)]
        for i, (lab, nf, melt) in enumerate(specs):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 470
            y = 330 + int((1 - a) * 30)
            K.shadow_card(draw, (x - 190, y, x + 190, y + 380), brand, radius=30)
            hand(draw, x, y + 220, 0.95, fingers=nf, melt=melt)
            K.text_at(draw, lab, x, y + 320, font(40, bold=True), muted)
            if i < 2:
                K.draw_arrow(draw, x + 200, y + 190, x + 270, y + 190, muted, width=8, head=22)
        a = K.stagger(progress, 4, step=0.14, speed=4)
        if a > 0:
            K.pill(draw, cx - 300, 760 + int((1 - a) * 20), "Clues can miss", K.DANGER, size=38)
            K.pill(draw, cx + 300, 760 + int((1 - a) * 20), "Still ask a grown-up", sage, size=38)
        return True

    # ---- could be real, or be careful? -------------------------------------------------
    if visual == "b18-sort":
        if focus == "intro":
            for k, (lab, col, soft) in enumerate((("COULD BE REAL", sage, sage_soft),
                                                  ("BE CAREFUL", coral, coral_soft))):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 500
                y = 340 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 310 + 8, y + 10, x + 310 + 8, y + 330), radius=44, fill=K.SHADOW)
                draw.rounded_rectangle((x - 310, y, x + 310, y + 320), radius=44, fill=soft, outline=col, width=6)
                if k == 0:
                    K.draw_check(draw, x, y + 100, 60, col)
                else:
                    K.draw_magnifier(draw, x - 10, y + 96, 0.62, col)
                K.text_at(draw, lab, x, y + 200, font(54, bold=True), col)
            aarav(draw, cx, 560, 0.9, t)
            return True
        ans = focus == "answer"
        cards = [("blurry", ("Blurry, dark", "cricket photo"), True), ("sign", ("Jumbled", "shop sign"), False),
                 ("hand", ("A hand with", "six fingers"), False), ("rainbow", ("Rainbow over", "a school"), True)]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab, real) in enumerate(cards):
            x0 = x_start + i * (cw + gap)
            reveal = ans and progress > (0.5 if real else 0.06)
            col = (sage if real else coral) if reveal else line
            K.shadow_card(draw, (x0, 300, x0 + cw, 830), brand, radius=30, outline=col, outline_w=6 if reveal else 3)
            mx = x0 + cw / 2
            if kind == "blurry":
                blurry_photo(draw, (x0 + 30, 380, x0 + cw - 30, 610), t, cap_h=20)
            elif kind == "sign":
                K.draw_shop(draw, mx, 520, 0.72, brand, name="SWEERTS SHPO")
            elif kind == "hand":
                hand(draw, mx + 16, 540, 0.95, fingers=5)
            else:
                draw.rounded_rectangle((x0 + 30, 380, x0 + cw - 30, 610), radius=14, fill=SKY)
                for k, c in enumerate((K.DANGER, K.CORAL, K.GOLD, K.LEAF, K.ROAD, K.BOTH_COLOR)):
                    r = 150 - k * 14
                    draw.arc((mx - r, 560 - r, mx + r, 560 + r), 180, 360, fill=c, width=14)
                K.draw_school(draw, mx, 540, 0.42, brand)
            label_lines(lab, mx, 660, size=36)
            if reveal:
                K.pill(draw, mx, 320, "COULD BE REAL" if real else "BE CAREFUL", sage if real else coral, size=28)
            elif not ans:
                K.pill(draw, mx, 320, "?", K.BOTH_COLOR, size=28)
        if ans:
            K.pill(draw, cx, 222, "Still not sure? Ask a grown-up", ink, size=30)
        else:
            K.pill(draw, cx - 40, 222, "Which need extra care?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 290, 252, 32, progress, brand)
        return True

    # ---- three steps -----------------------------------------------------------------
    if visual == "b18-steps":
        n = {"intro": 0, "pause": 1, "ask": 2, "share": 3}[focus]
        specs = [("Pause", "stop and think", coral), ("Ask", "a trusted adult", sage),
                 ("Don't share", "until you know", K.DANGER)]
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
            if i == 0:
                pause_icon(draw, mx, 520 + yy, 120 + (6 * pulse if active else 0), coral)
            elif i == 1:
                trusted_adults(mx - 180, 470 + yy, s=0.55, gap=120)
                K.draw_bubble(draw, (mx - 150, 570 + yy, mx + 150, 650 + yy), brand, "Is it real?", tail="left",
                              size=32)
            else:
                draw.rounded_rectangle((mx - 150, 400 + yy, mx + 150, 640 + yy), radius=30, fill=blue_soft)
                K.text_at(draw, "Class group", mx, 416 + yy, font(30, bold=True), K.ROAD)
                forward_icon(draw, mx, 550 + yy, 0.9, K.ROAD)
                K.draw_cross(draw, mx + 110, 610 + yy, 36, K.DANGER)
            K.text_at(draw, title, mx, 700 + yy, font(50, bold=True), col)
            K.text_at(draw, sub, mx, 768 + yy, font(34, bold=True), muted)
        if n == 0:
            K.pill(draw, cx, 222, "Surprising picture?", coral, size=32)
        return True

    # ---- checkpoint ----------------------------------------------------------------
    if visual == "b18-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Be a picture detective!", cx, 450 + lift, font(60, bold=True), ink)
            K.draw_magnifier(draw, cx - 10, 610 + lift, 0.55)
            return True
        ans = focus == "answer"
        fb = photo_frame(draw, (1000, 250, 1780, 850))
        draw.rectangle(fb, fill=SKY)
        cloud(draw, fb[0] + 140, fb[3] - 60, 1.0)
        cloud(draw, fb[2] - 160, fb[3] - 40, 1.2)
        cloud(draw, fb[2] - 120, fb[1] + 80, 0.6)
        flying_bus(draw, (fb[0] + fb[2]) / 2, (fb[1] + fb[3]) / 2 - 10 + 12 * math.sin(t * 6), 0.8, t)
        K.text_at(draw, "Wow! Look at this!", 1390, 850 - 56, font(32, bold=True), K.DEV_DARK)
        if ans:
            stamp(1390, 650, "PAUSE · CHECK", coral, size=40)
        draw.rounded_rectangle((130 + 10, 240 + 12, 920 + 10, 860 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 920, 860), radius=24, fill=(255, 250, 238))
        label_lines(("A flying school bus!", "What two things", "should you do?"), 525, 270, size=44, col=coral)
        rows = [("1", "Pause. Don't believe it yet", coral), ("2", "Ask a trusted adult", sage),
                ("+", "Don't share it yet", K.DANGER)]
        for i, (num, lab, col) in enumerate(rows):
            y = 470 + i * 125
            draw.line((180, y + 96, 870, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                draw.ellipse((180, y + 16, 240, y + 76), fill=col)
                K.text_at(draw, num, 210, y + 22, font(36, bold=True), panel)
                draw.text((262, y + 22), lab, fill=ink, font=font(40, bold=True))
        if not ans:
            K.text_at(draw, "?", 525, 520, font(150, bold=True), line)
            K.draw_stopwatch(draw, 525, 790, 40, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b18-recap":
        recap = [(("AI can make", "real-looking pictures"), K.BOTH_COLOR, "ai"),
                 (("Check hands,", "text and faces"), coral, "clues"),
                 (("Pause before", "believing or sharing"), K.DANGER, "pause"),
                 (("Unsure? Ask a", "trusted adult"), sage, "adult")]
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
                if kind == "ai":
                    fb = photo_frame(draw, (ix - 130, iy - 140, ix + 130, iy + 120), cap_h=20)
                    draw.rectangle(fb, fill=WALL)
                    tiger(draw, ix, iy - 40, 0.42, book=False)
                    draw.rectangle((fb[0], fb[3] - 40, fb[2], fb[3]), fill=DESK)
                    sparkle(draw, ix + 110, iy - 120, 30, K.BOTH_COLOR)
                elif kind == "clues":
                    hand(draw, ix - 70, iy + 40, 0.6, fingers=5)
                    perfect_face(draw, ix + 80, iy - 50, 50)
                    draw.rounded_rectangle((ix - 10, iy + 50, ix + 170, iy + 100), radius=10, fill=K.ROAD)
                    K.text_at(draw, "SHPO", ix + 80, iy + 58, font(30, bold=True), panel)
                elif kind == "pause":
                    pause_icon(draw, ix, iy, 100, K.DANGER)
                else:
                    trusted_adults(ix - 140, iy - 30, s=0.5, gap=95)
                label_lines(lab, x0 + 200, y0 + 390, size=34)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            aarav(draw, cx + 300, 450, 1.0, t)
            K.draw_magnifier(draw, cx + 450, 540, 0.6)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Picture detective!", coral, size=36)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
