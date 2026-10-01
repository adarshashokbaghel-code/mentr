"""C2 · Odd, Even, and Patterns — visuals."""
import math

import build as K

RIYA = (123, 97, 214)
LADDOO = (247, 168, 46)
LADDOO_DARK = (212, 124, 24)
LADDOO_HI = (255, 214, 130)
BULB_ON = (255, 212, 70)
BULB_RIM = (226, 160, 30)
GLOW_1 = (255, 244, 204)
GLOW_2 = (255, 230, 150)
BULB_OFF = (214, 216, 224)
FROG = (112, 192, 84)
FROG_DARK = (72, 150, 60)
FROG_BELLY = (196, 232, 160)
BOX = (214, 64, 84)
BOX_DARK = (170, 40, 62)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
PLACE_COLS = [(123, 97, 214), (72, 118, 214), (13, 148, 136)]
PAPER = (255, 250, 238)


def S_(s):
    return lambda v: v * s


def flower_clip(draw, cx, cy, r):
    for k in range(5):
        a = k * 2 * math.pi / 5
        px, py = cx + math.cos(a) * r * 0.6, cy + math.sin(a) * r * 0.6
        draw.ellipse((px - r * 0.5, py - r * 0.5, px + r * 0.5, py + r * 0.5), fill=(238, 104, 158))
    draw.ellipse((cx - r * 0.4, cy - r * 0.4, cx + r * 0.4, cy + r * 0.4), fill=K.GOLD)


def kid(draw, cx, cy, s, body, t=0.0, bun=True, flower=False):
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
    if flower:
        flower_clip(draw, cx + r * 0.75, cy - r * 0.8, r * 0.32)


def riya(draw, cx, cy, s, t=0.0):
    kid(draw, cx, cy, s, RIYA, t, flower=True)


def laddoo(draw, cx, cy, r, sad=False):
    draw.ellipse((cx - r + r * 0.12, cy - r + r * 0.18, cx + r + r * 0.12, cy + r + r * 0.18), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LADDOO)
    for dx, dy in ((-0.4, -0.2), (0.1, -0.5), (0.45, 0.05), (-0.1, 0.35), (0.3, 0.5), (-0.5, 0.3)):
        d = r * 0.11
        draw.ellipse((cx + dx * r - d, cy + dy * r - d, cx + dx * r + d, cy + dy * r + d), fill=LADDOO_DARK)
    draw.ellipse((cx - r * 0.55, cy - r * 0.6, cx - r * 0.15, cy - r * 0.3), fill=LADDOO_HI)
    if sad:
        e = r * 0.12
        for sx in (-1, 1):
            draw.ellipse((cx + sx * r * 0.32 - e, cy - r * 0.1 - e, cx + sx * r * 0.32 + e, cy - r * 0.1 + e),
                         fill=K.DEV_DEEP)
        draw.arc((cx - r * 0.3, cy + r * 0.25, cx + r * 0.3, cy + r * 0.7), 200, 340, fill=K.DEV_DEEP,
                 width=max(2, int(r * 0.1)))


def plate(draw, cx, cy, rw):
    draw.ellipse((cx - rw + 6, cy - rw * 0.3 + 8, cx + rw + 6, cy + rw * 0.3 + 8), fill=K.SHADOW)
    draw.ellipse((cx - rw, cy - rw * 0.3, cx + rw, cy + rw * 0.3), fill=K.STEEL, outline=K.STEEL_DARK, width=3)
    draw.ellipse((cx - rw * 0.75, cy - rw * 0.2, cx + rw * 0.75, cy + rw * 0.2), fill=(206, 212, 222))


def pairs_width(n, r):
    p, rem = divmod(n, 2)
    return p * 4.4 * r + max(0, p - 1) * 0.9 * r + rem * (0.9 * r + 2.9 * r if p else 2.9 * r)


def pairs_display(draw, n, r, y, cx=None, left=None, n_show=None, pair_col=None, pair_soft=None,
                  odd_col=None, phase=0.0):
    """n laddoos grouped into pairs (rounded ovals) and a sad leftover (dashed circle)."""
    pair_col = pair_col or (13, 148, 136)
    pair_soft = pair_soft or (230, 247, 244)
    odd_col = odd_col or (255, 106, 26)
    total = pairs_width(n, r)
    x = left if left is not None else cx - total / 2
    shown = n if n_show is None else max(0, min(n, n_show))
    p, rem = divmod(n, 2)
    idx = 0
    for k in range(p):
        px = x + 2.2 * r
        if shown >= idx + 2:
            draw.rounded_rectangle((px - 2.2 * r, y - 1.45 * r, px + 2.2 * r, y + 1.45 * r), radius=int(1.45 * r),
                                   fill=pair_soft, outline=pair_col, width=max(3, int(r * 0.12)))
        for j in range(2):
            if shown > idx:
                laddoo(draw, px + (j * 2 - 1) * 1.05 * r, y, r)
            idx += 1
        x += 4.4 * r + 0.9 * r
    if rem and shown > idx:
        lx = x + 1.45 * r
        n_d = 14
        rr = 1.45 * r
        for d in range(n_d):
            a0 = d * 360 / n_d + phase * 60
            draw.arc((lx - rr, y - rr, lx + rr, y + rr), a0, a0 + 360 / n_d * 0.6, fill=odd_col,
                     width=max(3, int(r * 0.12)))
        laddoo(draw, lx, y, r, sad=True)


def bulb(draw, cx, cy, r, on, t=0.0):
    if on:
        g = 1 + 0.05 * math.sin(t * 20)
        draw.ellipse((cx - r * 1.55 * g, cy - r * 1.55 * g, cx + r * 1.55 * g, cy + r * 1.55 * g), fill=GLOW_1)
        draw.ellipse((cx - r * 1.25, cy - r * 1.25, cx + r * 1.25, cy + r * 1.25), fill=GLOW_2)
        for deg in (-180, -150, -120, -90, -60, -30, 0):
            a = math.radians(deg)
            draw.line((cx + math.cos(a) * r * 1.62, cy + math.sin(a) * r * 1.62,
                       cx + math.cos(a) * r * 1.95, cy + math.sin(a) * r * 1.95), fill=K.GOLD,
                      width=max(3, int(r * 0.11)))
    nw = r * 0.48
    lw = max(2, int(r * 0.05))
    draw.rounded_rectangle((cx - nw, cy + r * 0.6, cx + nw, cy + r * 1.3), radius=r * 0.12, fill=K.STEEL,
                           outline=K.STEEL_DARK, width=lw)
    draw.chord((cx - nw * 0.7, cy + r * 1.12, cx + nw * 0.7, cy + r * 1.5), 0, 180, fill=K.DEV_DARK)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r * 0.95), fill=BULB_ON if on else BULB_OFF,
                 outline=BULB_RIM if on else K.DEV_MID, width=max(3, int(r * 0.07)))
    fcol = (255, 120, 20) if on else K.DEV_MID
    pts = [(cx - r * 0.32 + k * r * 0.16, cy - r * 0.05 + (r * 0.12 if k % 2 else -r * 0.12)) for k in range(5)]
    draw.line(pts, fill=fcol, width=max(2, int(r * 0.07)), joint="curve")
    draw.arc((cx - r * 0.72, cy - r * 0.72, cx + r * 0.1, cy + r * 0.1), 190, 250, fill=(255, 255, 255),
             width=max(2, int(r * 0.12)))


