// Build index.html from authoritative sources:
//   gems-data.json      -- all gem metadata + NORMAL quality (from Path of Building)
//   poe2db-gemling.json -- GEMLING (Advanced Thaumaturgy) quality display text (from poe2db)
//   template.html       -- page shell with a `const DATA=/*__DATA__*/[];` placeholder
// (The old community spreadsheet quality-data.json is retired.)
import fs from 'fs';

const DIR = process.cwd();
const gems = JSON.parse(fs.readFileSync(`${DIR}/gems-data.json`, 'utf8'));
const gemling = JSON.parse(fs.readFileSync(`${DIR}/poe2db-gemling.json`, 'utf8'));

const norm = s => (s || '').toLowerCase().replace(/['’]/g, '').replace(/\s+/g, ' ').trim();
const gByName = {};
for (const g of gemling) gByName[norm(g.title)] = g.gemlingText;

let gemMatched = 0;
const merged = gems.map(gem => {
  const gText = gByName[norm(gem.name)] || '';
  if (gText) gemMatched++;
  return {
    name: gem.name,
    support: gem.support,
    tags: gem.tags || '',
    weapon: gem.weapon || 'Any / no weapon req',
    str: gem.str, dex: gem.dex, int: gem.int,
    tier: gem.tier, maxLevel: gem.maxLevel, levelReq: gem.levelReq,
    desc: gem.desc || '', subParts: gem.subParts || [],
    gemling: !!gText, gText,
    nStat: gem.nStat || '', nVal: gem.nVal || 0, nText: gem.nText || '',
  };
}).sort((a, b) => a.name.localeCompare(b.name));

// reconciliation: poe2db gemling effects whose title didn't match any gem name
const gemNameSet = new Set(gems.map(g => norm(g.name)));
const orphanGemling = gemling.filter(g => !gemNameSet.has(norm(g.title))).map(g => g.title);

const json = JSON.stringify(merged).replace(/<\//g, '<\\/');
const tpl = fs.readFileSync(`${DIR}/template.html`, 'utf8');
if (!tpl.includes('/*__DATA__*/[]')) throw new Error('template.html missing /*__DATA__*/[] placeholder');
fs.writeFileSync(`${DIR}/index.html`, tpl.replace('/*__DATA__*/[]', json));

console.log('built index.html:', merged.length, 'gems |', merged.filter(m => !m.support).length, 'skills |',
  merged.filter(m => m.support).length, 'supports');
console.log('  gemling (poe2db):', merged.filter(m => m.gemling).length, '| matched', gemMatched, 'of', gemling.length,
  '| normal (PoB):', merged.filter(m => m.nText).length, '| descriptions:', merged.filter(m => m.desc).length);
if (orphanGemling.length) console.log('  ⚠ poe2db gemling not matched to a gem (' + orphanGemling.length + '):', orphanGemling.join(', '));
