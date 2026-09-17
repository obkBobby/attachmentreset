const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{const b=await chromium.launch();try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto(process.env.SITE_URL || 'file://'+path.resolve(__dirname,'../index.html'));
 const icons=await p.locator('link[rel="icon"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 assert(icons.includes('favicon.svg'),'SVG favicon must be declared');
 assert(icons.includes('favicon.ico'),'ICO favicon fallback must be declared');
 for(const file of ['favicon.svg','favicon.ico','apple-touch-icon.png']){
  assert(fs.statSync(path.resolve(__dirname,'..',file)).size>0,`favicon asset ${file}`);
  if(process.env.SITE_URL)assert.equal((await p.request.get(new URL(file,p.url()).href)).status(),200,`favicon HTTP ${file}`);
 }
 assert.equal(await p.locator('link[rel="apple-touch-icon"]').getAttribute('href'),'apple-touch-icon.png');
 const heading=await p.locator('h1').evaluate(e=>({font:getComputedStyle(e).fontFamily,size:parseFloat(getComputedStyle(e).fontSize),weight:getComputedStyle(e).fontWeight}));
 assert(/Arial|Helvetica/.test(heading.font),'Reference sans-serif headline, not Georgia');
 assert(heading.size>=90&&heading.size<=100,'Reference-sized desktop headline');
 assert(Number(heading.weight)>=800,'Heavy reference headline');
 const h1box=await p.locator('h1').boundingBox();
 assert(Math.abs(h1box.x-100)<=8,'Reference desktop left edge at 100px');
 const button=await p.getByRole('link',{name:'Explore the cohort',exact:true}).evaluate(e=>getComputedStyle(e).backgroundColor);
 assert.equal(button,'rgb(0, 52, 227)','RSCo electric-blue primary button');
 const order=await p.locator('main section[id]').evaluateAll(es=>es.map(e=>e.id));
 assert(order.indexOf('stories')<order.indexOf('pattern'),'Reference proof-first order');
 assert(order.indexOf('coach')<order.indexOf('roadmap'),'Reference black method section precedes roadmap');
 assert(order.indexOf('questions')<order.indexOf('cohort'),'Reference final blue invitation follows FAQs');
 const css=fs.readFileSync(path.resolve(__dirname,'../styles.css'),'utf8');
 assert(!/#(?:F5F0E8|FAF7F2|C1654A|A0502E|C4B8A8)/i.test(css),'Superseded warm palette absent');
 console.log('PASS reference layout direction, RSCo palette, heavy sans hierarchy, favicon assets');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
