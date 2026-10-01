"""B3 · Where AI Hides in Daily Life — visuals."""
import math

import build as K

TARA = (132, 104, 222)
TARA_DARK = (98, 74, 182)
TARA_LIGHT = (204, 192, 246)
GLOW = (96, 226, 236)
WAVE = (40, 170, 196)
CHEEK = (255, 140, 170)
FUR = (204, 146, 82)
FUR_DARK = (140, 92, 50)
MUZZLE = (242, 214, 170)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
MAP_BG = (232, 241, 226)
PARK = (196, 226, 180)
FIELD = (120, 186, 104)
FIELD_DARK = (100, 166, 86)
SKY = (196, 226, 246)
SAND = (240, 214, 160)
SEA = (96, 170, 226)
TRAFFIC_GREEN = (64, 186, 110)
TRAFFIC_RED = (226, 62, 62)
ROUTE = (52, 120, 230)
WALL = (252, 238, 218)
CABINET = (232, 196, 150)
HAT = (150, 104, 66)
HAT_DARK = (112, 76, 46)
BUNNY_PINK = (255, 182, 200)
CAM_BG = (255, 232, 214)
ASPHALT = (96, 104, 118)
WHITE = (255, 255, 255)


def S_(s):
    return lambda v: v * s


# ---- characters ---------------------------------------------------------------------

def tara(draw, cx, cy, s, t, mood="happy", ring=False, talk=False):
    """Tara the voice helper (a smart speaker). cy = body centre; top ≈ cy-148s, shadow ≈ cy+180s."""
    S = S_(s)
    y = cy + S(5) * math.sin(t * math.pi * 4)
    draw.ellipse((cx - S(128), cy + S(150), cx + S(128), cy + S(180)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110) + S(8), y - S(122) + S(10), cx + S(110) + S(8), y + S(160) + S(10)),
                           radius=S(80), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), y - S(122), cx + S(110), y + S(160)), radius=S(80), fill=TARA)
    for r in range(3):
        for c in range(7 - r % 2):
            dx = cx - S(72) + c * S(24) + (S(12) if r % 2 else 0)
            dy = y + S(56) + r * S(26)
            draw.ellipse((dx - S(5), dy - S(5), dx + S(5), dy + S(5)), fill=TARA_DARK)
    draw.ellipse((cx - S(88), y - S(148), cx + S(88), y - S(100)), fill=TARA_DARK)
    rc = GLOW if (ring and int(t * 8) % 2 == 0) else (150, 236, 244) if ring else TARA_LIGHT
    draw.ellipse((cx - S(72), y - S(140), cx + S(72), y - S(108)), outline=rc, width=max(2, int(S(8))))
    draw.rounded_rectangle((cx - S(80), y - S(84), cx + S(80), y + S(24)), radius=S(32), fill=K.DEV_DEEP)
    ey = y - S(46)
    ew = max(2, int(S(8)))
    for i, sx in enumerate((-1, 1)):
        ex = cx + sx * S(34)
        if mood == "happy":
            draw.arc((ex - S(16), ey - S(8), ex + S(16), ey + S(22)), 200, 340, fill=GLOW, width=ew)
        elif mood == "think":
            draw.ellipse((ex + S(6) - S(11), ey - S(8) - S(11), ex + S(6) + S(11), ey - S(8) + S(11)), fill=GLOW)
        elif mood == "oops":
            d = 1 if i == 0 else -1
            draw.line([(ex - d * S(12), ey - S(12)), (ex + d * S(10), ey), (ex - d * S(12), ey + S(12))], fill=GLOW,
                      width=ew)
        elif mood == "idle" and (t * 2.3) % 1 > 0.92:
            draw.line((ex - S(14), ey, ex + S(14), ey), fill=GLOW, width=ew)
        else:
            draw.ellipse((ex - S(13), ey - S(13), ex + S(13), ey + S(13)), fill=GLOW)
    my = y - S(6)
    if mood == "think":
        draw.ellipse((cx - S(2), my - S(14), cx + S(18), my + S(4)), outline=GLOW, width=max(2, int(S(5))))
    elif mood == "oops":
        pts = [(cx - S(26) + k * S(13), my - S(6) + (S(6) if k % 2 else -S(6))) for k in range(5)]
        draw.line(pts, fill=GLOW, width=ew)
        dx, dy = cx + S(118), y - S(96)
        draw.polygon([(dx, dy - S(26)), (dx - S(13), dy), (dx + S(13), dy)], fill=K.WATER)
        draw.ellipse((dx - S(13), dy - S(10), dx + S(13), dy + S(16)), fill=K.WATER)
    else:
        draw.arc((cx - S(26), my - S(24), cx + S(26), my + S(8)), 20, 160, fill=GLOW, width=ew)
        for sx in (-1, 1):
            hx = cx + sx * S(60)
            draw.ellipse((hx - S(9), my - S(14), hx + S(9), my - S(2)), fill=CHEEK)
    if talk:
        K.sound_waves(draw, cx + S(118), y - S(30), s, WAVE, t, "right")


def anaya(draw, cx, cy, s, t, hat=False):
    """Anaya: draw_person kid + pigtails. cy = head centre."""
    S = S_(s)
    yy = cy + S(6) * math.sin(t * math.pi * 4)
    r = S(64)
    for sx in (-1, 1):
        px = cx + sx * r * 1.02
        draw.ellipse((px - r * 0.3, yy - r * 0.2, px + r * 0.3, yy + r * 0.75), fill=K.HAIR)
        draw.ellipse((px - r * 0.17, yy - r * 0.3, px + r * 0.17, yy - r * 0.02), fill=K.CORAL)
    K.draw_person(draw, cx, cy, s, "kid", t)
    if hat:
        draw.chord((cx - S(72), yy - S(124), cx + S(72), yy - S(16)), 180, 360, fill=HAT)
        draw.ellipse((cx - S(96), yy - S(84), cx + S(96), yy - S(58)), fill=HAT_DARK)
        draw.rectangle((cx - S(70), yy - S(84), cx + S(70), yy - S(72)), fill=K.GOLD)


def cam_face(draw, cx, cy, r, sway=0.0):
    """Anaya's face for the camera view (pigtails + face)."""
    for sx in (-1, 1):
        px = cx + sx * r * 1.02
        draw.ellipse((px - r * 0.3, cy - r * 0.2, px + r * 0.3, cy + r * 0.75), fill=K.HAIR)
        draw.ellipse((px - r * 0.17, cy - r * 0.3, px + r * 0.17, cy - r * 0.02), fill=K.CORAL)
    K.draw_face(draw, cx, cy, r, "kid", 1.0)
    draw.ellipse((cx - r * 0.08, cy + r * 0.12, cx + r * 0.08, cy + r * 0.24), fill=(214, 150, 120))


def bunny_ears(draw, cx, top, s, sway=0.0):
    S = S_(s)
    for sx in (-1, 1):
        ex = cx + sx * S(40) + sway * S(8)
        draw.ellipse((ex - S(26), top - S(160), ex + S(26), top + S(12)), fill=WHITE, outline=(226, 214, 220),
                     width=max(2, int(S(4))))
        draw.ellipse((ex - S(12), top - S(138), ex + S(12), top - S(10)), fill=BUNNY_PINK)


# ---- things ---------------------------------------------------------------------------

def phone(draw, cx, cy, s, screen=(246, 248, 250)):
    S = S_(s)
    W, H = S(150), S(290)
    draw.rounded_rectangle((cx - W + S(10), cy - H + S(12), cx + W + S(10), cy + H + S(12)), radius=S(40), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(40), fill=K.DEV_DARK)
    box = (cx - W + S(14), cy - H + S(46), cx + W - S(14), cy + H - S(40))
    draw.rectangle(box, fill=screen)
    draw.rounded_rectangle((cx - S(34), cy - H + S(18), cx + S(34), cy - H + S(30)), radius=S(6), fill=K.DEV_DEEP)
    draw.rounded_rectangle((cx - S(46), cy + H - S(24), cx + S(46), cy + H - S(16)), radius=S(4), fill=K.DEV_MID)
    return box


def tablet(draw, cx, cy, s, screen=(246, 248, 250)):
    S = S_(s)
    W, H = S(300), S(190)
    draw.rounded_rectangle((cx - W + S(10), cy - H + S(12), cx + W + S(10), cy + H + S(12)), radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(34), fill=K.DEV_DARK)
    box = (cx - W + S(22), cy - H + S(22), cx + W - S(22), cy + H - S(22))
    draw.rectangle(box, fill=screen)
    return box


def search_bar(draw, box, text, typed, t, ink, coral):
    x0, y0, x1, _ = box
    bw = x1 - x0
    h = max(50, bw * 0.2)
    bar = (x0 + 12, y0 + 14, x1 - 12, y0 + 14 + h)
    draw.rounded_rectangle(bar, radius=h / 2, fill=WHITE, outline=(200, 194, 186), width=3)
    mx, my = bar[0] + h * 0.5, (bar[1] + bar[3]) / 2
    r = h * 0.18
    lw = max(2, int(h * 0.07))
    draw.ellipse((mx - r, my - r - 2, mx + r, my + r - 2), outline=K.DEV_MID, width=lw)
    draw.line((mx + r * 0.7, my + r * 0.5, mx + r * 1.5, my + r * 1.3), fill=K.DEV_MID, width=lw)
    font = K.load_font(30, bold=True)
    shown = text[: int(round(len(text) * K.clamp01(typed)))]
    tx, ty = bar[0] + h * 0.95, my - 18
    draw.text((tx, ty), shown, fill=ink, font=font)
    if typed < 1.0 or int(t * 6) % 2 == 0:
        bx = draw.textbbox((tx, ty), shown, font=font)[2] + 4 if shown else tx
        draw.line((bx, my - 16, bx, my + 16), fill=coral, width=3)
    return bar[3]


