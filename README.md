# PoE2 Gemling Quality Effects

A searchable, sortable reference of **Path of Exile 2 (0.5)** skill gem quality effects. It compares each skill's **Gemling quality effect** against its **normal quality effect**, shows the skill's weapon requirement, and flags the skills where the Gemling quality bonus is distinct.

**Live:** https://chritofferal.github.io/poe2-gemling-quality/

## Features

- **Search** across skill names, stat IDs, and stat text
- **Filter** by weapon requirement
- **Sort** by skill, weapon, or whether the Gemling effect is distinct — click a column header (mouse or keyboard) or use the dropdown
- **Only distinct effect** — show just the skills where Gemling quality differs from normal quality
- **Show raw stat IDs** — reveal the underlying game stat identifiers and raw permille values
- Values are converted from permille to percentages for readability

## Running it

It's a single self-contained HTML file — no build step, no dependencies, no network calls. All data is inline.

- **Online:** open the live link above.
- **Offline:** download `index.html` and open it in any browser.

## Data & attribution

The quality data comes from the "Gemling Quality spreadsheet" shared by [u/Torash on r/PathOfExile2](https://www.reddit.com/r/PathOfExile2/comments/1trbio7/gemling_quality_spreadsheet/), which links a community Google Sheet. The original author is unconfirmed — per the post, the data surfaced while watching Kripp. This page is a reformatted, searchable view of that data.

Unofficial fan-made reference. *Path of Exile 2* and all related game data are the property of [Grinding Gear Games](https://www.grindinggear.com/). This project is not affiliated with or endorsed by GGG. Values reflect game version 0.5 and may go out of date as the game is patched.

## License

The code in this repository (the tool itself) is released under the [MIT License](LICENSE). The underlying game data is not covered by this license and remains the property of Grinding Gear Games.
