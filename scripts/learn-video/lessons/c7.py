"""C7 · AND, OR, NOT for Kids — visuals."""
import math

import build as K

CHOC = (120, 72, 44)
CHOC_DARK = (88, 50, 30)
FROST = (246, 170, 190)
CREAM = (255, 240, 214)
ORANGE = (255, 150, 30)
ORANGE_DARK = (214, 100, 10)
RED = (226, 62, 70)
RED_DARK = (176, 40, 50)
BLUE = (60, 120, 220)
BLUE_DARK = (40, 84, 170)
PINK = (238, 104, 158)
YELLOW = (255, 206, 84)
YELLOW_DARK = (226, 150, 16)
WOOD = (214, 170, 120)
WOOD_DARK = (150, 104, 66)
MUD = (130, 88, 52)
GLOW = (255, 230, 160)
ROCK = (150, 140, 128)
ROCK_DARK = (110, 102, 94)
GRASS = (200, 228, 176)
WIRE_OFF = (196, 200, 208)


def S_(s):
    return lambda v: v * s


# ---------------------------------------------------------------------------
# characters
# ---------------------------------------------------------------------------

def kid(draw, cx, cy, s, body, t=0.0, bun=True, hat=None):
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
    if hat == "party":
        draw.polygon([(cx - r * 0.55, cy - r * 0.78), (cx + r * 0.55, cy - r * 0.78), (cx + r * 0.1, cy - r * 2.0)],
                     fill=K.CORAL)
        for k in range(2):
            f = 0.35 + k * 0.3
            y = cy - r * 0.78 - (r * 1.22) * f
            hw = r * 0.55 * (1 - f)
            draw.line((cx - hw + r * 0.1 * f, y, cx + hw + r * 0.1 * f, y), fill=K.GOLD, width=max(2, int(r * 0.12)))
        draw.ellipse((cx + r * 0.1 - r * 0.16, cy - r * 2.14, cx + r * 0.1 + r * 0.16, cy - r * 1.84), fill=K.GOLD)
    elif hat == "explorer":
        draw.ellipse((cx - r * 1.35, cy - r * 0.95, cx + r * 1.35, cy - r * 0.6), fill=(150, 112, 64))
        draw.chord((cx - r * 0.85, cy - r * 1.75, cx + r * 0.85, cy - r * 0.3), 180, 360, fill=(190, 150, 90))
        draw.rectangle((cx - r * 0.85, cy - r * 1.08, cx + r * 0.85, cy - r * 0.92), fill=(120, 84, 44))


def penguin(draw, cx, cy, s, t=0.0):
    S = S_(s)
    y = cy + S(4) * math.sin(t * 12)
    draw.ellipse((cx - S(70), y + S(96), cx + S(70), y + S(120)), fill=K.SHADOW)
    draw.ellipse((cx - S(66), y - S(80), cx + S(66), y + S(110)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(46), y - S(30), cx + S(46), y + S(104)), fill=(255, 255, 255))
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(56) - S(16), y - S(10), cx + sx * S(56) + S(16), y + S(70)), fill=K.DEV_DEEP)
        draw.ellipse((cx + sx * S(24) - S(9), y - S(58), cx + sx * S(24) + S(9), y - S(40)), fill=(255, 255, 255))
        draw.ellipse((cx + sx * S(24) - S(4), y - S(53), cx + sx * S(24) + S(4), y - S(45)), fill=K.DEV_DEEP)
        draw.ellipse((cx + sx * S(26) - S(18), y + S(100), cx + sx * S(26) + S(18), y + S(118)), fill=ORANGE)
    draw.polygon([(cx - S(14), y - S(34)), (cx + S(14), y - S(34)), (cx, y - S(14))], fill=ORANGE)


def balloon(draw, cx, cy, r, col):
    draw.line([(cx, cy + r), (cx - r * 0.2, cy + r * 1.6), (cx + r * 0.1, cy + r * 2.2)], fill=K.DEV_MID,
              width=max(2, int(r * 0.05)), joint="curve")
    draw.ellipse((cx - r + r * 0.08, cy - r * 1.2 + r * 0.1, cx + r + r * 0.08, cy + r + r * 0.1), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r * 1.2, cx + r, cy + r), fill=col)
    draw.polygon([(cx - r * 0.14, cy + r * 1.12), (cx + r * 0.14, cy + r * 1.12), (cx, cy + r * 0.94)], fill=col)
    draw.ellipse((cx - r * 0.55, cy - r * 0.85, cx - r * 0.25, cy - r * 0.35), fill=(255, 255, 255))


def bunting(draw, x0, x1, y, sag, n):
    pts = []
    for i in range(n + 1):
        f = i / n
        pts.append((x0 + (x1 - x0) * f, y + sag * 4 * f * (1 - f)))
    draw.line(pts, fill=K.DEV_MID, width=4)
    cols = [K.CORAL, K.GOLD, (13, 148, 136), K.BOTH_COLOR, BLUE]
    for i in range(n):
        (ax, ay), (bx, by) = pts[i], pts[i + 1]
        mx, my = (ax + bx) / 2, (ay + by) / 2
        draw.polygon([(ax + 6, ay + 2), (bx - 6, by + 2), (mx, my + 52)], fill=cols[i % len(cols)])


# ---------------------------------------------------------------------------
# things  (each fits roughly ±70 px at s = 1)
# ---------------------------------------------------------------------------

def cake(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(76), cy + S(36), cx + S(76), cy + S(62)), fill=(226, 230, 238))
    draw.rectangle((cx - S(58), cy - S(10), cx + S(58), cy + S(48)), fill=CHOC)
    draw.ellipse((cx - S(58), cy + S(36), cx + S(58), cy + S(58)), fill=CHOC)
    draw.rectangle((cx - S(58), cy + S(14), cx + S(58), cy + S(22)), fill=CREAM)
    draw.ellipse((cx - S(58), cy - S(26), cx + S(58), cy + S(6)), fill=FROST)
    for k in range(5):
        dx = cx - S(46) + k * S(23)
        draw.ellipse((dx - S(8), cy - S(6), dx + S(8), cy + S(12 + 6 * (k % 2))), fill=FROST)
    draw.rectangle((cx - S(6), cy - S(62), cx + S(6), cy - S(14)), fill=(120, 170, 240))
    for k in range(3):
        yy = cy - S(56) + k * S(14)
        draw.line((cx - S(6), yy, cx + S(6), yy - S(6)), fill=(255, 255, 255), width=max(1, int(S(3))))
    draw.ellipse((cx - S(9), cy - S(90), cx + S(9), cy - S(60)), fill=K.GOLD)
    draw.ellipse((cx - S(4), cy - S(78), cx + S(4), cy - S(64)), fill=(255, 250, 220))


def juice(draw, cx, cy, s):
    S = S_(s)
    draw.rectangle((cx - S(36) + S(6), cy - S(50) + S(8), cx + S(36) + S(6), cy + S(64) + S(8)), fill=K.SHADOW)
    draw.polygon([(cx - S(36), cy - S(50)), (cx - S(26), cy - S(64)), (cx + S(26), cy - S(64)), (cx + S(36), cy - S(50))],
                 fill=ORANGE_DARK)
    draw.rectangle((cx - S(36), cy - S(50), cx + S(36), cy + S(64)), fill=ORANGE)
    draw.rounded_rectangle((cx - S(26), cy - S(22), cx + S(26), cy + S(40)), radius=S(8), fill=(255, 255, 255))
    draw.ellipse((cx - S(16), cy - S(10), cx + S(16), cy + S(22)), fill=ORANGE)
    draw.ellipse((cx + S(2), cy - S(18), cx + S(16), cy - S(8)), fill=K.LEAF)
    draw.line([(cx + S(16), cy - S(60)), (cx + S(16), cy - S(92)), (cx + S(34), cy - S(104))], fill=PINK,
              width=max(2, int(S(8))), joint="curve")


