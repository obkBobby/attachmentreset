const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html','.css':'text/css','.jpg':'image/jpeg','.mp4':'video/mp4','.js':'text/javascript','.svg':'image/svg+xml','.ico':'image/x-icon','.png':'image/png'};
const server = http.createServer((req,res)=>{
 const pathname = decodeURIComponent(new URL(req.url,'http://local').pathname);
 const target = path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');
 fs.createReadStream(target).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch();
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'networkidle'});
   const content=await page.locator('body').innerText();
   assert.equal(await page.locator('h1').count(),1,'one main heading');
   assert.match(content,/single/i);assert.match(content,/partnered/i);
   assert.doesNotMatch(content,/Weekly Voice|\$1,197|Apply for Attachment Reset|this investment ends the cycle/i);
   assert(!content.includes('—'),'No em dashes');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
   const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src)); assert.deepEqual(broken,[]);
   const links=await page.locator('a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.innerText})));
   for(const a of links){
    assert(a.href&&a.href!=='#',`placeholder link: ${a.text}`);
    assert(!a.href.includes('stan.store'),'retired Stan link');
    if(a.href.startsWith('#')) assert.equal(await page.locator(a.href).count(),1,`anchor ${a.href}`);
    if(a.href.startsWith('mailto:')){ assert.match(a.href,/mailto:robertsawyerco@gmail.com/);assert.match(a.href,/subject=/);assert.match(a.text,/email|robertsawyerco@gmail\.com/i); }
   }
   assert.deepEqual(errors,[]);
   console.log(`PASS independent release audit ${width}px: content, anchors, images, overflow, inquiry truthfulness, JS errors`);
   await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage(); await page.goto(base);
  const details=page.locator('details').first();assert(await details.count()>0,'native FAQ exists');
  await details.locator('summary').focus();await page.keyboard.press('Enter');
  assert.equal(await details.getAttribute('open'),'','FAQ opens with keyboard without JavaScript');
  assert(await page.locator('h1').isVisible());
  console.log('PASS JavaScript-disabled content and keyboard FAQ');await context.close();
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
