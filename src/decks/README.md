# Hitster deck library

| Deck | Cards | Missing Spotify ID |
| --- | ---: | ---: |
| [My Hits](my_hits.csv) | 318 | 71 |
| [Country](country.csv) | 80 | 28 |
| [Classic Hitster](classic.csv) | 100 | 31 |
| [One-Hit Wonders](one_hit_wonders.csv) | 60 | 48 |
| [Covers vs Originals](covers_vs_originals.csv) | 52 (26 pairs) | 28 |

Each deck CSV has a `UniqueID` column containing a random recording ID. The same recording can share an ID across decks. Keep the assigned IDs when editing or refreshing the CSVs so future QR links stay stable. The numeric `id` column is local to each deck. The blank `tidal` column beside `spotify` is for TIDAL track IDs. Enter the track ID only, as text. Blank provider IDs mark cards that still need catalog matches. Existing Spotify IDs still need recording-version checks before printing cards.

Vite bundles these CSVs with the site. The dashboard lets players pick a deck, and card links use `?song=<UniqueID>`. When refreshing a deck from Project Hitster, carry over its existing recording IDs.
