// One-off: ripulisce gli articoli importati (titoli accordion, sezione FAQ -> front matter `faq`).
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(import.meta.dirname, '../src/content/articoli');
for (const f of fs.readdirSync(dir)) {
  const file = path.join(dir, f);
  const t = fs.readFileSync(file, 'utf8');
  const [, fm, bodyRaw] = t.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  let body = bodyRaw
    .replace(/^(#{2,6}) (.*)$/gm, (_, h, txt) => `${h} ${txt.replace(/\*+/g, '').replace(/\+$/, '').trim()}`)
    .replace(/^# /gm, '## ');
  let faqYaml = '';
  const m = body.match(/\n## (?:Domande frequenti|FAQ)[^\n]*\n([\s\S]*?)(?=\n## |$)/i);
  if (m) {
    const items = [...m[1].matchAll(/### (.+)\n\n([\s\S]*?)(?=\n### |$)/g)].map((x) => ({
      q: x[1].trim(),
      a: x[2].replace(/\s*\n+\s*/g, ' ').replace(/\*\*/g, '').trim(),
    }));
    if (items.length) {
      body = body.replace(m[0], '');
      faqYaml = 'faq:\n' + items.map((i) => `  - q: ${JSON.stringify(i.q)}\n    a: ${JSON.stringify(i.a)}`).join('\n');
    }
  }
  fs.writeFileSync(file, `---\n${fm}${faqYaml ? '\n' + faqYaml : ''}\n---\n\n${body.replace(/\n{3,}/g, '\n\n').trim()}\n`);
  console.log(f.slice(0, 50), 'faq:', faqYaml ? (faqYaml.match(/- q:/g) || []).length : 0);
}
