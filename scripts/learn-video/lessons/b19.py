"""B19 · AI Helping Doctors, Scientists, Artists — visuals."""
import math

import build as K

PAPER = (255, 250, 238)
WOOD = (196, 150, 98)
WOOD_DARK = (150, 106, 64)
LAV_SOFT = (239, 234, 251)
BLUE_SOFT = (230, 238, 251)
GOLD_SOFT = (255, 242, 214)
SKY = (214, 232, 250)
FILM = (24, 34, 56)
BONE = (214, 226, 240)
BARK = (128, 90, 58)
FOREST = (64, 140, 84)
FOREST_DARK = (44, 110, 64)
GRASS = (196, 226, 170)
TIGER = (240, 140, 40)
DEER = (176, 120, 70)
ELEPHANT = (164, 170, 184)
STORM = (112, 122, 146)
MAP_BG = (232, 240, 226)
TULSI = (58, 128, 74)
PEACOCK = (30, 110, 190)
FEATHER = (24, 150, 130)
BUS_YELLOW = (255, 196, 40)
PENCIL = (255, 200, 60)


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


def neem_leaf(draw, cx, cy, s, col=K.LEAF):
    def S(v):
        return v * s
    vein = (150, 200, 140)
    draw.line((cx, cy + S(170), cx, cy - S(130)), fill=(96, 130, 70), width=max(3, int(S(8))))
    for k in range(5):
        y = cy + S(120) - k * S(58)
        L = S(100 - k * 6)
        leaf_shape(draw, cx, y, L, S(22), math.pi + 0.55, col, vein)
        leaf_shape(draw, cx, y, L, S(22), -0.55, col, vein)
    leaf_shape(draw, cx, cy - S(124), S(90), S(22), -math.pi / 2, col, vein)


def tulsi_leaf(draw, cx, cy, s, col=TULSI):
    def S(v):
        return v * s
    draw.line((cx, cy + S(130), cx, cy + S(80)), fill=(96, 130, 70), width=max(3, int(S(10))))
    leaf_shape(draw, cx, cy + S(90), S(220), S(78), -math.pi / 2, col, (130, 190, 130))
    for k in range(3):
        y = cy + S(40) - k * S(46)
        for sd in (-1, 1):
            draw.line((cx, y, cx + sd * S(46 - k * 8), y - S(26)), fill=(130, 190, 130), width=max(2, int(S(5))))


def letter_paper(draw, cx, cy, s, ink, tiny=False, title="Dear Nani,"):
    def S(v):
        return v * s
    x0, y0, x1, y1 = cx - S(150), cy - S(190), cx + S(150), cy + S(190)
    draw.rounded_rectangle((x0 + S(8), y0 + S(10), x1 + S(8), y1 + S(10)), radius=S(12), fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=S(12), fill=PAPER, outline=K.DEV_MID, width=max(2, int(S(3))))
    if tiny:
        for k in range(11):
            ly = y0 + S(40) + k * S(30)
            pts = [(x0 + S(30) + j * S(8), ly + S(3) * math.sin(j * 1.7 + k)) for j in range(30 - (k % 3) * 4)]
            draw.line(pts, fill=(150, 150, 160), width=max(2, int(S(3))))
        return
    draw.text((x0 + S(28), y0 + S(26)), title, fill=ink, font=F(S(34)))
    for k in range(7):
        ly = y0 + S(110) + k * S(36)
        draw.rounded_rectangle((x0 + S(28), ly, x1 - S(28) - (k % 3) * S(40), ly + S(10)), radius=S(5),
                               fill=(190, 190, 200))
    K.draw_heart(draw, x1 - S(50), y1 - S(46), S(20), K.DANGER)


def open_book(draw, cx, cy, s):
    def S(v):
        return v * s
    for sd in (-1, 1):
        pts = [(cx, cy - S(90)), (cx + sd * S(170), cy - S(110)), (cx + sd * S(170), cy + S(90)), (cx, cy + S(110))]
        draw.polygon([(x + S(6), y + S(8)) for x, y in pts], fill=K.SHADOW)
        draw.polygon(pts, fill=PAPER, outline=K.DEV_MID)
        for k in range(5):
            ly = cy - S(70) + k * S(34)
            draw.line((cx + sd * S(24), ly, cx + sd * S(146), ly - S(10)), fill=(180, 180, 192), width=max(2, int(S(6))))
    draw.line((cx, cy - S(90), cx, cy + S(110)), fill=K.DEV_MID, width=max(2, int(S(4))))


def coat_person(draw, cx, cy, s, t, shirt, steth=False, goggles=False):
    def S(v):
        return v * s
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=(250, 251, 253),
               outline=(196, 202, 212), width=max(2, int(S(4))))
    draw.polygon([(cx - S(30), cy + S(52)), (cx + S(30), cy + S(52)), (cx, cy + S(116))], fill=shirt)
    for sd in (-1, 1):
        draw.line((cx + sd * S(30), cy + S(52), cx, cy + S(116)), fill=(196, 202, 212), width=max(2, int(S(4))))
    if steth:
        sw = max(2, int(S(7)))
        draw.arc((cx - S(48), cy + S(40), cx + S(48), cy + S(126)), 0, 180, fill=K.DEV_DARK, width=sw)
        for sd in (-1, 1):
            draw.line((cx + sd * S(48), cy + S(83), cx + sd * S(34), cy + S(54)), fill=K.DEV_DARK, width=sw)
        draw.ellipse((cx + S(30), cy + S(104), cx + S(54), cy + S(128)), fill=K.STEEL, outline=K.DEV_DARK,
                     width=max(1, int(S(3))))
    K.draw_face(draw, cx, cy, S(64), "kid", 0.6)
    if goggles:
        gy = cy - S(40)
        draw.rounded_rectangle((cx - S(58), gy - S(14), cx + S(58), gy + S(14)), radius=S(14), fill=(150, 210, 230),
                               outline=K.DEV_DARK, width=max(2, int(S(4))))
        draw.line((cx, gy - S(12), cx, gy + S(12)), fill=K.DEV_DARK, width=max(2, int(S(4))))


def doctor(draw, cx, cy, s, t):
    coat_person(draw, cx, cy, s, t, (13, 148, 136), steth=True)


def scientist(draw, cx, cy, s, t):
    coat_person(draw, cx, cy, s, t, K.BOT, goggles=True)


def xray(draw, cx, cy, s, t, spot=False, ring=False):
    def S(v):
        return v * s
    W, H = S(150), S(190)
    draw.rounded_rectangle((cx - W + S(8), cy - H + S(10), cx + W + S(8), cy + H + S(10)), radius=S(18), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(18), fill=FILM)
    draw.ellipse((cx - S(120), cy - S(130), cx + S(120), cy + S(150)), fill=(34, 48, 78))
    for sd in (-1, 1):
        draw.line((cx, cy - S(150), cx + sd * S(110), cy - S(136)), fill=BONE, width=max(2, int(S(10))))
    for k in range(6):
        y0 = cy - S(130) + k * S(42)
        draw.arc((cx - S(122), y0, cx - S(6), y0 + S(76)), 180, 350, fill=BONE, width=max(2, int(S(9))))
        draw.arc((cx + S(6), y0, cx + S(122), y0 + S(76)), 190, 360, fill=BONE, width=max(2, int(S(9))))
    for k in range(9):
        y = cy - H + S(26) + k * S(40)
        draw.rounded_rectangle((cx - S(14), y, cx + S(14), y + S(30)), radius=S(6), fill=(236, 242, 250))
    sx, sy = cx + S(62), cy + S(10)
    if spot:
        draw.ellipse((sx - S(12), sy - S(12), sx + S(12), sy + S(12)), fill=(255, 250, 200))
    if ring:
        r = S(34 + 8 * math.sin(t * 20))
        draw.ellipse((sx - r, sy - r, sx + r, sy + r), outline=K.CORAL, width=max(3, int(S(8))))
    return sx, sy


def tree(draw, x, base, s, col=FOREST):
    def S(v):
        return v * s
    draw.rectangle((x - S(20), base - S(170), x + S(20), base), fill=BARK)
    dark = tuple(int(c * 0.82) for c in col)
    draw.ellipse((x - S(130), base - S(260), x + S(10), base - S(130)), fill=dark)
    draw.ellipse((x - S(10), base - S(260), x + S(130), base - S(130)), fill=dark)
    draw.ellipse((x - S(95), base - S(330), x + S(95), base - S(170)), fill=col)


