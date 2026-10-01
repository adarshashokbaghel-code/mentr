"""A18 · Robots & Automation — visuals."""
import math

import build as K

WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
FLOOR = (238, 222, 196)
FLOOR_CLEAN = (250, 240, 222)
DOSA = (226, 160, 70)
DOSA_LIGHT = (244, 196, 118)
JUICE = (255, 168, 40)
CARD = (214, 166, 110)
CARD_DARK = (170, 120, 70)
MARS = (206, 108, 66)
MARS_DARK = (168, 82, 48)
MARS_SKY = (248, 222, 200)
ARM = (255, 178, 44)
ARM_DARK = (232, 140, 30)


def S_(s):
    return lambda v: v * s


def bolt(draw, cx, cy, s, t, face="smile", tray=None, wave=0.0, roll=False):
    """Robot waiter. cy = body centre; head top ≈ cy-262s, wheels ≈ cy+276s."""
    S = S_(s)
    y = cy + S(4) * math.sin(t * math.pi * 6)
    draw.ellipse((cx - S(120), cy + S(252), cx + S(120), cy + S(280)), fill=K.SHADOW)
    for wx in (cx - S(56), cx + S(56)):
        draw.ellipse((wx - S(28), cy + S(212), wx + S(28), cy + S(268)), fill=K.DEV_DEEP)
        draw.ellipse((wx - S(11), cy + S(229), wx + S(11), cy + S(251)), fill=K.STEEL)
        if roll:
            a = t * 30
            draw.line((wx, cy + S(240), wx + S(22) * math.cos(a), cy + S(240) + S(22) * math.sin(a)), fill=K.STEEL,
                      width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(96), y + S(166), cx + S(96), y + S(234)), radius=S(30), fill=K.DEV_DARK)
    arm_w = max(3, int(S(22)))
    lh = (cx - S(132), y + S(70))
    draw.line([(cx - S(84), y - S(46)), lh], fill=K.STEEL_DARK, width=arm_w, joint="curve")
    draw.ellipse((lh[0] - S(18), lh[1] - S(18), lh[0] + S(18), lh[1] + S(18)), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(92) + S(8), y - S(84) + S(10), cx + S(92) + S(8), y + S(180) + S(10)), radius=S(56),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(92), y - S(84), cx + S(92), y + S(180)), radius=S(56), fill=(248, 248, 252),
                           outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.rectangle((cx - S(89), y + S(60), cx + S(89), y + S(84)), fill=K.CORAL)
    draw.ellipse((cx - S(16), y - S(6), cx + S(16), y + S(26)), fill=(13, 148, 136))
    draw.rectangle((cx - S(24), y - S(104), cx + S(24), y - S(82)), fill=K.DEV_MID)
    for sx in (-1, 1):
        ex = cx + sx * S(118)
        draw.rounded_rectangle((ex - S(10), y - S(204), ex + S(10), y - S(156)), radius=S(6), fill=K.CORAL)
    draw.rounded_rectangle((cx - S(112), y - S(262), cx + S(112), y - S(100)), radius=S(44), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(92), y - S(244), cx + S(92), y - S(118)), radius=S(30), fill=K.DEV_DEEP)
    fy = y - S(181)
    ew = max(2, int(S(7)))
    if face == "smile":
        for sx in (-1, 1):
            ex = cx + sx * S(36)
            draw.ellipse((ex - S(12), fy - S(26), ex + S(12), fy - S(2)), fill=K.LED_ON)
        draw.arc((cx - S(34), fy - S(6), cx + S(34), fy + S(36)), 20, 160, fill=K.LED_ON, width=ew)
    elif face == "confused":
        draw.ellipse((cx - S(52), fy - S(30), cx - S(20), fy + S(2)), fill=K.LED_ON)
        draw.ellipse((cx + S(28), fy - S(20), cx + S(44), fy - S(4)), fill=K.LED_ON)
        pts = [(cx - S(28) + k * S(14), fy + S(22) + (S(6) if k % 2 else -S(6))) for k in range(5)]
        draw.line(pts, fill=K.LED_ON, width=ew)
    else:
        for sx in (-1, 1):
            ex = cx + sx * S(36)
            draw.line((ex - S(14), fy - S(12), ex + S(14), fy - S(12)), fill=K.LED_ON, width=ew)
        draw.line((cx - S(22), fy + S(20), cx + S(22), fy + S(20)), fill=K.LED_ON, width=ew)
    if tray:
        rh = (cx + S(184), y - S(26))
    elif wave > 0:
        rh = (cx + S(150) + S(22) * math.sin(wave * math.pi * 6), y - S(150))
    else:
        rh = (cx + S(132), y + S(70))
    draw.line([(cx + S(84), y - S(46)), rh], fill=K.STEEL_DARK, width=arm_w, joint="curve")
    draw.ellipse((rh[0] - S(18), rh[1] - S(18), rh[0] + S(18), rh[1] + S(18)), fill=K.DEV_DARK)
    if tray:
        hx, hy = rh
        draw.rounded_rectangle((hx - S(96), hy - S(18), hx + S(96), hy - S(4)), radius=S(7), fill=K.STEEL_DARK)
        if tray == "dosa":
            dosa(draw, hx, hy - S(34), s * 0.95)
    return rh


def dosa(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(84), cy - S(16), cx + S(84), cy + S(20)), fill=(255, 255, 255), outline=K.STEEL_DARK,
                 width=max(1, int(S(3))))
    pts = [(cx - S(74), cy - S(6)), (cx + S(58), cy - S(34)), (cx + S(72), cy - S(18)), (cx + S(60), cy - S(2)),
           (cx - S(74), cy + S(8))]
    draw.polygon(pts, fill=DOSA)
    draw.line((cx - S(60), cy - S(2), cx + S(56), cy - S(22)), fill=DOSA_LIGHT, width=max(2, int(S(6))))
    draw.ellipse((cx + S(30), cy + S(2), cx + S(58), cy + S(14)), fill=(140, 196, 110))


def table(draw, x0, x1, top, cloth=(255, 240, 230)):
    draw.rectangle((x0 + 40, top + 20, x0 + 64, top + 230), fill=WOOD_DARK)
    draw.rectangle((x1 - 64, top + 20, x1 - 40, top + 230), fill=WOOD_DARK)
    draw.rounded_rectangle((x0 + 6, top + 8, x1 + 6, top + 36), radius=12, fill=K.SHADOW)
    draw.rounded_rectangle((x0, top, x1, top + 28), radius=12, fill=WOOD)
    draw.rectangle((x0 + 24, top + 28, x1 - 24, top + 96), fill=cloth)
    for k in range(int((x1 - x0 - 48) / 40)):
        bx = x0 + 24 + k * 40
        draw.chord((bx, top + 76, bx + 40, top + 116), 0, 180, fill=cloth)


def juice_glass(draw, cx, by, s, tipped=False):
    S = S_(s)
    if not tipped:
        pts = [(cx - S(34), by - S(96)), (cx + S(34), by - S(96)), (cx + S(26), by), (cx - S(26), by)]
        draw.polygon(pts, fill=(238, 247, 253))
        draw.polygon([(cx - S(31), by - S(70)), (cx + S(31), by - S(70)), (cx + S(26), by), (cx - S(26), by)], fill=JUICE)
        draw.polygon(pts, outline=K.DEV_DARK, width=max(2, int(S(4))))
    else:
        pts = [(cx - S(48), by - S(28)), (cx + S(48), by - S(34)), (cx + S(48), by + S(0)), (cx - S(48), by - S(6))]
        draw.polygon(pts, fill=(238, 247, 253), outline=K.DEV_DARK, width=max(2, int(S(4))))


