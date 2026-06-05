# PoE2 Skill & Support Gems

A searchable, filterable reference of every **Path of Exile 2 (0.5)** skill and support gem — with **tags**, weapon requirements, and the distinct **Gemling quality** effect vs. normal quality.

**Live:** https://chritofferal.github.io/poe2-gemling-quality/

## Features

- **All 895 gems** — 339 active skills + 556 supports
- **Tags** on every gem (AoE, Fire, Projectile, Melee, Slam, Minion, Curse, Persistent, Warcry…) — click a tag to filter by it
- **Filter** by type (skills / supports), tag, or weapon requirement; **search** across names, tags, and stats
- **Gemling vs. normal quality** for the gems that have distinct quality data (~318)
- **Sort** by name, type, weapon, or whether the Gemling effect is distinct — click a column header (mouse or keyboard) or use the dropdown
- **Show raw stat IDs** to reveal the underlying game stat identifiers
- The published `index.html` is self-contained — no dependencies, no network calls

## Data & sources

- **Gem list, tags, weapon & attribute requirements:** extracted from [Path of Building (PoE2)](https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2) (`Gems.lua`), patch 0.5.
- **Gemling vs. normal quality:** the "Gemling Quality spreadsheet" shared by [u/Torash on r/PathOfExile2](https://www.reddit.com/r/PathOfExile2/comments/1trbio7/gemling_quality_spreadsheet/), validated against poe2db. Original author unconfirmed.

> Quality-value note: the percentages are normalized to 100% quality; the in-game / poe2db convention shows the value at 20% quality (5× smaller). The stat names and raw values are faithful to the game source.

## Rebuilding

`index.html` is generated. To regenerate after a patch/data update:

```
node build.mjs
```

- `gems-data.json` — gem master list + tags, vendored from Path of Building (used as the fallback when a local PoB checkout isn't present)
- `quality-data.json` — the verified Gemling / normal quality data
- `template.html` — the page shell; `build.mjs` merges the two sources and injects the data

## Attribution & license

Unofficial fan-made reference. *Path of Exile 2* and all related game data are the property of [Grinding Gear Games](https://www.grindinggear.com/). This project is not affiliated with or endorsed by GGG. Values reflect game version 0.5.

The code in this repository is released under the [MIT License](LICENSE). The underlying game data is not covered by this license.
