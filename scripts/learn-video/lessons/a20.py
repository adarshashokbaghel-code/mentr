"""A20 · Capstone: Design Your Dream App — visuals."""
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
BUS_YELLOW = (255, 196, 40)
PENCIL = (255, 200, 60)
SPOT = (255, 246, 214)


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


def sketch_phone(draw, cx, cy, s, col, phase=0.0):
    W, H = 110 * s, 200 * s
    for (x0, y0, x1, y1) in ((cx - W, cy - H, cx + W, cy - H), (cx + W, cy - H, cx + W, cy + H),
                             (cx + W, cy + H, cx - W, cy + H), (cx - W, cy + H, cx - W, cy - H)):
        K.draw_dashed(draw, x0, y0, x1, y1, col, width=5, dash=18, gap=10, phase=phase)
    return (cx - W + 16 * s, cy - H + 30 * s, cx + W - 16 * s, cy + H - 30 * s)


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


def book(draw, cx, cy, s, col, label):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(70) + S(6), cy - S(90) + S(8), cx + S(70) + S(6), cy + S(90) + S(8)), radius=S(10),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(70), cy - S(90), cx + S(70), cy + S(90)), radius=S(10), fill=col)
    draw.rectangle((cx - S(70), cy - S(90), cx - S(50), cy + S(90)), fill=tuple(int(c * 0.78) for c in col))
    draw.rounded_rectangle((cx - S(38), cy - S(40), cx + S(58), cy + S(4)), radius=S(6), fill=(255, 255, 255))
    K.text_at(draw, label, cx + S(10), cy - S(36), F(S(32)), K.DEV_DARK)


def bottle(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(18), cy - S(110), cx + S(18), cy - S(84)), radius=S(6), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(44) + S(6), cy - S(86) + S(8), cx + S(44) + S(6), cy + S(90) + S(8)), radius=S(20),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(44), cy - S(86), cx + S(44), cy + S(90)), radius=S(20), fill=(120, 190, 242))
    draw.rounded_rectangle((cx - S(44), cy - S(10), cx + S(44), cy + S(30)), radius=S(4), fill=K.CORAL)
    draw.line((cx - S(24), cy - S(70), cx - S(24), cy - S(24)), fill=(255, 255, 255), width=max(2, int(S(8))))


def bulb(draw, cx, cy, s, t=0.0, lit=True):
    def S(v):
        return v * s
    if lit:
        for k in range(8):
            a = k * math.pi / 4 + t * 0.5
            r0, r1 = S(92), S(122 + 8 * math.sin(t * 10 + k))
            draw.line((cx + math.cos(a) * r0, cy - S(10) + math.sin(a) * r0,
                       cx + math.cos(a) * r1, cy - S(10) + math.sin(a) * r1), fill=K.GOLD, width=max(3, int(S(9))))
    draw.ellipse((cx - S(70), cy - S(80), cx + S(70), cy + S(60)), fill=K.GOLD if lit else (230, 226, 216))
    draw.polygon([(cx - S(36), cy + S(44)), (cx + S(36), cy + S(44)), (cx + S(28), cy + S(78)), (cx - S(28), cy + S(78))],
                 fill=K.GOLD if lit else (230, 226, 216))
    for k in range(3):
        y = cy + S(80) + k * S(16)
        draw.rounded_rectangle((cx - S(30), y, cx + S(30), y + S(12)), radius=S(6), fill=K.STEEL_DARK)
    draw.line([(cx - S(18), cy + S(40)), (cx - S(10), cy - S(6)), (cx, cy + S(14)), (cx + S(10), cy - S(6)),
               (cx + S(18), cy + S(40))], fill=(214, 140, 30), width=max(2, int(S(5))))


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


def app_icon(draw, cx, cy, size, col, glyph, t=0.0):
    r = size / 2
    draw.rounded_rectangle((cx - r + 10, cy - r + 12, cx + r + 10, cy + r + 12), radius=size * 0.24, fill=K.SHADOW)
    draw.rounded_rectangle((cx - r, cy - r, cx + r, cy + r), radius=size * 0.24, fill=col)
    if glyph == "bag":
        K.draw_bag(draw, cx, cy + size * 0.08, size / 330, (255, 255, 255))
        draw.ellipse((cx - size * 0.05, cy - size * 0.03, cx + size * 0.05, cy + size * 0.07), fill=col)
    elif glyph == "star":
        K.draw_star(draw, cx, cy, size * 0.34, (255, 255, 255), rot=t * 0.5)
    elif glyph == "clock":
        draw.ellipse((cx - r * 0.6, cy - r * 0.6, cx + r * 0.6, cy + r * 0.6), fill=(255, 255, 255))
        draw.line((cx, cy, cx, cy - r * 0.42), fill=K.DEV_DARK, width=max(3, int(size * 0.05)))
        draw.line((cx, cy, cx + r * 0.3, cy + r * 0.1), fill=K.DEV_DARK, width=max(3, int(size * 0.05)))
    elif glyph == "bus":
        bus(draw, cx, cy + size * 0.04, size / 420)


def bus(draw, cx, cy, s, t=0.0):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(170) + S(8), cy - S(90) + S(10), cx + S(170) + S(8), cy + S(70) + S(10)),
                           radius=S(28), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(170), cy - S(90), cx + S(170), cy + S(70)), radius=S(28), fill=BUS_YELLOW)
    for k in range(4):
        wx = cx - S(140) + k * S(72)
        draw.rounded_rectangle((wx, cy - S(70), wx + S(56), cy - S(20)), radius=S(8), fill=K.DEV_SCREEN)
    draw.rectangle((cx - S(170), cy + S(4), cx + S(170), cy + S(18)), fill=K.DEV_DARK)
    for wx in (cx - S(100), cx + S(100)):
        draw.ellipse((wx - S(32), cy + S(40), wx + S(32), cy + S(104)), fill=K.DEV_DEEP)
        draw.ellipse((wx - S(13), cy + S(59), wx + S(13), cy + S(85)), fill=K.STEEL)
    draw.ellipse((cx + S(150), cy + S(26), cx + S(170), cy + S(46)), fill=(255, 240, 180))


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


def code_card(draw, cx, cy, s, crossed=True):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(130) + S(8), cy - S(90) + S(10), cx + S(130) + S(8), cy + S(90) + S(10)),
                           radius=S(24), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(130), cy - S(90), cx + S(130), cy + S(90)), radius=S(24), fill=K.DEV_DEEP)
    K.text_at(draw, "</>", cx, cy - S(52), F(S(80)), (120, 220, 180))
    if crossed:
        K.draw_cross(draw, cx + S(120), cy - S(80), S(40), K.DANGER)


def kids_row(draw, xs, y, s, t, kinds=("friend", "kid", "kid")):
    for x, kind in zip(xs, kinds):
        K.draw_person(draw, x, y, s, kind, t)


