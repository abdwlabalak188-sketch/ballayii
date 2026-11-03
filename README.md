<!DOCTYPE html>
<html lang="ku">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BALLAYII — Global Search</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:#080808;color:#fff;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:25px 16px}
header{text-align:center;margin-top:65px}
h1{font-size:48px;letter-spacing:5px;color:#d9ad45;margin:0}
.subtitle{color:#aaa;margin:12px 0 30px}
.search{width:100%;max-width:650px;display:flex;gap:8px}
input{flex:1;min-width:0;padding:16px;border:1px solid #b88d35;border-radius:12px;background:#171717;color:white;font-size:16px}
button{border:0;border-radius:12px;background:#d9ad45;color:#111;font-weight:bold;padding:0 20px;cursor:pointer}
.links{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:22px 0}
.links a{color:#e4bd61;border:1px solid #57431d;padding:10px 14px;border-radius:10px;text-decoration:none}
#results{width:100%;max-width:650px;margin-top:15px}
.result{background:#171717;border:1px solid #333;border-radius:12px;padding:15px;margin:10px 0;line-height:1.6}
.result a{color:#e4bd61}
#status{color:#aaa;text-align:center;margin:15px}
footer{margin-top:auto;padding:35px 0 10px;color:#b99a55;text-align:center}
select{background:#171717;color:#d9ad45;border:1px solid #57431d;padding:8px;border-radius:8px}
</style>
</head>
<body>
<header>
<h1>BALLAYII</h1>
<p class="subtitle">گەڕان لە جیهانی زانیاری</p>
<select id="lang" onchange="changeLang()">
<option value="ku">کوردی</option>
<option value="ar">العربية</option>
<option value="en">English</option>
</select>
</header>
<div class="search">
<input id="q" placeholder="چی دەگەڕێیت؟" onkeydown="if(event.key==='Enter')search()">
<button onclick="search()">گەڕان</button>
</div>
<div class="links">
<a href="https://www.google.com" target="_blank">Google</a>
<a href="https://www.wikipedia.org" target="_blank">Wikipedia</a>
<a href="https://www.youtube.com" target="_blank">Videos</a>
<a href="https://images.google.com" target="_blank">Images</a>
<a href="https://www.google.com/maps" target="_blank">Maps</a>
</div>
<div id="status">وشە یان پرسیارەکەت بنووسە</div>
<div id="results"></div>
<div class="links">
<a href="#" onclick="nearby('hospital');return false">نەخۆشخانە</a>
<a href="#" onclick="nearby('pharmacy');return false">دەرمانخانە</a>
<a href="#" onclick="nearby('police');return false">پۆلیس</a>
<a href="#" onclick="nearby('mosque');return false">مزگەوت</a>
</div>
<footer>دروستکراوە لەلایەن ABDULLAH</footer>
<script>
const words={
ku:{placeholder:"چی دەگەڕێیت؟",button:"گەڕان",status:"چاوەڕێ بە..."},
ar:{placeholder:"عن ماذا تبحث؟",button:"بحث",status:"جارٍ البحث..."},
en:{placeholder:"What are you looking for?",button:"Search",status:"Searching..."}
};
function changeLang(){
const l=document.getElementById('lang').value;
document.getElementById('q').placeholder=words[l].placeholder;
document.querySelector('.search button').textContent=words[l].button;
}
async function search(){
const q=document.getElementById('q').value.trim();
if(!q)return;
const lang=document.getElementById('lang').value;
const status=document.getElementById('status');
const results=document.getElementById('results');
status.textContent=words[lang].status;
results.innerHTML='';
const google='https://www.google.com/search?q='+encodeURIComponent(q);
results.innerHTML='<div class="result">گەڕان لە وێب:<br><a target="_blank" href="'+google+'">ئەنجامی گەڕانی Google بکەرەوە</a></div>';
try{
const wikiLang=lang==='ku'?'en':lang;
const url='https://'+wikiLang+'.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&gsrlimit=8&prop=extracts&exintro=1&explaintext=1&format=json&origin=*';
const response=await fetch(url);
const data=await response.json();
const pages=data.query?.pages||{};
Object.values(pages).forEach(p=>{
const div=document.createElement('div');
div.className='result';
const a=document.createElement('a');
a.href='https://'+wikiLang+'.wikipedia.org/?curid='+p.pageid;
a.target='_blank';
a.textContent=p.title;
const desc=document.createElement('p');
desc.textContent=(p.extract||'').slice(0,500);
div.append(a,desc);
results.appendChild(div);
});
status.textContent='گەڕان تەواو بوو';
}catch(e){
status.textContent='Wikipedia ئێستا وەڵامی نەدا؛ گەڕان بە Google بکە.';
}
}
function nearby(type){
if(!navigator.geolocation){alert('مۆبایلەکەت شوێن ناناسێتەوە');return;}
document.getElementById('status').textContent='تکایە ڕێگە بە شوێنەکەت بدە...';
navigator.geolocation.getCurrentPosition(pos=>{
const lat=pos.coords.latitude,lon=pos.coords.longitude;
const url='https://www.google.com/maps/search/'+type+'/@'+lat+','+lon+',14z';
window.open(url,'_blank');
},()=>alert('بۆ دۆزینەوەی شوێن، مۆڵەتی Location بدە.'));
}
</script>
</body>
</html>
