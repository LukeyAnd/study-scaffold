// Optional local server for a stable localhost storage origin. No dependencies.
const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.md':'text/plain'};
const server=http.createServer((req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');const decoded=decodeURIComponent(url.pathname);
    const filename=path.resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
    const relative=path.relative(root,filename);
    if(relative.startsWith('..')||path.isAbsolute(relative)||relative.split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403);res.end('Forbidden');return;}
    fs.readFile(filename,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);});
  }catch(_){res.writeHead(400);res.end('Bad request');}
});
const portIndex=process.argv.indexOf('--port');
const port=Number(portIndex>=0?process.argv[portIndex+1]:process.env.PORT??4173);
if(!Number.isInteger(port)||port<0||port>65535){console.error('Choose a port from 0 to 65535 with --port NUMBER.');process.exitCode=1;}
else{
  server.on('error',error=>{console.error(`Cannot open preview port ${port}: ${error.code||error.message}. Keep an existing SoS preview open or choose --port NUMBER.`);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`SoS preview: http://127.0.0.1:${server.address().port} (Ctrl+C to stop)`));
}