def screen_input(draw, box, t, taps=4, active=True):
    x0, y0, x1, y1 = box
    bw = x1 - x0
    draw.rectangle(box, fill=(255, 255, 255) if active else (238, 236, 232))
    draw.rectangle((x0, y0, x1, y0 + 56), fill=K.CORAL if active else (210, 206, 200))
    K.text_at(draw, "Bag Buddy", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
    if not active:
        return
    K.text_at(draw, "Tomorrow?", (x0 + x1) / 2, y0 + 70, F(28), K.DEV_MID)
    subj = [("Maths", K.BOT), ("English", K.BOTH_COLOR), ("Science", (13, 148, 136)), ("Art", K.CORAL)]
    for i, (lab, col) in enumerate(subj):
        by = y0 + 120 + i * 74
        on = i < taps
        draw.rounded_rectangle((x0 + 16, by, x1 - 16, by + 60), radius=18, fill=col if on else (240, 238, 234),
                               outline=col, width=3)
        K.text_at(draw, lab, (x0 + x1) / 2, by + 12, F(28), (255, 255, 255) if on else col)
    if taps < 4 or t > 0:
        fy = y0 + 120 + min(3, max(0, taps - 1)) * 74 + 30
        ring = 8 + 18 * ((t * 2.4) % 1)
        draw.ellipse((x1 - 44 - ring, fy - ring, x1 - 44 + ring, fy + ring), outline=K.DEV_DARK, width=4)
    _ = bw


def screen_output(draw, box, t, reveal=1.0):
    x0, y0, x1, y1 = box
    draw.rectangle(box, fill=(255, 255, 255))
    draw.rectangle((x0, y0, x1, y0 + 56), fill=K.CORAL)
    K.text_at(draw, "Pack these:", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
    items = ["Maths book", "Drawing book", "Water bottle"]
    for i, lab in enumerate(items):
        a = K.stagger(reveal, i, step=0.18, speed=4)
        if a <= 0:
            continue
        iy = y0 + 80 + i * 72
        K.draw_check(draw, x0 + 36, iy + 24, 18, (13, 148, 136))
        draw.text((x0 + 64, iy + 8), lab, fill=K.DEV_DEEP, font=F(27))
    if reveal > 0.7:
        draw.rounded_rectangle((x0 + 16, y1 - 86, x1 - 16, y1 - 20), radius=30, fill=(13, 148, 136))
        K.text_at(draw, "All packed!", (x0 + x1) / 2, y1 - 72, F(30), (255, 255, 255))


def var_box(draw, cx, cy, s, label, value, col):
    def S(v):
        return v * s
    draw.polygon([(cx - S(110), cy - S(40)), (cx - S(150), cy - S(100)), (cx + S(10), cy - S(100)),
                  (cx + S(40), cy - S(40))], fill=tuple(int(c * 0.86) for c in col))
    draw.rounded_rectangle((cx - S(110) + S(8), cy - S(40) + S(10), cx + S(110) + S(8), cy + S(110) + S(10)),
                           radius=S(14), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(40), cx + S(110), cy + S(110)), radius=S(14), fill=col)
    draw.rounded_rectangle((cx - S(80), cy - S(12), cx + S(80), cy + S(84)), radius=S(14), fill=(255, 255, 255))
    K.text_at(draw, value, cx, cy - S(6), F(S(76)), K.DEV_DEEP)
    K.pill(draw, cx, cy + S(124), label, K.DEV_DARK, size=max(26, int(S(30))))


def loop_arrow(draw, cx, cy, r, col, t, width=14):
    a0 = (t * 200) % 360
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0, a0 + 290, fill=col, width=width)
    a = math.radians(a0 + 290)
    hx, hy = cx + math.cos(a) * r, cy + math.sin(a) * r
    tx, ty = -math.sin(a), math.cos(a)
    nx, ny = math.cos(a), math.sin(a)
    hs = width * 1.9
    draw.polygon([(hx + tx * hs, hy + ty * hs), (hx + nx * hs * 0.9, hy + ny * hs * 0.9),
                  (hx - nx * hs * 0.9, hy - ny * hs * 0.9)], fill=col)


def rocket(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.polygon([(cx - S(40), cy + S(30)), (cx - S(70), cy + S(80)), (cx - S(30), cy + S(60))], fill=K.DANGER)
    draw.polygon([(cx + S(40), cy + S(30)), (cx + S(70), cy + S(80)), (cx + S(30), cy + S(60))], fill=K.DANGER)
    draw.rounded_rectangle((cx - S(40), cy - S(50), cx + S(40), cy + S(70)), radius=S(30), fill=K.STEEL)
    draw.polygon([(cx - S(40), cy - S(30)), (cx, cy - S(110)), (cx + S(40), cy - S(30))], fill=K.STEEL)
    draw.ellipse((cx - S(18), cy - S(24), cx + S(18), cy + S(12)), fill=K.DEV_SCREEN, outline=K.DEV_DARK,
                 width=max(2, int(S(4))))
    draw.polygon([(cx - S(22), cy + S(70)), (cx + S(22), cy + S(70)), (cx, cy + S(110))], fill=K.GOLD)


def factory(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rectangle((cx + S(40), cy - S(110), cx + S(70), cy - S(10)), fill=K.DEV_MID)
    draw.polygon([(cx - S(90), cy + S(70)), (cx - S(90), cy - S(30)), (cx - S(40), cy), (cx - S(40), cy - S(30)),
                  (cx + S(10), cy), (cx + S(10), cy - S(30)), (cx + S(90), cy), (cx + S(90), cy + S(70))],
                 fill=K.STEEL_DARK)
    for k in range(3):
        wx = cx - S(70) + k * S(56)
        draw.rectangle((wx, cy + S(20), wx + S(32), cy + S(46)), fill=K.GOLD)


def abc_blocks(draw, cx, cy, s):
    def S(v):
        return v * s
    for k, (lab, col, dx, dy) in enumerate((("A", K.CORAL, -56, 30), ("B", K.BOT, 56, 30), ("C", (13, 148, 136), 0, -60))):
        x, y = cx + S(dx), cy + S(dy)
        draw.rounded_rectangle((x - S(52) + S(6), y - S(48) + S(8), x + S(52) + S(6), y + S(48) + S(8)), radius=S(12),
                               fill=K.SHADOW)
        draw.rounded_rectangle((x - S(52), y - S(48), x + S(52), y + S(48)), radius=S(12), fill=col)
        K.text_at(draw, lab, x, y - S(40), F(S(64)), (255, 255, 255))


def homework(draw, cx, cy, s):
    def S(v):
        return v * s
    draw.rounded_rectangle((cx - S(90) + S(6), cy - S(70) + S(8), cx + S(90) + S(6), cy + S(70) + S(8)), radius=S(10),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), cy - S(70), cx + S(90), cy + S(70)), radius=S(10), fill=PAPER,
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.line((cx, cy - S(70), cx, cy + S(70)), fill=K.DEV_DARK, width=max(2, int(S(4))))
    for k in range(4):
        ly = cy - S(40) + k * S(24)
        draw.line((cx - S(74), ly, cx - S(16), ly), fill=RULE, width=max(2, int(S(5))))
        draw.line((cx + S(16), ly, cx + S(74), ly), fill=RULE, width=max(2, int(S(5))))
    pencil(draw, cx + S(40), cy + S(30), 0.5 * s, -0.8)


def calendar_tile(draw, x, y, wd, ht, label, col, on):
    draw.rounded_rectangle((x + 6, y + 8, x + wd + 6, y + ht + 8), radius=18, fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + wd, y + ht), radius=18, fill=(255, 255, 255), outline=col if on else K.STEEL,
                           width=4)
    draw.rounded_rectangle((x, y, x + wd, y + 50), radius=18, fill=col if on else K.STEEL)
    draw.rectangle((x, y + 30, x + wd, y + 50), fill=col if on else K.STEEL)
    K.text_at(draw, label, x + wd / 2, y + 8, F(28), (255, 255, 255))