def trail_cam(draw, x, y, s, t):
    def S(v):
        return v * s
    draw.rectangle((x - S(62), y - S(10), x + S(62), y + S(8)), fill=(60, 70, 50))
    draw.rounded_rectangle((x - S(44) + S(5), y - S(56) + S(6), x + S(44) + S(5), y + S(56) + S(6)), radius=S(12),
                           fill=(40, 60, 40))
    draw.rounded_rectangle((x - S(44), y - S(56), x + S(44), y + S(56)), radius=S(12), fill=(84, 112, 70))
    draw.ellipse((x - S(26), y - S(6), x + S(26), y + S(46)), fill=K.DEV_DEEP)
    draw.ellipse((x - S(12), y + S(8), x + S(12), y + S(32)), fill=(80, 100, 140))
    flash = (t * 4) % 1 < 0.22
    draw.rounded_rectangle((x - S(22), y - S(44), x + S(22), y - S(24)), radius=S(5),
                           fill=(255, 240, 160) if flash else (200, 200, 180))
    if flash:
        for a in range(-150, -20, 26):
            r0, r1 = S(40), S(70)
            ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
            draw.line((x + ca * r0, y - S(34) + sa * r0, x + ca * r1, y - S(34) + sa * r1), fill=K.GOLD,
                      width=max(2, int(S(5))))


def tiger_head(draw, x, y, s):
    def S(v):
        return v * s
    for sd in (-1, 1):
        draw.ellipse((x + sd * S(44) - S(20), y - S(66), x + sd * S(44) + S(20), y - S(26)), fill=TIGER)
        draw.ellipse((x + sd * S(44) - S(10), y - S(56), x + sd * S(44) + S(10), y - S(36)), fill=(255, 220, 190))
    draw.ellipse((x - S(60), y - S(56), x + S(60), y + S(58)), fill=TIGER)
    draw.ellipse((x - S(34), y + S(4), x + S(34), y + S(52)), fill=(255, 250, 244))
    for dx in (-S(16), 0, S(16)):
        draw.line((x + dx, y - S(54), x + dx * 0.7, y - S(32)), fill=K.DEV_DEEP, width=max(2, int(S(6))))
    for sd in (-1, 1):
        for k in range(2):
            yy = y - S(4) + k * S(18)
            draw.line((x + sd * S(58), yy, x + sd * S(38), yy + S(4)), fill=K.DEV_DEEP, width=max(2, int(S(6))))
        draw.ellipse((x + sd * S(22) - S(6), y - S(18), x + sd * S(22) + S(6), y - S(6)), fill=K.DEV_DEEP)
    draw.polygon([(x - S(10), y + S(10)), (x + S(10), y + S(10)), (x, y + S(22))], fill=K.DEV_DEEP)


def deer_head(draw, x, y, s):
    def S(v):
        return v * s
    aw = max(2, int(S(7)))
    for sd in (-1, 1):
        draw.line((x + sd * S(18), y - S(46), x + sd * S(40), y - S(104)), fill=WOOD_DARK, width=aw)
        draw.line((x + sd * S(30), y - S(76), x + sd * S(58), y - S(86)), fill=WOOD_DARK, width=aw)
        draw.ellipse((x + sd * S(58) - S(24), y - S(48), x + sd * S(58) + S(24), y - S(22)), fill=DEER)
    draw.ellipse((x - S(42), y - S(56), x + S(42), y + S(58)), fill=DEER)
    draw.ellipse((x - S(26), y + S(10), x + S(26), y + S(58)), fill=(226, 190, 150))
    for sd in (-1, 1):
        draw.ellipse((x + sd * S(18) - S(6), y - S(18), x + sd * S(18) + S(6), y - S(6)), fill=K.DEV_DEEP)
    draw.ellipse((x - S(10), y + S(32), x + S(10), y + S(48)), fill=K.DEV_DEEP)


def elephant_head(draw, x, y, s):
    def S(v):
        return v * s
    for sd in (-1, 1):
        draw.ellipse((x + sd * S(56) - S(40), y - S(50), x + sd * S(56) + S(40), y + S(40)), fill=(146, 152, 168))
        draw.ellipse((x + sd * S(56) - S(26), y - S(36), x + sd * S(56) + S(26), y + S(26)), fill=(214, 170, 180))
    draw.ellipse((x - S(50), y - S(56), x + S(50), y + S(40)), fill=ELEPHANT)
    draw.line([(x, y + S(10)), (x - S(4), y + S(50)), (x + S(14), y + S(80)), (x + S(34), y + S(82))],
              fill=ELEPHANT, width=max(3, int(S(22))), joint="curve")
    for sd in (-1, 1):
        draw.ellipse((x + sd * S(22) - S(6), y - S(20), x + sd * S(22) + S(6), y - S(8)), fill=K.DEV_DEEP)
        draw.line((x + sd * S(18), y + S(22), x + sd * S(28), y + S(42)), fill=(255, 255, 250), width=max(2, int(S(7))))


def cloud(draw, x, y, s, col):
    def S(v):
        return v * s
    draw.ellipse((x - S(100), y - S(30), x - S(10), y + S(46)), fill=col)
    draw.ellipse((x - S(50), y - S(76), x + S(56), y + S(30)), fill=col)
    draw.ellipse((x + S(10), y - S(44), x + S(104), y + S(46)), fill=col)
    draw.rounded_rectangle((x - S(90), y, x + S(96), y + S(46)), radius=S(22), fill=col)


def bolt(draw, x, y, s):
    def S(v):
        return v * s
    draw.polygon([(x + S(10), y), (x - S(26), y + S(70)), (x, y + S(70)), (x - S(16), y + S(130)), (x + S(34), y + S(50)),
                  (x + S(8), y + S(50)), (x + S(26), y)], fill=K.GOLD)


def easel(draw, cx, cy, s):
    def S(v):
        return v * s
    lw = max(3, int(S(14)))
    draw.line((cx - S(40), cy - S(230), cx - S(150), cy + S(260)), fill=WOOD_DARK, width=lw)
    draw.line((cx + S(40), cy - S(230), cx + S(150), cy + S(260)), fill=WOOD_DARK, width=lw)
    draw.line((cx, cy - S(230), cx, cy + S(240)), fill=WOOD, width=lw)
    box = (cx - S(170), cy - S(200), cx + S(170), cy + S(110))
    draw.rectangle((box[0] + S(8), box[1] + S(10), box[2] + S(8), box[3] + S(10)), fill=K.SHADOW)
    draw.rectangle(box, fill=(255, 255, 255), outline=WOOD_DARK, width=max(2, int(S(6))))
    draw.rounded_rectangle((cx - S(200), cy + S(108), cx + S(200), cy + S(130)), radius=S(6), fill=WOOD)
    return box


def peacock(draw, cx, cy, s, body=PEACOCK, tail=FEATHER, t=0.0):
    def S(v):
        return v * s
    soft = tuple(min(255, int(c + (255 - c) * 0.6)) for c in tail)
    draw.pieslice((cx - S(150), cy - S(150), cx + S(150), cy + S(150)), 180, 360, fill=soft)
    for k in range(7):
        a = math.radians(-165 + k * 25)
        ex, ey = cx + math.cos(a) * S(122), cy + math.sin(a) * S(122)
        draw.line((cx, cy, ex, ey), fill=tail, width=max(2, int(S(5))))
        draw.ellipse((ex - S(24), ey - S(30), ex + S(24), ey + S(30)), fill=tail)
        draw.ellipse((ex - S(13), ey - S(15), ex + S(13), ey + S(15)), fill=K.GOLD)
        draw.ellipse((ex - S(6), ey - S(7), ex + S(6), ey + S(7)), fill=body)
    draw.line((cx - S(10), cy + S(40), cx - S(16), cy + S(80)), fill=K.DEV_MID, width=max(2, int(S(5))))
    draw.line((cx + S(10), cy + S(40), cx + S(16), cy + S(80)), fill=K.DEV_MID, width=max(2, int(S(5))))
    draw.ellipse((cx - S(30), cy - S(30), cx + S(30), cy + S(52)), fill=body)
    draw.line((cx, cy - S(20), cx + S(4), cy - S(66)), fill=body, width=max(3, int(S(18))))
    draw.ellipse((cx - S(16), cy - S(90), cx + S(22), cy - S(54)), fill=body)
    for k in range(3):
        draw.line((cx + S(2), cy - S(88), cx - S(10) + k * S(12), cy - S(112)), fill=body, width=max(1, int(S(3))))
        draw.ellipse((cx - S(14) + k * S(12), cy - S(118), cx - S(6) + k * S(12), cy - S(110)), fill=body)
    draw.polygon([(cx + S(20), cy - S(76)), (cx + S(38), cy - S(70)), (cx + S(20), cy - S(64))], fill=K.GOLD)
    draw.ellipse((cx + S(4), cy - S(80), cx + S(12), cy - S(72)), fill=(255, 255, 255))


