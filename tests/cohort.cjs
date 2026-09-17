const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  try {
    await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8766');
    assert.equal((await page.locator('h1').innerText()).replace(/\s+/g,' ').trim(), 'Know the pattern. Change what happens next.', 'Approved cohort outcome headline');
    const explore = page.getByRole('link', {name:'Explore the cohort', exact:true});
    assert.equal(await explore.getAttribute('href'), '#cohort');
    await explore.click();
    assert.equal(new URL(page.url()).hash,'#cohort');
    assert.ok(await page.locator('#cohort').isVisible());
    await page.waitForFunction(()=>{const r=document.querySelector('#cohort').getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;});
    console.log('PASS primary journey: outcome headline and cohort navigation');
    for (const id of ['pattern','practice','roadmap','takeaways','coach','fit','stories','questions']) {
      assert.equal(await page.locator(`#${id}`).count(),1,`Required cohort section: ${id}`);
      assert.ok(await page.locator(`#${id} h2`).innerText());
    }
    const text=await page.locator('body').innerText();
    for(const phrase of ['fictional scenarios','pass on an exercise','do not counsel','selected coaching','independently','previous coaching, not results from this cohort']) assert.ok(text.includes(phrase),`Required boundary: ${phrase}`);
    assert.equal(await page.locator('video[controls][playsinline][preload="none"]').count(),2);
    assert.equal(await page.locator('video[autoplay]').count(),0);
    assert.ok(text.includes('I’m living the life that I said I wanted to live.'));
    const stories=await page.locator('.story').all();
    assert.ok((await stories[0].innerText()).includes('Before: stuck and drained'));
    assert.ok((await stories[1].innerText()).includes('Before: defending instead of listening'));
    assert.ok(text.includes('She talks about leaving a toxic environment, building boundaries, and making choices she used to postpone.'));
    assert.ok(text.includes('Alex describes a shift that showed up in marriage, family, friendships, and work: less defending, more responsibility, better listening.'));
    assert.ok(!text.includes('Joseph'));
    assert.equal(await stories[0].locator('source').getAttribute('src'),'assets/testimonials/testimonial-01.mp4');
    assert.ok(text.includes('I was listening to justify my actions instead of listening to understand.'));
    console.log('PASS cohort explanation: practice, roadmap, outputs, fit, boundaries and sourced client stories');
    assert.ok(text.includes('Relationship Operating System'),'Named pattern mechanism');
    assert.ok(text.includes('A repair process'),'Repair takeaway');
    assert.ok(text.includes('A continuing-practice plan'),'Continuing-practice takeaway');
    assert.equal(await page.getByRole('link',{name:'Private coaching'}).getAttribute('href'),'https://robertsawyer.co/');
    console.log('PASS relationship mechanism, repair, continuing practice and private-coaching route');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href',{timeout:1000}),'https://relationsync.co/');
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),'https://relationsync.co/coach.jpg');
    assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
    for (const width of [1440,390,320]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8766');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No page overflow at ${width}`);
      assert.deepEqual(await page.locator('h1,h2,h3,p,li,blockquote,.button').evaluateAll(es=>es.filter(e=>e.clientWidth && e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)),[],`No text container overflow at ${width}`);
      for(const summary of await page.locator('summary').all()) {
        await summary.focus();await page.keyboard.press('Enter');
        assert.equal(await summary.locator('..').getAttribute('open'),'');
        await page.keyboard.press('Enter');
        assert.equal(await summary.locator('..').getAttribute('open'),null);
      }
      const mail=new URL(await page.getByRole('link',{name:'Email Robert about the cohort',exact:true}).getAttribute('href'));
      assert.equal(mail.pathname,'robertsawyerco@gmail.com');
      assert.equal(mail.searchParams.get('subject'),'RelationSync cohort inquiry');
      await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});
      if(width!==320) await page.screenshot({path:`/tmp/relationsync-cohort-${width===1440?'desktop':'mobile'}.png`,fullPage:true});
      console.log(`PASS ${width}px: text containment, keyboard FAQs, email URI${width!==320?', screenshot saved':''}`);
    }
    const source=await page.content();
    assert.ok(!/[—–]/.test(source),'No em or en dashes');
    assert.ok(!/stan\.store|\$1,197|Weekly Voice|Apply for Attachment Reset|this investment ends the cycle/i.test(source),'Retired claims removed');
    assert.equal(await page.locator('script').count(),0,'No tracking or JS dependency');
    const assets=await page.locator('img,video,source,link[rel="stylesheet"]').evaluateAll(es=>es.flatMap(e=>[e.getAttribute('src'),e.getAttribute('poster'),e.getAttribute('href')]).filter(Boolean));
    for(const asset of new Set(assets)) assert.equal((await page.request.get(new URL(asset,page.url()).href)).status(),200,`Local asset ${asset}`);
    console.log('PASS metadata, local assets, retired-claim regressions and no-JS architecture');
  } finally { await browser.close(); }
})().catch(error=>{ console.error(error);process.exitCode=1; });
