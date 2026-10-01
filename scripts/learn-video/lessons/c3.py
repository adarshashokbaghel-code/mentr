"""C3 · Place Value Power-Up — visuals."""
import math

import build as K

LADDOO = (255, 172, 44)
LADDOO_DARK = (224, 128, 24)
LADDOO_DOT = (255, 222, 140)
BOX = (226, 70, 96)
BOX_DARK = (176, 44, 70)
STICK = (236, 198, 136)
STICK_DARK = (186, 140, 80)
BAND = (220, 48, 72)
PENCIL = (255, 200, 40)
PENCIL_DARK = (214, 150, 16)
ERASER = (240, 130, 150)
WOOD = (236, 200, 150)
WOOD_DARK = (184, 140, 92)
LEAD = (60, 60, 70)
PAPER = (255, 251, 238)
HUND = K.BOTH_COLOR
TENS = K.ROAD
ONES = (13, 148, 136)
PLACE = {"H": ("Hundreds", HUND), "T": ("Tens", TENS), "O": ("Ones", ONES)}


def S_(s):
    return lambda v: v * s


def ctext(draw, text, cx, cy, size, col, bold=True):
    f = K.load_font(int(size), bold=bold)
    b = draw.textbbox((0, 0), text, font=f)
    draw.text((cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2), text, font=f, fill=col)


def hair_flower(draw, cx, cy, r, col):
    for k in range(5):
        a = k * math.tau / 5
        px, py = cx + math.cos(a) * r * 0.6, cy + math.sin(a) * r * 0.6
        draw.ellipse((px - r * 0.5, py - r * 0.5, px + r * 0.5, py + r * 0.5), fill=col)
    draw.ellipse((cx - r * 0.35, cy - r * 0.35, cx + r * 0.35, cy + r * 0.35), fill=K.GOLD)


def kid(draw, cx, cy, s, body, t=0.0, bun=True, flower=True):
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
    if bun and flower:
        hair_flower(draw, cx + r * 0.75, cy - r * 0.8, r * 0.32, (238, 104, 158))


def uncle(draw, cx, cy, s, t=0.0):
    S = S_(s)
    K.draw_person(draw, cx, cy, s, "dad", t)
    yy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.polygon([(cx - S(60), yy - S(52)), (cx + S(60), yy - S(52)), (cx + S(46), yy - S(92)),
                  (cx - S(46), yy - S(92))], fill=(250, 250, 250), outline=(200, 200, 205))
    draw.line((cx - S(60), yy - S(52), cx + S(60), yy - S(52)), fill=(200, 200, 205), width=max(2, int(S(4))))


def laddoo(draw, cx, cy, r):
    draw.ellipse((cx - r + r * 0.12, cy - r + r * 0.18, cx + r + r * 0.12, cy + r + r * 0.18), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LADDOO_DARK)
    draw.ellipse((cx - r * 0.92, cy - r * 0.96, cx + r * 0.82, cy + r * 0.74), fill=LADDOO)
    for dx, dy in ((-0.4, -0.2), (0.2, -0.45), (0.35, 0.15), (-0.1, 0.35), (-0.45, 0.32), (0.05, -0.05)):
        rr = r * 0.09
        draw.ellipse((cx + dx * r - rr, cy + dy * r - rr, cx + dx * r + rr, cy + dy * r + rr), fill=LADDOO_DOT)
    draw.ellipse((cx - r * 0.55, cy - r * 0.66, cx - r * 0.22, cy - r * 0.42), fill=(255, 236, 190))


def laddoo_box(draw, cx, cy, s, label="10"):
    """Open sweet box of 10. cy = centre of front panel; spans ±120s wide, cy-80s .. cy+60s."""
    S = S_(s)
    draw.rounded_rectangle((cx - S(120) + S(8), cy - S(80) + S(10), cx + S(120) + S(8), cy + S(60) + S(10)),
                           radius=S(12), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(120), cy - S(80), cx + S(120), cy + S(60)), radius=S(12), fill=BOX_DARK)
    for row in range(2):
        for i in range(5):
            laddoo(draw, cx + (i - 2) * S(44) + (S(10) if row else 0), cy - S(56) + row * S(18), S(21))
    draw.rounded_rectangle((cx - S(120), cy - S(36), cx + S(120), cy + S(60)), radius=S(12), fill=BOX)
    draw.line((cx - S(120), cy - S(20), cx + S(120), cy - S(20)), fill=K.GOLD, width=max(2, int(S(6))))
    if label:
        ctext(draw, label, cx, cy + S(20), max(26, S(48)), (255, 255, 255))


def stick(draw, x, cy, s, h=100):
    S = S_(s)
    draw.line((x, cy - S(h), x, cy + S(h)), fill=STICK_DARK, width=max(3, int(S(17))))
    for yy in (cy - S(h), cy + S(h)):
        draw.ellipse((x - S(8.5), yy - S(8.5), x + S(8.5), yy + S(8.5)), fill=STICK_DARK)
    draw.line((x, cy - S(h) + S(2), x, cy + S(h) - S(2)), fill=STICK, width=max(2, int(S(11))))


def bundle(draw, cx, cy, s, h=100):
    """10 sticks tied with a band; ≈ ±75s wide, ±(h+9)s tall."""
    S = S_(s)
    for i in range(10):
        stick(draw, cx + (i - 4.5) * S(15), cy, s, h)
    draw.rounded_rectangle((cx - S(82), cy - S(13), cx + S(82), cy + S(13)), radius=S(10), fill=BAND)


def pencil(draw, x, cy, s, h=95):
    S = S_(s)
    w2 = S(10)
    top, bot = cy - S(h), cy + S(h)
    draw.rectangle((x - w2, top + S(34), x + w2, bot - S(16)), fill=PENCIL, outline=PENCIL_DARK)
    draw.polygon([(x - w2, top + S(34)), (x + w2, top + S(34)), (x, top)], fill=WOOD)
    draw.polygon([(x - S(4), top + S(12)), (x + S(4), top + S(12)), (x, top)], fill=LEAD)
    draw.rectangle((x - w2, bot - S(16), x + w2, bot), fill=ERASER)
    draw.rectangle((x - w2, bot - S(24), x + w2, bot - S(15)), fill=K.STEEL)


