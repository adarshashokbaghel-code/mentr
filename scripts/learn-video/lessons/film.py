"""Mentr Learn launch film — full-frame scenes, real product facts only."""
import build as K

INK = (28, 36, 52)
CORAL = (255, 106, 26)
CREAM = (246, 244, 240)
WHITE = (255, 255, 255)
TEAL = (13, 148, 136)
MUTED = (138, 146, 156)
BLACK = (11, 13, 18)
LINE = (232, 226, 216)
SOFT = (255, 244, 232)


def fill(draw, w, h, color):
    draw.rectangle((0, 0, w, h), fill=color)


def center(draw, text, y, size, color, w, bold=True):
    K.draw_text_centered(draw, text, y, K.load_font(size, bold), color, w)


def struck(draw, text, y, size, color, w):
    font = K.load_font(size, True)
    box = draw.textbbox((0, 0), text, font=font)
    tw = box[2] - box[0]
    th = box[3] - box[1]
    x = (w - tw) / 2
    draw.text((x, y), text, font=font, fill=color)
    mid = y + th * 0.55
    draw.line((x - 16, mid + 18, x + tw + 16, mid - 18), fill=CORAL, width=8)


def shell(draw, w, h, active: str):
    fill(draw, w, h, CREAM)
    draw.rectangle((0, 0, 250, h), fill=WHITE)
    draw.rectangle((250, 0, 252, h), fill=LINE)
    draw.ellipse((28, 28, 72, 72), fill=CORAL)
    draw.text((86, 32), "Mentr Learn", font=K.load_font(22, True), fill=INK)
    draw.text((86, 58), "Class 3–5", font=K.load_font(16, True), fill=MUTED)
    items = ["Home", "Learn", "Build", "Practice", "Progress", "Me"]
    y = 120
    for name in items:
        on = name == active
        if on:
            draw.rounded_rectangle((16, y, 234, y + 48), radius=14, fill=SOFT)
        color = CORAL if on else (90, 100, 114)
        draw.text((36, y + 12), name, font=K.load_font(20, True), fill=color)
        y += 58


