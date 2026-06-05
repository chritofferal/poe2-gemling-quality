// Build index.html from the vendored gem data (PoB) + verified quality data (spreadsheet).
// Usage: node build.mjs
//   gems-data.json    -- full gem data from Path of Building (run extract-gems.mjs to refresh)
//   quality-data.json -- verified Gemling/normal quality (community spreadsheet, validated vs poe2db)
//   template.html     -- page shell with a `const DATA=/*__DATA__*/[];` placeholder
import fs from 'fs';

const DIR = process.cwd();
const gems = JSON.parse(fs.readFileSync(`${DIR}/gems-data.json`, 'utf8'));
const quality = JSON.parse(fs.readFileSync(`${DIR}/quality-data.json`, 'utf8'));

const byId = {}, byName = {};
for (const q of quality) { if (q.id) byId[q.id.toLowerCase()] = q; byName[q.skill.toLowerCase().trim()] = q; }

// Placeholder / internal stats that are not real player-facing quality effects -> treat as "no quality".
const TECH = /^(dummy_stat_display_nothing|display_.+|.+_override(_ms)?|skill_desired_amount.*)$/;
let blanked = 0;
const clean = (stat, val) => {
  if (stat && TECH.test(stat.split('|')[0].trim())) { blanked++; return ['', '']; }
  return [stat || '', val || ''];
};

const merged = gems.map(g => {
  const q = (g.id && byId[g.id.toLowerCase()]) || byName[g.name.toLowerCase().trim()];
  const [gStat, gVal] = clean(q ? q.gStat : '', q ? q.gVal : '');
  const [nStat, nVal] = clean(q ? q.nStat : '', q ? q.nVal : '');
  return {
    name: g.name,
    support: g.support,
    tags: g.tags || '',
    weapon: g.weapon || 'Any / no weapon req',
    str: g.str, dex: g.dex, int: g.int,
    tier: g.tier, maxLevel: g.maxLevel, levelReq: g.levelReq,
    desc: g.desc || '',
    subParts: g.subParts || [],
    gemling: !!gStat && q ? !!q.gemling : false,
    gStat, gVal, nStat, nVal,
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const withQuality = merged.filter(m => m.gStat || m.nStat).length;
const json = JSON.stringify(merged).replace(/<\//g, '<\\/');
const tpl = fs.readFileSync(`${DIR}/template.html`, 'utf8');
if (!tpl.includes('/*__DATA__*/[]')) throw new Error('template.html missing /*__DATA__*/[] placeholder');
fs.writeFileSync(`${DIR}/index.html`, tpl.replace('/*__DATA__*/[]', json));
console.log('built index.html:', merged.length, 'gems |', merged.filter(m => !m.support).length, 'skills |',
  merged.filter(m => m.support).length, 'supports |', withQuality, 'with quality |',
  merged.filter(m => m.gemling).length, 'distinct gemling |', merged.filter(m => m.desc).length, 'with description |',
  blanked, 'technical stats filtered');