def bell(draw, cx, cy, s, col, t=0.0):
    def S(v):
        return v * s
    sw = math.sin(t * 20) * S(6)
    draw.pieslice((cx - S(36) + sw, cy - S(40), cx + S(36) + sw, cy + S(40)), 180, 360, fill=col)
    draw.rectangle((cx - S(36) + sw, cy, cx + S(36) + sw, cy + S(18)), fill=col)
    draw.rounded_rectangle((cx - S(46) + sw, cy + S(14), cx + S(46) + sw, cy + S(26)), radius=S(6), fill=col)
    draw.ellipse((cx - S(10) + sw, cy + S(24), cx + S(10) + sw, cy + S(42)), fill=K.DEV_DARK)


def arch(draw, cx, base_y, s, cap_drop):
    def S(v):
        return v * s
    for side in (-1, 1):
        px = cx + side * S(170)
        for k in range(5):
            y = base_y - (k + 1) * S(56)
            off = S(14) if k % 2 else 0
            draw.rounded_rectangle((px - S(56) + off * side * 0, y, px + S(56), y + S(52)), radius=S(6),
                                   fill=STONE if k % 2 else STONE_DARK)
    top = base_y - 5 * S(56)
    n = 7
    for k in range(n):
        if k == n // 2:
            continue
        a0 = math.pi + k * math.pi / n
        a1 = a0 + math.pi / n
        r0, r1 = S(114), S(226)
        pts = [(cx + math.cos(a0) * r1, top + math.sin(a0) * r1), (cx + math.cos(a1) * r1, top + math.sin(a1) * r1),
               (cx + math.cos(a1) * r0, top + math.sin(a1) * r0), (cx + math.cos(a0) * r0, top + math.sin(a0) * r0)]
        draw.polygon(pts, fill=STONE if k % 2 else STONE_DARK, outline=(150, 138, 120), width=max(2, int(S(3))))
    k = n // 2
    a0 = math.pi + k * math.pi / n
    a1 = a0 + math.pi / n
    r0, r1 = S(114), S(226)
    dy = -cap_drop
    pts = [(cx + math.cos(a0) * r1, top + math.sin(a0) * r1 + dy), (cx + math.cos(a1) * r1, top + math.sin(a1) * r1 + dy),
           (cx + math.cos(a1) * r0, top + math.sin(a1) * r0 + dy), (cx + math.cos(a0) * r0, top + math.sin(a0) * r0 + dy)]
    draw.polygon(pts, fill=K.GOLD, outline=(214, 150, 40), width=max(2, int(S(4))))
    draw.rectangle((cx - S(280), base_y, cx + S(280), base_y + S(20)), fill=STONE_DARK)
    return pts


A20_STEPS = [("bulb", "Find a problem"), ("plan", "Write the plan"), ("screens", "Draw 2 screens"),
             ("pitch", "1-minute pitch")]
A20_IDEAS = [("homework", "Homework"), ("bag", "Packing bag"), ("abc", "Spellings"), ("water", "Drinking water")]
A20_CLEAR = [("A", "\u201cA cool app that does stuff.\u201d"),
             ("B", "\u201cAn app for everyone that does everything.\u201d"),
             ("C", "\u201cA game. Not sure who plays it yet.\u201d"),
             ("D", "\u201cSpell Star: for Class 3 kids. Input: a word they type. Output: a star if it\u2019s right.\u201d")]
