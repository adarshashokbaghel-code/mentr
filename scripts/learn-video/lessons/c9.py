"""C9 · Sets — Things That Belong Together — visuals."""
import math

import build as K

RED = (222, 56, 62)
RED_DARK = (170, 34, 42)
ORANGE = (255, 140, 30)
ORANGE_DARK = (212, 96, 12)
YELLOW = (255, 210, 50)
YELLOW_DARK = (214, 156, 20)
MANGO = (255, 190, 40)
MANGO_BLUSH = (255, 132, 40)
GUAVA = (150, 196, 90)
GUAVA_DARK = (104, 152, 60)
WOOD = (214, 170, 120)
WOOD_DARK = (168, 120, 76)
BROWN = (130, 86, 50)
BLUE = (60, 120, 220)
BLUE_DARK = (36, 84, 170)
SAMOSA = (226, 164, 72)
SAMOSA_DARK = (178, 112, 40)
ROTI = (238, 206, 150)
ROTI_SPOT = (184, 128, 70)
CHINTU = (60, 150, 220)
WHITE = (255, 255, 255)


def S_(s):
    return lambda v: v * s


def rot_pts(pts, ang, ox, oy):
    ca, sa = math.cos(ang), math.sin(ang)
    return [(ox + (x - ox) * ca - (y - oy) * sa, oy + (x - ox) * sa + (y - oy) * ca) for x, y in pts]


