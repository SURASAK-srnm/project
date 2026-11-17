/* ===== finance.js: หน้ารายรับรายจ่าย =====
   กำไรสุทธิ = ยอดขาย - ต้นทุนสินค้า - ค่าใช้จ่ายอื่น */
function rFin(){
  const t=today(),mo=t.slice(0,7);
  const sm=db.s.filter(s=>s.d.startsWith(mo)),em=db.e.filter(e=>e.d.startsWith(mo));
  const R=sum(sm,rv),C=sum(sm,cs),X=sum(em,e=>e.a),pf=R-C-X,td=sum(db.s.filter(s=>s.d===t),rv);
  $('#cards').innerHTML=`<div class="stat big ${pf<0?'lose':'win'}"><span>กำไรสุทธิเดือนนี้ (ยอดขาย − ต้นทุนสินค้า − ค่าใช้จ่ายอื่น)</span><b>${fm(pf)} บาท</b></div>`+
    [['ยอดขายวันนี้',td],['ยอดขายเดือนนี้',R],['ต้นทุนสินค้าเดือนนี้',C],['ค่าใช้จ่ายอื่นเดือนนี้',X]].map(([l,v])=>`<div class="stat"><span>${l}</span><b>${fm(v)}</b></div>`).join('');
  // กราฟแท่งยอดขายรายวัน
  const days=[...Array(CONFIG.chartDays)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(CONFIG.chartDays-1)+i);return ymd(d)});
  const vals=days.map(d=>sum(db.s.filter(s=>s.d===d),rv)),mx=Math.max(...vals,1);
  $('#cd').textContent=CONFIG.chartDays;
  $('#bars').innerHTML=days.map((d,i)=>`<div class="bar" title="${d}: ${fm(vals[i])} บาท"><i style="height:${vals[i]/mx*85}%"></i><small>${+d.slice(8)}</small></div>`).join('');
  // สรุปรายเดือน
  const ms=[...new Set([...db.s.map(s=>s.d.slice(0,7)),...db.e.map(e=>e.d.slice(0,7))])].sort().reverse();
  $('#tm').innerHTML='<tr><th>เดือน</th><th>ยอดขาย</th><th>ต้นทุน</th><th>ค่าใช้จ่ายอื่น</th><th>กำไร</th></tr>'+
    (ms.map(m=>{const a=db.s.filter(s=>s.d.startsWith(m)),r=sum(a,rv),c=sum(a,cs),x=sum(db.e.filter(e=>e.d.startsWith(m)),e=>e.a),p=r-c-x;
      return `<tr><td>${m}</td><td>${fm(r)}</td><td>${fm(c)}</td><td>${fm(x)}</td><td class="${p<0?'neg':''}">${fm(p)}</td></tr>`}).join('')||emptyRow(5,'ยังไม่มีข้อมูล'));
  // ยอดขายและกำไรแต่ละสินค้า
  $('#tg').innerHTML='<tr><th>สินค้า</th><th>ขายได้</th><th>ยอดขาย</th><th>ต้นทุน</th><th>กำไร</th></tr>'+
    (grp().map(x=>`<tr><td>${esc(x.n)}</td><td>${x.q}</td><td>${fm(x.r)}</td><td>${fm(x.c)}</td><td class="${x.p<0?'neg':''}">${fm(x.p)}</td></tr>`).join('')||emptyRow(5,'ยังไม่มีการขาย'));
  // ค่าใช้จ่ายล่าสุด
  $('#te').innerHTML='<tr><th>รายการ</th><th>วันที่</th><th>จำนวนเงิน</th><th></th></tr>'+
    ([...db.e].sort((a,b)=>b.d.localeCompare(a.d)).slice(0,CONFIG.recentExpenses).map(e=>`<tr><td>${esc(e.n)}</td><td>${e.d}</td><td>${fm(e.a)}</td><td class="act"><button data-id="${e.id}">ลบ</button></td></tr>`).join('')||emptyRow(4,'ยังไม่มีค่าใช้จ่าย'));
}
$('#fe').onsubmit=e=>{e.preventDefault();const f=e.target;
  db.e.push({id:uid(),n:f.n.value.trim(),a:+f.a.value,d:f.d.value});
  f.reset();f.d.value=today();save();render()};
$('#te').onclick=e=>{const b=e.target.closest('button');if(!b)return;db.e=db.e.filter(x=>x.id!==b.dataset.id);save();render()};
