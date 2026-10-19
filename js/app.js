/* Tamerball Store — frontend + localStorage "backend" */
const $=s=>document.querySelector(s), app=$('#app');
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
const fmt=n=>Number(n).toLocaleString('ru-RU')+' ₸';
const MAXQ=10, MINPASS=6;
let products=LS.get('tb_products',null)||(LS.set('tb_products',SEED),SEED);
const users=()=>LS.get('tb_users',[{name:'Администратор',email:'admin@tamerball.kz',pass:'admin123',role:'admin'}]);
if(!localStorage.tb_users)LS.set('tb_users',users());
const me=()=>LS.get('tb_session',null), cart=()=>LS.get('tb_cart',[]), orders=()=>LS.get('tb_orders',[]);
const find=id=>products.find(p=>p.id==id), save=()=>LS.set('tb_products',products);
const maxQty=p=>Math.min(p.stock,MAXQ);
function toast(t,bad){const e=$('#toast');e.textContent=t;e.className='on'+(bad?' bad':'');clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',2400)}
const go=h=>{location.hash=h};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const ART={
Формалар:c=>`<path d="M30 20l22-8c4 8 12 8 16 0l22 8 14 24-16 8v44H32V52L16 44z" fill="${c}" stroke="#0003" stroke-width="2"/>`,
Доптар:c=>`<circle cx="60" cy="60" r="42" fill="#fff" stroke="#111" stroke-width="3"/><path d="M60 38l16 12-6 19H50l-6-19z" fill="#111"/><path d="M60 38V18M76 50l20-8M70 69l12 18M50 69L38 87M44 50l-20-8" stroke="#111" stroke-width="3"/>`,
Бутсылар:c=>`<path d="M14 40h30l10 14h34c12 0 18 8 18 20v8H14z" fill="${c}" stroke="#0003" stroke-width="2"/><path d="M22 86v10M44 86v10M66 86v10M88 86v10" stroke="#111" stroke-width="5"/>`,
Қолғаптар:c=>`<path d="M38 100V58L30 40l8-4 8 16V24h8v28V20h8v32V24h8v32V34l8 2v40l-10 24z" fill="${c}" stroke="#0003" stroke-width="2"/>`,
Гетрлер:c=>`<path d="M44 14h32v56l18 22v10H40V70z" fill="${c}"/><rect x="44" y="24" width="32" height="8" fill="#fff"/>`,
Аксессуарлар:c=>`<rect x="26" y="42" width="68" height="50" rx="10" fill="${c}"/><path d="M45 42v-8a15 15 0 0130 0v8" stroke="#111" stroke-width="5" fill="none"/>`};
const art=p=>`<svg viewBox="0 0 120 120">${(ART[p.cat]||ART.Доптар)(p.color)}</svg>`;

/* ---------- Header ---------- */
function nav(){const u=me(),n=cart().reduce((s,i)=>s+i.qty,0);
$('#nav').innerHTML=`<a href="#/">Басты бет</a><a href="#/catalog">Каталог</a><a href="#/cart">🛒 Себет<span class="badge">${n}</span></a>`+
(u?`${u.role=='admin'?'<a href="#/admin">Админ панель</a>':''}<a href="#/account">👤 ${esc(u.name)}</a><button data-act="logout">Шығу</button>`:`<a href="#/login">Кіру</a><a href="#/register">Тіркелу</a>`)}

/* ---------- Views ---------- */
const card=p=>`<div class="card"><a href="#/product/${p.id}" class="im">${art(p)}</a><div class="bd"><span class="brand">${p.brand} · ${p.cat}</span><a href="#/product/${p.id}"><b>${esc(p.name)}</b></a>
<span class="${p.stock?'ok':'tag'}">${p.stock?'Қоймада бар':'Қолжетімсіз'}</span><div class="price">${fmt(p.price)}</div>
<button class="btn sm" data-act="add" data-id="${p.id}" ${p.stock?'':'disabled'}>${p.stock?'Себетке қосу':'Қолжетімсіз'}</button></div></div>`;

const V={
home(){return `<section class="hero"><h1>Футболға арналған барлық тауар бір жерде</h1><p>Формалар, доптар, бутсылар, қақпашы қолғаптары және аксессуарлар. Қазақстан бойынша жеткізу.</p><a class="btn wh" href="#/catalog">Каталогқа өту</a></section>
<h2>Санаттар</h2><div class="cats">${CATS.map(c=>`<a class="chip" href="#/catalog?cat=${encodeURIComponent(c)}">${c}</a>`).join('')}</div>
<h2>Танымал тауарлар</h2><div class="grid">${products.slice(0,8).map(card).join('')}</div>
<div class="feat"><div>🚚<br><b>Жылдам жеткізу</b><br>Алматы бойынша 1 күнде</div><div>✅<br><b>Түпнұсқа</b><br>Ресми брендтер</div><div>💳<br><b>Қауіпсіз төлем</b><br>Карта немесе қолма-қол</div><div>↩️<br><b>Қайтару</b><br>14 күн ішінде</div></div>`},

catalog(q){const f={cat:q.get('cat')||'',s:q.get('s')||'',min:q.get('min')||'',max:q.get('max')||'',sort:q.get('sort')||''};
let l=products.filter(p=>(!f.cat||p.cat==f.cat)&&(!f.s||(p.name+p.brand).toLowerCase().includes(f.s.toLowerCase()))&&(f.min===''||p.price>=+f.min)&&(f.max===''||p.price<=+f.max));
if(f.sort=='asc')l.sort((a,b)=>a.price-b.price);if(f.sort=='desc')l.sort((a,b)=>b.price-a.price);
const bad=f.min!==''&&f.max!==''&&+f.min>+f.max;
return `<h2>Тауарлар каталогы</h2><div class="cats"><span class="chip ${f.cat?'':'on'}" data-cat="">Барлығы</span>${CATS.map(c=>`<span class="chip ${f.cat==c?'on':''}" data-cat="${c}">${c}</span>`).join('')}</div>
<form class="bar" data-form="filter"><label>Іздеу<input name="s" value="${esc(f.s)}" placeholder="Тауар атауы немесе бренд"></label>
<label>Бағасы бастап<input name="min" type="number" min="0" value="${esc(f.min)}"></label><label>Бағасы дейін<input name="max" type="number" min="0" value="${esc(f.max)}"></label>
<label>Сұрыптау<select name="sort"><option value="">Әдепкі</option><option value="asc" ${f.sort=='asc'?'selected':''}>Арзандан қымбатқа</option><option value="desc" ${f.sort=='desc'?'selected':''}>Қымбаттан арзанға</option></select></label>
<button class="btn">Іздеу</button></form>
${bad?'<p class="msg">Минималды баға максималдыдан артық болмауы керек</p>':''}
<p style="margin-bottom:12px;color:var(--gr)">Табылды: ${bad?0:l.length}</p>
<div class="grid">${bad?'':l.map(card).join('')||'<p>Ештеңе табылмады 😕</p>'}</div>`},

product(id){const p=find(id);if(!p)return '<p class="msg">Тауар табылмады</p>';
const sz=['Форма','Бутсылар','Гетрлер','Қолғаптар'].includes(p.cat);
return `<div class="crumbs"><a href="#/">Басты</a> / <a href="#/catalog?cat=${encodeURIComponent(p.cat)}">${p.cat}</a> / ${esc(p.name)}</div>
<div class="pd box"><div class="im">${art(p)}</div><div><span class="brand">${p.brand}</span><h1 style="margin:6px 0">${esc(p.name)}</h1><div class="price" style="font-size:30px">${fmt(p.price)}</div>
<p style="margin:14px 0;color:var(--gr)">${esc(p.desc)}</p><p class="${p.stock?'ok':'tag'}">${p.stock?`Қоймада: ${p.stock} дана`:'Қолжетімсіз'}</p><br>
<div class="two" style="max-width:340px"><label>Саны<input id="pq" type="number" min="1" max="${maxQty(p)}" value="1"></label>
${sz?`<label>Өлшемі<select id="ps">${(p.cat=='Бутсылар'?[39,40,41,42,43,44,45]:['S','M','L','XL']).map(x=>`<option>${x}</option>`).join('')}</select></label>`:''}</div><br>
<button class="btn" data-act="add" data-id="${p.id}" data-card="1" ${p.stock?'':'disabled'}>${p.stock?'Себетке қосу':'Қолжетімсіз'}</button></div></div>`},

cart(){const c=cart();if(!c.length)return '<div class="box" style="text-align:center"><h2>Себет бос</h2><a class="btn" href="#/catalog">Тауар таңдау</a></div>';
const tot=c.reduce((s,i)=>s+find(i.id).price*i.qty,0);
return `<h2>Себет</h2><div class="lay"><table><tr><th></th><th>Тауар</th><th>Бағасы</th><th>Саны</th><th>Сомасы</th><th></th></tr>${c.map((i,k)=>{const p=find(i.id);return `<tr><td>${art(p)}</td><td>${esc(p.name)}${i.size?`<br><small>Өлшемі: ${i.size}</small>`:''}</td><td>${fmt(p.price)}</td>
<td><span class="qty"><button data-act="dec" data-k="${k}">−</button>${i.qty}<button data-act="inc" data-k="${k}">+</button></span></td><td><b>${fmt(p.price*i.qty)}</b></td><td><button class="btn red sm" data-act="rm" data-k="${k}">✕</button></td></tr>`}).join('')}</table>
<div class="box"><h3>Тапсырыс сомасы</h3><p class="price" style="font-size:28px;margin:12px 0">${fmt(tot)}</p><a class="btn" href="#/checkout">Рәсімдеуге өту</a></div></div>`},

checkout(){if(!me()){toast('Алдымен жүйеге кіріңіз',1);return V.login()}
const c=cart();if(!c.length)return V.cart();const tot=c.reduce((s,i)=>s+find(i.id).price*i.qty,0);
return `<h2>Тапсырыс рәсімдеу</h2><form class="box" data-form="checkout" style="max-width:640px;display:flex;flex-direction:column;gap:14px" novalidate>
<label>Аты-жөні<input name="name" value="${esc(me().name)}"></label><label>Телефон<input name="phone" placeholder="+7 7XX XXX XX XX"></label>
<label>Қала<input name="city" value="Алматы"></label><label>Мекенжай<input name="addr" placeholder="Көше, үй, пәтер"></label>
<label>Төлем тәсілі<select name="pay" id="pay"><option value="card">Банк картасы</option><option value="cash">Қолма-қол (жеткізгенде)</option></select></label>
<div id="cardbox" class="two"><label style="grid-column:1/3">Карта нөмірі<input name="num" placeholder="1234 5678 9012 3456" maxlength="19"></label><label>Мерзімі (AA/ЖЖ)<input name="exp" placeholder="12/28" maxlength="5"></label><label>CVV<input name="cvv" type="password" maxlength="3" placeholder="123"></label></div>
<div class="err" id="err"></div><b>Жалпы сома: ${fmt(tot)}</b><button class="btn">Төлеу және тапсырыс беру</button></form>`},

login(){return `<form class="box form" data-form="login" novalidate><h2 style="margin:0">Жүйеге кіру</h2><label>Email<input name="email" type="email"></label><label>Құпия сөз<input name="pass" type="password"></label>
<div class="err" id="err"></div><button class="btn">Кіру</button><small>Жаңа қолданушы ма? <a href="#/register" style="color:var(--g)">Тіркелу</a><br>Админ: admin@tamerball.kz / admin123</small></form>`},

register(){return `<form class="box form" data-form="register" novalidate><h2 style="margin:0">Тіркелу</h2><label>Аты-жөні<input name="name"></label><label>Email<input name="email" type="email"></label>
<label>Құпия сөз (кемінде ${MINPASS} таңба)<input name="pass" type="password"></label><label>Құпия сөзді қайталаңыз<input name="pass2" type="password"></label>
<div class="err" id="err"></div><button class="btn">Тіркелу</button><small>Тіркелгіңіз бар ма? <a href="#/login" style="color:var(--g)">Кіру</a></small></form>`},

account(){const u=me();if(!u)return V.login();const o=orders().filter(x=>x.email==u.email).reverse();
return `<h2>Жеке кабинет</h2><div class="box" style="margin-bottom:20px"><b>${esc(u.name)}</b><br>${esc(u.email)}<br><small>Рөлі: ${u.role=='admin'?'Администратор':'Клиент'}</small></div><h3 style="margin-bottom:10px">Менің тапсырыстарым</h3>
${o.length?`<table><tr><th>№</th><th>Күні</th><th>Тауарлар</th><th>Сома</th><th>Төлем</th><th>Статус</th></tr>${o.map(x=>`<tr><td>#${x.id}</td><td>${x.date}</td><td>${x.items.map(i=>esc(i.name)+' ×'+i.qty).join('<br>')}</td><td>${fmt(x.total)}</td><td>${x.pay=='card'?'Карта':'Қолма-қол'}</td><td><span class="st s${STATUSES.indexOf(x.status)}">${x.status}</span></td></tr>`).join('')}</table>`:'<p>Әзірге тапсырыс жоқ</p>'}`},

admin(){const u=me();if(!u||u.role!='admin')return '<p class="msg">Бұл бетке тек администраторға рұқсат етілген</p>';
const o=orders().slice().reverse();
return `<h2>Администратор панелі</h2><h3>Жаңа тауар қосу</h3><form class="bar" data-form="addprod" novalidate><label>Атауы<input name="name"></label><label>Санат<select name="cat">${CATS.map(c=>`<option>${c}</option>`).join('')}</select></label>
<label>Бренд<input name="brand"></label><label>Бағасы (₸)<input name="price" type="number"></label><label>Қоймада<input name="stock" type="number"></label><button class="btn">Қосу</button></form><div class="err" id="err"></div>
<h3 style="margin:18px 0 10px">Тауарлар (${products.length})</h3><table><tr><th>ID</th><th>Атауы</th><th>Санат</th><th>Бағасы</th><th>Қоймада</th><th></th></tr>${products.map(p=>`<tr><td>${p.id}</td><td>${esc(p.name)}</td><td>${p.cat}</td><td>${fmt(p.price)}</td><td>${p.stock}</td>
<td><button class="btn out sm" data-act="edit" data-id="${p.id}">Өзгерту</button> <button class="btn red sm" data-act="del" data-id="${p.id}">Өшіру</button></td></tr>`).join('')}</table>
<h3 style="margin:24px 0 10px">Тапсырыстар (${o.length})</h3>${o.length?`<table><tr><th>№</th><th>Клиент</th><th>Тауарлар</th><th>Сома</th><th>Статус</th></tr>${o.map(x=>`<tr><td>#${x.id}</td><td>${esc(x.name)}<br><small>${esc(x.phone)} · ${esc(x.addr)}</small></td><td>${x.items.map(i=>esc(i.name)+' ×'+i.qty).join('<br>')}</td><td>${fmt(x.total)}</td>
<td><select data-st="${x.id}">${STATUSES.map(s=>`<option ${s==x.status?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</table>`:'<p>Тапсырыс жоқ</p>'}`}
};

/* ---------- Router ---------- */
function route(){const [path,qs]=(location.hash.slice(1)||'/').split('?'),q=new URLSearchParams(qs||''),[,pg,arg]=path.split('/');
const page=pg||'home';app.innerHTML=(V[page]?V[page](page=='catalog'?q:arg):'<p class="msg">Бет табылмады</p>');
nav();scrollTo(0,0);const pay=$('#pay');if(pay)pay.onchange=()=>$('#cardbox').style.display=pay.value=='card'?'':'none'}
addEventListener('hashchange',route);

/* ---------- Actions ---------- */
function addToCart(id,qty,size){const p=find(id);if(!p||p.stock<1)return toast('Тауар қолжетімсіз',1);
if(!Number.isInteger(qty)||qty<1)return toast('Саны кемінде 1 болуы керек',1);
const c=cart(),ex=c.find(i=>i.id==id&&i.size==size),n=(ex?ex.qty:0)+qty;
if(n>maxQty(p))return toast(`Максималды сан: ${maxQty(p)}`,1);
ex?ex.qty=n:c.push({id:p.id,qty,size});LS.set('tb_cart',c);nav();toast('Тауар себетке қосылды ✓')}

document.addEventListener('click',e=>{const t=e.target.closest('[data-act],[data-cat]');if(!t)return;
if(t.dataset.cat!==undefined){const q=new URLSearchParams(location.hash.split('?')[1]||'');t.dataset.cat?q.set('cat',t.dataset.cat):q.delete('cat');return go('/catalog?'+q)}
const a=t.dataset.act,c=cart(),k=+t.dataset.k;
if(a=='add'){const q=t.dataset.card?+$('#pq').value:1,s=$('#ps')?.value;addToCart(+t.dataset.id,q,s)}
if(a=='inc'){const p=find(c[k].id);c[k].qty<maxQty(p)?c[k].qty++:toast(`Максималды сан: ${maxQty(p)}`,1);LS.set('tb_cart',c);route()}
if(a=='dec'){c[k].qty>1?c[k].qty--:toast('Минималды сан — 1',1);LS.set('tb_cart',c);route()}
if(a=='rm'){c.splice(k,1);LS.set('tb_cart',c);route()}
if(a=='logout'){localStorage.removeItem('tb_session');go('/');route()}
if(a=='del'&&confirm('Тауарды өшіру керек пе?')){products=products.filter(p=>p.id!=t.dataset.id);save();route();toast('Тауар өшірілді')}
if(a=='edit'){const p=find(t.dataset.id),pr=prompt('Жаңа баға (₸):',p.price);if(pr===null)return;const st=prompt('Қоймадағы саны:',p.stock);if(st===null)return;
if(!(+pr>0)||!(+st>=0)||!Number.isInteger(+st))return toast('Қате мән енгізілді',1);p.price=+pr;p.stock=+st;save();route();toast('Сақталды ✓')}});

document.addEventListener('change',e=>{const id=e.target.dataset.st;if(!id)return;const o=orders();o.find(x=>x.id==id).status=e.target.value;LS.set('tb_orders',o);toast('Статус жаңартылды ✓')});

document.addEventListener('submit',e=>{const f=e.target,type=f.dataset.form;if(!type)return;e.preventDefault();
const d=Object.fromEntries(new FormData(f)),err=m=>{$('#err').textContent=m;return false},EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
if(type=='filter'){const q=new URLSearchParams(location.hash.split('?')[1]||'');['s','min','max','sort'].forEach(k=>d[k]!==''?q.set(k,d[k]):q.delete(k));return go('/catalog?'+q)}
if(type=='register'){if(!d.name.trim())return err('Атыңызды енгізіңіз');if(!EM.test(d.email))return err('Email форматы қате');
if(d.pass.length<MINPASS)return err(`Құпия сөз кемінде ${MINPASS} таңбадан тұруы керек`);if(d.pass!==d.pass2)return err('Құпия сөздер сәйкес келмейді');
const u=users();if(u.some(x=>x.email==d.email.toLowerCase()))return err('Бұл email бұрын тіркелген');
u.push({name:d.name.trim(),email:d.email.toLowerCase(),pass:d.pass,role:'client'});LS.set('tb_users',u);toast('Тіркелу сәтті өтті ✓');go('/login')}
if(type=='login'){if(!EM.test(d.email))return err('Email форматы қате');const u=users().find(x=>x.email==d.email.toLowerCase()&&x.pass==d.pass);
if(!u)return err('Email немесе құпия сөз қате');LS.set('tb_session',{name:u.name,email:u.email,role:u.role});toast('Қош келдіңіз, '+u.name);go('/');route()}
if(type=='checkout'){if(!d.name.trim()||!d.phone.trim()||!d.city.trim()||!d.addr.trim())return err('Барлық міндетті өрістерді толтырыңыз');
if(!/^\+?[0-9\s()-]{10,15}$/.test(d.phone))return err('Телефон нөмірі қате');
if(d.pay=='card'){const n=d.num.replace(/\s/g,'');if(!/^\d{16}$/.test(n))return err('Карта нөмірі 16 саннан тұруы керек');
const m=d.exp.match(/^(\d{2})\/(\d{2})$/);if(!m||+m[1]<1||+m[1]>12)return err('Мерзімі қате (AA/ЖЖ)');
const now=new Date();if(2000+ +m[2]<now.getFullYear()||(2000+ +m[2]==now.getFullYear()&&+m[1]<now.getMonth()+1))return err('Картаның мерзімі өткен');
if(!/^\d{3}$/.test(d.cvv))return err('CVV 3 саннан тұруы керек')}
const c=cart();for(const i of c){const p=find(i.id);if(!p||p.stock<i.qty)return err(`«${p?p.name:'Тауар'}» жеткіліксіз немесе қолжетімсіз`)}
const items=c.map(i=>({name:find(i.id).name,qty:i.qty,price:find(i.id).price})),total=items.reduce((s,i)=>s+i.price*i.qty,0);
c.forEach(i=>find(i.id).stock-=i.qty);save();const o=orders(),id=1000+o.length+1;
o.push({id,email:me().email,name:d.name,phone:d.phone,addr:d.city+', '+d.addr,pay:d.pay,items,total,status:'Жаңа',date:new Date().toLocaleDateString('ru-RU')});
LS.set('tb_orders',o);LS.set('tb_cart',[]);toast(`Тапсырыс #${id} қабылданды ✓`);go('/account');nav()}
if(type=='addprod'){if(!d.name.trim()||!d.brand.trim())return err('Атауы мен брендті енгізіңіз');if(!(+d.price>0))return err('Баға 0-ден үлкен болуы керек');
if(!(+d.stock>=0)||d.stock==='')return err('Қоймадағы сан теріс болмауы керек');
const colors=['#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6'];
products.push({id:Math.max(0,...products.map(p=>p.id))+1,name:d.name.trim(),cat:d.cat,brand:d.brand.trim(),price:+d.price,stock:+d.stock,color:colors[products.length%5],desc:'Жаңа тауар.'});save();route();toast('Тауар қосылды ✓')}});

route();