def gift(draw, cx, cy, s, col=BLUE):
    S = S_(s)
    dark = tuple(int(c * 0.78) for c in col)
    draw.rectangle((cx - S(56) + S(6), cy - S(30) + S(8), cx + S(56) + S(6), cy + S(62) + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - S(56), cy - S(30), cx + S(56), cy + S(62)), fill=col)
    draw.rectangle((cx - S(64), cy - S(50), cx + S(64), cy - S(24)), fill=dark)
    draw.rectangle((cx - S(10), cy - S(50), cx + S(10), cy + S(62)), fill=K.GOLD)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(26) - S(24), cy - S(80), cx + sx * S(26) + S(24), cy - S(48)), outline=K.GOLD,
                     width=max(2, int(S(9))))
    draw.ellipse((cx - S(10), cy - S(60), cx + S(10), cy - S(42)), fill=K.GOLD)


def greeting_card(draw, cx, cy, s):
    S = S_(s)
    draw.rectangle((cx - S(50) + S(6), cy - S(64) + S(8), cx + S(50) + S(6), cy + S(64) + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - S(50), cy - S(64), cx + S(50), cy + S(64)), fill=(255, 246, 214), outline=YELLOW_DARK,
                   width=max(2, int(S(4))))
    draw.line((cx - S(36), cy - S(64), cx - S(36), cy + S(64)), fill=YELLOW_DARK, width=max(2, int(S(3))))
    K.draw_heart(draw, cx + S(6), cy - S(6), S(26), PINK)


def ticket(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(74) + S(6), cy - S(40) + S(8), cx + S(74) + S(6), cy + S(40) + S(8)), radius=S(10),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(74), cy - S(40), cx + S(74), cy + S(40)), radius=S(10), fill=YELLOW,
                           outline=YELLOW_DARK, width=max(2, int(S(4))))
    K.draw_dashed(draw, cx + S(34), cy - S(32), cx + S(34), cy + S(32), YELLOW_DARK, width=max(2, int(S(4))),
                  dash=int(S(10)) + 1, gap=int(S(7)) + 1)
    K.draw_star(draw, cx - S(18), cy, S(26), K.CORAL)
    draw.ellipse((cx + S(46), cy - S(10), cx + S(62), cy + S(10)), fill=K.CORAL)


def lanyard_pass(draw, cx, cy, s):
    S = S_(s)
    draw.line([(cx - S(34), cy - S(84)), (cx, cy - S(40)), (cx + S(34), cy - S(84))], fill=BLUE,
              width=max(2, int(S(8))), joint="curve")
    draw.rounded_rectangle((cx - S(48) + S(6), cy - S(40) + S(8), cx + S(48) + S(6), cy + S(66) + S(8)), radius=S(10),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(48), cy - S(40), cx + S(48), cy + S(66)), radius=S(10), fill=(255, 255, 255),
                           outline=BLUE, width=max(2, int(S(5))))
    draw.rectangle((cx - S(48), cy - S(40), cx + S(48), cy - S(18)), fill=BLUE)
    draw.rounded_rectangle((cx - S(34), cy - S(8), cx - S(2), cy + S(26)), radius=S(4), fill=(226, 238, 250))
    draw.ellipse((cx - S(26), cy - S(4), cx - S(10), cy + S(12)), fill=K.SKIN)
    for k in range(3):
        draw.line((cx + S(6), cy + k * S(12), cx + S(36), cy + k * S(12)), fill=K.STEEL, width=max(2, int(S(4))))
    draw.rectangle((cx - S(34), cy + S(38), cx + S(34), cy + S(52)), fill=K.GOLD)


def torch(draw, cx, cy, s, on=True):
    S = S_(s)
    if on:
        draw.polygon([(cx + S(46), cy - S(26)), (cx + S(150), cy - S(66)), (cx + S(150), cy + S(66)),
                      (cx + S(46), cy + S(26))], fill=(255, 244, 196))
    draw.rounded_rectangle((cx - S(74) + S(5), cy - S(16) + S(7), cx + S(14) + S(5), cy + S(16) + S(7)), radius=S(8),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(74), cy - S(16), cx + S(14), cy + S(16)), radius=S(8), fill=K.DEV_DARK)
    draw.rectangle((cx - S(30), cy - S(16), cx - S(14), cy + S(16)), fill=K.CORAL)
    draw.polygon([(cx + S(10), cy - S(18)), (cx + S(48), cy - S(32)), (cx + S(48), cy + S(32)), (cx + S(10), cy + S(18))],
                 fill=K.STEEL)
    draw.ellipse((cx + S(40), cy - S(30), cx + S(56), cy + S(30)), fill=(255, 250, 220) if on else K.STEEL_DARK)


def coin(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(52) + S(5), cy - S(52) + S(7), cx + S(52) + S(5), cy + S(52) + S(7)), fill=K.SHADOW)
    draw.ellipse((cx - S(52), cy - S(52), cx + S(52), cy + S(52)), fill=K.GOLD)
    draw.ellipse((cx - S(38), cy - S(38), cx + S(38), cy + S(38)), outline=YELLOW_DARK, width=max(2, int(S(5))))
    K.draw_star(draw, cx, cy, S(24), YELLOW_DARK)


def gem(draw, cx, cy, s):
    S = S_(s)
    top = [(cx - S(56), cy - S(16)), (cx - S(30), cy - S(46)), (cx + S(30), cy - S(46)), (cx + S(56), cy - S(16))]
    draw.polygon([(x + S(5), y + S(7)) for x, y in top + [(cx, cy + S(56))]], fill=K.SHADOW)
    draw.polygon(top + [(cx, cy + S(56))], fill=(150, 120, 236))
    draw.polygon([(cx - S(56), cy - S(16)), (cx + S(56), cy - S(16)), (cx, cy + S(56))], fill=K.BOTH_COLOR)
    draw.polygon([(cx - S(30), cy - S(46)), (cx - S(10), cy - S(16)), (cx - S(56), cy - S(16))], fill=(196, 180, 250))
    draw.line((cx - S(10), cy - S(16), cx, cy + S(56)), fill=(196, 180, 250), width=max(2, int(S(3))))


def party_hat(draw, cx, cy, s):
    S = S_(s)
    draw.polygon([(cx - S(50) + S(5), cy + S(56) + S(6)), (cx + S(50) + S(5), cy + S(56) + S(6)),
                  (cx + S(5), cy - S(64) + S(6))], fill=K.SHADOW)
    draw.polygon([(cx - S(50), cy + S(56)), (cx + S(50), cy + S(56)), (cx, cy - S(64))], fill=K.BOTH_COLOR)
    for k, f in enumerate((0.3, 0.62)):
        y = cy + S(56) - S(120) * f
        hw = S(50) * (1 - f)
        draw.line((cx - hw, y, cx + hw, y), fill=K.GOLD, width=max(2, int(S(8))))
    draw.ellipse((cx - S(14), cy - S(80), cx + S(14), cy - S(52)), fill=K.GOLD)


def sweets(draw, cx, cy, s):
    S = S_(s)
    draw.rectangle((cx - S(72) + S(6), cy - S(16) + S(8), cx + S(72) + S(6), cy + S(52) + S(8)), fill=K.SHADOW)
    for k in range(3):
        lx = cx - S(44) + k * S(44)
        draw.ellipse((lx - S(24), cy - S(46), lx + S(24), cy + S(2)), fill=ORANGE)
        draw.ellipse((lx - S(12), cy - S(36), lx - S(2), cy - S(26)), fill=(255, 210, 120))
    draw.rectangle((cx - S(72), cy - S(16), cx + S(72), cy + S(52)), fill=PINK)
    draw.rectangle((cx - S(72), cy + S(10), cx + S(72), cy + S(22)), fill=K.GOLD)


def clock(draw, cx, cy, s, late=False):
    S = S_(s)
    draw.ellipse((cx - S(58) + S(5), cy - S(58) + S(7), cx + S(58) + S(5), cy + S(58) + S(7)), fill=K.SHADOW)
    draw.ellipse((cx - S(58), cy - S(58), cx + S(58), cy + S(58)), fill=(255, 255, 255),
                 outline=K.DANGER if late else (13, 148, 136), width=max(3, int(S(8))))
    for k in range(12):
        a = k * math.pi / 6
        draw.line((cx + math.cos(a) * S(42), cy + math.sin(a) * S(42), cx + math.cos(a) * S(48),
                   cy + math.sin(a) * S(48)), fill=K.DEV_MID, width=max(1, int(S(3))))
    # on time: 5 o'clock; late: about 7 o'clock
    hour_a = math.radians(-90 + (210 if late else 150))
    draw.line((cx, cy, cx + math.cos(hour_a) * S(26), cy + math.sin(hour_a) * S(26)), fill=K.DEV_DEEP,
              width=max(2, int(S(7))))
    draw.line((cx, cy, cx, cy - S(38)), fill=K.DEV_DEEP, width=max(2, int(S(5))))
    draw.ellipse((cx - S(6), cy - S(6), cx + S(6), cy + S(6)), fill=K.CORAL)


