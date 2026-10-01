"""C15 · Draw With Math — visuals."""
import math

import build as K

SHELL = (70, 156, 92)
SHELL_DARK = (44, 112, 64)
SHELL_LIGHT = (128, 196, 128)
TSKIN = (156, 212, 120)
TSKIN_DARK = (112, 170, 84)
PAPER = (255, 253, 246)
GRID_LINE = (226, 218, 204)
PENCIL = (255, 196, 46)
PENCIL_DARK = (214, 150, 20)
WOOD = (238, 200, 150)
FD_COL = (64, 118, 214)
RT_COL = (123, 97, 214)
BK_COL = (13, 148, 136)
REP_COL = (240, 146, 28)
LAV_SOFT = (239, 234, 251)
BLUE_SOFT = (230, 238, 251)

SQUARE4 = [("fd", 4), ("rt", 90)] * 4
RECT63 = [("fd", 6), ("rt", 90), ("fd", 3), ("rt", 90)] * 2
PLUS2 = [("fd", 2), ("bk", 2), ("rt", 90)] * 4


def S_(s):
    return lambda v: v * s


def mix(c, d, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c, d))


def circ(draw, x, y, r, fill, outline=None, width=0):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=fill, outline=outline, width=width)


def label(cmd, v):
    return {"fd": f"forward {v}", "bk": f"back {v}", "rt": f"turn right {v}"}[cmd]


# ---------------------------------------------------------------------------
# Characters
# ---------------------------------------------------------------------------

def turtle_top(draw, x, y, hdg, s, t=0.0):
    """Robot turtle seen from above, centred on (x, y). hdg 0 = up, 90 = right. Radius ≈ 62s."""
    S = S_(s)
    a = math.radians(hdg)
    fx, fy = math.sin(a), -math.cos(a)
    rx, ry = math.cos(a), math.sin(a)

    def P(f, r):
        return x + fx * S(f) + rx * S(r), y + fy * S(f) + ry * S(r)

    circ(draw, x + S(5), y + S(7), S(46), K.SHADOW)
    wig = 4 * math.sin(t * 40)
    for f, r, k in ((30, 38, 1), (30, -38, -1), (-30, 38, -1), (-30, -38, 1)):
        px, py = P(f + wig * k, r)
        circ(draw, px, py, S(15), TSKIN, TSKIN_DARK, max(2, int(S(3))))
    draw.polygon([P(-42, 9), P(-42, -9), P(-62, 0)], fill=TSKIN)
    hx, hy = P(58, 0)
    circ(draw, hx, hy, S(22), TSKIN, TSKIN_DARK, max(2, int(S(3))))
    for r in (9, -9):
        ex, ey = P(66, r)
        circ(draw, ex, ey, S(5.5), (30, 36, 48))
    circ(draw, x, y, S(45), SHELL_DARK)
    circ(draw, x, y, S(38), SHELL)
    for k in range(6):
        ang = a + k * math.pi / 3
        circ(draw, x + math.cos(ang) * S(25), y + math.sin(ang) * S(25), S(8), SHELL_LIGHT)
    circ(draw, x, y, S(13), SHELL_LIGHT)
    circ(draw, x, y, S(6), K.GOLD)


def turtle_side(draw, cx, by, s, t=0.0, mood="happy", walk=0.0):
    """Robot turtle in profile, facing right, feet on y=by. Spans ≈ cx-130s..cx+165s, by-205s..by."""
    S = S_(s)
    ink = (30, 36, 48)
    draw.ellipse((cx - S(130), by - S(12), cx + S(150), by + S(12)), fill=K.SHADOW)
    draw.polygon([(cx - S(6), by - S(52)), (cx + S(6), by - S(52)), (cx + S(6), by - S(14)),
                  (cx, by), (cx - S(6), by - S(14))], fill=PENCIL)
    draw.polygon([(cx - S(6), by - S(14)), (cx + S(6), by - S(14)), (cx, by)], fill=WOOD)
    circ(draw, cx, by - S(2), S(3), K.CORAL)
    for k, lx in enumerate((-78, -40, 40, 78)):
        lift = S(10) * max(0.0, math.sin(walk * math.pi * 6 + k * math.pi / 2))
        draw.rounded_rectangle((cx + S(lx) - S(16), by - S(48) - lift, cx + S(lx) + S(16), by - lift),
                               radius=S(12), fill=TSKIN, outline=TSKIN_DARK, width=max(2, int(S(3))))
    draw.polygon([(cx - S(108), by - S(70)), (cx - S(108), by - S(50)), (cx - S(138), by - S(52))], fill=TSKIN)
    hx, hy = cx + S(128), by - S(96) + S(4) * math.sin(t * math.pi * 4)
    draw.rounded_rectangle((cx + S(80), hy - S(4), cx + S(122), hy + S(34)), radius=S(14), fill=TSKIN)
    draw.line((hx - S(4), hy - S(30), hx - S(14), hy - S(74)), fill=K.DEV_MID, width=max(3, int(S(6))))
    circ(draw, hx - S(14), hy - S(78), S(10), K.GOLD)
    circ(draw, hx, hy, S(38), TSKIN, TSKIN_DARK, max(2, int(S(4))))
    ex, ey = hx + S(12), hy - S(8)
    circ(draw, ex, ey, S(13), (255, 255, 255), ink, max(2, int(S(3))))
    if mood == "blank":
        draw.line((ex - S(7), ey, ex + S(7), ey), fill=ink, width=max(2, int(S(4))))
        draw.line((hx + S(4), hy + S(18), hx + S(26), hy + S(18)), fill=ink, width=max(2, int(S(4))))
    elif mood == "confused":
        circ(draw, ex + S(3), ey + S(2), S(5), ink)
        draw.line((ex - S(12), ey - S(24), ex + S(12), ey - S(18)), fill=ink, width=max(2, int(S(4))))
        draw.arc((hx + S(2), hy + S(14), hx + S(28), hy + S(30)), 200, 340, fill=ink, width=max(2, int(S(4))))
    else:
        circ(draw, ex + S(3), ey + S(1), S(6), ink)
        draw.arc((hx - S(6), hy + S(2), hx + S(30), hy + S(26)), 20, 150, fill=(190, 70, 60), width=max(2, int(S(4))))
    draw.chord((cx - S(116), by - S(196), cx + S(116), by + S(96)), 180, 360, fill=SHELL_DARK)
    draw.chord((cx - S(104), by - S(184), cx + S(104), by + S(84)), 180, 360, fill=SHELL)
    for dx, dy, r in ((-58, -88, 18), (0, -138, 20), (58, -88, 18), (0, -88, 15)):
        circ(draw, cx + S(dx), by + S(dy), S(r), SHELL_LIGHT)
    draw.rounded_rectangle((cx - S(122), by - S(66), cx + S(122), by - S(42)), radius=S(10), fill=SHELL_DARK)
    for k in range(5):
        circ(draw, cx - S(88) + k * S(44), by - S(54), S(5), K.GOLD)