def puddle(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.ellipse((cx - S(150), cy - S(30), cx + S(150), cy + S(30)), fill=JUICE)
    draw.ellipse((cx - S(190), cy - S(10), cx - S(110), cy + S(24)), fill=JUICE)
    draw.ellipse((cx + S(100), cy - S(22), cx + S(200), cy + S(16)), fill=JUICE)
    draw.ellipse((cx - S(60), cy - S(16), cx + S(10), cy - S(4)), fill=(255, 210, 120))


def vacuum(draw, cx, cy, r, t, ang=0.0):
    draw.ellipse((cx - r + r * 0.08, cy - r + r * 0.12, cx + r + r * 0.08, cy + r + r * 0.12), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=K.DEV_DARK)
    a0 = math.degrees(ang)
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0 - 70, a0 + 70, fill=K.STEEL, width=max(3, int(r * 0.12)))
    draw.ellipse((cx - r * 0.74, cy - r * 0.74, cx + r * 0.74, cy + r * 0.74), fill=(236, 238, 242))
    draw.ellipse((cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3), fill=K.DEV_MID)
    lx, ly = cx + math.cos(ang) * r * 0.5, cy + math.sin(ang) * r * 0.5
    draw.ellipse((lx - r * 0.1, ly - r * 0.1, lx + r * 0.1, ly + r * 0.1), fill=K.LED_ON)
    bx, by = cx + math.cos(ang + 0.8) * r * 0.95, cy + math.sin(ang + 0.8) * r * 0.95
    for k in range(3):
        a = t * 40 + k * 2.1
        draw.line((bx, by, bx + math.cos(a) * r * 0.32, by + math.sin(a) * r * 0.32), fill=K.GOLD,
                  width=max(2, int(r * 0.06)))


def robot_arm(draw, bx, by, s, a1, a2, grip=0.0, holding=None):
    S = S_(s)
    draw.rounded_rectangle((bx - S(86) + S(6), by - S(40) + S(8), bx + S(86) + S(6), by + S(8)), radius=S(14),
                           fill=K.SHADOW)
    draw.rounded_rectangle((bx - S(86), by - S(40), bx + S(86), by), radius=S(14), fill=K.DEV_DARK)
    draw.chord((bx - S(60), by - S(110), bx + S(60), by - S(10)), 180, 360, fill=ARM_DARK)
    sh = (bx, by - S(74))
    el = (sh[0] + S(190) * math.cos(a1), sh[1] + S(190) * math.sin(a1))
    wr = (el[0] + S(170) * math.cos(a2), el[1] + S(170) * math.sin(a2))
    draw.line([sh, el], fill=ARM, width=max(4, int(S(46))))
    draw.line([el, wr], fill=ARM_DARK, width=max(4, int(S(36))))
    for p, r in ((sh, 30), (el, 26)):
        draw.ellipse((p[0] - S(r), p[1] - S(r), p[0] + S(r), p[1] + S(r)), fill=K.DEV_DARK)
        draw.ellipse((p[0] - S(r * 0.45), p[1] - S(r * 0.45), p[0] + S(r * 0.45), p[1] + S(r * 0.45)), fill=ARM)
    draw.rounded_rectangle((wr[0] - S(34), wr[1] - S(12), wr[0] + S(34), wr[1] + S(14)), radius=S(6), fill=K.DEV_DARK)
    g = S(22) + S(14) * grip
    for sx in (-1, 1):
        fx = wr[0] + sx * g
        draw.rounded_rectangle((fx - S(7), wr[1] + S(8), fx + S(7), wr[1] + S(56)), radius=S(5), fill=K.DEV_MID)
    if holding == "box":
        box(draw, wr[0], wr[1] + S(118), s * 0.8)
    elif holding == "wheel":
        draw.ellipse((wr[0] - S(30), wr[1] + S(24), wr[0] + S(30), wr[1] + S(84)), fill=K.DEV_DARK)
        draw.ellipse((wr[0] - S(12), wr[1] + S(42), wr[0] + S(12), wr[1] + S(66)), fill=K.STEEL)
    return wr


def box(draw, cx, by, s):
    S = S_(s)
    draw.rectangle((cx - S(60) + S(5), by - S(84) + S(6), cx + S(60) + S(5), by + S(6)), fill=K.SHADOW)
    draw.rectangle((cx - S(60), by - S(84), cx + S(60), by), fill=CARD, outline=CARD_DARK, width=max(2, int(S(4))))
    draw.rectangle((cx - S(12), by - S(84), cx + S(12), by), fill=(236, 210, 160))
    draw.line((cx - S(60), by - S(64), cx + S(60), by - S(64)), fill=CARD_DARK, width=max(1, int(S(3))))


def conveyor(draw, x0, x1, y, t):
    for lx in range(int(x0) + 60, int(x1) - 40, 320):
        draw.rectangle((lx, y + 50, lx + 18, y + 120), fill=K.DEV_MID)
    draw.rounded_rectangle((x0, y, x1, y + 56), radius=28, fill=K.DEV_DARK)
    n = int((x1 - x0 - 40) / 60)
    for k in range(n + 1):
        rx = x0 + 28 + k * 60
        draw.ellipse((rx - 16, y + 12, rx + 16, y + 44), fill=K.DEV_MID)
        a = -t * 40 + k
        draw.line((rx, y + 28, rx + 14 * math.cos(a), y + 28 + 14 * math.sin(a)), fill=K.DEV_DEEP, width=4)
    K.draw_dashed(draw, x0 + 30, y + 4, x1 - 30, y + 4, K.STEEL, width=6, dash=30, gap=20, phase=-t * 300)


def car_side(draw, cx, cy, s, col, front_wheel=True):
    S = S_(s)
    draw.polygon([(cx - S(84), cy - S(26)), (cx - S(52), cy - S(88)), (cx + S(54), cy - S(88)),
                  (cx + S(96), cy - S(26))], fill=col)
    win = (210, 232, 246)
    draw.polygon([(cx - S(70), cy - S(30)), (cx - S(46), cy - S(76)), (cx - S(4), cy - S(76)), (cx - S(4), cy - S(30))],
                 fill=win)
    draw.polygon([(cx + S(8), cy - S(30)), (cx + S(8), cy - S(76)), (cx + S(48), cy - S(76)), (cx + S(80), cy - S(30))],
                 fill=win)
    draw.rounded_rectangle((cx - S(136), cy - S(32), cx + S(136), cy + S(42)), radius=S(24), fill=col)
    draw.rounded_rectangle((cx + S(108), cy - S(16), cx + S(134), cy + S(2)), radius=S(6), fill=K.GOLD)
    for wx, on in ((cx - S(80), True), (cx + S(80), front_wheel)):
        if on:
            draw.ellipse((wx - S(32), cy + S(14), wx + S(32), cy + S(78)), fill=K.DEV_DARK)
            draw.ellipse((wx - S(14), cy + S(32), wx + S(14), cy + S(60)), fill=K.STEEL)
        else:
            draw.ellipse((wx - S(32), cy + S(14), wx + S(32), cy + S(78)), outline=K.DANGER, width=max(2, int(S(5))))


