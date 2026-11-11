from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import pandas as pd
import spotipy
from dotenv import find_dotenv, load_dotenv
from spotipy.oauth2 import SpotifyOAuth


SPOTIFY_SCOPE = "user-library-read"
PAGE_SIZE = 50

OUTPUT_COLUMNS = [
    "song_name",
    "artists",
    "album",
    "release_date",
    "year",
    "spotify_id",
    "spotify_uri",
    "spotify_url",
    "isrc",
    "saved_at",
]


def load_environment() -> Path:
    env_path = find_dotenv()

    if not env_path:
        raise FileNotFoundError(
            "Could not find a .env file. Create one in the project directory."
        )

    load_dotenv(env_path)

    required_variables = [
        "SPOTIPY_CLIENT_ID",
        "SPOTIPY_CLIENT_SECRET",
        "SPOTIPY_REDIRECT_URI",
    ]
    missing_variables = [
        variable
        for variable in required_variables
        if not os.getenv(variable)
    ]

    if missing_variables:
        raise RuntimeError(
            "Missing required environment variables: "
            + ", ".join(missing_variables)
        )

    return Path(env_path).resolve().parent


def create_spotify_client(project_root: Path) -> spotipy.Spotify:
    cache_directory = project_root / ".cache"
    cache_directory.mkdir(exist_ok=True)

    authentication_manager = SpotifyOAuth(
        client_id=os.environ["SPOTIPY_CLIENT_ID"],
        client_secret=os.environ["SPOTIPY_CLIENT_SECRET"],
        redirect_uri=os.environ["SPOTIPY_REDIRECT_URI"],
        scope=SPOTIFY_SCOPE,
        cache_path=str(cache_directory / "spotify_oauth"),
        open_browser=True,
    )

    return spotipy.Spotify(auth_manager=authentication_manager)


def extract_release_year(release_date: str | None) -> int | None:
    if not release_date or len(release_date) < 4:
        return None

    year = release_date[:4]
    return int(year) if year.isdigit() else None


def parse_saved_track(saved_item: dict[str, Any]) -> dict[str, Any] | None:
    track = saved_item.get("track")

    if not track:
        return None

    album = track.get("album") or {}
    release_date = album.get("release_date")

    return {
        "song_name": track.get("name"),
        "artists": ", ".join(
            artist["name"]
            for artist in track.get("artists", [])
            if artist.get("name")
        ),
        "album": album.get("name"),
        "release_date": release_date,
        "year": extract_release_year(release_date),
        "spotify_id": track.get("id"),
        "spotify_uri": track.get("uri"),
        "spotify_url": track.get("external_urls", {}).get("spotify"),
        "isrc": track.get("external_ids", {}).get("isrc"),
        "saved_at": saved_item.get("added_at"),
    }


def get_saved_tracks_dataframe(
    spotify_client: spotipy.Spotify,
) -> pd.DataFrame:
    saved_tracks: list[dict[str, Any]] = []

    response = spotify_client.current_user_saved_tracks(limit=PAGE_SIZE)

    while response:
        for saved_item in response.get("items", []):
            parsed_track = parse_saved_track(saved_item)

            if parsed_track is not None:
                saved_tracks.append(parsed_track)

        print(f"Retrieved {len(saved_tracks)} saved tracks...")

        if not response.get("next"):
            break

        response = spotify_client.next(response)

    dataframe = pd.DataFrame(
        saved_tracks,
        columns=OUTPUT_COLUMNS,
    )

    dataframe["year"] = dataframe["year"].astype("Int64")
    dataframe["saved_at"] = pd.to_datetime(
        dataframe["saved_at"],
        utc=True,
        errors="coerce",
    )

    return dataframe


def save_dataframe(
    dataframe: pd.DataFrame,
    project_root: Path,
) -> None:
    output_directory = project_root / "data"
    output_directory.mkdir(exist_ok=True)

    csv_path = output_directory / "spotify_saved_tracks.csv"

    dataframe.to_csv(csv_path, index=False)

    print()
    print(f"Saved {len(dataframe)} tracks:")
    print(f"  CSV:     {csv_path}")


def main() -> None:
    project_root = load_environment()
    spotify_client = create_spotify_client(project_root)

    saved_tracks_dataframe = get_saved_tracks_dataframe(
        spotify_client
    )

    if saved_tracks_dataframe.empty:
        print("No saved Spotify tracks were found.")
        return

    save_dataframe(
        dataframe=saved_tracks_dataframe,
        project_root=project_root,
    )

    print()
    print(saved_tracks_dataframe.head())


if __name__ == "__main__":
    main()