def chintu(draw, cx, cy, s, t=0.0, wave=None, body=CHINTU):
    """Little boy. cy = face centre; hair top ≈ cy-80s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    draw.polygon([(cx - S(22), cy + S(52)), (cx + S(22), cy + S(52)), (cx, cy + S(80))], fill=WHITE)
    r = S(64)
    K.draw_face(draw, cx, cy, r, "kid", 0.8)
    draw.polygon([(cx - S(10), cy - r * 1.02), (cx + S(18), cy - r * 1.02), (cx + S(24), cy - r * 1.3)], fill=K.HAIR)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.62 - S(10), cy + S(14), cx + sx * r * 0.62 + S(10), cy + S(28)),
                     fill=(246, 160, 150))
    if wave is not None:
        ang = -0.5 + 0.35 * math.sin(wave * math.pi * 6)
        hx, hy = cx + S(96) + math.cos(ang - 1.2) * S(70), cy + S(110) + math.sin(ang - 1.2) * S(70)
        draw.line((cx + S(70), cy + S(120), hx, hy), fill=body, width=max(4, int(S(26))))
        draw.ellipse((hx - S(18), hy - S(18), hx + S(18), hy + S(18)), fill=K.SKIN)


# ---- objects (centre-anchored, about 100px wide at s=1) -----------------------------

def item(draw, kind, x, y, s=1.0, t=0.0):
    S = S_(s)
    lw = max(2, int(S(4)))
    if kind == "mango":
        draw.ellipse((x - S(46) + S(5), y - S(34) + S(6), x + S(46) + S(5), y + S(34) + S(6)), fill=K.SHADOW)
        draw.ellipse((x - S(46), y - S(34), x + S(46), y + S(34)), fill=MANGO)
        draw.chord((x - S(46), y - S(34), x + S(46), y + S(34)), 100, 200, fill=MANGO_BLUSH)
        draw.ellipse((x + S(8), y - S(24), x + S(30), y - S(12)), fill=(255, 236, 170))
        draw.line((x + S(30), y - S(28), x + S(38), y - S(44)), fill=BROWN, width=lw)
        draw.polygon([(x + S(38), y - S(44)), (x + S(64), y - S(52)), (x + S(44), y - S(34))], fill=K.LEAF)
    elif kind == "banana":
        outer = [(x + S(70) * math.cos(math.radians(a)), y - S(50) + S(70) * math.sin(math.radians(a)))
                 for a in range(20, 161, 10)]
        inner = [(x + S(64) * math.cos(math.radians(a)), y - S(62) + S(64) * math.sin(math.radians(a)))
                 for a in range(160, 19, -10)]
        draw.polygon([(px + S(5), py + S(6)) for px, py in outer + inner], fill=K.SHADOW)
        draw.polygon(outer + inner, fill=YELLOW, outline=YELLOW_DARK)
        for px, py in (outer[0], outer[-1]):
            draw.ellipse((px - S(7), py - S(9), px + S(7), py + S(5)), fill=BROWN)
    elif kind == "apple":
        draw.ellipse((x - S(44) + S(5), y - S(36) + S(6), x + S(44) + S(5), y + S(44) + S(6)), fill=K.SHADOW)
        draw.ellipse((x - S(44), y - S(36), x + S(6), y + S(44)), fill=RED)
        draw.ellipse((x - S(6), y - S(36), x + S(44), y + S(44)), fill=RED)
        draw.ellipse((x - S(30), y - S(22), x + S(30), y + S(44)), fill=RED)
        draw.ellipse((x - S(30), y - S(20), x - S(14), y), fill=(255, 150, 150))
        draw.line((x, y - S(30), x + S(6), y - S(52)), fill=BROWN, width=max(2, int(S(6))))
        draw.polygon([(x + S(6), y - S(46)), (x + S(34), y - S(58)), (x + S(18), y - S(38))], fill=K.LEAF)
    elif kind == "guava":
        draw.ellipse((x - S(40) + S(5), y - S(38) + S(6), x + S(40) + S(5), y + S(42) + S(6)), fill=K.SHADOW)
        draw.ellipse((x - S(40), y - S(38), x + S(40), y + S(42)), fill=GUAVA)
        for dx, dy in ((-16, -8), (12, 10), (-4, 20), (18, -16)):
            draw.ellipse((x + S(dx) - S(4), y + S(dy) - S(4), x + S(dx) + S(4), y + S(dy) + S(4)), fill=GUAVA_DARK)
        draw.polygon([(x - S(10), y - S(36)), (x + S(10), y - S(36)), (x, y - S(50))], fill=GUAVA_DARK)
    elif kind == "bat":
        blade = [(x - S(16), y - S(20)), (x + S(16), y - S(20)), (x + S(16), y + S(62)), (x - S(16), y + S(62))]
        handle = [(x - S(7), y - S(62)), (x + S(7), y - S(62)), (x + S(7), y - S(20)), (x - S(7), y - S(20))]
        ang = 0.5
        draw.polygon(rot_pts([(px + S(5), py + S(6)) for px, py in blade], ang, x, y), fill=K.SHADOW)
        draw.polygon(rot_pts(handle, ang, x, y), fill=K.DEV_DARK)
        draw.polygon(rot_pts(blade, ang, x, y), fill=WOOD, outline=WOOD_DARK)
    elif kind in ("football", "redball", "orangeball"):
        r = S(40)
        col = {"football": WHITE, "redball": RED, "orangeball": ORANGE}[kind]
        draw.ellipse((x - r + S(5), y - r + S(6), x + r + S(5), y + r + S(6)), fill=K.SHADOW)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=col, outline=K.DEV_DARK if kind == "football" else None,
                     width=lw)
        if kind == "football":
            pent = [(x + S(14) * math.cos(a), y + S(14) * math.sin(a))
                    for a in [i * 2 * math.pi / 5 - math.pi / 2 for i in range(5)]]
            draw.polygon(pent, fill=K.DEV_DARK)
            for px, py in pent:
                draw.line((px, py, x + (px - x) * 2.6, y + (py - y) * 2.6), fill=K.DEV_DARK, width=lw)
        else:
            dark = RED_DARK if kind == "redball" else ORANGE_DARK
            draw.chord((x - r, y - r, x + r, y + r), -10, 100, fill=dark)
            draw.ellipse((x - r * 0.92, y - r * 0.92, x + r * 0.8, y + r * 0.8), fill=col)
            draw.ellipse((x - S(24), y - S(26), x - S(8), y - S(10)), fill=WHITE)
    elif kind == "car":
        draw.rounded_rectangle((x - S(56) + S(5), y - S(10) + S(6), x + S(56) + S(5), y + S(26) + S(6)),
                               radius=S(12), fill=K.SHADOW)
        draw.polygon([(x - S(28), y - S(10)), (x - S(14), y - S(38)), (x + S(20), y - S(38)), (x + S(36), y - S(10))],
                     fill=RED_DARK)
        draw.polygon([(x - S(20), y - S(12)), (x - S(10), y - S(32)), (x + S(2), y - S(32)), (x + S(2), y - S(12))],
                     fill=K.DEV_SCREEN)
        draw.polygon([(x + S(8), y - S(12)), (x + S(8), y - S(32)), (x + S(18), y - S(32)), (x + S(28), y - S(12))],
                     fill=K.DEV_SCREEN)
        draw.rounded_rectangle((x - S(56), y - S(12), x + S(56), y + S(20)), radius=S(12), fill=RED)
        draw.ellipse((x + S(44), y - S(6), x + S(54), y + S(4)), fill=K.GOLD)
        for wx in (x - S(30), x + S(30)):
            draw.ellipse((wx - S(15), y + S(8), wx + S(15), y + S(38)), fill=K.DEV_DEEP)
            draw.ellipse((wx - S(6), y + S(17), wx + S(6), y + S(29)), fill=K.STEEL)
    elif kind == "leaf":
        pts = [(x - S(46), y + S(30)), (x - S(30), y - S(10)), (x + S(6), y - S(38)), (x + S(48), y - S(42)),
               (x + S(36), y), (x + S(10), y + S(28)), (x - S(26), y + S(34))]
        draw.polygon([(px + S(5), py + S(6)) for px, py in pts], fill=K.SHADOW)
        draw.polygon(pts, fill=K.LEAF)
        draw.line((x - S(46), y + S(30), x + S(40), y - S(36)), fill=(46, 112, 62), width=lw)
    elif kind == "samosa":
        pts = [(x, y - S(44)), (x + S(50), y + S(34)), (x - S(50), y + S(34))]
        draw.polygon([(px + S(5), py + S(6)) for px, py in pts], fill=K.SHADOW)
        draw.polygon(pts, fill=SAMOSA, outline=SAMOSA_DARK)
        draw.line((x - S(50), y + S(34), x + S(50), y + S(34)), fill=SAMOSA_DARK, width=max(3, int(S(6))))
        for k in range(3):
            draw.ellipse((x - S(16) + k * S(14), y + S(4) - (k % 2) * S(10), x - S(10) + k * S(14),
                          y + S(10) - (k % 2) * S(10)), fill=SAMOSA_DARK)
    elif kind == "cricket":
        item(draw, "bat", x - S(10), y, s * 0.9)
        draw.ellipse((x + S(26), y + S(20), x + S(50), y + S(44)), fill=RED)
        draw.arc((x + S(26), y + S(20), x + S(50), y + S(44)), 60, 120, fill=WHITE, width=max(2, int(S(3))))
    elif kind == "kabaddi":
        draw.line((x, y - S(50), x, y + S(50)), fill=K.DEV_MID, width=lw)
        for sx, col in ((-1, CHINTU), (1, ORANGE)):
            hx = x + sx * S(32)
            draw.ellipse((hx - S(14), y - S(46), hx + S(14), y - S(18)), fill=K.SKIN)
            draw.rounded_rectangle((hx - S(14), y - S(16), hx + S(14), y + S(22)), radius=S(8), fill=col)
            draw.line((hx, y - S(8), hx - sx * S(30), y - S(20)), fill=K.SKIN, width=max(3, int(S(7))))
            draw.line((hx - S(6), y + S(20), hx - S(12), y + S(46)), fill=K.DEV_DARK, width=max(3, int(S(7))))
            draw.line((hx + S(6), y + S(20), hx + S(12), y + S(46)), fill=K.DEV_DARK, width=max(3, int(S(7))))
    elif kind in ("pencil", "bluepencil"):
        body = YELLOW if kind == "pencil" else BLUE
        dark = YELLOW_DARK if kind == "pencil" else BLUE_DARK
        ang = -0.7
        shaft = [(x - S(60), y - S(10)), (x + S(34), y - S(10)), (x + S(34), y + S(10)), (x - S(60), y + S(10))]
        tip = [(x + S(34), y - S(10)), (x + S(60), y), (x + S(34), y + S(10))]
        lead = [(x + S(50), y - S(4)), (x + S(60), y), (x + S(50), y + S(4))]
        rub = [(x - S(72), y - S(10)), (x - S(60), y - S(10)), (x - S(60), y + S(10)), (x - S(72), y + S(10))]
        draw.polygon(rot_pts([(px + S(5), py + S(6)) for px, py in shaft + tip[1:2]], ang, x, y), fill=K.SHADOW)
        draw.polygon(rot_pts(shaft, ang, x, y), fill=body)
        draw.polygon(rot_pts([(x - S(60), y - S(2)), (x + S(34), y - S(2)), (x + S(34), y + S(2)),
                              (x - S(60), y + S(2))], ang, x, y), fill=dark)
        draw.polygon(rot_pts(tip, ang, x, y), fill=WOOD)
        draw.polygon(rot_pts(lead, ang, x, y), fill=K.DEV_DEEP)
        draw.polygon(rot_pts(rub, ang, x, y), fill=(240, 140, 150))
    elif kind == "pen":
        ang = -0.7
        body = [(x - S(56), y - S(9)), (x + S(36), y - S(9)), (x + S(36), y + S(9)), (x - S(56), y + S(9))]
        tip = [(x + S(36), y - S(9)), (x + S(58), y), (x + S(36), y + S(9))]
        cap = [(x - S(62), y - S(11)), (x - S(18), y - S(11)), (x - S(18), y + S(11)), (x - S(62), y + S(11))]
        clip = [(x - S(56), y - S(16)), (x - S(26), y - S(16)), (x - S(26), y - S(11)), (x - S(56), y - S(11))]
        draw.polygon(rot_pts([(px + S(5), py + S(6)) for px, py in body], ang, x, y), fill=K.SHADOW)
        draw.polygon(rot_pts(body, ang, x, y), fill=(220, 232, 246))
        draw.polygon(rot_pts(tip, ang, x, y), fill=K.STEEL_DARK)
        draw.polygon(rot_pts(cap, ang, x, y), fill=BLUE)
        draw.polygon(rot_pts(clip, ang, x, y), fill=BLUE_DARK)
    elif kind == "ruler":
        ang = -0.25
        box = [(x - S(70), y - S(16)), (x + S(70), y - S(16)), (x + S(70), y + S(16)), (x - S(70), y + S(16))]
        draw.polygon(rot_pts([(px + S(5), py + S(6)) for px, py in box], ang, x, y), fill=K.SHADOW)
        draw.polygon(rot_pts(box, ang, x, y), fill=WOOD, outline=WOOD_DARK)
        for k in range(9):
            tx = x - S(60) + k * S(15)
            ln = S(12) if k % 2 == 0 else S(7)
            p = rot_pts([(tx, y - S(16)), (tx, y - S(16) + ln)], ang, x, y)
            draw.line(p, fill=WOOD_DARK, width=max(2, int(S(3))))
    elif kind == "bottle":
        draw.rounded_rectangle((x - S(24) + S(5), y - S(36) + S(6), x + S(24) + S(5), y + S(52) + S(6)),
                               radius=S(12), fill=K.SHADOW)
        draw.rounded_rectangle((x - S(12), y - S(56), x + S(12), y - S(40)), radius=S(4), fill=K.DEV_DARK)
        draw.rounded_rectangle((x - S(24), y - S(40), x + S(24), y + S(52)), radius=S(14), fill=(120, 190, 242))
        draw.rectangle((x - S(24), y - S(4), x + S(24), y + S(18)), fill=(62, 142, 222))
        draw.rounded_rectangle((x - S(16), y - S(32), x - S(8), y - S(10)), radius=S(4), fill=WHITE)
    elif kind == "bus":
        draw.rounded_rectangle((x - S(76) + S(5), y - S(36) + S(6), x + S(76) + S(5), y + S(30) + S(6)),
                               radius=S(14), fill=K.SHADOW)
        draw.rounded_rectangle((x - S(76), y - S(40), x + S(76), y + S(26)), radius=S(14), fill=YELLOW,
                               outline=YELLOW_DARK, width=lw)
        for k in range(4):
            wx = x - S(64) + k * S(32)
            draw.rounded_rectangle((wx, y - S(30), wx + S(24), y - S(8)), radius=S(4), fill=K.DEV_SCREEN)
        draw.rounded_rectangle((x + S(48), y - S(30), x + S(68), y + S(14)), radius=S(4), fill=K.DEV_SCREEN)
        draw.rectangle((x - S(76), y + S(2), x + S(40), y + S(8)), fill=K.DEV_DARK)
        for wx in (x - S(44), x + S(44)):
            draw.ellipse((wx - S(16), y + S(12), wx + S(16), y + S(44)), fill=K.DEV_DEEP)
            draw.ellipse((wx - S(6), y + S(22), wx + S(6), y + S(34)), fill=K.STEEL)
    elif kind == "roti":
        draw.ellipse((x - S(48) + S(5), y - S(40) + S(6), x + S(48) + S(5), y + S(40) + S(6)), fill=K.SHADOW)
        draw.ellipse((x - S(48), y - S(40), x + S(48), y + S(40)), fill=ROTI, outline=ROTI_SPOT, width=lw)
        for dx, dy, rr in ((-18, -12, 7), (14, -18, 5), (20, 10, 8), (-8, 16, 6), (-28, 8, 4), (4, -2, 4)):
            draw.ellipse((x + S(dx) - S(rr), y + S(dy) - S(rr), x + S(dx) + S(rr), y + S(dy) + S(rr)), fill=ROTI_SPOT)
    elif kind == "chess":
        draw.ellipse((x - S(40), y + S(40), x + S(40), y + S(54)), fill=K.SHADOW)
        draw.rounded_rectangle((x - S(36), y + S(30), x + S(36), y + S(48)), radius=S(6), fill=K.DEV_DARK)
        draw.polygon([(x - S(22), y + S(32)), (x + S(22), y + S(32)), (x + S(10), y - S(14)), (x - S(10), y - S(14))],
                     fill=K.DEV_DARK)
        draw.rounded_rectangle((x - S(22), y - S(22), x + S(22), y - S(12)), radius=S(4), fill=K.DEV_DARK)
        draw.ellipse((x - S(20), y - S(58), x + S(20), y - S(18)), fill=K.DEV_DARK)
        draw.ellipse((x - S(10), y - S(50), x - S(2), y - S(42)), fill=K.DEV_MID)
    elif kind == "swim":
        draw.ellipse((x - S(16), y - S(30), x + S(16), y + S(2)), fill=K.SKIN)
        draw.chord((x - S(17), y - S(32), x + S(17), y - S(2)), 180, 360, fill=ORANGE)
        draw.arc((x - S(10), y - S(70), x + S(70), y + S(10)), 190, 300, fill=K.SKIN, width=max(4, int(S(10))))
        for k in range(2):
            yy = y + S(14) + k * S(20)
            pts = [(x - S(60) + i * S(8), yy + S(6) * math.sin(i * 0.9 + t * 12)) for i in range(16)]
            draw.line(pts, fill=(62, 142, 222), width=max(3, int(S(6))))
    elif kind == "run":
        lw2 = max(4, int(S(9)))
        draw.ellipse((x + S(2), y - S(56), x + S(30), y - S(28)), fill=K.SKIN)
        draw.line((x + S(12), y - S(26), x - S(2), y + S(10)), fill=CHINTU, width=max(6, int(S(16))))
        draw.line((x + S(8), y - S(18), x + S(34), y - S(4), x + S(46), y - S(22)), fill=K.SKIN, width=lw2)
        draw.line((x + S(8), y - S(18), x - S(20), y - S(10), x - S(30), y + S(6)), fill=K.SKIN, width=lw2)
        draw.line((x - S(2), y + S(10), x + S(24), y + S(26), x + S(20), y + S(52)), fill=K.DEV_DARK, width=lw2)
        draw.line((x - S(2), y + S(10), x - S(20), y + S(34), x - S(44), y + S(36)), fill=K.DEV_DARK, width=lw2)
        for k in range(3):
            draw.line((x - S(70), y - S(20) + k * S(16), x - S(46), y - S(20) + k * S(16)), fill=K.DEV_MID,
                      width=max(2, int(S(4))))


def basket(draw, cx, by, s, kinds=(), label=None, col=None):
    S = S_(s)
    for k, kd in enumerate(kinds):
        item(draw, kd, cx - S(78) + (k % 4) * S(52), by - S(118) - (k // 4) * S(30) + (k % 2) * S(10), s * 0.62)
    pts = [(cx - S(140), by - S(100)), (cx + S(140), by - S(100)), (cx + S(108), by), (cx - S(108), by)]
    draw.polygon([(px + S(8), py + S(10)) for px, py in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=WOOD, outline=WOOD_DARK)
    for k in range(1, 3):
        yy = by - S(100) + k * S(33)
        draw.line((cx - S(140) + k * S(11), yy, cx + S(140) - k * S(11), yy), fill=WOOD_DARK, width=max(2, int(S(4))))
    for k in range(-2, 3):
        draw.line((cx + k * S(52), by - S(100), cx + k * S(40), by), fill=WOOD_DARK, width=max(2, int(S(3))))
    draw.arc((cx - S(110), by - S(190), cx + S(110), by - S(20)), 190, 350, fill=WOOD_DARK, width=max(3, int(S(10))))
    if label:
        K.pill(draw, cx, by + S(16), label, col or K.CORAL, size=max(26, int(S(30))))


def toybox(draw, cx, by, s, kinds=(), label=None, col=None):
    S = S_(s)
    for k, kd in enumerate(kinds):
        item(draw, kd, cx - S(50) + k * S(90), by - S(124), s * 0.72)
    draw.rectangle((cx - S(130) + S(8), by - S(100) + S(10), cx + S(130) + S(8), by + S(10)), fill=K.SHADOW)
    draw.rectangle((cx - S(130), by - S(100), cx + S(130), by), fill=BLUE, outline=BLUE_DARK, width=max(2, int(S(5))))
    draw.rectangle((cx - S(130), by - S(100), cx + S(130), by - S(80)), fill=BLUE_DARK)
    K.text_at(draw, "TOYS", cx, by - S(66), K.load_font(max(26, int(S(36))), bold=True), WHITE)
    if label:
        K.pill(draw, cx, by + S(16), label, col or K.ROAD, size=max(26, int(S(30))))


def toy_car(draw, x, y, s, n, col):
    item(draw, "car", x, y, s)
    K.pill(draw, x, y - 92 * s - 30, str(n), col, size=max(26, int(34 * s)))


def lens_pts(cxv, cyv, r, d):
    th = math.acos(min(1.0, (d / 2) / r))
    ax, bx = cxv - d / 2, cxv + d / 2
    pts = []
    for i in range(25):
        a = -th + 2 * th * i / 24
        pts.append((ax + r * math.cos(a), cyv + r * math.sin(a)))
    for i in range(25):
        a = math.pi - th + 2 * th * i / 24
        pts.append((bx + r * math.cos(a), cyv + r * math.sin(a)))
    return pts


def zones(cxv, cyv, r, d):
    return {"A": (cxv - r, cyv), "B": (cxv + r, cyv), "both": (cxv, cyv)}


def arc_move(p0, p1, a, hop=90):
    return (K.lerp(p0[0], p1[0], a), K.lerp(p0[1], p1[1], a) - math.sin(math.pi * a) * hop)


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
    red_soft = (253, 228, 226)
    yellow_soft = (255, 244, 204)
    wood_soft = (246, 232, 212)
    both_soft = (222, 212, 250)
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

    def qmarks(spots, size=80):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def dashed_circle(x, y, r, col, width=6, n=20):
        for k in range(n):
            a0 = k * 360 / n + progress * 40
            draw.arc((x - r, y - r, x + r, y + r), a0, a0 + 360 / n * 0.6, fill=col, width=width)

    def set_circle(x, y, r, col, soft, label=None, label_y=None, draw_t=1.0):
        draw.ellipse((x - r + 10, y - r + 12, x + r + 10, y + r + 12), fill=K.SHADOW)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=soft)
        if draw_t >= 1:
            draw.ellipse((x - r, y - r, x + r, y + r), outline=col, width=8)
        elif draw_t > 0:
            draw.arc((x - r, y - r, x + r, y + r), -90, -90 + 360 * draw_t, fill=col, width=8)
        if label:
            K.pill(draw, x, label_y if label_y is not None else y - r - 34, label, col, size=34)

    def venn(cxv, cyv, r, d, col_a, col_b, soft_a, soft_b, lab_a, lab_b, hi=False, grow=1.0, lab_size=30):
        rr = r * (0.6 + 0.4 * grow)
        ax, bx = cxv - d / 2, cxv + d / 2
        for x in (ax, bx):
            draw.ellipse((x - rr + 10, cyv - rr + 12, x + rr + 10, cyv + rr + 12), fill=K.SHADOW)
        draw.ellipse((ax - rr, cyv - rr, ax + rr, cyv + rr), fill=soft_a)
        draw.ellipse((bx - rr, cyv - rr, bx + rr, cyv + rr), fill=soft_b)
        if rr > d / 2:
            draw.polygon(lens_pts(cxv, cyv, rr, d), fill=(206, 190, 248) if hi else both_soft)
        draw.ellipse((ax - rr, cyv - rr, ax + rr, cyv + rr), outline=col_a, width=8)
        draw.ellipse((bx - rr, cyv - rr, bx + rr, cyv + rr), outline=col_b, width=8)
        if lab_a:
            K.pill(draw, ax - r * 0.32, cyv - r - 76, lab_a, col_a, size=lab_size)
        if lab_b:
            K.pill(draw, bx + r * 0.32, cyv - r - 76, lab_b, col_b, size=lab_size)

    # ---- opening -------------------------------------------------------------------
    if visual == "c9-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 450, 110, sage, panel, bounce)
            chintu(draw, cx + 280, 420, 1.3, t, wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 560, 320), (cx + 600, 300), (cx - 640, 540), (cx + 660, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (220, 250 + lift, w - 220, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · SORTING", cx, 326 + lift, font(34, bold=True), sage)
            nums = [5, 9, 12, 21, 30]
            for i, n in enumerate(nums):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 440 + i * 260
                s = 0.8 + 0.12 * i
                y = 640 - 10 * i + int((1 - a) * 40)
                toy_car(draw, x, y, s, n, [coral, K.GOLD, sage, K.BOTH_COLOR, K.ROAD][i])
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.draw_arrow(draw, 400, 770, 400 + 1120 * a, 770, muted, width=8, head=26)
                K.text_at(draw, "smallest", 440, 786, font(28, bold=True), muted)
                K.text_at(draw, "biggest", 1480, 786, font(28, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Sets", cx, 350 + lift, font(96, bold=True), ink)
            K.text_at(draw, "Things That Belong Together", cx, 462 + lift, font(40, bold=True), muted)
            groups = [(("mango", "banana", "apple"), red_soft, coral), (("football", "redball", "orangeball"),
                                                                       blue_soft, K.ROAD),
                      (("pencil", "pen", "ruler"), wood_soft, WOOD_DARK)]
            for i, (kinds, soft, col) in enumerate(groups):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 430
                y = 712 + int((1 - a) * 30)
                draw.ellipse((x - 180, y - 120, x + 180, y + 120), fill=soft, outline=col, width=6)
                for k, kd in enumerate(kinds):
                    item(draw, kd, x - 100 + k * 100, y + (22 if k == 1 else -18), 0.7)
            return True
        if focus == "word":
            draw.rounded_rectangle((150, 270, 860, 830), radius=40, fill=(246, 241, 233), outline=line, width=3)
            jumble = [("mango", 280, 380), ("football", 470, 350), ("pencil", 680, 400), ("banana", 300, 600),
                      ("bat", 520, 560), ("apple", 730, 620), ("ruler", 440, 740), ("guava", 690, 760)]
            for k, (kd, x, y) in enumerate(jumble):
                item(draw, kd, x, y + 6 * math.sin(t * 6 + k), 0.9)
            for k, col in enumerate((coral, sage)):
                a = K.stagger(progress, k + 1, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 1200 + k * 400
                dashed_circle(x, 500, 160 * (0.7 + 0.3 * a), col)
                K.text_at(draw, "?", x, 430, font(int(110 + 16 * pulse), bold=True), col)
            K.draw_arrow(draw, 890, 540, 1010, 540, muted, width=8, head=26)
            K.text_at(draw, "What goes where?", 1400, 720, font(56, bold=True), ink)
            return True
        # promise
        draw.ellipse((520 - 260, 560 - 260, 520 + 260, 560 + 260), fill=coral_soft)
        chintu(draw, 520, 500, 1.5, t)
        for k, (kd, dx, dy) in enumerate((("banana", -210, 270), ("football", 220, 260), ("apple", -40, 300))):
            item(draw, kd, 520 + dx, 520 + dy, 0.8)
        K.text_at(draw, "A messy", 1300, 290 + lift, font(104, bold=True), ink)
        K.text_at(draw, "story!", 1300, 410 + lift, font(104, bold=True), coral)
        a = K.stagger(progress, 2, step=0.15, speed=4)
        if a > 0:
            basket(draw, 1130, 790 + int((1 - a) * 30), 0.8)
            toybox(draw, 1480, 790 + int((1 - a) * 30), 0.8)
        return True

    # ---- Chintu's mess ----------------------------------------------------------------
    floor_items = [("mango", 760, 760), ("bat", 980, 700), ("banana", 1180, 790), ("football", 1380, 720),
                   ("apple", 900, 830), ("guava", 1560, 800)]
    if visual == "c9-hook":
        if focus in ("mess", "ask"):
            draw.rounded_rectangle((120, 660, 1800, 870), radius=40, fill=(240, 226, 204))
            for k in range(7):
                draw.line((160 + k * 240, 670, 120 + k * 240, 860), fill=(226, 208, 182), width=4)
            for k, (kd, x, y) in enumerate(floor_items):
                jig = 0
                if focus == "mess":
                    a = K.stagger(progress, k, step=0.06, speed=4)
                    y = K.lerp(470, y, a)
                    x = K.lerp(1500, x, a)
                    jig = 6 * math.sin(t * 20 + k) * (1 - a)
                item(draw, kd, x + jig, y, 1.2)
        if focus == "mess":
            chintu(draw, 330, 470, 1.3, t)
            K.draw_bubble(draw, (470, 250, 760, 380), brand, "Oops!", tail="left", size=56)
            box = [(1540, 520), (1780, 470), (1820, 640), (1580, 690)]
            draw.polygon([(x + 8, y + 10) for x, y in box], fill=K.SHADOW)
            draw.polygon(box, fill=BLUE, outline=BLUE_DARK)
            K.text_at(draw, "TOYS", 1680, 552, font(34, bold=True), WHITE)
            bk = [(1250, 470), (1430, 420), (1460, 560), (1290, 610)]
            draw.polygon([(x + 8, y + 10) for x, y in bk], fill=K.SHADOW)
            draw.polygon(bk, fill=WOOD, outline=WOOD_DARK)
            for k in range(1, 3):
                draw.line((1250 + k * 13, 470 + k * 47, 1430 + k * 10, 420 + k * 47), fill=WOOD_DARK, width=4)
            return True
        if focus == "ask":
            K.draw_person(draw, 280, 420, 1.2, "mom", t)
            K.draw_bubble(draw, (430, 230, 1180, 420), brand, "Put the things that belong together, back together!",
                          tail="left", size=38)
            basket(draw, 1400, 520, 0.8)
            toybox(draw, 1690, 520, 0.8)
            qmarks([(1300, 250), (1560, 230), (1780, 270)], size=70)
            return True
        if focus == "sort":
            basket_x, box_x = 560, 1180
            targets = {"mango": 0, "banana": 1, "apple": 2, "guava": 3}
            start = [("mango", 300, 330), ("bat", 560, 300), ("banana", 820, 340), ("football", 1060, 310),
                     ("apple", 1300, 330), ("guava", 1540, 300)]
            order = ["mango", "banana", "apple", "guava", "bat", "football"]
            fruits_in, sports_in = [], []
            for kd, sx, sy in start:
                i = order.index(kd)
                a = K.ease_in_out(K.clamp01((progress - 0.06 - i * 0.12) * 3.2))
                if a >= 1:
                    (fruits_in if kd in targets else sports_in).append(kd)
                    continue
                if kd in targets:
                    tx = basket_x - 78 + targets[kd] * 52
                    ty = 700
                else:
                    tx = box_x - 50 + (0 if kd == "bat" else 90)
                    ty = 690
                x, y = arc_move((sx, sy), (tx, ty), a, hop=120)
                item(draw, kd, x, y, 1.0 - 0.3 * a)
            basket(draw, basket_x, 820, 1.0, kinds=[k for k in order[:4] if k in fruits_in], label="Fruits", col=coral)
            toybox(draw, box_x, 820, 1.0, kinds=[k for k in order[4:] if k in sports_in], label="Sports", col=K.ROAD)
            chintu(draw, 1620, 560, 1.1, t)
            return True
        # done
        basket(draw, 480, 800, 1.2, kinds=["mango", "banana", "apple", "guava"], label="Fruits", col=coral)
        toybox(draw, 1000, 800, 1.2, kinds=["bat"], label="Sports", col=K.ROAD)
        K.draw_check(draw, 650, 520, 30, sage)
        K.draw_check(draw, 1170, 520, 30, sage)
        draw.ellipse((1500 - 230, 540 - 230, 1500 + 230, 540 + 230), fill=sage_soft)
        chintu(draw, 1480, 480, 1.3, t)
        item(draw, "football", 1640, 700, 1.2)
        if progress > 0.5:
            K.draw_heart(draw, 1640, 300 + bounce, 30, coral)
            K.pill(draw, 1500, 800, "Found it!", sage, size=34)
        star_spots([(760, 330), (240, 380), (1250, 300)])
        return True

    # ---- definition ----------------------------------------------------------------------
    if visual == "c9-define":
        if focus == "name":
            dashed_circle(270, 560, 200, coral)
            basket(draw, 270, 650, 0.9, kinds=["mango", "banana", "apple", "guava"])
            dashed_circle(700, 560, 200, K.ROAD)
            toybox(draw, 700, 650, 0.9, kinds=["bat", "football"])
            a = K.ease_out_cubic(K.clamp01((progress - 0.25) * 2.5))
            if a > 0:
                K.draw_arrow(draw, 930, 560, 930 + 110 * a, 560, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.45) * 2.5))
            if b > 0:
                s = 0.8 + 0.2 * b
                mx, my = 1420, 560
                hw, hh = 340 * s, 180 * s
                K.shadow_card(draw, (mx - hw, my - hh, mx + hw, my + hh), brand, radius=40, outline=coral,
                              outline_w=6)
                K.text_at(draw, "It's called a", mx, my - 120 * s, font(int(42 * s), bold=True), muted)
                K.text_at(draw, "SET", mx, my - 60 * s, font(int(140 * s), bold=True), coral)
            return True
        if focus == "meaning":
            cards = [("Fruits", coral, red_soft), ("Sports things", K.ROAD, blue_soft),
                     ("My school bag", WOOD_DARK, wood_soft)]
            for i, (title, col, soft) in enumerate(cards):
                a = K.stagger(progress, i, step=0.22, speed=3.5)
                if a <= 0:
                    continue
                x0 = 150 + i * 560
                y0 = 250 + int((1 - a) * 50)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 510, y0 + 612), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 600), radius=40, fill=soft, outline=col, width=5)
                K.pill(draw, x0 + 250, y0 + 30, "SET", col, size=30)
                ix = x0 + 250
                if i == 0:
                    basket(draw, ix, y0 + 440, 1.0, kinds=["mango", "banana", "apple", "guava"])
                elif i == 1:
                    toybox(draw, ix, y0 + 440, 1.0, kinds=["bat", "football"])
                else:
                    for k, kd in enumerate(("pencil", "ruler", "pen")):
                        item(draw, kd, ix - 70 + k * 70, y0 + 230 - (k % 2) * 20, 0.8)
                    K.draw_bag(draw, ix, y0 + 360, 1.1, coral)
                K.text_at(draw, title, ix, y0 + 500, font(42, bold=True), ink)
            return True
        # member
        set_circle(560, 580, 280, coral, red_soft, label="FRUITS", label_y=236)
        spots = [("mango", 450, 480), ("banana", 670, 500), ("apple", 470, 680), ("guava", 670, 690)]
        for kd, x, y in spots:
            item(draw, kd, x, y, 1.1)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        if a > 0:
            draw.ellipse((450 - 74, 480 - 66, 450 + 74, 480 + 66), outline=K.GOLD, width=7)
            K.draw_arrow(draw, 1000, 360, 1000 - 440 * a, 440, K.GOLD, width=10, head=30)
            K.pill(draw, 1180, 320, "MEMBER", K.GOLD, size=40, fg=ink)
        b = K.stagger(progress, 3, step=0.15, speed=4)
        if b > 0:
            draw.rounded_rectangle((1060, 500, 1760, 840), radius=36, fill=panel, outline=line, width=3)
            item(draw, "football", 1200, 650 + int((1 - b) * 30), 1.4)
            K.draw_cross(draw, 1280, 580, 28, K.DANGER)
            K.text_at(draw, "Football?", 1530, 580, font(46, bold=True), ink)
            K.text_at(draw, "Not a fruit!", 1530, 650, font(40, bold=True), K.DANGER)
            K.text_at(draw, "Not a member", 1530, 720, font(34, bold=True), muted)
        return True

    # ---- what belongs? ---------------------------------------------------------------------
    if visual == "c9-belong":
        if focus == "fruits":
            set_circle(760, 580, 290, coral, red_soft, label="SET: FRUITS", label_y=232)
            spots = [("mango", 640, 470), ("banana", 890, 490), ("apple", 640, 690), ("guava", 880, 690)]
            src = (1520, 640)
            left = []
            for i, (kd, x, y) in enumerate(spots):
                a = K.ease_in_out(K.clamp01((progress - i * 0.14) * 3))
                if a <= 0:
                    left.append(kd)
                    continue
                px, py = arc_move(src, (x, y), a, hop=220)
                item(draw, kd, px, py, 0.8 + 0.6 * a)
                if a >= 1:
                    K.draw_check(draw, x + 66, y - 56, 22, sage)
            basket(draw, 1520, 760, 1.1, kinds=left)
            if progress > 0.75:
                K.pill(draw, 1520, 360, "All belong!", sage, size=40)
            return True
        odd = focus == "odd"
        draw.ellipse((300 + 10, 300 + 12, 1300 + 10, 830 + 12), fill=K.SHADOW)
        draw.ellipse((300, 300, 1300, 830), fill=blue_soft, outline=K.ROAD, width=8)
        K.pill(draw, 800, 232, "SET: SPORTS", K.ROAD, size=34)
        members = [("cricket", "Cricket"), ("kabaddi", "Kabaddi"), ("football", "Football"), ("samosa", "Samosa")]
        for i, (kd, lab) in enumerate(members):
            x = 455 + i * 230
            y = 530 + (30 if i % 2 else 0)
            if kd == "samosa" and odd:
                a = K.ease_in_out(K.clamp01((progress - 0.05) * 2.5))
                x, y = arc_move((x, y), (1570, 500), a, hop=120)
            item(draw, kd, x, y, 1.5)
            K.text_at(draw, lab, x, y + 96, font(34, bold=True), ink)
            if odd and kd != "samosa":
                K.draw_check(draw, x + 70, y - 72, 22, sage)
        if not odd:
            qmarks([(1440, 330), (1640, 420), (1500, 620)], size=90)
            K.draw_stopwatch(draw, 1640, 760, 56, progress, brand)
        elif progress > 0.45:
            K.draw_cross(draw, 1690, 400, 30, K.DANGER)
            K.pill(draw, 1570, 680, "A snack,", K.DANGER, size=34)
            K.pill(draw, 1570, 760, "not a sport!", K.DANGER, size=34)
        return True

    # ---- one circle ----------------------------------------------------------------------------
    if visual == "c9-circle":
        ccx, ccy, cr = 700, 580, 290
        set_circle(ccx, ccy, cr, RED, red_soft, label="RED THINGS", label_y=232,
                   draw_t=K.clamp01(progress * 1.6) if focus == "circle" else 1.0)
        waiting = [("apple", 1460, 340), ("car", 1460, 500), ("redball", 1460, 660), ("leaf", 1640, 600)]
        inside = [(590, 470), (800, 560), (620, 700)]
        for i, (kd, x, y) in enumerate(waiting):
            if kd != "leaf":
                if focus == "circle":
                    a = 0.0
                elif focus == "inside":
                    a = K.ease_in_out(K.clamp01((progress - 0.05 - i * 0.22) * 3))
                else:
                    a = 1.0
                x, y = arc_move((x, y), inside[i], a, hop=80)
                item(draw, kd, x, y, 1.5)
                if a >= 1:
                    K.draw_check(draw, x + 74, y - 60, 20, sage)
            else:
                if focus == "outside":
                    item(draw, kd, 1180, 600 + 6 * math.sin(t * 6), 1.3)
                    K.draw_cross(draw, 1250, 520, 24, K.DANGER)
                else:
                    item(draw, kd, x, y, 1.0)
        if focus == "circle":
            K.text_at(draw, "Waiting…", 1540, 790, font(32, bold=True), muted)
        if focus == "outside":
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, 0, 340, "Inside = belongs", sage, size=36, left=1320)
                K.pill(draw, 0, 440, "Outside = doesn't", coral, size=36, left=1320)
            K.text_at(draw, "Not red!", 1180, 700, font(36, bold=True), K.DANGER)
        return True

    # ---- the Venn diagram -------------------------------------------------------------------------
    if visual == "c9-venn":
        vx, vy, vr, vd = 860, 600, 260, 340
        z = zones(vx, vy, vr, vd)
        wait = (1640, 380)
        out_spot = (1640, 690)
        order = ["setup", "car", "orange", "ask", "middle", "banana", "spots"]
        step = order.index(focus)
        grow = K.ease_out_cubic(K.clamp01(progress * 2)) if focus == "setup" else 1.0
        venn(vx, vy, vr, vd, RED, ORANGE, red_soft, (255, 236, 214), "A · RED THINGS", "B · ROUND THINGS",
             hi=step >= 4, grow=grow)

        def place(kd, target, at_step, s=1.4):
            if step < at_step:
                return
            if step == at_step:
                a = K.ease_in_out(K.clamp01((progress - 0.25) * 2.5))
                x, y = arc_move(wait, target, a, hop=90)
            else:
                x, y = target
            item(draw, kd, x, y, s)

        place("car", (z["A"][0] - 10, z["A"][1]), 1)
        place("orangeball", (z["B"][0] + 10, z["B"][1]), 2)
        if focus == "ask":
            item(draw, "redball", wait[0], wait[1], 1.3)
            K.text_at(draw, "?", wait[0] + 90, wait[1] - 110, font(int(90 + 16 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1640, 650, 56, progress, brand)
            K.text_at(draw, "Red? Yes. Round? Yes.", 1600, 750, font(30, bold=True), muted)
        place("redball", z["both"], 4, 1.25)
        place("banana", out_spot, 5, 1.4)
        if focus == "setup":
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                K.text_at(draw, "VENN", 1620, 420 + int((1 - a) * 30), font(80, bold=True), K.BOTH_COLOR)
                K.text_at(draw, "DIAGRAM", 1620, 510 + int((1 - a) * 30), font(64, bold=True), K.BOTH_COLOR)
                K.text_at(draw, "two circles", 1620, 610, font(34, bold=True), muted)
        if focus in ("car", "orange"):
            kd = "car" if focus == "car" else "orangeball"
            qa = [("Red?", focus == "car"), ("Round?", focus == "orange")]
            for k, (q, yes) in enumerate(qa):
                y = 560 + k * 100
                if progress < 0.15 + k * 0.12:
                    continue
                K.text_at(draw, q, 1560, y, font(40, bold=True), ink)
                (K.draw_check if yes else K.draw_cross)(draw, 1720, y + 24, 26, sage if yes else K.DANGER)
            if progress > 0.55:
                K.text_at(draw, "Only A" if focus == "car" else "Only B", 1640, 790, font(40, bold=True),
                          RED if focus == "car" else ORANGE_DARK)
        if (step > 4 or (step == 4 and progress > 0.6)) and focus != "spots":
            K.pill(draw, vx, vy + 70, "BOTH", K.BOTH_COLOR, size=28)
        if focus == "middle" and progress > 0.6:
            star_spots([(vx - 60, 250), (vx + 60, 250)])
        if focus == "banana":
            if progress > 0.65:
                K.pill(draw, out_spot[0], out_spot[1] + 80, "NEITHER", muted, size=32)
            K.text_at(draw, "Not red · Not round", 1600, 470, font(32, bold=True), muted)
        if focus == "spots":
            labs = [("Only A", z["A"][0] - 10, RED), ("Both", vx, K.BOTH_COLOR), ("Only B", z["B"][0] + 10, ORANGE_DARK)]
            for k, (lab, x, col) in enumerate(labs):
                a = K.stagger(progress, k, step=0.15, speed=4)
                if a > 0:
                    K.pill(draw, x, vy + 80 + int((1 - a) * 20), lab, col, size=28)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, out_spot[0], out_spot[1] + 80 + int((1 - a) * 20), "Neither", muted, size=28)
        return True

    # ---- school bag --------------------------------------------------------------------------------
    if visual == "c9-bag":
        vx, vy, vr, vd = 1120, 610, 250, 330
        z = zones(vx, vy, vr, vd)
        venn(vx, vy, vr, vd, coral, WOOD_DARK, coral_soft, wood_soft, "A · WRITE WITH", "B · MADE OF WOOD",
             hi=focus != "setup", lab_size=28)
        bag_x, bag_y = 300, 640
        draw.ellipse((bag_x - 200, bag_y - 230, bag_x + 200, bag_y + 170), fill=sage_soft)
        K.text_at(draw, "Chintu's bag", bag_x, 250, font(36, bold=True), ink)
        peek = {"pencil": (bag_x - 85, bag_y - 185), "pen": (bag_x - 20, bag_y - 200),
                "ruler": (bag_x + 60, bag_y - 175), "bottle": (bag_x + 108, bag_y - 180)}
        targets = {"pencil": z["both"], "pen": (z["A"][0] - 10, vy), "ruler": (z["B"][0] + 10, vy),
                   "bottle": (1770, 700)}
        timing = {"pencil": ("pencil", 0.25), "pen": ("rest", 0.05), "ruler": ("rest", 0.35),
                  "bottle": ("rest", 0.65)}
        stage = {"setup": 0, "pencil": 1, "rest": 2}[focus]
        moving = []
        for kd in ("bottle", "ruler", "pen", "pencil"):
            when, delay = timing[kd]
            wstage = {"pencil": 1, "rest": 2}[when]
            if stage < wstage:
                a = 0.0
            elif stage == wstage:
                a = K.ease_in_out(K.clamp01((progress - delay) * 3.2))
            else:
                a = 1.0
            if a <= 0:
                item(draw, kd, peek[kd][0], peek[kd][1], 0.9)
            else:
                moving.append((kd, a))
        K.draw_bag(draw, bag_x, bag_y, 1.5, coral)
        for kd, a in moving:
            x, y = arc_move(peek[kd], targets[kd], a, hop=140)
            item(draw, kd, x, y, 0.9 + 0.35 * a)
            if a >= 1 and kd == "bottle":
                K.pill(draw, 1770, 790, "Neither", muted, size=28)
        if focus == "pencil" and progress > 0.6:
            K.pill(draw, vx, vy + 90, "BOTH", K.BOTH_COLOR, size=28)
        return True

    # ---- sorting game: yellow / eat ------------------------------------------------------------------
    if visual == "c9-game":
        vx, vy, vr, vd = 960, 620, 245, 330
        z = zones(vx, vy, vr, vd)
        venn(vx, vy, vr, vd, YELLOW_DARK, sage, yellow_soft, sage_soft, "A · YELLOW THINGS", "B · THINGS YOU EAT",
             hi=focus == "more", lab_size=28)
        chintu(draw, 250, 520, 1.05, t, wave=t if focus == "intro" else None)
        K.pill(draw, 250, 270, "Sorting game!", coral, size=32)
        wait = (1640, 400)
        out_spot = (1640, 720)
        bus_target = (z["A"][0] - 10, vy)
        if focus == "intro":
            for k, (kd, lab) in enumerate((("bus", "Bus"), ("banana", "Banana"), ("roti", "Roti"),
                                           ("bluepencil", "Blue pencil"))):
                a = K.stagger(progress, k + 1, step=0.12, speed=4)
                if a > 0:
                    x, y = 1525 + (k % 2) * 220, 400 + (k // 2) * 230 + int((1 - a) * 30)
                    item(draw, kd, x, y, 1.0)
                    K.text_at(draw, lab, x, y + 66, font(28, bold=True), ink)
            return True
        if focus == "ask":
            item(draw, "bus", wait[0], wait[1], 1.3)
            K.text_at(draw, "?", wait[0], wait[1] - 170, font(int(80 + 16 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1640, 650, 56, progress, brand)
            return True
        if focus == "answer":
            a = K.ease_in_out(K.clamp01((progress - 0.05) * 2.5))
            x, y = arc_move(wait, bus_target, a, hop=10)
            item(draw, "bus", x, y, 1.3 - 0.15 * a)
            if a >= 1:
                K.pill(draw, bus_target[0], vy + 80, "Only A", YELLOW_DARK, size=28)
                K.text_at(draw, "Yellow? Yes!", 1630, 420, font(38, bold=True), ink)
                K.text_at(draw, "Eat it? NO!", 1630, 490, font(38, bold=True), K.DANGER)
                K.text_at(draw, "Crunch!", 1630, 600, font(int(52 + 8 * pulse), bold=True), coral)
            return True
        # more
        item(draw, "bus", bus_target[0], bus_target[1] - 20, 1.15)
        plan = [("banana", z["both"], 0.0, "Both"), ("roti", (z["B"][0] + 10, vy), 0.3, "Only B"),
                ("bluepencil", out_spot, 0.6, "Neither")]
        for k, (kd, target, delay, lab) in enumerate(plan):
            src = (1560 + k * 110, 440)
            a = K.ease_in_out(K.clamp01((progress - delay) * 3.5))
            x, y = arc_move(src, target, a, hop=30)
            item(draw, kd, x, y, 1.0 if kd == "banana" else 1.2)
            if a >= 1:
                ly = vy + 80 if kd != "bluepencil" else out_spot[1] + 80
                K.pill(draw, target[0], ly, lab, K.BOTH_COLOR if lab == "Both" else sage if lab == "Only B" else muted,
                       size=28)
        return True

    # ---- ball games / team games ---------------------------------------------------------------------
    if visual == "c9-games":
        cards = [("run", "Running race"), ("chess", "Chess"), ("swim", "Swimming"), ("football", "Football")]
        vx, vy, vr, vd = 780, 680, 185, 250
        z = zones(vx, vy, vr, vd)
        venn(vx, vy, vr, vd, K.ROAD, coral, blue_soft, coral_soft, None, None, hi=focus == "answer")
        K.pill(draw, vx - vd / 2 - 70, 430, "A · Ball games", K.ROAD, size=28)
        K.pill(draw, vx + vd / 2 + 70, 430, "B · Team games", coral, size=28)
        tray = (1200, 470, 1800, 866)
        draw.rounded_rectangle((tray[0] + 8, tray[1] + 10, tray[2] + 8, tray[3] + 10), radius=32, fill=K.SHADOW)
        draw.rounded_rectangle(tray, radius=32, fill=(244, 240, 233), outline=line, width=3)
        K.text_at(draw, "Outside · neither", 1500, 490, font(32, bold=True), muted)
        ans = focus == "answer"
        for i, (kd, lab) in enumerate(cards):
            a = K.stagger(progress, i, step=0.1, speed=5) if focus == "setup" else 1.0
            if a <= 0:
                continue
            x0 = 300 + i * 340
            y0 = 236 + int((1 - a) * 30)
            K.shadow_card(draw, (x0, y0, x0 + 300, y0 + 170), brand, radius=26,
                          outline=sage if ans and kd == "football" else None, outline_w=6 if ans and kd == "football" else 3)
            mv = K.ease_in_out(K.clamp01((progress - 0.08 - (0 if kd == "football" else 0.2 + i * 0.12)) * 3)) if ans else 0
            home = (x0 + 150, y0 + 70)
            if kd == "football":
                target = z["both"]
            else:
                target = (1320 + i * 180, 680)
            if mv > 0:
                draw.ellipse((home[0] - 40, home[1] - 40, home[0] + 40, home[1] + 40), outline=line, width=4)
                x, y = arc_move(home, target, mv, hop=60)
                item(draw, kd, x, y, 0.8 + (0.15 if kd != "football" else 0.0) * mv)
            else:
                item(draw, kd, home[0], home[1], 0.8)
            K.text_at(draw, lab, x0 + 150, y0 + 122, font(28, bold=True), ink)
        if focus == "ask":
            K.text_at(draw, "?", vx, vy - 60, font(int(90 + 16 * pulse), bold=True), K.BOTH_COLOR)
            K.draw_stopwatch(draw, 1500, 690, 60, progress, brand)
        if focus == "setup":
            K.text_at(draw, "Ball?", z["A"][0] - 20, vy - 30, font(36, bold=True), K.ROAD)
            K.text_at(draw, "Team?", z["B"][0] + 20, vy - 30, font(36, bold=True), coral)
            K.text_at(draw, "Which game goes where?", 1500, 650, font(32, bold=True), muted)
        if ans and progress > 0.5:
            K.pill(draw, vx, vy + 120, "Ball AND team!", K.BOTH_COLOR, size=26)
            K.text_at(draw, "No ball · No team", 1500, 800, font(30, bold=True), muted)
        return True

    # ---- number sets ------------------------------------------------------------------------------------
    if visual == "c9-numbers":
        a_nums, b_nums = [2, 4, 6, 8], [3, 6, 9]
        card_a = (180, 300, 900, 640)
        card_b = (1020, 300, 1740, 640)

        def tile(n, x, y, col, size=104, hi=False):
            hs = size / 2
            draw.rounded_rectangle((x - hs + 6, y - hs + 8, x + hs + 6, y + hs + 8), radius=22, fill=K.SHADOW)
            draw.rounded_rectangle((x - hs, y - hs, x + hs, y + hs), radius=22, fill=K.BOTH_COLOR if hi else panel,
                                   outline=col, width=6)
            K.text_at(draw, str(n), x, y - size * 0.36, font(int(size * 0.62), bold=True), WHITE if hi else col)

        a_home = [(card_a[0] + 130 + i * 155, 500) for i in range(4)]
        b_home = [(card_b[0] + 200 + i * 160, 500) for i in range(3)]
        if focus in ("setup", "ask"):
            for k, (box, lab, col, nums, homes) in enumerate(((card_a, "SET A", coral, a_nums, a_home),
                                                              (card_b, "SET B", sage, b_nums, b_home))):
                a = K.stagger(progress, k, step=0.2, speed=4) if focus == "setup" else 1.0
                if a <= 0:
                    continue
                dy = int((1 - a) * 40)
                K.shadow_card(draw, (box[0], box[1] + dy, box[2], box[3] + dy), brand, radius=36, accent=col)
                K.text_at(draw, lab, (box[0] + box[2]) / 2, box[1] + 18 + dy, font(36, bold=True), WHITE)
                for n, (x, y) in zip(nums, homes):
                    tile(n, x, y + dy, col)
            if focus == "ask":
                mx = K.lerp(500, 1400, 0.5 + 0.5 * math.sin(progress * math.pi * 2))
                K.draw_magnifier(draw, mx, 760, 1.0, K.BOTH_COLOR)
                K.text_at(draw, "In BOTH sets?", cx, 690, font(44, bold=True), ink)
                K.draw_stopwatch(draw, 1640, 770, 50, progress, brand)
            else:
                K.text_at(draw, "Even numbers", 540, 690, font(34, bold=True), muted)
                K.text_at(draw, "Counting in threes", 1380, 690, font(34, bold=True), muted)
            return True
        # answer
        vx, vy, vr, vd = 960, 620, 255, 330
        venn(vx, vy, vr, vd, coral, sage, coral_soft, sage_soft, "SET A", "SET B", hi=True,
             grow=K.ease_out_cubic(K.clamp01(progress * 3)))
        a_spots = {2: (vx - 330, 520), 4: (vx - 380, 660), 8: (vx - 250, 740)}
        b_spots = {3: (vx + 320, 540), 9: (vx + 330, 700)}
        mv = K.ease_in_out(K.clamp01((progress - 0.2) * 2.4))
        for n, home in zip(a_nums, a_home):
            target = a_spots.get(n, (vx, vy))
            x, y = K.lerp(home[0], target[0], mv), K.lerp(home[1], target[1], mv)
            tile(n, x, y, coral, size=96, hi=n == 6 and mv >= 1)
        for n, home in zip(b_nums, b_home):
            target = b_spots.get(n, (vx, vy))
            x, y = K.lerp(home[0], target[0], mv), K.lerp(home[1], target[1], mv)
            if n == 6 and mv >= 1:
                continue
            tile(n, x, y, sage, size=96)
        if mv >= 1:
            K.pill(draw, vx, vy + 80, "BOTH", K.BOTH_COLOR, size=28)
            star_spots([(vx - 70, 270), (vx + 70, 270)])
        return True

    # ---- checkpoint ----------------------------------------------------------------------------------------
    if visual == "c9-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 290 + lift, w - 420, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Sort like a detective!", cx, 460 + lift, font(64, bold=True), ink)
            K.draw_magnifier(draw, cx - 90, 620 + lift, 0.9, coral)
            K.draw_check(draw, cx + 90, 620 + lift, 44, sage)
            return True
        vx, vy, vr, vd = 860, 620, 255, 340
        z = zones(vx, vy, vr, vd)
        venn(vx, vy, vr, vd, RED, sage, red_soft, sage_soft, "A · RED THINGS", "B · THINGS YOU EAT",
             hi=focus != "ask", lab_size=28)
        wait = (1620, 430)
        if focus == "ask":
            item(draw, "apple", wait[0], wait[1], 1.5)
            K.text_at(draw, "?", wait[0] + 110, wait[1] - 130, font(int(90 + 16 * pulse), bold=True), K.GOLD)
            K.pill(draw, 1620, 590, "Pause & try!", coral, size=36)
            K.draw_stopwatch(draw, 1620, 770, 50, progress, brand)
            return True
        if focus == "answer":
            a = K.ease_in_out(K.clamp01((progress - 0.05) * 2.5))
            x, y = arc_move(wait, z["both"], a, hop=100)
            item(draw, "apple", x, y, 1.5 - 0.25 * a)
            if a >= 1:
                K.pill(draw, vx, vy + 80, "BOTH", K.BOTH_COLOR, size=28)
                K.text_at(draw, "Red? Yes!", 1620, 440, font(42, bold=True), RED)
                K.text_at(draw, "Eat it? Yes!", 1620, 520, font(42, bold=True), sage)
                star_spots([(1480, 690), (1760, 690)])
            return True
        # trap
        item(draw, "apple", vx, vy, 1.25)
        a = K.ease_in_out(K.clamp01((progress - 0.1) * 2.5))
        target = (z["A"][0] - 10, vy)
        x, y = arc_move(wait, target, a, hop=110)
        item(draw, "car", x, y, 1.4 - 0.1 * a)
        if a >= 1:
            K.pill(draw, target[0], vy + 80, "Only A", RED, size=28)
            K.text_at(draw, "Red? Yes!", 1620, 440, font(42, bold=True), RED)
            K.text_at(draw, "Eat it? NO!", 1620, 520, font(42, bold=True), K.DANGER)
            K.text_at(draw, "Not the middle", 1620, 620, font(34, bold=True), muted)
        return True

    # ---- recap ----------------------------------------------------------------------------------------------
    if visual == "c9-recap":
        recap = [("A set = things that belong together", coral, "set"), ("Each circle is one set", K.ROAD, "one"),
                 ("Middle = in both sets", K.BOTH_COLOR, "both"), ("Outside = in neither set", muted, "out")]
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
                ix, iy = x0 + 200, y0 + 200
                if kind == "set":
                    draw.ellipse((ix - 130, iy - 120, ix + 130, iy + 120), fill=red_soft, outline=coral, width=6)
                    for kd, dx, dy in (("mango", -70, -45), ("banana", 62, -30), ("apple", -5, 60)):
                        item(draw, kd, ix + dx, iy + dy, 0.75)
                elif kind == "one":
                    draw.ellipse((ix - 130, iy - 120, ix + 130, iy + 120), fill=blue_soft, outline=K.ROAD, width=6)
                    item(draw, "redball", ix - 40, iy - 20, 0.8)
                    item(draw, "football", ix + 50, iy + 40, 0.8)
                else:
                    sv_hi = kind == "both"
                    for sx, c in ((-1, RED), (1, ORANGE)):
                        draw.ellipse((ix + sx * 55 - 100, iy - 100, ix + sx * 55 + 100, iy + 100), outline=c, width=6)
                    if sv_hi:
                        draw.polygon(lens_pts(ix, iy, 100, 110), fill=(206, 190, 248))
                        for sx, c in ((-1, RED), (1, ORANGE)):
                            draw.ellipse((ix + sx * 55 - 100, iy - 100, ix + sx * 55 + 100, iy + 100), outline=c,
                                         width=6)
                        item(draw, "redball", ix, iy, 0.6)
                    else:
                        item(draw, "banana", ix + 140, iy + 132, 0.6)
                f = font(34, bold=True)
                for j, ln in enumerate(K.wrap_text(lab, f, 350)):
                    K.text_at(draw, ln, x0 + 200, y0 + 400 + j * 44, f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            chintu(draw, cx + 300, 400, 1.15, t, wave=t)
            K.text_at(draw, "Chapter 4 done!", cx, 660, font(68, bold=True), ink)
            K.pill(draw, cx, 760, "Maths detective", coral, size=36)
            star_spots([(cx - 620, 320), (cx + 640, 320), (cx - 700, 560), (cx + 720, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