def dog_face(draw, cx, cy, r, fur=FUR, ear=FUR_DARK, tongue=True):
    draw.ellipse((cx - r * 1.18, cy - r * 0.6, cx - r * 0.56, cy + r * 0.78), fill=ear)
    draw.ellipse((cx + r * 0.56, cy - r * 0.6, cx + r * 1.18, cy + r * 0.78), fill=ear)
    draw.ellipse((cx - r, cy - r * 0.92, cx + r, cy + r * 0.95), fill=fur)
    draw.ellipse((cx - r * 0.52, cy + r * 0.06, cx + r * 0.52, cy + r * 0.8), fill=MUZZLE)
    if tongue:
        draw.chord((cx - r * 0.16, cy + r * 0.42, cx + r * 0.16, cy + r * 0.86), 0, 180, fill=(236, 110, 130))
    draw.ellipse((cx - r * 0.2, cy + r * 0.1, cx + r * 0.2, cy + r * 0.38), fill=K.DEV_DEEP)
    draw.line((cx, cy + r * 0.38, cx, cy + r * 0.52), fill=K.DEV_DEEP, width=max(2, int(r * 0.06)))
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.38, cy - r * 0.2
        draw.ellipse((ex - r * 0.13, ey - r * 0.13, ex + r * 0.13, ey + r * 0.13), fill=K.DEV_DEEP)
        draw.ellipse((ex - r * 0.06, ey - r * 0.09, ex, ey - r * 0.03), fill=WHITE)


DOG_FURS = [(FUR, FUR_DARK), ((120, 84, 56), (80, 54, 34)), ((238, 214, 172), (200, 160, 110)),
            ((70, 62, 58), (40, 34, 30)), ((226, 170, 96), (176, 116, 60)), ((250, 244, 232), (196, 170, 140))]


def dog_side(draw, cx, cy, s, t, fur=FUR):
    """Side-view dog facing right. Returns feature points for callouts."""
    S = S_(s)
    draw.ellipse((cx - S(130), cy + S(82), cx + S(130), cy + S(106)), fill=K.SHADOW)
    wag = math.sin(t * 18)
    tail = (cx - S(158) - S(8) * wag, cy - S(78) + S(14) * wag)
    draw.line([(cx - S(100), cy - S(10)), (cx - S(140), cy - S(40)), tail], fill=fur, width=max(3, int(S(20))),
              joint="curve")
    for lx in (-82, -46, 38, 72):
        draw.rounded_rectangle((cx + S(lx) - S(13), cy + S(16), cx + S(lx) + S(13), cy + S(92)), radius=S(10), fill=fur)
        draw.ellipse((cx + S(lx) - S(16), cy + S(80), cx + S(lx) + S(18), cy + S(98)), fill=FUR_DARK)
    draw.rounded_rectangle((cx - S(118), cy - S(42), cx + S(92), cy + S(52)), radius=S(46), fill=fur)
    draw.ellipse((cx - S(60), cy + S(4), cx + S(50), cy + S(48)), fill=MUZZLE)
    hx, hy = cx + S(110), cy - S(70)
    draw.ellipse((hx - S(64), hy - S(62), hx + S(64), hy + S(62)), fill=fur)
    draw.ellipse((hx + S(18), hy - S(6), hx + S(98), hy + S(42)), fill=MUZZLE)
    draw.ellipse((hx + S(78), hy - S(2), hx + S(104), hy + S(20)), fill=K.DEV_DEEP)
    draw.arc((hx + S(40), hy + S(14), hx + S(92), hy + S(40)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(4))))
    draw.ellipse((hx + S(6), hy - S(30), hx + S(26), hy - S(10)), fill=K.DEV_DEEP)
    draw.ellipse((hx + S(10), hy - S(27), hx + S(16), hy - S(21)), fill=WHITE)
    draw.polygon([(hx - S(34), hy - S(52)), (hx + S(2), hy - S(60)), (hx - S(8), hy + S(30)), (hx - S(48), hy + S(14))],
                 fill=FUR_DARK)
    draw.line((hx - S(52), hy + S(46), hx - S(10), hy + S(62)), fill=K.CORAL, width=max(3, int(S(12))))
    return {"ear": (hx - S(22), hy - S(10)), "nose": (hx + S(92), hy + S(9)), "tail": tail}


def thumb(draw, box, kind, t=0.0):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    m = min(bw, bh)
    if kind.startswith("dog"):
        k = int(kind[3:] or 0) % len(DOG_FURS)
        draw.rectangle(box, fill=[(220, 236, 250), (232, 246, 232), (255, 238, 224)][k % 3])
        fur, ear = DOG_FURS[k]
        dog_face(draw, mx, my + bh * 0.06, m * 0.3, fur, ear)
    elif kind == "beach":
        draw.rectangle((x0, y0, x1, y0 + bh * 0.5), fill=SKY)
        draw.rectangle((x0, y0 + bh * 0.5, x1, y0 + bh * 0.72), fill=SEA)
        draw.rectangle((x0, y0 + bh * 0.72, x1, y1), fill=SAND)
        draw.ellipse((x1 - bw * 0.34, y0 + bh * 0.1, x1 - bw * 0.12, y0 + bh * 0.1 + bw * 0.22), fill=K.GOLD)
    elif kind == "cake":
        draw.rectangle(box, fill=(255, 240, 230))
        draw.rectangle((mx - m * 0.3, my - m * 0.02, mx + m * 0.3, my + m * 0.32), fill=(236, 150, 170))
        draw.rectangle((mx - m * 0.3, my - m * 0.08, mx + m * 0.3, my + m * 0.04), fill=WHITE)
        draw.rectangle((mx - m * 0.03, my - m * 0.3, mx + m * 0.03, my - m * 0.08), fill=K.ROAD)
        draw.ellipse((mx - m * 0.05, my - m * 0.4, mx + m * 0.05, my - m * 0.28), fill=K.GOLD)
    elif kind == "flower":
        draw.rectangle(box, fill=(232, 246, 232))
        draw.line((mx, my, mx, y1 - bh * 0.08), fill=K.LEAF, width=max(2, int(m * 0.05)))
        for a in range(0, 360, 60):
            px, py = mx + math.cos(math.radians(a)) * m * 0.16, my - m * 0.08 + math.sin(math.radians(a)) * m * 0.16
            draw.ellipse((px - m * 0.1, py - m * 0.1, px + m * 0.1, py + m * 0.1), fill=K.CORAL)
        draw.ellipse((mx - m * 0.08, my - m * 0.16, mx + m * 0.08, my), fill=K.GOLD)
    elif kind == "kite":
        draw.rectangle(box, fill=SKY)
        pts = [(mx, my - m * 0.32), (mx + m * 0.22, my - m * 0.04), (mx, my + m * 0.24), (mx - m * 0.22, my - m * 0.04)]
        draw.polygon(pts, fill=K.CORAL)
        draw.line((mx, my - m * 0.32, mx, my + m * 0.24), fill=WHITE, width=max(1, int(m * 0.02)))
        draw.line([(mx, my + m * 0.24), (mx - m * 0.1, my + m * 0.34), (mx + m * 0.04, my + m * 0.44)],
                  fill=K.DEV_MID, width=max(1, int(m * 0.02)))
    elif kind == "cricket":
        draw.rectangle(box, fill=FIELD)
        draw.rectangle((x0, y0, x1, y0 + bh * 0.3), fill=SKY)
        for k in range(3):
            sx = mx - m * 0.14 + k * m * 0.14
            draw.rectangle((sx - m * 0.025, my - m * 0.1, sx + m * 0.025, my + m * 0.3), fill=(250, 240, 220))
        draw.ellipse((mx + m * 0.22, my - m * 0.06, mx + m * 0.36, my + m * 0.08), fill=(200, 40, 50))
    elif kind == "bat":
        draw.rectangle(box, fill=(232, 246, 232))
        bat(draw, mx - m * 0.06, my, m / 300)
        draw.ellipse((mx + m * 0.16, my + m * 0.08, mx + m * 0.32, my + m * 0.24), fill=(200, 40, 50))
    elif kind == "trophy":
        draw.rectangle(box, fill=(255, 244, 220))
        draw.chord((mx - m * 0.22, my - m * 0.36, mx + m * 0.22, my + m * 0.1), 0, 180, fill=K.GOLD)
        draw.rectangle((mx - m * 0.22, my - m * 0.14, mx + m * 0.22, my - m * 0.12), fill=K.GOLD)
        draw.rectangle((mx - m * 0.04, my + m * 0.08, mx + m * 0.04, my + m * 0.22), fill=(220, 150, 40))
        draw.rectangle((mx - m * 0.16, my + m * 0.22, mx + m * 0.16, my + m * 0.3), fill=(220, 150, 40))
    else:
        draw.rectangle(box, fill=(240, 236, 228))


def bat(draw, cx, cy, s):
    S = S_(s)
    draw.polygon([(cx - S(34), cy - S(110)), (cx + S(34), cy - S(110)), (cx + S(30), cy + S(70)), (cx - S(30), cy + S(70))],
                 fill=(236, 204, 150), outline=(176, 136, 84))
    draw.rounded_rectangle((cx - S(10), cy + S(66), cx + S(10), cy + S(130)), radius=S(6), fill=(60, 60, 70))