def pencil_bundle(draw, cx, cy, s):
    S = S_(s)
    for i in range(10):
        pencil(draw, cx + (i - 4.5) * S(21), cy, s)
    draw.rounded_rectangle((cx - S(110), cy - S(12), cx + S(110), cy + S(14)), radius=S(10), fill=BAND)


def unit(draw, x, y, u, col):
    draw.rectangle((x, y, x + u, y + u), fill=col, outline=(255, 255, 255), width=max(1, int(u * 0.1)))


def rod(draw, x, y, u, col=TENS):
    draw.rectangle((x + u * 0.25, y + u * 0.3, x + u * 1.25, y + 10.3 * u), fill=K.SHADOW)
    for k in range(10):
        unit(draw, x, y + k * u, u, col)


def flat(draw, x, y, u, col=HUND):
    draw.rectangle((x + u * 0.5, y + u * 0.5, x + 10.5 * u, y + 10.5 * u), fill=K.SHADOW)
    for r in range(10):
        for c in range(10):
            unit(draw, x + c * u, y + r * u, u, col)


def units_grid(draw, x, y, u, n, cols=2, col=ONES, gap=4):
    for k in range(n):
        r, c = divmod(k, cols)
        unit(draw, x + c * (u + gap), y + r * (u + gap), u, col)


def house(draw, cx, top, wd, ht, key, digit="", hl=False, dsize=None, label=True, dcol=None, fill=(255, 255, 255)):
    name, col = PLACE[key]
    roof = wd * 0.38
    draw.polygon([(cx - wd / 2 - 18 + 8, top + roof + 10), (cx + 8, top + 10), (cx + wd / 2 + 18 + 8, top + roof + 10)],
                 fill=K.SHADOW)
    draw.rectangle((cx - wd / 2 + 8, top + roof + 10, cx + wd / 2 + 8, top + ht + 10), fill=K.SHADOW)
    draw.rectangle((cx - wd / 2, top + roof - 2, cx + wd / 2, top + ht), fill=fill,
                   outline=K.CORAL if hl else col, width=8 if hl else 5)
    draw.polygon([(cx - wd / 2 - 18, top + roof), (cx, top), (cx + wd / 2 + 18, top + roof)], fill=col)
    if label:
        lsize = max(26, min(34, int(wd * 0.13)))
        tw = draw.textbbox((0, 0), name, font=K.load_font(lsize, bold=True))[2]
        if tw <= (wd + 36) * 0.62:
            ctext(draw, name, cx, top + roof * 0.68, lsize, (255, 255, 255))
        else:
            ctext(draw, name, cx, top + ht + 30, 28, col)
    if digit:
        ds = dsize or int((ht - roof) * 0.62)
        ctext(draw, digit, cx, top + roof + (ht - roof) / 2, ds, dcol or K.hex_rgb("#1C2434"))


def house_row(draw, cx, top, wd, ht, keys, digits, gap=40, **kw):
    n = len(keys)
    xs = [cx + (i - (n - 1) / 2) * (wd + gap) for i in range(n)]
    for x, k, d in zip(xs, keys, digits):
        house(draw, x, top, wd, ht, k, d, **kw)
    return xs


def note(draw, box, title, big, sub=None):
    x0, y0, x1, y1 = box
    draw.rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), fill=K.SHADOW)
    draw.rectangle(box, fill=PAPER, outline=(222, 210, 186), width=3)
    for k in range(1, 6):
        yy = y0 + (y1 - y0) * k / 6
        draw.line((x0 + 20, yy, x1 - 20, yy), fill=(232, 222, 240), width=2)
    draw.ellipse(((x0 + x1) / 2 - 14, y0 - 10, (x0 + x1) / 2 + 14, y0 + 18), fill=K.DANGER)
    ctext(draw, title, (x0 + x1) / 2, y0 + 56, 34, (90, 100, 114))
    ctext(draw, big, (x0 + x1) / 2, (y0 + y1) / 2 + 10, min(120, (y1 - y0) * 0.36), K.hex_rgb("#1C2434"))
    if sub:
        ctext(draw, sub, (x0 + x1) / 2, y1 - 50, 36, K.CORAL)


def bulb(draw, cx, cy, s, on, t=0.0):
    S = S_(s)
    if on:
        g = S(96 + 6 * math.sin(t * 20))
        draw.ellipse((cx - g, cy - g - S(10), cx + g, cy + g - S(10)), fill=(255, 240, 196))
    draw.ellipse((cx - S(58), cy - S(78), cx + S(58), cy + S(38)), fill=K.GOLD if on else (222, 222, 228),
                 outline=(200, 150, 40) if on else K.STEEL_DARK, width=max(2, int(S(5))))
    draw.arc((cx - S(22), cy - S(40), cx + S(22), cy + S(4)), 200, 340, fill=(200, 110, 20) if on else K.STEEL_DARK,
             width=max(2, int(S(5))))
    draw.rectangle((cx - S(28), cy + S(30), cx + S(28), cy + S(74)), fill=K.STEEL)
    for k in range(3):
        yy = cy + S(40) + k * S(12)
        draw.line((cx - S(28), yy, cx + S(28), yy), fill=K.STEEL_DARK, width=max(2, int(S(3))))


