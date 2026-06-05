# PoE2 Skill & Support Gems

A searchable, filterable build-planning reference of every **Path of Exile 2 (0.5)** skill and support gem — full descriptions, tags, attribute & level requirements, weapon requirements, and the distinct **Gemling quality** effect vs. normal quality.

**Live:** https://chritofferal.github.io/poe2-gemling-quality/

## Features

- **All 895 gems** — 339 active skills + 556 supports
- **Full descriptions** — click any gem to expand its in-game description, its sub-parts (e.g. *Volatile Dead → Explosion · Core*), and a requirements summary. "Expand all" shows every description at once.
- **Requirements** — character level, Str/Dex/Int (color-coded), gem tier, and max gem level
- **Tags** on every gem — click chips to filter; **combine multiple tags** with a match-all / match-any toggle
- **Filter** by type (skills / supports), tags, or weapon; **search** across names, tags, descriptions, and stats
- **Gemling vs. normal quality** for the gems with distinct quality data (~318)
- **Sort** by name, type, level requirement, weapon, or whether the Gemling effect is distinct
- **Show raw stat IDs** to reveal the underlying game stat identifiers

## Data & sources

- **Gem list, descriptions, tags, requirements & weapon types:** extracted from [Path of Building (PoE2)](https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2) (`Gems.lua` + skill data), patch 0.5.
- **Gemling vs. normal quality:** the "Gemling Quality spreadsheet" shared by [u/Torash on r/PathOfExile2](https://www.reddit.com/r/PathOfExile2/comments/1trbio7/gemling_quality_spreadsheet/), validated against poe2db.

> **Quality values are shown at 20% quality** (the in-game / poe2db convention). The stat names and raw values are faithful to the game source; toggle "show raw stat IDs" to see them.

## Rebuilding

```
node extract-gems.mjs   # parse a local Path of Building checkout -> gems-data.json (needs PoB)
node build.mjs          # merge gems-data.json + quality-data.json -> index.html
```

- `extract-gems.mjs` — pulls the full gem data from Path of Building (set the `POB` path at the top)
- `gems-data.json` — vendored gem snapshot (so the page rebuilds without a PoB checkout)
- `quality-data.json` — verified Gemling / normal quality
- `template.html` — page shell; `build.mjs` injects the merged data

## Attribution & license

Unofficial fan-made reference. *Path of Exile 2* and all related game data are the property of [Grinding Gear Games](https://www.grindinggear.com/). Not affiliated with or endorsed by GGG. Values reflect game version 0.5.

The code in this repository is released under the [MIT License](LICENSE). The underlying game data is not covered by this license.
