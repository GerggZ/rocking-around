"""Generate a styled QR PNG."""

import re
from urllib.parse import urlencode

from PIL import Image, ImageDraw, ImageOps
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.main import precomputed_qr_blanks
from qrcode.util import MODE_8BIT_BYTE, MODE_ALPHA_NUM, QRData, pattern_position

# QR alphanumeric mode packs the case-insensitive scheme and host more densely.
SITE_ORIGIN = "HTTPS://GERGGZ.GITHUB.IO"
SITE_PATH = "/rocking-around/"
SONG_ID = "b082a32d1ea4"
OUTPUT = "qr.png"
MODULE_SIZE = 9
DARK = "#23452f"  # Forest-green dark dots.
LIGHT = "#fff0c9"  # Light modules. The margin stays transparent.
CONNECT_DOTS = True  # Fill connected dark modules with rounded edges.
COVERAGE = 0.5  # Paint module centers and let the artwork show around them.


def generate_qr(song_id, *, module_size, dark, light, coverage, connect_dots=False):
    if not re.fullmatch(r"[0-9a-f]{12}", song_id):
        raise ValueError("SONG_ID must be a 12-character lowercase hexadecimal UniqueID.")
    if module_size < 1 or not 0 < coverage <= 1:
        raise ValueError("Use a positive module size and coverage between 0 and 1.")
    code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=2 * module_size, border=4)
    code.add_data(QRData(SITE_ORIGIN, mode=MODE_ALPHA_NUM))
    code.add_data(QRData(SITE_PATH + "?" + urlencode({"song": song_id}), mode=MODE_8BIT_BYTE))
    matrix = code.get_matrix()
    side = len(matrix) * module_size
    clear = (0, 0, 0, 0)
    image = Image.new("RGBA", (side, side), clear)
    draw = ImageDraw.Draw(image)
    inset = min(round(module_size * (1 - coverage) / 2), (module_size - 1) // 2)
    # The pinned qrcode version stores finder, alignment, and timing modules here.
    fixed = precomputed_qr_blanks[code.version]
    if connect_dots:
        styled = code.make_image(
            image_factory=StyledPilImage,
            module_drawer=RoundedModuleDrawer(radius_ratio=0.65),
        ).get_image()
        rounded_mask = ImageOps.invert(styled.convert("L")).resize(image.size, Image.Resampling.BOX)
        rounded_ink = Image.new("RGBA", image.size, dark)
        rounded_ink.putalpha(rounded_mask)
    for row, modules in enumerate(fixed):
        for col, function_module in enumerate(modules):
            x, y = (col + 4) * module_size, (row + 4) * module_size
            right, bottom = x + module_size - 1, y + module_size - 1
            filled = matrix[row + 4][col + 4]
            color = dark if filled else light
            if color is None:
                continue
            if function_module is not None:
                draw.rectangle((x, y, right, bottom), fill=color)
            elif connect_dots and filled:
                box = (x, y, right + 1, bottom + 1)
                image.paste(rounded_ink.crop(box), box)
            elif not inset:
                draw.rectangle((x, y, right, bottom), fill=color)
            else:
                draw.ellipse((x + inset, y + inset, right - inset, bottom - inset), fill=color)

    # Keep the finder and alignment patterns' module centers while rounding their rings.
    far = len(matrix) - 4 - 7
    background = light if light is not None else clear
    markers = [(4, 4, 7), (far, 4, 7), (4, far, 7)]
    positions = pattern_position(code.version)
    if positions:
        first, last = positions[0], positions[-1]
        finder_centers = {(first, first), (last, first), (first, last)}
        markers.extend(
            (col + 2, row + 2, 5)
            for row in positions for col in positions
            if (col, row) not in finder_centers
        )
    for col, row, width in markers:
        x, y = col * module_size, row * module_size
        right, bottom = x + width * module_size - 1, y + width * module_size - 1
        draw.rectangle((x, y, right, bottom), fill=background)
        for ring, radius, color in ((0, 1.0, dark), (1, 0.9, background), (2, 0.65, dark)):
            offset = ring * module_size
            draw.rounded_rectangle(
                (x + offset, y + offset, right - offset, bottom - offset),
                radius=round(radius * module_size * width / 7), fill=color,
            )
    return image


if __name__ == "__main__":
    generate_qr(
        SONG_ID, module_size=MODULE_SIZE, dark=DARK, light=LIGHT, coverage=COVERAGE,
        connect_dots=CONNECT_DOTS,
    ).save(OUTPUT)