def shoe(draw, cx, cy, s, muddy=False):
    S = S_(s)
    body = (90, 140, 220) if not muddy else (120, 140, 170)
    draw.rounded_rectangle((cx - S(74) + S(5), cy + S(14) + S(7), cx + S(74) + S(5), cy + S(38) + S(7)), radius=S(10),
                           fill=K.SHADOW)
    draw.polygon([(cx - S(66), cy + S(20)), (cx - S(60), cy - S(40)), (cx - S(16), cy - S(42)), (cx + S(10), cy - S(10)),
                  (cx + S(62), cy + S(2)), (cx + S(70), cy + S(20))], fill=body)
    draw.rounded_rectangle((cx - S(74), cy + S(14), cx + S(74), cy + S(38)), radius=S(10), fill=(255, 255, 255),
                           outline=K.STEEL, width=max(1, int(S(3))))
    for k in range(3):
        x = cx - S(30) + k * S(14)
        draw.line((x, cy - S(30) + k * S(6), x + S(16), cy - S(36) + k * S(8)), fill=(255, 255, 255),
                  width=max(2, int(S(5))))
    if muddy:
        for dx, dy, r in ((-40, 4, 16), (10, 10, 20), (46, 18, 14), (-58, 30, 12), (24, 32, 16), (-14, -20, 12)):
            draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r) * 0.8, cx + S(dx) + S(r), cy + S(dy) + S(r) * 0.8),
                         fill=MUD)
        for dx in (-30, 20):
            draw.ellipse((cx + S(dx) - S(6), cy + S(44), cx + S(dx) + S(6), cy + S(60)), fill=MUD)


def calendar(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(6), cy - S(80) + S(8), cx + S(110) + S(6), cy + S(80) + S(8)), radius=S(16),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(80), cx + S(110), cy + S(80)), radius=S(16), fill=(255, 255, 255),
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(110), cy - S(80), cx + S(110), cy - S(36)), radius=S(16), fill=K.CORAL)
    draw.rectangle((cx - S(110), cy - S(56), cx + S(110), cy - S(36)), fill=K.CORAL)
    for k in range(7):
        x = cx - S(90) + k * S(30)
        draw.rounded_rectangle((x - S(11), cy - S(14), x + S(11), cy + S(10)), radius=S(4), fill=(255, 226, 200))
        draw.rounded_rectangle((x - S(11), cy + S(22), x + S(11), cy + S(46)), radius=S(4), fill=(226, 238, 250))


def bulb(draw, cx, cy, s, on, t=0.0):
    S = S_(s)
    if on:
        for k in range(8):
            a = k * math.pi / 4 + 0.2
            r0, r1 = S(92), S(122 + 8 * math.sin(t * 20 + k))
            draw.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * r1, cy + math.sin(a) * r1),
                      fill=K.GOLD, width=max(3, int(S(9))))
        draw.ellipse((cx - S(84), cy - S(84), cx + S(84), cy + S(84)), fill=(255, 244, 200))
    draw.ellipse((cx - S(62), cy - S(66), cx + S(62), cy + S(58)), fill=(255, 220, 90) if on else (232, 234, 238),
                 outline=K.STEEL_DARK, width=max(2, int(S(4))))
    draw.line([(cx - S(18), cy + S(30)), (cx - S(10), cy - S(6)), (cx, cy + S(10)), (cx + S(10), cy - S(6)),
               (cx + S(18), cy + S(30))], fill=K.CORAL if on else K.STEEL_DARK, width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(30), cy + S(52), cx + S(30), cy + S(96)), radius=S(8), fill=K.STEEL)
    for k in range(2):
        draw.line((cx - S(30), cy + S(66) + k * S(14), cx + S(30), cy + S(66) + k * S(14)), fill=K.STEEL_DARK,
                  width=max(2, int(S(4))))


def light_switch(draw, cx, cy, s, on):
    S = S_(s)
    draw.rounded_rectangle((cx - S(80) + S(8), cy - S(110) + S(10), cx + S(80) + S(8), cy + S(110) + S(10)),
                           radius=S(22), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(80), cy - S(110), cx + S(80), cy + S(110)), radius=S(22), fill=(255, 255, 255),
                           outline=K.STEEL, width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(34), cy - S(70), cx + S(34), cy + S(70)), radius=S(14), fill=(232, 234, 238))
    if on:
        draw.rounded_rectangle((cx - S(30), cy - S(66), cx + S(30), cy + S(4)), radius=S(12), fill=(13, 148, 136))
    else:
        draw.rounded_rectangle((cx - S(30), cy - S(4), cx + S(30), cy + S(66)), radius=S(12), fill=K.DEV_MID)


def cave(draw, cx, by, s, open_t=0.0, t=0.0):
    S = S_(s)
    draw.ellipse((cx - S(260), by - S(30), cx + S(260), by + S(20)), fill=K.SHADOW)
    draw.chord((cx - S(250), by - S(330), cx + S(250), by + S(330)), 180, 360, fill=ROCK)
    for dx, dy, r in ((-150, -200, 50), (120, -230, 40), (180, -110, 34), (-190, -90, 30)):
        draw.ellipse((cx + S(dx) - S(r), by + S(dy) - S(r) * 0.7, cx + S(dx) + S(r), by + S(dy) + S(r) * 0.7),
                     fill=ROCK_DARK)
    draw.chord((cx - S(100), by - S(190), cx + S(100), by + S(190)), 180, 360, fill=(46, 40, 52))
    if open_t > 0.3:
        for k in range(3):
            gx = cx - S(40) + k * S(40)
            K.draw_star(draw, gx, by - S(70) - S(20) * (k % 2), S(16), K.GOLD, rot=t * 3 + k)
    bx = cx + S(230) * K.ease_in_out(K.clamp01(open_t))
    draw.ellipse((bx - S(110), by - S(200), bx + S(110), by + S(6)), fill=ROCK_DARK)
    draw.ellipse((bx - S(80), by - S(180), bx + S(40), by - S(90)), fill=ROCK)


def big_wheel(draw, cx, cy, r, t):
    draw.line((cx, cy, cx - r * 0.7, cy + r * 1.25), fill=K.DEV_MID, width=12)
    draw.line((cx, cy, cx + r * 0.7, cy + r * 1.25), fill=K.DEV_MID, width=12)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(232, 120, 160), width=10)
    draw.ellipse((cx - r * 0.25, cy - r * 0.25, cx + r * 0.25, cy + r * 0.25), outline=(232, 120, 160), width=6)
    cols = [K.CORAL, K.GOLD, (13, 148, 136), K.BOTH_COLOR, BLUE, PINK]
    for k in range(8):
        a = k * math.pi / 4 + t * 1.2
        px, py = cx + math.cos(a) * r, cy + math.sin(a) * r
        draw.line((cx, cy, px, py), fill=(232, 120, 160), width=4)
        draw.rounded_rectangle((px - 26, py + 6, px + 26, py + 46), radius=10, fill=cols[k % len(cols)])
        draw.line((px, py, px, py + 8), fill=K.DEV_MID, width=4)
    draw.ellipse((cx - 16, cy - 16, cx + 16, cy + 16), fill=K.DEV_DARK)


ICONS = {
    "cake": cake, "juice": juice, "gift": gift, "card": greeting_card, "ticket": ticket, "pass": lanyard_pass,
    "torch": torch, "coin": coin, "gem": gem, "hat": party_hat, "sweets": sweets,
}