def value_tag(draw, x, y, val, col, size=40):
    f = K.load_font(size, bold=True)
    hw, hh = size * 1.3, size * 1.45
    draw.rounded_rectangle((x - hw + 5, y + 6, x + hw + 5, y + hh + 6), radius=int(hh / 2), fill=K.SHADOW)
    draw.rounded_rectangle((x - hw, y, x + hw, y + hh), radius=int(hh / 2), fill=col)
    K.text_at(draw, str(val), x, y + hh * 0.12, f, (255, 255, 255))


def frog(draw, cx, by, s, t=0.0):
    """Frog sitting with feet on y=by; top of eyes ≈ by-128s."""
    S = S_(s)
    draw.ellipse((cx - S(74), by - S(14), cx + S(74), by + S(10)), fill=K.SHADOW)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(56) - S(34), by - S(54), cx + sx * S(56) + S(34), by), fill=FROG_DARK)
        draw.ellipse((cx + sx * S(70) - S(26), by - S(14), cx + sx * S(70) + S(26), by + S(4)), fill=FROG_DARK)
    draw.ellipse((cx - S(64), by - S(112), cx + S(64), by - S(6)), fill=FROG)
    draw.ellipse((cx - S(40), by - S(70), cx + S(40), by - S(10)), fill=FROG_BELLY)
    blink = (t * 3) % 1 > 0.92
    for sx in (-1, 1):
        ex, ey = cx + sx * S(34), by - S(104)
        draw.ellipse((ex - S(24), ey - S(24), ex + S(24), ey + S(24)), fill=FROG)
        if blink:
            draw.line((ex - S(12), ey, ex + S(12), ey), fill=K.DEV_DEEP, width=max(2, int(S(5))))
        else:
            draw.ellipse((ex - S(15), ey - S(15), ex + S(15), ey + S(15)), fill=(255, 255, 255))
            draw.ellipse((ex - S(7), ey - S(7), ex + S(7), ey + S(7)), fill=K.DEV_DEEP)
    draw.arc((cx - S(30), by - S(92), cx + S(30), by - S(60)), 20, 160, fill=FROG_DARK, width=max(2, int(S(5))))
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(46) - S(9), by - S(80) - S(6), cx + sx * S(46) + S(9), by - S(80) + S(6)),
                     fill=(240, 150, 150))


def clap(draw, cx, cy, s, active=False):
    S = S_(s)
    gap = S(4) if active else S(22)
    for sx in (-1, 1):
        x_in = cx + sx * gap
        x_out = cx + sx * (gap + S(58))
        x0, x1 = sorted((x_in, x_out))
        draw.rounded_rectangle((x0, cy - S(70), x1, cy + S(50)), radius=S(26), fill=K.SKIN)
        for k in range(1, 3):
            fy = cy - S(70) + k * S(22)
            draw.line((x0 + S(14), fy, x1 - S(14), fy), fill=(226, 172, 136), width=max(2, int(S(4))))
        tx = x_out - sx * S(4)
        draw.ellipse((tx - S(16), cy - S(10), tx + S(16), cy + S(26)), fill=(228, 176, 140))
        draw.rounded_rectangle((x0 - S(2), cy + S(40), x1 + S(2), cy + S(76)), radius=S(10), fill=K.CORAL)
    if active:
        for a in (-60, -90, -120):
            ra = math.radians(a)
            draw.line((cx + math.cos(ra) * S(86), cy - S(20) + math.sin(ra) * S(86), cx + math.cos(ra) * S(122),
                       cy - S(20) + math.sin(ra) * S(122)), fill=K.GOLD, width=max(3, int(S(9))))


def snap(draw, cx, cy, s, active=False):
    S = S_(s)
    fold = (228, 176, 140)
    draw.rounded_rectangle((cx - S(52), cy + S(44), cx + S(48), cy + S(80)), radius=S(10), fill=K.BOTH_COLOR)
    draw.rounded_rectangle((cx - S(56), cy - S(36), cx + S(52), cy + S(50)), radius=S(30), fill=K.SKIN)
    for k in range(3):
        fy = cy - S(26) + k * S(24)
        draw.rounded_rectangle((cx + S(24), fy, cx + S(70), fy + S(22)), radius=S(11), fill=fold)
    draw.rounded_rectangle((cx + S(8), cy - S(118), cx + S(38), cy - S(28)), radius=S(15), fill=K.SKIN)
    draw.line((cx + S(14), cy - S(96), cx + S(32), cy - S(96)), fill=fold, width=max(2, int(S(4))))
    if active:
        draw.rounded_rectangle((cx - S(30), cy - S(96), cx + S(2), cy - S(26)), radius=S(16), fill=K.SKIN)
        draw.rounded_rectangle((cx - S(66), cy - S(46), cx - S(20), cy - S(14)), radius=S(16), fill=fold)
        for a in (-150, -120, -90):
            ra = math.radians(a)
            ox, oy = cx - S(30), cy - S(60)
            draw.line((ox + math.cos(ra) * S(50), oy + math.sin(ra) * S(50), ox + math.cos(ra) * S(84),
                       oy + math.sin(ra) * S(84)), fill=K.GOLD, width=max(3, int(S(8))))
    else:
        draw.rounded_rectangle((cx - S(30), cy - S(96), cx + S(2), cy - S(26)), radius=S(16), fill=K.SKIN)
        draw.rounded_rectangle((cx - S(70), cy - S(90), cx - S(38), cy - S(30)), radius=S(16), fill=fold)


