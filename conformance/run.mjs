#!/usr/bin/env node
/**
 * The ArchCode conformance suite.
 *
 *   node run.mjs [--engine <module>] [--only <substring>] [--json]
 *
 * Every fixture under valid/ and invalid/ is an ArchCode document whose first
 * comment lines say what a conforming implementation must produce from it:
 *
 *   # conformance: valid — <what the fixture exercises, and the spec section>
 *   # expect: objects=3 relations=1 placements=0
 *   # expect: diagnostics=none                        (or AC104:info@7, AC005:warning@3, …)
 *
 * Three things are checked for each: the model counts, the diagnostics —
 * code, severity and line, exactly — and that serialising the parsed tree
 * gives the source back byte for byte (§12.1; it holds for invalid input too).
 *
 * `--engine` names the implementation: any ES module exporting
 * `parse(src) → { doc, diagnostics }`, `lower(doc) → { objects, relations,
 * placements }`, `check(doc, model) → diagnostics[]` and `serialize(doc)`.
 * The default is the reference engine, `@archcode-io/engine`.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const engineName = opt('engine', '@archcode-io/engine');
const only = opt('only', '');
const json = args.includes('--json');

const spec = engineName.startsWith('.') ? pathToFileURL(join(process.cwd(), engineName)).href : engineName.startsWith('/') ? pathToFileURL(engineName).href : engineName;
const { parse, lower, check, serialize } = await import(spec);

function expectations(src) {
  const e = { kind: null, counts: {}, diagnostics: null };
  for (const line of src.split('\n')) {
    const m = line.match(/^#\s*(conformance|expect):\s*(.*)$/);
    if (!m) { if (!line.startsWith('#') && line.trim()) break; continue; }
    if (m[1] === 'conformance') { e.kind = m[2].split(/\s/)[0]; continue; }
    for (const [, k, v] of m[2].matchAll(/(\w+)=(\S+)/g)) {
      if (k === 'diagnostics') e.diagnostics = v === 'none' ? [] : v.split(',');
      else e.counts[k] = +v;
    }
  }
  return e;
}

const results = [];
for (const dir of ['valid', 'invalid']) {
  for (const f of readdirSync(join(here, dir)).filter(f => f.endsWith('.arch')).sort()) {
    const name = `${dir}/${f}`;
    if (only && !name.includes(only)) continue;
    const src = readFileSync(join(here, dir, f), 'utf8');
    const want = expectations(src);
    const problems = [];
    let got = {};
    try {
      const { doc, diagnostics } = parse(src);
      const m = lower(doc);
      const ds = [...diagnostics, ...check(doc, m)].map(d => `${d.code}:${d.severity}@${d.line}`);
      got = { objects: m.objects.size ?? m.objects.length, relations: m.relations.length, placements: m.placements.length, diagnostics: ds };
      for (const [k, v] of Object.entries(want.counts)) if (got[k] !== v) problems.push(`${k}: expected ${v}, got ${got[k]}`);
      if (want.diagnostics) {
        const a = [...want.diagnostics].sort().join(' '), b = [...ds].sort().join(' ');
        if (a !== b) problems.push(`diagnostics: expected [${a || 'none'}], got [${b || 'none'}]`);
      }
      if (want.kind === 'valid' && ds.some(d => d.includes(':error@'))) problems.push('a valid document reported an error');
      if (want.kind === 'invalid' && !ds.length) problems.push('an invalid document reported nothing');
      if (serialize(doc) !== src) problems.push('does not round-trip byte for byte');
    } catch (err) { problems.push(`threw: ${String(err).slice(0, 200)}`); }
    results.push({ name, ok: !problems.length, problems, got });
  }
}

const failed = results.filter(r => !r.ok);
if (json) console.log(JSON.stringify({ engine: engineName, passed: results.length - failed.length, failed: failed.length, results }, null, 1));
else {
  for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name}${r.ok ? '' : '\n      ' + r.problems.join('\n      ')}`);
  console.log(`\n${results.length - failed.length}/${results.length} fixtures pass · engine: ${engineName}`);
}
process.exit(failed.length ? 1 : 0);
