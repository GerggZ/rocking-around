"""Blend a QR PNG into the tones of an existing image."""

from pathlib import Path

from PIL import Image, ImageChops, ImageOps

QR_IMAGE = "qr.png"
ARTWORK = Path(__file__).resolve().parents[1] / "alpine-art.png"
OUTPUT = "card.png"
SIZE = (750, 1050)  # Set to None to keep the artwork at its original size.
MODULE_SIZE = 9  # Match the source QR PNG.
SELECTIVE_LIGHT_DOTS = True
SELECTIVE_DARK_DOTS = False
X = None  # None centers horizontally.
Y = None  # None centers vertically.
DARK_STRENGTH = 0.72  # Increase for darker modules.
LIGHT_STRENGTH = 0.42  # Increase to lift the light modules.


def omit_redundant_dots(alpha, dark_mask, shadows, highlights, artwork, module_size,
                        *, selective_light, selective_dark):
    if module_size < 1 or any(length % module_size for length in alpha.size):
        raise ValueError("Module size must divide the QR PNG dimensions.")

    centers = {
        (x, y)
        for y in range(module_size // 2, alpha.height, module_size)
        for x in range(module_size // 2, alpha.width, module_size)
        if alpha.getpixel((x, y)) == 255
    }
    dark_centers = {point for point in centers if dark_mask.getpixel(point)}
    light_centers = centers - dark_centers
    shadow_levels = shadows.convert("L")
    highlight_levels = highlights.convert("L")
    art_levels = artwork.convert("L")
    light_floor = max(map(shadow_levels.getpixel, dark_centers), default=255) + 40
    dimmest_light = 255

    for x, y in light_centers:
        left, top = x - module_size // 2, y - module_size // 2
        right, bottom = left + module_size, top + module_size
        corners = ((left, top), (right - 1, top), (left, bottom - 1), (right - 1, bottom - 1))
        art_level = art_levels.getpixel((x, y))
        if selective_light and art_level >= light_floor and not any(map(alpha.getpixel, corners)):
            alpha.paste(0, (left, top, right, bottom))
            dimmest_light = min(dimmest_light, art_level)
        else:
            dimmest_light = min(dimmest_light, highlight_levels.getpixel((x, y)))

    if selective_dark and light_centers:
        for x, y in dark_centers:
            if art_levels.getpixel((x, y)) > dimmest_light - 20:
                continue
            # Keep pipes and dark cells that touch another dark module.
            neighbors = ((x-module_size, y), (x+module_size, y),
                         (x, y-module_size), (x, y+module_size))
            if any(point in dark_centers for point in neighbors):
                continue
            left, top = x - module_size // 2, y - module_size // 2
            right, bottom = left + module_size, top + module_size
            corners = ((left, top), (right - 1, top), (left, bottom - 1), (right - 1, bottom - 1))
            if max(map(alpha.getpixel, corners)) <= 96:
                alpha.paste(0, (left, top, right, bottom))


def combine_qr(qr, artwork, *, size=None, x=None, y=None, module_size=None,
               dark_strength=DARK_STRENGTH, light_strength=LIGHT_STRENGTH,
               selective_light=True, selective_dark=False):
    if not (0 <= dark_strength <= 1 and 0 <= light_strength <= 1):
        raise ValueError("Blend strengths must be between 0 and 1.")
    with Image.open(artwork) as source:
        card = ImageOps.exif_transpose(source).convert("RGBA")
    if size is not None:
        card = ImageOps.fit(card, size, method=Image.Resampling.LANCZOS)

    x = (card.width - qr.width) // 2 if x is None else x
    y = (card.height - qr.height) // 2 if y is None else y
    if x < 0 or y < 0 or x + qr.width > card.width or y + qr.height > card.height:
        raise ValueError("The QR must fit entirely on the artwork.")
    qr = qr.convert("RGBA")
    art = card.crop((x, y, x + qr.width, y + qr.height)).convert("RGB")
    ink = qr.convert("RGB")
    # Multiply dark modules and screen light modules using the pixels beneath them.
    dark_mask = ink.convert("L").point(lambda level: 255 if level < 128 else 0)
    shadows = Image.blend(art, ImageChops.multiply(art, ink), dark_strength)
    highlights = Image.blend(art, ImageChops.screen(art, ink), light_strength)
    blended = Image.composite(shadows, highlights, dark_mask)
    alpha = qr.getchannel("A")
    if module_size is not None and (selective_light or selective_dark):
        omit_redundant_dots(
            alpha, dark_mask, shadows, highlights, art, module_size,
            selective_light=selective_light, selective_dark=selective_dark,
        )
    blended.putalpha(alpha)
    card.alpha_composite(blended, (x, y))
    return card


if __name__ == "__main__":
    with Image.open(QR_IMAGE) as qr:
        card = combine_qr(
            qr, ARTWORK, size=SIZE, x=X, y=Y, module_size=MODULE_SIZE,
            dark_strength=DARK_STRENGTH, light_strength=LIGHT_STRENGTH,
            selective_light=SELECTIVE_LIGHT_DOTS, selective_dark=SELECTIVE_DARK_DOTS,
        )
        card.save(OUTPUT, dpi=(300, 300))
