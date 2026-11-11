"""Render the year, title, and artist side of a Hitster card."""

import csv
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw

from render_card import DPI, SIZE, SONG_ID, font, px

DECKS = Path(__file__).resolve().parents[2] / "web" / "src" / "decks"
OUTPUT = Path(__file__).with_name("outputs") / f"card-{SONG_ID}-reveal-two-tone-{DPI}dpi.png"
PAPER = "#f8edcf"
UPPER_TINT = 0.38
LOWER_TINT = 0.09
COLOR_SPLIT_Y = 416
TIMELINE_Y = 445
INK = "#233e31"
FIRST_COLOR_YEAR = 1950
YEARS_PER_COLOR = 5
COLOR_CYCLE = (
    "#ab762b",  # Honey
    "#b45d46",  # Terracotta
    "#74763a",  # Olive
    "#536b87",  # Slate blue
    "#80576d",  # Plum
    "#437b77",  # Teal
)


def find_song(song_id):
    matches = set()
    for deck in sorted(DECKS.glob("*.csv")):
        with deck.open(encoding="utf-8-sig", newline="") as file:
            for row in csv.DictReader(file):
                if row["UniqueID"] == song_id:
                    matches.add((int(row["year"]), row["title"], row["artist"]))
    if not matches:
        raise ValueError(f"No song with UniqueID {song_id!r} found in {DECKS}.")
    if len(matches) > 1:
        raise ValueError(f"Decks disagree on the year, title, or artist for {song_id!r}.")
    return matches.pop()


def draw_label(draw, text, center, filename, max_size, width):
    words = text.split()
    for size in range(max_size, 0, -1):
        face = font(filename, size)
        lines = [""]
        for word in words:
            candidate = f"{lines[-1]} {word}".strip()
            if draw.textlength(candidate, font=face) <= width:
                lines[-1] = candidate
            else:
                lines.append(word)
        if len(lines) <= 2 and all(draw.textlength(line, font=face) <= width for line in lines):
            spacing = round(size * 1.18)
            for i, line in enumerate(lines):
                offset = round((i - (len(lines) - 1) / 2) * spacing)
                draw.text((center[0], center[1] + offset), line, font=face, fill=INK, anchor="mm")
            return
    raise ValueError(f"Card text is too long: {text!r}")


def tint(ink, strength):
    paper_rgb = ImageColor.getrgb(PAPER)
    ink_rgb = ImageColor.getrgb(ink)
    return tuple(round(base + (accent - base) * strength)
                 for base, accent in zip(paper_rgb, ink_rgb))


def render_reveal(year, title, artist):
    color_index = (year - FIRST_COLOR_YEAR) // YEARS_PER_COLOR % len(COLOR_CYCLE)
    accent = COLOR_CYCLE[color_index]
    card = Image.new("RGB", SIZE, tint(accent, LOWER_TINT))
    draw = ImageDraw.Draw(card)
    draw.rectangle((0, 0, card.width - 1, px(COLOR_SPLIT_Y) - 1), fill=tint(accent, UPPER_TINT))
    center = card.width // 2
    ornament = tint(accent, 0.57)
    draw.rounded_rectangle(
        (px(28), px(28), card.width - px(28) - 1, card.height - px(28) - 1),
        radius=px(30), outline=ornament, width=px(2),
    )

    draw.line((px(52), px(TIMELINE_Y), card.width - px(52) - 1, px(TIMELINE_Y)), fill=accent, width=px(6))
    draw.text((center, px(294)), str(year), font=font("georgiab.ttf", px(190)), fill=INK, anchor="mm")
    draw_label(draw, title, (center, px(550)), "georgiab.ttf", px(64), card.width - px(110))
    draw_label(draw, artist, (center, px(690)), "segoeui.ttf", px(39), card.width - px(110))
    return card


if __name__ == "__main__":
    card = render_reveal(*find_song(SONG_ID))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("xb") as file:
        card.save(file, format="PNG", dpi=(DPI, DPI))