def brush(draw, cx, cy, s, ang=-0.8, tip=K.CORAL):
    def S(v):
        return v * s
    ca, sa = math.cos(ang), math.sin(ang)

    def P(x, y):
        return (cx + x * ca - y * sa, cy + x * sa + y * ca)
    draw.polygon([P(-S(150), -S(9)), P(S(50), -S(12)), P(S(50), S(12)), P(-S(150), S(9))], fill=WOOD_DARK)
    draw.polygon([P(S(50), -S(13)), P(S(86), -S(13)), P(S(86), S(13)), P(S(50), S(13))], fill=K.STEEL)
    draw.polygon([P(S(86), -S(14)), P(S(130), -S(6)), P(S(146), 0), P(S(130), S(6)), P(S(86), S(14))], fill=tip)


def palette(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.ellipse((cx - S(110) + S(6), cy - S(74) + S(8), cx + S(110) + S(6), cy + S(74) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(110), cy - S(74), cx + S(110), cy + S(74)), fill=(232, 196, 150))
    draw.ellipse((cx + S(40), cy + S(14), cx + S(78), cy + S(50)), fill=K.hex_rgb("#FFF8EF"))
    for k, col in enumerate((K.CORAL, K.GOLD, PEACOCK, FEATHER, K.DANGER)):
        a = math.radians(160 + k * 42)
        px, py = cx + math.cos(a) * S(62), cy + math.sin(a) * S(40)
        draw.ellipse((px - S(18), py - S(18), px + S(18), py + S(18)), fill=col)


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


def folded_map(draw, cx, cy, s):
    def S(v):
        return v * s
    cols = [(226, 240, 214), (206, 228, 196), (226, 240, 214)]
    for k in range(3):
        x0 = cx - S(150) + k * S(100)
        off = S(16) if k % 2 else 0
        pts = [(x0, cy - S(100) + off), (x0 + S(100), cy - S(100) + S(16) - off), (x0 + S(100), cy + S(100) + S(16) - off),
               (x0, cy + S(100) + off)]
        draw.polygon(pts, fill=cols[k], outline=K.DEV_MID)
    K.draw_dashed(draw, cx - S(120), cy + S(50), cx + S(40), cy - S(20), K.CORAL, width=max(2, int(S(7))), dash=14, gap=10)
    K.draw_map_pin(draw, cx + S(80), cy - S(10), 0.5 * s, K.DANGER)


def map_screen(draw, box, t, alt=0.0, warn=True):
    x0, y0, x1, y1 = box
    draw.rectangle(box, fill=MAP_BG)
    wd, ht = x1 - x0, y1 - y0
    for fx in (0.2, 0.55, 0.85):
        draw.line((x0 + wd * fx, y0, x0 + wd * fx, y1), fill=(255, 255, 255), width=14)
    for fy in (0.18, 0.5, 0.82):
        draw.line((x0, y0 + ht * fy, x1, y0 + ht * fy), fill=(255, 255, 255), width=14)
    draw.ellipse((x0 + wd * 0.62, y0 + ht * 0.26, x0 + wd * 0.8, y0 + ht * 0.4), fill=(190, 222, 170))
    sx, sy = x0 + wd * 0.2, y0 + ht * 0.82
    ex, ey = x0 + wd * 0.85, y0 + ht * 0.18
    route = [(sx, sy), (sx, y0 + ht * 0.18), (ex, ey)]
    draw.line(route, fill=K.ROAD, width=10)
    if warn:
        draw.line((sx, y0 + ht * 0.4, sx, y0 + ht * 0.25), fill=K.DANGER, width=12)
    if alt > 0:
        pts = [(sx, sy), (x0 + wd * 0.55, sy), (x0 + wd * 0.55, y0 + ht * 0.5), (ex, y0 + ht * 0.5), (ex, ey)]
        segs = [math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:])]
        total = sum(segs) * K.clamp01(alt)
        cur = [pts[0]]
        for (a, b), L in zip(zip(pts, pts[1:]), segs):
            if total <= 0:
                break
            u = min(1.0, total / L)
            cur.append((a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u))
            total -= L
        draw.line(cur, fill=(13, 148, 136), width=12, joint="curve")
    draw.ellipse((sx - 16, sy - 16, sx + 16, sy + 16), fill=K.CORAL, outline=(255, 255, 255), width=4)
    K.draw_map_pin(draw, ex, ey + 4, 0.42, K.DANGER)


def medicine(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(40), cy - S(100), cx + S(40), cy - S(66)), radius=S(8), fill=K.CORAL)
    draw.rounded_rectangle((cx - S(54) + S(6), cy - S(70) + S(8), cx + S(54) + S(6), cy + S(90) + S(8)), radius=S(18),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(54), cy - S(70), cx + S(54), cy + S(90)), radius=S(18), fill=(250, 250, 252),
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(54), cy - S(20), cx + S(54), cy + S(50)), radius=S(4), fill=(226, 240, 250))
    draw.rectangle((cx - S(8), cy - S(8), cx + S(8), cy + S(38)), fill=K.DANGER)
    draw.rectangle((cx - S(22), cy + S(7), cx + S(22), cy + S(23)), fill=K.DANGER)


def crown(draw, x, y, s, col=K.GOLD):
    def S(v):
        return v * s
    draw.polygon([(x - S(46), y + S(26)), (x - S(46), y - S(16)), (x - S(24), y + S(4)), (x, y - S(30)),
                  (x + S(24), y + S(4)), (x + S(46), y - S(16)), (x + S(46), y + S(26))], fill=col)
    for dx in (-S(46), 0, S(46)):
        draw.ellipse((x + dx - S(7), y - S(16) - S(7) - (S(14) if dx == 0 else 0), x + dx + S(7),
                      y - S(16) + S(7) - (S(14) if dx == 0 else 0)), fill=col)


def toolbox(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.arc((cx - S(70), cy - S(140), cx + S(70), cy - S(40)), 180, 360, fill=K.DEV_DARK, width=max(3, int(S(16))))
    pencil(draw, cx - S(140), cy - S(120), 0.8 * s, -1.25)
    folded_map(draw, cx + S(130), cy - S(110), 0.6 * s)
    draw.rounded_rectangle((cx - S(220) + S(10), cy - S(80) + S(12), cx + S(220) + S(10), cy + S(130) + S(12)),
                           radius=S(26), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(220), cy - S(80), cx + S(220), cy + S(130)), radius=S(26), fill=K.DANGER)
    draw.rectangle((cx - S(220), cy - S(10), cx + S(220), cy + S(10)), fill=(190, 44, 44))
    draw.rounded_rectangle((cx - S(40), cy - S(22), cx + S(40), cy + S(22)), radius=S(8), fill=K.STEEL)


def bus(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(170), cy - S(90), cx + S(170), cy + S(70)), radius=S(28), fill=BUS_YELLOW)
    for k in range(4):
        wx = cx - S(140) + k * S(72)
        draw.rounded_rectangle((wx, cy - S(70), wx + S(56), cy - S(20)), radius=S(8), fill=K.DEV_SCREEN)
    draw.rectangle((cx - S(170), cy + S(4), cx + S(170), cy + S(18)), fill=K.DEV_DARK)
    for wx in (cx - S(100), cx + S(100)):
        draw.ellipse((wx - S(32), cy + S(40), wx + S(32), cy + S(104)), fill=K.DEV_DEEP)
        draw.ellipse((wx - S(13), cy + S(59), wx + S(13), cy + S(85)), fill=K.STEEL)


