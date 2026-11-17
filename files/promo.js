/* ===== promo.js: หน้าทดลองโปรโมชั่น =====
   แก้สูตรได้ที่ nr (กำไรปกติต่อหน่วย) และ pr (กำไรเมื่อจัดโปรต่อหน่วย) ในแต่ละ if ด้านล่าง */
function promo(){
  const f=$('#fp'),t=f.t.value,p=P(f.pid.value),box=$('#pr');
  $('#tv').textContent={pct:'ลด (%)',baht:'ลด (บาทต่อชิ้น)',bxgy:'ซื้อ (X ชิ้น)',bundle:'ราคาเซ็ต (บาท)'}[t];
  $('#ly').hidden=t!=='bxgy';$('#l2').hidden=t!=='bundle';
  const u=t==='bxgy'||t==='bundle'?'เซ็ต':'ชิ้น';
  $('#tn').textContent=`ขายได้ปกติ (${u}/เดือน)`;$('#tq').textContent=`ขายได้เมื่อจัดโปร (${u}/เดือน)`;
  if(!p){box.innerHTML='<p class="empty">เพิ่มสินค้าในหน้าสต็อกก่อน แล้วกลับมาทดลองโปรโมชั่น</p>';return}
  const v=+f.v.value||0,y=+f.y.value||0,N=+f.n.value||0,M=+f.m.value||0;
  let nr,pr,desc;
  if(t==='pct'){nr=p.price-p.cost;pr=p.price*(1-v/100)-p.cost;desc=`ลด ${v}% เหลือ ${fm(p.price*(1-v/100))} บาท`}
  else if(t==='baht'){nr=p.price-p.cost;pr=p.price-v-p.cost;desc=`ลด ${v} บาท เหลือ ${fm(p.price-v)} บาท`}
  else if(t==='bxgy'){const k=v+y;nr=k*(p.price-p.cost);pr=v*p.price-k*p.cost;desc=`ซื้อ ${v} แถม ${y} (1 เซ็ต = ${k} ชิ้น)`}
  else{const q=P(f.p2.value)||p;nr=p.price+q.price-p.cost-q.cost;pr=v-p.cost-q.cost;desc=`${p.name} + ${q.name} ราคาเซ็ต ${fm(v)} บาท`}
  const a=nr*N,b=pr*M,d=b-a,be=pr>0?Math.ceil(a/pr):null;   // a=กำไรปกติรวม b=กำไรโปรรวม be=จุดคุ้มทุน
  box.innerHTML=`<h3>ผลการจำลอง</h3><p class="muted">${esc(desc)}</p>
  <div class="cards"><div class="stat"><span>กำไรต่อ${u} (ปกติ)</span><b>${fm(nr)}</b></div><div class="stat"><span>กำไรต่อ${u} (โปร)</span><b class="${pr<0?'bad':''}">${fm(pr)}</b></div>
  <div class="stat"><span>กำไรรวม/เดือน (ปกติ)</span><b>${fm(a)}</b></div><div class="stat"><span>กำไรรวม/เดือน (โปร)</span><b class="${b<0?'bad':''}">${fm(b)}</b></div></div>
  <p class="verdict ${d>=0?'good':'bad'}">${d>=0?'คุ้มค่า กำไรเพิ่มขึ้น ':'ไม่คุ้ม กำไรลดลง '}${fm(Math.abs(d))} บาท/เดือน</p>
  <p class="muted">${be===null?`โปรนี้ขายแล้วไม่มีกำไรต่อ${u} จึงไม่มีจุดคุ้มทุน`:`ต้องขายให้ได้อย่างน้อย ${fm(be)} ${u}/เดือน กำไรถึงจะเท่าเดิม`}</p>`;
}
$('#fp').oninput=promo;