def zero_hero(draw, cx, cy, s, t):
    S = S_(s)
    wave = S(14) * math.sin(t * 10)
    draw.polygon([(cx - S(90), cy - S(70)), (cx + S(90), cy - S(70)), (cx + S(170), cy + S(170) + wave),
                  (cx + S(20), cy + S(120)), (cx - S(150), cy + S(180) - wave)], fill=K.DANGER)
    draw.ellipse((cx - S(110) + S(10), cy - S(150) + S(12), cx + S(110) + S(10), cy + S(150) + S(12)), fill=K.SHADOW)
    draw.ellipse((cx - S(110), cy - S(150), cx + S(110), cy + S(150)), fill=K.GOLD)
    draw.ellipse((cx - S(58), cy - S(96), cx + S(58), cy + S(96)), fill=K.hex_rgb("#FFF8EF"))
    draw.rounded_rectangle((cx - S(118), cy - S(78), cx + S(118), cy - S(30)), radius=S(20), fill=K.DEV_DARK)
    for sx in (-1, 1):
        ex = cx + sx * S(70)
        draw.ellipse((ex - S(18), cy - S(68), ex + S(18), cy - S(40)), fill=(255, 255, 255))
        draw.ellipse((ex - S(7), cy - S(60), ex + S(7), cy - S(46)), fill=K.DEV_DEEP)
    draw.arc((cx - S(80), cy + S(70), cx + S(80), cy + S(140)), 200, 340, fill=K.DEV_DARK, width=max(3, int(S(8))))
    K.draw_star(draw, cx, cy + S(96), S(26), K.DANGER, rot=0.0)


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

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            ctext(draw, "?", qx, qy, int(size + 22 * (pulse if k % 2 else 1 - pulse)), K.GOLD)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def dashed_circle(x, y, r, col):
        n = 16
        for k in range(n):
            a0 = k * 360 / n + progress * 60
            draw.arc((x - r, y - r, x + r, y + r), a0, a0 + 360 / n * 0.6, fill=col, width=6)

    def digits_row(text, x, cy, size, cols, gap=None):
        """Draw a number digit by digit, centred on x; returns digit centres."""
        f = font(size, bold=True)
        widths = [draw.textbbox((0, 0), ch, font=f)[2] for ch in text]
        g = gap if gap is not None else size * 0.05
        total = sum(widths) + g * (len(text) - 1)
        xx = x - total / 2
        centres = []
        for ch, wd, col in zip(text, widths, cols):
            ctext(draw, ch, xx + wd / 2, cy, size, col)
            centres.append(xx + wd / 2)
            xx += wd + g
        return centres

    def bundles_and_sticks(nb, ns, cy=420, s=0.9, bx0=360, sx0=1050, step_b=160, step_s=50, stag=True):
        for i in range(nb):
            a = K.stagger(progress, i, step=0.07, speed=5) if stag else 1.0
            if a > 0:
                bundle(draw, bx0 + i * step_b, cy + int((1 - a) * 40), s)
        for j in range(ns):
            a = K.stagger(progress, nb + j, step=0.05, speed=5) if stag else 1.0
            if a > 0:
                stick(draw, sx0 + j * step_s, cy + int((1 - a) * 40), s)

    # ---- opening -----------------------------------------------------------
    if visual == "c3-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 460, 110, sage, panel, bounce)
            kid(draw, cx + 300, 440, 1.3, coral, t)
            K.text_at(draw, "Welcome back, champ!", cx, 720, font(60, bold=True), ink)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (220, 240 + lift, w - 220, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · ODD & EVEN", cx, 300 + lift, font(34, bold=True), sage)
            a = K.stagger(progress, 0, step=0.2, speed=4)
            if a > 0:
                yy = 520 + lift + int((1 - a) * 30)
                for i in range(4):
                    x = 400 + i * 150
                    draw.rounded_rectangle((x - 66, yy - 46, x + 66, yy + 46), radius=40, outline=sage, width=5)
                    for sx in (-1, 1):
                        laddoo(draw, x + sx * 30, yy, 26)
                K.text_at(draw, "8 → 4 pairs", 625, yy + 80, font(44, bold=True), ink)
                K.pill(draw, 625, yy + 150, "EVEN", sage, size=36)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                yy = 520 + lift + int((1 - a) * 30)
                for i in range(3):
                    x = 1100 + i * 150
                    draw.rounded_rectangle((x - 66, yy - 46, x + 66, yy + 46), radius=40, outline=muted, width=4)
                    for sx in (-1, 1):
                        laddoo(draw, x + sx * 30, yy, 26)
                laddoo(draw, 1560, yy, 26)
                dashed_circle(1560, yy, 50, coral)
                K.text_at(draw, "7 → 3 pairs + 1", 1300, yy + 80, font(44, bold=True), ink)
                K.pill(draw, 1300, yy + 150, "ODD", coral, size=36)
            draw.line((cx, 380 + lift, cx, 790 + lift), fill=line, width=4)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Place Value Power-Up", cx, 360 + lift, font(84, bold=True), ink)
            for i, (k, d) in enumerate((("H", "3"), ("T", "5"), ("O", "2"))):
                a = K.stagger(progress, i + 1, step=0.12, speed=5)
                if a <= 0:
                    continue
                house(draw, cx + (i - 1) * 300, 560 + int((1 - a) * 40), 230, 300, k, d)
            star_spots([(cx - 640, 680), (cx + 640, 680)])
            return True
        if focus == "puzzle":
            for k, (txt, x) in enumerate((("23", 560), ("32", 1360))):
                a = K.stagger(progress, k, step=0.18, speed=4)
                if a <= 0:
                    continue
                y0 = 270 + int((1 - a) * 40)
                K.shadow_card(draw, (x - 220, y0, x + 220, y0 + 320), brand, radius=36)
                cols = [coral, sage] if txt == "23" else [sage, coral]
                digits_row(txt, x, y0 + 160, 200, cols)
            ctext(draw, "= ?", cx, 430, int(110 + 14 * pulse), K.BOTH_COLOR)
            kid(draw, cx, 680, 0.85, coral, t)
            question_marks([(cx - 170, 640), (cx + 170, 640)], size=70)
            return True
        # promise
        K.draw_shop(draw, 1260, 570, 1.3, brand, name="SWEETS")
        for k in range(3):
            laddoo(draw, 1092 + k * 60, 657, 27)
        kid(draw, 560, 500, 1.4, coral, t)
        draw.ellipse((420, 790, 700, 840), fill=K.STEEL)
        draw.ellipse((430, 784, 690, 828), fill=(226, 230, 238))
        for k, (dx, dy) in enumerate(((-70, 0), (0, 0), (70, 0), (-35, -36), (35, -36))):
            laddoo(draw, 560 + dx, 790 + dy, 30)
        star_spots([(860, 320), (1660, 300)])
        return True

    # ---- Meera at the sweet shop -------------------------------------------
    if visual == "c3-hook":
        if focus == "note":
            K.draw_person(draw, 400, 470, 1.3, "mom", t)
            kid(draw, 760, 560, 1.0, coral, t)
            K.text_at(draw, "Mum", 400, 690, font(38, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "Meera", 760, 720, font(38, bold=True), coral)
            a = K.stagger(progress, 1, step=0.12, speed=4)
            if a > 0:
                y0 = 260 + int((1 - a) * 40)
                note(draw, (1080, y0, 1640, y0 + 520), "Sweet shop list", "23", "laddoos")
                K.draw_arrow(draw, 900, 520, 1040, 500, muted, width=8, head=24)
            for k in range(3):
                laddoo(draw, 1760, 420 + k * 120, 34)
            return True
        if focus == "shop":
            uncle(draw, 360, 470, 1.2, t)
            K.pill(draw, 360, 240, "Ramu uncle", K.ROAD, size=32)
            draw.rounded_rectangle((150 + 10, 640 + 12, 1420 + 10, 770 + 12), radius=18, fill=K.SHADOW)
            draw.rounded_rectangle((150, 640, 1420, 770), radius=18, fill=WOOD, outline=WOOD_DARK, width=5)
            draw.line((150, 672, 1420, 672), fill=WOOD_DARK, width=4)
            for i in range(3):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = K.lerp(520, 640 + i * 230, a)
                laddoo_box(draw, x, 592, 0.8)
            for j in range(2):
                a = K.stagger(progress, 3 + j, step=0.1, speed=4)
                if a <= 0:
                    continue
                laddoo(draw, K.lerp(560, 1250 + j * 80, a), 612, 28)
            kid(draw, 1660, 560, 1.0, coral, t)
            draw.rectangle((1540 + 6, 270 + 8, 1780 + 6, 420 + 8), fill=K.SHADOW)
            draw.rectangle((1540, 270, 1780, 420), fill=PAPER, outline=(222, 210, 186), width=3)
            ctext(draw, "23", 1660, 345, 84, ink)
            if progress > 0.5:
                K.pill(draw, 820, 790, "3 boxes of ten + 2 loose", coral, size=36)
            return True
        if focus == "home":
            labels = ["10", "20", "30", "31", "32"]
            xs = [330, 600, 870, 1060, 1160]
            for i in range(5):
                a = K.stagger(progress, i, step=0.1, speed=4)
                if i < 3:
                    laddoo_box(draw, xs[i], 600, 0.95)
                else:
                    laddoo(draw, xs[i], 620, 34)
                if a > 0:
                    K.pill(draw, xs[i], 390 + int((1 - a) * 20), labels[i], K.ROAD if i < 3 else ONES, size=36)
            a = K.stagger(progress, 5, step=0.1, speed=4)
            if a > 0:
                ctext(draw, "32!", 1530, 420, int(150 * (0.7 + 0.3 * a) + 8 * pulse), K.DANGER)
                K.text_at(draw, "Too many!", 1530, 520, font(48, bold=True), K.DANGER)
                note(draw, (1400, 610, 1660, 840), "Note said", "23")
            return True
        if focus == "why":
            note(draw, (180, 300, 600, 720), "Mum's note", "23", "laddoos")
            kid(draw, 820, 540, 0.95, coral, t)
            question_marks([(700, 400), (950, 380)], size=74)
            K.text_at(draw, "Uncle gave", 1420, 270, font(40, bold=True), muted)
            for i in range(3):
                laddoo_box(draw, 1180 + i * 230, 470, 0.8)
            for j in range(2):
                laddoo(draw, 1330 + j * 160, 640, 34)
            K.draw_stopwatch(draw, 820, 800, 44, progress, brand)
            return True
        # because
        specs = [("23", "2 tens + 3 ones", "= 20 + 3", 2, 3, sage, sage_soft, 150),
                 ("32", "3 tens + 2 ones", "= 30 + 2", 3, 2, coral, coral_soft, 990)]
        for k, (num, lab, sub, nb, nl, col, soft, x0) in enumerate(specs):
            a = K.stagger(progress, k, step=0.25, speed=4)
            if a <= 0:
                continue
            y0 = 250 + int((1 - a) * 40)
            draw.rounded_rectangle((x0 + 10, y0 + 12, x0 + 780 + 10, y0 + 600 + 12), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 780, y0 + 600), radius=40, fill=soft, outline=col, width=5)
            digits_row(num, x0 + 390, y0 + 80, 110, [TENS, ONES])
            bw = 190
            for i in range(nb):
                laddoo_box(draw, x0 + 110 + i * bw, y0 + 300, 0.72)
            for j in range(nl):
                laddoo(draw, x0 + 110 + nb * bw - 40 + j * 72, y0 + 330, 28)
            K.text_at(draw, lab, x0 + 390, y0 + 420, font(46, bold=True), ink)
            K.text_at(draw, sub, x0 + 390, y0 + 500, font(40, bold=True), col)
        return True

    # ---- definitions -------------------------------------------------------
    if visual == "c3-define":
        if focus == "digit":
            K.text_at(draw, "DIGITS", cx, 240 + lift, font(84, bold=True), coral)
            K.text_at(draw, "the ten symbols we use to write numbers", cx, 350 + lift, font(40, bold=True), muted)
            cols = [coral, sage, K.ROAD, K.BOTH_COLOR, K.GOLD]
            for i in range(10):
                a = K.stagger(progress, i, step=0.04, speed=6)
                if a <= 0:
                    continue
                x0 = 143 + i * 166
                y0 = 460 + int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 140 + 8, y0 + 180 + 10), radius=24, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 140, y0 + 180), radius=24, fill=panel, outline=cols[i % 5], width=6)
                ctext(draw, str(i), x0 + 70, y0 + 90, 110, cols[i % 5])
            if progress > 0.5:
                K.text_at(draw, "Every number is built from these!", cx, 720, font(46, bold=True), ink)
            return True
        if focus == "place":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 480 + lift), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "PLACE VALUE", cx, 296 + lift, font(36, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "What a digit is worth,", cx, 350 + lift, font(52, bold=True), ink)
            K.text_at(draw, "because of WHERE it sits", cx, 412 + lift, font(52, bold=True), coral)
            a = K.stagger(progress, 1, step=0.2, speed=4)
            if a > 0:
                yy = 530 + int((1 - a) * 30)
                house_row(draw, 520, yy, 190, 230, "TO", ["", "5"], gap=30)
                K.text_at(draw, "worth 5", 520, 790, font(44, bold=True), ONES)
            a = K.stagger(progress, 2, step=0.2, speed=4)
            if a > 0:
                yy = 530 + int((1 - a) * 30)
                house_row(draw, 1400, yy, 190, 230, "TO", ["5", "0"], gap=30)
                K.text_at(draw, "worth 50!", 1400, 790, font(44, bold=True), TENS)
                K.draw_arrow(draw, 800, 660, 1100, 660, muted, width=10, head=30)
            return True
        if focus == "houses":
            specs = [("O", cx + 390, "1"), ("T", cx, "10"), ("H", cx - 390, "100")]
            for i, (k, x, val) in enumerate(specs):
                a = K.stagger(progress, i, step=0.18, speed=4)
                if a <= 0:
                    continue
                top = 330 + int((1 - a) * 40)
                house(draw, x, top, 310, 420, k)
                body_cy = top + 310 * 0.38 + (420 - 310 * 0.38) / 2
                if k == "O":
                    unit(draw, x - 24, body_cy - 24, 48, ONES)
                elif k == "T":
                    rod(draw, x - 12, body_cy - 120, 24, TENS)
                else:
                    flat(draw, x - 110, body_cy - 110, 22, HUND)
                K.text_at(draw, val, x, 770, font(44, bold=True), PLACE[k][1])
            if progress < 0.5 or True:
                K.pill(draw, cx + 390, 240, "Start here!", coral, size=32)
            return True
        # rightmost
        xs = house_row(draw, cx + 200, 300, 300, 400, "TO", ["5", "8"], gap=80, dsize=170)
        rr = 8 + 6 * pulse
        draw.rectangle((xs[1] - 150 - rr, 300 + 114 - rr, xs[1] + 150 + rr, 700 + rr), outline=coral, width=6)
        K.text_at(draw, "5 tens = 50", xs[0], 730, font(44, bold=True), TENS)
        K.text_at(draw, "8 ones", xs[1], 730, font(44, bold=True), ONES)
        digits_row("58", 360, 470, 180, [ink, coral])
        K.text_at(draw, "far right", 360, 600, font(40, bold=True), coral)
        K.text_at(draw, "= ones place", 360, 656, font(40, bold=True), muted)
        return True

    # ---- bundles of ten ----------------------------------------------------
    if visual == "c3-bundles":
        if focus == "tie":
            a = K.ease_in_out(K.clamp01((progress - 0.1) * 2.0))
            for i in range(10):
                x0 = 500 + i * 102
                x1 = cx + (i - 4.5) * 15 * 1.4
                stick(draw, K.lerp(x0, x1, a), 520, 1.4)
                if a < 0.4:
                    ctext(draw, str(i + 1), x0, 330, 36, muted)
            if a >= 1:
                draw.rounded_rectangle((cx - 82 * 1.4, 520 - 18, cx + 82 * 1.4, 520 + 18), radius=14, fill=BAND)
                ctext(draw, "= 1 ten", cx + 380, 520, 80, TENS)
                K.pill(draw, cx, 760, "10 sticks make 1 bundle", K.ROAD, size=38)
            else:
                K.text_at(draw, "10 loose sticks", cx, 760, font(44, bold=True), muted)
            return True
        if focus in ("build", "meaning"):
            bundles_and_sticks(4, 7, stag=focus == "build")
            K.text_at(draw, "4 tens", 600, 540, font(40, bold=True), TENS)
            K.text_at(draw, "7 ones", 1200, 540, font(40, bold=True), ONES)
            if focus == "build":
                a = K.stagger(progress, 11, step=0.05, speed=4)
                if a > 0:
                    house_row(draw, cx - 160, 610 + int((1 - a) * 20), 200, 250, "TO", ["4", "7"], gap=40)
                    ctext(draw, "= 47", cx + 320, 750, 110, ink)
            else:
                K.pill(draw, 600, 610, "4 tens = 40", TENS, size=40)
                K.pill(draw, 1200, 610, "7 ones = 7", ONES, size=40)
                a = K.stagger(progress, 1, step=0.25, speed=4)
                if a > 0:
                    ctext(draw, "40 + 7 = 47", cx, 780 + int((1 - a) * 20), 96, ink)
            return True
        ans = focus == "answer"
        bundles_and_sticks(4, 2, stag=False)
        K.text_at(draw, "4 tens", 600, 540, font(40, bold=True), TENS)
        K.text_at(draw, "2 ones", 1075, 540, font(40, bold=True), ONES)
        if ans:
            ctext(draw, "40 + 2 = 42", cx, 700, 110, sage)
            K.draw_check(draw, cx + 420, 700, 40, sage)
            star_spots([(300, 720), (1620, 720), (1500, 380)])
        else:
            ctext(draw, "4 tens + 2 ones = ", cx - 60, 700, 80, ink)
            ctext(draw, "?", cx + 400, 700, int(110 + 16 * pulse), coral)
            K.draw_stopwatch(draw, 1560, 420, 70, progress, brand)
        return True

    # ---- swapping digits ---------------------------------------------------
    if visual == "c3-swap":
        hx = [cx - 220, cx + 220]
        top, wd, ht = 280, 290, 400
        dig_cy = top + wd * 0.38 + (ht - wd * 0.38) / 2

        def tile(x, y, d, col):
            draw.rounded_rectangle((x - 90 + 8, y - 110 + 10, x + 90 + 8, y + 110 + 10), radius=26, fill=K.SHADOW)
            draw.rounded_rectangle((x - 90, y - 110, x + 90, y + 110), radius=26, fill=panel, outline=col, width=7)
            ctext(draw, d, x, y, 160, col)

        def blocks(x0, y0, nt, no, label):
            for k in range(nt):
                rod(draw, x0 + k * 26, y0, 18)
            units_grid(draw, x0 + nt * 26 + 14, y0, 18, no, cols=2)
            K.text_at(draw, label, x0 + (nt * 26 + 60) / 2, y0 + 200, font(30, bold=True), muted)

        if focus == "swap":
            house(draw, hx[0], top, wd, ht, "T")
            house(draw, hx[1], top, wd, ht, "O")
            a = K.ease_in_out(K.clamp01((progress - 0.15) * 2.2))
            tile(K.lerp(hx[0], hx[1], a), dig_cy - math.sin(a * math.pi) * 170, "4", coral)
            tile(K.lerp(hx[1], hx[0], a), dig_cy + math.sin(a * math.pi) * 60, "7", K.BOTH_COLOR)
            ctext(draw, "47", 250, 300, 72, ink)
            blocks(140, 360, 4, 7, "4 tens, 7 ones")
            if a >= 1:
                ctext(draw, "74", 1660, 300, 72, coral)
                blocks(1500, 360, 7, 4, "7 tens, 4 ones")
                K.pill(draw, cx, 730, "74 is much bigger!", coral, size=40)
            return True
        if focus == "ask":
            house(draw, hx[0], top, wd, ht, "T")
            house(draw, hx[1], top, wd, ht, "O")
            tile(hx[0], dig_cy, "6", coral)
            tile(hx[1], dig_cy, "1", K.BOTH_COLOR)
            K.draw_curve(draw, (hx[0], top + ht + 20), (cx, top + ht + 150), (hx[1], top + ht + 20), muted, width=7,
                         dashed=True, phase=progress * 100)
            K.draw_arrow(draw, hx[1] - 30, top + ht + 60, hx[1], top + ht + 20, muted, width=7, head=24)
            K.draw_arrow(draw, hx[0] + 30, top + ht + 60, hx[0], top + ht + 20, muted, width=7, head=24)
            ctext(draw, "61 → ?", 330, 500, int(80 + 8 * pulse), ink)
            K.draw_stopwatch(draw, 1600, 500, 70, progress, brand)
            return True
        house(draw, hx[0], top, wd, ht, "T")
        house(draw, hx[1], top, wd, ht, "O")
        tile(hx[0], dig_cy, "1", K.BOTH_COLOR)
        tile(hx[1], dig_cy, "6", coral)
        K.draw_check(draw, hx[1] + 170, top + 60, 34, sage)
        K.pill(draw, cx, 720, "1 ten + 6 ones = 10 + 6 = 16", sage, size=40)
        ctext(draw, "16", 1660, 300, 72, sage)
        blocks(1550, 360, 1, 6, "1 ten, 6 ones")
        return True

    # ---- hundreds -----------------------------------------------------------
    if visual == "c3-hundreds":
        if focus == "flat":
            for k in range(10):
                a = K.stagger(progress, k, step=0.04, speed=6)
                if a <= 0:
                    continue
                rod(draw, 300 + k * 30, 330 + int((1 - a) * 30), 24)
            K.text_at(draw, "10 tens", 447, 620, font(42, bold=True), TENS)
            a = K.stagger(progress, 11, step=0.04, speed=4)
            if a > 0:
                K.draw_arrow(draw, 680, 450, 880, 450, muted, width=12, head=36)
                flat(draw, 960, 330 + int((1 - a) * 30), 24)
                K.text_at(draw, "1 hundred", 1080, 620, font(42, bold=True), HUND)
                ctext(draw, "= 100", 1500, 450, 120, HUND)
                K.pill(draw, cx, 730, "Ten tens make one hundred", K.BOTH_COLOR, size=38)
            return True
        if focus == "build":
            specs = [("3 hundreds", HUND, 400), ("5 tens", TENS, 900), ("2 ones", ONES, 1050)]
            for k in range(3):
                a = K.stagger(progress, k, step=0.08, speed=5)
                if a > 0:
                    flat(draw, 170 + k * 210, 290 + int((1 - a) * 30), 18)
            for k in range(5):
                a = K.stagger(progress, 3 + k, step=0.06, speed=5)
                if a > 0:
                    rod(draw, 830 + k * 30, 290 + int((1 - a) * 30), 18)
            for k in range(2):
                a = K.stagger(progress, 8 + k, step=0.05, speed=5)
                if a > 0:
                    unit(draw, 1030, 290 + k * 26 + int((1 - a) * 30), 18, ONES)
            for lab, col, x in specs:
                K.text_at(draw, lab, x, 500, font(36, bold=True), col)
            a = K.stagger(progress, 10, step=0.05, speed=4)
            if a > 0:
                house_row(draw, 1540, 300 + int((1 - a) * 20), 150, 230, "HTO", ["3", "5", "2"], gap=30)
                digits_row("352", cx, 690, 140, [HUND, TENS, ONES], gap=10)
            return True
        # five
        dim = (196, 190, 180)
        cs = digits_row("352", cx, 330, 170, [dim, TENS, dim], gap=70)
        dashed_circle(cs[1], 334, 92 + 4 * pulse, coral)
        for k in range(5):
            rod(draw, cx - 90 + k * 36, 470, 24)
        K.text_at(draw, "5 tens", cx, 730, font(40, bold=True), TENS)
        a = K.stagger(progress, 1, step=0.2, speed=4)
        if a > 0:
            ctext(draw, "5", 440, 560, 150, muted)
            K.draw_cross(draw, 530, 470, 34, K.DANGER)
            K.text_at(draw, "Not 5", 440, 670, font(44, bold=True), K.DANGER)
        a = K.stagger(progress, 2, step=0.2, speed=4)
        if a > 0:
            ctext(draw, "50", 1480, 560, 150, sage)
            K.draw_check(draw, 1630, 470, 34, sage)
            K.text_at(draw, "5 tens = 50", 1480, 670, font(44, bold=True), sage)
        return True

    # ---- expanded form -----------------------------------------------------
    if visual == "c3-expand":
        if focus == "name":
            K.pill(draw, cx, 230, "Expanded form", K.BOTH_COLOR, size=36)
            xs = [cx - 340, cx, cx + 340]
            for x, d, col in zip(xs, "352", (HUND, TENS, ONES)):
                ctext(draw, d, x, 400, 150, col)
            parts = ["300", "50", "2"]
            for i, (x, p, col) in enumerate(zip(xs, parts, (HUND, TENS, ONES))):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                K.draw_arrow(draw, x, 490, x, 490 + 80 * a, col, width=8, head=24)
                draw.rounded_rectangle((x - 130, 590, x + 130, 720), radius=30, fill=panel, outline=col, width=6)
                ctext(draw, p, x, 655, 90, col)
                if i > 0:
                    ctext(draw, "+", x - 170, 655, 80, muted)
            if progress > 0.6:
                K.text_at(draw, "352 = 300 + 50 + 2", cx, 770, font(56, bold=True), ink)
            return True
        ans = focus == "answer"
        if ans:
            ctext(draw, "300 + 40 + 7 = 347", cx, 270, 80, ink)
        else:
            ctext(draw, "300 + 40 + 7 = ", cx - 40, 270, 80, ink)
            ctext(draw, "?", cx + 330, 270, int(96 + 14 * pulse), coral)
        for k in range(3):
            flat(draw, 170 + k * 190, 400, 16)
        for k in range(4):
            rod(draw, 770 + k * 28, 400, 16)
        units_grid(draw, 900, 400, 16, 7, cols=2, gap=6)
        K.text_at(draw, "3 hundreds", 335, 600, font(34, bold=True), HUND)
        K.text_at(draw, "4 tens", 812, 600, font(34, bold=True), TENS)
        K.text_at(draw, "7 ones", 930, 650, font(34, bold=True), ONES)
        digs = ["3", "4", "7"] if ans else ["?", "?", "?"]
        house_row(draw, 1490, 380, 150, 250, "HTO", digs, gap=30,
                  dcol=None if ans else coral)
        if ans:
            K.draw_check(draw, 1490, 690, 34, sage)
            star_spots([(1180, 760), (1800, 760)])
        else:
            K.draw_stopwatch(draw, 1490, 760, 44, progress, brand)
        return True

    # ---- zero holds the place ----------------------------------------------
    if visual == "c3-zero":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            K.text_at(draw, "How many tens in 90?", 560, 240, font(54, bold=True), ink)
            for k in range(9):
                rod(draw, 300 + k * 34, 380, 22)
                if ans:
                    a = K.stagger(progress, k, step=0.05, speed=6)
                    if a > 0:
                        ctext(draw, str(k + 1), 311 + k * 34, 350, 28, TENS)
            house_row(draw, 1300, 320, 230, 330, "TO", ["9", "0"], gap=50, dsize=150)
            if ans:
                K.text_at(draw, "9 tens", 1160, 680, font(40, bold=True), TENS)
                K.text_at(draw, "no ones!", 1440, 680, font(40, bold=True), ONES)
                K.pill(draw, cx, 760, "90 = 9 tens + 0 ones", sage, size=40)
            else:
                question_marks([(450, 720), (680, 720)], size=80)
                K.draw_stopwatch(draw, 1720, 760, 44, progress, brand)
            return True
        # hero
        zero_hero(draw, 450, 520, 1.1, t)
        K.text_at(draw, "Zero holds", 450, 730, font(44, bold=True), ink)
        K.text_at(draw, "the place!", 450, 784, font(44, bold=True), coral)
        house_row(draw, 1150, 270, 150, 220, "TO", ["9", "0"], gap=30, dsize=110)
        ctext(draw, "= 90", 1530, 400, 90, sage)
        K.draw_check(draw, 1720, 400, 30, sage)
        a = K.stagger(progress, 1, step=0.25, speed=4)
        if a > 0:
            y = 560 + int((1 - a) * 20)
            house(draw, 1060, y, 150, 220, "T", fill=(246, 241, 233))
            house(draw, 1240, y, 150, 220, "O", "9", dsize=110)
            ctext(draw, "= 9", 1530, y + 130, 90, K.DANGER)
            K.draw_cross(draw, 1690, y + 130, 30, K.DANGER)
            K.text_at(draw, "no zero", 1060, y + 100, font(30, bold=True), muted)
        return True

    # ---- Aarav's pencils ---------------------------------------------------
    if visual == "c3-pencils":
        if focus == "ask":
            kid(draw, 260, 470, 1.0, K.ROAD, t, bun=False)
            K.text_at(draw, "Aarav", 260, 640, font(38, bold=True), K.ROAD)
            for i in range(2):
                pencil_bundle(draw, 600 + i * 260, 480, 0.9)
            for j in range(7):
                pencil(draw, 1040 + j * 42, 480, 0.9)
            K.text_at(draw, "2 tens", 730, 600, font(38, bold=True), TENS)
            K.text_at(draw, "7 ones", 1166, 600, font(38, bold=True), ONES)
            kid(draw, 1700, 470, 1.0, coral, t)
            K.text_at(draw, "Meera", 1700, 640, font(38, bold=True), coral)
            gx = K.lerp(1560, 1500, K.ease_in_out(K.clamp01(progress * 2)))
            pencil_bundle(draw, gx, 300, 0.6)
            K.pill(draw, gx, 380, "+1 ten", coral, size=32)
            ctext(draw, "27 + 1 ten = ", cx - 60, 740, 76, ink)
            ctext(draw, "?", cx + 270, 740, int(96 + 14 * pulse), coral)
            return True
        kid(draw, 260, 470, 1.0, K.ROAD, t, bun=False)
        K.text_at(draw, "Aarav", 260, 640, font(38, bold=True), K.ROAD)
        for i in range(3):
            pencil_bundle(draw, 540 + i * 250, 480, 0.9)
        for j in range(7):
            pencil(draw, 1300 + j * 42, 480, 0.9)
        K.text_at(draw, "3 tens", 790, 600, font(38, bold=True), TENS)
        K.text_at(draw, "7 ones", 1426, 600, font(38, bold=True), ONES)
        K.draw_heart(draw, 380, 330 + bounce, 30, coral)
        a = K.stagger(progress, 1, step=0.3, speed=4)
        if a > 0:
            ctext(draw, "27 + 10 = 37", cx, 720 + int((1 - a) * 20), 96, sage)
            K.draw_check(draw, cx + 410, 720, 36, sage)
            K.text_at(draw, "3 tens + 7 ones", cx, 790, font(40, bold=True), muted)
        return True

    # ---- binary vs base ten ------------------------------------------------
    if visual == "c3-binary":
        xs = [560, 860, 1160]
        if focus in ("remember", "lights"):
            draw.line((xs[0] - 160, 300, xs[2] + 160, 300), fill=K.DEV_MID, width=6)
            ons = [True, True, True] if focus == "remember" else [True, False, False]
            if focus == "remember":
                cyc = int(t * 9) % 3
                ons = [i == cyc or progress > 0.6 for i in range(3)]
            for i, x in enumerate(xs):
                draw.line((x, 300, x, 370), fill=K.DEV_MID, width=6)
                bulb(draw, x, 460, 1.15, ons[i], t)
                K.pill(draw, x, 580, ("4", "2", "1")[i], K.BOTH_COLOR, size=40)
            if focus == "remember":
                K.pill(draw, 1560, 300, "Chapter 1", sage, size=34)
                kid(draw, 1560, 560, 0.9, coral, t)
                K.text_at(draw, "Lights worth 4 · 2 · 1", 860, 720, font(48, bold=True), ink)
            else:
                for i, x in enumerate(xs):
                    ctext(draw, "1" if i == 0 else "0", x, 740, 100, coral if i == 0 else muted)
                ctext(draw, "= 4", 1530, 470, 120, coral)
                K.text_at(draw, "in binary", 1530, 560, font(40, bold=True), muted)
            return True
        if focus == "ours":
            house_row(draw, 860, 300, 230, 330, "HTO", ["1", "0", "0"], gap=70, dsize=150)
            ctext(draw, "= 100", 1560, 400, 110, HUND)
            flat(draw, 1495, 500, 13)
            K.text_at(draw, "one hundred!", 1560, 670, font(40, bold=True), HUND)
            K.text_at(draw, "Same 1 0 0 · different places", 860, 730, font(44, bold=True), muted)
            return True
        rows = [("Our numbers", ["100", "10", "1"], "×10", HUND, 280), ("Binary", ["4", "2", "1"], "×2", coral, 510)]
        for k, (lab, vals, mul, col, y0) in enumerate(rows):
            a = K.stagger(progress, k, step=0.2, speed=4)
            if a <= 0:
                continue
            yy = y0 + int((1 - a) * 30)
            K.text_at(draw, lab, 340, yy + 60, font(46, bold=True), col)
            for i, v in enumerate(vals):
                x = 820 + i * 360
                draw.rounded_rectangle((x - 110 + 8, yy + 10, x + 110 + 8, yy + 170 + 10), radius=28, fill=K.SHADOW)
                draw.rounded_rectangle((x - 110, yy, x + 110, yy + 170), radius=28, fill=panel, outline=col, width=6)
                ctext(draw, v, x, yy + 85, 80, ink)
                if i < 2:
                    K.draw_arrow(draw, x + 300, yy + 85, x + 140, yy + 85, col, width=8, head=24)
                    ctext(draw, mul, x + 180, yy + 40, 34, col)
        if progress > 0.5:
            K.pill(draw, cx, 760, "Position matters!", sage, size=42)
        return True

    # ---- checkpoint --------------------------------------------------------
    if visual == "c3-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 290 + lift, w - 460, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Place value detective!", cx, 450 + lift, font(64, bold=True), ink)
            house_row(draw, cx, 560 + lift, 150, 190, "TO", ["4", "7"], gap=30, dsize=90)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1260 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1260, 870), radius=24, fill=(255, 250, 238))
        K.text_at(draw, "In 47, what does the 4 stand for?", 695, 256, font(46, bold=True), coral)
        cs = digits_row("47", 420 if ans else 695, 470, 220, [TENS if ans else ink, ink], gap=20)
        if ans:
            for k in range(4):
                bundle(draw, 760 + k * 120, 470, 0.7)
            rows = ["4 tens = 40!", "It sits in the tens place."]
            for i, lab in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a > 0:
                    K.text_at(draw, lab, 695, 640 + i * 90 + int((1 - a) * 10), font(56 if i == 0 else 44, bold=True),
                              sage if i == 0 else ink)
        else:
            dashed_circle(cs[0], 476, 110 + 6 * pulse, coral)
            for i in range(2):
                draw.line((180, 700 + i * 90, 1210, 700 + i * 90), fill=(220, 210, 232), width=3)
        kid(draw, 1540, 520, 1.3, coral, t)
        if ans:
            K.draw_heart(draw, 1700, 380 + bounce, 30, coral)
            star_spots([(1380, 330), (1720, 660)])
        else:
            question_marks([(1700, 360)], size=80)
            K.draw_stopwatch(draw, 1540, 800, 44, progress, brand)
        return True

    # ---- recap -------------------------------------------------------------
    if visual == "c3-recap":
        recap = [(("Hundreds, tens,", "ones"), K.BOTH_COLOR, "houses"), (("The place tells", "the value"), TENS, "value"),
                 (("23 and 32 are", "different"), coral, "swap"), (("Binary cares", "about position"), sage, "binary")]
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
                if kind == "houses":
                    house_row(draw, ix, iy - 120, 92, 170, "HTO", ["3", "5", "2"], gap=16, label=False, dsize=70)
                    for j, k in enumerate("HTO"):
                        K.text_at(draw, k, ix + (j - 1) * 108, iy + 70, font(30, bold=True), PLACE[k][1])
                elif kind == "value":
                    ctext(draw, "5", ix - 100, iy, 110, muted)
                    K.draw_arrow(draw, ix - 40, iy, ix + 30, iy, col, width=8, head=22)
                    ctext(draw, "50", ix + 100, iy, 110, col)
                elif kind == "swap":
                    ctext(draw, "23 ≠ 32", ix, iy - 20, 80, ink)
                    for k in range(2):
                        laddoo_box(draw, ix - 120 + k * 120, iy + 110, 0.45)
                    for k in range(3):
                        laddoo(draw, ix + 90 + k * 34, iy + 116, 15)
                else:
                    for k, on in enumerate((True, False, False)):
                        bulb(draw, ix - 110 + k * 110, iy - 30, 0.6, on, t)
                        ctext(draw, "1" if on else "0", ix - 110 + k * 110, iy + 90, 50, coral if on else muted)
                lines = lab
                for j, ln in enumerate(lines):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font(36, bold=True), ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            kid(draw, cx + 300, 410, 1.2, coral, t)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Place value pro", coral, size=36)
            star_spots([(cx - 600, 320), (cx + 600, 320), (cx - 680, 560), (cx + 680, 560)])
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False