def card(draw, x, y, w, h, fill_c=WHITE):
    draw.rounded_rectangle((x, y, x + w, y + h), radius=22, fill=fill_c, outline=LINE, width=2)


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    t = K.ease_out_cubic(min(1.0, progress * 2.4))
    if not visual.startswith("film-"):
        return False

    if visual == "film-black":
        fill(draw, w, h, BLACK)
        if focus == "changed":
            if t > 0.15:
                center(draw, "Something just changed.", 470, 64, WHITE, w)
        elif focus == "meet":
            center(draw, "Meet Mentr Learn.", 470, 72, WHITE, w)
        return True

    if visual == "film-idea":
        fill(draw, w, h, BLACK)
        center(draw, "Class 3–5", 280, 28, CORAL, w)
        center(draw, "How computers think.", 380, 64, WHITE, w)
        center(draw, "About 15 minutes a day. Narrated.", 500, 36, (186, 190, 198), w)
        if focus == "free":
            center(draw, "What if the whole path was free?", 680, 40, CORAL, w)
        return True

    if visual == "film-problem":
        fill(draw, w, h, (18, 20, 26))
        labels = ["Paid app", "Worksheet", "Another tab", "Another login"]
        for i, lab in enumerate(labels):
            x = 180 + (i % 2) * 820
            y = 260 + (i // 2) * 220
            show = t > i * 0.18
            if not show:
                continue
            card(draw, x, y, 700, 160, (28, 32, 40))
            draw.text((x + 36, y + 52), lab, font=K.load_font(40, True), fill=WHITE)
        if focus == "steps":
            center(draw, "Too many steps.", 860, 42, CORAL, w)
        return True

    if visual == "film-reveal":
        fill(draw, w, h, BLACK)
        center(draw, "Mentr Learn", 340, 84, WHITE, w)
        if focus in ("tracks", "once"):
            center(draw, "CS  ·  AI  ·  Math", 470, 36, CORAL, w)
            center(draw, "60 chapters. One app.", 560, 40, WHITE, w)
        if focus == "once":
            center(draw, "A parent starts it once.", 700, 32, (186, 190, 198), w)
        return True

    if visual == "film-enroll":
        fill(draw, w, h, CREAM)
        card(draw, 510, 180, 900, 700)
        draw.text((560, 230), "Enroll free", font=K.load_font(42, True), fill=INK)
        draw.text((560, 300), "Parent email. No credit card.", font=K.load_font(26, True), fill=MUTED)
        draw.rounded_rectangle((560, 390, 1360, 470), radius=14, fill=WHITE, outline=LINE, width=2)
        draw.text((590, 412), "parent@email.com", font=K.load_font(28, True), fill=INK)
        if focus == "otp":
            draw.rounded_rectangle((560, 510, 1360, 590), radius=14, fill=WHITE, outline=LINE, width=2)
            draw.text((590, 532), "Code from email", font=K.load_font(28, True), fill=INK)
            draw.rounded_rectangle((560, 650, 1360, 740), radius=16, fill=CORAL)
            center_btn = "Open the learning app"
            draw.text((760, 676), center_btn, font=K.load_font(28, True), fill=WHITE)
        else:
            draw.rounded_rectangle((560, 540, 1360, 630), radius=16, fill=CORAL)
            draw.text((860, 566), "Send code", font=K.load_font(28, True), fill=WHITE)
        draw.text((560, 800), "mentr.in/learn", font=K.load_font(24, True), fill=MUTED)
        return True

    if visual == "film-price":
        fill(draw, w, h, BLACK)
        if focus == "list":
            center(draw, "List price", 300, 28, MUTED, w)
            struck(draw, "Rs 999", 420, 120, (120, 126, 136), w)
        else:
            center(draw, "Class 3–5", 280, 28, CORAL, w)
            center(draw, "Rs 0", 400, 140, WHITE, w)
            center(draw, "Free forever", 620, 48, CORAL, w)
        return True

    if visual == "film-home":
        shell(draw, w, h, "Home")
        draw.text((300, 40), "Welcome back", font=K.load_font(22, True), fill=CORAL)
        draw.text((300, 80), "Learning dashboard", font=K.load_font(40, True), fill=INK)
        stats = [("XP", "2"), ("Streak", "2d"), ("Videos", "2"), ("Quizzes", "0")]
        for i, (a, b) in enumerate(stats):
            x = 300 + i * 390
            card(draw, x, 180, 360, 140)
            draw.text((x + 24, 210), b, font=K.load_font(40, True), fill=INK)
            draw.text((x + 24, 268), a, font=K.load_font(20, True), fill=MUTED)
        card(draw, 300, 360, 1360, 280)
        draw.text((340, 400), "Continue", font=K.load_font(20, True), fill=CORAL)
        draw.text((340, 450), "A1  ·  What Is a Computer?", font=K.load_font(36, True), fill=INK)
        draw.text((340, 520), "Watch  →  Notes  →  Quiz", font=K.load_font(24, True), fill=MUTED)
        card(draw, 300, 680, 1360, 220, SOFT)
        draw.text((340, 730), "Problem of the Day", font=K.load_font(28, True), fill=INK)
        draw.text((340, 790), "Open Learn. The streak can grow.", font=K.load_font(22, True), fill=MUTED)
        return True

    if visual == "film-lesson":
        shell(draw, w, h, "Learn")
        draw.text((300, 48), "A1  ·  What Is a Computer?", font=K.load_font(36, True), fill=INK)
        if focus == "watch":
            draw.rounded_rectangle((300, 160, 1500, 860), radius=24, fill=INK)
            center(draw, "Narrated lesson", 460, 42, WHITE, w)
            draw.rounded_rectangle((700, 560, 980, 640), radius=16, fill=CORAL)
            draw.text((800, 582), "Play", font=K.load_font(28, True), fill=WHITE)
        elif focus == "notes":
            card(draw, 300, 160, 1100, 700)
            draw.text((360, 210), "Notes", font=K.load_font(32, True), fill=INK)
            lines = [
                "A computer takes input.",
                "It processes.",
                "It gives output.",
            ]
            for i, line in enumerate(lines):
                draw.text((360, 320 + i * 80), line, font=K.load_font(32, True), fill=INK)
            draw.rounded_rectangle((360, 680, 760, 760), radius=14, fill=CORAL)
            draw.text((400, 704), "Download notes", font=K.load_font(24, True), fill=WHITE)
        else:
            card(draw, 360, 200, 1200, 560)
            draw.text((420, 260), "Quiz", font=K.load_font(28, True), fill=CORAL)
            draw.text((420, 340), "Which one is a computer?", font=K.load_font(36, True), fill=INK)
            for i, opt in enumerate(["A lamp", "A laptop", "A toaster"]):
                y = 460 + i * 80
                col = TEAL if i == 1 else LINE
                draw.rounded_rectangle((420, y, 1400, y + 64), radius=14, outline=col, width=3, fill=WHITE)
                draw.text((460, y + 14), opt, font=K.load_font(26, True), fill=INK)
        return True

    if visual == "film-build":
        shell(draw, w, h, "Build")
        draw.text((300, 40), "Build Arena", font=K.load_font(36, True), fill=INK)
        draw.text((300, 96), "Blocks. No typing yet.", font=K.load_font(22, True), fill=MUTED)
        card(draw, 300, 170, 520, 760)
        for i, (name, col) in enumerate([("Forward", CORAL), ("Turn left", (79, 70, 229)), ("Turn right", TEAL)]):
            y = 220 + i * 110
            draw.rounded_rectangle((340, y, 760, y + 84), radius=16, fill=col)
            draw.text((380, y + 24), name, font=K.load_font(26, True), fill=WHITE)
        card(draw, 860, 170, 980, 760)
        # Real B15-style 5×5 walls
        walls = {(3, 0), (0, 1), (2, 1), (4, 2), (0, 3), (1, 3), (3, 3)}
        cell = 110
        ox, oy = 1040, 250
        for gy in range(5):
            for gx in range(5):
                x = ox + gx * (cell + 8)
                y = oy + gy * (cell + 8)
                if (gx, gy) in walls:
                    col = INK
                elif (gx, gy) == (4, 4):
                    col = (255, 248, 214)
                else:
                    col = WHITE
                draw.rounded_rectangle((x, y, x + cell, y + cell), radius=16, fill=col, outline=LINE, width=2)
        if focus == "run":
            draw.ellipse((ox + 28, oy + 28, ox + 82, oy + 82), fill=CORAL)
        draw.rounded_rectangle((900, 960, 1180, 1040), radius=16, fill=CORAL)
        draw.text((990, 982), "Run", font=K.load_font(28, True), fill=WHITE)
        return True

    if visual == "film-practice":
        shell(draw, w, h, "Practice")
        draw.text((300, 48), "Practice", font=K.load_font(36, True), fill=INK)
        card(draw, 300, 160, 1400, 640)
        draw.text((360, 220), "One question. One try.", font=K.load_font(32, True), fill=INK)
        draw.text((360, 300), "A clear answer when you are done.", font=K.load_font(26, True), fill=MUTED)
        draw.rounded_rectangle((360, 420, 900, 520), radius=16, fill=TEAL)
        draw.text((430, 448), "See the answer", font=K.load_font(28, True), fill=WHITE)
        return True

    if visual == "film-potd":
        shell(draw, w, h, "Home")
        card(draw, 1280, 40, 560, 980)
        draw.text((1320, 80), "POTD", font=K.load_font(28, True), fill=INK)
        draw.text((1320, 130), "October", font=K.load_font(22, True), fill=MUTED)
        for i, d in enumerate("SMTWTFS"):
            draw.text((1340 + i * 68, 190), d, font=K.load_font(16, True), fill=MUTED)
        n = 1
        for row in range(5):
            for col in range(7):
                if n > 31:
                    break
                x = 1330 + col * 68
                y = 240 + row * 68
                today = n == 1
                solved = n == 1
                colr = CORAL if today else (TEAL if solved else CREAM)
                inkc = WHITE if today or solved else INK
                draw.rounded_rectangle((x, y, x + 56, y + 56), radius=10, fill=colr)
                draw.text((x + 16, y + 16), str(n), font=K.load_font(18, True), fill=inkc)
                n += 1
        draw.text((300, 200), "Open Learn.", font=K.load_font(48, True), fill=INK)
        draw.text((300, 280), "The streak can grow.", font=K.load_font(36, True), fill=INK)
        draw.text((300, 400), "A correct answer today earns XP.", font=K.load_font(26, True), fill=MUTED)
        return True

    if visual == "film-board":
        shell(draw, w, h, "Progress")
        draw.text((300, 40), "Progress", font=K.load_font(36, True), fill=INK)
        if focus == "score":
            for i, (a, b) in enumerate([("XP", "2"), ("Streak", "2d"), ("Badges", "0")]):
                x = 300 + i * 500
                card(draw, x, 160, 460, 180)
                draw.text((x + 28, 200), b, font=K.load_font(48, True), fill=INK)
                draw.text((x + 28, 270), a, font=K.load_font(22, True), fill=MUTED)
            draw.text((300, 420), "Points add up from quizzes, practice, and today's problem.", font=K.load_font(26, True), fill=MUTED)
        else:
            card(draw, 300, 150, 1400, 760)
            draw.text((360, 190), "Class 3–5 leaderboard", font=K.load_font(28, True), fill=INK)
            draw.text((360, 240), "First name and XP only.", font=K.load_font(22, True), fill=MUTED)
            rows = [("1", "You", "2 XP", True), ("2", "First name", "XP", False)]
            for i, (rank, name, xp, you) in enumerate(rows):
                y = 340 + i * 120
                bg = SOFT if you else CREAM
                draw.rounded_rectangle((360, y, 1600, y + 96), radius=16, fill=bg)
                draw.text((400, y + 28), rank, font=K.load_font(28, True), fill=CORAL)
                draw.text((500, y + 28), name, font=K.load_font(28, True), fill=INK)
                draw.text((1300, y + 28), xp, font=K.load_font(28, True), fill=INK)
        return True

    if visual == "film-payoff":
        fill(draw, w, h, BLACK)
        if focus == "was":
            center(draw, "Listed at", 340, 32, MUTED, w)
            struck(draw, "Rs 999", 460, 100, (120, 126, 136), w)
        elif focus == "now":
            center(draw, "Rs 0", 360, 140, WHITE, w)
            center(draw, "No card.  No ads on Learn.", 580, 36, CORAL, w)
        else:
            center(draw, "Technology for a child", 420, 48, WHITE, w)
            center(draw, "should feel like this.", 510, 48, WHITE, w)
        return True

    if visual == "film-why":
        fill(draw, w, h, CREAM)
        titles = {
            "clear": ("Clear.", "Watch. Notes. Quiz. Build. Practice."),
            "calm": ("Calm.", "About fifteen minutes. Most days."),
            "honest": ("Honest.", "Learning stays on the parent account."),
        }
        title, sub = titles.get(focus, ("Clear.", ""))
        center(draw, title, 400, 92, INK, w)
        center(draw, sub, 540, 36, MUTED, w)
        return True

    if visual == "film-end":
        fill(draw, w, h, CREAM)
        if focus == "not":
            center(draw, "This isn't just another kids' app.", 460, 48, INK, w)
        elif focus == "better":
            center(draw, "A better way to start", 400, 56, INK, w)
            center(draw, "computer science.", 490, 56, INK, w)
        else:
            center(draw, "Mentr Learn", 340, 72, INK, w)
            center(draw, "Free for Class 3–5", 460, 36, CORAL, w)
            center(draw, "mentr.in/learn", 560, 32, MUTED, w)
            draw.rounded_rectangle((760, 680, 1160, 780), radius=18, fill=CORAL)
            draw.text((860, 710), "Enroll free", font=K.load_font(32, True), fill=WHITE)
        return True

    return False
