// Build index.html from the gem master list (PoB) + verified quality data (spreadsheet).
// Usage: node build.mjs
// Sources:
//   gems-data.json     -- vendored from Path of Building (Gems.lua): name, tags, weapon, attrs
//   quality-data.json  -- verified Gemling/Normal quality (community spreadsheet, validated vs poe2db)
//   template.html      -- the page shell with a `const DATA=/*__DATA__*/[];` placeholder
import fs from 'fs';

const DIR = 'C:/Users/chris/Desktop/poe2-gemling-quality';
const POB = 'C:/Users/chris/Desktop/PathOfBuilding-PoE2-dev/src/Data/Gems.lua';

// --- gem master list: parse PoB if available, else use the vendored snapshot ---
let gems;
if (fs.existsSync(POB)) {
  const lua = fs.readFileSync(POB, 'utf8');
  const blocks = lua.split('["Metadata/Items/Gems/').slice(1);
  const get = (b, re) => { const m = b.match(re); return m ? m[1] : ''; };
  const seen = new Set();
  gems = [];
  for (const b of blocks) {
    const name = get(b, /\bname = "([^"]*)"/);
    if (!name) continue;
    const k = name.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    const gemType = get(b, /\bgemType = "([^"]*)"/);
    gems.push({
      name, gemType, isSupport: gemType === 'Support',
      tags: get(b, /\btagString = "([^"]*)"/),
      id: get(b, /\bgrantedEffectId = "([^"]*)"/),
      weapon: get(b, /\bweaponRequirements = "([^"]*)"/),
      str: +(get(b, /\breqStr = (\d+)/) || 0),
      dex: +(get(b, /\breqDex = (\d+)/) || 0),
      int: +(get(b, /\breqInt = (\d+)/) || 0),
    });
  }
  fs.writeFileSync(DIR + '/gems-data.json', JSON.stringify(gems));
  console.log('parsed PoB Gems.lua ->', gems.length, 'gems (vendored to gems-data.json)');
} else {
  gems = JSON.parse(fs.readFileSync(DIR + '/gems-data.json', 'utf8'));
  console.log('using vendored gems-data.json ->', gems.length, 'gems');
}

// --- quality data, keyed by grantedEffectId then name ---
const quality = JSON.parse(fs.readFileSync(DIR + '/quality-data.json', 'utf8'));
const byId = {}, byName = {};
for (const q of quality) { if (q.id) byId[q.id.toLowerCase()] = q; byName[q.skill.toLowerCase().trim()] = q; }

// --- merge ---
const merged = gems.map(g => {
  const q = (g.id && byId[g.id.toLowerCase()]) || byName[g.name.toLowerCase().trim()];
  return {
    name: g.name,
    support: g.isSupport,
    tags: g.tags || '',
    weapon: g.weapon || 'Any / no weapon req',
    str: g.str, dex: g.dex, int: g.int,
    gemling: q ? !!q.gemling : false,
    gStat: q ? q.gStat : '', gVal: q ? q.gVal : '',
    nStat: q ? q.nStat : '', nVal: q ? q.nVal : '',
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const withQuality = merged.filter(m => m.gStat || m.nStat).length;
const json = JSON.stringify(merged).replace(/<\//g, '<\\/'); // safe to inline in <script>
const tpl = fs.readFileSync(DIR + '/template.html', 'utf8');
if (!tpl.includes('/*__DATA__*/[]')) throw new Error('template.html missing /*__DATA__*/[] placeholder');
fs.writeFileSync(DIR + '/index.html', tpl.replace('/*__DATA__*/[]', json));
console.log('built index.html:', merged.length, 'gems |', merged.filter(m => !m.support).length, 'skills |',
  merged.filter(m => m.support).length, 'supports |', withQuality, 'with quality |',
  merged.filter(m => m.gemling).length, 'distinct gemling');