def sofa(draw, cx, cy, s):
    def S(v):
        return v * s
    col, dark = (176, 120, 160), (146, 92, 132)
    draw.rounded_rectangle((cx - S(330), cy - S(120), cx + S(330), cy + S(60)), radius=S(40), fill=dark)
    draw.rounded_rectangle((cx - S(300), cy - S(20), cx + S(300), cy + S(100)), radius=S(30), fill=col)
    for sd in (-1, 1):
        draw.rounded_rectangle((cx + sd * S(330) - S(50), cy - S(50), cx + sd * S(330) + S(50), cy + S(110)),
                               radius=S(30), fill=dark)


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

    def reader_screen(box, lines=5):
        x0, y0, x1, y1 = box
        draw.rectangle(box, fill=(255, 255, 255))
        draw.rectangle((x0, y0, x1, y0 + 50), fill=K.BOTH_COLOR)
        K.text_at(draw, "Read aloud", (x0 + x1) / 2, y0 + 10, F(26), (255, 255, 255))
        for k in range(lines):
            ly = y0 + 74 + k * 30
            col = coral if k == int(t * 10) % lines else (196, 196, 206)
            draw.rounded_rectangle((x0 + 18, ly, x1 - 18 - (k % 2) * 40, ly + 12), radius=6, fill=col)
        my = y1 - 70
        draw.ellipse(((x0 + x1) / 2 - 36, my - 36, (x0 + x1) / 2 + 36, my + 36), fill=K.BOTH_COLOR)
        draw.polygon([((x0 + x1) / 2 - 16, my - 12), ((x0 + x1) / 2 - 4, my - 12), ((x0 + x1) / 2 + 12, my - 26),
                      ((x0 + x1) / 2 + 12, my + 26), ((x0 + x1) / 2 - 4, my + 12), ((x0 + x1) / 2 - 16, my + 12)],
                     fill=(255, 255, 255))

    def plant_screen(box, name, ok=True, leaf="neem"):
        x0, y0, x1, y1 = box
        mx = (x0 + x1) / 2
        draw.rectangle(box, fill=(255, 255, 255))
        draw.rectangle((x0, y0, x1, y0 + 50), fill=K.LEAF)
        K.text_at(draw, "Plant spotter", mx, y0 + 10, F(26), (255, 255, 255))
        draw.rectangle((x0 + 16, y0 + 66, x1 - 16, y0 + 236), fill=(236, 246, 232))
        if leaf == "neem":
            neem_leaf(draw, mx, y0 + 150, 0.45)
        else:
            tulsi_leaf(draw, mx, y0 + 140, 0.5)
        col = sage if ok else K.DANGER
        draw.rounded_rectangle((x0 + 16, y0 + 256, x1 - 16, y0 + 330), radius=18,
                               fill=sage_soft if ok else K.DANGER_SOFT, outline=col, width=3)
        K.text_at(draw, name, mx, y0 + 274, F(30), col)

    def tf_buttons(ans, correct_true):
        for i, (lab, col) in enumerate((("TRUE", sage), ("FALSE", K.DANGER))):
            x = 620 + i * 680
            win = ans and (i == 0) == correct_true
            dim = ans and not win
            y0 = 540 - (int(8 * pulse) if win else 0)
            draw.rounded_rectangle((x - 230 + 8, y0 + 10, x + 230 + 8, y0 + 190 + 10), radius=50, fill=K.SHADOW)
            draw.rounded_rectangle((x - 230, y0, x + 230, y0 + 190), radius=50,
                                   fill=(236, 233, 228) if dim else col, outline=col, width=6)
            K.text_at(draw, lab, x, y0 + 56, F(80), muted if dim else (255, 255, 255))
            if win:
                K.draw_check(draw, x + 220, y0 + 10, 40, sage if col != sage else K.GOLD)

    # ---- opening -----------------------------------------------------------------------
    if visual == "b19-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 420), 460, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 400, 520, 0.8, t, mood="happy", wave=t)
            K.draw_heart(draw, cx, 420 + bounce, 46, K.DANGER)
            K.text_at(draw, "Welcome back, champ!", cx, 740, F(64), ink)
            sparkle([(cx - 760, 320), (cx - 160, 300), (cx + 160, 560), (cx + 760, 640)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · REAL OR AI-MADE?", cx, 290 + lift, F(34), sage)
            fx0, fy0, fx1, fy1 = 330, 380 + lift, 830, 760 + lift
            draw.rounded_rectangle((fx0 + 8, fy0 + 10, fx1 + 8, fy1 + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((fx0, fy0, fx1, fy1), radius=20, fill=(255, 255, 255))
            draw.rectangle((fx0 + 20, fy0 + 20, fx1 - 20, fy1 - 20), fill=SKY)
            cloud(draw, fx0 + 120, fy0 + 90, 0.5, (255, 255, 255))
            by = fy0 + 210 + 12 * math.sin(t * 8)
            for sd in (-1, 1):
                draw.polygon([(580 + sd * 40, by - 60), (580 + sd * 190, by - 150), (580 + sd * 150, by - 50)],
                             fill=(255, 255, 255), outline=K.DEV_MID)
            bus(draw, 580, by, 0.75)
            K.draw_magnifier(draw, fx1 - 40, fy1 - 60, 0.6, coral)
            rows = [("1", "Pause", "Don't believe it yet", coral), ("2", "Ask a grown-up", "Check it together", sage)]
            for i, (num, lab, sub, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                y = 400 + i * 190 + int((1 - a) * 30) + lift
                draw.rounded_rectangle((960, y, 1620, y + 160), radius=40, fill=panel, outline=col, width=5)
                draw.ellipse((990, y + 35, 1080, y + 125), fill=col)
                K.text_at(draw, num, 1035, y + 42, F(56), (255, 255, 255))
                draw.text((1110, y + 30), lab, fill=ink, font=F(48))
                draw.text((1110, y + 94), sub, fill=muted, font=F(30))
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 236 + lift, w - 240, 590 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4 OF 5", cx, 290 + lift, F(34), coral)
            K.text_at(draw, "AI Helping Doctors,", cx, 350 + lift, F(78), ink)
            K.text_at(draw, "Scientists & Artists", cx, 452 + lift, F(78), coral)
            items = [("doctor", "Doctors", sage_soft), ("science", "Scientists", BLUE_SOFT), ("art", "Artists", LAV_SOFT)]
            for i, (kind, lab, bg) in enumerate(items):
                a = K.stagger(progress, i + 2, step=0.1, speed=4)
                if a <= 0:
                    continue
                x = cx - 640 + i * 480
                y = 735 + int((1 - a) * 30)
                draw.ellipse((x - 100, y - 100, x + 100, y + 100), fill=bg)
                if kind == "doctor":
                    doctor(draw, x, y - 30, 0.55, t)
                elif kind == "science":
                    scientist(draw, x, y - 30, 0.55, t)
                else:
                    palette(draw, x - 10, y + 10, 0.6)
                    brush(draw, x + 20, y - 10, 0.5, -0.9, PEACOCK)
                K.pill(draw, 0, y - 24, lab, [sage, K.BOT, K.BOTH_COLOR][i], size=30, left=x + 112)
            return True
        # promise
        K.text_at(draw, "How can AI help people?", cx, 236 + lift, F(66), ink)
        K.draw_robot(draw, cx, 610, 0.72, t, mood="happy")
        K.draw_heart(draw, cx + 110, 360 + bounce, 26, K.DANGER)
        spots = [((cx - 540, 440), "leaf", "Plants"), ((cx - 540, 720), "read", "Reading"),
                 ((cx + 540, 440), "xray", "Doctors"), ((cx + 540, 720), "art", "Art")]
        for i, ((x, y), kind, lab) in enumerate(spots):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            r = 105 * (0.8 + 0.2 * a)
            draw.ellipse((x - r + 8, y - r + 10, x + r + 8, y + r + 10), fill=K.SHADOW)
            draw.ellipse((x - r, y - r, x + r, y + r), fill=panel, outline=star_cols[i], width=6)
            if kind == "leaf":
                neem_leaf(draw, x, y - 4, 0.42)
            elif kind == "read":
                open_book(draw, x, y, 0.42)
                K.sound_waves(draw, x + 50, y - 40, 0.5, K.BOTH_COLOR, t)
            elif kind == "xray":
                xray(draw, x, y, 0.36, t)
            else:
                peacock(draw, x, y + 20, 0.5)
            K.pill(draw, x, y + r - 10, lab, star_cols[i], size=28)
        return True

    # ---- Meera and nani ------------------------------------------------------------------------
    if visual == "b19-hook":
        if focus == "meet":
            draw.ellipse((600 - 330, 520 - 280, 600 + 330, 520 + 280), fill=coral_soft)
            sofa(draw, 600, 660, 0.9)
            K.draw_person(draw, 470, 500, 1.1, "kid", t)
            K.draw_person(draw, 750, 490, 1.15, "nani", t * 0.7)
            K.draw_heart(draw, 610, 330 + bounce, 30, K.DANGER)
            K.text_at(draw, "Meet", 1360, 290 + lift, F(60), muted)
            K.text_at(draw, "Meera!", 1360, 360 + lift, F(130), coral)
            K.pill(draw, 1360, 560, "Class 4", sage, size=42)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1360, 680 + int((1 - a) * 20), "Sundays with nani", K.BOTH_COLOR, size=36)
            return True
        if focus == "letter":
            draw.ellipse((420 - 250, 520 - 250, 420 + 250, 520 + 250), fill=LAV_SOFT)
            K.draw_person(draw, 420, 470, 1.25, "nani", 0)
            qmarks([(220, 280), (600, 270)], 70)
            letter_paper(draw, 1050, 540, 1.05, ink, tiny=True)
            K.draw_envelope(draw, 1380, 760, 1.1, coral)
            K.draw_magnifier(draw, 1500, 380, 0.8, K.BOTH_COLOR)
            K.pill(draw, 1050, 800, "Tiny, blurry letters", K.DEV_MID, size=34)
            return True
        if focus == "why":
            K.text_at(draw, "How could nani read on her own?", cx, 226, F(50), ink)
            draw_school = K.draw_school
            draw_school(draw, 440, 560, 1.05, brand)
            K.draw_person(draw, 700, 640, 0.6, "kid", t)
            K.pill(draw, 480, 790, "Meera: at school", coral, size=32)
            draw.ellipse((1240 - 220, 540 - 220, 1240 + 220, 540 + 220), fill=LAV_SOFT)
            K.draw_person(draw, 1180, 500, 1.1, "nani", 0)
            letter_paper(draw, 1400, 620, 0.42, ink, tiny=True)
            qmarks([(1010, 330), (1450, 320)], 70)
            K.draw_stopwatch(draw, 1700, 780, 46, progress, brand)
            return True
        # reads
        draw.ellipse((400 - 240, 520 - 240, 400 + 240, 520 + 240), fill=sage_soft)
        K.draw_person(draw, 400, 470, 1.25, "nani", t)
        if progress > 0.5:
            K.draw_heart(draw, 560, 320 + bounce, 30, K.DANGER)
        box = phone(draw, 900, 560, 1.15)
        reader_screen(box)
        K.sound_waves(draw, 1050, 520, 1.1, K.BOTH_COLOR, t)
        a = K.ease_out_cubic(K.clamp01((progress - 0.15) * 3))
        if a > 0:
            K.draw_bubble(draw, (1200, 280 + int((1 - a) * 20), 1760, 440 + int((1 - a) * 20)), brand,
                          "\u201cDear Nani, I miss you!\u201d", tail="left", size=40)
        K.pill(draw, 1480, 600, "Read-aloud app", K.BOTH_COLOR, size=40)
        sparkle([(1300, 760), (1700, 720)])
        return True

    # ---- AI is a tool ---------------------------------------------------------------------------
    if visual == "b19-define":
        if focus == "name":
            draw.ellipse((560 - 280, 600 - 260, 560 + 280, 600 + 260), fill=GOLD_SOFT)
            toolbox(draw, 560, 640, 1.0)
            phone(draw, 560, 500, 0.45)
            K.draw_star(draw, 560, 470, 26 + 4 * pulse, K.GOLD, rot=t)
            K.text_at(draw, "Big idea:", 1330, 290 + lift, F(56), muted)
            K.text_at(draw, "AI is a", 1330, 370 + lift, F(90), ink)
            K.text_at(draw, "TOOL", 1330, 470 + lift, F(150), coral)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1330, 690 + int((1 - a) * 20), "It helps people", sage, size=44)
            return True
        if focus == "meaning":
            K.text_at(draw, "A tool helps people do a job", cx, 226, F(50), ink)
            cards = [("pencil", "Pencil", "helps you write"), ("map", "Map", "helps you find the way"),
                     ("ai", "AI app", "helps people do a job")]
            for i, (kind, title, sub) in enumerate(cards):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                x0 = 170 + i * 540
                y0 = 310 + int((1 - a) * 40)
                box = (x0, y0, x0 + 480, y0 + 520)
                K.shadow_card(draw, box, brand, radius=30, outline=coral if kind == "ai" else None,
                              outline_w=6 if kind == "ai" else 3)
                mx = x0 + 240
                if kind == "pencil":
                    draw.rounded_rectangle((mx - 140, y0 + 60, mx + 140, y0 + 260), radius=10, fill=PAPER,
                                           outline=K.DEV_MID, width=3)
                    draw.line([(mx - 110, y0 + 200), (mx - 60, y0 + 140), (mx - 10, y0 + 190), (mx + 40, y0 + 120)],
                              fill=K.BOT, width=8, joint="curve")
                    pencil(draw, mx + 70, y0 + 140, 0.8, -0.9)
                elif kind == "map":
                    folded_map(draw, mx, y0 + 170, 1.1)
                else:
                    ph = phone(draw, mx, y0 + 170, 0.62)
                    draw.rectangle(ph, fill=(255, 255, 255))
                    K.draw_robot(draw, mx, y0 + 200, 0.22, t, mood="happy")
                K.text_at(draw, title, mx, y0 + 330, F(52), coral if kind == "ai" else ink)
                label_lines(sub, mx, y0 + 410, 36, muted, 420)
            return True
        # patterns
        rows = [("Not magic", K.DANGER, False), ("Not alive", K.DANGER, False), ("Learned patterns", sage, True)]
        for i, (lab, col, ok) in enumerate(rows):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 290 + i * 180 + int((1 - a) * 30)
            draw.rounded_rectangle((140, y, 820, y + 140), radius=40, fill=sage_soft if ok else panel, outline=col,
                                   width=5)
            if ok:
                K.draw_check(draw, 215, y + 70, 40, sage)
            else:
                K.draw_cross(draw, 215, y + 70, 40, K.DANGER)
            draw.text((280, y + 40), lab, fill=ink, font=F(52))
        letters = ["A", "a", "A", "B", "b", "B", "C", "c", "C"]
        fonts_sz = [70, 56, 62]
        for k, ch in enumerate(letters):
            a = K.stagger(progress, k, step=0.05, speed=5)
            if a <= 0:
                continue
            r, c = divmod(k, 3)
            x = 990 + c * 140
            y = 300 + r * 160 + int((1 - a) * 20)
            draw.rounded_rectangle((x - 58, y, x + 58, y + 130), radius=20, fill=panel,
                                   outline=star_cols[k % 4], width=4)
            K.text_at(draw, ch, x, y + 22, F(fonts_sz[k % 3]), star_cols[(k + r) % 4])
        K.draw_arrow(draw, 1440, 530, 1530, 530, muted, width=10, head=28)
        K.draw_robot(draw, 1670, 600, 0.5, t, mood="happy")
        K.text_at(draw, "examples", 1130, 790, F(34), muted)
        return True

    # ---- everyday helpers -----------------------------------------------------------------------
    if visual == "b19-everyday":
        if focus == "intro":
            K.text_at(draw, "AI helpers all around us", cx, 226, F(54), ink)
            items = [("plant", "Plant spotter", sage_soft, K.LEAF), ("read", "Read-aloud", LAV_SOFT, K.BOTH_COLOR),
                     ("maps", "Maps", BLUE_SOFT, K.ROAD)]
            for i, (kind, lab, bg, col) in enumerate(items):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                y = 540 + int((1 - a) * 40)
                draw.ellipse((x - 200, y - 200, x + 200, y + 200), fill=bg)
                if kind == "plant":
                    neem_leaf(draw, x, y - 10, 0.85)
                elif kind == "read":
                    open_book(draw, x - 20, y + 20, 0.8)
                    K.sound_waves(draw, x + 80, y - 70, 0.9, col, t)
                else:
                    folded_map(draw, x, y, 1.05)
                K.pill(draw, x, y + 230, lab, col, size=38)
            return True
        if focus == "plant":
            K.draw_person(draw, 300, 470, 1.05, "kid", t)
            K.pill(draw, 300, 690, "Meera", coral, size=32)
            draw.ellipse((700 - 200, 540 - 200, 700 + 200, 540 + 200), fill=sage_soft)
            neem_leaf(draw, 700, 530, 1.0)
            K.text_at(draw, "?", 860, 300, F(80 + 16 * pulse), K.GOLD)
            K.draw_arrow(draw, 920, 540, 1020, 540, muted, width=10, head=28)
            box = phone(draw, 1200, 545, 1.15)
            done = progress > 0.35
            plant_screen(box, "Neem leaf!" if done else "Looking\u2026", ok=True)
            if done:
                K.draw_check(draw, box[2] - 6, box[1] + 290, 26, sage)
            for k in range(6):
                a = K.stagger(progress, k, step=0.07, speed=5)
                if a <= 0:
                    continue
                r, c = divmod(k, 2)
                x = 1530 + c * 150
                y = 300 + r * 170
                draw.rounded_rectangle((x - 60, y, x + 60, y + 140), radius=14, fill=panel, outline=line, width=3)
                leaf_shape(draw, x, y + 120, 100, 26 + (k % 3) * 6, -math.pi / 2 + (k - 2.5) * 0.08,
                           [K.LEAF, TULSI, (110, 170, 90)][k % 3])
            K.text_at(draw, "1000s of leaf photos", 1600, 810, F(30), muted)
            return True
        if focus == "read":
            open_book(draw, 380, 600, 1.0)
            box = phone(draw, 760, 520, 1.1)
            reader_screen(box)
            K.sound_waves(draw, 900, 500, 1.1, K.BOTH_COLOR, t)
            draw.ellipse((1380 - 230, 500 - 230, 1380 + 230, 500 + 230), fill=LAV_SOFT)
            K.draw_person(draw, 1380, 450, 1.15, "nani", t)
            K.draw_heart(draw, 1560, 300 + bounce, 28, K.DANGER)
            K.pill(draw, 1380, 760, "For people who can't see well", K.BOTH_COLOR, size=34)
            return True
        # maps
        box = phone(draw, 620, 545, 1.35)
        map_screen(draw, box, t, alt=K.clamp01((progress - 0.3) * 2))
        a = K.ease_out_cubic(K.clamp01((progress - 0.1) * 3))
        if a > 0:
            K.draw_bubble(draw, (980, 250, 1780, 410), brand, "Heavy traffic ahead! Try this road.", tail="left",
                          size=38, color=GOLD_SOFT)
        K.draw_house(draw, 1400, 640, 0.75, brand)
        K.pill(draw, 1400, 790, "Nani's house", coral, size=34)
        return True

    # ---- doctors ---------------------------------------------------------------------------------
    if visual == "b19-doctor":
        if focus == "xray":
            draw.ellipse((420 - 240, 520 - 240, 420 + 240, 520 + 240), fill=sage_soft)
            doctor(draw, 420, 470, 1.25, t)
            K.pill(draw, 420, 720, "Doctor", sage, size=36)
            draw.rounded_rectangle((850, 300, 1310, 820), radius=24, fill=(236, 242, 250), outline=K.STEEL, width=6)
            xray(draw, 1080, 560, 1.15, t)
            K.text_at(draw, "X-ray", 1600, 330 + lift, F(90), coral)
            label_lines("a special photo of your bones", 1600, 460 + lift, 40, ink, 380)
            return True
        if focus == "spot":
            for k in range(5):
                a = K.stagger(progress, k, step=0.06, speed=5)
                if a <= 0:
                    continue
                ang = (k - 2) * 7
                x = 300 + k * 18
                draw.rounded_rectangle((x - 100, 320 + k * 10, x + 100, 560 + k * 10), radius=14, fill=FILM,
                                       outline=(70, 90, 120), width=3)
                _ = ang
            K.pill(draw, 340, 640, "1000s of X-rays", K.DEV_MID, size=32)
            K.draw_arrow(draw, 520, 500, 620, 500, muted, width=10, head=28)
            xray(draw, 860, 540, 1.2, t, spot=True, ring=progress > 0.25)
            K.draw_robot(draw, 1520, 640, 0.6, t, mood="happy")
            a = K.ease_out_cubic(K.clamp01((progress - 0.2) * 3))
            if a > 0:
                K.draw_bubble(draw, (1150, 250, 1790, 390), brand, "Doctor, please check this part!", tail="right",
                              size=36)
            return True
        # decides
        cards = [((170, 300, 850, 820), "AI points it out", "robot"), ((1070, 300, 1750, 820), "Doctor decides", "doc")]
        for i, (box, lab, kind) in enumerate(cards):
            a = K.stagger(progress, i, step=0.3, speed=4)
            if a <= 0:
                continue
            dy = int((1 - a) * 40)
            x0, y0, x1, y1 = box
            win = kind == "doc" and progress > 0.5
            K.shadow_card(draw, (x0, y0 + dy, x1, y1 + dy), brand, radius=36, outline=sage if win else None,
                          outline_w=6 if win else 3)
            mx = (x0 + x1) / 2
            if kind == "robot":
                xray(draw, mx - 140, y0 + 240 + dy, 0.6, t, spot=True, ring=True)
                K.draw_robot(draw, mx + 140, y0 + 290 + dy, 0.5, t, mood="happy")
            else:
                doctor(draw, mx - 100, y0 + 180 + dy, 1.0, t)
                medicine(draw, mx + 170, y0 + 240 + dy, 1.0)
            K.text_at(draw, lab, mx, y1 - 110 + dy, F(52), sage if win else ink)
            if win:
                K.draw_check(draw, x1 - 50, y0 + 50 + dy, 34, sage)
                crown(draw, mx - 100, y0 + 50 + dy, 0.9)
        if progress > 0.3:
            K.draw_arrow(draw, 880, 560, 1040, 560, muted, width=12, head=34)
        return True

    # ---- scientists ------------------------------------------------------------------------------
    if visual == "b19-science":
        if focus == "camera":
            draw.rectangle((100, 760, 1820, 860), fill=GRASS)
            for i, (x, s, col) in enumerate(((220, 1.0, FOREST), (480, 1.25, FOREST_DARK), (1180, 1.1, FOREST),
                                             (1700, 1.0, FOREST_DARK))):
                tree(draw, x, 790, s, col)
            tree(draw, 820, 800, 1.4, FOREST)
            trail_cam(draw, 820, 680, 1.1, t)
            for k in range(6):
                a = K.clamp01(progress * 6 - k * 0.8)
                if a <= 0:
                    continue
                e = K.ease_out_cubic(a)
                x = K.lerp(880, 1360 + (k % 3) * 22, e)
                y = K.lerp(660, 380 + (k % 3) * 18, e)
                draw.rounded_rectangle((x - 70, y - 54, x + 70, y + 54), radius=8, fill=(255, 255, 255),
                                       outline=K.DEV_MID, width=3)
                draw.rectangle((x - 60, y - 44, x + 60, y + 30), fill=(200, 226, 190))
            K.pill(draw, 1420, 280, "Thousands of photos!", coral, size=34)
            return True
        if focus == "count":
            animals = ["tiger", "deer", "deer", "elephant", "deer", "tiger", "elephant", "deer"]
            scan = int(progress * 10)
            for k, kind in enumerate(animals):
                r, c = divmod(k, 4)
                x0 = 130 + c * 250
                y0 = 280 + r * 280
                seen = k < scan
                draw.rounded_rectangle((x0 + 6, y0 + 8, x0 + 226, y0 + 248), radius=16, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 220, y0 + 240), radius=16, fill=(206, 230, 196),
                                       outline=sage if seen else line, width=6 if seen else 3)
                hx, hy = x0 + 110, y0 + 130
                {"tiger": tiger_head, "deer": deer_head, "elephant": elephant_head}[kind](draw, hx, hy, 0.85)
                if seen:
                    K.draw_check(draw, x0 + 196, y0 + 24, 20, sage)
            if scan < 8:
                k = scan
                r, c = divmod(k, 4)
                K.draw_magnifier(draw, 130 + c * 250 + 150, 280 + r * 280 + 150, 0.5, coral)
            K.shadow_card(draw, (1170, 280, 1790, 820), brand, radius=32, accent=sage)
            K.text_at(draw, "AI count", 1480, 300, F(40), (255, 255, 255))
            counts = {"tiger": 0, "deer": 0, "elephant": 0}
            for kind in animals[:scan]:
                counts[kind] += 1
            for i, (kind, fn) in enumerate((("tiger", tiger_head), ("deer", deer_head), ("elephant", elephant_head))):
                y = 440 + i * 130
                fn(draw, 1290, y + 20, 0.55)
                draw.text((1380, y - 10), kind.capitalize(), fill=ink, font=F(42))
                K.text_at(draw, str(counts[kind]), 1700, y - 20, F(64), coral)
            return True
        # storm
        draw.rounded_rectangle((140, 260, 1100, 840), radius=36, fill=SKY)
        for k, (x, y, s) in enumerate(((330, 400, 0.9), (560, 360, 1.1), (820, 420, 0.95))):
            a = K.stagger(progress, k, step=0.15, speed=4)
            if a <= 0:
                continue
            col = tuple(int(K.lerp(c1, c2, min(1.0, progress * 1.4))) for c1, c2 in zip((250, 252, 255), STORM))
            cloud(draw, x + 20 * math.sin(t * 3 + k), y, s, col)
        if progress > 0.45:
            bolt(draw, 560, 440, 1.2)
            for k in range(14):
                rx = 260 + (k * 53) % 700
                ry = 520 + ((k * 71 + t * 600) % 170)
                draw.line((rx, ry, rx - 10, ry + 30), fill=K.WATER_DEEP, width=5)
        K.text_at(draw, "Clouds pattern \u2192 storm!", 620, 770, F(40), ink)
        scientist(draw, 1440, 450, 1.15, t)
        K.pill(draw, 1440, 680, "Scientists check", K.BOT, size=36)
        K.pill(draw, 1440, 770, "Warn everyone!", coral, size=36)
        return True

    # ---- artists ---------------------------------------------------------------------------------
    if visual == "b19-artist":
        if focus == "intro":
            draw.ellipse((480 - 250, 520 - 250, 480 + 250, 520 + 250), fill=LAV_SOFT)
            K.draw_person(draw, 480, 470, 1.25, "mom", t)
            brush(draw, 640, 640, 0.8, -1.0, PEACOCK)
            K.pill(draw, 480, 720, "Ritu ma'am", K.BOTH_COLOR, size=38)
            canvas = easel(draw, 1220, 540, 1.0)
            peacock(draw, (canvas[0] + canvas[2]) / 2, canvas[1] + 190, 0.9)
            palette(draw, 1620, 770, 0.7)
            sparkle([(900, 300), (1560, 300)])
            return True
        if focus == "brush":
            K.text_at(draw, "AI ideas", 330, 226, F(40), muted)
            ideas = [(PEACOCK, FEATHER), ((214, 160, 40), K.GOLD), ((40, 130, 80), (110, 190, 90))]
            pick = 0
            for i, (b, tl) in enumerate(ideas):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y0 = 290 + i * 190 + int((1 - a) * 20)
                chosen = progress > 0.6 and i == pick
                draw.rounded_rectangle((180, y0, 480, y0 + 170), radius=18, fill=panel,
                                       outline=sage if chosen else line, width=6 if chosen else 3)
                peacock(draw, 330, y0 + 120, 0.48, b, tl)
                if chosen:
                    K.draw_check(draw, 470, y0 + 12, 24, sage)
            K.draw_robot(draw, 640, 760, 0.3, t, mood="happy")
            if progress > 0.6:
                K.draw_arrow(draw, 520, 375, 760, 375, sage, width=12, head=34)
            K.draw_person(draw, 960, 470, 1.05, "mom", t)
            brush(draw, 1110, 610, 0.7, -0.6, PEACOCK)
            canvas = easel(draw, 1480, 540, 1.0)
            fill_a = K.clamp01((progress - 0.55) * 2.5)
            if fill_a > 0:
                peacock(draw, (canvas[0] + canvas[2]) / 2, canvas[1] + 190, 0.9 * (0.5 + 0.5 * fill_a))
            K.pill(draw, 1480, 790, "Her own way", K.BOTH_COLOR, size=34)
            return True
        # fair
        panels = [((150, 280, 920, 830), sage, "Imagination leads", True),
                  ((1000, 280, 1770, 830), K.DANGER, "Copying isn't fair", False)]
        for i, (box, col, lab, ok) in enumerate(panels):
            a = K.stagger(progress, i, step=0.25, speed=4)
            if a <= 0:
                continue
            dy = int((1 - a) * 40)
            x0, y0, x1, y1 = box
            draw.rounded_rectangle((x0 + 10, y0 + 12 + dy, x1 + 10, y1 + 12 + dy), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0 + dy, x1, y1 + dy), radius=36, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=5)
            mx = (x0 + x1) / 2
            if ok:
                K.draw_person(draw, mx - 150, y0 + 200 + dy, 0.95, "mom", t)
                for k in range(3):
                    a2 = t * 2 + k * 2.1
                    K.draw_star(draw, mx - 150 + 120 * math.cos(a2), y0 + 90 + dy + 26 * math.sin(a2), 18, K.GOLD,
                                rot=t + k)
                cv = (mx + 20, y0 + 90 + dy, mx + 330, y0 + 380 + dy)
                draw.rectangle(cv, fill=(255, 255, 255), outline=WOOD_DARK, width=5)
                peacock(draw, (cv[0] + cv[2]) / 2, cv[1] + 180, 0.7)
                K.draw_check(draw, x1 - 46, y0 + 46 + dy, 30, sage)
            else:
                for k in range(2):
                    px = mx - 170 + k * 340
                    cv = (px - 130, y0 + 110 + dy, px + 130, y0 + 350 + dy)
                    draw.rectangle(cv, fill=(255, 255, 255), outline=WOOD_DARK, width=5)
                    peacock(draw, px, cv[1] + 150, 0.6, (200, 70, 120), (230, 120, 160))
                K.draw_arrow(draw, mx - 30, y0 + 230 + dy, mx + 30, y0 + 230 + dy, K.DANGER, width=10, head=26)
                K.pill(draw, mx, y0 + 380 + dy, "copy", K.DANGER, size=28)
                K.draw_cross(draw, x1 - 46, y0 + 46 + dy, 30, K.DANGER)
            K.text_at(draw, lab, mx, y1 - 100 + dy, F(48), col)
        return True

    # ---- people in charge -------------------------------------------------------------------------
    if visual == "b19-charge":
        if focus == "oops":
            K.text_at(draw, "AI can make mistakes", cx, 236 + lift, F(66), ink)
            draw.ellipse((cx - 280, 600 - 260, cx + 280, 600 + 260), fill=coral_soft)
            K.draw_robot(draw, cx, 620, 0.85, t, mood="confused")
            qmarks([(cx - 420, 380), (cx + 420, 380), (cx - 500, 640), (cx + 500, 640)], 80)
            K.pill(draw, cx + 560, 780, "Oops!", K.DANGER, size=44)
            return True
        if focus == "check":
            draw.ellipse((320 - 190, 560 - 190, 320 + 190, 560 + 190), fill=sage_soft)
            tulsi_leaf(draw, 320, 560, 1.0)
            K.pill(draw, 320, 790, "Tulsi leaf", sage, size=32)
            box = phone(draw, 760, 555, 1.08)
            plant_screen(box, "Mint leaf?", ok=False, leaf="tulsi")
            K.draw_cross(draw, box[2] - 4, box[1] + 290, 26, K.DANGER)
            K.draw_person(draw, 1230, 560, 1.0, "kid", t)
            K.draw_person(draw, 1560, 560, 1.05, "nani", t)
            K.draw_magnifier(draw, 1060, 400, 0.55, coral)
            a = K.ease_out_cubic(K.clamp01((progress - 0.2) * 3))
            if a > 0:
                K.draw_bubble(draw, (1290, 250, 1790, 370), brand, "That's tulsi!", tail="right", size=44)
            K.pill(draw, 1400, 770, "People check AI's work", sage, size=36)
            return True
        # team
        K.pill(draw, 690, 236, "PEOPLE IN CHARGE", sage, size=36)
        people = [(330, "doc", "Doctor"), (690, "sci", "Scientist"), (1050, "art", "Artist")]
        for i, (x, kind, lab) in enumerate(people):
            a = K.stagger(progress, i, step=0.15, speed=4)
            if a <= 0:
                continue
            y = 480 + int((1 - a) * 30)
            draw.ellipse((x - 150, y - 140, x + 150, y + 160), fill=[sage_soft, BLUE_SOFT, LAV_SOFT][i])
            if kind == "doc":
                doctor(draw, x, y, 0.95, t)
            elif kind == "sci":
                scientist(draw, x, y, 0.95, t)
            else:
                K.draw_person(draw, x, y, 0.95, "mom", t)
            K.draw_star(draw, x + 110, y - 90, 22, K.GOLD, rot=t + i)
            K.pill(draw, x, y + 200, lab, [sage, K.BOT, K.BOTH_COLOR][i], size=32)
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            draw.line((1270, 300, 1270, 820), fill=line, width=4)
            K.draw_robot(draw, 1550, 580 + int((1 - a) * 30), 0.72, t, mood="happy")
            K.pill(draw, 1550, 790, "AI helper", K.DEV_MID, size=34)
            K.draw_heart(draw, 1700, 320 + bounce, 24, K.DANGER)
        return True

    # ---- matching game ------------------------------------------------------------------------------
    if visual == "b19-match":
        ans = focus == "answer"
        helpers = [("read", "Read-aloud app", K.BOTH_COLOR), ("xray", "X-ray helper", sage),
                   ("count", "Animal counter", K.BOT)]
        people = [("sci", "Scientist", K.BOT), ("nani", "Can't see well", K.BOTH_COLOR), ("doc", "Doctor", sage)]
        match = {0: 1, 1: 2, 2: 0}
        ys = [280, 470, 660]
        for i, (kind, lab, col) in enumerate(helpers):
            a = K.stagger(progress, i, step=0.1, speed=5) if not ans else 1.0
            if a <= 0:
                continue
            y = ys[i]
            draw.rounded_rectangle((150 + 8, y + 10, 760 + 8, y + 160 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((150, y, 760, y + 160), radius=36, fill=panel, outline=col, width=5)
            if kind == "read":
                ph = phone(draw, 240, y + 80, 0.32)
                draw.rectangle(ph, fill=(255, 255, 255))
                K.sound_waves(draw, 280, y + 80, 0.45, col, t)
            elif kind == "xray":
                xray(draw, 240, y + 80, 0.34, t)
            else:
                trail_cam(draw, 240, y + 74, 0.8, 0)
            draw.text((340, y + 50), lab, fill=ink, font=F(44))
            draw.ellipse((745, y + 64, 777, y + 96), fill=col)
        for j, (kind, lab, col) in enumerate(people):
            a = K.stagger(progress, j + 3, step=0.1, speed=5) if not ans else 1.0
            if a <= 0:
                continue
            y = ys[j]
            draw.rounded_rectangle((1160 + 8, y + 10, 1770 + 8, y + 160 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((1160, y, 1770, y + 160), radius=36, fill=panel, outline=col, width=5)
            if kind == "doc":
                doctor(draw, 1260, y + 60, 0.5, 0)
            elif kind == "sci":
                scientist(draw, 1260, y + 60, 0.5, 0)
            else:
                K.draw_person(draw, 1260, y + 60, 0.5, "nani", 0)
            draw.text((1350, y + 50), lab, fill=ink, font=F(44))
            draw.ellipse((1144, y + 64, 1176, y + 96), fill=col)
        if ans:
            for i, (_, _, col) in enumerate(helpers):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y0 = ys[i] + 80
                y1 = ys[match[i]] + 80
                x1 = K.lerp(777, 1144, a)
                yy = K.lerp(y0, y1, a)
                draw.line((777, y0, x1, yy), fill=col, width=10)
                if a >= 1:
                    K.draw_check(draw, 960, (y0 + y1) / 2, 24, col)
        else:
            K.draw_stopwatch(draw, 960, 560, 56, progress, brand)
            K.text_at(draw, "?", 960, 300, F(90 + 20 * pulse), K.GOLD)
        return True

    # ---- true or false -------------------------------------------------------------------------------
    if visual == "b19-truefalse":
        q1 = focus in ("q1", "a1")
        ans = focus in ("a1", "a2")
        text = ("\u201cOnce scientists use AI, they don't need to check its work.\u201d" if q1
                else "\u201cAI is alive, and has its own ideas.\u201d")
        K.shadow_card(draw, (170, 250, 1750, 470), brand, radius=36, accent=K.GOLD)
        K.text_at(draw, "TRUE OR FALSE?", cx, 282, F(30), muted)
        if q1:
            scientist(draw, 310, 340, 0.55, t)
        else:
            K.draw_robot(draw, 310, 400, 0.24, t, mood="confused" if not ans else "happy")
        font = F(44)
        lines = K.wrap_text(text, font, 1240)
        for j, ln in enumerate(lines):
            draw.text((440, 345 + j * 54 - (len(lines) - 1) * 18), ln, fill=ink, font=font)
        tf_buttons(ans, False)
        if ans:
            msg = "AI can be wrong, so people always check" if q1 else "AI is a tool that learned from examples"
            a = K.ease_out_cubic(K.clamp01(progress * 3))
            K.pill(draw, cx, 770 + int((1 - a) * 20), msg, coral, size=36)
        else:
            K.draw_stopwatch(draw, cx, 640, 54, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------------------------
    if visual == "b19-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 280 + lift, w - 420, 800 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 340 + lift, F(40), sage)
            K.text_at(draw, "AI and your medicine", cx, 410 + lift, F(64), ink)
            K.draw_robot(draw, cx - 230, 680 + lift, 0.36, t, mood="happy")
            medicine(draw, cx, 640 + lift, 0.9)
            doctor(draw, cx + 240, 580 + lift, 0.6, t)
            return True
        if focus == "ask":
            K.text_at(draw, "Should AI choose your medicine", cx, 236, F(56), ink)
            K.text_at(draw, "without a doctor? Why?", cx, 310, F(56), coral)
            K.draw_robot(draw, 470, 680, 0.55, t, mood="idle")
            medicine(draw, 790, 650, 1.0)
            K.draw_person(draw, 1090, 560, 0.9, "mystery", 0)
            K.text_at(draw, "Doctor?", 1090, 720, F(36), muted)
            pencil(draw, 1560, 470, 0.9)
            K.pill(draw, 1560, 600, "Pause & try!", coral, size=40)
            K.draw_stopwatch(draw, 1650, 770, 44, progress, brand)
            return True
        K.text_at(draw, "No!", 300, 250, F(96), coral)
        steps = [("robot", "AI can help", K.BOT), ("doc", "Doctor checks & decides", sage),
                 ("kid", "People stay in charge", coral)]
        for i, (kind, lab, col) in enumerate(steps):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x0 = 170 + i * 540
            y0 = 380 + int((1 - a) * 40)
            K.shadow_card(draw, (x0, y0, x0 + 480, y0 + 460), brand, radius=32, outline=col, outline_w=5)
            mx = x0 + 240
            if kind == "robot":
                K.draw_robot(draw, mx, y0 + 200, 0.42, t, mood="happy")
            elif kind == "doc":
                doctor(draw, mx - 60, y0 + 140, 0.8, t)
                medicine(draw, mx + 120, y0 + 190, 0.7)
                K.draw_check(draw, x0 + 430, y0 + 50, 28, sage)
            else:
                K.draw_person(draw, mx - 70, y0 + 150, 0.8, "kid", t)
                K.draw_person(draw, mx + 80, y0 + 150, 0.8, "nani", t)
            label_lines(lab, mx, y0 + 330, 38, ink, 420)
            if i < 2:
                K.draw_arrow(draw, x0 + 488, y0 + 230, x0 + 532, y0 + 230, muted, width=8, head=22)
        return True

    # ---- recap & celebration -----------------------------------------------------------------------------
    if visual == "b19-recap":
        recap = [("Spot, read, find routes", coral, "every"), ("Doctors, scientists, artists", K.BOT, "pros"),
                 ("A tool, not the boss", K.BOTH_COLOR, "tool"), ("People make big choices", sage, "people")]
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
                mx, my = x0 + 200, y0 + 200
                if kind == "every":
                    neem_leaf(draw, mx - 90, my - 20, 0.5)
                    open_book(draw, mx + 70, my - 60, 0.38)
                    K.draw_map_pin(draw, mx + 70, my + 110, 0.6, K.DANGER)
                elif kind == "pros":
                    doctor(draw, mx - 100, my - 50, 0.5, t)
                    scientist(draw, mx + 100, my - 50, 0.5, t)
                    palette(draw, mx, my + 110, 0.5)
                elif kind == "tool":
                    K.draw_robot(draw, mx, my + 40, 0.42, t, mood="happy")
                else:
                    K.draw_person(draw, mx, my - 30, 0.85, "kid", t)
                    crown(draw, mx, my - 140, 0.8)
                font = F(36)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 390 + j * 44, font, ink)
            return True
        if focus == "done":
            confetti(y0=230, y1=600)
            K.draw_mascot(draw, int(cx - 520), 480, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 520, 540, 0.65, t, mood="happy", wave=t)
            K.shadow_card(draw, (cx - 330, 300, cx + 330, 560), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 4", cx, 340, F(40), sage)
            K.text_at(draw, "Done!", cx, 400, F(110), coral)
            K.text_at(draw, "Next: imagine your own AI helper!", cx, 680, F(52), ink)
            return True
        K.draw_mascot(draw, int(cx - 600), 540, 100, sage, panel, bounce)
        K.draw_robot(draw, cx + 600, 600, 0.6, t, mood="happy", wave=t)
        K.text_at(draw, "Quiz time!", cx, 380, F(72), coral)
        K.text_at(draw, "Tap Finish and try the quiz", cx, 500, F(48), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