def tower(draw, cx, base, n, cube, col, soft):
    """n cubes stacked two-wide (pairs) from y=base upwards; an odd cube sits alone on top."""
    rows = (n + 1) // 2
    for k in range(n):
        r_, c_ = divmod(k, 2)
        x0 = cx - cube - 2 + c_ * (cube + 4)
        y1 = base - r_ * (cube + 4)
        draw.rounded_rectangle((x0 + 4, y1 - cube + 5, x0 + cube + 4, y1 + 5), radius=8, fill=K.SHADOW)
        draw.rounded_rectangle((x0, y1 - cube, x0 + cube, y1), radius=8, fill=col)
        draw.rounded_rectangle((x0 + 6, y1 - cube + 6, x0 + cube - 6, y1 - cube + 14), radius=4, fill=soft)
    return base - rows * (cube + 4)


def basket(draw, cx, by, s, col, label):
    S = S_(s)
    draw.polygon([(cx - S(260) + S(8), by - S(150) + S(10)), (cx + S(260) + S(8), by - S(150) + S(10)),
                  (cx + S(210) + S(8), by + S(10)), (cx - S(210) + S(8), by + S(10))], fill=K.SHADOW)
    draw.polygon([(cx - S(260), by - S(150)), (cx + S(260), by - S(150)), (cx + S(210), by), (cx - S(210), by)],
                 fill=WOOD, outline=WOOD_DARK)
    for k in range(1, 3):
        yy = by - S(150) + k * S(50)
        draw.line((cx - S(260) + k * S(17), yy, cx + S(260) - k * S(17), yy), fill=WOOD_DARK, width=max(2, int(S(5))))
    K.pill(draw, cx, by - S(110), label, col, size=max(26, int(S(44))))


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
    gold_soft = (255, 246, 214)
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

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def num_ball(x, y, r, n, fill, fg=(255, 255, 255), outline=None):
        draw.ellipse((x - r + 4, y - r + 6, x + r + 4, y + r + 6), fill=K.SHADOW)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=fill, outline=outline, width=4 if outline else 0)
        size = int(r * (1.0 if n < 10 else 0.86))
        K.text_at(draw, str(n), x, y - size * 0.62, font(size, bold=True), fg)

    def parity_col(n):
        return sage if n % 2 == 0 else coral

    def numline(x_of, y, nmin, nmax, r, col_fn, extra_end=0):
        x_a, x_b = x_of(nmin) - r - 30, x_of(nmax) + r + 30 + extra_end
        draw.line((x_a, y, x_b, y), fill=K.DEV_MID, width=8)
        draw.polygon([(x_b + 26, y), (x_b, y - 16), (x_b, y + 16)], fill=K.DEV_MID)
        for n in range(nmin, nmax + 1):
            col = col_fn(n)
            if col is None:
                num_ball(x_of(n), y, r, n, panel, fg=ink, outline=K.DEV_MID)
            else:
                num_ball(x_of(n), y, r, n, col)

    def hop(x_of, y, a, b, r, col, dashed=False):
        p0 = (x_of(a), y - r - 6)
        p2 = (x_of(b), y - r - 6)
        p1 = ((p0[0] + p2[0]) / 2, y - r - 150)
        K.draw_curve(draw, p0, p1, p2, col, width=6, dashed=dashed, phase=progress * 80)

    def frog_on(x_of, y, r, seq, f, s=0.62):
        i = min(len(seq) - 2, int(f)) if len(seq) > 1 else 0
        k = f - i if len(seq) > 1 else 0
        k = K.clamp01(k)
        if len(seq) == 1:
            x, jump = x_of(seq[0]), 0
        else:
            x = K.lerp(x_of(seq[i]), x_of(seq[i + 1]), K.ease_in_out(k))
            jump = 120 * math.sin(k * math.pi)
        frog(draw, x, y - r + 4 - jump, s, t)

    def card_pair(title_l, title_r, col_l, col_r, soft_l, soft_r, y0=260, y1=800):
        for k, (title, col, soft) in enumerate(((title_l, col_l, soft_l), (title_r, col_r, soft_r))):
            x0 = 150 if k == 0 else 1010
            draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 760 + 10, y1 + 12), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 760, y1), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, title, x0 + 380, y0 + 32, font(48, bold=True), col)

    # ---- opening -----------------------------------------------------------------
    if visual == "c2-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            riya(draw, cx + 300, 430, 1.3, t)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(cx - 580, 320), (cx + 580, 320), (cx - 660, 540), (cx + 660, 540)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · COUNTING THE COMPUTER WAY", cx, 300 + lift, font(32, bold=True), sage)
            bits = (1, 0, 1)
            xs = [cx - 300, cx, cx + 300]
            for i, x in enumerate(xs):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                bulb(draw, x, 560 + int((1 - a) * 20), 70, bool(bits[i]), t + i)
                value_tag(draw, x, 364, [4, 2, 1][i], PLACE_COLS[i])
            n = int(K.clamp01((progress - 0.35) * 2.2) * 7.99)
            items = [(xs[0], "4", ink), ((xs[0] + xs[1]) / 2, "+", muted), (xs[1], "0", ink),
                     ((xs[1] + xs[2]) / 2, "+", muted), (xs[2], "1", ink), (xs[2] + 150, "=", muted),
                     (xs[2] + 270, "5", coral)]
            for x, txt, col in items[:n]:
                K.text_at(draw, txt, x, 700, font(80, bold=True), col)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "NUMBERS COMPUTERS LOVE · CHAPTER 2", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Odd, Even, and Patterns", cx, 362 + lift, font(84, bold=True), ink)
            for i in range(8):
                a = K.stagger(progress, i + 1, step=0.06, speed=5)
                if a <= 0:
                    continue
                num_ball(cx + (i - 3.5) * 170, 690 + int((1 - a) * 30), 56, i + 1, parity_col(i + 1))
            return True
        # promise
        specs = [("Share", coral_soft), ("Hop", sage_soft), ("Clap", lav_soft)]
        for i, (lab, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 520
            y = 520 + int((1 - a) * 40)
            draw.ellipse((x - 200, y - 200, x + 200, y + 200), fill=soft)
            if i == 0:
                for k in range(2):
                    px = x + (k * 2 - 1) * 90
                    plate(draw, px, y + 60, 80)
                    laddoo(draw, px - 32, y + 30, 30)
                    laddoo(draw, px + 32, y + 30, 30)
            elif i == 1:
                draw.line((x - 170, y + 110, x + 170, y + 110), fill=K.DEV_MID, width=6)
                for k in range(4):
                    num_ball(x - 135 + k * 90, y + 110, 28, k + 1, parity_col(k + 1))
                K.draw_curve(draw, (x - 135, y + 76), (x - 90, y - 30), (x - 45, y + 76), sage, width=5)
                frog(draw, x - 45, y + 80, 0.8, t)
            else:
                clap(draw, x - 70, y + 10, 0.9, active=int(t * 8) % 2 == 0)
                snap(draw, x + 90, y + 20, 0.9, active=int(t * 8) % 2 == 1)
            K.text_at(draw, lab, x, y + 220, font(52, bold=True), ink)
        return True

    # ---- Riya's laddoos ----------------------------------------------------------------
    if visual == "c2-hook":
        if focus == "meet":
            draw.ellipse((520 - 280, 540 - 280, 520 + 280, 540 + 280), fill=lav_soft)
            riya(draw, 520, 470, 1.6, t)
            K.text_at(draw, "Meet", 1300, 260 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Riya!", 1300, 330 + lift, font(130, bold=True), RIYA)
            K.pill(draw, 1300, 500, "2 laddoos on every plate", coral, size=36)
            draw.polygon([(1100, 700), (1500, 700), (1560, 650), (1040, 650)], fill=BOX_DARK)
            for k in range(6):
                laddoo(draw, 1110 + k * 72, 690 - (k % 2) * 14, 32)
            draw.rounded_rectangle((1080 + 10, 700 + 12, 1520 + 10, 850 + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((1080, 700, 1520, 850), radius=24, fill=BOX)
            draw.rectangle((1080, 740, 1520, 768), fill=K.GOLD)
            K.text_at(draw, "Nani's laddoos", 1300, 784, font(34, bold=True), (255, 255, 255))
            star_spots([(960, 330), (1680, 330)])
            return True
        if focus in ("eight", "seven"):
            n = 8 if focus == "eight" else 7
            pxs = [cx + (i - 1.5) * 390 for i in range(4)]
            for i in range(n // 2):
                plate(draw, pxs[i], 610, 150)
            landed = 0
            for j in range(n):
                a = K.ease_in_out(K.clamp01((progress - 0.05 - j * 0.06) * 4))
                sx, sy = 330 + j * 180, 330
                slot = j // 2
                tx = pxs[slot] + ((j % 2) * 2 - 1) * 52 if j < n - n % 2 else pxs[slot]
                ty = 570
                x = K.lerp(sx, tx, a)
                y = K.lerp(sy, ty, a) - 90 * math.sin(a * math.pi)
                alone = n % 2 == 1 and j == n - 1 and a >= 1
                if alone:
                    rr = 80
                    for d in range(14):
                        a0 = d * 360 / 14 + progress * 60
                        draw.arc((tx - rr, ty - rr, tx + rr, ty + rr), a0, a0 + 15, fill=coral, width=6)
                laddoo(draw, x, y, 44, sad=alone)
                if a >= 1:
                    landed = j + 1
            for i in range(n // 2):
                if landed >= (i + 1) * 2:
                    K.text_at(draw, str((i + 1) * 2), pxs[i], 680, font(60, bold=True), coral)
            if n % 2 and landed == n:
                K.text_at(draw, "1 left over!", pxs[3], 680, font(44, bold=True), coral)
            if landed == n:
                if n == 8:
                    K.pill(draw, cx, 780, "4 pairs, nothing left over!", sage, size=38)
                else:
                    K.pill(draw, cx, 780, "3 pairs, and 1 left over", coral, size=38)
            return True
        if focus == "ask":
            riya(draw, 300, 500, 1.2, t)
            question_marks([(470, 300), (150, 330)], size=70)
            for k, n in enumerate((8, 7)):
                y = 420 + k * 230
                num_ball(780, y, 60, n, parity_col(n))
                pairs_display(draw, n, 30, y, left=880, phase=progress)
            K.draw_stopwatch(draw, 1680, 650, 50, progress, brand)
            return True
        # answer
        card_pair("Pairs, nothing left", "One left over", sage, coral, sage_soft, coral_soft)
        pairs_display(draw, 8, 28, 500, cx=530)
        pairs_display(draw, 7, 28, 500, cx=1390, phase=progress)
        for k in range(2):
            x = 530 if k == 0 else 1390
            col = sage if k == 0 else coral
            K.pill(draw, x, 640, "Name: ? ? ?", col, size=40)
        return True

    # ---- definition -------------------------------------------------------------------
    if visual == "c2-define":
        if focus in ("even", "odd"):
            even = focus == "even"
            n = 8 if even else 7
            col = sage if even else coral
            K.shadow_card(draw, (150, 250 + lift, 1770, 850 + lift), brand, radius=40, outline=col, outline_w=6)
            K.text_at(draw, "EVEN number" if even else "ODD number", cx, 280 + lift, font(96, bold=True), col)
            n_show = int(K.clamp01(progress * 1.6) * n + 0.5)
            pairs_display(draw, n, 42, 540 + lift, cx=cx, n_show=n_show, phase=progress)
            if progress > 0.35:
                sub = "Every laddoo has a partner" if even else "One laddoo has no partner"
                K.text_at(draw, sub, cx, 650 + lift, font(48, bold=True), ink)
            if progress > 0.6:
                K.pill(draw, cx, 740 + lift, "8 is even" if even else "7 is odd", col, size=40)
            return True
        # every
        card_pair("EVEN", "ODD", sage, coral, sage_soft, coral_soft, y0=280, y1=720)
        for k in range(5):
            num_ball(150 + 380 + (k - 2) * 130, 470, 54, 2 + k * 2, sage)
            num_ball(1010 + 380 + (k - 2) * 130, 470, 54, 1 + k * 2, coral)
        K.text_at(draw, "pairs, nothing left", 530, 600, font(42, bold=True), ink)
        K.text_at(draw, "one left over", 1390, 600, font(42, bold=True), ink)
        draw.ellipse((cx - 62, 470 - 62, cx + 62, 470 + 62), fill=K.GOLD)
        K.text_at(draw, "OR", cx, 470 - 28, font(46, bold=True), ink)
        a = K.ease_out_cubic(K.clamp01((progress - 0.4) * 3))
        if a > 0:
            K.pill(draw, cx, 790 + int((1 - a) * 20), "Never both!", K.BOTH_COLOR, size=40)
        return True

    # ---- the pairs test -----------------------------------------------------------------
    if visual == "c2-pairs":
        if focus == "intro":
            K.pill(draw, cx, 232, "The pairs test", K.BOTH_COLOR, size=34)
            draw.rounded_rectangle((150, 330, 750, 800), radius=40, fill=(246, 241, 233), outline=line, width=3)
            for k, (x, y) in enumerate(((290, 450), (450, 520), (620, 430), (330, 660), (520, 690), (650, 610))):
                laddoo(draw, x, y + 8 * math.sin(t * 6 + k), 46)
            K.draw_arrow(draw, 790, 565, 960, 565, coral, width=14, head=40)
            K.shadow_card(draw, (1000, 330, 1770, 800), brand, radius=40)
            steps = [("1", "Make pairs", sage), ("2", "Anything left?", coral)]
            for i, (num, lab, col) in enumerate(steps):
                a = K.stagger(progress, i, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 400 + i * 200 + int((1 - a) * 20)
                draw.ellipse((1050, y, 1140, y + 90), fill=col)
                K.text_at(draw, num, 1095, y + 14, font(56, bold=True), (255, 255, 255))
                draw.text((1170, y + 18), lab, fill=ink, font=font(52, bold=True))
                if i == 0:
                    pairs_display(draw, 2, 22, y + 140, left=1180)
                else:
                    pairs_display(draw, 1, 22, y + 140, left=1180, phase=progress)
            return True
        n = {"six": 6, "nine": 9, "eleven": 11}[focus]
        p, rem = divmod(n, 2)
        col = parity_col(n)
        K.shadow_card(draw, (150, 280, 560, 800), brand, radius=40, accent=col)
        K.text_at(draw, str(n), 355, 360, font(220, bold=True), col)
        K.text_at(draw, "laddoos", 355, 640, font(44, bold=True), muted)
        n_show = int(K.clamp01(progress * 2.0) * n + 0.5)
        pairs_display(draw, n, 36, 470, cx=1180, n_show=n_show, phase=progress)
        if progress > 0.45:
            txt = f"{p} pairs, nothing left" if rem == 0 else f"{p} pairs + 1 left over"
            K.text_at(draw, txt, 1180, 600, font(54, bold=True), ink)
        if progress > 0.6:
            K.pill(draw, 1180, 710, "EVEN" if rem == 0 else "ODD", col, size=52)
        return True

    # ---- last digit trick -------------------------------------------------------------------
    if visual == "c2-digit":
        if focus == "intro":
            K.text_at(draw, "38 laddoos?!", 470, 250, font(56, bold=True), ink)
            rows = [10, 9, 8, 7, 4]
            k = 0
            for r_, c in enumerate(rows):
                for j in range(c):
                    x = 470 + (j - (c - 1) / 2) * 62
                    y = 790 - r_ * 56
                    laddoo(draw, x, y + 3 * math.sin(t * 8 + k), 28)
                    k += 1
            K.text_at(draw, "Too many to pair!", 470, 360, font(40, bold=True), muted)
            a = K.ease_out_cubic(K.clamp01((progress - 0.3) * 3))
            if a > 0:
                f = font(280, bold=True)
                K.text_at(draw, "3", 1160, 300, f, ink)
                rr = 160 + 8 * pulse
                draw.ellipse((1430 - rr, 476 - rr, 1430 + rr, 476 + rr), outline=K.GOLD, width=10)
                K.text_at(draw, "8", 1430, 300, f, sage)
                K.text_at(draw, "Look at the LAST digit", 1320, 720, font(50, bold=True), coral)
            return True
        if focus in ("even", "odd"):
            for k, (digs, lab, col, soft) in enumerate((((0, 2, 4, 6, 8), "EVEN", sage, sage_soft),
                                                       ((1, 3, 5, 7, 9), "ODD", coral, coral_soft))):
                if k == 1 and focus == "even":
                    continue
                dim = focus == "odd" and k == 0
                y0 = 280 + k * 290
                K.pill(draw, 280, y0 + 50, lab, muted if dim else col, size=52)
                for j, d in enumerate(digs):
                    a = 1.0 if dim else K.stagger(progress, j, step=0.08, speed=5)
                    if a <= 0:
                        continue
                    x = 640 + j * 240
                    yy = y0 + int((1 - a) * 30)
                    draw.rounded_rectangle((x - 90 + 8, yy + 10, x + 90 + 8, yy + 190 + 10), radius=32,
                                           fill=K.SHADOW)
                    draw.rounded_rectangle((x - 90, yy, x + 90, yy + 190), radius=32, fill=panel if dim else soft,
                                           outline=line if dim else col, width=5)
                    K.text_at(draw, str(d), x, yy + 28, font(120, bold=True), muted if dim else col)
            K.text_at(draw, "…as the last digit", 1100, 820 if focus == "odd" else 530, font(40, bold=True), muted)
            return True
        if focus == "try":
            for k, (tens, ones, col, soft, lab) in enumerate(((3, 8, sage, sage_soft, "EVEN"),
                                                              (2, 5, coral, coral_soft, "ODD"))):
                a = K.stagger(progress, k, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 150 if k == 0 else 1010
                y0 = 260 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 760 + 10, y0 + 560 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 760, y0 + 560), radius=40, fill=soft, outline=col, width=5)
                f = font(200, bold=True)
                K.text_at(draw, str(tens), x0 + 290, y0 + 40, f, ink)
                rr = 112
                ox, oy = x0 + 470, y0 + 180
                draw.ellipse((ox - rr, oy - rr, ox + rr, oy + rr), fill=panel, outline=col, width=8)
                K.text_at(draw, str(ones), ox, y0 + 40, f, col)
                K.text_at(draw, f"ends in {ones}", x0 + 380, y0 + 340, font(46, bold=True), ink)
                K.pill(draw, x0 + 380, y0 + 420, lab, col, size=48)
            return True
        # why
        f = font(96, bold=True)
        for x, txt, col in ((400, "38", ink), (580, "=", muted), (800, "30", K.BOTH_COLOR), (1030, "+", muted),
                            (1220, "8", sage)):
            K.text_at(draw, txt, x, 240, f, col)
        for g, (gx, npairs, cols) in enumerate(((800, 15, 5), (1220, 4, 2))):
            a = K.stagger(progress, g, step=0.25, speed=3)
            if a <= 0:
                continue
            for k in range(int(npairs * a + 0.5)):
                r_, c_ = divmod(k, cols)
                px = gx + (c_ - (cols - 1) / 2) * 78
                py = 420 + r_ * 62
                draw.rounded_rectangle((px - 32, py - 22, px + 32, py + 22), radius=22, fill=sage_soft, outline=sage,
                                       width=3)
                for j in (-1, 1):
                    draw.ellipse((px + j * 15 - 12, py - 12, px + j * 15 + 12, py + 12), fill=LADDOO)
            K.text_at(draw, f"{npairs} pairs", gx, 640, font(46, bold=True), ink)
        if progress > 0.6:
            K.pill(draw, 1000, 730, "38 = 19 pairs → EVEN", sage, size=40)
        riya(draw, 1620, 470, 1.0, t)
        K.draw_heart(draw, 1740, 340 + bounce, 26, coral)
        return True

    # ---- number line 1 to 20 -------------------------------------------------------------------
    if visual == "c2-line":
        if focus in ("intro", "turns"):
            def x_of(n):
                return 175 + (n - 1) * 82

            def col_fn(n):
                if focus == "turns":
                    return parity_col(n)
                return parity_col(n) if K.stagger(progress, n - 1, step=0.035, speed=6) > 0.5 else None
            numline(x_of, 540, 1, 20, 34, col_fn)
            if focus == "intro":
                K.pill(draw, cx - 170, 300, "odd", coral, size=40)
                K.pill(draw, cx + 170, 300, "even", sage, size=40)
            else:
                cur = int(t * 26) % 20 + 1
                draw.ellipse((x_of(cur) - 48, 540 - 48, x_of(cur) + 48, 540 + 48), outline=K.GOLD, width=6)
                for n in range(1, 21):
                    lab = "odd" if n % 2 else "even"
                    K.text_at(draw, lab, x_of(n), 446 if n % 2 else 410, font(28, bold=True), parity_col(n))
                    fx, fy = x_of(n), 640 + (0 if n % 2 else 40)
                    draw.ellipse((fx - 26, fy - 26, fx + 26, fy + 26), fill=parity_col(n))
                    K.text_at(draw, "L" if n % 2 else "R", fx, fy - 18, font(30, bold=True), (255, 255, 255))
                K.text_at(draw, "Left, right, left, right…", cx, 770, font(44, bold=True), ink)
            return True

        def x_of(n):
            return 262 + (n - 1) * 155
        ans = focus == "answer"

        def col_fn(n):
            if not ans:
                return None
            return coral if n % 2 else (150, 210, 200)
        numline(x_of, 520, 1, 10, 54, col_fn)
        if ans:
            for k, n in enumerate((1, 3, 5, 7, 9)):
                a = K.stagger(progress, k, step=0.1, speed=5)
                if a <= 0:
                    continue
                y = 400 - int(a * 10)
                draw.ellipse((x_of(n) - 30, y - 30, x_of(n) + 30, y + 30), fill=K.GOLD)
                K.text_at(draw, str(k + 1), x_of(n), y - 22, font(36, bold=True), ink)
            if progress > 0.5:
                K.pill(draw, cx - 230, 680, "5 odd numbers", coral, size=40)
                K.pill(draw, cx + 230, 680, "5 even too", sage, size=40)
        else:
            K.pill(draw, cx - 60, 300, "How many odd numbers?", coral, size=38)
            K.draw_stopwatch(draw, cx + 330, 336, 40, progress, brand)
            question_marks([(cx - 300, 640), (cx + 300, 640)], size=80)
        return True

    # ---- Tinku skips ----------------------------------------------------------------------------
    if visual == "c2-skip":
        def x_of(n):
            return 150 + (n - 1) * 80
        ly, lr = 660, 30
        if focus == "intro":
            draw.ellipse((620 - 210, 420 - 210, 620 + 210, 420 + 210), fill=sage_soft)
            frog(draw, 620, 520, 1.7, t)
            K.pill(draw, 620, 236, "Tinku", sage, size=40)
            riya(draw, 1300, 380, 1.05, t)
            K.text_at(draw, "Riya's pet frog", 1300, 560, font(40, bold=True), muted)
            numline(x_of, ly + 80, 1, 20, 28, lambda n: None)
            for a, b in ((1, 3), (3, 5), (5, 7)):
                hop(x_of, ly + 80, a, b, 28, sage, dashed=True)
            return True
        if focus in ("evens", "odds"):
            seq = [2, 4, 6, 8, 10] if focus == "evens" else [1, 3, 5, 7, 9]
            col = sage if focus == "evens" else coral
            f = K.clamp01(progress * 1.3) * (len(seq) - 1)
            reached = int(f + 0.001)
            numline(x_of, ly, 1, 20, lr, lambda n: col if n in seq[:reached + 1] else None)
            for i in range(reached):
                hop(x_of, ly, seq[i], seq[i + 1], lr, col)
            frog_on(x_of, ly, lr, seq, f)
            K.pill(draw, cx, 250, ("Start at 2: evens!" if focus == "evens" else "Start at 1: odds!"), col, size=38)
            labels = ", ".join(str(n) for n in seq[:reached + 1])
            K.text_at(draw, labels, cx, 760, font(56, bold=True), col)
            return True
        if focus == "ask":
            numline(x_of, ly, 1, 20, lr, lambda n: coral if n in (1, 3, 5) else None)
            for a, b in ((1, 3), (3, 5)):
                hop(x_of, ly, a, b, lr, coral)
            hop(x_of, ly, 5, 7, lr, coral, dashed=True)
            frog_on(x_of, ly, lr, [1], 0)
            rr = 46 + 6 * pulse
            draw.ellipse((x_of(20) - rr, ly - rr, x_of(20) + rr, ly + rr), outline=K.GOLD, width=8)
            question_marks([(x_of(20), ly - 190)], size=90)
            K.pill(draw, cx - 60, 250, "Will Tinku land on 20?", coral, size=38)
            K.draw_stopwatch(draw, cx + 300, 286, 38, progress, brand)
            return True
        # answer
        seq = list(range(1, 22, 2))
        f = K.clamp01(progress * 1.15) * (len(seq) - 1)
        reached = int(f + 0.001)
        numline(x_of, ly, 1, 20, lr, lambda n: coral if n in seq[:reached + 1] else None, extra_end=60)
        num_ball(x_of(21), ly, lr, 21, coral if reached >= 10 else panel, fg=(255, 255, 255) if reached >= 10 else ink,
                 outline=None if reached >= 10 else K.DEV_MID)
        for i in range(reached):
            hop(x_of, ly, seq[i], seq[i + 1], lr, coral)
        frog_on(x_of, ly, lr, seq, f)
        K.draw_cross(draw, x_of(20), ly + 74, 26, K.DANGER)
        K.pill(draw, cx, 250, "20 is even, so Tinku never lands on it!", K.DANGER, size=36)
        K.text_at(draw, "1, 3, 5, … 17, 19, 21", cx, 790, font(50, bold=True), coral)
        return True

    # ---- number patterns ---------------------------------------------------------------------------
    if visual == "c2-next":
        cube = 44
        if focus == "intro":
            vals = [2, 4, 6, 8]
            xs = [cx + (i - 1.5) * 330 for i in range(4)]
            tops = []
            for i, v in enumerate(vals):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    tops.append(None)
                    continue
                tops.append(tower(draw, xs[i], 720, v, cube, sage, sage_soft))
                K.text_at(draw, str(v), xs[i], 740, font(64, bold=True), ink)
            for i in range(3):
                if tops[i + 1] is None:
                    continue
                K.draw_curve(draw, (xs[i] + 40, tops[i] - 20), ((xs[i] + xs[i + 1]) / 2, tops[i + 1] - 110),
                             (xs[i + 1] - 40, tops[i + 1] - 20), coral, width=6)
                K.pill(draw, (xs[i] + xs[i + 1]) / 2, tops[i + 1] - 140, "+2", coral, size=32)
            K.pill(draw, cx, 236, "The rule: add 2", K.BOTH_COLOR, size=36)
            return True
        if focus in ("ask1", "ans1"):
            vals, nxt = [2, 4, 6, 8], 10
            step = 300
        else:
            vals, nxt = [10, 12, 14], 16
            step = 360
        ans = focus in ("ans1", "ans2")
        slots = vals + [nxt]
        xs = [cx + (i - (len(slots) - 1) / 2) * step for i in range(len(slots))]
        for i, v in enumerate(slots):
            last = i == len(slots) - 1
            if last and not ans:
                draw.rounded_rectangle((xs[i] - 110, 380, xs[i] + 110, 720), radius=30, fill=coral_soft)
                dashed_box((xs[i] - 110, 380, xs[i] + 110, 720), coral)
                K.text_at(draw, "?", xs[i], 470, font(int(130 + 20 * pulse), bold=True), coral)
                continue
            tower(draw, xs[i], 720, v, cube, coral if last else sage, coral_soft if last else sage_soft)
            K.text_at(draw, str(v), xs[i], 740, font(64, bold=True), coral if last else ink)
            if last:
                K.draw_check(draw, xs[i] + 90, 740 + 34, 26, sage)
        if ans:
            K.pill(draw, cx, 236, f"{vals[-1]} + 2 = {nxt}", sage, size=38)
        else:
            K.pill(draw, cx - 40, 236, "What comes next?", coral, size=36)
            K.draw_stopwatch(draw, cx + 240, 272, 34, progress, brand)
        return True

    # ---- clap patterns ------------------------------------------------------------------------------
    if visual == "c2-clap":
        def act_card(x0, y0, cw, ch, kind, active, win=False):
            mx = x0 + cw / 2
            K.shadow_card(draw, (x0, y0, x0 + cw, y0 + ch), brand, radius=28, outline=sage if win else None,
                          outline_w=6 if win else 3)
            if kind == "c":
                clap(draw, mx, y0 + ch * 0.42, 0.9, active=active)
                K.text_at(draw, "CLAP", mx, y0 + ch - 70, font(36, bold=True), coral)
            else:
                snap(draw, mx - 10, y0 + ch * 0.44, 0.95, active=active)
                K.text_at(draw, "SNAP", mx, y0 + ch - 70, font(36, bold=True), K.BOTH_COLOR)
            if win:
                K.draw_check(draw, x0 + cw - 30, y0 + 30, 22, sage)

        if focus == "intro":
            cw, gap = 300, 50
            x_start = cx - (4 * cw + 3 * gap) / 2
            cur = int(t * 8) % 4
            for i, kind in enumerate("cscs"):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                act_card(x_start + i * (cw + gap), 320 + int((1 - a) * 30), cw, 340, kind, i == cur)
            K.pill(draw, cx, 236, "A pattern repeats by a rule", K.BOTH_COLOR, size=36)
            K.draw_notes(draw, 160, 760, 0.8, t, coral)
            K.draw_notes(draw, 1760, 760, 0.8, t + 0.3, K.BOTH_COLOR)
            return True
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            cw, gap = 240, 28
            x_start = cx - (6 * cw + 5 * gap) / 2
            cur = int(t * 10) % 6 if ans else -1
            for i, kind in enumerate("cscscs"):
                x0 = x_start + i * (cw + gap)
                if i == 5 and not ans:
                    draw.rounded_rectangle((x0, 320, x0 + cw, 660), radius=28, fill=coral_soft)
                    dashed_box((x0, 320, x0 + cw, 660), coral)
                    K.text_at(draw, "?", x0 + cw / 2, 400, font(int(130 + 20 * pulse), bold=True), coral)
                    continue
                act_card(x0, 320, cw, 340, kind, i == cur, win=ans and i == 5)
            if ans:
                for k in range(3):
                    bx0 = x_start + k * 2 * (cw + gap) + 10
                    bx1 = bx0 + 2 * cw + gap - 20
                    draw.line((bx0, 680, bx0, 700, bx1, 700, bx1, 680), fill=[coral, sage, K.BOTH_COLOR][k], width=6)
                K.pill(draw, cx, 236, "Snap! Clap and snap take turns", sage, size=34)
                K.text_at(draw, "clap, snap · clap, snap · clap, snap", cx, 730, font(38, bold=True), muted)
            else:
                K.pill(draw, cx - 40, 236, "What comes next?", coral, size=34)
                K.draw_stopwatch(draw, cx + 230, 270, 32, progress, brand)
            return True
        if focus == "even":
            c = min(8, int(progress * 10))
            for i in range(8):
                n = i + 1
                x = cx + (i - 3.5) * 200
                said = n <= c
                fill = (sage if n % 2 == 0 else coral) if said else panel
                num_ball(x, 620, 62, n, fill, fg=(255, 255, 255) if said else ink, outline=None if said else line)
                if n % 2 == 0 and said:
                    clap(draw, x, 420, 0.8, active=n == c)
                elif n == c:
                    K.draw_arrow(draw, x, 470, x, 540, muted, width=8, head=22)
            K.pill(draw, cx, 236, "Clap on even numbers only", sage, size=36)
            K.text_at(draw, "2, 4, 6, 8: clap!", cx, 740, font(50, bold=True), sage)
            return True
        # code
        draw.ellipse((620 - 300, 540 - 300, 620 + 300, 540 + 300), fill=lav_soft)
        K.draw_device(draw, "laptop", 620, 560, 1.3, brand, t=t)
        fcode = font(38, bold=True)
        draw.text((460, 448), "repeat 4 times:", fill=K.BOT, font=fcode)
        draw.text((500, 504), "clap", fill=coral, font=fcode)
        draw.text((500, 560), "snap", fill=K.BOTH_COLOR, font=fcode)
        lx, ly, lr = 1340, 520, 190
        draw.arc((lx - lr, ly - lr, lx + lr, ly + lr), 300 + progress * 120, 240 + 360 + progress * 120, fill=sage,
                 width=18)
        ea = math.radians(240 + 360 + progress * 120)
        hx, hy = lx + math.cos(ea) * lr, ly + math.sin(ea) * lr
        ta = ea + math.pi / 2
        draw.polygon([(hx + math.cos(ta) * 40, hy + math.sin(ta) * 40),
                      (hx + math.cos(ea) * 30, hy + math.sin(ea) * 30),
                      (hx - math.cos(ea) * 30, hy - math.sin(ea) * 30)], fill=sage)
        clap(draw, lx - 70, ly + 10, 0.75, active=int(t * 8) % 2 == 0)
        snap(draw, lx + 80, ly + 20, 0.75, active=int(t * 8) % 2 == 1)
        K.text_at(draw, "Code loves patterns!", lx, 750, font(48, bold=True), ink)
        return True

    # ---- sorting ---------------------------------------------------------------------------------
    if visual == "c2-sort":
        nums = [7, 12, 15, 20, 3, 18]
        ans = focus == "answer"
        basket(draw, 560, 850, 1.0, sage, "EVEN")
        basket(draw, 1360, 850, 1.0, coral, "ODD")
        ev = [n for n in nums if n % 2 == 0]
        od = [n for n in nums if n % 2 == 1]
        for i, n in enumerate(nums):
            sx, sy = 360 + i * 240, 400 + 12 * math.sin(t * 6 + i)
            if ans:
                a = K.ease_in_out(K.clamp01((progress - 0.05 - i * 0.07) * 3))
                grp = ev if n % 2 == 0 else od
                bx = (560 if n % 2 == 0 else 1360) + (grp.index(n) - 1) * 150
                x = K.lerp(sx, bx, a)
                y = K.lerp(sy, 640, a) - 80 * math.sin(a * math.pi)
                num_ball(x, y, 66, n, parity_col(n) if a > 0.5 else panel,
                         fg=(255, 255, 255) if a > 0.5 else ink, outline=None if a > 0.5 else K.DEV_MID)
            else:
                num_ball(sx, sy, 72, n, panel, fg=ink, outline=K.DEV_MID)
        if not ans:
            K.draw_stopwatch(draw, cx, 760, 46, progress, brand)
            K.pill(draw, cx, 236, "Look at the last digit!", K.BOTH_COLOR, size=34)
        elif progress > 0.6:
            K.draw_check(draw, 560 + 230, 620, 26, sage)
            K.draw_check(draw, 1360 + 230, 620, 26, sage)
            K.pill(draw, cx, 236, "Brilliant sorting!", sage, size=34)
        return True

    # ---- checkpoint ----------------------------------------------------------------------------------
    if visual == "c2-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Odd or even?", cx, 450 + lift, font(68, bold=True), ink)
            num_ball(cx - 120, 640 + lift, 56, 14, panel, fg=ink, outline=K.DEV_MID)
            K.text_at(draw, "?", cx + 100, 590 + lift, font(90, bold=True), K.GOLD)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 236 + 12, 1260 + 10, 866 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 236, 1260, 866), radius=24, fill=PAPER)
        K.text_at(draw, "Is 14 odd or even?", 695, 258, font(52, bold=True), coral)
        K.text_at(draw, "How do you know?", 695, 326, font(40, bold=True), muted)
        if ans:
            n_show = int(K.clamp01(progress * 2.2) * 14 + 0.5)
            pairs_display(draw, 14, 22, 470, cx=695, n_show=n_show)
            if progress > 0.35:
                K.text_at(draw, "7 pairs, nothing left over", 695, 530, font(44, bold=True), ink)
            if progress > 0.55:
                f = font(120, bold=True)
                K.text_at(draw, "1", 360, 640, f, ink)
                draw.ellipse((480 - 74, 712 - 74, 480 + 74, 712 + 74), outline=sage, width=8)
                K.text_at(draw, "4", 480, 640, f, sage)
                K.text_at(draw, "ends in 4", 700, 690, font(44, bold=True), ink)
                K.pill(draw, 1010, 676, "EVEN", sage, size=52)
        else:
            for k in range(14):
                laddoo(draw, 695 + (k - 6.5) * 58, 470, 24)
            for i in range(3):
                draw.line((180, 620 + i * 80, 1210, 620 + i * 80), fill=(220, 210, 232), width=3)
        riya(draw, 1540, 500, 1.3, t)
        if ans:
            K.draw_heart(draw, 1720, 350 + bounce, 30, coral)
            star_spots([(1370, 330), (1730, 700)])
        else:
            question_marks([(1720, 320)], size=80)
            K.draw_stopwatch(draw, 1540, 790, 44, progress, brand)
        return True

    # ---- recap ------------------------------------------------------------------------------------
    if visual == "c2-recap":
        recap = [(("Even = pairs,", "none left over"), sage, "even"), (("Odd = one", "left over"), coral, "odd"),
                 (("Ends in 0 2 4 6 8", "→ even"), K.BOTH_COLOR, "digit"),
                 (("Patterns repeat", "by a rule"), K.ROAD, "pattern")]
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
                if kind == "even":
                    pairs_display(draw, 4, 26, iy - 20, cx=ix)
                    num_ball(ix, iy + 100, 40, 4, sage)
                elif kind == "odd":
                    pairs_display(draw, 3, 26, iy - 20, cx=ix, phase=progress)
                    num_ball(ix, iy + 100, 40, 3, coral)
                elif kind == "digit":
                    for k, d in enumerate((0, 2, 4, 6, 8)):
                        tx = ix + ((k - 1) * 100 if k < 3 else (k - 3.5) * 100)
                        ty = iy - 110 if k < 3 else iy
                        draw.rounded_rectangle((tx - 40, ty, tx + 40, ty + 90), radius=18, fill=sage_soft,
                                               outline=sage, width=4)
                        K.text_at(draw, str(d), tx, ty + 14, font(56, bold=True), sage)
                else:
                    clap(draw, ix - 80, iy - 20, 0.6, active=int(t * 8) % 2 == 0)
                    snap(draw, ix + 80, iy - 10, 0.6, active=int(t * 8) % 2 == 1)
                    K.pill(draw, ix, iy + 70, "+2", coral, size=34)
                label_f = font(36, bold=True)
                for j, ln in enumerate(lab):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 48, label_f, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            riya(draw, cx + 300, 410, 1.2, t)
            frog(draw, cx + 470, 560, 0.7, t)
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Odd & even expert", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 690, 640)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
