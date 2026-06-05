// Parse poe2db's Advanced Thaumaturgy page (cached HTML) into authoritative Gemling quality text.
// Each gem appears as: href="/us/Slug">Title</a></div><div class="secondaryQualityMod">...effect...</div>
// Usage: node parse-poe2db-gemling.mjs   ->   poe2db-gemling.json
import fs from 'fs';

const html = fs.readFileSync(`${process.cwd()}/raw/advanced_thaumaturgy.html`, 'utf8');

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&#039;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

const stripTags = s => decode(
  s.replace(/<span class="ndash">—<\/span>/g, '—')  // keep the en-dash in ranges
   .replace(/<[^>]+>/g, '')                           // drop all remaining tags, keep their text
).replace(/\s+/g, ' ').trim();

// Anchor immediately followed by one or more secondaryQualityMod divs.
const re = /href="\/us\/([^"]+)">([^<]+)<\/a><\/div>((?:<div class="secondaryQualityMod">.*?<\/div>)+)/gs;
const inner = /<div class="secondaryQualityMod">(.*?)<\/div>/gs;

const out = [];
let m;
while ((m = re.exec(html))) {
  const slug = m[1], title = decode(m[2]).trim();
  const parts = [];
  let d;
  while ((d = inner.exec(m[3]))) parts.push(stripTags(d[1]));
  inner.lastIndex = 0;
  out.push({ slug, title, gemlingText: parts.filter(Boolean).join(' · ') });
}

fs.writeFileSync(`${process.cwd()}/poe2db-gemling.json`, JSON.stringify(out));
console.log('gemling effects parsed:', out.length, '| multi-part:', out.filter(o => o.gemlingText.includes(' · ')).length);
for (const s of ['Hammer of the Gods', 'Arc', 'Incinerate', 'Cold Snap', 'Eye of Winter']) {
  const o = out.find(x => x.title === s);
  console.log('  ', s, '->', o ? o.gemlingText : '(NOT FOUND)');
}
