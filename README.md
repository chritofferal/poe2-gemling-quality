# PoE2 Skill & Support Gems

A searchable, filterable build-planning reference of every **Path of Exile 2 (0.5)** skill and support gem — full descriptions, tags, attribute & level requirements, weapon requirements, and the distinct **Gemling quality** effect vs. normal quality.

**Live:** https://chritofferal.github.io/poe2-gemling-quality/

## Features

- **All 895 gems** — 339 active skills + 556 supports
- **Full-details modal** — click any gem to open a popup with its full in-game description, sub-parts (e.g. *Volatile Dead → Explosion · Core*), a requirements grid (level, attributes, tier, max level, weapon), and both quality effects with raw stat IDs.
- **Requirements** — character level, Str/Dex/Int (color-coded), gem tier, and max gem level
- **Tags** on every gem — click chips to filter; **combine multiple tags** with a match-all / match-any toggle
- **Filter** by type (skills / supports), tags, or weapon; **search** across names, tags, descriptions, and stats
- **Gemling vs. normal quality** for the gems with distinct quality data (~318)
- **Sort** by name, type, level requirement, weapon, or whether the Gemling effect is distinct
- **Show raw stat IDs** to reveal the underlying game stat identifiers

## Data & sources

- **Gem list, descriptions, tags, requirements, weapon types & normal quality:** extracted from [Path of Building (PoE2)](https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2) (`Gems.lua` + skill data), patch 0.5.
- **Gemling (Advanced Thaumaturgy) quality:** scraped from [poe2db](https://poe2db.tw/us/Advanced_Thaumaturgy) — the only authoritative source, since PoB does not store the Gemling alt-quality. Used verbatim, so units match in-game exactly.

> **Normal quality is shown at 20% gem quality** (PoB `qualityStats` × 20); toggle "show raw stat IDs" to see the underlying stat + value. Gemling quality shows poe2db's range (0 → value at 20% quality).

## Rebuilding

```
node extract-gems.mjs          # parse a local PoB checkout -> gems-data.json (metadata + normal quality)
node parse-poe2db-gemling.mjs  # parse cached poe2db page -> poe2db-gemling.json (Gemling quality)
node build.mjs                 # merge the two -> index.html
```

- `extract-gems.mjs` — gem metadata + normal quality from Path of Building (set the `POB` path at top)
- `parse-poe2db-gemling.mjs` — parses `raw/advanced_thaumaturgy.html` (refresh via curl) into Gemling text
- `gems-data.json` / `poe2db-gemling.json` — vendored snapshots (page rebuilds without re-fetching)
- `template.html` — page shell; `build.mjs` injects the merged data

## Attribution & license

Unofficial fan-made reference. *Path of Exile 2* and all related game data are the property of [Grinding Gear Games](https://www.grindinggear.com/). Not affiliated with or endorsed by GGG. Values reflect game version 0.5.

The code in this repository is released under the [MIT License](LICENSE). The underlying game data is not covered by this license.
