(function(){
'use strict';
var S=window.SITE;
var URL_PLATE=S.images.plate,URL_CASE=S.images.casePlate,URL_CUT=S.images.cutout,URL_BADGE=S.images.badge,URL_TRANS=S.video.transition;
var CASES=S.cases;

var $=function(id){return document.getElementById(id)};
var root=document.documentElement,body=document.body;
var stage=$('stage'),frame=$('frame'),plate=$('plate'),cut=$('cut'),caseplate=$('caseplate'),trans=$('trans'),
    wm=$('wm'),script=$('script'),badge=$('badge'),screen=$('screen'),flash=$('flash'),hit=$('hit'),
    ticket=$('ticket'),desc=$('desc'),hint=$('hint'),mWm=$('mWm'),mScript=$('mScript'),mBadgeBox=$('mBadgeBox');
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var D=function(ms){return RM?0:ms};
var EASE='cubic-bezier(.2,.8,.2,1)';
var wait=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var raf2=function(){return new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r)})})};
var isMobile=function(){return window.innerWidth<=820};

/* images */
plate.src=URL_PLATE;cut.src=URL_CUT;caseplate.src=URL_CASE;$('badgeImg').src=URL_BADGE;
document.querySelector('.card .ph').style.backgroundImage='url("'+URL_CUT+'")';
frame.classList.add(isMobile()?'m-fade':'d-fade');

/* mobile badge clone */
var mBadge=badge.cloneNode(true);
mBadge.removeAttribute('id');
mBadge.querySelectorAll('[id]').forEach(function(e){e.removeAttribute('id')});
mBadge.classList.remove('pre');mBadge.classList.add('pre');
mBadgeBox.appendChild(mBadge);

/* case videos */
var vids=CASES.map(function(c,i){
  var v=document.createElement('video');
  v.crossOrigin='anonymous';v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');
  v.preload=i===0?'auto':'none';v.src=c.v;
  screen.insertBefore(v,flash);return v;
});
function preload(i){var v=vids[i];if(!v)return;v.preload='auto';if(v.networkState===0||v.networkState===3)v.load();}
function playOnly(i){
  vids.forEach(function(v,k){if(k!==i)v.pause()});
  var v=vids[i];try{v.currentTime=0}catch(e){}
  var p=v.play();if(p&&p.catch)p.catch(function(){});
}

/* transition clip -> blob */
var transReady=false;
trans.addEventListener('loadeddata',function(){transReady=true});
fetch(URL_TRANS).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){trans.src=URL.createObjectURL(b)})
 .catch(function(){trans.src=URL_TRANS});

/* state */
var mode='hero',cur=0,busy=false,locked=false;

/* ---------- frame fitting ---------- */
function setN(){
  var W=innerWidth,H=innerHeight;
  var n=isMobile()?W/430:Math.min(W/1440,H/900);
  root.style.setProperty('--n',n+'px');
}
function pose(m){
  var W=innerWidth,H=innerHeight,s,x,y;
  if(!isMobile()){
    var cover=Math.max(W/1440,H/810),u=Math.min(W/1440,H/900);
    if(m==='hero'){s=cover;x=(W-1440*s)/2;y=0}
    else{
      var top=66*u,fit=(H-top-28*u)/(762-79);
      if(fit>=cover){s=cover;y=Math.min(0,Math.max(H-810*s,top-79*s))}
      else{s=fit;y=top-79*fit}
      x=(W-1440*s)/2;
    }
  }else{
    if(m==='hero'){s=Math.min(W/650,.62*H/810);x=W/2-805*s;y=H-790*s}
    else{
      var navH=.022*H+42+22;
      var uiBottom=62+ticket.offsetHeight+18+Math.max(60,desc.offsetHeight)+14;
      s=Math.min((W-28)/905,Math.max(.2,(H-navH-uiBottom)/(762-95)));
      x=W/2-720*s;y=H-navH-762*s;
    }
  }
  return {s:s,x:x,y:y};
}
function fitHero(p){
  if(isMobile())return;
  var W=innerWidth,H=innerHeight,s=p.s,x=p.x,y=p.y;
  var vl=Math.max(0,-x/s),vr=Math.min(1440,(W-x)/s),pad=18/s;
  wm.style.left=(vl+.6*pad)+'px';
  wm.style.width=(vr-vl-1.2*pad)+'px';
  badge.style.left=Math.min(986,vr-pad-417)+'px';
  var vb=Math.min(810,(H-y)/s);
  badge.style.top=Math.min(-165,vb-56/s-935)+'px';
  script.style.left=(vl+pad+70)+'px';
}
function place(m){
  var p=pose(m);
  frame.style.transform='translate('+p.x+'px,'+p.y+'px) scale('+p.s+')';
  frame.classList.toggle('m-case',m==='case');
  stage.classList.toggle('m-case',m==='case');
  if(isMobile()){
    root.style.setProperty('--mbs',(innerWidth*.27/582));
    root.style.setProperty('--th',ticket.offsetHeight+'px');
  }
  if(m==='hero')fitHero(p);
}
function setGlide(sec){root.style.setProperty('--glide',sec+'s');frame.classList.add('glide')}
function endGlide(){frame.classList.remove('glide')}

