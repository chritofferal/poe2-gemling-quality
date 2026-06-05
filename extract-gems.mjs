// Extract the full gem master list from Path of Building (PoE2) into gems-data.json.
// Pulls: name, type, tags, weapon, attribute reqs, tier, max level, level requirement,
// description, and sub-skill descriptions (additional stat sets). Requires a local PoB checkout.
// Usage: node extract-gems.mjs
import fs from 'fs';

const POB = 'C:/Users/chris/Desktop/PathOfBuilding-PoE2-dev/src/Data';
const SKILL_FILES = ['act_str','act_dex','act_int','sup_str','sup_dex','sup_int','other','minion','spectre'];

// ---- 1) granted-effect map: id -> { desc, actorLevels[], levelReqs[] } ----
const effect = {};
for (const f of SKILL_FILES) {
  const txt = fs.readFileSync(`${POB}/Skills/${f}.lua`, 'utf8');
  const parts = txt.split('skills["');
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const key = p.slice(0, p.indexOf('"]'));
    if (!key || effect[key]) continue;
    const dm = p.match(/\bdescription = "(.*?)",\r?\n/);
    const nm = p.match(/\bname = "([^"]*)"/);
    const al = [...p.matchAll(/actorLevel = ([\d.]+)/g)].map(m => +m[1]);
    const lr = [...p.matchAll(/levelRequirement = (\d+)/g)].map(m => +m[1]);
    const labels = [...new Set([...p.matchAll(/\blabel = "([^"]*)"/g)].map(m => m[1]))];
    effect[key] = { name: nm ? nm[1] : '', desc: dm ? dm[1] : '', al, lr, labels };
  }
}

// ---- 2) parse Gems.lua ----
const lua = fs.readFileSync(`${POB}/Gems.lua`, 'utf8');
const blocks = lua.split('["Metadata/Items/Gems/').slice(1);
const get = (b, re) => { const m = b.match(re); return m ? m[1] : ''; };
const num = (b, re) => { const m = b.match(re); return m ? +m[1] : 0; };

const seen = new Set();
const gems = [];
for (const b of blocks) {
  const name = get(b, /\bname = "([^"]*)"/);
  if (!name) continue;
  const k = name.toLowerCase();
  if (seen.has(k)) continue;
  seen.add(k);
  const gemType = get(b, /\bgemType = "([^"]*)"/);
  const gid = get(b, /\bgrantedEffectId = "([^"]*)"/);
  const add1 = get(b, /\badditionalStatSet1 = "([^"]*)"/);
  const add2 = get(b, /\badditionalStatSet2 = "([^"]*)"/);
  const maxLevel = num(b, /\bnaturalMaxLevel = (\d+)/) || 20;
  const e = effect[gid] || {};

  // level requirement at the gem's natural max level
  let levelReq = 0;
  const ladder = (e.al && e.al.length) ? e.al : (e.lr && e.lr.length ? e.lr : []);
  if (ladder.length) levelReq = Math.round(ladder[Math.min(maxLevel, ladder.length) - 1]);

  // sub-parts: additional stat-set variants/forms of the same skill (e.g. "Ice Nova on Frostbolt")
  const subParts = (e.labels || []).filter(l => l && l !== name && l !== get(b, /\bbaseTypeName = "([^"]*)"/));

  gems.push({
    name,
    support: gemType === 'Support',
    gemType,
    tags: get(b, /\btagString = "([^"]*)"/),
    weapon: get(b, /\bweaponRequirements = "([^"]*)"/),
    str: num(b, /\breqStr = (\d+)/),
    dex: num(b, /\breqDex = (\d+)/),
    int: num(b, /\breqInt = (\d+)/),
    tier: num(b, /\bTier = (\d+)/),
    maxLevel,
    levelReq,
    desc: e.desc || '',
    subParts,
    id: gid,
  });
}

fs.writeFileSync(`${process.cwd()}/gems-data.json`, JSON.stringify(gems));
console.log('gems:', gems.length, '| skills:', gems.filter(g=>!g.support).length, '| supports:', gems.filter(g=>g.support).length);
console.log('with description:', gems.filter(g=>g.desc).length, '| with sub-parts:', gems.filter(g=>g.subParts.length).length, '| with levelReq>0:', gems.filter(g=>g.levelReq>0).length);
const h = gems.find(g=>g.name==='Hammer of the Gods');
console.log('SAMPLE HotG:', JSON.stringify({name:h.name,str:h.str,dex:h.dex,int:h.int,tier:h.tier,maxLevel:h.maxLevel,levelReq:h.levelReq,desc:h.desc.slice(0,70)+'...'}));
const subs = gems.filter(g=>g.subParts.length);
if (subs.length) subs.slice(0,4).forEach(s=>console.log('  sub-parts:', s.name, '->', s.subParts.join(' | ')));
else console.log('no sub-parts captured');