def rover(draw, cx, by, s, t):
    S = S_(s)
    draw.ellipse((cx - S(190), by - S(14), cx + S(190), by + S(14)), fill=MARS_DARK)
    for wx in (cx - S(130), cx, cx + S(130)):
        draw.line((wx, by - S(36), cx + (wx - cx) * 0.6, by - S(100)), fill=K.DEV_MID, width=max(2, int(S(10))))
    for wx in (cx - S(130), cx, cx + S(130)):
        draw.ellipse((wx - S(36), by - S(72), wx + S(36), by), fill=K.DEV_DARK)
        draw.ellipse((wx - S(14), by - S(50), wx + S(14), by - S(22)), fill=K.STEEL)
    draw.rounded_rectangle((cx - S(130), by - S(156), cx + S(130), by - S(92)), radius=S(10), fill=(238, 232, 222),
                           outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.rectangle((cx - S(160), by - S(176), cx + S(160), by - S(156)), fill=K.ROAD)
    for k in range(1, 6):
        gx = cx - S(160) + k * S(53)
        draw.line((gx, by - S(176), gx, by - S(156)), fill=(160, 190, 240), width=max(1, int(S(3))))
    draw.line((cx + S(80), by - S(176), cx + S(80), by - S(280)), fill=K.DEV_DARK, width=max(2, int(S(12))))
    draw.rounded_rectangle((cx + S(40), by - S(320), cx + S(130), by - S(270)), radius=S(10), fill=K.DEV_DARK)
    draw.ellipse((cx + S(96), by - S(310), cx + S(124), by - S(282)), fill=(140, 200, 236))
    if (t * 3) % 1 < 0.2:
        for a in range(-40, 50, 20):
            ra = math.radians(a)
            draw.line((cx + S(140) + math.cos(ra) * S(10), by - S(296) + math.sin(ra) * S(10),
                       cx + S(140) + math.cos(ra) * S(40), by - S(296) + math.sin(ra) * S(40)), fill=K.GOLD,
                      width=max(2, int(S(5))))


def mars(draw, box):
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    draw.rectangle(box, fill=MARS_SKY)
    draw.polygon([(x0, y0 + bh * 0.62), (x0 + bw * 0.25, y0 + bh * 0.44), (x0 + bw * 0.5, y0 + bh * 0.6),
                  (x0 + bw * 0.78, y0 + bh * 0.4), (x1, y0 + bh * 0.58), (x1, y1), (x0, y1)], fill=MARS_DARK)
    draw.rectangle((x0, y0 + bh * 0.7, x1, y1), fill=MARS)
    for fx, fy, r in ((0.12, 0.84, 0.05), (0.86, 0.9, 0.04), (0.7, 0.78, 0.025)):
        rx, ry, rr = x0 + bw * fx, y0 + bh * fy, bw * r
        draw.ellipse((rx - rr, ry - rr * 0.6, rx + rr, ry + rr * 0.6), fill=MARS_DARK)
    draw.ellipse((x1 - bw * 0.2, y0 + bh * 0.1, x1 - bw * 0.1, y0 + bh * 0.1 + bw * 0.1), fill=(255, 236, 210))


def room_floor(draw, box):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=FLOOR)
    for k in range(1, int((y1 - y0) / 60)):
        yy = y0 + k * 60
        draw.line((x0 + 4, yy, x1 - 4, yy), fill=(226, 206, 176), width=2)


def gear(draw, cx, cy, r, col, rot=0.0, teeth=8, hole=(255, 255, 255)):
    pts = []
    n = teeth * 4
    for i in range(n):
        a = rot + i * 2 * math.pi / n
        rr = r if (i % 4) in (0, 1) else r * 0.78
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    draw.polygon(pts, fill=col)
    draw.ellipse((cx - r * 0.34, cy - r * 0.34, cx + r * 0.34, cy + r * 0.34), fill=hole)


def loop_ring(draw, cx, cy, r, col, t, width=24):
    a0 = t * 200
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0, a0 + 300, fill=col, width=width)
    ae = math.radians(a0 + 300)
    ex, ey = cx + r * math.cos(ae), cy + r * math.sin(ae)
    tx, ty = -math.sin(ae), math.cos(ae)
    nx, ny = math.cos(ae), math.sin(ae)
    hl = width * 1.6
    draw.polygon([(ex + tx * hl, ey + ty * hl), (ex + nx * hl * 0.8, ey + ny * hl * 0.8),
                  (ex - nx * hl * 0.8, ey - ny * hl * 0.8)], fill=col)


def bulb(draw, cx, cy, s, lit=True):
    S = S_(s)
    if lit:
        for k in range(8):
            a = k * math.pi / 4
            draw.line((cx + math.cos(a) * S(66), cy + math.sin(a) * S(66), cx + math.cos(a) * S(88),
                       cy + math.sin(a) * S(88)), fill=K.GOLD, width=max(2, int(S(7))))
    draw.ellipse((cx - S(50), cy - S(54), cx + S(50), cy + S(46)), fill=K.GOLD if lit else (230, 226, 216))
    draw.rounded_rectangle((cx - S(26), cy + S(40), cx + S(26), cy + S(76)), radius=S(6), fill=K.STEEL_DARK)
    draw.line((cx - S(26), cy + S(54), cx + S(26), cy + S(54)), fill=K.STEEL, width=max(1, int(S(4))))


def gamepad(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(90), cy - S(46), cx + S(90), cy + S(46)), radius=S(40), fill=K.DEV_DARK)
    draw.rectangle((cx - S(62), cy - S(8), cx - S(26), cy + S(8)), fill=(255, 255, 255))
    draw.rectangle((cx - S(52), cy - S(18), cx - S(36), cy + S(18)), fill=(255, 255, 255))
    draw.ellipse((cx + S(30), cy - S(22), cx + S(50), cy - S(2)), fill=K.CORAL)
    draw.ellipse((cx + S(52), cy - S(2), cx + S(72), cy + S(18)), fill=K.GOLD)


def sad_face(draw, cx, cy, r):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=K.GOLD)
    e = r * 0.12
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.36 - e, cy - r * 0.2 - e, cx + sx * r * 0.36 + e, cy - r * 0.2 + e), fill=K.DEV_DARK)
    draw.arc((cx - r * 0.42, cy + r * 0.22, cx + r * 0.42, cy + r * 0.8), 200, 340, fill=K.DEV_DARK,
             width=max(2, int(r * 0.1)))
    draw.ellipse((cx + r * 0.3, cy + r * 0.02, cx + r * 0.46, cy + r * 0.26), fill=K.WATER_DEEP)