/* ---------- hero element sets ---------- */
function H(){return isMobile()?{wm:mWm,script:mScript,badge:mBadge}:{wm:wm,script:script,badge:badge}}
function cancelAll(el){el.getAnimations().forEach(function(a){a.cancel()})}
var swayAnim=null;
function startSway(){
  var b=H().badge;
  if(RM)return;
  if(swayAnim)swayAnim.cancel();
  swayAnim=b.animate([{transform:'rotate(-1.1deg)'},{transform:'rotate(1.1deg)'}],{duration:3200,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
}
function stopSway(){if(swayAnim){swayAnim.cancel();swayAnim=null}}

/* ---------- entrance ---------- */
function enter(){
  if(root.dataset.in)return;root.dataset.in='1';
  var tags=[$('tStudio'),$('tPortfolio'),$('tContacts'),$('tDiscuss')];
  var h=H();
  document.querySelectorAll('.pre').forEach(function(e){e.classList.remove('pre')});
  if(RM){startSway();return}
  tags.forEach(function(t,i){
    t.animate([{opacity:0,transform:'translateY(-40px) rotate(-4deg)'},{opacity:1,transform:'none'}],
      {duration:700,delay:120+i*80,easing:'cubic-bezier(.3,1.5,.5,1)',fill:'both'});
  });
  h.wm.animate([{opacity:0,transform:'translateY(60px)',clipPath:'inset(100% 0 0 0)'},{opacity:1,transform:'none',clipPath:'inset(0)'}],
    {duration:1100,delay:260,easing:EASE,fill:'both'});
  h.script.animate([{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0)'}],
    {duration:900,delay:1050,easing:'cubic-bezier(.5,0,.3,1)',fill:'both'});
  var ba=h.badge.animate([
    {opacity:0,transform:'translateY(-120%) rotate(8deg)',offset:0},
    {opacity:1,transform:'translateY(0) rotate(-3deg)',offset:.6},
    {transform:'rotate(1.6deg)',offset:.8},
    {opacity:1,transform:'rotate(0)',offset:1}],
    {duration:1500,delay:700,easing:EASE,fill:'both'});
  ba.onfinish=function(){ba.cancel();if(mode==='hero'&&!busy)startSway()};
  hint.animate([{opacity:0},{opacity:.85}],{duration:600,delay:1800,fill:'both'});
}
function startEntrance(){
  var fontsP=(document.fonts&&document.fonts.ready)||Promise.resolve();
  var plateP=new Promise(function(r){
    if(plate.complete){r();return}
    plate.addEventListener('load',r);plate.addEventListener('error',r);
  });
  var all=Promise.all([fontsP,plateP]);
  Promise.race([all,wait(2500)]).then(function(){requestAnimationFrame(enter)});
  setTimeout(enter,4000);
}

/* hover swing */
hit.addEventListener('pointerenter',function(){
  if(mode!=='hero'||busy||RM||isMobile())return;
  badge.animate([{transform:'rotate(0)'},{transform:'rotate(-6deg)'},{transform:'rotate(4deg)'},{transform:'rotate(-2deg)'},{transform:'rotate(0)'}],
    {duration:1400,easing:'ease-out',composite:'add'});
});

/* ---------- case content ---------- */
function fillCase(i){
  var c=CASES[i];
  $('tTitle').textContent=c.title;
  $('tRows').innerHTML=c.rows.map(function(r){return '<div>'+r+'</div>'}).join('');
  $('dKey').textContent=c.key;
  $('dText').textContent=c.text;
  $('dNum').textContent=('0'+(i+1)).slice(-2)+' / 0'+CASES.length;
  $('prev').classList.toggle('dim',i===0);
}
function caseIn(i,first){
  cancelAll(ticket);
  ticket.animate([{opacity:0,transform:'translateY(-60px) rotate(-6deg)'},{opacity:1,transform:'translateY(6px) rotate(1.2deg)',offset:.7},{opacity:1,transform:'none'}],
    {duration:D(800),delay:first?D(150):0,easing:EASE,fill:'both'});
  Array.prototype.forEach.call(desc.children,function(ch,k){
    cancelAll(ch);
    ch.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],
      {duration:D(600),delay:D((first?250:80)+k*70),easing:EASE,fill:'both'});
  });
}
function caseOut(){
  ticket.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-40px) rotate(4deg)'}],
    {duration:D(380),easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  Array.prototype.forEach.call(desc.children,function(ch,k){
    ch.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-10px)'}],
      {duration:D(300),delay:D(k*40),easing:'ease-in',fill:'forwards'});
  });
  return wait(D(420));
}
function doFlash(peak,ms){
  cancelAll(flash);
  flash.animate([{opacity:0},{opacity:peak,offset:.3},{opacity:0}],{duration:D(ms),easing:'ease-out'});
}

