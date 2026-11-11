"""Render both card faces for a playlist CSV, in playlist order."""

from pathlib import Path
import pandas as pd
from tqdm import tqdm

from render_card import ARTWORK, DPI, render_qr_side
from render_reveal import DECKS, render_reveal

PLAYLIST = DECKS / "my_hits.csv"
PLAYLIST_ARTWORK = ARTWORK  # Choose one image for this playlist.
OUTPUT_DIR = Path(__file__).with_name("outputs") / f"{PLAYLIST.stem}-{PLAYLIST_ARTWORK.stem}-{DPI}dpi"


def read_playlist(playlist):
    songs = pd.read_csv(playlist, dtype=str, keep_default_na=False, encoding="utf-8-sig")
    columns = ["UniqueID", "year", "title", "artist"]
    missing = set(columns).difference(songs.columns)
    if missing:
        raise ValueError(f"{playlist.name} is missing columns: {', '.join(sorted(missing))}")
    if songs.empty:
        raise ValueError(f"{playlist.name} contains no songs.")

    songs = songs[columns].apply(lambda column: column.str.strip())
    valid = (
        songs["UniqueID"].str.fullmatch(r"[0-9a-f]{12}", na=False)
        & songs["year"].str.fullmatch(r"[0-9]{4}", na=False)
        & songs["title"].fillna("").ne("")
        & songs["artist"].fillna("").ne("")
    )
    if not valid.all():
        row = songs.index[~valid][0] + 1
        raise ValueError(f"{playlist.name}, data row {row}: incomplete or invalid song data")
    return songs.astype({"year": int})


def save_card(card, path):
    with path.open("xb") as file:
        try:
            card.save(file, format="PNG", dpi=(DPI, DPI))
        except BaseException:
            file.close()
            path.unlink()
            raise


def render_deck(playlist, output_dir, artwork):
    songs = read_playlist(playlist)
    if not artwork.is_file():
        raise FileNotFoundError(f"Playlist artwork not found: {artwork}")
    qr_dir = output_dir / "qr-corner-id"
    reveal_dir = output_dir / "reveal"
    width = max(3, len(str(len(songs))))
    names = [f"{i:0{width}d}-{song_id}.png" for i, song_id in enumerate(songs["UniqueID"], start=1)]

    # Old numbered files can mix two playlist orders. Use a new folder for a changed list.
    expected = set(names)
    for folder in (qr_dir, reveal_dir):
        stale = sorted(path.name for path in folder.glob("*.png") if path.name not in expected)
        if stale:
            raise ValueError(f"{folder} contains files from another playlist or order. Use a new OUTPUT_DIR.")
        folder.mkdir(parents=True, exist_ok=True)

    rows = zip(names, songs.itertuples(index=False, name=None))
    for filename, (song_id, year, title, artist) in tqdm(
        rows, total=len(songs), desc=playlist.stem, unit="card",
    ):
        qr_path = qr_dir / filename
        reveal_path = reveal_dir / filename
        if not qr_path.exists():
            save_card(render_qr_side(song_id, artwork), qr_path)
        if not reveal_path.exists():
            save_card(render_reveal(year, title, artist), reveal_path)


if __name__ == "__main__":
    render_deck(PLAYLIST, OUTPUT_DIR, PLAYLIST_ARTWORK)