def torch(draw, cx, cy, s, on=True):
    S = S_(s)
    if on:
        draw.polygon([(cx + S(110), cy - S(50)), (cx + S(230), cy - S(100)), (cx + S(230), cy + S(100)),
                      (cx + S(110), cy + S(50))], fill=(255, 240, 180))
    draw.rounded_rectangle((cx - S(110) + S(6), cy - S(34) + S(8), cx + S(70) + S(6), cy + S(34) + S(8)),
                           radius=S(16), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(34), cx + S(70), cy + S(34)), radius=S(16), fill=K.DEV_MID)
    draw.polygon([(cx + S(60), cy - S(34)), (cx + S(110), cy - S(56)), (cx + S(110), cy + S(56)), (cx + S(60), cy + S(34))],
                 fill=K.DEV_DARK)
    draw.ellipse((cx + S(98), cy - S(54), cx + S(122), cy + S(54)), fill=(255, 236, 150) if on else K.STEEL)
    draw.rounded_rectangle((cx - S(30), cy - S(46), cx + S(4), cy - S(30)), radius=S(5), fill=K.CORAL)


def doorbell(draw, cx, cy, s, pressed=False):
    S = S_(s)
    draw.rounded_rectangle((cx - S(60) + S(6), cy - S(90) + S(8), cx + S(60) + S(6), cy + S(90) + S(8)), radius=S(24),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(60), cy - S(90), cx + S(60), cy + S(90)), radius=S(24), fill=K.STEEL,
                           outline=K.STEEL_DARK, width=max(2, int(S(4))))
    r = S(30) if pressed else S(36)
    draw.ellipse((cx - S(40), cy - S(20), cx + S(40), cy + S(60)), fill=K.STEEL_DARK)
    draw.ellipse((cx - r, cy + S(20) - r, cx + r, cy + S(20) + r), fill=K.GOLD if pressed else (255, 210, 120))
    draw.ellipse((cx - S(14), cy - S(70), cx + S(14), cy - S(42)), fill=K.DEV_MID)


def clock(draw, cx, cy, r, t):
    draw.ellipse((cx - r + 6, cy - r + 8, cx + r + 6, cy + r + 8), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=WHITE, outline=K.DEV_DARK, width=max(3, int(r * 0.1)))
    for k in range(12):
        a = k * math.pi / 6
        draw.line((cx + math.cos(a) * r * 0.72, cy + math.sin(a) * r * 0.72, cx + math.cos(a) * r * 0.84,
                   cy + math.sin(a) * r * 0.84), fill=K.DEV_MID, width=max(2, int(r * 0.05)))
    a = t * 6 - math.pi / 2
    draw.line((cx, cy, cx + math.cos(a) * r * 0.66, cy + math.sin(a) * r * 0.66), fill=K.CORAL, width=max(2, int(r * 0.06)))
    draw.line((cx, cy, cx + r * 0.4, cy - r * 0.1), fill=K.DEV_DARK, width=max(3, int(r * 0.09)))
    draw.ellipse((cx - r * 0.08, cy - r * 0.08, cx + r * 0.08, cy + r * 0.08), fill=K.DEV_DARK)


def toy_car(draw, cx, cy, s, t, col=K.ROAD):
    """Toy police car with a flashing light bar. cy = body line; roof ≈ cy-170s, wheels ≈ cy+78s."""
    S = S_(s)
    flip = int(t * 8) % 2 == 0
    draw.ellipse((cx - S(150), cy + S(56), cx + S(150), cy + S(88)), fill=K.SHADOW)
    for k, c in enumerate(((60, 120, 255), K.DANGER)):
        on = (k == 0) == flip
        lx = cx - S(30) + k * S(60)
        if on:
            for a in range(-150, -20, 26):
                ra = math.radians(a)
                draw.line((lx + math.cos(ra) * S(36), cy - S(122) + math.sin(ra) * S(36), lx + math.cos(ra) * S(64),
                           cy - S(122) + math.sin(ra) * S(64)), fill=c, width=max(2, int(S(6))))
    draw.polygon([(cx - S(84), cy - S(26)), (cx - S(52), cy - S(88)), (cx + S(54), cy - S(88)), (cx + S(96), cy - S(26))],
                 fill=col)
    win = (210, 232, 246)
    draw.polygon([(cx - S(70), cy - S(30)), (cx - S(46), cy - S(76)), (cx - S(4), cy - S(76)), (cx - S(4), cy - S(30))],
                 fill=win)
    draw.polygon([(cx + S(8), cy - S(30)), (cx + S(8), cy - S(76)), (cx + S(48), cy - S(76)), (cx + S(80), cy - S(30))],
                 fill=win)
    draw.rounded_rectangle((cx - S(64), cy - S(112), cx + S(64), cy - S(86)), radius=S(10), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(58), cy - S(110), cx - S(4), cy - S(90)), radius=S(8),
                           fill=(60, 120, 255) if flip else (170, 190, 230))
    draw.rounded_rectangle((cx + S(4), cy - S(110), cx + S(58), cy - S(90)), radius=S(8),
                           fill=(230, 180, 180) if flip else K.DANGER)
    draw.rounded_rectangle((cx - S(136), cy - S(32), cx + S(136), cy + S(42)), radius=S(24), fill=col)
    draw.rectangle((cx - S(136) + S(10), cy - S(4), cx + S(136) - S(10), cy + S(12)), fill=WHITE)
    draw.rounded_rectangle((cx + S(108), cy - S(22), cx + S(134), cy - S(6)), radius=S(6), fill=K.GOLD)
    for wx in (cx - S(80), cx + S(80)):
        draw.ellipse((wx - S(32), cy + S(14), wx + S(32), cy + S(78)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(14), cy + S(32), wx + S(14), cy + S(60)), fill=K.STEEL)


def family_car(draw, cx, cy, s, col):
    S = S_(s)
    draw.ellipse((cx - S(140), cy + S(52), cx + S(140), cy + S(84)), fill=K.SHADOW)
    draw.polygon([(cx - S(84), cy - S(26)), (cx - S(52), cy - S(88)), (cx + S(54), cy - S(88)), (cx + S(96), cy - S(26))],
                 fill=col)
    win = (210, 232, 246)
    draw.polygon([(cx - S(70), cy - S(30)), (cx - S(46), cy - S(76)), (cx - S(4), cy - S(76)), (cx - S(4), cy - S(30))],
                 fill=win)
    draw.polygon([(cx + S(8), cy - S(30)), (cx + S(8), cy - S(76)), (cx + S(48), cy - S(76)), (cx + S(80), cy - S(30))],
                 fill=win)
    K.draw_face(draw, cx - S(32), cy - S(46), S(17), "kid", 1.0)
    K.draw_face(draw, cx + S(38), cy - S(46), S(19), "kid", 1.0)
    draw.rounded_rectangle((cx - S(136), cy - S(32), cx + S(136), cy + S(42)), radius=S(24), fill=col)
    draw.rounded_rectangle((cx + S(108), cy - S(16), cx + S(134), cy + S(2)), radius=S(6), fill=K.GOLD)
    for wx in (cx - S(80), cx + S(80)):
        draw.ellipse((wx - S(32), cy + S(14), wx + S(32), cy + S(78)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(14), cy + S(32), wx + S(14), cy + S(60)), fill=K.STEEL)


def shelf(draw, x0, x1, y):
    for bx in (x0 + 50, x1 - 70):
        draw.polygon([(bx, y + 24), (bx + 20, y + 24), (bx + 20, y + 80)], fill=WOOD_DARK)
    draw.rounded_rectangle((x0 + 6, y + 8, x1 + 6, y + 32), radius=8, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y, x1, y + 24), radius=8, fill=WOOD)


def mini_phone(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(10), cy - S(17), cx + S(10), cy + S(17)), radius=S(4), fill=K.DEV_DARK)
    draw.rectangle((cx - S(7), cy - S(12), cx + S(7), cy + S(11)), fill=GLOW)


def partial(pts, frac):
    segs = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    target = sum(segs) * K.clamp01(frac)
    out = [pts[0]]
    acc = 0.0
    for i, sl in enumerate(segs):
        if acc + sl >= target:
            r = (target - acc) / sl if sl else 0.0
            out.append((K.lerp(pts[i][0], pts[i + 1][0], r), K.lerp(pts[i][1], pts[i + 1][1], r)))
            return out
        out.append(pts[i + 1])
        acc += sl
    return out


MAP_V = (0.14, 0.5, 0.86)
MAP_H = (0.16, 0.5, 0.84)


