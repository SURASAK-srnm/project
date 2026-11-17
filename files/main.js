/* ===== main.js: ตัวควบคุมหลัก (สลับหน้า วาดใหม่ ข้อมูลตัวอย่าง) ต้องโหลดเป็นไฟล์สุดท้าย ===== */
function tab(t){$$('.tab').forEach(x=>x.hidden=x.id!==t);$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===t))}
$$('#nav button').forEach(b=>b.onclick=()=>tab(b.dataset.t));

function fill(){   // ใส่รายชื่อสินค้าในช่องเลือกสินค้า
  const opts=db.p.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  [$('#fs').pid,$('#fp').pid,$('#fp').p2].forEach(sel=>{const v=sel.value;sel.innerHTML=opts;if(P(v))sel.value=v});
}
function render(){fill();rStock();rFin();rRank();promo();rAlert()}   // วาดทุกหน้าใหม่เมื่อข้อมูลเปลี่ยน

$('#reset').onclick=()=>{if(confirm('ล้างข้อมูลสินค้า การขาย และค่าใช้จ่ายทั้งหมด?')){db={p:[],s:[],e:[]};save();render()}};
$('#demo').onclick=()=>{
  if((db.p.length||db.s.length)&&!confirm('ข้อมูลเดิมจะถูกแทนที่ ดำเนินการต่อหรือไม่?'))return;
  db={p:CONFIG.demoProducts.map(([n,c,pr,s,m])=>({id:uid(),name:n,cost:c,price:pr,stock:s,min:m})),s:[],e:[]};
  for(let i=0;i<40;i++){const d=new Date();d.setDate(d.getDate()-i);
    db.p.forEach(p=>{if(Math.random()<.7){const q=1+Math.floor(Math.random()*4);if(p.stock>=q){p.stock-=q;db.s.push({id:uid(),d:ymd(d),pid:p.id,n:p.name,q,pr:p.price,c:p.cost})}}})}
  db.e=[{id:uid(),n:'ค่าเช่าที่',a:3000,d:today()},{id:uid(),n:'ค่าไฟ',a:800,d:today()}];
  save();render()};

// เริ่มต้นหน้าเว็บ
document.title=CONFIG.shopName+' | วิเคราะห์ยอดขาย';$('#brand').textContent=CONFIG.shopName;
$('#fa').m.value=CONFIG.defaultMinStock;$('#fs').d.value=today();$('#fe').d.value=today();
render();
