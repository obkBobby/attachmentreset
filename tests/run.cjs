const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html','.css':'text/css','.jpg':'image/jpeg','.mp4':'video/mp4','.svg':'image/svg+xml','.ico':'image/x-icon','.png':'image/png'};
const server = http.createServer((req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,'http://local').pathname);
  const target = path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');
  fs.createReadStream(target).pipe(res);
});
function run(file, base) {
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[path.join(__dirname,file)],{stdio:'inherit',env:{...process.env,SITE_URL:base}});
    child.once('error',reject);
    child.once('exit',code=>code===0?resolve():reject(new Error(`${file} exited ${code}`)));
  });
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const base=`http://127.0.0.1:${server.address().port}`;
    await run('cohort.cjs',base);
    await run('release-audit.cjs',base);
    await run('visual-direction.cjs',base);
  } finally { await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);process.exitCode=1;});