def icon(draw, kind, cx, cy, s):
    if kind == "key":
        K.draw_key(draw, cx, cy, s * 0.45, K.GOLD)
    elif kind == "clock":
        clock(draw, cx, cy, s)
    elif kind == "late":
        clock(draw, cx, cy, s, late=True)
    elif kind == "shoe":
        shoe(draw, cx, cy, s)
    elif kind == "muddy":
        shoe(draw, cx, cy, s, muddy=True)
    else:
        ICONS[kind](draw, cx, cy, s)


# ---------------------------------------------------------------------------
# logic doors
# ---------------------------------------------------------------------------

def door(draw, cx, by, s, open_t, style="party"):
    """Door in a frame. Frame spans cx ± 172s, by-522s … by."""
    S = S_(s)
    W, H = S(150), S(500)
    frame = WOOD_DARK if style == "party" else RED_DARK
    draw.rectangle((cx - W - S(22) + S(10), by - H - S(22) + S(12), cx + W + S(22) + S(10), by + S(4)), fill=K.SHADOW)
    draw.rectangle((cx - W - S(22), by - H - S(22), cx + W + S(22), by), fill=frame)
    draw.rectangle((cx - W, by - H, cx + W, by), fill=GLOW)
    draw.polygon([(cx - W, by), (cx + W, by), (cx + W * 0.7, by - S(60)), (cx - W * 0.7, by - S(60))],
                 fill=(255, 214, 130))
    o = K.ease_in_out(K.clamp01(open_t))
    x0 = cx - W
    x1 = cx + W - 2 * W * 0.8 * o
    sk = S(34) * o
    panel_col = WOOD if style == "party" else K.CORAL
    draw.polygon([(x0, by - H), (x1, by - H - sk), (x1, by + sk * 0.3), (x0, by)], fill=panel_col)
    if o < 0.6:
        inset = (110, 76, 46) if style == "party" else RED_DARK
        for y0f, y1f in ((0.08, 0.44), (0.54, 0.92)):
            ix0, ix1 = K.lerp(x0, x1, 0.16), K.lerp(x0, x1, 0.84)
            draw.rectangle((ix0, by - H + H * y0f, ix1, by - H + H * y1f), outline=inset, width=max(2, int(S(5))))
        if style != "party":
            for k in range(4):
                yy = by - H + H * (0.12 + k * 0.22)
                draw.line((K.lerp(x0, x1, 0.2), yy, K.lerp(x0, x1, 0.8), yy), fill=(255, 255, 255),
                          width=max(2, int(S(8))))
    kx = x1 - S(26) * (1 - o * 0.6)
    draw.ellipse((kx - S(12), by - H * 0.48 - S(12), kx + S(12), by - H * 0.48 + S(12)), fill=K.GOLD)


def gate(draw, brand, door_cx, by, inputs, op, open_t, style="party", ask=False, s=0.9, t=0.0, verdict=None):
    """Two inputs → a junction labelled op → a door.  inputs: [(icon, True/False/None)].
    Spans door_cx-690 … door_cx+160 horizontally, by-520 … by vertically."""
    sage = K.hex_rgb(brand["sage"])
    coral = K.hex_rgb(brand["coral"])
    on_any = any(st for _, st in inputs)
    on_all = all(st for _, st in inputs)
    ys = [by - 400, by - 160]
    jx, jy = door_cx - 250, by - 280
    door_l = door_cx - 172 * s
    out_on = (on_all if op == "AND" else on_any) and not ask
    for (kind, st), y in zip(inputs, ys):
        ix, lx = door_cx - 610, door_cx - 420
        col = K.GOLD if st else WIRE_OFF
        draw.line((lx + 40, y, jx, y), fill=col, width=14)
        draw.line((jx, y, jx, jy), fill=col, width=14)
    draw.line((jx, jy, door_l, jy), fill=K.GOLD if out_on else WIRE_OFF, width=14)
    for (kind, st), y in zip(inputs, ys):
        ix, lx = door_cx - 610, door_cx - 420
        soft = (255, 246, 214) if st else (240, 240, 244) if st is False else (255, 240, 230)
        draw.ellipse((ix - 82, y - 82, ix + 82, y + 82), fill=soft, outline=K.GOLD if st else WIRE_OFF, width=5)
        if st is None:
            K.text_at(draw, "?", ix, y - 52, K.load_font(84, bold=True), coral)
        else:
            icon(draw, kind, ix, y + 4, 0.78)
            if st is False:
                K.draw_cross(draw, ix + 60, y - 60, 22, K.DANGER)
        lock_col = sage if st else K.DANGER if st is False else K.STEEL
        K.draw_padlock(draw, lx, y - 10, 0.42, lock_col, open_t=1.0 if st else 0.0)
    K.pill(draw, jx, jy - 32, op, K.BOTH_COLOR if op == "AND" else sage if op == "OR" else coral, size=36)
    door(draw, door_cx, by, s, open_t if out_on else 0.0, style)
    if ask:
        draw.ellipse((door_cx - 90, by - 360, door_cx + 90, by - 180), fill=(255, 255, 255), outline=coral, width=6)
        K.text_at(draw, "?", door_cx, by - 352, K.load_font(130, bold=True), coral)
    if verdict is True:
        K.draw_check(draw, door_cx + 110, by - 470, 34, sage)
    elif verdict is False:
        K.draw_cross(draw, door_cx + 110, by - 470, 34, K.DANGER)


def tf_card(draw, cx, cy, val, s=1.0):
    S = S_(s)
    col = (13, 148, 136) if val else K.DANGER
    x0, y0, x1, y1 = cx - S(120), cy - S(56), cx + S(120), cy + S(56)
    draw.rounded_rectangle((x0 + S(8), y0 + S(10), x1 + S(8), y1 + S(10)), radius=S(24), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(24), fill=col)
    K.text_at(draw, "TRUE" if val else "FALSE", cx, cy - S(30), K.load_font(max(26, int(S(52))), bold=True),
              (255, 255, 255))


def not_box(draw, cx, cy, s, t=0.0):
    S = S_(s)
    x0, y0, x1, y1 = cx - S(150), cy - S(110), cx + S(150), cy + S(110)
    draw.rounded_rectangle((x0 + S(10), y0 + S(12), x1 + S(10), y1 + S(12)), radius=S(30), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(30), fill=K.CORAL)
    draw.rounded_rectangle((x0 + S(14), y0 + S(14), x1 - S(14), y1 - S(14)), radius=S(22), outline=(255, 210, 180),
                           width=max(2, int(S(5))))
    K.text_at(draw, "NOT", cx, cy - S(70), K.load_font(max(26, int(S(64))), bold=True), (255, 255, 255))
    a = t * 6
    r = S(30)
    ax, ay = cx, cy + S(42)
    draw.arc((ax - r, ay - r, ax + r, ay + r), math.degrees(a), math.degrees(a) + 270, fill=(255, 255, 255),
             width=max(3, int(S(8))))
    hx, hy = ax + math.cos(a) * r, ay + math.sin(a) * r
    draw.ellipse((hx - S(9), hy - S(9), hx + S(9), hy + S(9)), fill=(255, 255, 255))


