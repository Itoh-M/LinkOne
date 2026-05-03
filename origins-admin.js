const STORAGE_KEY='linkone.origins.v1';
const ADMIN_KEY='linkone-2026';
const DEFAULTS=[
{id:"br",no:"01",code:"BR",country:"ブラジル",countryEn:"Brazil",importer:"Mirai Seeds Inc.",region:"Cerrado · Sul de Minas",varieties:"Yellow Bourbon · Catuaí",process:"Natural / Pulped Natural",cupNote:"ナッツ、チョコレート、オレンジ",status:"active",x:32.5,y:62,color:"#e85a3c",blink:true,farm:"",producer:""},
{id:"pa",no:"02",code:"PA",country:"パナマ",countryEn:"Panama",importer:"Brisa and Tierra",region:"Boquete · Volcán",varieties:"Geisha · Caturra",process:"Washed / Natural",cupNote:"フローラル、ベルガモット、ハニー",status:"active",x:24.5,y:52,color:"#f5b431",blink:true,farm:"",producer:""},
{id:"tw",no:"03",code:"TW",country:"台湾",countryEn:"Taiwan",importer:"ORIOWL Co., Ltd.",region:"Alishan · Yunlin",varieties:"Typica · SL34",process:"Washed / Honey",cupNote:"クリーン、シトラス、ブラウンシュガー",status:"active",x:81.5,y:47,color:"#2ec4b6",blink:true,farm:"",producer:""},
{id:"cr",no:"04",code:"CR",country:"コスタリカ",countryEn:"Costa Rica",importer:"PuraVida",region:"Tarrazú · West Valley",varieties:"Caturra · Villa Sarchi",process:"Washed / Honey / Anaerobic",cupNote:"ストーンフルーツ、ハニー、シトラス",status:"active",x:22.5,y:50,color:"#7bc043",blink:true,farm:"",producer:""},
{id:"co",no:"05",code:"CO",country:"コロンビア",countryEn:"Colombia",importer:"募集中",region:"Huila · Antioquia · Nariño",varieties:"Caturra · Castillo · Pink Bourbon",process:"Washed / Natural / Anaerobic",cupNote:"チョコレート、キャラメル、赤い果実",status:"recruiting",x:27,y:56,color:"#9aa0a6",blink:true,farm:"",producer:""},
{id:"id",no:"06",code:"ID",country:"インドネシア",countryEn:"Indonesia",importer:"Rational Idea Inc.",region:"Sumatra · Sulawesi · Bali",varieties:"Typica · Lini S · Ateng",process:"Wet Hulled / Natural",cupNote:"アーシー、スパイス、ダークチョコ",status:"active",x:79,y:60.5,color:"#e85a3c",blink:true,farm:"",producer:""}
];
const params=new URLSearchParams(location.search);
const isAdmin=params.get('admin')==='1'&&params.get('key')===ADMIN_KEY;
if(isAdmin)document.body.classList.add('admin-mode');
const wrapper=document.getElementById('originsMap');
const layer=wrapper.querySelector('.origins-dots-layer');
const popup=wrapper.querySelector('.origin-popup');
const modal=document.getElementById('originModal');
let origins=(()=>{try{const r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):DEFAULTS;}catch(e){return DEFAULTS;}})();
let editingId=null;
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(origins));render();}
function render(){
layer.innerHTML='';
origins.forEach(o=>{
const d=document.createElement('div');
d.className='origin-dot'+(o.blink?' blink':'');
d.style.left=o.x+'%';d.style.top=o.y+'%';
d.style.setProperty('--c',o.color||'#e85a3c');
d.title=o.country+' — '+o.importer;
d.addEventListener('click',e=>{e.stopPropagation();if(!d.dataset.dragged)showPopup(o);});
if(isAdmin){enableDrag(d,o);d.addEventListener('dblclick',()=>openEdit(o.id));}
layer.appendChild(d);
});
}
function showPopup(o){
popup.innerHTML='<div class="po-no">N° '+o.no+' · '+o.code+'</div><h4>'+o.country+' <span style="color:#999;font-weight:400;font-size:12px;">/ '+(o.countryEn||'')+'</span></h4><div class="po-row"><b>COUNTRY</b><br>'+(o.country||'—')+'</div><div class="po-row"><b>REGION</b><br>'+(o.region||'—')+'</div><div class="po-row"><b>FARM</b><br>'+(o.farm||'—')+'</div><div class="po-row"><b>PRODUCER</b><br>'+(o.producer||'—')+'</div><div class="po-row"><b>IMPORTER</b><br>'+(o.importer||'—')+'</div>'+(isAdmin?'<button data-edit="'+o.id+'">編集</button>':'');
popup.style.left=o.x+'%';popup.style.top=o.y+'%';popup.hidden=false;
const b=popup.querySelector('[data-edit]');if(b)b.addEventListener('click',()=>openEdit(o.id));
}
document.addEventListener('click',e=>{if(!e.target.closest('.origin-dot')&&!e.target.closest('.origin-popup'))popup.hidden=true;});
function enableDrag(el,o){
el.addEventListener('pointerdown',e=>{
e.preventDefault();el.setPointerCapture(e.pointerId);
const rect=layer.getBoundingClientRect();
const sx=e.clientX,sy=e.clientY,ox=o.x,oy=o.y;let moved=false;
function move(ev){
const nx=ox+((ev.clientX-sx)/rect.width)*100;
const ny=oy+((ev.clientY-sy)/rect.height)*100;
o.x=Math.max(0,Math.min(100,nx));o.y=Math.max(0,Math.min(100,ny));
el.style.left=o.x+'%';el.style.top=o.y+'%';moved=true;el.classList.add('dragging');
}
function up(){
el.releasePointerCapture(e.pointerId);el.classList.remove('dragging');
window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);
if(moved){el.dataset.dragged='1';persist();setTimeout(()=>delete el.dataset.dragged,50);}
}
window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
});
}
function openEdit(id){
let o;
if(id){o=origins.find(x=>x.id===id);}
else{o={id:'o'+Date.now(),no:'',code:'',country:'新しい産地',countryEn:'',importer:'',region:'',varieties:'',process:'',cupNote:'',status:'recruiting',x:50,y:50,color:'#e85a3c',blink:true,farm:"",producer:""};origins.push(o);}
editingId=o.id;
['country','countryEn','code','no','importer','region','varieties','process','cupNote','status','color'].forEach(k=>document.getElementById('f_'+k).value=o[k]||'');
document.getElementById('f_blink').checked=!!o.blink;modal.hidden=false;
}
if(isAdmin){
document.getElementById('adminPanel').hidden=false;
document.getElementById('addDotBtn').onclick=()=>openEdit(null);
document.getElementById('exportBtn').onclick=()=>{
const blob=new Blob([JSON.stringify(origins,null,2)],{type:'application/json'});
const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='origins.json';a.click();
};
document.getElementById('importFile').onchange=async e=>{
const f=e.target.files[0];if(!f)return;
try{origins=JSON.parse(await f.text());persist();}catch(_){alert('JSONエラー');}
};
document.getElementById('saveDotBtn').onclick=()=>{
const o=origins.find(x=>x.id===editingId);if(!o)return;
['country','countryEn','code','no','importer','region','varieties','process','cupNote','status','color'].forEach(k=>o[k]=document.getElementById('f_'+k).value);
o.blink=document.getElementById('f_blink').checked;modal.hidden=true;persist();
};
document.getElementById('deleteDotBtn').onclick=()=>{
if(!confirm('削除しますか？'))return;
origins=origins.filter(x=>x.id!==editingId);modal.hidden=true;persist();
};
document.getElementById('cancelDotBtn').onclick=()=>{modal.hidden=true;};
document.getElementById('resetBtn').onclick=()=>{
if(!confirm('編集内容を破棄して初期値に戻しますか？'))return;
localStorage.removeItem(STORAGE_KEY);origins=DEFAULTS;render();
};
}
render();
