import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const PORT=Number(process.env.PORT||3000), ROOT=path.resolve('public');
const hits=new Map();
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
function send(res,status,data){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));}
function equal(a,b){const x=crypto.createHash('sha256').update(a).digest(),y=crypto.createHash('sha256').update(b).digest();return crypto.timingSafeEqual(x,y)}
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/health')return send(res,200,{ok:true,version:'1.0.0'});
 if(url.pathname==='/api/chat'){
  if(req.method!=='POST')return send(res,405,{error:'POST required'});
  const key=process.env.OPENAI_API_KEY,pass=process.env.NEXORA_ACCESS_PASSWORD;
  if(!key||!pass)return send(res,503,{error:'Configure OPENAI_API_KEY and NEXORA_ACCESS_PASSWORD on the server.'});
  if(!equal(String(req.headers['x-nexora-password']||''),pass))return send(res,401,{error:'Incorrect access password.'});
  const ip=req.socket.remoteAddress||'unknown',now=Date.now();let entry=hits.get(ip);
  if(!entry||now-entry.since>3600000)entry={since:now,count:0};entry.count++;hits.set(ip,entry);
  if(hits.size>5000)for(const [k,v] of hits)if(now-v.since>3600000)hits.delete(k);
  if(entry.count>30)return send(res,429,{error:'Hourly request limit reached.'});
  try{
   let raw='';for await(const part of req){raw+=part;if(raw.length>30000)return send(res,413,{error:'Request too large.'})}
   const data=JSON.parse(raw);
   if(!Array.isArray(data.messages))return send(res,400,{error:'Invalid messages.'});
   const messages=data.messages.slice(-14).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string').map(m=>({role:m.role,content:m.content.slice(0,4000)}));
   if(!messages.length||messages.at(-1).role!=='user')return send(res,400,{error:'Enter a message.'});
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);let response;
   try{response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+key},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:'You are NEXORA AI, a thoughtful, accurate, multilingual assistant skilled in reasoning and programming. Explain clearly, admit uncertainty, and respond in the user\'s requested language. Created by Dudekula Ayaan ahammad.'},...messages],max_tokens:1000}),signal:controller.signal})}finally{clearTimeout(timer)}
   if(!response.ok)return send(res,502,{error:'AI service unavailable. Check model, API credits and configuration.'});
   const result=await response.json();return send(res,200,{reply:result.choices?.[0]?.message?.content||'No response returned.'});
  }catch(e){return send(res,500,{error:e.name==='AbortError'?'AI response timed out.':'Request failed. Please try again.'})}
 }
 if(!['GET','HEAD'].includes(req.method))return send(res,405,{error:'Method not allowed.'});
 let decoded;try{decoded=decodeURIComponent(url.pathname)}catch{return send(res,400,{error:'Bad path.'})}
 const target=path.resolve(ROOT,'.'+(decoded==='/'?'/index.html':decoded));
 if(target!==ROOT&&!target.startsWith(ROOT+path.sep))return send(res,403,{error:'Forbidden.'});
 try{const content=await fs.readFile(target);res.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream','cache-control':decoded==='/sw.js'?'no-cache':'public, max-age=300'});res.end(req.method==='HEAD'?undefined:content)}catch{send(res,404,{error:'Not found.'})}
}).listen(PORT,'0.0.0.0',()=>console.log('NEXORA AI running on port '+PORT));