# ---------------------------------------------------------------------------
# render
# ---------------------------------------------------------------------------

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
    red_soft = (252, 228, 228)
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    font = K.load_font
    AND_C, OR_C, NOT_C = K.BOTH_COLOR, sage, coral

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

    def word_tile(x, y, word, col, size=80, wd=260, ht=150):
        draw.rounded_rectangle((x - wd / 2 + 10, y + 12, x + wd / 2 + 10, y + ht + 12), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((x - wd / 2, y, x + wd / 2, y + ht), radius=36, fill=col)
        K.text_at(draw, word, x, y + (ht - size * 1.2) / 2, font(size, bold=True), (255, 255, 255))

    def yes_no(x, y, ok, size=34):
        K.pill(draw, x, y, "YES" if ok else "NO", sage if ok else K.DANGER, size=size)

    # ---- opening -----------------------------------------------------------
    if visual == "c7-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 300, 470, 0.85, t, mood="happy", wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 600, 320), (cx + 620, 320), (cx - 680, 560), (cx + 700, 560)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 250 + lift, w - 240, 860 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · TRUE OR FALSE?", cx, 326 + lift, font(34, bold=True), sage)
            for i in range(2):
                a = K.stagger(progress, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                x = cx + (i * 2 - 1) * 380
                y = 420 + lift + int((1 - a) * 40)
                draw.rounded_rectangle((x - 330, y, x + 330, y + 400), radius=32, fill=[sage_soft, red_soft][i])
                if i == 0:
                    calendar(draw, x, y + 120, 1.0)
                    K.text_at(draw, "A week has 7 days.", x, y + 230, font(38, bold=True), ink)
                else:
                    penguin(draw, x, y + 110, 0.75, t)
                    K.text_at(draw, "All birds can fly.", x, y + 230, font(38, bold=True), ink)
                b = K.stagger(progress, i + 1, step=0.3, speed=4)
                if b > 0:
                    tf_card(draw, x, y + 330, i == 0, 0.8)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "AND, OR, NOT for Kids", cx, 360 + lift, font(86, bold=True), ink)
            for i, (wd, col) in enumerate((("AND", AND_C), ("OR", OR_C), ("NOT", NOT_C))):
                a = K.stagger(progress, i + 1, step=0.14, speed=5)
                if a <= 0:
                    continue
                word_tile(cx + (i - 1) * 360, 600 + int((1 - a) * 40), wd, col, size=72, wd=280, ht=140)
            return True
        if focus == "word":
            for i, (wd, col) in enumerate((("AND", AND_C), ("OR", OR_C), ("NOT", NOT_C))):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a > 0:
                    word_tile(400, 280 + i * 190 + int((1 - a) * 30), wd, col, size=56, wd=220, ht=120)
            K.text_at(draw, "tiny words", 400, 840 - 40, font(36, bold=True), muted)
            a = K.stagger(progress, 3, step=0.1, speed=4)
            if a > 0:
                K.draw_arrow(draw, 580, 540, 580 + 200 * a, 540, muted, width=14, head=40)
            b = K.stagger(progress, 4, step=0.1, speed=4)
            if b > 0:
                px = 1260
                draw.ellipse((px - 330, 560 - 300, px + 330, 560 + 300), fill=lav_soft)
                draw.ellipse((px - 120, 735, px + 120, 765), fill=K.SHADOW)
                draw.rectangle((px - 14, 360, px + 14, 750), fill=WOOD_DARK)
                draw.polygon([(px + 10, 380), (px + 300, 380), (px + 360, 440), (px + 300, 500), (px + 10, 500)],
                             fill=sage)
                K.text_at(draw, "YES", px + 170, 410, font(48, bold=True), panel)
                draw.polygon([(px - 10, 540), (px - 300, 540), (px - 360, 600), (px - 300, 660), (px - 10, 660)],
                             fill=K.DANGER)
                K.text_at(draw, "NO", px - 170, 570, font(48, bold=True), panel)
                K.text_at(draw, "big decisions", px, 840 - 40, font(36, bold=True), muted)
            return True
        # promise
        bunting(draw, 140, 1780, 240, 70, 14)
        K.text_at(draw, "Let's go to a", 560, 380 + lift, font(64, bold=True), ink)
        K.text_at(draw, "birthday party!", 560, 470 + lift, font(80, bold=True), coral)
        a = K.stagger(progress, 1, step=0.12, speed=4)
        if a > 0:
            cake(draw, 450, 720 + int((1 - a) * 30), 1.4)
            gift(draw, 690, 730 + int((1 - a) * 30), 1.1, K.BOTH_COLOR)
        door(draw, 1350, 860, 0.95, 0.0)
        for k, (bx, col) in enumerate(((1110, RED), (1590, BLUE), (1170, K.GOLD), (1530, PINK))):
            balloon(draw, bx, 420 + (k // 2) * 90 + 8 * math.sin(t * 8 + k), 50, col)
        return True

    # ---- the party ------------------------------------------------------------
    if visual == "c7-party":
        if focus == "meet":
            bunting(draw, 140, 1780, 236, 60, 14)
            door(draw, 880, 860, 1.0, 0.0)
            for k, (bx, col) in enumerate(((640, RED), (1120, BLUE))):
                balloon(draw, bx, 430 + 8 * math.sin(t * 8 + k), 56, col)
            kid(draw, 380, 470, 1.25, K.CORAL, t, hat="party")
            K.pill(draw, 380, 700, "Anaya", coral, size=36)
            K.draw_robot(draw, 1380, 560, 0.8, t, mood="happy", wave=t)
            K.pill(draw, 1380, 790, "Robo", K.BOT, size=34)
            K.text_at(draw, "Birthday!", 380, 790, font(40, bold=True), muted)
            return True
        if focus == "rule":
            K.draw_robot(draw, 400, 560, 0.85, t, mood="idle")
            K.shadow_card(draw, (720, 250 + lift, 1760, 850 + lift), brand, radius=40, accent=AND_C)
            K.text_at(draw, "ANAYA'S RULE", 1240, 268 + lift, font(36, bold=True), panel)
            a = K.stagger(progress, 0, step=0.1, speed=4)
            cake(draw, 960, 470 + lift, 1.2 * a + 0.01)
            K.pill(draw, 1240, 440 + lift, "AND", AND_C, size=48)
            b = K.stagger(progress, 1, step=0.1, speed=4)
            juice(draw, 1520, 470 + lift, 1.2 * b + 0.01)
            c = K.stagger(progress, 3, step=0.12, speed=4)
            if c > 0:
                y = 640 + lift + int((1 - c) * 20)
                draw.rounded_rectangle((790, y, 1220, y + 150), radius=30, fill=sage_soft)
                K.draw_check(draw, 860, y + 75, 36, sage)
                K.text_at(draw, "Yes, come in", 1040, y + 52, font(38, bold=True), ink)
                draw.rounded_rectangle((1260, y, 1690, y + 150), radius=30, fill=red_soft)
                K.draw_cross(draw, 1330, y + 75, 36, K.DANGER)
                K.text_at(draw, "No, sorry", 1500, y + 52, font(38, bold=True), ink)
            return True
        if focus == "arjun":
            door(draw, 380, 860, 0.95, 0.0)
            K.draw_robot(draw, 720, 580, 0.78, t, mood="idle")
            ax = K.lerp(1420, 1180, K.ease_out_cubic(K.clamp01(progress * 2)))
            kid(draw, ax, 470, 1.15, BLUE, t, bun=False)
            cake(draw, ax, 620, 1.1)
            K.pill(draw, ax, 300, "Arjun", BLUE, size=34)
            draw.rounded_rectangle((1440, 420, 1720, 740), radius=30, fill=coral_soft)
            dashed_box((1440, 420, 1720, 740), coral, width=4)
            K.text_at(draw, "?", 1580, 470, font(int(110 + 14 * pulse), bold=True), coral)
            K.text_at(draw, "No juice!", 1580, 650, font(40, bold=True), K.DANGER)
            K.text_at(draw, "Ding dong!", 380, 270, font(44, bold=True), K.BOTH_COLOR)
            return True
        ask = focus == "why"
        inputs = [("cake", True), ("juice", False if focus == "answer" else True if focus == "fixed" else False)]
        if focus == "fixed":
            gate(draw, brand, 1120, 860, inputs, "AND", K.clamp01(progress * 1.6), t=t,
                 verdict=True if progress > 0.3 else None)
            ax = K.lerp(240, 330, K.ease_out_cubic(K.clamp01(progress * 2)))
            kid(draw, ax, 380, 0.9, BLUE, t, bun=False)
            K.draw_robot(draw, 1600, 600, 0.68, t, mood="happy")
            K.draw_bubble(draw, (1380, 230, 1820, 360), brand, "Yes, come in!", tail="left", size=40, color=sage_soft)
            star_spots([(1700, 860 - 40), (300, 760)])
            return True
        gate(draw, brand, 1120, 860, inputs, "AND", 0.0, ask=ask, t=t, verdict=None if ask else False)
        kid(draw, 260, 380, 0.9, BLUE, t if ask else 0, bun=False)
        if ask:
            K.text_at(draw, "Can Arjun come in?", cx + 120, 236, font(46, bold=True), ink)
            K.draw_stopwatch(draw, 1600, 380, 50, progress, brand)
            question_marks([(1620, 560), (1720, 700)], size=80)
        else:
            K.draw_robot(draw, 1600, 600, 0.68, t, mood="confused")
            K.draw_bubble(draw, (1390, 230, 1820, 360), brand, "Sorry, Arjun!", tail="left", size=40,
                          color=red_soft)
        return True

    # ---- AND ---------------------------------------------------------------
    if visual == "c7-and":
        if focus == "intro":
            K.text_at(draw, "AND", 420, 300 + lift, font(150, bold=True), AND_C)
            K.text_at(draw, "both must", 420, 500 + lift, font(60, bold=True), ink)
            K.text_at(draw, "be true", 420, 580 + lift, font(60, bold=True), ink)
            on = K.clamp01(progress * 2)
            gate(draw, brand, 1560, 860, [("cake", on > 0.3), ("juice", on > 0.7)], "AND",
                 K.clamp01(progress * 2 - 0.8), t=t)
            return True
        if focus == "table":
            K.shadow_card(draw, (220, 236, 1700, 870), brand, radius=36)
            cols_x = [430, 780, 1080, 1420]
            for x, lab in zip(cols_x, ("Guest", "Cake?", "Juice?", "Robo says")):
                K.text_at(draw, lab, x, 262, font(38, bold=True), muted)
            draw.line((260, 320, 1660, 320), fill=line, width=4)
            rows = [(True, True), (True, False), (False, True), (False, False)]
            body = [K.CORAL, BLUE, K.BOTH_COLOR, (13, 148, 136)]
            for i, (c_, j_) in enumerate(rows):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 330 + i * 134 + int((1 - a) * 20)
                ok = c_ and j_
                draw.rounded_rectangle((250, y + 6, 1670, y + 126), radius=24, fill=sage_soft if ok else panel)
                kid(draw, 430, y + 58, 0.42, body[i], 0, bun=i % 2 == 0)
                for x, has, kind in ((780, c_, "cake"), (1080, j_, "juice")):
                    if has:
                        icon(draw, kind, x, y + 70, 0.62)
                    else:
                        draw.ellipse((x - 44, y + 22, x + 44, y + 110), outline=WIRE_OFF, width=5)
                        K.draw_cross(draw, x, y + 66, 22, K.DANGER)
                yes_no(1420, y + 34, ok, size=36)
            return True
        if focus == "fussy":
            K.draw_robot(draw, 440, 560, 0.9, t, mood="confused")
            K.draw_magnifier(draw, 640, 420, 0.6, AND_C)
            K.shadow_card(draw, (860, 250 + lift, 1720, 850 + lift), brand, radius=36, accent=AND_C)
            K.text_at(draw, "AND wants EVERYTHING", 1290, 266 + lift, font(38, bold=True), panel)
            items = [("cake", "Cake", True), ("juice", "Juice", False)]
            for i, (kind, lab, ok) in enumerate(items):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 370 + i * 160 + lift + int((1 - a) * 20)
                draw.rounded_rectangle((920, y, 1660, y + 136), radius=28, fill=sage_soft if ok else red_soft)
                icon(draw, kind, 1010, y + 70, 0.7)
                draw.text((1100, y + 40), lab, fill=ink, font=font(48, bold=True))
                (K.draw_check if ok else K.draw_cross)(draw, 1590, y + 68, 34, sage if ok else K.DANGER)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, 1290, 720 + lift + int((1 - a) * 20), "One missing → NO", K.DANGER, size=44)
            return True
        ans = focus == "kabir-a"
        K.pill(draw, 1090, 236, "Rule: gift AND card", AND_C, size=34)
        kid(draw, 290, 430, 1.1, K.GOLD, t if not ans else 0, bun=False)
        gift(draw, 290, 690, 1.0)
        K.text_at(draw, "Kabir", 290, 790, font(40, bold=True), ink)
        gate(draw, brand, 1440, 860, [("gift", True), ("card", False)], "AND", 0.0, ask=not ans, t=t,
             verdict=False if ans else None)
        if ans:
            K.pill(draw, 290, 220, "Go make a card!", coral, size=32)
        else:
            K.draw_stopwatch(draw, 1730, 400, 44, progress, brand)
        return True

    # ---- OR -----------------------------------------------------------------
    if visual == "c7-or":
        if focus == "intro":
            big_wheel(draw, 1440, 500, 230, t)
            draw.rounded_rectangle((1100, 790, 1780, 870), radius=20, fill=GRASS)
            for x in (360, 900):
                draw.rectangle((x - 30, 400, x + 30, 860), fill=RED)
                for k in range(5):
                    draw.rectangle((x - 30, 420 + k * 90, x + 30, 460 + k * 90), fill=(255, 255, 255))
            draw.arc((330, 250, 930, 560), 180, 360, fill=K.GOLD, width=26)
            K.pill(draw, 630, 300, "FUN FAIR", K.CORAL, size=44)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                y = 620 + int((1 - a) * 30)
                ticket(draw, 480, y, 1.0)
                K.pill(draw, 630, y - 32, "OR", OR_C, size=40)
                lanyard_pass(draw, 790, y + 10, 1.0)
            return True
        if focus in ("rows", "both", "neither"):
            if focus == "rows":
                first = progress < 0.5
                ins = [("ticket", first), ("pass", not first)]
                lab = "Only a ticket → YES" if first else "Only a pass → YES"
                op_t = K.clamp01(((progress % 0.5) / 0.5) * 3 - 0.6)
            elif focus == "both":
                ins = [("ticket", True), ("pass", True)]
                lab = "Both → still YES!"
                op_t = K.clamp01(progress * 3 - 0.6)
            else:
                ins = [("ticket", False), ("pass", False)]
                lab = "Neither → NO"
                op_t = 0.0
            ok = focus != "neither"
            gate(draw, brand, 1200, 860, ins, "OR", op_t, style="fair", t=t,
                 verdict=(True if op_t > 0.3 else None) if ok else False)
            K.text_at(draw, "OR", 1640, 300 + lift, font(110, bold=True), OR_C)
            K.text_at(draw, "at least one", 1640, 440 + lift, font(40, bold=True), ink)
            K.pill(draw, 1640, 560, lab.split(" → ")[0], sage if ok else K.DANGER, size=34)
            yes_no(1640, 660, ok, size=44)
            if focus == "both":
                star_spots([(1500, 800), (1780, 800)])
            return True
        ans = focus == "sara-a"
        kid(draw, 280, 430, 1.1, PINK, t, bun=True)
        lanyard_pass(draw, 280, 680, 0.9)
        K.text_at(draw, "Sara", 280, 790, font(40, bold=True), ink)
        K.pill(draw, 1090, 236, "Rule: ticket OR pass", OR_C, size=34)
        gate(draw, brand, 1440, 860, [("ticket", False), ("pass", True)], "OR",
             K.clamp01(progress * 3) if ans else 0.0, style="fair", ask=not ans, t=t, verdict=True if ans else None)
        if ans:
            star_spots([(1730, 400), (1760, 700)])
        else:
            K.draw_stopwatch(draw, 1730, 400, 44, progress, brand)
        return True

    # ---- NOT -----------------------------------------------------------------
    if visual == "c7-not":
        if focus == "flip":
            K.text_at(draw, "NOT = the opposite", cx, 236, font(60, bold=True), NOT_C)
            not_box(draw, cx, 560, 1.2, t)
            p_in = K.ease_in_out(K.clamp01(progress * 2.2))
            if p_in < 1:
                tf_card(draw, K.lerp(330, cx - 230, p_in), 560, True, 1.1)
            p_out = K.ease_out_cubic(K.clamp01(progress * 2.2 - 1.1))
            if p_out > 0:
                tf_card(draw, K.lerp(cx + 230, 1590, p_out), 560, False, 1.1)
            K.draw_arrow(draw, 520, 740, 760, 740, muted, width=10, head=28)
            K.draw_arrow(draw, 1160, 740, 1400, 740, muted, width=10, head=28)
            K.text_at(draw, "in", 640, 770, font(34, bold=True), muted)
            K.text_at(draw, "out", 1280, 770, font(34, bold=True), muted)
            return True
        if focus == "truefalse":
            for i, val in enumerate((True, False)):
                a = K.stagger(progress, i, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 380 + i * 270 + int((1 - a) * 20)
                tf_card(draw, 300, y, val, 0.95)
                K.draw_arrow(draw, 430, y, 500, y, muted, width=8, head=22)
                K.pill(draw, 610, y - 34, "NOT", NOT_C, size=40)
                K.draw_arrow(draw, 720, y, 790, y, muted, width=8, head=22)
                tf_card(draw, 920, y, not val, 0.95)
            on = progress < 0.55
            draw.ellipse((1450 - 300, 560 - 300, 1450 + 300, 560 + 300), fill=lav_soft)
            bulb(draw, 1450, 420, 1.0, on, t)
            light_switch(draw, 1450, 700, 0.75, on)
            K.text_at(draw, "ON" if on else "OFF", 1650, 670, font(48, bold=True), sage if on else muted)
            return True
        if focus == "shoes":
            K.pill(draw, cx, 236, "Nani's rule: NOT wearing muddy shoes", NOT_C, size=34)
            K.draw_person(draw, 300, 500, 1.2, "nani", t)
            K.text_at(draw, "Nani", 300, 790, font(40, bold=True), ink)
            for i, (muddy, lab) in enumerate(((False, "Clean shoes"), (True, "Muddy shoes"))):
                a = K.stagger(progress, i * 2, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = 900 + i * 560
                y0 = 340 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 240, y0, x + 240, y0 + 520), radius=36,
                                       fill=sage_soft if not muddy else red_soft,
                                       outline=sage if not muddy else K.DANGER, width=5)
                shoe(draw, x - 70, y0 + 170, 1.0, muddy)
                shoe(draw, x + 80, y0 + 190, 1.0, muddy)
                K.text_at(draw, lab, x, y0 + 290, font(42, bold=True), ink)
                b = K.stagger(progress, i * 2 + 1, step=0.2, speed=4)
                if b > 0:
                    yes_no(x, y0 + 380, not muddy, size=40)
                    (K.draw_check if not muddy else K.draw_cross)(draw, x + 190, y0 + 50, 30,
                                                                  sage if not muddy else K.DANGER)
            return True
        # aman
        ax = K.lerp(200, 300, K.ease_out_cubic(K.clamp01(progress * 2)))
        kid(draw, ax, 420, 1.0, (13, 148, 136), t, bun=False)
        shoe(draw, ax - 70, 650, 0.8)
        shoe(draw, ax + 70, 660, 0.8)
        K.text_at(draw, "Aman", ax, 760, font(40, bold=True), ink)
        K.text_at(draw, "Muddy?", 640, 300, font(40, bold=True), muted)
        a = K.stagger(progress, 0, step=0.2, speed=4)
        tf_card(draw, 640, 430 + int((1 - a) * 20), False, 0.9)
        b = K.stagger(progress, 1, step=0.2, speed=4)
        if b > 0:
            K.draw_arrow(draw, 760, 430, 830, 430, muted, width=8, head=22)
            not_box(draw, 960, 430, 0.7, t)
            K.draw_arrow(draw, 1080, 430, 1150, 430, muted, width=8, head=22)
        c = K.stagger(progress, 2, step=0.2, speed=4)
        if c > 0:
            tf_card(draw, 1270, 430, True, 0.9)
            K.text_at(draw, "Not muddy!", 1270, 300, font(40, bold=True), sage)
            K.pill(draw, 960, 620, "Rule is true → come in!", sage, size=36)
        door(draw, 1630, 860, 0.85, K.clamp01(progress * 2.4 - 1.2))
        return True

    # ---- games ------------------------------------------------------------------
    if visual == "c7-games":
        if focus == "intro":
            draw.rounded_rectangle((300 + 12, 240 + 14, 1620 + 12, 860 + 14), radius=48, fill=K.SHADOW)
            draw.rounded_rectangle((300, 240, 1620, 860), radius=48, fill=K.DEV_DARK)
            draw.rounded_rectangle((340, 280, 1580, 820), radius=24, fill=(206, 232, 250))
            draw.rectangle((340, 700, 1580, 820), fill=(150, 200, 110))
            draw.rounded_rectangle((340, 760, 1580, 820), radius=24, fill=(120, 170, 90))
            cave(draw, 1340, 710, 0.7, 0.0, t)
            kid(draw, 640, 560 - 30 * abs(math.sin(t * 6)), 0.6, K.CORAL, t, hat="explorer")
            K.draw_key(draw, 860, 470, 0.35, K.GOLD)
            coin(draw, 980, 420 + 8 * math.sin(t * 9), 0.55)
            gem(draw, 1100, 470 + 8 * math.sin(t * 9 + 1), 0.55)
            K.pill(draw, 0, 300, "SCORE 0", K.DEV_DARK, size=30, left=370)
            for i, (wd, col) in enumerate((("AND", AND_C), ("OR", OR_C))):
                a = K.stagger(progress, i + 1, step=0.15, speed=4)
                if a > 0:
                    K.pill(draw, 960 + (i * 2 - 1) * 130, 300 + int((1 - a) * 20), wd, col, size=40)
            return True
        if focus == "cave":
            K.pill(draw, 520, 250, "IF-BOTH", AND_C, size=40)
            K.draw_key(draw, 250, 520, 0.6, K.GOLD)
            K.pill(draw, 480, 488, "AND", AND_C, size=36)
            torch(draw, 680, 520, 1.0, on=True)
            K.draw_arrow(draw, 860, 520, 1010, 520, muted, width=14, head=40)
            open_t = K.clamp01(progress * 1.6 - 0.3)
            cave(draw, 1400, 820, 1.2, open_t, t)
            K.text_at(draw, "Open the cave!", 1400, 300, font(44, bold=True), ink)
            K.text_at(draw, "need both", 480, 640, font(36, bold=True), muted)
            return True
        if focus == "coin":
            K.pill(draw, 520, 250, "IF-EITHER", OR_C, size=40)
            got_coin = progress < 0.5
            coin(draw, 290, 520 - (20 if got_coin else 0), 1.1)
            K.pill(draw, 480, 488, "OR", OR_C, size=36)
            gem(draw, 680, 520 - (0 if got_coin else 20), 1.1)
            draw.ellipse(((290 if got_coin else 680) - 96, 424, (290 if got_coin else 680) + 96, 616),
                         outline=K.GOLD, width=8)
            K.text_at(draw, "either one", 480, 640, font(36, bold=True), muted)
            K.draw_arrow(draw, 860, 520, 1010, 520, muted, width=14, head=40)
            K.shadow_card(draw, (1110, 300, 1700, 760), brand, radius=40, accent=OR_C)
            K.text_at(draw, "SCORE", 1405, 318, font(36, bold=True), panel)
            score = 1 if progress < 0.5 else 2
            K.text_at(draw, str(score), 1405, 420, font(170, bold=True), ink)
            K.pill(draw, 1405, 650, "+1 point!", coral, size=38)
            return True
        # fast
        K.draw_stopwatch(draw, 420, 540, 170, progress * 6, brand)
        K.text_at(draw, "Every second…", 420, 760, font(40, bold=True), muted)
        rules = [("Key AND torch?", AND_C), ("Coin OR gem?", OR_C), ("NOT game over?", NOT_C)]
        for i, (lab, col) in enumerate(rules):
            y = 300 + i * 170
            draw.rounded_rectangle((820, y, 1700, y + 130), radius=34, fill=panel, outline=col, width=5)
            draw.text((870, y + 38), lab, fill=ink, font=font(46, bold=True))
            on = int(t * 18 + i) % 3 != 0
            if on:
                K.draw_check(draw, 1620, y + 65, 34, sage)
            else:
                K.draw_spinner(draw, 1620, y + 65, 30, t, col)
        return True

    # ---- cave game ---------------------------------------------------------------
    if visual == "c7-cave":
        ans = focus == "answer"
        explorers = [("Tia", ("key",), PINK, True), ("Raj", ("torch",), BLUE, False),
                     ("Zoya", ("key", "torch"), K.CORAL, True), ("Neel", (), (13, 148, 136), False)]
        K.pill(draw, cx - (0 if ans else 60), 236, "Rule: key AND torch", AND_C, size=34)
        if not ans:
            K.draw_stopwatch(draw, cx + 260, 266, 32, progress, brand)
        for i, (name, items, body, bun) in enumerate(explorers):
            a = 1.0 if ans else K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1.5) * 430
            y0 = 330 + int((1 - a) * 30)
            win = ans and name == "Zoya"
            out = sage if win else (K.DANGER if ans else None)
            K.shadow_card(draw, (x - 190, y0, x + 190, y0 + 520), brand, radius=32, outline=out,
                          outline_w=6 if out else 3)
            if win:
                draw.rounded_rectangle((x - 184, y0 + 6, x + 184, y0 + 514), radius=28, fill=sage_soft)
            kid(draw, x, y0 + 120, 0.62, body, t if win else 0, bun=bun, hat="explorer")
            K.text_at(draw, name, x, y0 + 228, font(44, bold=True), ink)
            if not items:
                K.text_at(draw, "nothing", x, y0 + 330, font(36, bold=True), muted)
            for j, kind in enumerate(items):
                ix = x if len(items) == 1 else x - 82 + j * 164
                if kind == "key":
                    K.draw_key(draw, ix, y0 + 350, 0.3 if len(items) == 2 else 0.4, K.GOLD)
                else:
                    torch(draw, ix - 10, y0 + 350, 0.6 if len(items) == 2 else 0.8, on=False)
            if ans:
                (K.draw_check if win else K.draw_cross)(draw, x, y0 + 450, 34, sage if win else K.DANGER)
        if ans:
            star_spots([(cx + 700, 280), (cx - 700, 280)])
        return True

    # ---- combo ---------------------------------------------------------------------
    if visual == "c7-combo":
        p1 = focus in ("or", "answer")
        p2 = focus in ("not", "answer")
        kid(draw, 230, 420, 0.95, K.GOLD, t, bun=True)
        sweets(draw, 230, 660, 0.85)
        K.text_at(draw, "Pooja", 230, 760, font(38, bold=True), ink)
        boxes = [(260, 520), (580, 840)]
        for k, (y0, y1) in enumerate(boxes):
            hot = (k == 0 and focus == "or") or (k == 1 and focus == "not")
            done = (k == 0 and p1) or (k == 1 and p2)
            x0, x1 = 440, 1120
            draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=32, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x1, y1), radius=32, fill=sage_soft if done else panel,
                                   outline=coral if hot else (sage if done else line), width=6 if hot else 3)
            draw.text((x0 + 26, y0 + 18), f"Part {k + 1}", fill=muted, font=font(30, bold=True))
            my = (y0 + y1) / 2 + 16
            if k == 0:
                juice(draw, 580, my, 0.8)
                K.pill(draw, 720, my - 30, "OR", OR_C, size=34)
                sweets(draw, 870, my, 0.8)
                if done:
                    K.draw_cross(draw, 620, my - 70, 20, K.DANGER)
                    K.draw_check(draw, 930, my - 70, 22, sage)
            else:
                K.pill(draw, 560, my - 30, "NOT", NOT_C, size=34)
                clock(draw, 740, my, 0.85, late=False)
                K.text_at(draw, "late", 860, my - 24, font(40, bold=True), ink)
                if done:
                    K.text_at(draw, "on time!", 740, my + 60, font(28, bold=True), sage)
            if done:
                tf_card(draw, 1030, my, True, 0.5)
            else:
                draw.ellipse((1030 - 44, my - 44, 1030 + 44, my + 44), outline=WIRE_OFF, width=5)
                K.text_at(draw, "?", 1030, my - 34, font(56, bold=True), muted)
        jx, jy = 1260, 550
        for k, (y0, y1) in enumerate(boxes):
            my = (y0 + y1) / 2 + 16
            col = K.GOLD if ((k == 0 and p1) or (k == 1 and p2)) else WIRE_OFF
            draw.line((1120, my, jx, my), fill=col, width=14)
            draw.line((jx, my, jx, jy), fill=col, width=14)
        out = focus == "answer"
        draw.line((jx, jy, 1480, jy), fill=K.GOLD if out else WIRE_OFF, width=14)
        K.pill(draw, jx, jy - 32, "AND", AND_C, size=34)
        door(draw, 1640, 860, 0.8, K.clamp01(progress * 2.4 - 0.4) if out else 0.0)
        if focus == "ask":
            K.draw_stopwatch(draw, 1640, 330, 40, progress, brand)
            K.text_at(draw, "?", 1640, 520, font(130, bold=True), coral)
        if out:
            K.draw_check(draw, 1760, 400, 34, sage)
            star_spots([(1780, 820), (1500, 300)])
        return True

    # ---- checkpoint --------------------------------------------------------------------
    if visual == "c7-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Can you enter?", cx, 450 + lift, font(64, bold=True), ink)
            party_hat(draw, cx - 200, 640 + lift, 0.9)
            K.pill(draw, cx, 610 + lift, "AND", AND_C, size=40)
            ticket(draw, cx + 210, 640 + lift, 1.0)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "Rule: a hat AND a ticket", 695, 256, font(48, bold=True), AND_C)
        draw.rounded_rectangle((200, 340, 640, 600), radius=28, fill=coral_soft if not ans else red_soft)
        if ans:
            dashed_box((200, 340, 640, 600), K.DANGER, width=4)
            party_hat(draw, 420, 450, 1.0)
            K.draw_cross(draw, 600, 380, 26, K.DANGER)
        else:
            party_hat(draw, 420, 450, 1.0)
        K.text_at(draw, "Hat", 420, 540, font(36, bold=True), ink)
        draw.rounded_rectangle((750, 340, 1190, 600), radius=28, fill=sage_soft)
        ticket(draw, 970, 450, 1.1)
        K.draw_check(draw, 1150, 380, 26, sage)
        K.text_at(draw, "Ticket", 970, 540, font(36, bold=True), ink)
        if ans:
            rows = ["No! AND needs both,", "and the hat is missing."]
            for i, lab in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a > 0:
                    draw.text((190, 650 + i * 80 + int((1 - a) * 10)), lab, fill=ink, font=font(46, bold=True))
        else:
            K.text_at(draw, "You have only a ticket.", 695, 640, font(42, bold=True), muted)
            draw.line((200, 790, 1190, 790), fill=(220, 210, 232), width=3)
        kid(draw, 1560, 470, 1.25, K.CORAL, t, bun=True)
        ticket(draw, 1560, 720, 0.8)
        if ans:
            K.pill(draw, 1560, 230, "Grab a hat!", coral, size=34)
            star_spots([(1360, 330), (1760, 330)])
        else:
            question_marks([(1740, 280)], size=80)
            K.draw_stopwatch(draw, 1380, 300, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------
    if visual == "c7-recap":
        recap = [(("AND: both", "must be true"), AND_C, "and"), (("OR: at least", "one is true"), OR_C, "or"),
                 (("NOT: flip to", "the opposite"), NOT_C, "not"), (("Games use", "if-both, if-either"), K.BOT, "game")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, font(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 540), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 190
                K.pill(draw, ix, y0 + 30, kind.upper() if kind != "game" else "GAMES", col, size=34)
                if kind == "and":
                    cake(draw, ix - 80, iy + 30, 0.75)
                    juice(draw, ix + 80, iy + 30, 0.75)
                    K.draw_check(draw, ix - 80, iy + 110, 20, sage)
                    K.draw_check(draw, ix + 80, iy + 110, 20, sage)
                elif kind == "or":
                    ticket(draw, ix - 80, iy + 30, 0.7)
                    lanyard_pass(draw, ix + 90, iy + 40, 0.7)
                    K.text_at(draw, "or", ix + 4, iy + 10, font(34, bold=True), col)
                elif kind == "not":
                    tf_card(draw, ix - 90, iy + 40, True, 0.6)
                    K.draw_arrow(draw, ix - 14, iy + 40, ix + 14, iy + 40, muted, width=6, head=16)
                    tf_card(draw, ix + 90, iy + 40, False, 0.6)
                else:
                    K.draw_key(draw, ix - 70, iy + 10, 0.3, K.GOLD)
                    torch(draw, ix + 60, iy + 10, 0.55, on=False)
                    coin(draw, ix - 70, iy + 110, 0.5)
                    gem(draw, ix + 60, iy + 110, 0.5)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, ix, y0 + 390 + j * 46, font(36 if len(ln) < 15 else 30, bold=True), ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, K.CORAL, t, hat="party")
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Logic party pro", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