def kid(draw, cx, cy, s, body, t=0.0, mood="happy"):
    """Meera, bust. cy = face centre; hair top ≈ cy-72s, body bottom ≈ cy+141s."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=body)
    r = S(64)
    for sx in (-1, 1):
        px = cx + sx * r * 0.92
        draw.rounded_rectangle((px - r * 0.2, cy - r * 0.3, px + r * 0.2, cy + r * 1.35), radius=r * 0.2, fill=K.HAIR)
        circ(draw, px, cy + r * 1.38, r * 0.16, K.CORAL)
    K.draw_face(draw, cx, cy, r, "kid", 0.6)
    if mood == "worried":
        draw.ellipse((cx - r * 0.5, cy + r * 0.1, cx + r * 0.5, cy + r * 0.7), fill=K.SKIN)
        draw.arc((cx - r * 0.3, cy + r * 0.34, cx + r * 0.3, cy + r * 0.74), 200, 340, fill=(190, 70, 60),
                 width=max(2, int(r * 0.1)))


# ---------------------------------------------------------------------------
# Grid, program runner, code blocks
# ---------------------------------------------------------------------------

def paper_grid(draw, x0, y0, cols, rows, cell, line):
    pad = 26
    x1, y1 = x0 + cols * cell, y0 + rows * cell
    draw.rounded_rectangle((x0 - pad + 10, y0 - pad + 12, x1 + pad + 10, y1 + pad + 12), radius=26, fill=K.SHADOW)
    draw.rounded_rectangle((x0 - pad, y0 - pad, x1 + pad, y1 + pad), radius=26, fill=PAPER, outline=line, width=3)
    for i in range(cols + 1):
        draw.line((x0 + i * cell, y0, x0 + i * cell, y1), fill=GRID_LINE, width=2)
    for j in range(rows + 1):
        draw.line((x0, y0 + j * cell, x1, y0 + j * cell), fill=GRID_LINE, width=2)


def sim(cmds, start, hdg):
    ev = []
    x, y = start
    h = hdg
    for c, v in cmds:
        if c in ("fd", "bk"):
            d = v if c == "fd" else -v
            a = math.radians(h)
            nx, ny = x + round(math.sin(a)) * d, y - round(math.cos(a)) * d
            ev.append(("mv", (x, y), (nx, ny), h, float(v)))
            x, y = nx, ny
        else:
            ev.append(("rt", (x, y), h, h + v, 1.5))
            h += v
    return ev


def run(draw, ox, oy, cell, ev, frac, col, ts=0.7, width=10, t=0.0, turtle=True):
    """Draw the pen path up to frac (0..1) and the turtle. Returns index of the running command."""
    total = sum(e[-1] for e in ev)
    target = frac * total
    acc = 0.0
    idx = len(ev)
    pose = None
    r = width / 2

    def P(n):
        return ox + n[0] * cell, oy + n[1] * cell

    for i, e in enumerate(ev):
        d = e[-1]
        f = K.clamp01((target - acc) / d)
        if e[0] == "mv":
            p0, p1 = P(e[1]), P(e[2])
            pe = (K.lerp(p0[0], p1[0], f), K.lerp(p0[1], p1[1], f))
            if f > 0:
                draw.line((p0, pe), fill=col, width=width)
                circ(draw, p0[0], p0[1], r, col)
                circ(draw, pe[0], pe[1], r, col)
            pose = (pe, e[3])
        else:
            pose = (P(e[1]), K.lerp(e[2], e[3], K.ease_in_out(f)))
        if f < 1:
            idx = i
            break
        acc += d
    if turtle and pose:
        turtle_top(draw, pose[0][0], pose[0][1], pose[1], ts, t)
    return idx


def ghost(draw, ox, oy, cell, ev, col, width=6, phase=0.0):
    for e in ev:
        if e[0] == "mv":
            K.draw_dashed(draw, ox + e[1][0] * cell, oy + e[1][1] * cell, ox + e[2][0] * cell, oy + e[2][1] * cell,
                          col, width=width, dash=20, gap=14, phase=phase)


def block(draw, x, y, w, text, kind, h=64, size=34, state="normal", tag=None):
    col = {"fd": FD_COL, "rt": RT_COL, "bk": BK_COL, "rep": REP_COL}[kind]
    if state == "dim":
        col = mix(col, (255, 255, 255), 0.55)
    if state == "active":
        draw.rounded_rectangle((x - 8, y - 8, x + w + 8, y + h + 8), radius=20, fill=K.GOLD)
    draw.rounded_rectangle((x + 6, y + 8, x + w + 6, y + h + 8), radius=14, fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + w, y + h), radius=14, fill=col)
    draw.rounded_rectangle((x + 26, y + h - 6, x + 70, y + h + 8), radius=6, fill=col)
    font = K.load_font(size, bold=True)
    bb = draw.textbbox((0, 0), text, font=font)
    draw.text((x + 26, y + (h - (bb[3] - bb[1])) / 2 - bb[1]), text, font=font, fill=(255, 255, 255))
    if state == "done":
        K.draw_check(draw, x + w - 34, y + h / 2, 20, K.LEAF)
    if tag:
        K.pill(draw, 0, y + (h - 46) / 2, tag, K.DANGER if tag == "?" else K.LEAF, size=26, left=x + w + 20)


def code_list(draw, x, y, w, cmds, active=-1, h=58, gap=10, size=32, upto=None, states=None):
    for i, (c, v) in enumerate(cmds):
        if upto is not None and i >= upto:
            break
        st = states[i] if states else ("active" if i == active else "done" if i < active else "normal")
        block(draw, x, y + i * (h + gap), w, label(c, v), c, h=h, size=size, state=st)


def repeat_block(draw, x, y, w, n, inner, active=-1, h=64, gap=12, size=34, arm=44, state="normal"):
    """Orange C-block. inner: list of (cmd, v). Returns bottom y."""
    col = REP_COL if state != "dim" else mix(REP_COL, (255, 255, 255), 0.55)
    iy = y + h + gap
    by = iy + len(inner) * (h + gap)
    draw.rounded_rectangle((x + 6, y + 8, x + arm + 6, by + 44), radius=14, fill=K.SHADOW)
    draw.rounded_rectangle((x, y, x + arm + 20, by + 36), radius=14, fill=col)
    block(draw, x, y, w, f"repeat {n}", "rep", h=h, size=size, state=state if state == "active" else "normal")
    if state == "dim":
        draw.rounded_rectangle((x, y, x + w, y + h), radius=14, fill=col)
        font = K.load_font(size, bold=True)
        draw.text((x + 26, y + 14), f"repeat {n}", font=font, fill=(255, 255, 255))
    draw.rounded_rectangle((x, by, x + w * 0.55, by + 36), radius=14, fill=col)
    for i, (c, v) in enumerate(inner):
        st = "active" if i == active else ("dim" if state == "dim" else "normal")
        block(draw, x + arm, iy + i * (h + gap), w - arm, label(c, v), c, h=h, size=size, state=st)
    return by + 36


def stars_at(draw, x, y, r, progress, n=4):
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    for i in range(n):
        a = i * 2 * math.pi / n + 0.4
        sx = x + math.cos(a) * r
        sy = y + math.sin(a) * r * 0.7 + 10 * math.sin(progress * 9 + i)
        K.draw_star(draw, sx, sy, 20 + 6 * pulse, [K.CORAL, (13, 148, 136), K.BOTH_COLOR, K.GOLD][i % 4],
                    rot=progress * 3 + i)


def stars_pts(draw, pts, progress):
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    for i, (x, y) in enumerate(pts):
        K.draw_star(draw, x, y + 8 * math.sin(progress * 9 + i), 20 + 6 * pulse,
                    [K.CORAL, (13, 148, 136), K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)


def notebook(draw, box, title, ink, coral):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=(255, 250, 238))
    draw.line((x0 + 70, y0 + 10, x0 + 70, y1 - 10), fill=(240, 170, 170), width=3)
    K.text_at(draw, title, (x0 + x1) / 2, y0 + 28, K.load_font(40, bold=True), coral)


def spin_arrow(draw, x, y, r, a0, a1, col, width=10):
    """Clockwise arc from a0 to a1 (PIL degrees, 0 = right, -90 = up) with an arrow head."""
    if a1 - a0 < 4:
        return
    draw.arc((x - r, y - r, x + r, y + r), a0, a1, fill=col, width=width)
    e = math.radians(a1)
    hx, hy = x + math.cos(e) * r, y + math.sin(e) * r
    tx, ty = -math.sin(e), math.cos(e)
    nx, ny = math.cos(e), math.sin(e)
    hl = width * 2.6
    draw.polygon([(hx + tx * hl, hy + ty * hl), (hx + nx * hl * 0.7, hy + ny * hl * 0.7),
                  (hx - nx * hl * 0.7, hy - ny * hl * 0.7)], fill=col)


def mini_square(draw, x, y, side, col, width=8):
    draw.rectangle((x, y, x + side, y + side), outline=col, width=width)


# ---------------------------------------------------------------------------
# Render
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
    cx = w / 2
    t = progress
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    lift = int((1 - appear) * 40)
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    F = K.load_font

    # ---- opening ------------------------------------------------------------
    if visual == "c15-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            turtle_side(draw, cx + 280, 600, 1.0, t, "happy")
            K.text_at(draw, "Welcome back, champ!", cx, 720, F(60, bold=True), ink)
            stars_at(draw, cx - 640, 420, 110, progress)
            stars_at(draw, cx + 660, 400, 110, progress)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · ANGLES AND TURNS", cx, 318 + lift, F(34, bold=True), sage)
            ox, oy, r = 640, 600 + lift, 190
            circ(draw, ox, oy, r, BLUE_SOFT, line, 4)
            sweep = 90 * K.ease_out_cubic(K.clamp01(progress * 2.5))
            draw.pieslice((ox - r, oy - r, ox + r, oy + r), -90, -90 + sweep, fill=coral_soft, outline=coral, width=5)
            draw.line((ox, oy, ox, oy - r), fill=ink, width=8)
            ea = math.radians(-90 + sweep)
            K.draw_arrow(draw, ox, oy, ox + math.cos(ea) * (r - 6), oy + math.sin(ea) * (r - 6), coral, width=10, head=30)
            circ(draw, ox, oy, 14, ink)
            K.text_at(draw, "90°", ox + 70, oy - 130, F(46, bold=True), coral)
            K.text_at(draw, "Quarter turn", 1250, 420 + lift, F(56, bold=True), ink)
            K.text_at(draw, "= 90°", 1250, 492 + lift, F(56, bold=True), coral)
            for i in range(4):
                a = K.stagger(progress, i + 2, step=0.1, speed=5)
                if a <= 0:
                    continue
                qx, qy = 1010 + i * 160, 680 + lift
                circ(draw, qx, qy, 54, panel, line, 3)
                for k in range(i + 1):
                    draw.pieslice((qx - 46, qy - 46, qx + 46, qy + 46), -90 + k * 90, k * 90, fill=coral if k == i else
                                  mix(coral, (255, 255, 255), 0.5))
            if progress > 0.6:
                K.text_at(draw, "4 quarter turns = all the way round", 1250, 760 + lift, F(32, bold=True), muted)
            return True
        if focus == "unit":
            circ(draw, 520, 560, 240, LAV_SOFT)
            cell = 64
            paper_grid(draw, 520 - 2.5 * cell, 560 - 2.5 * cell, 5, 5, cell, line)
            draw.rectangle((520 - 2 * cell, 560 - 2 * cell, 520 + 2 * cell, 560 + 2 * cell), outline=coral, width=9)
            turtle_top(draw, 520 - 2 * cell, 560 + 2 * cell, 0, 0.6, t)
            K.pill(draw, 0, 290 + lift, "UNIT 3", coral, size=34, left=880)
            K.text_at(draw, "Shapes, Grids", 1290, 370 + lift, F(80, bold=True), ink)
            K.text_at(draw, "& Coordinates", 1290, 466 + lift, F(80, bold=True), ink)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = 1050 + i * 120
                last = i == 4
                draw.rounded_rectangle((x - 46, 640, x + 46, 732), radius=22, fill=coral_soft if last else sage_soft,
                                       outline=coral if last else sage, width=5 if last else 3)
                if last:
                    K.text_at(draw, "5", x, 652, F(50, bold=True), coral)
                else:
                    K.draw_check(draw, x, 686, 24, sage)
            K.text_at(draw, "Chapter 5 · the last one!", 1290, 770, F(34, bold=True), muted)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5", cx, 302 + lift, F(32, bold=True), coral)
            K.text_at(draw, "Draw With Math", cx, 365 + lift, F(90, bold=True), ink)
            a = K.stagger(progress, 2, step=0.1, speed=4)
            if a > 0:
                y = 620 + int((1 - a) * 30)
                block(draw, 360, y, 330, "forward 4", "fd", h=72, size=38)
                K.draw_arrow(draw, 720, y + 36, 790, y + 36, muted, width=8, head=22)
                block(draw, 820, y, 400, "turn right 90", "rt", h=72, size=38)
            b = K.stagger(progress, 4, step=0.1, speed=4)
            if b > 0:
                y = 620 + int((1 - a) * 30)
                K.draw_arrow(draw, 1250, y + 36, 1320, y + 36, muted, width=8, head=22)
                side = 160 * b
                mini_square(draw, 1400, 575 + (160 - side) / 2, side, coral, 10)
                turtle_top(draw, 1400, 735, 0, 0.5, t)
            return True
        # promise
        K.text_at(draw, "No pencil in your hand…", cx, 236 + lift, F(56, bold=True), ink)
        px, py = 330, 560
        draw.polygon([(px - 120, py + 40), (px + 90, py - 170), (px + 130, py - 130), (px - 80, py + 80)], fill=PENCIL)
        draw.polygon([(px - 120, py + 40), (px - 80, py + 80), (px - 150, py + 110)], fill=WOOD)
        draw.polygon([(px - 132, py + 82), (px - 120, py + 94), (px - 150, py + 110)], fill=ink)
        draw.polygon([(px + 90, py - 170), (px + 130, py - 130), (px + 150, py - 150), (px + 110, py - 190)],
                     fill=(240, 140, 150))
        K.draw_cross(draw, px + 110, py + 70, 40, K.DANGER)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        if a > 0:
            y0 = 380 + int((1 - a) * 30)
            K.text_at(draw, "just commands!", 880, y0 - 60, F(40, bold=True), sage)
            code_list(draw, 680, y0, 400, SQUARE4[:4], states=["normal"] * 4, h=64, gap=14, size=34)
        b = K.stagger(progress, 3, step=0.12, speed=4)
        if b > 0:
            K.draw_arrow(draw, 1120, 560, 1200 + 20 * pulse, 560, coral, width=12, head=34)
            cell = 72
            gx, gy = 1290, 380
            paper_grid(draw, gx, gy, 6, 6, cell, line)
            ev = sim(SQUARE4, (1, 5), 0)
            run(draw, gx, gy, cell, ev, K.clamp01((progress - 0.3) * 1.5), coral, ts=0.6, t=t)
        return True

    # ---- Kachhu story ---------------------------------------------------------
    if visual == "c15-hook":
        if focus == "meet":
            circ(draw, 640, 560, 290, BLUE_SOFT)
            walk = K.clamp01(progress * 1.2)
            tx = 560 + 160 * walk
            draw.rounded_rectangle((300, 700, 980, 760), radius=14, fill=PAPER, outline=line, width=3)
            draw.line((340, 712, tx, 712), fill=coral, width=7)
            turtle_side(draw, tx, 712, 1.25, t, "happy", walk)
            K.text_at(draw, "Meet", 1360, 300 + lift, F(60, bold=True), muted)
            K.text_at(draw, "Kachhu!", 1360, 372 + lift, F(130, bold=True), SHELL_DARK)
            K.pill(draw, 1360, 560, "a robot turtle", sage, size=38)
            K.pill(draw, 1360, 660, "pen under his tummy", coral, size=34)
            stars_pts(draw, [(1720, 790), (1010, 790)], progress)
            return True
        if focus == "ask":
            kid(draw, 400, 450, 1.25, K.BOTH_COLOR, t)
            K.text_at(draw, "Meera", 400, 700, F(40, bold=True), K.BOTH_COLOR)
            K.draw_bubble(draw, (560, 240, 1220, 400), brand, "Kachhu, draw a square!", tail="left", size=46)
            draw.polygon([(1080, 640), (1800, 640), (1740, 840), (1020, 840)], fill=PAPER, outline=line)
            turtle_side(draw, 1400, 780, 0.95, t, "happy")
            return True
        if focus == "stuck":
            kid(draw, 380, 450, 1.15, K.BOTH_COLOR, 0)
            draw.polygon([(800, 660), (1560, 660), (1500, 850), (740, 850)], fill=PAPER, outline=line)
            turtle_side(draw, 1130, 790, 1.15, 0, "blank")
            dots = int(progress * 6) % 4
            K.draw_bubble(draw, (1330, 270, 1630, 400), brand, "." * max(1, dots), tail="left", size=60)
            K.text_at(draw, "Not moving one bit", 380, 780, F(36, bold=True), muted)
            return True
        if focus == "why":
            circ(draw, cx, 590, 290, LAV_SOFT)
            turtle_side(draw, cx - 20, 720, 1.2, t, "confused")
            for k, (qx, qy) in enumerate(((cx - 420, 330), (cx + 400, 310), (cx - 470, 590), (cx + 450, 570))):
                K.text_at(draw, "?", qx, qy, F(int(90 + 24 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)
            K.text_at(draw, "Why didn't Kachhu draw?", cx, 232, F(50, bold=True), ink)
            K.draw_stopwatch(draw, cx + 640, 770, 50, progress, brand)
            return True
        # because
        turtle_side(draw, 440, 760, 1.15, t, "confused")
        K.draw_bubble(draw, (200, 250, 640, 420), brand, "\"Square\"?", tail="right", size=52)
        a = K.stagger(progress, 0, step=0.2, speed=4)
        if a > 0:
            y = 260 + int((1 - a) * 30)
            draw.rounded_rectangle((860, y, 1700, y + 150), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=5)
            K.draw_cross(draw, 940, y + 75, 38, K.DANGER)
            draw.text((1010, y + 46), "Doesn't know \"square\"", fill=ink, font=F(46, bold=True))
        b = K.stagger(progress, 2, step=0.15, speed=4)
        if b > 0:
            y = 450 + int((1 - b) * 30)
            draw.rounded_rectangle((860, y, 1700, y + 390), radius=36, fill=sage_soft, outline=sage, width=5)
            draw.text((910, y + 34), "Knows tiny commands:", fill=ink, font=F(44, bold=True))
            block(draw, 920, y + 120, 340, "forward", "fd", h=74, size=40)
            block(draw, 1300, y + 120, 340, "turn right", "rt", h=74, size=40)
            K.pill(draw, 1280, y + 270, "step by step", coral, size=36)
        return True

    # ---- commands ---------------------------------------------------------------
    if visual == "c15-commands":
        if focus == "intro":
            K.text_at(draw, "Command = one clear instruction", cx, 250 + lift, F(60, bold=True), ink)
            for i, (txt, kind) in enumerate((("forward 4", "fd"), ("turn right 90", "rt"))):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 420 + i * 200 + int((1 - a) * 40)
                K.pill(draw, 0, y + 20, str(i + 1), coral, size=36, left=420)
                block(draw, 540, y, 640, txt, kind, h=110, size=60)
            turtle_top(draw, 1520, 600, 90 * K.ease_in_out(K.clamp01((progress - 0.6) * 3)), 1.5, t)
            return True
        if focus == "forward":
            cell = 100
            gx, gy = 180, 330
            paper_grid(draw, gx, gy, 7, 4, cell, line)
            ev = sim([("fd", 4)], (1, 2), 90)
            f = K.clamp01((progress - 0.1) * 1.4)
            run(draw, gx, gy, cell, ev, f, coral, ts=0.85, width=12, t=t)
            for k in range(4):
                if f * 4 > k + 0.5:
                    nx = gx + (1.5 + k) * cell
                    circ(draw, nx, gy + 1.45 * cell, 26, K.GOLD)
                    K.text_at(draw, str(k + 1), nx, gy + 1.45 * cell - 18, F(30, bold=True), ink)
            block(draw, 1080, 330, 520, "forward 4", "fd", h=96, size=54)
            rows = [("Walk 4 steps ahead", sage), ("Pen is down → a line!", coral)]
            for i, (txt, col) in enumerate(rows):
                a = K.stagger(progress, i + 2, step=0.15, speed=4)
                if a <= 0:
                    continue
                y = 500 + i * 140 + int((1 - a) * 30)
                draw.rounded_rectangle((1080, y, 1740, y + 110), radius=30, fill=panel, outline=col, width=4)
                circ(draw, 1130, y + 55, 22, col)
                draw.text((1176, y + 32), txt, fill=ink, font=F(40, bold=True))
            return True
        if focus == "number":
            for i, (n, word, col) in enumerate(((2, "short", sage), (8, "long", coral))):
                a = K.stagger(progress, i, step=0.3, speed=3)
                if a <= 0:
                    continue
                y = 320 + i * 280
                block(draw, 140, y, 360, f"forward {n}", "fd", h=86, size=46)
                x0, cell = 600, 130
                ly = y + 43
                for k in range(9):
                    draw.line((x0 + k * cell, ly - 16, x0 + k * cell, ly + 16), fill=GRID_LINE, width=4)
                draw.line((x0, ly, x0 + 8 * cell, ly), fill=GRID_LINE, width=4)
                L = n * cell * K.clamp01(a * 1.2)
                draw.line((x0, ly, x0 + L, ly), fill=col, width=14)
                circ(draw, x0, ly, 7, col)
                turtle_top(draw, x0 + L, ly, 90, 0.7, t)
                for k in range(n):
                    if L > (k + 0.5) * cell:
                        K.text_at(draw, str(k + 1), x0 + (k + 0.5) * cell, ly + 40, F(30, bold=True), muted)
                K.pill(draw, 0, ly + 100, f"{n} steps · {word}", col, size=32, left=x0)
            return True
        if focus == "turn":
            circ(draw, 560, 570, 260, LAV_SOFT)
            turn = K.ease_in_out(K.clamp01((progress - 0.15) * 2))
            turtle_top(draw, 560, 570, 90 * turn, 2.2, t)
            spin_arrow(draw, 560, 570, 215, -90, -90 + 90 * turn, RT_COL, width=12)
            K.text_at(draw, "N", 560, 250, F(38, bold=True), muted)
            K.text_at(draw, "E", 870, 548, F(38, bold=True), muted)
            if turn > 0.5:
                K.text_at(draw, "90°", 760, 330, F(48, bold=True), RT_COL)
            block(draw, 1030, 300, 640, "turn right 90", "rt", h=96, size=52)
            rows = [("Quarter turn, clockwise", RT_COL, True), ("Spins on the spot", sage, True),
                    ("No line is drawn", coral, True)]
            for i, (txt, col, ok) in enumerate(rows):
                a = K.stagger(progress, i + 2, step=0.14, speed=4)
                if a <= 0:
                    continue
                y = 460 + i * 130 + int((1 - a) * 30)
                draw.rounded_rectangle((1030, y, 1720, y + 106), radius=30, fill=panel, outline=col, width=4)
                (K.draw_check if ok else K.draw_cross)(draw, 1086, y + 53, 26, col)
                draw.text((1130, y + 30), txt, fill=ink, font=F(40, bold=True))
            return True
        # rule
        for i, (title, sub, col, soft) in enumerate((("Forward", "draws a line", FD_COL, BLUE_SOFT),
                                                     ("Turn", "just spins", RT_COL, LAV_SOFT))):
            a = K.stagger(progress, i, step=0.25, speed=3.5)
            if a <= 0:
                continue
            x0 = 200 + i * 800
            y0 = 250 + int((1 - a) * 40)
            draw.rounded_rectangle((x0, y0, x0 + 720, y0 + 600), radius=44, fill=soft, outline=col, width=6)
            K.text_at(draw, title, x0 + 360, y0 + 40, F(70, bold=True), col)
            ix, iy = x0 + 360, y0 + 300
            if i == 0:
                draw.line((ix - 230, iy, ix + 60, iy), fill=coral, width=14)
                circ(draw, ix - 230, iy, 7, coral)
                turtle_top(draw, ix + 90, iy, 90, 1.1, t)
            else:
                turtle_top(draw, ix, iy, 360 * K.clamp01(progress * 1.2), 1.1, t)
                spin_arrow(draw, ix, iy, 120, -90, 200, col, width=10)
            K.text_at(draw, sub, x0 + 360, y0 + 470, F(52, bold=True), ink)
        return True

    # ---- the square -----------------------------------------------------------------
    if visual == "c15-square":
        cell = 110
        gx, gy = 200, 290
        paper_grid(draw, gx, gy, 5, 5, cell, line)
        ev = sim(SQUARE4, (0.5, 4.5), 0)
        bounds = {"plan": (0, 0), "side1": (0, 5.5 / 22), "side2": (5.5 / 22, 16.5 / 22),
                  "side4": (16.5 / 22, 1.0), "done": (1.0, 1.0)}
        f0, f1 = bounds[focus]
        frac = K.lerp(f0, f1, K.clamp01((progress - 0.05) * 1.25))
        if focus == "plan":
            ghost(draw, gx, gy, cell, ev, mix(coral, (255, 255, 255), 0.35), phase=progress * 120)
            for (px, py) in ((0.5, 0.5), (4.5, 0.5), (4.5, 4.5), (0.5, 4.5)):
                sx = 1 if px < 2 else -1
                sy = 1 if py < 2 else -1
                x, y = gx + px * cell, gy + py * cell
                draw.line((x + sx * 34, y, x + sx * 34, y + sy * 34, x, y + sy * 34), fill=RT_COL, width=5)
            turtle_top(draw, gx + 0.5 * cell, gy + 4.5 * cell, 0, 0.75, t)
            x0 = 950
            K.text_at(draw, "A square has…", 1330, 270 + lift, F(56, bold=True), ink)
            rows = [("4 equal sides", coral, coral_soft), ("4 square corners", RT_COL, LAV_SOFT)]
            for i, (txt, col, soft) in enumerate(rows):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 400 + i * 220 + int((1 - a) * 30)
                draw.rounded_rectangle((x0, y, 1720, y + 180), radius=40, fill=soft, outline=col, width=5)
                if i == 0:
                    for k in range(4):
                        draw.line((x0 + 50 + k * 50, y + 60, x0 + 50 + k * 50, y + 120), fill=col, width=10)
                else:
                    draw.line((x0 + 60, y + 50, x0 + 60, y + 130, x0 + 140, y + 130), fill=col, width=10)
                    draw.rectangle((x0 + 60, y + 100, x0 + 90, y + 130), outline=col, width=4)
                draw.text((x0 + 270, y + 62), txt, fill=ink, font=F(52, bold=True))
            return True
        idx = run(draw, gx, gy, cell, ev, frac, coral, ts=0.75, width=12, t=t)
        if focus == "done":
            for (lx, ly) in ((gx + 0.5 * cell - 50, gy + 2.5 * cell - 22), (gx + 2.5 * cell, gy + 0.5 * cell - 60),
                             (gx + 4.5 * cell + 50, gy + 2.5 * cell - 22), (gx + 2.5 * cell, gy + 4.5 * cell + 14)):
                circ(draw, lx, ly + 22, 26, panel, coral, 4)
                K.text_at(draw, "4", lx, ly + 2, F(32, bold=True), coral)
            K.text_at(draw, "Perfect square!", 1330, 270 + lift, F(60, bold=True), sage)
            repeat_block(draw, 1000, 400, 640, 4, SQUARE4[:2], h=84, size=46, gap=16)
            K.pill(draw, 1330, 790, "same 2 commands · 4 times", coral, size=34)
            stars_at(draw, gx + 2.5 * cell, gy + 2.5 * cell, 120, progress)
            return True
        K.text_at(draw, "Kachhu's commands", 1300, 250, F(38, bold=True), muted)
        code_list(draw, 1000, 310, 600, SQUARE4, active=idx, h=56, gap=11, size=32)
        if idx < 8:
            side = idx // 2 + 1
            K.pill(draw, 0, 310 + idx * 67 + 4, f"side {side}" if idx % 2 == 0 else "corner", coral, size=26,
                   left=1630)
        return True

    # ---- repeat ------------------------------------------------------------------
    if visual == "c15-repeat":
        if focus == "long":
            notebook(draw, (200, 240, 980, 870), "8 commands…", ink, coral)
            code_list(draw, 260, 320, 560, SQUARE4, states=["normal"] * 8, h=52, gap=13, size=30)
            kid(draw, 1380, 470, 1.3, K.BOTH_COLOR, 0, mood="worried")
            sx, sy = 1480, 380 + 20 * K.clamp01(progress * 2)
            draw.polygon([(sx, sy - 30), (sx - 16, sy), (sx + 16, sy)], fill=K.WATER)
            circ(draw, sx, sy + 4, 16, K.WATER)
            K.text_at(draw, "Phew!", 1380, 760, F(64, bold=True), coral)
            return True
        if focus == "repeat":
            a = K.ease_in_out(K.clamp01((progress - 0.1) * 2))
            code_list(draw, 160, 270, 470, SQUARE4, states=["dim"] * 8, h=56, gap=12, size=30)
            K.draw_arrow(draw, 680, 520, 780 + 30 * a, 520, coral, width=14, head=40)
            if a > 0:
                repeat_block(draw, 880, 330, 760, 4, SQUARE4[:2], h=96, size=54, gap=18)
                K.pill(draw, 1260, 730, "8 lines → 3 lines!", sage, size=38)
            return True
        if focus == "loop":
            loops = K.clamp01(progress * 1.15) * 4
            k = min(3, int(loops))
            repeat_block(draw, 160, 330, 640, 4, SQUARE4[:2], active=0 if loops % 1 < 0.6 else 1, h=84, size=46,
                         gap=16)
            spin_arrow(draw, 900, 520, 110, -60, 230, REP_COL, width=12)
            K.text_at(draw, f"{k + 1}", 900, 470, F(80, bold=True), REP_COL)
            K.text_at(draw, "LOOP", 900, 680, F(44, bold=True), REP_COL)
            cell = 100
            gx, gy = 1180, 330
            paper_grid(draw, gx, gy, 5, 5, cell, line)
            ev = sim(SQUARE4, (0.5, 4.5), 0)
            run(draw, gx, gy, cell, ev, K.clamp01(progress * 1.15), coral, ts=0.7, width=12, t=t)
            for i in range(4):
                circ(draw, 230 + i * 110, 790, 34, REP_COL if i <= k else line)
                K.text_at(draw, str(i + 1), 230 + i * 110, 770, F(34, bold=True), (255, 255, 255) if i <= k else muted)
            return True
        # program
        a = K.stagger(progress, 0, step=0.2, speed=4)
        repeat_block(draw, 160, 360, 560, 4, SQUARE4[:2], h=76, size=42, gap=14)
        K.text_at(draw, "commands in order", 440, 270, F(40, bold=True), muted)
        b = K.stagger(progress, 1, step=0.2, speed=4)
        if b > 0:
            K.text_at(draw, "=", 850, 470, F(140, bold=True), ink)
        c = K.stagger(progress, 2, step=0.2, speed=4)
        if c > 0:
            y = 280 + int((1 - c) * 40)
            draw.rounded_rectangle((1010, y + 12, 1730, y + 572), radius=30, fill=K.SHADOW)
            draw.rounded_rectangle((1000, y, 1720, y + 560), radius=30, fill=(255, 250, 238), outline=REP_COL, width=6)
            K.text_at(draw, "PROGRAM", 1360, y + 40, F(84, bold=True), REP_COL)
            mini_square(draw, 1280, y + 200, 160, coral, 12)
            turtle_top(draw, 1280, y + 360, 0, 0.55, t)
            K.pill(draw, 1360, y + 440, "You wrote one!", sage, size=40)
            if progress > 0.6:
                stars_pts(draw, [(1800, 330), (1800, 760), (930, 300), (930, 780)], progress)
        del a
        return True

    # ---- bigger square ---------------------------------------------------------------
    if visual == "c15-bigger":
        if focus == "ask":
            repeat_block(draw, 160, 320, 640, 4, SQUARE4[:2], h=84, size=46, gap=16)
            K.text_at(draw, "Which number?", 480, 720, F(48, bold=True), coral)
            for k, (qx, qy) in enumerate(((870, 340), (870, 600))):
                K.text_at(draw, "?", qx, qy, F(int(80 + 20 * (pulse if k else 1 - pulse)), bold=True), K.GOLD)
            mini_square(draw, 1040, 600, 160, coral, 10)
            K.draw_dashed(draw, 1300, 280, 1700, 280, coral, width=6, phase=progress * 100)
            K.draw_dashed(draw, 1700, 280, 1700, 680, coral, width=6, phase=progress * 100)
            K.draw_dashed(draw, 1700, 680, 1300, 680, coral, width=6, phase=progress * 100)
            K.draw_dashed(draw, 1300, 680, 1300, 280, coral, width=6, phase=progress * 100)
            K.text_at(draw, "bigger?", 1500, 440, F(52, bold=True), muted)
            K.draw_stopwatch(draw, 1500, 790, 44, progress, brand)
            return True
        if focus == "answer":
            sw = K.clamp01((progress - 0.15) * 3)
            repeat_block(draw, 140, 320, 640, 4, [("fd", 8 if sw > 0.5 else 4), ("rt", 90)], h=84, size=46, gap=16)
            if 0 < sw < 1:
                circ(draw, 520, 462, 50 * (1 - abs(sw - 0.5) * 2) + 10, K.GOLD)
            K.pill(draw, 0, 690, "forward 4 → forward 8", FD_COL, size=38, left=150)
            cell = 54
            gx, gy = 1080, 300
            paper_grid(draw, gx, gy, 9, 9, cell, line)
            g = K.clamp01((progress - 0.35) * 1.6)
            draw.rectangle((gx + 0.5 * cell, gy + 4.5 * cell, gx + 4.5 * cell, gy + 8.5 * cell), outline=sage, width=8)
            if g > 0:
                ev = sim([("fd", 8), ("rt", 90)] * 4, (0.5, 8.5), 0)
                run(draw, gx, gy, cell, ev, g, coral, ts=0.5, width=9, t=t)
            K.text_at(draw, "4", gx + 2.5 * cell, gy + 6.5 * cell - 22, F(40, bold=True), sage)
            if g >= 1:
                K.text_at(draw, "8", gx + 4.5 * cell, gy + 0.5 * cell + 12, F(40, bold=True), coral)
            K.pill(draw, 0, 790, "every side twice as long", coral, size=32, left=150)
            return True
        if focus == "keep":
            repeat_block(draw, 140, 300, 640, 4, [("fd", 8), ("rt", 90)], h=84, size=46, gap=16)
            draw.rounded_rectangle((128, 288, 470, 396), radius=22, outline=sage, width=6)
            draw.rounded_rectangle((172, 488, 792, 596), radius=22, outline=sage, width=6)
            K.pill(draw, 0, 690, "keep repeat 4", sage, size=34, left=150)
            K.pill(draw, 0, 770, "keep turn right 90", sage, size=34, left=150)
            a = K.stagger(progress, 2, step=0.15, speed=3)
            if a > 0:
                draw.rounded_rectangle((980, 270, 1740, 860), radius=40, fill=K.DANGER_SOFT, outline=K.DANGER, width=5)
                K.text_at(draw, "turn right 45 instead?", 1360, 300, F(40, bold=True), K.DANGER)
                x, y, hd = 1200, 800, 0.0
                pts = [(x, y)]
                L = 150
                for _ in range(4):
                    r = math.radians(hd)
                    x, y = x + math.sin(r) * L, y - math.cos(r) * L
                    pts.append((x, y))
                    hd += 45
                n = a * 4
                for k in range(4):
                    f = K.clamp01(n - k)
                    if f <= 0:
                        break
                    p0, p1 = pts[k], pts[k + 1]
                    pe = (K.lerp(p0[0], p1[0], f), K.lerp(p0[1], p1[1], f))
                    draw.line((p0, pe), fill=coral, width=10)
                    circ(draw, pe[0], pe[1], 5, coral)
                if a >= 1:
                    K.draw_cross(draw, 1640, 760, 44, K.DANGER)
                    K.text_at(draw, "Not a square!", 1360, 390, F(48, bold=True), K.DANGER)
            return True
        # count / count8
        n = 4 if focus == "count" else 8
        cell = 120 if n == 4 else 62
        gx, gy = 220, 300
        span = n * cell
        draw.rounded_rectangle((gx - 40, gy - 40, gx + span + 40, gy + span + 40), radius=26, fill=PAPER,
                               outline=line, width=3)
        draw.rectangle((gx, gy, gx + span, gy + span), outline=coral, width=10)
        pts = []
        for k in range(4 * n):
            side, j = divmod(k, n)
            u = j + 1
            if side == 0:
                p = (gx, gy + span - u * cell)
            elif side == 1:
                p = (gx + u * cell, gy)
            elif side == 2:
                p = (gx + span, gy + u * cell)
            else:
                p = (gx + span - u * cell, gy + span)
            pts.append(p)
        shown = int(K.clamp01(progress * 1.25) * 4 * n)
        for k, p in enumerate(pts[:shown]):
            circ(draw, p[0], p[1], 15 if n == 4 else 10, K.GOLD, ink, 2)
        sides = min(4, shown // n)
        K.text_at(draw, f"{n} steps on each side", 1360, 300, F(46, bold=True), ink)
        terms = " + ".join([str(n)] * max(1, sides))
        K.text_at(draw, terms, 1360, 420, F(64, bold=True), coral)
        if sides >= 4:
            K.text_at(draw, f"4 × {n} = {4 * n}", 1360, 540, F(90, bold=True), sage)
            K.pill(draw, 1360, 700, f"{4 * n} steps in all!", sage, size=42)
        K.text_at(draw, f"steps walked: {shown}", 1360, 800, F(36, bold=True), muted)
        return True

    # ---- rectangle ----------------------------------------------------------------------
    if visual == "c15-rect":
        cell = 105
        gx, gy = 170, 330
        paper_grid(draw, gx, gy, 8, 5, cell, line)
        ev = sim(RECT63, (1, 1), 90)
        side_labels = [((4, 1), "6", 0, -64), ((7, 2.5), "3", 56, -22), ((4, 4), "6", 0, 20), ((1, 2.5), "3", -56, -22)]

        def labels(n=4, col=coral):
            for (px, py), txt, dx, dy in side_labels[:n]:
                lx, ly = gx + px * cell + dx, gy + py * cell + dy
                circ(draw, lx, ly + 22, 28, panel, col, 4)
                K.text_at(draw, txt, lx, ly + 2, F(34, bold=True), col)

        if focus == "intro":
            ghost(draw, gx, gy, cell, ev, mix(coral, (255, 255, 255), 0.35), phase=progress * 120)
            labels()
            turtle_top(draw, gx + cell, gy + cell, 90, 0.75, t)
            rows = [("Long side: 6 steps", coral, coral_soft), ("Short side: 3 steps", RT_COL, LAV_SOFT)]
            for i, (txt, col, soft) in enumerate(rows):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 360 + i * 200 + int((1 - a) * 30)
                draw.rounded_rectangle((1100, y, 1740, y + 150), radius=36, fill=soft, outline=col, width=5)
                draw.text((1150, y + 46), txt, fill=ink, font=F(48, bold=True))
            return True
        if focus == "half":
            frac = K.clamp01((progress - 0.05) * 1.2) * 0.5
            idx = run(draw, gx, gy, cell, ev, frac, coral, ts=0.7, width=12, t=t)
            code_list(draw, 1150, 360, 520, RECT63[:4], active=min(idx, 4), h=70, gap=18, size=38)
            if frac >= 0.5:
                K.pill(draw, 1410, 720, "half done!", sage, size=38)
            return True
        if focus == "repeat":
            frac = K.lerp(0.5, 1.0, K.clamp01((progress - 0.05) * 1.3))
            idx = run(draw, gx, gy, cell, ev, frac, coral, ts=0.7, width=12, t=t)
            repeat_block(draw, 1100, 300, 620, 2, RECT63[:4], active=(idx % 4) if idx < 8 else -1, h=64, size=36,
                         gap=12)
            if frac >= 1:
                K.draw_check(draw, gx + 4 * cell, gy + 2.5 * cell, 44, sage)
            return True
        run(draw, gx, gy, cell, ev, 1.0, coral, ts=0.7, width=12, t=t)
        if focus == "ask":
            labels()
            K.text_at(draw, "How many steps?", 1400, 330, F(56, bold=True), ink)
            K.text_at(draw, "6 + 3 + 6 + 3 = ?", 1400, 470, F(66, bold=True), coral)
            K.draw_stopwatch(draw, 1400, 700, 60, progress, brand)
            return True
        # answer
        n = min(4, int(K.clamp01(progress * 1.4) * 5))
        labels(n, sage)
        K.text_at(draw, "Add the sides:", 1400, 330, F(48, bold=True), muted)
        parts = ["6", "3", "6", "3"]
        K.text_at(draw, " + ".join(parts[:max(1, n)]), 1400, 440, F(66, bold=True), coral)
        if n >= 4:
            K.text_at(draw, "= 18 steps", 1400, 560, F(90, bold=True), sage)
            stars_pts(draw, [(1180, 760), (1400, 790), (1620, 760)], progress)
        return True

    # ---- plus sign ------------------------------------------------------------------------
    if visual == "c15-plus":
        cell = 110
        gx, gy = 220, 300
        paper_grid(draw, gx, gy, 5, 5, cell, line)
        ev = sim(PLUS2, (2.5, 2.5), 0)
        if focus == "intro":
            turtle_top(draw, gx + 2.5 * cell, gy + 2.5 * cell, 0, 0.8, t)
            circ(draw, gx + 2.5 * cell, gy + 2.5 * cell, 70 + 10 * pulse, None, K.GOLD, 5)
            K.text_at(draw, "Start in the middle", 1340, 290, F(44, bold=True), muted)
            K.pill(draw, 1340, 400, "NEW COMMAND", coral, size=32)
            block(draw, 1060, 500, 560, "back 2", "bk", h=110, size=60)
            K.text_at(draw, "= walk backwards", 1340, 680, F(48, bold=True), BK_COL)
            return True
        if focus == "arm":
            frac = K.clamp01((progress - 0.05) * 1.25) * 0.25
            idx = run(draw, gx, gy, cell, ev, frac, coral, ts=0.75, width=12, t=t)
            code_list(draw, 1100, 380, 520, PLUS2[:3], active=min(idx, 3), h=80, gap=26, size=42)
            if frac >= 0.25:
                K.pill(draw, 1360, 720, "1 arm · back in the middle", sage, size=32)
            return True
        frac = K.lerp(0.25, 1.0, K.clamp01((progress - 0.05) * 1.3))
        idx = run(draw, gx, gy, cell, ev, frac, coral, ts=0.75, width=12, t=t)
        repeat_block(draw, 1060, 320, 600, 4, PLUS2[:3], active=(idx % 3) if idx < 12 else -1, h=72, size=40, gap=14)
        if frac >= 1:
            K.pill(draw, 1360, 760, "A plus sign!", sage, size=42)
            stars_at(draw, gx + 2.5 * cell, gy + 2.5 * cell, 330, progress, 4)
        return True

    # ---- fix the bug ------------------------------------------------------------------------
    if visual == "c15-fix":
        cell = 105
        gx, gy = 900, 300
        buggy = SQUARE4[:6]
        if focus == "intro":
            kid(draw, 400, 470, 1.3, K.BOTH_COLOR, t, mood="worried")
            K.text_at(draw, "Uh-oh!", 400, 760, F(64, bold=True), K.DANGER)
            paper_grid(draw, gx + 150, gy, 5, 5, cell, line)
            ev = sim(buggy, (0.5, 4.5), 0)
            run(draw, gx + 150, gy, cell, ev, K.clamp01(progress * 1.4), coral, ts=0.7, width=12, t=t)
            return True
        gx = 1100
        paper_grid(draw, gx, gy, 5, 5, cell, line)
        ev = sim(buggy, (0.5, 4.5), 0)
        run(draw, gx, gy, cell, ev, 1.0, coral, ts=0.7, width=12, t=t, turtle=False)
        x0, y0 = gx + 4.5 * cell, gy + 4.5 * cell
        x1 = gx + 0.5 * cell
        if focus == "q":
            notebook(draw, (150, 240, 900, 870), "Meera's program", ink, coral)
            code_list(draw, 230, 330, 560, buggy, states=["normal"] * 6, h=62, gap=17, size=34)
            K.draw_dashed(draw, x0, y0, x1, y0, K.DANGER, width=8, phase=progress * 120)
            K.text_at(draw, "?", (x0 + x1) / 2, y0 - 110, F(int(70 + 16 * pulse), bold=True), K.DANGER)
            turtle_top(draw, x0, y0, 270, 0.7, t)
            K.draw_stopwatch(draw, gx + 2.5 * cell, gy + 2.2 * cell, 48, progress, brand)
            return True
        notebook(draw, (150, 240, 900, 870), "Fixed program", ink, coral)
        states = ["normal"] * 6 + ["active"]
        code_list(draw, 230, 320, 560, buggy + [("fd", 4)], states=states, h=56, gap=13, size=32)
        K.pill(draw, 0, 320 + 6 * 69 + 4, "NEW", sage, size=26, left=810)
        f = K.clamp01((progress - 0.2) * 2.5)
        xe = K.lerp(x0, x1, f)
        draw.line((x0, y0, xe, y0), fill=sage, width=12)
        turtle_top(draw, xe, y0, 270, 0.7, t)
        if f >= 1:
            K.pill(draw, gx + 2.5 * cell, 230, "Debugging!", sage, size=38)
            K.draw_magnifier(draw, gx + 2.5 * cell, gy + 2.5 * cell - 20, 0.9, K.GOLD)
        return True

    # ---- which way is he facing? -----------------------------------------------------------------
    if visual == "c15-facing":
        cell = 120
        gx, gy = 200, 300
        paper_grid(draw, gx, gy, 4, 4, cell, line)
        cmds = [("fd", 2), ("rt", 90)] * 2
        ev = sim(cmds, (1, 3), 0)
        ans = focus == "a"
        if not ans:
            run(draw, gx, gy, cell, ev, 1.0, coral, ts=0.75, width=12, t=t, turtle=False)
            ex, ey = gx + 3 * cell, gy + 1 * cell
            circ(draw, ex, ey, 52, K.BOTH_COLOR)
            K.text_at(draw, "?", ex, ey - 40, F(72, bold=True), (255, 255, 255))
            turtle_top(draw, gx + cell, gy + 3 * cell, 0, 0.55, t)
        else:
            run(draw, gx, gy, cell, ev, 1.0, coral, ts=0.85, width=12, t=t)
        # compass
        ccx, ccy, r = 1010, 560, 200
        circ(draw, ccx, ccy, r + 20, panel, line, 4)
        for lab, ang in (("N", -90), ("E", 0), ("S", 90), ("W", 180)):
            a = math.radians(ang)
            K.text_at(draw, lab, ccx + math.cos(a) * (r - 30), ccy + math.sin(a) * (r - 30) - 26, F(48, bold=True),
                      ink)
        if ans:
            step = K.clamp01(progress * 2.5) * 2
            spin_arrow(draw, ccx, ccy, r - 90, -90, -90 + 90 * step, coral, width=12)
            hd = math.radians(-90 + 90 * step)
            K.draw_arrow(draw, ccx, ccy, ccx + math.cos(hd) * 90, ccy + math.sin(hd) * 90, ink, width=10, head=28)
            if step >= 2:
                K.pill(draw, ccx, 820, "2 quarter turns = half turn", sage, size=30)
        else:
            K.draw_arrow(draw, ccx, ccy, ccx, ccy - 90, ink, width=10, head=28)
            K.text_at(draw, "start: north", ccx, 820, F(34, bold=True), muted)
        code_list(draw, 1340, 330, 400, cmds, states=["normal"] * 4, h=66, gap=20, size=34)
        K.text_at(draw, "SOUTH!" if ans else "Facing?", 1540, 700, F(64, bold=True), sage if ans else coral)
        return True

    # ---- checkpoint ---------------------------------------------------------------------------------
    if visual == "c15-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 720 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, F(40, bold=True), sage)
            K.text_at(draw, "You're the programmer!", cx, 450 + lift, F(64, bold=True), ink)
            turtle_top(draw, cx, 620 + lift, 90 * K.clamp01(progress * 2), 0.9, t)
            return True
        ans = focus == "answer"
        notebook(draw, (140, 240, 1000, 870), "Square · 4 steps a side", ink, coral)
        cell = 100
        gx, gy = 1200, 330
        paper_grid(draw, gx, gy, 5, 5, cell, line)
        ev = sim(SQUARE4, (0.5, 4.5), 0)
        if not ans:
            for i in range(5):
                y = 380 + i * 92
                draw.line((230, y + 70, 950, y + 70), fill=(220, 210, 232), width=3)
                K.pill(draw, 0, y + 14, str(i + 1), muted, size=28, left=240)
            turtle_top(draw, gx + 0.5 * cell, gy + 4.5 * cell, 0, 0.7, t)
            K.pill(draw, 1450, 236, "Pause & try!", coral, size=34)
            return True
        a = K.stagger(progress, 0, step=0.1, speed=3)
        if a > 0:
            draw.text((200, 350), "Do this 4 times:", fill=muted, font=F(38, bold=True))
            code_list(draw, 200, 410, 520, SQUARE4[:2], states=["normal"] * 2, h=66, gap=16, size=36)
        b = K.stagger(progress, 3, step=0.12, speed=3)
        if b > 0:
            draw.text((200, 610), "Short way:", fill=muted, font=F(38, bold=True))
            block(draw, 200, 676, 740, "repeat 4 [forward 4, turn right 90]", "rep", h=76, size=36)
        idx = run(draw, gx, gy, cell, ev, K.clamp01((progress - 0.1) * 1.3), coral, ts=0.7, width=12, t=t)
        if idx >= len(ev):
            stars_at(draw, gx + 2.5 * cell, gy + 2.5 * cell, 330, progress, 4)
        return True

    # ---- recap ----------------------------------------------------------------------------------------
    if visual == "c15-recap":
        recap = [("Square = repeat 4", REP_COL, "square"), ("Forward number = size", FD_COL, "size"),
                 ("Forward draws, turn spins", RT_COL, "spin"), ("Commands = a program", sage, "program")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "square":
                    mini_square(draw, ix - 80, iy - 100, 160, coral, 10)
                    turtle_top(draw, ix - 80, iy + 60, 0, 0.45, t)
                    K.pill(draw, ix + 120, iy + 76, "× 4", REP_COL, size=32)
                elif kind == "size":
                    mini_square(draw, ix - 130, iy + 10, 80, sage, 8)
                    mini_square(draw, ix - 20, iy - 100, 150, coral, 10)
                elif kind == "spin":
                    draw.line((ix - 140, iy - 50, ix + 20, iy - 50), fill=coral, width=10)
                    turtle_top(draw, ix + 60, iy - 50, 90, 0.5, t)
                    turtle_top(draw, ix, iy + 70, 0, 0.5, t)
                    spin_arrow(draw, ix, iy + 70, 60, -90, 160, RT_COL, width=7)
                else:
                    for k in range(3):
                        yy = iy - 100 + k * 64
                        draw.rounded_rectangle((ix - 140, yy, ix + 140, yy + 48), radius=12,
                                               fill=[FD_COL, RT_COL, REP_COL][k])
                        draw.rounded_rectangle((ix - 110, yy + 18, ix + 60, yy + 30), radius=6, fill=(255, 255, 255))
                font = F(36, bold=True)
                lines = K.wrap_text(lab, font, 340)
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 330), 420, 110, sage, panel, bounce)
            turtle_side(draw, cx + 330, 560, 0.85, t, "happy")
            K.text_at(draw, "Chapter 5 done!", cx, 610, F(68, bold=True), ink)
            K.pill(draw, cx, 710, "Unit 3 complete!", coral, size=40)
            for i in range(5):
                x = cx - 240 + i * 120
                circ(draw, x, 840, 30, sage)
                K.draw_check(draw, x, 840, 26, sage)
            stars_pts(draw, [(cx - 620, 300), (cx + 640, 320), (cx - 560, 650), (cx + 560, 690), (cx, 290)],
                      progress)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
