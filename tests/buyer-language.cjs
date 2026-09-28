const fs=require('node:fs');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const baseline='55b690d55bdab7cf7d04092e95ba26c6e5c8ba7b';
const before=cp.execFileSync('git',['show',`${baseline}:index.html`],{encoding:'utf8'});
const after=fs.readFileSync('index.html','utf8');
for(const phrase of ['Still stuck on an ex','right relationship','same relationship problems']) assert.ok(after.includes(phrase),`Buyer recognition: ${phrase}`);
assert.ok(after.includes('Same fights.<br>Same doubts.<br>What comes<br>next?'),'Buyer-led headline');
const stories=s=>s.match(/<section class="stories-section"[\s\S]*?<\/section>/)[0];
assert.equal(stories(after),stories(before),'Testimonials exact');
const tags=s=>s.match(/<[^>]+>/g).map(t=>/^<meta (name="description"|property="og:(title|description)")/.test(t)?t.replace(/content="[^"]*"/,'content="COPY"'):t);
assert.deepEqual(tags(after),tags(before),'Identical markup, layout, links, forms, assets, metadata except approved copy');
const faq=s=>s.match(/<section class="section wrap faq-grid"[\s\S]*?<\/section>/)[0];
assert.equal(faq(after),faq(before),'All FAQ terms unchanged');
for(const cls of ['session-flow','inquiry-panel','dashboard-grid']){
const re=new RegExp(`<[^>]+class="${cls}"[\\s\\S]*?</(?:ol|dl|div)>`);
assert.equal(after.match(re)[0],before.match(re)[0],`${cls} preserved`);
}
assert.deepEqual(after.match(/\$[\d,]+/g),before.match(/\$[\d,]+/g),'Prices unchanged');
const paths=cp.execFileSync('git',['ls-tree','-r','--name-only',baseline],{encoding:'utf8'}).trim().split('\n');
for(const p of paths.filter(p=>!['index.html','tests/cohort.cjs'].includes(p))) assert.deepEqual(fs.readFileSync(p),cp.execFileSync('git',['show',`${baseline}:${p}`],{maxBuffer:50*1024*1024}),`Unchanged ${p}`);
console.log('PASS buyer language; exact structure, stories, terms, prices, links, assets and all other baseline files');
