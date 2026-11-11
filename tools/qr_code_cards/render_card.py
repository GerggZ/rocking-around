"""Generate the QR and place it on the card in one run."""

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from qr.combine_qr import combine_qr
from qr.generate_qr import generate_qr

SONG_ID = "b082a32d1ea4"  # UniqueID from a deck CSV.
ARTWORK = Path(__file__).with_name("alpine-art.png")

MODULE_SIZE = 9  # Module width in pixels at 300 dpi.
SELECTIVE_DARK_DOTS = False  # Let dark artwork replace isolated dark dots.
SELECTIVE_LIGHT_DOTS = True  # Let bright artwork supply light data modules.
DARK = "#23452f"  # Forest-green dark dots.
LIGHT = "#fff0c9"  # Warm cream light dots.
CONNECT_DOTS = True  # Fill connected dark modules with rounded edges.
COVERAGE = 0.5  # Fraction of each data module covered by its dot.
DARK_STRENGTH = 0.72  # Increase for darker modules.
LIGHT_STRENGTH = 0.42  # Increase to lift the light modules.

ID_OPACITY = 0.70
DPI = 600
SIZE = (round(2.5 * DPI), round(3.5 * DPI))
X = None  # Pixels at 300 dpi. None centers horizontally.
Y = None  # Pixels at 300 dpi. None centers vertically.

style = "filled-pipes" if CONNECT_DOTS else "rounded-dots"
light_style = "-selective-light" if SELECTIVE_LIGHT_DOTS else ""
dark_style = "-selective-dark" if SELECTIVE_DARK_DOTS else ""
OUTPUT = Path(__file__).with_name("outputs") / (
    f"card-{SONG_ID}-{style}-m{MODULE_SIZE}-rounded-markers{light_style}{dark_style}-translucent-id-{DPI}dpi.png"
)


def px(value):
    return round(value * DPI / 300)


def font(filename, size):
    fonts = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    path = fonts / filename
    if path.is_file():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size=size)


def render_qr_side(song_id, artwork):
    module_size = px(MODULE_SIZE)
    qr = generate_qr(
        song_id, module_size=module_size, dark=DARK, light=LIGHT, coverage=COVERAGE,
        connect_dots=CONNECT_DOTS,
    )
    card = combine_qr(
        qr, artwork, size=SIZE, x=px(X) if X is not None else None, y=px(Y) if Y is not None else None,
        module_size=module_size,
        selective_light=SELECTIVE_LIGHT_DOTS, selective_dark=SELECTIVE_DARK_DOTS,
        dark_strength=DARK_STRENGTH, light_strength=LIGHT_STRENGTH,
    )
    id_layer = Image.new("RGBA", card.size)
    draw = ImageDraw.Draw(id_layer)
    alpha = round(255 * ID_OPACITY)
    draw.text(
        (card.width - px(24), card.height - px(24)), song_id,
        font=font("consola.ttf", px(22)), fill=(243, 229, 199, alpha), anchor="rb",
        stroke_width=max(1, px(0.5)), stroke_fill=(35, 62, 49, alpha),
    )
    card.alpha_composite(id_layer)
    return card


if __name__ == "__main__":
    card = render_qr_side(SONG_ID, ARTWORK)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("xb") as file:
        card.save(file, format="PNG", dpi=(DPI, DPI))