/* ---------- hero -> case ---------- */
function heroOut(){
  var h=H();stopSway();
  [h.wm,h.script,h.badge].forEach(cancelAll);
  h.wm.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-40px)'}],{duration:D(380),easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  h.script.animate([{opacity:1},{opacity:0}],{duration:D(380),easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  h.badge.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-110%) rotate(-6deg)'}],{duration:D(380),easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
}
function playClip(){
  return new Promise(function(res){
    var done=false;
    function fin(){if(done)return;done=true;res()}
    trans.playbackRate=1.2;
    var pr=trans.play();if(pr&&pr.catch)pr.catch(fin);
    trans.addEventListener('ended',fin,{once:true});
    setTimeout(fin,4500);
    (function tick(){
      if(done)return;
      var d=trans.duration||5.04,p=trans.currentTime/d;
      if(trans.ended||p>=.995){fin();return}
      trans.playbackRate=Math.max(1.2,1.8+2.4*Math.sin(Math.PI*Math.min(p*1.08,1)));
      requestAnimationFrame(tick);
    })();
  });
}
async function toCase(){
  if(busy||mode!=='hero')return;
  busy=true;body.classList.add('busy');
  heroOut();
  await wait(D(330));
  if(RM||!transReady){
    place('case');
    caseplate.animate([{opacity:0},{opacity:1}],{duration:D(500),fill:'forwards'});
    plate.style.visibility='hidden';cut.style.opacity=0;
    await wait(D(500));
    arriveCase();return;
  }
  trans.currentTime=0;trans.style.opacity=1;
  await raf2();
  plate.style.visibility='hidden';
  cut.animate([{opacity:1},{opacity:0}],{duration:260,easing:'ease-out',fill:'forwards'});
  setGlide(1.6);
  place('case');
  await playClip();
  trans.pause();
  cancelAll(caseplate);
  caseplate.style.opacity=1;
  trans.style.opacity=0;
  arriveCase();
}
function arriveCase(){
  mode='case';cur=0;
  body.classList.add('is-case');
  fillCase(0);
  screen.style.opacity=1;
  doFlash(.55,600);
  var v=vids[0];
  cancelAll(v);
  v.animate([{opacity:0,transform:'scale(1.06)'},{opacity:1,transform:'scale(1)'}],{duration:D(700),easing:EASE,fill:'forwards'});
  vids.forEach(function(x,k){if(k!==0)x.style.opacity=0});
  playOnly(0);
  caseIn(0,true);
  preload(1);
  wait(D(700)).then(function(){busy=false;endGlide();body.classList.remove('busy')});
}

/* ---------- switching ---------- */
async function swapTo(n){
  if(busy||mode!=='case'||n===cur)return;
  busy=true;
  var old=vids[cur];
  caseOut();
  cancelAll(old);
  old.animate([{opacity:1},{opacity:0}],{duration:D(350),fill:'forwards'});
  await wait(D(380));
  old.pause();
  cur=n;fillCase(n);
  doFlash(.35,420);
  var v=vids[n];cancelAll(v);
  v.animate([{opacity:0,transform:'scale(1.04)'},{opacity:1,transform:'scale(1)'}],{duration:D(500),easing:EASE,fill:'forwards'});
  playOnly(n);
  place('case');
  caseIn(n,false);
  preload((n+1)%CASES.length);
  await wait(D(520));
  busy=false;
}