def map_panel(draw, box, t, red=True, phones=False, route=0.0, pulse=0.0, line=(232, 226, 216)):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0

    def P(fx, fy):
        return (x0 + bw * fx, y0 + bh * fy)

    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=30, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=30, fill=MAP_BG, outline=line, width=3)
    draw.ellipse((*P(0.22, 0.22), *P(0.42, 0.42)), fill=PARK)
    draw.ellipse((*P(0.6, 0.6), *P(0.8, 0.76)), fill=PARK)
    K.draw_curve(draw, P(0.02, 0.66), P(0.5, 0.62), P(0.98, 0.7), K.WATER, width=max(6, int(bw * 0.016)))
    rw = max(14, int(bw * 0.034))
    m = 0.03
    for fx in MAP_V:
        draw.line((*P(fx, m), *P(fx, 1 - m)), fill=WHITE, width=rw)
    for fy in MAP_H:
        draw.line((*P(m, fy), *P(1 - m, fy)), fill=WHITE, width=rw)
    tw = max(6, rw // 2)
    for fx in MAP_V:
        draw.line((*P(fx, m), *P(fx, 1 - m)), fill=TRAFFIC_GREEN, width=tw)
    for fy in MAP_H:
        if red and fy == MAP_H[1]:
            draw.line((*P(m, fy), *P(MAP_V[0], fy)), fill=TRAFFIC_GREEN, width=tw)
            draw.line((*P(MAP_V[2], fy), *P(1 - m, fy)), fill=TRAFFIC_GREEN, width=tw)
            continue
        draw.line((*P(m, fy), *P(1 - m, fy)), fill=TRAFFIC_GREEN, width=tw)
    if red:
        draw.line((*P(MAP_V[0], MAP_H[1]), *P(MAP_V[2], MAP_H[1])), fill=TRAFFIC_RED, width=int(tw + 2 + 6 * pulse))
    if phones:
        for k in range(7):
            px, py = P(MAP_V[0] + (MAP_V[2] - MAP_V[0]) * (0.18 + 0.64 * ((k / 7 + t * 0.06) % 1)), MAP_H[1])
            mini_phone(draw, px, py - rw * 1.1, bw / 900)
        for k, (fx0, fy0, fx1, fy1) in enumerate(((MAP_V[0], MAP_H[2], MAP_V[2], MAP_H[2]),
                                                  (MAP_V[1], MAP_H[0], MAP_V[1], MAP_H[2]),
                                                  (MAP_V[0], MAP_H[0], MAP_V[2], MAP_H[0]))):
            for j in range(2):
                f = (j * 0.5 + t * 0.9 + k * 0.2) % 1
                px, py = K.lerp(P(fx0, fy0)[0], P(fx1, fy1)[0], f), K.lerp(P(fx0, fy0)[1], P(fx1, fy1)[1], f)
                off = (0, -rw * 1.1) if fy0 == fy1 else (rw * 1.1, 0)
                mini_phone(draw, px + off[0], py + off[1], bw / 900)
    route_pts = [P(MAP_V[0], MAP_H[2]), P(MAP_V[2], MAP_H[2]), P(MAP_V[2], MAP_H[0])]
    if route > 0:
        draw.line(partial(route_pts, route), fill=ROUTE, width=int(rw * 0.9), joint="curve")
        cx_, cy_ = partial(route_pts, route)[-1]
        r = rw * 1.1
        draw.ellipse((cx_ - r, cy_ - r, cx_ + r, cy_ + r), fill=WHITE, outline=ROUTE, width=4)
        draw.ellipse((cx_ - r * 0.5, cy_ - r * 0.5, cx_ + r * 0.5, cy_ + r * 0.5), fill=ROUTE)
    hx, hy = P(MAP_V[0], MAP_H[2])
    r = rw * 1.2
    draw.ellipse((hx - r, hy - r, hx + r, hy + r), fill=WHITE, outline=K.DEV_DARK, width=3)
    draw.polygon([(hx - r * 0.55, hy), (hx, hy - r * 0.6), (hx + r * 0.55, hy)], fill=K.CORAL)
    draw.rectangle((hx - r * 0.4, hy, hx + r * 0.4, hy + r * 0.5), fill=K.CORAL)
    gx, gy = P(MAP_V[2], MAP_H[0])
    K.draw_map_pin(draw, gx, gy, bw / 900, K.CORAL)
    return P


def cricket_scene(draw, box, t, play=True):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    draw.rectangle((x0, y0, x1, y0 + bh * 0.3), fill=SKY)
    draw.rectangle((x0, y0 + bh * 0.22, x1, y0 + bh * 0.4), fill=(214, 206, 196))
    cols = [K.CORAL, K.GOLD, K.ROAD, (13, 148, 136), K.BOTH_COLOR]
    n = int(bw / 26)
    for i in range(n):
        for r in range(2):
            px = x0 + 14 + i * 26 + (13 if r else 0)
            if px > x1 - 10:
                continue
            py = y0 + bh * 0.26 + r * bh * 0.07
            draw.ellipse((px - 7, py - 7, px + 7, py + 7), fill=cols[(i + r) % 5])
    draw.rectangle((x0, y0 + bh * 0.4, x1, y1), fill=FIELD)
    for k in range(4):
        draw.rectangle((x0 + k * bw / 4, y0 + bh * 0.4, x0 + k * bw / 4 + bw / 8, y1), fill=FIELD_DARK)
    draw.line((x0, y0 + bh * 0.5, x1, y0 + bh * 0.5), fill=WHITE, width=max(3, int(bh * 0.012)))
    fx, fy = x0 + bw * 0.72, y0 + bh * 0.68
    leap = abs(math.sin(t * math.pi * 2)) * bh * 0.06 if play else 0
    s = bh / 420
    K.draw_person(draw, fx, fy - leap, s * 0.9, "dad", t)
    for sx in (-1, 1):
        draw.line((fx + sx * 40 * s, fy - leap + 70 * s, fx + sx * 56 * s, fy - leap - 50 * s), fill=K.SKIN,
                  width=max(3, int(12 * s)))
    p = (t * 1.3) % 1 if play else 1.0
    bx, by = K.qbez((x0 + bw * 0.12, y0 + bh * 0.8), (x0 + bw * 0.4, y0 + bh * 0.05),
                    (fx + 40 * s, fy - leap - 60 * s), p)
    for k in range(1, 4):
        tx, ty = K.qbez((x0 + bw * 0.12, y0 + bh * 0.8), (x0 + bw * 0.4, y0 + bh * 0.05),
                        (fx + 40 * s, fy - leap - 60 * s), max(0.0, p - k * 0.05))
        draw.ellipse((tx - 4, ty - 4, tx + 4, ty + 4), fill=(255, 255, 255))
    draw.ellipse((bx - 10 * s - 4, by - 10 * s - 4, bx + 10 * s + 4, by + 10 * s + 4), fill=(200, 40, 50))


def play_button(draw, cx, cy, r, col=K.DANGER):
    draw.rounded_rectangle((cx - r * 1.3, cy - r, cx + r * 1.3, cy + r), radius=r * 0.4, fill=col)
    draw.polygon([(cx - r * 0.35, cy - r * 0.5), (cx + r * 0.55, cy), (cx - r * 0.35, cy + r * 0.5)], fill=WHITE)


def fridge(draw, x0, y0, x1, y1, t):
    draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=18, fill=(246, 248, 250), outline=K.DEV_MID, width=4)
    ix0, iy0, ix1, iy1 = x0 + 18, y0 + 18, x1 - 18, y0 + (y1 - y0) * 0.62
    draw.rectangle((ix0, iy0, ix1, iy1), fill=(255, 250, 226))
    bx = (ix0 + ix1) / 2
    for k in range(8):
        a = math.radians(20 + k * 20)
        draw.line((bx + math.cos(a) * 30, iy0 + 22 + math.sin(a) * 30, bx + math.cos(a) * 50, iy0 + 22 + math.sin(a) * 50),
                  fill=K.GOLD, width=4)
    draw.ellipse((bx - 18, iy0 + 6, bx + 18, iy0 + 40), fill=K.GOLD)
    for k in range(2):
        sy = iy0 + (iy1 - iy0) * (0.45 + k * 0.3)
        draw.line((ix0, sy, ix1, sy), fill=(210, 214, 222), width=5)
    draw.rounded_rectangle((ix0 + 20, iy0 + (iy1 - iy0) * 0.45 - 70, ix0 + 60, iy0 + (iy1 - iy0) * 0.45), radius=8,
                           fill=WHITE, outline=K.STEEL_DARK, width=2)
    draw.ellipse((ix1 - 80, iy0 + (iy1 - iy0) * 0.75 - 46, ix1 - 26, iy0 + (iy1 - iy0) * 0.75), fill=(255, 150, 60))
    draw.polygon([(x0, y0 + 6), (x0 - 40, y0 + 30), (x0 - 40, y1 - 30), (x0, y1 - 6)], fill=(232, 236, 240),
                 outline=K.DEV_MID)
    draw.line((x0 + 18, iy1 + 14, x1 - 18, iy1 + 14), fill=K.STEEL, width=4)


# ---- scenes ---------------------------------------------------------------------------