A20_PITCH = ["App name", "Who it's for", "The input", "The output", "Show 2 screens"]
A20_UNITS = [("computer", "How Computers", "Work"), ("robot", "Thinking Like", "a Computer"),
             ("blocks", "Building", "With Blocks"), ("world", "Computers in", "Our World")]


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

    def step_icon(kind, x, y, s=1.0):
        if kind == "bulb":
            bulb(draw, x, y - 10 * s, 0.8 * s, t)
        elif kind == "plan":
            clipboard(draw, (x - 90 * s, y - 100 * s, x + 90 * s, y + 110 * s))
            for k in range(3):
                ly = y - 30 * s + k * 44 * s
                K.draw_check(draw, x - 46 * s, ly, 14 * s, sage)
                draw.rounded_rectangle((x - 24 * s, ly - 7 * s, x + 60 * s, ly + 7 * s), radius=7 * s, fill=line)
        elif kind == "screens":
            phone(draw, x - 60 * s, y, 0.5 * s)
            phone(draw, x + 60 * s, y, 0.5 * s)
        elif kind == "pitch":
            K.draw_device(draw, "mic", x - 40 * s, y + 10 * s, 0.75 * s, brand)
            K.draw_stopwatch(draw, x + 70 * s, y - 40 * s, 42 * s, t, brand)
        elif kind == "kids":
            K.draw_person(draw, x - 60 * s, y - 30 * s, 0.6 * s, "friend", t)
            K.draw_person(draw, x + 60 * s, y - 30 * s, 0.6 * s, "kid", t)
        elif kind == "homework":
            homework(draw, x, y, s)
        elif kind == "bag":
            K.draw_bag(draw, x, y + 20 * s, 0.75 * s)
        elif kind == "abc":
            abc_blocks(draw, x, y, 0.85 * s)
        elif kind == "water":
            K.draw_glass(draw, x, y + 70 * s, 1.1 * s, 0.4 + 0.6 * ((t * 1.2) % 1))
        elif kind == "variable":
            var_box(draw, x, y - 10 * s, 0.8 * s, "stars", "5", K.GOLD)
        elif kind == "loop":
            loop_arrow(draw, x, y, 80 * s, K.BOT, t, width=max(4, int(18 * s)))
            bell(draw, x, y - 6 * s, 0.8 * s, K.GOLD, t)
        elif kind == "safety":
            K.draw_shield(draw, x, y, 0.8 * s, sage)

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

    def row_boxes(n, cw, gap, y0, y1):
        xs = cx - (n * cw + (n - 1) * gap) / 2
        return [(xs + i * (cw + gap), y0, xs + i * (cw + gap) + cw, y1) for i in range(n)]

    def plan_sheet(rows, filled, title="My App Plan", box=(130, 260, 900, 860), hi=None):
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
            draw.text((x0 + 60, ry + rh / 2 - 30), k_, fill=muted, font=F(38))
            kx = x0 + 60 + draw.textbbox((0, 0), k_ + " ", font=F(38))[2]
            if i < filled and v:
                draw.text((kx, ry + rh / 2 - 32), v, fill=ink, font=F(40))
            elif i >= filled:
                pill_box = K.pill(draw, 0, ry + rh / 2 - 28, "?", K.STEEL_DARK, size=28, left=kx)
                _ = pill_box

    # ---- opening -----------------------------------------------------------------------
    if visual == "a20-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 330), 460, 110, sage, panel, bounce)
            box = phone(draw, cx + 260, 450, 1.08)
            x0, y0, x1, y1 = box
            for i in range(6):
                r, c = divmod(i, 2)
                tx = x0 + 22 + c * ((x1 - x0 - 44) / 2 + 2)
                ty = y0 + 26 + r * 96
                draw.rounded_rectangle((tx, ty, tx + (x1 - x0 - 64) / 2, ty + 76), radius=18,
                                       fill=[coral, sage, K.BOTH_COLOR, K.GOLD, K.BOT, (240, 160, 186)][i])
            K.draw_star(draw, x0 + 22 + (x1 - x0 - 64) / 4, y0 + 64, 22, (255, 255, 255), rot=t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, F(60), ink)
            sparkle([(cx - 640, 320), (cx - 560, 600), (cx + 620, 300), (cx + 640, 600)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · DATA", cx, 290 + lift, F(34), sage)
            draw.ellipse((520 - 200, 590 - 200, 520 + 200, 590 + 200), fill=BLUE_SOFT)
            x0, y0 = 400, 440
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 240 + 8, y0 + 290 + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 240, y0 + 290), radius=20, fill=PAPER)
            draw.rounded_rectangle((x0, y0, x0 + 240, y0 + 56), radius=20, fill=K.BOT)
            draw.rectangle((x0, y0 + 36, x0 + 240, y0 + 56), fill=K.BOT)
            for k in range(4):
                ly = y0 + 90 + k * 50
                draw.ellipse((x0 + 24, ly - 12, x0 + 48, ly + 12), fill=star_cols[k])
                draw.rounded_rectangle((x0 + 64, ly - 8, x0 + 170, ly + 8), radius=8, fill=(206, 210, 222))
                draw.rounded_rectangle((x0 + 186, ly - 8, x0 + 216, ly + 8), radius=8, fill=sage)
            K.draw_padlock(draw, 650, 500, 0.5, K.DANGER)
            rows = [("Data = facts", sage), ("Tidy lists", K.BOT), ("Private stays private", K.DANGER)]
            for i, (lab, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 370 + i * 150 + int((1 - a) * 30)
                draw.rounded_rectangle((830, y, 1620, y + 120), radius=36, fill=panel, outline=col, width=5)
                K.draw_check(draw, 900, y + 60, 34, col)
                draw.text((960, y + 32), lab, fill=ink, font=F(50))
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 560 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5 · THE FINAL CHAPTER", cx, 290 + lift, F(32), coral)
            K.text_at(draw, "Capstone:", cx, 340 + lift, F(84), coral)
            K.text_at(draw, "Design Your Dream App", cx, 450 + lift, F(72), ink)
            for i, kind in enumerate(("bulb", "plan", "screens", "pitch")):
                a = K.stagger(progress, i + 2, step=0.1, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1.5) * 300
                y = 610 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 125, y, x + 125, y + 240), radius=30, fill=panel, outline=line, width=3)
                step_icon(kind, x, y + 120, 0.82)
            return True
        if focus == "word":
            drop = 150 * (1 - K.ease_out_cubic(K.clamp01((progress - 0.1) * 1.6)))
            pts = arch(draw, 600, 840, 0.85, drop)
            if drop < 4:
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
        K.draw_person(draw, 340, 470, 1.25, "kid", t)
        draw.rounded_rectangle((640 + 10, 260 + 12, 1160 + 10, 840 + 12), radius=16, fill=K.SHADOW)
        draw.rounded_rectangle((640, 260, 1160, 840), radius=16, fill=PAPER)
        draw_n = K.clamp01(progress * 1.6)
        sbox = sketch_phone(draw, 900, 540, 1.15, K.DEV_MID, phase=t * 60)
        for k in range(int(4 * draw_n)):
            ly = sbox[1] + 40 + k * 70
            draw.rounded_rectangle((sbox[0] + 20, ly, sbox[2] - 20, ly + 44), radius=20, outline=coral, width=4)
        pencil(draw, 1110, 760, 0.9)
        code_card(draw, 1500, 420, 1.0)
        K.pill(draw, 1500, 600, "No coding needed!", sage, size=40)
        K.pill(draw, 1500, 690, "You're the designer", coral, size=34)
        return True

    # ---- Kabir forgets things --------------------------------------------------------------
    if visual == "a20-hook":
        if focus == "meet":
            draw.ellipse((560 - 270, 540 - 270, 560 + 270, 540 + 270), fill=coral_soft)
            K.draw_person(draw, 560, 450, 1.35, "kid", t)
            K.draw_bag(draw, 800, 700, 0.75)
            K.text_at(draw, "Meet", 1300, 290 + lift, F(60), muted)
            K.text_at(draw, "Kabir!", 1300, 360 + lift, F(130), coral)
            K.pill(draw, 1300, 560, "Class 4", sage, size=42)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1300, 680 + int((1 - a) * 20), "One big problem…", K.DEV_MID, size=36)
            return True
        if focus == "forget":
            K.draw_bag(draw, 440, 620, 1.3)
            qmarks([(300, 330), (590, 320)], 70)
            K.pill(draw, 440, 800, "Packed in a rush", K.DEV_MID, size=32)
            draw.rounded_rectangle((900, 700, 1760, 730), radius=10, fill=WOOD_DARK)
            draw.rectangle((940, 730, 970, 860), fill=WOOD_DARK)
            draw.rectangle((1690, 730, 1720, 860), fill=WOOD_DARK)
            items = [("book", K.BOT, "Maths", 1060), ("book", K.CORAL, "Drawing", 1330), ("bottle", None, None, 1590)]
            for i, (kind, col, lab, x) in enumerate(items):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 600 - int((1 - a) * 40)
                if kind == "book":
                    book(draw, x, y, 1.0, col, lab)
                else:
                    bottle(draw, x, y + 10, 1.0)
                K.draw_cross(draw, x + 80, y - 100, 28, K.DANGER)
            K.text_at(draw, "Left at home!", 1330, 300, F(56), K.DANGER)
            return True
        if focus == "sad":
            K.draw_person(draw, 480, 520, 1.15, "kid", 0)
            K.draw_bubble(draw, (260, 240, 700, 360), brand, "Oh no!", tail="left", size=48)
            draw.rounded_rectangle((300, 760, 680, 790), radius=8, fill=WOOD_DARK)
            K.draw_person(draw, 1460, 500, 1.15, "teacher", t)
            K.draw_bubble(draw, (900, 240, 1720, 380), brand, "Kabir, where's your maths book?", tail="right", size=42)
            book(draw, 1110, 640, 0.8, K.BOT, "Maths")
            K.draw_cross(draw, 1190, 560, 26, K.DANGER)
            K.text_at(draw, "Forgot it again…", 1110, 780, F(34), muted)
            return True
        if focus == "idea":
            K.draw_person(draw, 480, 520, 1.15, "kid", t)
            bulb(draw, 480, 280, 0.75, t)
            box = phone(draw, 1300, 570, 1.05)
            K.text_at(draw, "?", 1300, (box[1] + box[3]) / 2 - 90, F(170), K.GOLD)
            K.text_at(draw, "What would you make?", 1300, 222, F(48), ink)
            K.draw_stopwatch(draw, 1640, 780, 44, progress, brand)
            return True
        # reveal
        K.draw_person(draw, 420, 480, 1.15, "kid", t)
        box = phone(draw, cx, 540, 1.3)
        x0, y0, x1, y1 = box
        draw.rectangle(box, fill=coral_soft)
        a = K.ease_out_cubic(K.clamp01(progress * 2.5))
        app_icon(draw, cx, y0 + 150, 150 * (0.6 + 0.4 * a), coral, "bag", t)
        K.text_at(draw, "Bag", cx, y0 + 270, F(52), ink)
        K.text_at(draw, "Buddy", cx, y0 + 330, F(52), coral)
        K.pill(draw, 1500, 500, "Let's design it!", sage, size=40)
        sparkle([(700, 300), (1220, 300), (1300, 720), (660, 760)])
        return True

    # ---- four steps -------------------------------------------------------------------------
    if visual == "a20-steps":
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
                draw.ellipse((x - r, y - r, x + r, y + r), fill=[coral, K.BOT, K.BOTH_COLOR, sage][i])
                K.text_at(draw, str(i + 1), x, y - 36 * a, F(60 * a), (255, 255, 255))
            fx, fy = K.qbez(p0, p1, p2, 1.0)
            draw.line((fx, fy, fx, fy - 140), fill=K.DEV_DARK, width=8)
            draw.polygon([(fx, fy - 140), (fx + 80, fy - 115), (fx, fy - 90)], fill=K.GOLD)
            K.text_at(draw, "Just 4 steps!", 1380, 270 + lift, F(72), ink)
            return True
        boxes = row_boxes(4, 380, 56, 280, 820)
        shown = progress * 5.0 - 0.3
        cols = [coral, K.BOT, K.BOTH_COLOR, sage]
        for i, ((kind, lab), box) in enumerate(zip(A20_STEPS, boxes)):
            a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
            if a <= 0:
                continue
            dy = int((1 - a) * 50)
            icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, num=i + 1, col=cols[i], label_size=38,
                      icon_s=1.15)
            if i < 3 and K.clamp01((shown - i - 0.6) * 3) > 0:
                K.draw_arrow(draw, box[2] + 8, 550, box[2] + 48, 550, muted, width=8, head=22)
        return True

    # ---- step 1 · a problem --------------------------------------------------------------------
    if visual == "a20-problem":
        if focus == "who":
            K.pill(draw, 0, 236, "STEP 1 · FIND A PROBLEM", coral, size=34, left=140)
            for i, (kind, lab) in enumerate((("friend", "Class 3"), ("kid", "Class 4"), ("teacher", "Class 5"))):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 420 + i * 300
                y = 470 + int((1 - a) * 30)
                draw.ellipse((x - 135, y - 135, x + 135, y + 135), fill=[coral_soft, LAV_SOFT, sage_soft][i])
                K.draw_person(draw, x, y - 30, 1.0, "kid" if kind == "teacher" else kind, t)
                K.pill(draw, x, y + 170, lab, [coral, K.BOTH_COLOR, sage][i], size=34)
            K.draw_heart(draw, 720, 300 + bounce, 30, K.DANGER)
            for i, (fn, lab, y) in enumerate(((rocket, "Rocket", 400), (factory, "Factory", 680))):
                a = K.stagger(progress, i + 2, step=0.15, speed=4)
                if a <= 0:
                    continue
                draw.ellipse((1560 - 110, y - 110, 1560 + 110, y + 110), fill=(240, 236, 230))
                fn(draw, 1560, y, 0.9)
                K.draw_cross(draw, 1650, y - 80, 30, K.DANGER)
            return True
        if focus == "ideas":
            K.text_at(draw, "What's hard or boring for kids?", cx, 226, F(46), ink)
            boxes = row_boxes(4, 380, 50, 310, 830)
            shown = progress * 5.0 - 0.3
            for i, ((kind, lab), box) in enumerate(zip(A20_IDEAS, boxes)):
                a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
                if a <= 0:
                    continue
                dy = int((1 - a) * 50)
                icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, label_size=40, icon_s=1.25)
                K.text_at(draw, "?", box[2] - 40, box[1] + dy + 14, F(54), K.GOLD)
            return True
        # name
        K.text_at(draw, "Give it a fun name!", cx, 236 + lift, F(64), ink)
        for i, (col, glyph, name) in enumerate(((coral, "bag", "Bag Buddy"), (K.BOTH_COLOR, "star", "Spell Star"))):
            a = K.stagger(progress, i, step=0.25, speed=4)
            if a <= 0:
                continue
            x = 640 + i * 640
            size = 280 * (0.7 + 0.3 * a)
            app_icon(draw, x, 540, size, col, glyph, t)
            K.text_at(draw, name, x, 720, F(60), col)
        sparkle([(300, 380), (960, 470), (1620, 380), (960, 760)])
        return True

    # ---- step 2 · the plan -------------------------------------------------------------------
    plan_rows = [("Name:", "Bag Buddy"), ("Who:", "Class 4 kids"), ("Input:", "taps subjects"),
                 ("Output:", "book checklist")]
    if visual == "a20-plan":
        if focus == "intro":
            plan_sheet(plan_rows, 1)
            for i, (q, col) in enumerate((("Who uses it?", coral), ("What goes in?", K.BOT),
                                          ("What comes out?", sage))):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 190 + int((1 - a) * 30)
                draw.rounded_rectangle((1020, y, 1760, y + 150), radius=40, fill=panel, outline=col, width=5)
                draw.ellipse((1050, y + 30, 1140, y + 120), fill=col)
                K.text_at(draw, "?", 1095, y + 34, F(64), (255, 255, 255))
                draw.text((1170, y + 46), q, fill=ink, font=F(52))
            return True
        if focus == "user":
            plan_sheet(plan_rows, 2, hi=1)
            draw.ellipse((1420 - 260, 520 - 260, 1420 + 260, 520 + 260), fill=coral_soft)
            K.draw_person(draw, 1340, 480, 1.25, "kid", t)
            phone(draw, 1560, 620, 0.55)
            K.pill(draw, 1420, 780, "USER = Kabir", coral, size=40)
            return True
        if focus in ("tiffinq", "tiffina"):
            ans = focus == "tiffina"
            K.text_at(draw, "Tiffin Timer: who is the user?", cx, 226, F(48), ink)
            box = phone(draw, 400, 560, 1.05)
            x0, y0, x1, y1 = box
            draw.rectangle(box, fill=GOLD_SOFT)
            app_icon(draw, 400, y0 + 110, 120, coral, "clock", t)
            K.text_at(draw, "Tiffin Timer", 400, y0 + 190, F(32), ink)
            draw.rounded_rectangle((x0 + 16, y0 + 250, x1 - 16, y0 + 330), radius=20, fill=coral)
            K.text_at(draw, "Lunch time!", 400, y0 + 270, F(30), (255, 255, 255))
            draw.ellipse((900 - 150, 540 - 150, 900 + 150, 540 + 150), fill=(240, 236, 230))
            K.draw_tiffin(draw, 900, 570, 1.05)
            K.text_at(draw, "Tiffin box", 900, 730, F(38), ink)
            draw.ellipse((1420 - 150, 520 - 150, 1420 + 150, 520 + 150), fill=sage_soft)
            K.draw_person(draw, 1420, 470, 1.05, "friend", t)
            K.text_at(draw, "School child", 1420, 730, F(38), ink)
            if ans:
                K.draw_cross(draw, 1010, 420, 36, K.DANGER)
                K.draw_check(draw, 1540, 400, 36, sage)
                K.pill(draw, 1420, 790, "USER", sage, size=36)
            else:
                qmarks([(900, 330), (1420, 300)], 70)
                K.draw_stopwatch(draw, 1720, 760, 44, progress, brand)
            return True
        # input / output
        is_in = focus == "input"
        plan_sheet(plan_rows, 3 if is_in else 4, hi=2 if is_in else 3)
        box = phone(draw, 1420, 545, 1.25)
        if is_in:
            screen_input(draw, box, t, taps=1 + int(progress * 4))
            a = K.ease_out_cubic(K.clamp01(progress * 3))
            K.draw_arrow(draw, 1000, 545, 1000 + 220 * a, 545, sage, width=14, head=40)
            K.pill(draw, 1110, 450, "INPUT", sage, size=34)
            K.draw_person(draw, 1060, 680, 0.6, "kid", t)
        else:
            screen_output(draw, box, t, reveal=progress * 1.4)
            a = K.ease_out_cubic(K.clamp01(progress * 3))
            K.draw_arrow(draw, 1580, 545, 1580 + 200 * a, 545, K.BOTH_COLOR, width=14, head=40)
            K.pill(draw, 1690, 450, "OUTPUT", K.BOTH_COLOR, size=30)
        return True

    # ---- input or output? -----------------------------------------------------------------------
    if visual == "a20-io":
        if focus in ("spellq", "spella"):
            ans = focus == "spella"
            K.draw_person(draw, 330, 480, 1.1, "kid", t)
            box = phone(draw, 860, 545, 1.25)
            x0, y0, x1, y1 = box
            draw.rectangle(box, fill=(255, 255, 255))
            draw.rectangle((x0, y0, x1, y0 + 56), fill=K.BOTH_COLOR)
            K.text_at(draw, "Spell Star", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
            word = "tree"
            typed = word if ans else word[: max(1, int(progress * 5))]
            draw.rounded_rectangle((x0 + 16, y0 + 80, x1 - 16, y0 + 150), radius=16, fill=(246, 243, 238),
                                   outline=K.BOTH_COLOR, width=3)
            K.text_at(draw, typed, (x0 + x1) / 2, y0 + 92, F(40), ink)
            if not ans:
                for r in range(3):
                    for c in range(5):
                        kx = x0 + 18 + c * 48
                        ky = y1 - 170 + r * 52
                        draw.rounded_rectangle((kx, ky, kx + 40, ky + 42), radius=8, fill=K.DEV_KEY)
            if ans:
                K.draw_star(draw, (x0 + x1) / 2, y0 + 260, 60 + 6 * pulse, K.GOLD, rot=t)
                K.draw_arrow(draw, 480, 545, 720, 545, sage, width=14, head=40)
                K.pill(draw, 600, 450, "INPUT", sage, size=34)
                K.draw_arrow(draw, 1020, 545, 1240, 545, K.BOTH_COLOR, width=14, head=40)
                K.pill(draw, 1130, 450, "OUTPUT", K.BOTH_COLOR, size=30)
                K.draw_star(draw, 1420, 545, 110 + 10 * pulse, K.GOLD, rot=t * 2)
                K.text_at(draw, "a star!", 1420, 690, F(44), ink)
            else:
                K.text_at(draw, "Types a word", 330, 720, F(36), ink)
                for i, (lab, col) in enumerate((("INPUT?", sage), ("OUTPUT?", K.BOTH_COLOR))):
                    pill_y = 380 + i * 140
                    K.pill(draw, 1450, pill_y, lab, col, size=48)
                K.draw_stopwatch(draw, 1450, 760, 46, progress, brand)
            return True
        ans = focus == "busa"
        K.draw_person(draw, 280, 480, 1.05, "friend", t)
        K.pill(draw, 280, 700, "Riya", K.GOLD, size=34)
        box = phone(draw, 760, 545, 1.25)
        x0, y0, x1, y1 = box
        draw.rectangle(box, fill=(255, 255, 255))
        draw.rectangle((x0, y0, x1, y0 + 56), fill=K.BOT)
        K.text_at(draw, "Bus Buddy", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
        draw.text((x0 + 20, y0 + 76), "My stop:", fill=muted, font=F(26))
        fy0 = y0 + 112
        draw.rounded_rectangle((x0 + 16, fy0, x1 - 16, fy0 + 64), radius=16, fill=(246, 243, 238), outline=K.BOT,
                               width=3)
        K.text_at(draw, "Park Road", (x0 + x1) / 2, fy0 + 14, F(32), ink)
        ry0 = y0 + 210
        draw.rounded_rectangle((x0 + 16, ry0, x1 - 16, ry0 + 160), radius=20,
                               fill=sage_soft if ans else BLUE_SOFT, outline=sage if ans else K.BOT, width=4)
        K.text_at(draw, "Bus arrives", (x0 + x1) / 2, ry0 + 18, F(28), muted)
        K.text_at(draw, "8:10", (x0 + x1) / 2, ry0 + 58, F(70), sage if ans else ink)
        bx = 1480 + 60 * math.sin(t * 3)
        K.draw_road(draw, 1150, 1820, 790, 70, t)
        bus(draw, bx, 700, 0.9, t)
        if ans:
            K.draw_arrow(draw, 1130, fy0 + 32, 920, fy0 + 32, sage, width=10, head=30)
            K.pill(draw, 1140, fy0 - 4, "INPUT", sage, size=30)
            K.draw_arrow(draw, 1130, ry0 + 90, 920, ry0 + 90, K.BOTH_COLOR, width=12, head=34)
            K.pill(draw, 1140, ry0 + 56, "OUTPUT", K.BOTH_COLOR, size=34)
        else:
            K.text_at(draw, "What's the output?", 1480, 290, F(46), ink)
            K.draw_stopwatch(draw, 1260, 470, 40, progress, brand)
        return True

    # ---- step 3 · two screens -----------------------------------------------------------------
    if visual == "a20-screens":
        if focus == "intro":
            K.pill(draw, 0, 236, "STEP 3 · DRAW 2 SCREENS", K.BOTH_COLOR, size=34, left=140)
            for i in range(2):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = 620 + i * 460
                box = phone(draw, x, 560 + int((1 - a) * 30), 1.2)
                K.text_at(draw, str(i + 1), x, (box[1] + box[3]) / 2 - 90, F(160), [coral, K.BOTH_COLOR][i])
            for i, lab in enumerate(("10", "50")):
                a = K.stagger(progress, i + 2, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 400 + i * 240
                draw.rounded_rectangle((1460, y - 80, 1700, y + 80), radius=30, fill=(240, 236, 230))
                K.text_at(draw, lab + " screens", 1580, y - 22, F(36), muted)
                K.draw_cross(draw, 1690, y - 70, 30, K.DANGER)
            return True
        if focus in ("s1", "s2"):
            s2 = focus == "s2"
            b1 = phone(draw, 620, 520, 1.25)
            screen_input(draw, b1, t if not s2 else 0.0, taps=4 if s2 else 1 + int(progress * 4))
            b2 = phone(draw, 1300, 520, 1.25)
            if s2:
                screen_output(draw, b2, t, reveal=progress * 1.4)
                a = K.ease_out_cubic(K.clamp01(progress * 3))
                K.draw_arrow(draw, 790, 520, 790 + 320 * a, 520, muted, width=12, head=36)
            else:
                screen_input(draw, b2, t, active=False)
            K.pill(draw, 620, 800, "Screen 1 · Input", sage if not s2 else K.STEEL_DARK, size=34)
            K.pill(draw, 1300, 800, "Screen 2 · Output", K.BOTH_COLOR if s2 else K.STEEL_DARK, size=34)
            return True
        # paper
        draw.rounded_rectangle((420 + 10, 250 + 12, 1260 + 10, 850 + 12), radius=12, fill=K.SHADOW)
        draw.rounded_rectangle((420, 250, 1260, 850), radius=12, fill=PAPER)
        for i in range(2):
            sb = sketch_phone(draw, 640 + i * 400, 550, 1.2, K.DEV_MID, phase=t * 60)
            if i == 0:
                for k in range(4):
                    ly = sb[1] + 50 + k * 72
                    draw.rounded_rectangle((sb[0] + 16, ly, sb[2] - 16, ly + 48), radius=22,
                                           outline=[K.BOT, K.BOTH_COLOR, sage, coral][k], width=5)
            else:
                for k in range(3):
                    ly = sb[1] + 60 + k * 70
                    K.draw_check(draw, sb[0] + 30, ly + 16, 16, sage)
                    draw.line((sb[0] + 60, ly + 16, sb[2] - 20, ly + 16), fill=K.DEV_MID, width=5)
                K.draw_star(draw, (sb[0] + sb[2]) / 2, sb[3] - 70, 40, K.GOLD, rot=t)
        pencil(draw, 1230, 740, 1.0)
        for k, col in enumerate((coral, K.BOT, sage, K.GOLD)):
            x = 1440 + k * 80
            draw.rounded_rectangle((x - 22, 560, x + 22, 800), radius=10, fill=col)
            draw.polygon([(x - 22, 560), (x + 22, 560), (x, 510)], fill=col)
        code_card(draw, 1560, 340, 0.8)
        return True

    # ---- one earlier idea -----------------------------------------------------------------------
    if visual == "a20-ideas":
        if focus == "intro":
            K.text_at(draw, "Pick one idea from earlier!", cx, 226, F(46), ink)
            boxes = row_boxes(3, 480, 70, 310, 840)
            for i, ((kind, lab), box) in enumerate(zip((("variable", "Variable"), ("loop", "Loop"),
                                                        ("safety", "Safety rule")), boxes)):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                dy = int((1 - a) * 50)
                icon_card((box[0], box[1] + dy, box[2], box[3] + dy), kind, lab, label_size=48, icon_s=1.45)
            return True
        if focus == "variable":
            K.pill(draw, 0, 236, "VARIABLE", K.GOLD, size=34, left=140, fg=ink)
            stars = min(5, int(progress * 6.5))
            var_box(draw, 520, 520, 1.6, "stars", str(stars), K.GOLD)
            for k in range(stars):
                K.draw_star(draw, 400 + k * 90, 316 + 4 * math.sin(t * 8 + k), 24, K.GOLD, rot=t + k)
            glasses = min(5, int(progress * 6.5))
            draw.rounded_rectangle((1000, 290, 1780, 820), radius=40, fill=panel, outline=line, width=3)
            K.text_at(draw, "Water counter", 1390, 320, F(40), K.BOT)
            for k in range(5):
                gx = 1100 + k * 145
                K.draw_glass(draw, gx, 600, 0.85, 1.0 if k < glasses else 0.0)
            K.text_at(draw, "Glasses:", 1300, 680, F(52), ink)
            K.text_at(draw, str(glasses), 1520, 664, F(80), coral)
            return True
        if focus == "loop":
            K.pill(draw, 0, 236, "LOOP", K.BOT, size=34, left=140)
            draw.rounded_rectangle((560 + 8, 240 + 10, 1360 + 8, 360 + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((560, 240, 1360, 360), radius=30, fill=panel, outline=coral, width=4)
            app_icon(draw, 630, 300, 80, coral, "bag", t)
            draw.text((700, 260), "Bag Buddy · 7 pm", fill=muted, font=F(28))
            draw.text((700, 300), "Pack your bag!", fill=ink, font=F(38))
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            lit = int(progress * 8.5)
            for i, d in enumerate(days):
                x = 210 + i * 220
                on = i < lit
                calendar_tile(draw, x, 440, 180, 200, d, K.BOT, on)
                bell(draw, x + 90, 560, 0.75, K.GOLD if on else K.STEEL, t if on else 0)
            K.draw_curve(draw, (1640, 670), (960, 900), (300, 670), K.BOT, width=10)
            draw.polygon([(300, 670), (330, 700), (290, 712)], fill=K.BOT)
            K.text_at(draw, "again and again", cx, 690, F(36), K.BOT)
            return True
        # safety
        K.pill(draw, 0, 236, "SAFETY RULE", sage, size=34, left=140)
        box = phone(draw, 640, 555, 1.3)
        x0, y0, x1, y1 = box
        draw.rectangle(box, fill=(255, 255, 255))
        draw.rectangle((x0, y0, x1, y0 + 56), fill=coral)
        K.text_at(draw, "Sign up", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
        fields = [("Nickname", True), ("Class", True), ("Home address", False)]
        for i, (lab, ok) in enumerate(fields):
            fy = y0 + 84 + i * 110
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((x0 + 14, fy, x1 - 14, fy + 86), radius=18, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=3)
            draw.text((x0 + 30, fy + 26), lab, fill=ink if ok else muted, font=F(28))
            if not ok and progress > 0.35:
                bb = draw.textbbox((x0 + 30, fy + 26), lab, font=F(28))
                draw.line((x0 + 24, fy + 44, bb[2] + 6, fy + 44), fill=K.DANGER, width=5)
        K.draw_shield(draw, 1330, 500, 1.4, sage)
        K.pill(draw, 1330, 720, "Never ask for a home address", K.DANGER, size=34)
        K.pill(draw, 1330, 800, "Private data stays private", sage, size=34)
        return True

    # ---- which idea is clearest? --------------------------------------------------------------
    if visual == "a20-clear":
        ans = focus == "answer"
        for i, (letter, txt) in enumerate(A20_CLEAR):
            y = 240 + i * 158
            good = letter == "D"
            win = ans and good
            dim = ans and not good
            x0, x1 = 140, 1340
            draw.rounded_rectangle((x0 + 8, y + 10, x1 + 8, y + 138 + 10), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y, x1, y + 138), radius=30,
                                   fill=sage_soft if win else (246, 243, 238) if dim else panel,
                                   outline=sage if win else line, width=5 if win else 3)
            draw.ellipse((x0 + 26, y + 34, x0 + 96, y + 104), fill=sage if win else K.BOTH_COLOR if not dim else muted)
            K.text_at(draw, letter, x0 + 61, y + 42, F(42), (255, 255, 255))
            font = F(34)
            lines = K.wrap_text(txt, font, x1 - x0 - 124 - 100)
            ty = y + 69 - len(lines) * 21
            for j, ln in enumerate(lines):
                draw.text((x0 + 124, ty + j * 42), ln, fill=muted if dim else ink, font=font)
            if dim:
                K.draw_cross(draw, x1 - 46, y + 69, 26, K.DANGER)
            if win:
                K.draw_check(draw, x1 - 46, y + 69, 28, sage)
        if ans:
            for i, lab in enumerate(("User", "Input", "Output")):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 300 + i * 150 + int((1 - a) * 20)
                draw.rounded_rectangle((1420, y, 1790, y + 120), radius=36, fill=panel, outline=sage, width=5)
                K.draw_check(draw, 1480, y + 60, 30, sage)
                draw.text((1530, y + 34), lab, fill=ink, font=F(46))
        else:
            K.text_at(draw, "Which is", 1590, 300, F(50), ink)
            K.text_at(draw, "clearest?", 1590, 362, F(56), coral)
            K.draw_magnifier(draw, 1570, 600, 0.9, K.BOTH_COLOR)
            K.draw_stopwatch(draw, 1720, 790, 40, progress, brand)
        return True

    # ---- step 4 · the pitch ---------------------------------------------------------------------
    def stage(spot=True):
        draw.rectangle((140, 760, 1780, 800), fill=WOOD_DARK)
        draw.rectangle((140, 740, 1780, 762), fill=WOOD)
        for side in (-1, 1):
            xe = 140 if side < 0 else 1780
            xi = xe - side * 230
            draw.polygon([(xe, 230), (xi, 230), (xi + side * 40, 420), (xe - side * 0, 740)],
                         fill=(206, 70, 60))
            for k in range(3):
                fx = xe - side * (50 + k * 60)
                draw.line((fx, 240, fx + side * 10, 720), fill=(176, 50, 44), width=6)
        draw.rectangle((140, 222, 1780, 250), fill=(176, 50, 44))
        if spot:
            draw.polygon([(cx - 60, 250), (cx + 60, 250), (cx + 300, 760), (cx - 300, 760)], fill=SPOT)

    if visual == "a20-pitch":
        if focus == "intro":
            stage()
            K.draw_person(draw, cx, 470, 1.2, "kid", t)
            draw.rounded_rectangle((cx + 90, 560, cx + 250, 740), radius=12, fill=PAPER, outline=K.DEV_MID, width=3)
            sketch_phone(draw, cx + 170, 650, 0.32, K.DEV_MID)
            K.draw_stopwatch(draw, 1420, 480, 70, progress * 0.5, brand)
            K.pill(draw, 1420, 590, "1 minute", coral, size=38)
            K.pill(draw, 520, 480, "PITCH", K.BOTH_COLOR, size=44)
            K.text_at(draw, "a short talk", 520, 560, F(36), ink)
            return True
        if focus == "parts":
            draw.ellipse((440 - 240, 540 - 240, 440 + 240, 540 + 240), fill=SPOT)
            K.draw_person(draw, 440, 470, 1.2, "kid", t)
            K.draw_device(draw, "mic", 600, 640, 0.6, brand)
            for i, lab in enumerate(A20_PITCH):
                a = K.stagger(progress, i, step=0.13, speed=5)
                if a <= 0:
                    continue
                y = 240 + i * 124 + int((1 - a) * 20)
                col = [coral, K.BOT, sage, K.BOTH_COLOR, K.GOLD][i]
                draw.rounded_rectangle((880 + 8, y + 10, 1740 + 8, y + 100 + 10), radius=30, fill=K.SHADOW)
                draw.rounded_rectangle((880, y, 1740, y + 100), radius=30, fill=panel, outline=col, width=4)
                draw.ellipse((904, y + 18, 968, y + 82), fill=col)
                K.text_at(draw, str(i + 1), 936, y + 22, F(38), (255, 255, 255))
                draw.text((996, y + 26), lab, fill=ink, font=F(44))
            return True
        # bow
        stage()
        K.draw_person(draw, cx, 500 + int(14 * abs(math.sin(t * 6))), 1.2, "kid", t)
        K.text_at(draw, "Take a bow!", cx, 270, F(62), coral)
        K.text_at(draw, "It helps kids!", cx, 680, F(40), ink)
        for k in range(6):
            hx = 520 + k * 176 + (60 if k >= 3 else 0)
            if 760 < hx < 1160:
                continue
            K.draw_heart(draw, hx, 420 + 20 * math.sin(t * 8 + k), 24, [K.DANGER, coral, K.BOTH_COLOR][k % 3])
        for k in range(9):
            ax = 300 + k * 165
            draw.ellipse((ax - 44, 800, ax + 44, 888), fill=(70, 60, 80))
            draw.chord((ax - 70, 850, ax + 70, 990), 180, 360, fill=(70, 60, 80))
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "a20-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 770 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "CAPSTONE CHALLENGE", cx, 350 + lift, F(40), sage)
            K.text_at(draw, "Design your app!", cx, 420 + lift, F(66), ink)
            bulb(draw, cx - 120, 630 + lift, 0.55, t)
            phone(draw, cx + 120, 640 + lift, 0.5)
            return True
        ans = focus == "answer"
        rows = [("App name:", "Spell Star"), ("Who uses it:", "Class 3 kids"), ("One input:", "types a word"),
                ("One output:", "a star if right")]
        n = 0
        if ans:
            n = min(4, int(progress * 5.2))
        plan_sheet(rows, n, title="My Capstone Plan", box=(130, 250, 1000, 860))
        if ans:
            box = phone(draw, 1420, 545, 1.25)
            x0, y0, x1, y1 = box
            draw.rectangle(box, fill=(255, 255, 255))
            draw.rectangle((x0, y0, x1, y0 + 56), fill=K.BOTH_COLOR)
            K.text_at(draw, "Spell Star", (x0 + x1) / 2, y0 + 12, F(28), (255, 255, 255))
            draw.rounded_rectangle((x0 + 16, y0 + 80, x1 - 16, y0 + 150), radius=16, fill=(246, 243, 238),
                                   outline=K.BOTH_COLOR, width=3)
            K.text_at(draw, "tree", (x0 + x1) / 2, y0 + 92, F(40), ink)
            if progress > 0.6:
                K.draw_star(draw, (x0 + x1) / 2, y0 + 270, 80 + 8 * pulse, K.GOLD, rot=t)
                K.text_at(draw, "Correct!", (x0 + x1) / 2, y0 + 370, F(34), sage)
            sparkle([(1700, 300), (1130, 300)])
        else:
            pencil(draw, 1400, 420, 1.2)
            K.pill(draw, 1400, 600, "Pause & try!", coral, size=40)
            K.text_at(draw, "Draw or list it", 1400, 700, F(38), ink)
            K.draw_stopwatch(draw, 1700, 790, 44, progress, brand)
        return True

    # ---- recap & celebration ---------------------------------------------------------------
    if visual == "a20-recap":
        recap = [("Helps a Class 3–5 child", coral, "kids"), ("Name · user · input · output", K.BOT, "plan"),
                 ("2 screens, no coding", K.BOTH_COLOR, "screens"), ("1-minute pitch", sage, "pitch")]
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
                step_icon(kind, x0 + 200, y0 + 210, 1.05)
                font = F(36)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 400 + j * 44, font, ink)
            return True
        if focus == "journey":
            K.text_at(draw, "Your Computer Science journey", cx, 226, F(50), ink)
            xs = [330, 750, 1170, 1590]
            K.draw_dashed(draw, xs[0], 470, xs[-1], 470, line, width=10, phase=t * 100)
            for i, ((kind, l1, l2), x) in enumerate(zip(A20_UNITS, xs)):
                a = K.stagger(progress, i, step=0.17, speed=4)
                if a <= 0:
                    continue
                col = [coral, K.BOT, K.BOTH_COLOR, sage][i]
                r = 120 * (0.8 + 0.2 * a)
                draw.ellipse((x - r + 8, 470 - r + 10, x + r + 8, 470 + r + 10), fill=K.SHADOW)
                draw.ellipse((x - r, 470 - r, x + r, 470 + r), fill=panel, outline=col, width=8)
                if kind == "computer":
                    K.draw_device(draw, "screen", x, 490, 0.5, brand, t)
                elif kind == "robot":
                    K.draw_robot(draw, x, 520, 0.3, t, mood="happy")
                elif kind == "blocks":
                    for k, bc in enumerate((K.GOLD, K.BOT, coral)):
                        draw.rounded_rectangle((x - 60 + k * 8, 410 + k * 44, x + 50 + k * 8, 450 + k * 44), radius=10,
                                               fill=bc)
                        draw.rounded_rectangle((x - 36 + k * 8, 402 + k * 44, x - 10 + k * 8, 414 + k * 44), radius=4,
                                               fill=bc)
                else:
                    phone(draw, x, 470, 0.38)
                    K.draw_map_pin(draw, x + 40, 450, 0.45, coral)
                K.text_at(draw, l1, x, 620, F(34), ink)
                K.text_at(draw, l2, x, 662, F(34), ink)
                K.draw_check(draw, x + 90, 470 - 92, 30, sage)
            if progress > 0.75:
                K.pill(draw, cx, 760, "All 4 units done!", coral, size=40)
            return True
        if focus == "done":
            confetti(y0=230, y1=600)
            K.draw_mascot(draw, int(cx - 480), 470, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 480, 520, 0.7, t, mood="happy", wave=t)
            trophy(draw, cx, 500, 2.0, "CS")
            K.text_at(draw, "Computer Science complete!", cx, 680, F(64), ink)
            K.pill(draw, cx, 778, "You're a real computer scientist!", coral, size=36)
            return True
        K.text_at(draw, "Final quiz time!", cx, 380, F(64), coral)
        K.text_at(draw, "Tap Finish, then design your dream app!", cx, 500, F(44), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