/* ---------- case -> hero ---------- */
async function toHero(){
  if(busy||mode!=='case')return;
  busy=true;
  var h=H();
  var co=caseOut();
  vids.forEach(function(v){v.pause()});
  cancelAll(screen);
  screen.animate([{opacity:1},{opacity:0}],{duration:D(300),fill:'forwards'});
  await co;
  body.classList.remove('is-case');
  mode='hero';
  setGlide(.9);
  place('hero');
  plate.style.visibility='visible';
  cancelAll(cut);
  cut.style.opacity=1;
  cut.animate([{opacity:0},{opacity:1}],{duration:D(700),delay:D(150),easing:'ease-out',fill:'both'});
  cancelAll(caseplate);
  caseplate.animate([{opacity:1,filter:'blur(0)'},{opacity:0,filter:'blur(12px)'}],{duration:D(800),easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'});
  plate.animate([{transform:'scale(1.12)',filter:'blur(8px)'},{transform:'scale(1)',filter:'blur(0)'}],{duration:D(900),easing:EASE});
  screen.style.opacity=0;
  await wait(D(250));
  [h.wm,h.script,h.badge].forEach(cancelAll);
  h.wm.animate([{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'none'}],{duration:D(700),easing:EASE,fill:'forwards'});
  h.script.animate([{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0)'}],{duration:D(700),delay:D(250),easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'});
  var ba=h.badge.animate([
    {opacity:0,transform:'translateY(-110%) rotate(6deg)',offset:0},
    {opacity:1,transform:'translateY(0) rotate(-2deg)',offset:.7},
    {opacity:1,transform:'rotate(0)',offset:1}],
    {duration:D(1100),easing:EASE,fill:'forwards'});
  ba.onfinish=function(){ba.cancel();if(mode==='hero')startSway()};
  await wait(D(750));
  caseplate.style.opacity=0;
  await wait(D(250));
  busy=false;endGlide();
}

/* ---------- input ---------- */
function next(){
  if(mode==='hero')toCase();
  else if(mode==='case')swapTo((cur+1)%CASES.length);
}
function prev(){
  if(mode!=='case')return;
  if(cur===0)toHero();else swapTo(cur-1);
}
window.addEventListener('wheel',function(e){
  e.preventDefault();
  if(locked||busy||Math.abs(e.deltaY)<18)return;
  locked=true;setTimeout(function(){locked=false},900);
  if(e.deltaY>0)next();else prev();
},{passive:false});
var tx=0,ty=0;
window.addEventListener('touchstart',function(e){var t=e.touches[0];tx=t.clientX;ty=t.clientY},{passive:true});
window.addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
window.addEventListener('touchend',function(e){
  var t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;
  if(Math.abs(dy)>=40&&Math.abs(dy)>=Math.abs(dx)){if(dy<0)next();else prev()}
  else if(Math.abs(dx)>=40){if(dx<0)next();else prev()}
},{passive:true});
window.addEventListener('keydown',function(e){
  var k=e.key;
  if(k==='ArrowDown'||k==='PageDown'||k===' '||k==='Spacebar'||k==='ArrowRight'){
    if(k==='ArrowRight'&&mode==='hero')return;
    e.preventDefault();next();
  }else if(k==='ArrowUp'||k==='PageUp'||k==='ArrowLeft'){e.preventDefault();prev()}
});
$('tPortfolio').addEventListener('click',function(){if(mode==='hero')toCase()});
$('tStudio').addEventListener('click',toHero);
$('logo').addEventListener('click',toHero);
$('next').addEventListener('click',next);
$('prev').addEventListener('click',prev);
$('screenHit').addEventListener('click',function(){if(mode==='case')next()});

window.addEventListener('resize',function(){
  frame.classList.remove('glide');
  frame.classList.remove('d-fade','m-fade');
  frame.classList.add(isMobile()?'m-fade':'d-fade');
  setN();place(mode);
});

/* init */
fillCase(0);
setN();place('hero');
startEntrance();
})();