def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    bg = K.hex_rgb(brand["bg"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    lav_soft = K.hex_rgb("#EFEAFB")
    blue_soft = K.hex_rgb("#E6EEFB")
    gold_soft = K.hex_rgb("#FFF4DC")
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

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def photo_card(bx, kind, outline=None, ow=3):
        x0, y0, x1, y1 = bx
        draw.rounded_rectangle((x0 + 6, y0 + 8, x1 + 6, y1 + 8), radius=14, fill=K.SHADOW)
        draw.rounded_rectangle(bx, radius=14, fill=panel, outline=outline or line, width=ow)
        thumb(draw, (x0 + 10, y0 + 10, x1 - 10, y1 - 10), kind, t)

    def side_pill(x, y, lab, col, ok):
        bx = K.pill(draw, x, y, lab, col, size=34)
        my = (bx[1] + bx[3]) / 2
        (K.draw_check if ok else K.draw_cross)(draw, bx[2] + 34, my, 22, col)
        return bx

    # ---- opening -------------------------------------------------------------------
    if visual == "b3-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            tara(draw, cx + 280, 470, 0.95, t, mood="happy", talk=True)
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 580)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · RULES VS LEARNING", cx, 326 + lift, font(34, bold=True), sage)
            a = K.stagger(progress, 0, step=0.2, speed=4)
            if a > 0:
                y = int((1 - a) * 30)
                draw.ellipse((600 - 130, 520 - 130 + y, 600 + 130, 520 + 130 + y), fill=coral_soft)
                torch(draw, 560, 520 + y, 0.95, on=True)
                K.text_at(draw, "Fixed rule", 600, 670 + y, font(44, bold=True), coral)
                K.text_at(draw, "same thing every time", 600, 730 + y, font(30, bold=True), muted)
            K.text_at(draw, "vs", cx, 480, font(60, bold=True), muted)
            a = K.stagger(progress, 2, step=0.2, speed=4)
            if a > 0:
                y = int((1 - a) * 30)
                draw.ellipse((1320 - 130, 520 - 130 + y, 1320 + 130, 520 + 130 + y), fill=lav_soft)
                tara(draw, 1320, 510 + y, 0.55, t, mood="happy", ring=True)
                K.text_at(draw, "Learns from examples", 1320, 670 + y, font(44, bold=True), K.BOTH_COLOR)
                K.text_at(draw, "changes after more examples", 1320, 730 + y, font(30, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (220, 240 + lift, w - 220, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Where AI Hides in Daily Life", cx, 360 + lift, font(80, bold=True), ink)
            spots = [("home", "At home", lav_soft), ("phone", "In phones", blue_soft), ("video", "In apps", coral_soft),
                     ("road", "On the road", sage_soft)]
            for i, (kind, lab, soft) in enumerate(spots):
                a = K.stagger(progress, i + 2, step=0.1, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 330
                y = 680 + int((1 - a) * 30)
                draw.ellipse((x - 95, y - 95, x + 95, y + 95), fill=soft)
                if kind == "home":
                    tara(draw, x, y - 4, 0.4, t, mood="happy")
                elif kind == "phone":
                    scr = phone(draw, x, y, 0.27)
                    thumb(draw, (scr[0] + 4, scr[1] + 20, scr[2] - 4, scr[1] + 74), "dog")
                elif kind == "video":
                    play_button(draw, x, y, 44)
                else:
                    K.draw_map_pin(draw, x, y + 56, 0.95, coral)
                K.text_at(draw, lab, x, y + 110, font(32, bold=True), ink)
            return True
        # hunt
        draw.ellipse((540 - 270, 560 - 270, 540 + 270, 560 + 270), fill=gold_soft)
        anaya(draw, 520, 520, 1.5, t, hat=True)
        K.draw_magnifier(draw, 740, 560 + bounce, 0.95, coral)
        K.text_at(draw, "AI HUNT!", 1320, 270 + lift, font(120, bold=True), coral)
        for i, (lab, col) in enumerate((("At home", K.BOTH_COLOR), ("In phones", K.ROAD), ("On the road", sage))):
            a = K.stagger(progress, i + 1, step=0.14, speed=4)
            if a <= 0:
                continue
            K.pill(draw, 1320, 470 + i * 120 + int((1 - a) * 20), lab, col, size=40)
        question_marks([(1000, 330), (1680, 700)])
        return True

    # ---- Anaya and Tara -------------------------------------------------------------
    if visual == "b3-hook":
        if focus == "meet":
            draw.ellipse((470 - 260, 540 - 260, 470 + 260, 540 + 260), fill=blue_soft)
            anaya(draw, 470, 480, 1.6, t)
            K.pill(draw, 470, 770, "Anaya, age 10", coral, size=34)
            bat(draw, 900, 560, 1.0)
            draw.ellipse((960, 640, 1000, 680), fill=(200, 40, 50))
            draw.arc((966, 646, 994, 674), 300, 60, fill=WHITE, width=3)
            K.draw_map_pin(draw, 940, 790, 0.5, K.ROAD)
            K.text_at(draw, "Pune", 1010, 735, font(32, bold=True), K.ROAD)
            K.text_at(draw, "Meet Anaya & Tara!", cx, 228, font(56, bold=True), ink)
            a = K.ease_out_cubic(K.clamp01((progress - 0.45) * 4))
            if a > 0:
                shelf(draw, 1280, 1680, 732)
                tara(draw, 1480, 560 + int((1 - a) * 30), 0.95, t, mood="happy")
                K.pill(draw, 1480, 790, "Tara · voice helper", K.BOTH_COLOR, size=32)
            return True
        if focus == "ask":
            anaya(draw, 400, 520, 1.4, t)
            K.draw_bubble(draw, (540, 250, 1200, 420), brand, "Tara, play my favourite song!", tail="left", size=44)
            shelf(draw, 1300, 1660, 762)
            tara(draw, 1480, 590, 0.95, t, mood="idle", ring=True)
            K.text_at(draw, "Saturday morning", 400, 790, font(34, bold=True), muted)
            return True
        if focus == "plays":
            dance = math.sin(t * math.pi * 6)
            anaya(draw, 470 + 30 * dance, 520 - abs(dance) * 24, 1.4, t)
            shelf(draw, 1220, 1580, 762)
            tara(draw, 1400, 590, 0.95, t, mood="happy", ring=True, talk=True)
            for k, (nx, ny) in enumerate(((800, 380), (980, 560), (1700, 420), (760, 700), (1060, 330))):
                K.draw_notes(draw, nx, ny, 0.9, t + k * 0.3, [coral, K.BOTH_COLOR, sage, K.GOLD, K.ROAD][k])
            K.pill(draw, 1400, 236, "Now playing: Anaya's song", sage, size=32)
            return True
        if focus == "wonder":
            anaya(draw, 420, 520, 1.4, 0)
            question_marks([(300, 260), (560, 290)])
            draw.ellipse((1260 - 270, 570 - 270, 1260 + 270, 570 + 270), fill=lav_soft)
            tara(draw, 1260, 560, 1.0, t, mood="idle")
            K.text_at(draw, "How did Tara understand?", cx, 222, font(50, bold=True), ink)
            side_pill(1200, 790, "No ears like ours!", K.DANGER, False)
            K.draw_stopwatch(draw, 790, 640, 56, progress, brand)
            return True
        if focus == "guess":
            specs = [(330, "1 · Learn", sage, "from millions of voices"), (960, "2 · Listen", K.BOTH_COLOR, "to the sounds"),
                     (1580, "3 · Guess", coral, "the words, then answer")]
            for i, (x, title, col, sub) in enumerate(specs):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                yy = int((1 - a) * 30)
                K.pill(draw, x, 250 + yy, title, col, size=38)
                if i == 0:
                    whos = ["kid", "nani", "kid", "kid", "kid", "nani", "kid", "kid", "kid"]
                    for k in range(9):
                        r_, c_ = divmod(k, 3)
                        fx, fy = x - 120 + c_ * 120, 410 + r_ * 115 + yy
                        draw.ellipse((fx - 50, fy - 50, fx + 50, fy + 50), fill=[sage_soft, gold_soft, lav_soft][k % 3])
                        K.draw_face(draw, fx, fy, 30, whos[k], 1.0)
                        draw.arc((fx + 24, fy - 26, fx + 54, fy + 20), -50, 50, fill=WAVE, width=4)
                elif i == 1:
                    K.sound_waves(draw, x - 230, 510 + yy, 1.0, coral, t, "right")
                    tara(draw, x + 30, 520 + yy, 0.78, t, mood="idle", ring=True)
                else:
                    K.draw_bubble(draw, (x - 210, 380 + yy, x + 210, 600 + yy), brand, "\"play my favourite song\"",
                                  tail="left", size=36)
                    if progress > 0.75:
                        K.draw_check(draw, x + 190, 380 + yy, 30, sage)
                K.text_at(draw, sub, x, 760 + yy, font(34, bold=True), muted)
                if i < 2 and K.stagger(progress, i + 1, step=0.22, speed=4) > 0:
                    K.draw_arrow(draw, x + 200, 540, x + 300, 540, muted, width=10, head=28)
            return True
        # notalive
        draw.ellipse((480 - 280, 580 - 280, 480 + 280, 580 + 280), fill=blue_soft)
        tara(draw, 480, 600, 1.25, t, mood="happy")
        K.pill(draw, 480, 250, "Just lights!", coral, size=38)
        K.draw_dashed(draw, 480, 312, 480, 400, coral, width=5, phase=t * 100)
        rows = [("Not alive", K.DANGER, K.DANGER_SOFT, False), ("Not magic", K.DANGER, K.DANGER_SOFT, False),
                ("A clever guesser, made by people", sage, sage_soft, True)]
        for i, (lab, col, soft, ok) in enumerate(rows):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 290 + i * 180 + int((1 - a) * 30)
            draw.rounded_rectangle((900 + 8, y + 10, 1780 + 8, y + 150), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((900, y, 1780, y + 140), radius=40, fill=soft, outline=col, width=5)
            (K.draw_check if ok else K.draw_cross)(draw, 976, y + 70, 36, col)
            draw.text((1040, y + 46), lab, fill=ink, font=font(44 if not ok else 38, bold=True))
        return True

    # ---- definition -------------------------------------------------------------
    if visual == "b3-define":
        if focus == "name":
            draw.ellipse((400 - 250, 570 - 250, 400 + 250, 570 + 250), fill=lav_soft)
            tara(draw, 400, 560, 0.95, t, mood="happy")
            K.shadow_card(draw, (740, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "An AI HELPER is…", 1260, 320 + lift, font(44, bold=True), muted)
            parts = [("a gadget or an app", ink), ("that guesses or suggests", coral), ("using patterns it learned", K.BOTH_COLOR),
                     ("from lots of examples", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1260, 410 + i * 100 + lift + int((1 - a) * 30), font(56, bold=True), col)
            return True
        # clue
        K.draw_magnifier(draw, cx - 250, 252, 0.3, coral)
        K.pill(draw, cx + 20, 224, "DETECTIVE CLUE", coral, size=34)
        cards = [((170, 320, 910, 860), sage, sage_soft, "Guessing or suggesting?", "Probably AI!"),
                 ((1010, 320, 1750, 860), muted, (244, 240, 233), "Same thing every time?", "Simple program")]
        for k, (bx, col, soft, title, verdict) in enumerate(cards):
            a = K.stagger(progress, k * 2, step=0.18, speed=4)
            if a <= 0:
                continue
            yy = int((1 - a) * 40)
            x0, y0, x1, y1 = bx[0], bx[1] + yy, bx[2], bx[3] + yy
            draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x1, y1), radius=40, fill=soft, outline=col, width=5)
            mx = (x0 + x1) / 2
            K.text_at(draw, title, mx, y0 + 36, font(46, bold=True), col)
            if k == 0:
                tara(draw, mx - 160, y0 + 260, 0.55, t, mood="happy", talk=True)
                scr = phone(draw, mx + 190, y0 + 250, 0.48)
                K.text_at(draw, "For you", (scr[0] + scr[2]) / 2, scr[1] + 10, font(26, bold=True), coral)
                for j, kind in enumerate(("cricket", "bat", "trophy")):
                    ty = scr[1] + 50 + j * 72
                    thumb(draw, (scr[0] + 10, ty, scr[2] - 10, ty + 62), kind)
            else:
                torch(draw, mx - 220, y0 + 250, 0.9, on=True)
                doorbell(draw, mx + 200, y0 + 250, 0.95, pressed=int(t * 4) % 2 == 0)
            K.pill(draw, mx, y1 - 110, verdict, col, size=40)
        return True

    # ---- photo search -------------------------------------------------------------
    if visual == "b3-photos":
        if focus == "ask":
            K.draw_person(draw, 360, 500, 1.3, "nani", t)
            K.draw_bubble(draw, (500, 240, 1140, 410), brand, "Anaya, find the photos of Laddoo!", tail="left", size=42)
            anaya(draw, 980, 580, 1.15, t)
            phone(draw, 1080, 680, 0.3)
            draw.rounded_rectangle((1340 + 8, 300 + 10, 1720 + 8, 660 + 10), radius=12, fill=K.SHADOW)
            draw.rounded_rectangle((1340, 300, 1720, 660), radius=12, fill=WOOD, outline=WOOD_DARK, width=6)
            thumb(draw, (1370, 330, 1690, 630), "dog")
            K.pill(draw, 1530, 700, "Laddoo", FUR_DARK, size=36)
            return True
        if focus == "learned":
            for k in range(12):
                a = K.stagger(progress, k, step=0.025, speed=8)
                if a <= 0:
                    continue
                r_, c_ = divmod(k, 4)
                x0, y0 = 130 + c_ * 134, 290 + r_ * 134 + int((1 - a) * 20)
                draw.rounded_rectangle((x0, y0, x0 + 120, y0 + 120), radius=10, fill=panel, outline=line, width=2)
                thumb(draw, (x0 + 6, y0 + 6, x0 + 114, y0 + 114), f"dog{k}", t)
            K.text_at(draw, "Many, many dog pictures", 390, 710, font(34, bold=True), muted)
            K.draw_arrow(draw, 690, 500, 820, 500, coral, width=12, head=34)
            pts = dog_side(draw, 1220, 590, 1.5, t)
            callouts = [("Waggy tail", "tail", 960, 280), ("Floppy ears", "ear", 1330, 280), ("Wet nose", "nose", 1640, 640)]
            for i, (lab, key, px, py) in enumerate(callouts):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                fx, fy = pts[key]
                draw.ellipse((fx - 44, fy - 44, fx + 44, fy + 44), outline=K.GOLD, width=6)
                bx = K.pill(draw, px, py, lab, K.BOTH_COLOR, size=32)
                ty = bx[3] if py < fy else bx[1]
                K.draw_dashed(draw, px, ty, fx, fy - 44 if py < fy else fy + 44, K.BOTH_COLOR, width=4, phase=t * 80)
            if progress > 0.75:
                K.pill(draw, 1220, 790, "Pattern learned!", sage, size=38)
            return True
        scr = phone(draw, 600, 560, 1.0)
        sx0, sy0, sx1, sy1 = scr
        if focus == "search":
            typed = K.clamp01(progress * 2.2)
            filtered = progress > 0.62
        else:
            typed, filtered = 1.0, True
        bar_b = search_bar(draw, scr, "dog", typed, t, ink, coral)
        mixed = ["beach", "dog", "cake", "dog1", "flower", "kite"]
        dogs = ["dog", "dog1", "dog2", "dog3", "dog4", "dog5"]
        kinds = dogs if filtered else mixed
        cw = (sx1 - sx0 - 36) / 2
        for i, kind in enumerate(kinds):
            r_, c_ = divmod(i, 2)
            x0 = sx0 + 12 + c_ * (cw + 12)
            y0 = bar_b + 18 + r_ * (cw + 12)
            thumb(draw, (x0, y0, x0 + cw, y0 + cw), kind, t)
        if focus == "search":
            if not filtered:
                for k, kind in enumerate(("beach", "cake", "dog", "kite", "flower")):
                    x0, y0 = 1060 + k * 70, 330 + k * 40
                    photo_card((x0, y0, x0 + 300, y0 + 230), kind)
                K.text_at(draw, "Thousands of photos!", 1360, 760, font(46, bold=True), muted)
            else:
                for k, kind in enumerate(("dog", "dog2", "dog3")):
                    x0 = 980 + k * 270
                    a = K.stagger(progress - 0.62, k, step=0.06, speed=8)
                    if a <= 0:
                        continue
                    photo_card((x0, 360 + int((1 - a) * 30), x0 + 240, 600 + int((1 - a) * 30)), kind, sage, 6)
                    K.draw_check(draw, x0 + 220, 370, 24, sage)
                K.pill(draw, 1360, 690, "Only the dog photos!", sage, size=42)
                star_spots([(1000, 280), (1720, 300)])
            return True
        if focus == "how":
            K.text_at(draw, "Nobody wrote \"dog\" on them!", 1340, 236, font(46, bold=True), ink)
            for k, kind in enumerate(("dog", "dog3", "dog4")):
                x0 = 950 + k * 280
                photo_card((x0, 320, x0 + 240, 560), kind)
                tb = (x0 + 30, 590, x0 + 210, 660)
                draw.rounded_rectangle(tb, radius=20, fill=panel)
                dashed_box(tb, muted, width=4)
                K.text_at(draw, "?", x0 + 120, 594, font(52, bold=True), coral)
            K.text_at(draw, "How did it know?", 1280, 730, font(50, bold=True), coral)
            K.draw_stopwatch(draw, 1700, 760, 46, progress, brand)
            return True
        return False

    # ---- photo filter ---------------------------------------------------------------
    if visual == "b3-filter":
        if focus == "ears":
            scr = phone(draw, 680, 560, 1.0, screen=CAM_BG)
            sx0, sy0, sx1, sy1 = scr
            draw.rectangle((sx0 + 30, sy0 + 40, sx0 + 130, sy0 + 170), fill=SKY, outline=WOOD, width=6)
            sway = math.sin(t * math.pi * 4)
            fx, fy = (sx0 + sx1) / 2 + 22 * sway, 610
            draw.chord((fx - 106, fy + 74, fx + 106, fy + 330), 180, 360, fill=K.CORAL)
            cam_face(draw, fx, fy, 76)
            bunny_ears(draw, fx, fy - 82, 0.9, sway)
            for sx in (-1, 1):
                for k in (-1, 1):
                    draw.line((fx + sx * 14, fy + 14 + k * 6, fx + sx * 58, fy + 10 + k * 14), fill=K.DEV_MID, width=3)
            draw.ellipse((fx - 12, fy + 6, fx + 12, fy + 24), fill=BUNNY_PINK)
            draw.ellipse(((sx0 + sx1) / 2 - 34, sy1 - 82, (sx0 + sx1) / 2 + 34, sy1 - 14), fill=WHITE,
                         outline=K.DEV_MID, width=5)
            K.text_at(draw, "Bunny ears!", 1330, 300 + lift, font(96, bold=True), coral)
            K.text_at(draw, "They sit on her head…", 1330, 450, font(44, bold=True), ink)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.text_at(draw, "…and move with her!", 1330, 530 + int((1 - a) * 20), font(44, bold=True), sage)
                K.draw_arrow(draw, 1270, 660, 1090, 660, muted, width=12, head=32)
                K.draw_arrow(draw, 1390, 660, 1570, 660, muted, width=12, head=32)
            star_spots([(1000, 330), (1700, 380)])
            return True
        # face pattern
        draw.rounded_rectangle((180 + 10, 250 + 12, 900 + 10, 860 + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((180, 250, 900, 860), radius=36, fill=CAM_BG, outline=K.DEV_DARK, width=10)
        fx, fy, r = 540, 600, 120
        draw.chord((fx - 170, fy + 110, fx + 170, fy + 390), 180, 360, fill=K.CORAL)
        cam_face(draw, fx, fy, r)
        dashed_box((fx - 190, fy - 170, fx + 190, fy + 150), K.GOLD, width=6)
        scan = fy - 160 + 300 * ((t * 1.6) % 1)
        draw.line((fx - 180, scan, fx + 180, scan), fill=GLOW, width=6)
        pts = [(fx - r * 0.38, fy - r * 0.05), (fx + r * 0.38, fy - r * 0.05), (fx, fy + r * 0.18), (fx, fy + r * 0.45)]
        n = int(K.clamp01(progress * 1.6) * 4.99)
        if n >= 4:
            draw.line([pts[0], pts[1], pts[3], pts[0]], fill=K.GOLD, width=4)
        for k in range(min(n, 4)):
            px, py = pts[k]
            draw.ellipse((px - 12, py - 12, px + 12, py + 12), fill=K.GOLD, outline=WHITE, width=3)
        if progress > 0.72:
            bunny_ears(draw, fx, fy - 132, 1.2, 0)
        K.shadow_card(draw, (1000, 250, 1780, 860), brand, radius=36, accent=coral)
        K.text_at(draw, "A face pattern", 1390, 270, font(46, bold=True), panel)
        feats = [("2 eyes", "eyes"), ("1 nose", "nose"), ("1 mouth", "mouth")]
        for i, (lab, kind) in enumerate(feats):
            a = K.stagger(progress, i, step=0.16, speed=5)
            if a <= 0:
                continue
            y = 380 + i * 120 + int((1 - a) * 20)
            ix = 1110
            draw.ellipse((ix - 44, y - 4, ix + 44, y + 84), fill=coral_soft)
            if kind == "eyes":
                for sx in (-1, 1):
                    draw.ellipse((ix + sx * 18 - 11, y + 29, ix + sx * 18 + 11, y + 51), fill=ink)
            elif kind == "nose":
                draw.polygon([(ix, y + 18), (ix - 14, y + 58), (ix + 14, y + 58)], fill=(214, 150, 120))
            else:
                draw.arc((ix - 26, y + 14, ix + 26, y + 60), 20, 160, fill=(190, 70, 60), width=7)
            draw.text((1180, y + 18), lab, fill=ink, font=font(46, bold=True))
            K.draw_check(draw, 1700, y + 40, 24, sage)
        if progress > 0.72:
            K.pill(draw, 1390, 760, "Found it! Ears go here", sage, size=34)
        return True

    # ---- recommendations ------------------------------------------------------------
    if visual == "b3-videos":
        if focus == "watch":
            scr = tablet(draw, 1080, 530, 1.15)
            cricket_scene(draw, scr, t)
            x0, y0, x1, y1 = scr
            draw.rectangle((x0, y1 - 22, x1, y1), fill=(40, 40, 48))
            draw.rectangle((x0, y1 - 22, x0 + (x1 - x0) * (0.3 + 0.5 * progress), y1), fill=K.DANGER)
            anaya(draw, 300, 560, 1.15, t)
            K.pill(draw, 1080, 790, "What a catch!", coral, size=38)
            return True
        if focus == "suggest":
            K.shadow_card(draw, (300, 236, 1620, 860), brand, radius=36)
            vb = (340, 272, 840, 552)
            cricket_scene(draw, vb, 0.4, play=False)
            draw.rectangle(vb, outline=K.DEV_DARK, width=4)
            draw.ellipse((590 - 54, 412 - 54, 590 + 54, 412 + 54), fill=(30, 36, 48))
            draw.arc((590 - 28, 412 - 28, 590 + 28, 412 + 28), 60, 360, fill=WHITE, width=8)
            draw.polygon([(590 + 14, 412 - 34), (590 + 34, 412 - 14), (590 + 6, 412 - 8)], fill=WHITE)
            draw.text((890, 300), "Super catch on the boundary!", fill=ink, font=font(40, bold=True))
            draw.text((890, 360), "Cricket · 2 min", fill=muted, font=font(30, bold=True))
            K.text_at(draw, "You might like", 520, 588, font(44, bold=True), coral)
            for k, (kind, lab) in enumerate((("cricket", "Top 10 catches"), ("bat", "Batting tips"), ("trophy", "Cup final"))):
                a = K.stagger(progress, k + 1, step=0.14, speed=5)
                if a <= 0:
                    continue
                x0 = 340 + k * 425
                y0 = 660 + int((1 - a) * 30)
                draw.rounded_rectangle((x0, y0, x0 + 390, y0 + 170), radius=14, fill=panel, outline=coral, width=4)
                thumb(draw, (x0 + 6, y0 + 6, x0 + 384, y0 + 120), kind, t)
                draw.text((x0 + 18, y0 + 124), lab, fill=ink, font=font(30, bold=True))
            return True
        # pattern
        K.text_at(draw, "RECOMMENDATION", cx, 226, font(70, bold=True), coral)
        K.shadow_card(draw, (160, 340, 640, 860), brand, radius=30)
        K.text_at(draw, "Anaya watched", 400, 362, font(36, bold=True), muted)
        for k, (kind, lab) in enumerate((("cricket", "Super catch"), ("bat", "Big sixes"), ("trophy", "Cup final"),
                                         ("cricket", "Fast bowling"))):
            a = K.stagger(progress, k, step=0.08, speed=6)
            if a <= 0:
                continue
            y = 420 + k * 104
            thumb(draw, (190, y, 330, y + 86), kind, t)
            draw.text((350, y + 24), lab, fill=ink, font=font(32, bold=True))
        a = K.stagger(progress, 4, step=0.1, speed=4)
        if a > 0:
            K.draw_arrow(draw, 670, 600, 760, 600, muted, width=10, head=28)
            draw.ellipse((cx - 170, 600 - 170, cx + 170, 600 + 170), fill=gold_soft)
            for k in range(5):
                ang = t * 2 + k * 2 * math.pi / 5
                bx_, by_ = cx + math.cos(ang) * 90, 570 + math.sin(ang) * 70
                draw.ellipse((bx_ - 24, by_ - 24, bx_ + 24, by_ + 24), fill=(200, 40, 50))
                draw.arc((bx_ - 14, by_ - 14, bx_ + 14, by_ + 14), 300, 60, fill=WHITE, width=3)
            K.text_at(draw, "Pattern:", cx, 680, font(34, bold=True), muted)
            K.text_at(draw, "lots of cricket!", cx, 722, font(38, bold=True), ink)
        a = K.stagger(progress, 6, step=0.1, speed=4)
        if a > 0:
            K.draw_arrow(draw, 1160, 600, 1250, 600, muted, width=10, head=28)
            yy = int((1 - a) * 30)
            draw.rounded_rectangle((1280, 340 + yy, 1760, 860 + yy), radius=30, fill=sage_soft, outline=sage, width=5)
            K.text_at(draw, "You might like…", 1520, 366 + yy, font(38, bold=True), sage)
            for k, kind in enumerate(("cricket", "trophy")):
                y = 440 + k * 200 + yy
                thumb(draw, (1330, y, 1710, y + 170), kind, t)
            K.draw_check(draw, 1720, 350 + yy, 28, sage)
        return True

    # ---- map traffic ------------------------------------------------------------------
    if visual == "b3-maps":
        if focus == "drive":
            draw.rectangle((120, 740, 1200, 860), fill=ASPHALT)
            K.draw_dashed(draw, 120, 800, 1200, 800, WHITE, width=8, dash=50, gap=40, phase=t * 600)
            for k, tx in enumerate((220, 520, 820, 1100)):
                draw.rectangle((tx - 10, 620, tx + 10, 740), fill=WOOD_DARK)
                draw.ellipse((tx - 60, 520, tx + 60, 650), fill=[K.LEAF, (96, 176, 110)][k % 2])
            family_car(draw, K.lerp(420, 700, progress), 720, 1.15, coral)
            scr = phone(draw, 1460, 490, 0.9)
            map_panel(draw, scr, t, red=True, line=K.DEV_DARK)
            K.pill(draw, 1460, 806, "Papa's map app", K.ROAD, size=30)
            return True
        mb = (240, 240, 1240, 860)
        rp = 0.0
        if focus == "faster":
            rp = K.clamp01(progress * 1.3)
        P = map_panel(draw, mb, t, red=True, phones=focus == "slow", route=rp, pulse=pulse)
        if focus == "red":
            qx, qy = P(0.5, 0.5)
            K.text_at(draw, "?", qx, qy - 140, font(int(110 + 20 * pulse), bold=True), K.GOLD)
            K.text_at(draw, "What does", 1530, 290, font(56, bold=True), ink)
            K.text_at(draw, "RED mean?", 1530, 360, font(70, bold=True), TRAFFIC_RED)
            draw.rounded_rectangle((1330, 500, 1730, 600), radius=50, fill=K.DANGER_SOFT, outline=K.DANGER, width=3)
            draw.text((1370, 528), "Painted red?", fill=ink, font=font(38, bold=True))
            K.draw_cross(draw, 1690, 550, 22, K.DANGER)
            K.draw_stopwatch(draw, 1530, 740, 56, progress, brand)
            return True
        if focus == "slow":
            specs = [(TRAFFIC_RED, "Slow traffic", "snail"), (TRAFFIC_GREEN, "Moving well", "car")]
            for i, (col, lab, kind) in enumerate(specs):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 260 + i * 170 + int((1 - a) * 20)
                draw.rounded_rectangle((1300, y, 1790, y + 140), radius=30, fill=panel, outline=col, width=5)
                draw.rounded_rectangle((1330, y + 60, 1400, y + 80), radius=10, fill=col)
                draw.text((1420, y + 48), lab, fill=ink, font=font(36, bold=True))
                if kind == "snail":
                    K.draw_snail(draw, 1730, y + 76, 0.45, brand)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                y = 620 + int((1 - a) * 20)
                draw.rounded_rectangle((1300, y, 1790, y + 220), radius=30, fill=blue_soft, outline=K.ROAD, width=4)
                for k in range(5):
                    mini_phone(draw, 1370 + k * 70, y + 66, 1.6)
                K.text_at(draw, "Learned from", 1545, y + 120, font(34, bold=True), ink)
                K.text_at(draw, "many phones moving", 1545, y + 162, font(34, bold=True), ink)
            return True
        # faster
        K.pill(draw, 1520, 300, "Faster road!", ROUTE, size=44)
        if progress > 0.5:
            K.draw_check(draw, 1520, 440, 50, sage)
        K.text_at(draw, "Guessing +", 1520, 540, font(44, bold=True), ink)
        K.text_at(draw, "suggesting", 1520, 600, font(44, bold=True), ink)
        K.pill(draw, 1520, 690, "That's AI!", sage, size=44)
        return True

    # ---- not AI -------------------------------------------------------------------
    if visual == "b3-notai":
        if focus == "toy":
            K.draw_person(draw, 380, 520, 1.15, "friend", t)
            K.pill(draw, 380, 790, "Kabir, age 6", K.GOLD, size=34)
            draw.rounded_rectangle((760, 760, 1700, 850), radius=40, fill=coral_soft)
            toy_car(draw, 1200, 680, 1.5, t)
            if int(t * 6) % 2 == 0:
                K.text_at(draw, "BEEP!", 1540, 360, font(56, bold=True), coral)
            else:
                K.text_at(draw, "BEEP!", 860, 380, font(56, bold=True), coral)
            return True
        if focus == "ask":
            draw.ellipse((cx - 330, 600 - 280, cx + 330, 600 + 280), fill=lav_soft)
            toy_car(draw, cx, 660, 1.7, t)
            K.pill(draw, cx, 230, "Looks clever… but is it AI?", K.BOTH_COLOR, size=36)
            question_marks([(cx - 520, 420), (cx + 520, 440)])
            K.draw_stopwatch(draw, cx + 560, 760, 50, progress, brand)
            return True
        if focus == "answer":
            draw.ellipse((440 - 250, 580 - 250, 440 + 250, 580 + 250), fill=K.DANGER_SOFT)
            toy_car(draw, 440, 620, 1.15, t)
            bx = K.pill(draw, 410, 790, "NOT AI", K.DANGER, size=44)
            K.draw_cross(draw, bx[2] + 40, (bx[1] + bx[3]) / 2, 30, K.DANGER)
            K.shadow_card(draw, (800, 250, 1780, 860), brand, radius=36)
            K.text_at(draw, "Same lights, every time", 1290, 280, font(46, bold=True), ink)
            for k, lab in enumerate(("Day 1", "Day 2", "Day 100")):
                a = K.stagger(progress, k, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = 970 + k * 320
                y = 370 + int((1 - a) * 20)
                draw.rounded_rectangle((x - 140, y, x + 140, y + 240), radius=24, fill=(246, 243, 238))
                toy_car(draw, x, y + 150, 0.62, 0.0)
                K.text_at(draw, lab, x, y + 252, font(32, bold=True), muted)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                draw.rounded_rectangle((850, 700, 1730, 820), radius=30, fill=lav_soft, outline=K.BOTH_COLOR, width=4)
                K.text_at(draw, "Fixed rule: switch on → blink & beep", 1290, 738, font(36, bold=True), K.BOTH_COLOR)
            return True
        # doorbell
        draw.rectangle((180, 260, 560, 860), fill=WOOD_DARK)
        draw.rectangle((210, 290, 530, 860), fill=WOOD)
        for yy in (330, 590):
            draw.rounded_rectangle((250, yy, 490, yy + 220), radius=10, outline=WOOD_DARK, width=5)
        draw.ellipse((480, 560, 510, 590), fill=K.GOLD)
        pressed = int(t * 4) % 2 == 0
        doorbell(draw, 760, 560, 1.1, pressed=pressed)
        if pressed:
            K.text_at(draw, "Ding dong!", 760, 380, font(44, bold=True), K.GOLD)
            K.sound_waves(draw, 820, 560, 1.0, K.GOLD, t, "right")
        K.text_at(draw, "Press → ring. Always.", 770, 720, font(32, bold=True), muted)
        for i, lab in enumerate(("Shiny?", "Noisy?", "Lots of lights?")):
            a = K.stagger(progress, i, step=0.12, speed=5)
            if a <= 0:
                continue
            y = 280 + i * 110 + int((1 - a) * 20)
            draw.rounded_rectangle((1000, y, 1560, y + 86), radius=43, fill=K.DANGER_SOFT, outline=K.DANGER, width=3)
            draw.text((1040, y + 20), lab, fill=ink, font=font(40, bold=True))
            K.draw_cross(draw, 1514, y + 43, 24, K.DANGER)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            y = 640 + int((1 - a) * 20)
            draw.rounded_rectangle((940, y, 1780, y + 190), radius=40, fill=sage_soft, outline=sage, width=5)
            K.draw_check(draw, 1020, y + 95, 40, sage)
            draw.text((1090, y + 34), "Learns from examples?", fill=ink, font=font(42, bold=True))
            draw.text((1090, y + 104), "That's the sign of AI!", fill=sage, font=font(38, bold=True))
        return True

    # ---- kitchen hunt -----------------------------------------------------------------
    if visual == "b3-hunt":
        ans = focus == "answer"
        draw.rounded_rectangle((140, 290, 1780, 860), radius=30, fill=WALL)
        draw.rectangle((140, 660, 1780, 690), fill=WOOD)
        draw.rectangle((140, 690, 1780, 860), fill=CABINET)
        for k in range(6):
            x = 560 + k * 205
            draw.rounded_rectangle((x, 706, x + 185, 846), radius=10, outline=WOOD_DARK, width=4)
            draw.ellipse((x + 150, 770, x + 166, 786), fill=WOOD_DARK)
        draw.rounded_rectangle((1530, 330, 1740, 560), radius=10, fill=SKY, outline=WOOD, width=10)
        draw.line((1635, 330, 1635, 560), fill=WOOD, width=8)
        fridge(draw, 210, 320, 470, 860, t)
        torch(draw, 660, 618, 0.62, on=True)
        clock(draw, 1010, 400, 72, t)
        tara(draw, 1330, 572, 0.48, t, mood="happy" if ans else "idle", ring=ans)
        items = [((340, 760), "Fridge light", False), ((700, 560 - 60), "Torch", False),
                 ((1010, 500), "Clock", False), ((1330, 380), "Voice speaker", True)]
        for k, ((x, y), lab, is_ai) in enumerate(items):
            if ans:
                col = sage if is_ai else muted
                bx = K.pill(draw, x, y, lab, col, size=30)
                my = (bx[1] + bx[3]) / 2
                (K.draw_check if is_ai else K.draw_cross)(draw, bx[2] + 26, my, 18, col)
            else:
                K.pill(draw, x, y, lab, K.BOTH_COLOR, size=30)
        if ans:
            draw.ellipse((1330 - 120, 560 - 120, 1330 + 120, 560 + 120), outline=sage, width=8)
            K.pill(draw, cx, 222, "Voice speaker = AI · the rest: fixed rules", sage, size=32)
        else:
            K.pill(draw, cx - 40, 222, "Which one uses AI?", K.BOTH_COLOR, size=34)
            K.draw_stopwatch(draw, cx + 230, 248, 30, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "b3-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Be an AI detective!", cx, 450 + lift, font(60, bold=True), ink)
            K.draw_magnifier(draw, cx - 20, 610 + lift, 0.7, coral)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1080, 870), radius=24, fill=(255, 250, 238))
        label_lines(("Name one AI helper", "and what it tries to do"), 605, 262, size=44, col=coral)
        rows = [("Voice assistant", "understands you, then answers", "tara"),
                ("Map app", "shows which roads are slow", "map")]
        for i, (title, sub, kind) in enumerate(rows):
            y = 440 + i * 200
            draw.line((180, y + 160, 1030, y + 160), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3 - 0.2 > i
            if shown:
                draw.ellipse((180, y + 10, 300, y + 130), fill=lav_soft if kind == "tara" else sage_soft)
                if kind == "tara":
                    tara(draw, 240, y + 74, 0.3, t, mood="happy")
                else:
                    K.draw_map_pin(draw, 240, y + 120, 0.75, coral)
                draw.text((330, y + 20), title, fill=ink, font=font(44, bold=True))
                draw.text((330, y + 80), sub, fill=muted, font=font(36, bold=True))
        if not ans:
            K.text_at(draw, "?", 605, 618, font(150, bold=True), line)
        if ans:
            draw.ellipse((1430 - 250, 560 - 250, 1430 + 250, 560 + 250), fill=lav_soft)
            tara(draw, 1330, 540, 0.62, t, mood="happy", talk=True)
            scr = phone(draw, 1600, 590, 0.55)
            map_panel(draw, scr, t, red=True, line=K.DEV_DARK)
            if progress > 0.85:
                star_spots([(1200, 300), (1700, 280)])
        else:
            K.draw_magnifier(draw, 1400, 500, 1.4, coral)
            K.text_at(draw, "?", 1400, 432, font(110, bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1450, 790, 46, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b3-recap":
        recap = [(("Voice · Photos ·", "Videos · Maps"), K.BOTH_COLOR, "helpers"),
                 (("Guess or suggest", "from patterns"), coral, "guess"),
                 (("Blinking toy:", "NOT AI"), K.DANGER, "toy"),
                 (("Does it learn", "from examples?"), sage, "ask")]
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
                if kind == "helpers":
                    tara(draw, ix - 80, iy - 70, 0.34, t, mood="happy")
                    thumb(draw, (ix + 20, iy - 130, ix + 150, iy - 20), "dog")
                    play_button(draw, ix - 80, iy + 90, 34)
                    K.draw_map_pin(draw, ix + 85, iy + 130, 0.8, coral)
                elif kind == "guess":
                    K.draw_bubble(draw, (ix - 140, iy - 140, ix + 140, iy + 20), brand, "Maybe…?", tail="left", size=40)
                    for k in range(4):
                        draw.ellipse((ix - 90 + k * 60 - 14, iy + 90 - 14, ix - 90 + k * 60 + 14, iy + 90 + 14),
                                     fill=[coral, K.GOLD, coral, K.GOLD][k])
                elif kind == "toy":
                    toy_car(draw, ix, iy + 40, 0.75, t)
                    K.draw_cross(draw, ix + 110, iy - 110, 34, K.DANGER)
                else:
                    for k, kd in enumerate(("dog", "dog2", "dog4")):
                        x = ix - 120 + k * 40
                        draw.rectangle((x, iy - 110 + k * 20, x + 150, iy + 10 + k * 20), fill=panel, outline=line, width=3)
                        thumb(draw, (x + 6, iy - 104 + k * 20, x + 144, iy + 4 + k * 20), kd)
                    K.draw_magnifier(draw, ix + 50, iy + 40, 0.6, sage)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            tara(draw, cx + 300, 450, 0.75, t, mood="happy", talk=True)
            K.text_at(draw, "Chapter 3 done!", cx, 680, font(68, bold=True), ink)
            K.pill(draw, cx, 780, "AI detective!", coral, size=36)
            stars_around(320, 580, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