def broom(draw, cx, cy, s):
    S = S_(s)
    draw.line((cx + S(60), cy - S(110), cx - S(10), cy + S(40)), fill=WOOD_DARK, width=max(3, int(S(14))))
    draw.polygon([(cx - S(40), cy + S(20)), (cx + S(14), cy + S(46)), (cx - S(10), cy + S(110)),
                  (cx - S(80), cy + S(80))], fill=K.GOLD)
    for k in range(4):
        x = cx - S(70) + k * S(18)
        draw.line((x + S(16), cy + S(50) + k * S(4), x, cy + S(96) + k * S(2)), fill=ARM_DARK, width=max(1, int(S(4))))


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

    def family(x0):
        K.draw_person(draw, x0 + 150, 500, 0.9, "dad", t)
        K.draw_person(draw, x0 + 370, 510, 0.85, "mom", t)
        K.draw_person(draw, x0 + 570, 560, 0.62, "kid", t)

    def restaurant(spill=0.0, served=True):
        family(1040)
        table(draw, 1020, 1780, 640)
        if served:
            dosa(draw, 1240, 626, 0.9)
        if spill > 0:
            juice_glass(draw, 1580, 636, 1.0, tipped=True)
            draw.rectangle((1620, 640, 1650, 640 + 120 * min(1.0, spill * 2)), fill=JUICE)
            puddle(draw, 1560, 820, 0.4 + 0.6 * K.ease_out_cubic(spill), t)
        else:
            juice_glass(draw, 1580, 640, 1.0)

    # ---- opening -----------------------------------------------------------
    if visual == "a18-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            bolt(draw, cx + 280, 500, 0.72, t, face="smile", wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(60, bold=True), ink)
            stars_around(330, 540)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · HOW APPS WORK", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("INPUT", coral, coral_soft), ("PROCESS", K.BOTH_COLOR, lav_soft), ("OUTPUT", sage, sage_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 105, y - 105, x + 105, y + 105), fill=soft)
                if i == 0:
                    K.draw_device(draw, "keyboard", x, y, 0.5, brand, t=t)
                elif i == 1:
                    gear(draw, x - 20, y + 10, 62, K.BOTH_COLOR, rot=t * 6, hole=soft)
                    gear(draw, x + 50, y - 40, 40, coral, rot=-t * 9, teeth=7, hole=soft)
                else:
                    K.draw_device(draw, "screen", x, y + 20, 0.48, brand, t=t)
                K.text_at(draw, lab, x, y + 124, font(36, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 122, y, x + 258, y, muted, width=8, head=22)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20), "Give · Work · Get back", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Robots & Automation", cx, 360 + lift, font(86, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                bolt(draw, cx - 420, 700 + yy, 0.38, t, face="smile")
                robot_arm(draw, cx, 850 + yy, 0.62, -1.9, -0.2, grip=0.3, holding="box")
                vacuum(draw, cx + 420, 740 + yy, 80, t, ang=t * 3)
            return True
        # word
        for i, (syl, col) in enumerate((("Au", coral), ("to", K.BOTH_COLOR), ("ma", sage), ("tion", K.ROAD))):
            a = K.stagger(progress, i, step=0.1, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 1.5) * 330
            y = 330 + int((1 - a) * 50)
            draw.rounded_rectangle((x - 145, y, x + 145, y + 200), radius=40, fill=panel, outline=col, width=6)
            K.text_at(draw, syl, x, y + 44, font(96, bold=True), col)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            question_marks([(cx - 780, 360), (cx + 780, 380)])
            K.text_at(draw, "Another big word!", cx, 620, font(54, bold=True), muted)
            gear(draw, cx, 770, 50, K.GOLD, rot=t * 6, hole=K.hex_rgb(brand["bg"]))
        return True

    # ---- Bolt the robot waiter ------------------------------------------------
    if visual == "a18-hook":
        if focus == "meet":
            draw.ellipse((620 - 290, 560 - 290, 620 + 290, 560 + 290), fill=blue_soft)
            bolt(draw, 560, 560, 1.0, t, face="smile", tray="dosa")
            K.text_at(draw, "Meet", 1320, 320 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Bolt!", 1320, 390 + lift, font(130, bold=True), coral)
            K.pill(draw, 1320, 600, "the robot waiter", sage, size=38)
            star_spots([(1060, 340), (1590, 330), (1080, 560), (1580, 560)])
            return True
        if focus == "serve":
            p = K.ease_in_out(K.clamp01(progress / 0.5))
            back = K.ease_in_out(K.clamp01((progress - 0.62) / 0.38))
            served = progress > 0.52
            restaurant(served=served)
            bx = K.lerp(380, 800, p) - 420 * back
            bolt(draw, bx, 560, 0.85, t, face="smile", tray="empty" if served else "dosa", roll=True)
            K.pill(draw, 0, 236, "Hot, crispy dosa!", coral, size=36, left=1040)
            return True
        if focus == "ask":
            K.draw_person(draw, 380, 560, 1.15, "kid", t)
            K.draw_bubble(draw, (520, 250, 1150, 410), brand, "Is Bolt happy to see us?", tail="left", size=44)
            draw.ellipse((1450 - 250, 580 - 250, 1450 + 250, 580 + 250), fill=lav_soft)
            bolt(draw, 1450, 590, 0.9, t, face="smile")
            K.draw_heart(draw, 1680, 330 + bounce, 36, coral)
            question_marks([(1230, 280), (1730, 420)])
            K.draw_stopwatch(draw, 760, 700, 56, progress, brand)
            return True
        # truth
        bolt(draw, 450, 580, 0.95, t, face="smile")
        zx0, zy0, zx1, zy1 = 980, 270, 1560, 620
        K.draw_dashed(draw, 545, 360, zx0, zy0 + 40, muted, width=4, phase=t * 100)
        K.draw_dashed(draw, 545, 450, zx0, zy1 - 40, muted, width=4, phase=t * 100)
        draw.rounded_rectangle((zx0 + 10, zy0 + 12, zx1 + 10, zy1 + 12), radius=50, fill=K.SHADOW)
        draw.rounded_rectangle((zx0, zy0, zx1, zy1), radius=50, fill=K.DEV_DARK)
        draw.rounded_rectangle((zx0 + 30, zy0 + 30, zx1 - 30, zy1 - 30), radius=36, fill=K.DEV_DEEP)
        fx, fy = (zx0 + zx1) / 2, (zy0 + zy1) / 2
        for sx in (-1, 1):
            draw.ellipse((fx + sx * 90 - 30, fy - 70, fx + sx * 90 + 30, fy - 10), fill=K.LED_ON)
        draw.arc((fx - 90, fy - 30, fx + 90, fy + 80), 20, 160, fill=K.LED_ON, width=16)
        K.pill(draw, (zx0 + zx1) / 2, 650, "Just a picture!", coral, size=40)
        for k, lab in enumerate(("Happy", "Sad", "Bored")):
            a = K.stagger(progress, k + 1, step=0.12, speed=4)
            if a <= 0:
                continue
            x = 1010 + k * 200
            y = 770 + int((1 - a) * 20)
            draw.rounded_rectangle((x - 90, y, x + 90, y + 74), radius=37, fill=K.DANGER_SOFT, outline=K.DANGER, width=3)
            draw.text((x - 66, y + 18), lab, fill=ink, font=font(32, bold=True))
            K.draw_cross(draw, x + 62, y + 37, 16, K.DANGER)
        return True

    # ---- what is a robot -----------------------------------------------------------
    if visual == "a18-define":
        if focus == "name":
            draw.ellipse((420 - 250, 570 - 250, 420 + 250, 570 + 250), fill=blue_soft)
            bolt(draw, 420, 580, 0.92, t, face="smile")
            K.shadow_card(draw, (760, 250 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A ROBOT is…", 1270, 320 + lift, font(44, bold=True), muted)
            parts = [("a machine", coral), ("that does jobs", ink), ("by following instructions", K.BOTH_COLOR),
                     ("written by people", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1270, 410 + i * 100 + lift + int((1 - a) * 30), font(62, bold=True), col)
            return True
        if focus == "algo":
            draw.rounded_rectangle((130 + 10, 240 + 12, 880 + 10, 860 + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((130, 240, 880, 860), radius=24, fill=(255, 250, 238))
            K.text_at(draw, "Bolt's algorithm", 505, 268, font(48, bold=True), coral)
            K.pill(draw, 505, 340, "the robot's recipe", K.BOTH_COLOR, size=28)
            steps = ["Go to the table", "Give the plate", "Come back"]
            cur = -1 if progress < 0.5 else min(2, int((progress - 0.5) / 0.5 * 3))
            for i, lab in enumerate(steps):
                y = 450 + i * 130
                active = i == cur
                draw.rounded_rectangle((170, y, 840, y + 104), radius=26, fill=coral_soft if active else panel,
                                       outline=coral if active else line, width=4 if active else 2)
                K.pill(draw, 0, y + 26, str(i + 1), coral if i <= cur else muted, size=28, left=192)
                draw.text((270, y + 28), lab, fill=ink, font=font(44, bold=True))
                if i < cur:
                    K.draw_check(draw, 800, y + 52, 22, sage)
            draw.rounded_rectangle((990, 400, 1130, 760), radius=16, fill=WOOD, outline=WOOD_DARK, width=4)
            draw.ellipse((1030, 460, 1090, 520), fill=K.DEV_SCREEN, outline=WOOD_DARK, width=4)
            K.text_at(draw, "Kitchen", 1060, 776, font(30, bold=True), muted)
            table(draw, 1560, 1780, 640)
            if cur < 1:
                p = K.clamp01((progress - 0.5) / (0.5 / 3)) if cur == 0 else 0.0
                bx = K.lerp(1230, 1380, K.ease_in_out(p))
                bolt(draw, bx, 600, 0.55, t, tray="dosa", roll=cur == 0)
            elif cur == 1:
                dosa(draw, 1660, 626, 0.8)
                bolt(draw, 1380, 600, 0.55, t, tray="empty")
            else:
                dosa(draw, 1660, 626, 0.8)
                p = K.clamp01((progress - 0.5 - 2 * 0.5 / 3) / (0.5 / 3))
                bolt(draw, K.lerp(1380, 1230, K.ease_in_out(p)), 600, 0.55, t, roll=True)
            return True
        # nosteps
        bolt(draw, 480, 590, 0.9, t, face="blank")
        dots = int(progress * 6) % 4
        K.draw_bubble(draw, (580, 250, 820, 360), brand, "." * max(1, dots), tail="left", size=56)
        K.draw_robot(draw, 1020, 620, 0.75, t, mood="blank")
        K.pill(draw, 1020, 240, "Remember Robo?", K.BOT, size=32)
        draw.rounded_rectangle((1300 + 8, 330 + 10, 1760 + 8, 800 + 10), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((1300, 330, 1760, 800), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "Steps", 1530, 356, font(44, bold=True), coral)
        for k in range(4):
            yy = 460 + k * 80
            draw.line((1340, yy, 1720, yy), fill=(220, 210, 232), width=3)
        K.text_at(draw, "?", 1530, 470, font(int(150 + 20 * pulse), bold=True), line)
        K.draw_cross(draw, 1700, 370, 30, K.DANGER)
        return True

    # ---- automation & loops ----------------------------------------------------------
    if visual == "a18-loop":
        if focus == "intro":
            draw.ellipse((520 - 270, 560 - 270, 520 + 270, 560 + 270), fill=coral_soft)
            loop_ring(draw, 520, 560, 220, coral, t, width=26)
            vacuum(draw, 520, 560, 110, t, ang=t * 6)
            draw.text((900, 270 + lift), "AUTOMATION", fill=coral, font=font(92, bold=True))
            parts = [("A machine does a job", ink), ("by itself,", ink), ("again and again!", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                draw.text((904, 410 + i * 76 + int((1 - a) * 20)), txt, fill=col, font=font(56, bold=True))
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                y = 680 + int((1 - a) * 20)
                draw.rounded_rectangle((900, y, 1700, y + 110), radius=55, fill=panel, outline=line, width=3)
                K.draw_face(draw, 966, y + 62, 30, "kid", 1.0)
                draw.text((1020, y + 32), "No person doing each step", fill=muted, font=font(40, bold=True))
            return True
        if focus == "vacuum":
            rb = (240, 250, 1260, 860)
            room_floor(draw, rb)
            rows = [310, 430, 550, 670, 790]
            xl, xr = 320, 1180
            path = []
            for k, ry in enumerate(rows):
                path += [(xl, ry), (xr, ry)] if k % 2 == 0 else [(xr, ry), (xl, ry)]
            segs = [math.dist(path[i], path[i + 1]) for i in range(len(path) - 1)]
            total = sum(segs)
            d = total * K.clamp01(progress * 1.05)
            acc = 0.0
            pos, ang, seg_i = path[0], 0.0, 0
            for i, sl in enumerate(segs):
                if acc + sl >= d:
                    r = (d - acc) / sl
                    a, b = path[i], path[i + 1]
                    pos = (K.lerp(a[0], b[0], r), K.lerp(a[1], b[1], r))
                    ang = math.atan2(b[1] - a[1], b[0] - a[0])
                    seg_i = i
                    break
                acc += sl
            else:
                pos, seg_i = path[-1], len(segs) - 1
            for k, ry in enumerate(rows):
                done_row = k * 2 < seg_i
                cur_row = k * 2 == seg_i
                if done_row:
                    draw.rectangle((xl - 50, ry - 50, xr + 50, ry + 50), fill=FLOOR_CLEAN)
                elif cur_row:
                    x0_, x1_ = sorted((path[seg_i][0], pos[0]))
                    draw.rectangle((x0_ - 50, ry - 50, x1_ + 50, ry + 50), fill=FLOOR_CLEAN)
                if not done_row:
                    for j in range(7):
                        dx = xl + 40 + j * 130 + (k % 2) * 50
                        if cur_row and min(path[seg_i][0], pos[0]) - 50 <= dx <= max(path[seg_i][0], pos[0]) + 50:
                            continue
                        draw.ellipse((dx - 7, ry - 20 - 7 + (j % 3) * 18, dx + 7, ry - 20 + 7 + (j % 3) * 18),
                                     fill=(184, 160, 128))
            vacuum(draw, pos[0], pos[1], 48, t, ang=ang)
            turning = seg_i % 2 == 1
            for k, (lab, on) in enumerate((("Go forward", not turning), ("Turn", turning))):
                y = 330 + k * 170
                col = coral if on else line
                draw.rounded_rectangle((1340, y, 1780, y + 130), radius=40, fill=coral_soft if on else panel,
                                       outline=col, width=5 if on else 3)
                K.text_at(draw, lab, 1560, y + 40, font(46, bold=True), ink if on else muted)
            loop_ring(draw, 1560, 760, 70, K.BOTH_COLOR, t, width=14)
            K.text_at(draw, "again!", 1560, 742, font(30, bold=True), K.BOTH_COLOR)
            return True
        if focus == "loop":
            lc = (720, 560)
            K.draw_curve(draw, (lc[0] + 210, 380), (lc[0] + 420, 560), (lc[0] + 210, 740), K.BOTH_COLOR, width=14)
            K.draw_curve(draw, (lc[0] - 210, 740), (lc[0] - 420, 560), (lc[0] - 210, 380), K.BOTH_COLOR, width=14)
            draw.polygon([(lc[0] + 190, 760), (lc[0] + 236, 718), (lc[0] + 250, 772)], fill=K.BOTH_COLOR)
            draw.polygon([(lc[0] - 190, 360), (lc[0] - 236, 402), (lc[0] - 250, 348)], fill=K.BOTH_COLOR)
            for k, (lab, by) in enumerate((("Go forward", 300), ("Turn", 720))):
                on = int(t * 6) % 2 == k
                draw.rounded_rectangle((lc[0] - 210 + 8, by + 10, lc[0] + 210 + 8, by + 130), radius=36, fill=K.SHADOW)
                draw.rounded_rectangle((lc[0] - 210, by, lc[0] + 210, by + 120), radius=36,
                                       fill=coral_soft if on else panel, outline=coral if on else line, width=5)
                K.text_at(draw, lab, lc[0], by + 36, font(46, bold=True), ink)
            K.text_at(draw, "LOOP", lc[0], 500, font(int(100 + 8 * pulse), bold=True), K.BOTH_COLOR)
            draw.ellipse((1460 - 230, 600 - 230, 1460 + 230, 600 + 230), fill=sage_soft)
            K.draw_robot(draw, 1460, 640, 0.78, t, mood="happy", wave=t)
            K.pill(draw, 1460, 236, "Never gets tired!", sage, size=34)
            return True
        # code
        draw.rounded_rectangle((260 + 8, 290 + 10, 1100 + 8, 700 + 10), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((260, 290, 1100, 380), radius=24, fill=K.GOLD)
        draw.rectangle((260, 360, 330, 640), fill=K.GOLD)
        draw.rounded_rectangle((260, 620, 1100, 700), radius=24, fill=K.GOLD)
        draw.text((300, 312), "repeat until the room is clean", fill=ink, font=font(40, bold=True))
        cur = int(t * 6) % 2
        for k, lab in enumerate(("go forward", "turn")):
            y = 400 + k * 110
            draw.rounded_rectangle((330, y, 900, y + 92), radius=20, fill=K.ROAD if cur != k else K.BOT_DARK)
            draw.text((370, y + 22), lab, fill=(255, 255, 255), font=font(44, bold=True))
        loop_ring(draw, 1000, 505, 56, ink, t, width=12)
        rc = (1450, 470)
        draw.ellipse((rc[0] - 220, rc[1] - 180, rc[0] + 220, rc[1] + 180), fill=FLOOR)
        K.draw_dashed(draw, rc[0] - 150, rc[1] - 80, rc[0] + 150, rc[1] - 80, K.STEEL_DARK, width=5, phase=t * 100)
        K.draw_dashed(draw, rc[0] + 150, rc[1] + 10, rc[0] - 150, rc[1] + 10, K.STEEL_DARK, width=5, phase=t * 100)
        K.draw_dashed(draw, rc[0] - 150, rc[1] + 100, rc[0] + 150, rc[1] + 100, K.STEEL_DARK, width=5, phase=t * 100)
        vacuum(draw, rc[0] - 150 + 300 * ((t * 2) % 1), rc[1] - 80, 46, t, ang=0)
        for k, lab in enumerate(("Short", "Clear", "It works!")):
            a = K.stagger(progress, k + 3, step=0.12, speed=4)
            if a <= 0:
                continue
            x = cx + (k - 1) * 360 - 24
            bx = K.pill(draw, x, 770 + int((1 - a) * 20), lab, sage, size=36)
            my = (bx[1] + bx[3]) / 2
            draw.ellipse((bx[2] + 12, my - 22, bx[2] + 56, my + 22), fill=sage)
            K.draw_check(draw, bx[2] + 34, my, 14, panel, bg=sage)
        return True

    # ---- factory robots -------------------------------------------------------------
    if visual == "a18-factory":
        if focus == "arm":
            conveyor(draw, 120, 1800, 740, t)
            period = 520
            shift = (t * 1.6 * period) % period
            ax = 960
            for k in range(-1, 4):
                carx = 180 + k * period + shift
                if carx < 210 or carx > 1710:
                    continue
                car_side(draw, carx, 664, 0.9, [K.ROAD, coral, sage, K.BOTH_COLOR][k % 4],
                         front_wheel=carx + 72 > ax + 40)
            dip = math.sin(t * math.pi * 1.6 * 2) * 0.5 + 0.5
            robot_arm(draw, ax - 300, 560, 1.0, -0.55 - 0.1 * dip, 0.55 + 0.4 * dip, grip=0.2, holding="wheel")
            draw.rounded_rectangle((ax - 400, 560, ax - 200, 740), radius=10, fill=K.STEEL_DARK)
            K.pill(draw, 0, 236, "Car after car…", ink, size=34, left=200)
            K.draw_stopwatch(draw, 1640, 380, 70, progress * 3, brand)
            K.text_at(draw, "all day!", 1640, 470, font(36, bold=True), muted)
            return True
        if focus == "boxes":
            conveyor(draw, 760, 1800, 740, t)
            cyc = (t * 2.0) % 1.0
            for k in range(5):
                bx = 900 + k * 220 + ((t * 2.0 * 220) % 220)
                if bx < 1780:
                    box(draw, bx, 740, 0.85)
            for k in range(2):
                box(draw, 300, 860 - k * 76, 0.85)
            draw.rounded_rectangle((200, 860, 400, 880), radius=6, fill=K.DEV_MID)
            phase = 0.5 - 0.5 * math.cos(cyc * 2 * math.pi)
            a1 = K.lerp(-2.3, -0.9, phase)
            a2 = K.lerp(1.9, 0.9, phase)
            draw.rounded_rectangle((470, 620, 650, 860), radius=10, fill=K.STEEL_DARK)
            robot_arm(draw, 560, 620, 0.95, a1, a2, grip=0.1, holding="box")
            steps = ["Pick up", "Put on belt", "Next box"]
            cur = 0 if cyc < 0.4 else 1 if cyc < 0.7 else 2
            for i, lab in enumerate(steps):
                x = 900 + i * 300
                box_ = (x - 135, 300, x + 135, 370)
                on = i == cur
                draw.rounded_rectangle(box_, radius=35, fill=coral if on else panel, outline=coral if on else line,
                                       width=3)
                K.text_at(draw, lab, x, 314, font(32, bold=True), panel if on else muted)
                if i < 2:
                    K.draw_arrow(draw, x + 142, 335, x + 160, 335, muted, width=6, head=14)
            loop_ring(draw, 1680, 335, 44, K.BOTH_COLOR, t, width=10)
            return True
        # great
        for k, (soft, col) in enumerate(((coral_soft, coral), (sage_soft, sage))):
            x0 = 160 if k == 0 else 1000
            draw.rounded_rectangle((x0, 260, x0 + 760, 860), radius=40, fill=soft, outline=col, width=4)
            K.pill(draw, x0 + 380, 290, "× 1000", col, size=34)
        K.draw_person(draw, 540, 560, 1.2, "kid", 0)
        for k in range(3):
            zx, zy = 700 + k * 50, 430 - k * 50 + 6 * math.sin(t * 8 + k)
            K.text_at(draw, "z", zx, zy, font(40 + k * 10, bold=True), K.BOTH_COLOR)
        K.text_at(draw, "So boring!", 540, 770, font(46, bold=True), coral)
        robot_arm(draw, 1300, 740, 0.85, -1.2 + 0.25 * math.sin(t * 12), 0.4 + 0.3 * math.sin(t * 12), holding="box")
        for k in range(3):
            box(draw, 1560, 740 - k * 72, 0.8)
        K.text_at(draw, "Great at repeat jobs!", 1380, 770, font(46, bold=True), sage)
        if progress > 0.6:
            star_spots([(1100, 420), (1680, 400)])
        return True

    # ---- the juice spill ------------------------------------------------------------
    if visual == "a18-messy":
        if focus == "spill":
            spill = K.clamp01((progress - 0.45) * 2.5)
            restaurant(spill=spill)
            bolt(draw, 520, 580, 0.88, t, face="smile", tray="empty")
            if spill > 0:
                K.pill(draw, 1250, 236, "Splash!", K.DANGER, size=44)
                K.draw_star(draw, 1120, 260, 24 + 6 * pulse, K.GOLD, rot=t * 3)
                K.draw_star(draw, 1400, 258, 24 + 6 * pulse, K.GOLD, rot=t * 3 + 1)
            return True
        if focus == "ask":
            restaurant(spill=1.0)
            bolt(draw, 520, 580, 0.88, t, face="confused", tray="empty")
            K.text_at(draw, "?", 520, 220, font(int(90 + 20 * pulse), bold=True), K.GOLD)
            for k, lab in enumerate(("Clean it up?", "Call for help?")):
                draw.rounded_rectangle((760, 280 + k * 120, 1000 + 60, 370 + k * 120), radius=45, fill=lav_soft,
                                       outline=K.BOTH_COLOR, width=3)
                K.text_at(draw, lab, 910, 304 + k * 120, font(36, bold=True), K.BOTH_COLOR)
            K.draw_stopwatch(draw, 910, 600, 50, progress, brand)
            return True
        if focus == "answer":
            room_floor(draw, (130, 700, 1060, 860))
            puddle(draw, 640, 790, 0.8, t)
            bx = K.lerp(300, 900, K.ease_in_out(progress))
            bolt(draw, bx, 410, 0.8, t, face="smile", roll=True)
            K.shadow_card(draw, (1140, 250, 1790, 860), brand, radius=32, accent=K.BOT)
            K.text_at(draw, "Bolt's steps", 1465, 280, font(42, bold=True), panel)
            steps = ["Go to the table", "Give the plate", "Come back"]
            for i, lab in enumerate(steps):
                y = 370 + i * 108
                a = K.stagger(progress, i, step=0.15, speed=5)
                K.pill(draw, 0, y + 14, str(i + 1), sage if a > 0.5 else muted, size=26, left=1180)
                draw.text((1260, y + 18), lab, fill=ink, font=font(40, bold=True))
                if a > 0.5:
                    K.draw_check(draw, 1740, y + 40, 20, sage)
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                y = 700
                draw.rounded_rectangle((1170, y, 1760, y + 130), radius=24, fill=K.DANGER_SOFT)
                dashed_box((1170, y, 1760, y + 130), K.DANGER, width=4)
                draw.text((1200, y + 18), "Clean a spill?", fill=ink, font=font(40, bold=True))
                draw.text((1200, y + 72), "Not in her steps!", fill=K.DANGER, font=font(34, bold=True))
                K.draw_cross(draw, 1710, y + 65, 26, K.DANGER)
            return True
        # people
        room_floor(draw, (130, 700, 1000, 860))
        shrink = 1 - 0.7 * K.clamp01(progress * 1.4)
        puddle(draw, 620, 790, 0.8 * shrink, t)
        K.draw_person(draw, 420, 470, 1.2, "mom", t)
        cx_ = 620 + 60 * math.sin(t * 14)
        draw.line((470, 600, cx_ - 40, 770), fill=K.SKIN, width=26)
        draw.rounded_rectangle((cx_ - 70, 760, cx_ + 70, 800), radius=12, fill=(13, 148, 136))
        cards = [("People", sage, sage_soft, "great at brand-new, messy jobs"),
                 ("Robots", K.BOT, blue_soft, "need people to give them steps")]
        for k, (title, col, soft, sub) in enumerate(cards):
            a = K.stagger(progress, k + 1, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 290 + k * 260 + int((1 - a) * 30)
            draw.rounded_rectangle((1060 + 8, y + 10, 1790 + 8, y + 210 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((1060, y, 1790, y + 210), radius=40, fill=soft, outline=col, width=5)
            if k == 0:
                K.draw_face(draw, 1150, y + 105, 48, "kid", 1.0)
            else:
                bolt(draw, 1150, y + 135, 0.24, t, face="confused")
            draw.text((1230, y + 40), title, fill=col, font=font(54, bold=True))
            draw.text((1230, y + 120), sub, fill=ink, font=font(34, bold=True))
        return True

    # ---- robot can / can't game ------------------------------------------------------
    jobs = [("box", ("Pack the same", "box 500 times"), True), ("game", ("Invent a", "brand-new game"), False),
            ("sweep", ("Sweep the floor", "every day"), True), ("friend", ("Comfort a", "sad friend"), False)]

    def job_icon(kind, x, y):
        if kind == "box":
            for k, (dx, dy) in enumerate(((-64, 0), (64, 0), (0, -84))):
                box(draw, x + dx, y + 60 + dy, 0.8)
            K.text_at(draw, "500", x, y + 70, font(30, bold=True), ink)
        elif kind == "game":
            bulb(draw, x - 50, y - 20, 0.8)
            gamepad(draw, x + 60, y + 60, 0.7)
        elif kind == "sweep":
            broom(draw, x - 30, y - 10, 1.0)
            vacuum(draw, x + 80, y + 70, 44, t)
        else:
            sad_face(draw, x - 40, y, 62)
            K.draw_heart(draw, x + 76, y + 40, 34, coral)

    if visual == "a18-sort":
        if focus == "intro":
            for k, (lab, col, soft) in enumerate((("ROBOT CAN", sage, sage_soft), ("ROBOT CAN'T", K.DANGER, K.DANGER_SOFT))):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 520
                y = 360 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 260 + 8, y + 10, x + 260 + 8, y + 290), radius=44, fill=K.SHADOW)
                draw.rounded_rectangle((x - 260, y, x + 260, y + 280), radius=44, fill=soft, outline=col, width=6)
                (K.draw_check if k == 0 else K.draw_cross)(draw, x, y + 90, 56, col)
                K.text_at(draw, lab, x, y + 176, font(56, bold=True), col)
            K.draw_robot(draw, cx, 620, 0.8, t, mood="idle")
            return True
        ans = focus == "answer"
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab, can) in enumerate(jobs):
            x0 = x_start + i * (cw + gap)
            bx = (x0, 300, x0 + cw, 830)
            reveal = ans and progress > (0.06 if can else 0.5)
            col = (sage if can else K.DANGER) if reveal else line
            K.shadow_card(draw, bx, brand, radius=30, outline=col, outline_w=6 if reveal else 3)
            mx = x0 + cw / 2
            job_icon(kind, mx, 470)
            label_lines(lab, mx, 650, size=36)
            if reveal:
                K.pill(draw, mx, 320, "CAN" if can else "CAN'T", sage if can else K.DANGER, size=32)
            elif not ans:
                K.pill(draw, mx, 320, "?", K.BOTH_COLOR, size=32)
        if not ans:
            K.pill(draw, cx - 40, 222, "Can a robot do it?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 260, 252, 32, progress, brand)
        else:
            K.pill(draw, cx, 222, "Repeat jobs: CAN · New ideas & feelings: CAN'T", ink, size=30)
        return True

    # ---- home / factory / space ----------------------------------------------------
    if visual == "a18-types":
        specs = [("Home robot", "sweeps your room", coral), ("Factory robot", "builds cars, packs boxes", K.ROAD),
                 ("Space robot", "a rover on Mars", MARS_DARK)]
        n = {"home": 1, "factory": 2, "space": 3, "same": 3}[focus]
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        y0 = 290 if focus == "same" else 250
        for i, (title, sub, col) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            bx = (x0, y0, x0 + cw, 860)
            if i >= n:
                draw.rounded_rectangle(bx, radius=36, fill=(246, 241, 233), outline=line, width=3)
                K.text_at(draw, "?", x0 + cw / 2, 470, font(120, bold=True), line)
                continue
            active = i == n - 1 and focus != "same"
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, y0 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            ib = (x0 + 24, y0 + 24 + yy, x0 + cw - 24, y0 + 380 + yy)
            mx = x0 + cw / 2
            if i == 0:
                room_floor(draw, ib)
                draw.rounded_rectangle((ib[0] + 20, ib[1] + 20, ib[0] + 200, ib[1] + 110), radius=20, fill=K.BOTH_COLOR)
                vx = ib[0] + 120 + (ib[2] - ib[0] - 240) * (0.5 + 0.5 * math.sin(t * 6))
                vacuum(draw, vx, ib[3] - 100, 64, t, ang=0 if math.cos(t * 6) > 0 else math.pi)
            elif i == 1:
                draw.rounded_rectangle(ib, radius=24, fill=blue_soft)
                conveyor(draw, ib[0] + 150, ib[2] - 10, ib[3] - 90, t)
                box(draw, ib[2] - 80 - 60 * ((t * 2) % 1), ib[3] - 90, 0.7)
                robot_arm(draw, ib[0] + 90, ib[3] - 10, 0.62, -1.3 + 0.2 * math.sin(t * 10), 0.3, holding="box")
            else:
                mars(draw, ib)
                rover(draw, mx, ib[3] - 40, 0.78, t)
            K.text_at(draw, title, mx, y0 + 410 + yy, font(48, bold=True), col)
            if focus == "same":
                K.pill(draw, mx, y0 + 472 + yy, "follows steps", sage, size=30)
            else:
                K.text_at(draw, sub, mx, y0 + 476 + yy, font(34, bold=True), muted)
        if focus == "same":
            K.pill(draw, cx, 222, "Same idea: they all follow instructions!", sage, size=32)
        return True

    # ---- finish the algorithm -------------------------------------------------------
    if visual == "a18-finish":
        ans = focus == "answer"
        steps = [("can", "Pick up the can"), ("walk", "Walk to the plant"), ("pour", "Tip the can to pour"),
                 ("back", "Walk back")]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab) in enumerate(steps):
            x0 = x_start + i * (cw + gap)
            bx = (x0, 290, x0 + cw, 800)
            mx = x0 + cw / 2
            if i == 2 and not ans:
                draw.rounded_rectangle(bx, radius=28, fill=coral_soft)
                dashed_box(bx, coral)
                K.text_at(draw, "?", mx, 400, font(int(150 + 24 * pulse), bold=True), coral)
                K.pill(draw, 0, 310, "3", coral, size=28, left=x0 + 20)
                continue
            win = i == 2 and ans
            K.shadow_card(draw, bx, brand, radius=28, outline=sage if win else None, outline_w=6 if win else 3)
            if win:
                draw.rounded_rectangle((bx[0] + 6, bx[1] + 6, bx[2] - 6, bx[3] - 6), radius=24, fill=sage_soft)
                K.draw_check(draw, bx[2] - 44, bx[1] + 44, 26, sage)
            K.pill(draw, 0, 310, str(i + 1), sage if win else coral, size=28, left=x0 + 20)
            if kind == "back":
                K.draw_feet(draw, mx + 30, 520, 0.9)
                K.draw_arrow(draw, mx + 40, 640, mx - 120, 640, coral, width=12, head=34)
            else:
                K.a6_icon(draw, kind, mx, 510, 0.95, t)
            f = font(34, bold=True)
            lines = K.wrap_text(lab, f, cw - 40)
            for j, ln in enumerate(lines):
                K.text_at(draw, ln, mx, 800 - 28 - (len(lines) - j) * 41, f, ink)
            if i < 3:
                K.draw_arrow(draw, x0 + cw + 2, 545, x0 + cw + gap - 2, 545, muted, width=6, head=14)
        if ans:
            K.pill(draw, cx, 222, "Step 3: tip the can!", sage, size=34)
        else:
            K.pill(draw, cx - 40, 222, "What's step 3?", coral, size=34)
            K.draw_stopwatch(draw, cx + 220, 252, 32, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "a18-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like a robot expert!", cx, 450 + lift, font(60, bold=True), ink)
            vacuum(draw, cx, 630 + lift, 60, t, ang=t * 4)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1080, 870), radius=24, fill=(255, 250, 238))
        label_lines(("Why can't a vacuum robot", "invent a new game by itself?"), 605, 262, size=44, col=coral)
        rows = ["It only follows steps people gave it", "Nobody gave it steps for a new game",
                "It can't think up new ideas"]
        for i, lab in enumerate(rows):
            y = 430 + i * 140
            draw.line((180, y + 96, 1030, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 210, y + 40, 24, sage)
                draw.text((250, y + 16), lab, fill=ink, font=font(40, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 605, y - 30, font(110, bold=True), line)
        rc = (1450, 640)
        draw.ellipse((rc[0] - 300, rc[1] - 130, rc[0] + 300, rc[1] + 170), fill=FLOOR)
        vacuum(draw, rc[0] + 80 * math.sin(t * 4), rc[1] + 20, 100, t, ang=0 if math.cos(t * 4) > 0 else math.pi)
        bb = (1170, 250, 1730, 450)
        K.draw_bubble(draw, bb, brand, "", tail="left", size=40)
        if ans:
            K.text_at(draw, "My steps:", 1450, 272, font(34, bold=True), muted)
            K.text_at(draw, "forward, turn, repeat", 1450, 318, font(36, bold=True), ink)
            K.text_at(draw, "no game steps!", 1450, 364, font(32, bold=True), K.DANGER)
        else:
            gamepad(draw, 1390, 350, 0.8)
            K.text_at(draw, "?", 1560, 290, font(90, bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1250, 800, 40, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "a18-recap":
        recap = [(("Robots follow steps,", "no feelings"), coral, "steps"), (("Great at repeat", "jobs: loops!"), sage, "loop"),
                 (("Poor at new,", "messy jobs"), K.DANGER, "messy"), (("Home · Factory ·", "Space robots"), K.ROAD, "types")]
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
                if kind == "steps":
                    bolt(draw, ix - 80, iy + 40, 0.42, t, face="smile")
                    for k in range(3):
                        yy = iy - 90 + k * 60
                        K.pill(draw, 0, yy, str(k + 1), col, size=22, left=ix + 20)
                        draw.rounded_rectangle((ix + 80, yy + 12, ix + 170, yy + 30), radius=9, fill=line)
                elif kind == "loop":
                    loop_ring(draw, ix, iy, 120, col, t, width=18)
                    vacuum(draw, ix, iy, 64, t, ang=t * 6)
                elif kind == "messy":
                    puddle(draw, ix, iy + 60, 0.75, t)
                    bolt(draw, ix, iy - 20, 0.3, t, face="confused")
                else:
                    vacuum(draw, ix - 100, iy + 70, 44, t)
                    robot_arm(draw, ix + 10, iy + 110, 0.4, -1.4, 0.2, holding="box")
                    rover(draw, ix + 110, iy - 20, 0.32, t)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            bolt(draw, cx + 300, 470, 0.6, t, face="smile", wave=t)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Robots follow steps", coral, size=36)
            stars_around(320, 540, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
