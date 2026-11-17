/* ===== stock.js: หน้าสต็อกสินค้า (เพิ่มสินค้า / บันทึกการขาย / แจ้งเตือนใกล้หมด) ===== */
function rAlert(){
  const low=db.p.filter(p=>p.stock<=p.min),a=$('#lowbar');
  a.hidden=!low.length;
  a.innerHTML='⚠ สินค้าใกล้หมด: '+low.map(p=>`${esc(p.name)} (เหลือ ${p.stock})`).join(', ');
}
function rStock(){
  $('#tp').innerHTML='<tr><th>สินค้า</th><th>ต้นทุน</th><th>ราคาขาย</th><th>คงเหลือ</th><th>ขายแล้ว</th><th>สถานะ</th><th></th></tr>'+
  (db.p.map(p=>{
    const st=p.stock<=0?['หมด','bad']:p.stock<=p.min?['ใกล้หมด','warn']:['ปกติ','ok'];
    return `<tr><td>${esc(p.name)}</td><td>${fm(p.cost)}</td><td>${fm(p.price)}</td><td>${p.stock}</td><td>${sold(p.id)}</td><td><span class="tag ${st[1]}">${st[0]}</span></td><td class="act"><button data-a="add" data-id="${p.id}">เติมสต็อก</button><button data-a="del" data-id="${p.id}">ลบ</button></td></tr>`;
  }).join('')||emptyRow(7,'ยังไม่มีสินค้า เพิ่มสินค้าชิ้นแรกได้จากฟอร์มด้านบน'));
}
$('#fa').onsubmit=e=>{e.preventDefault();const f=e.target;
  db.p.push({id:uid(),name:f.n.value.trim(),cost:+f.c.value,price:+f.pr.value,stock:+f.s.value,min:+f.m.value});
  f.reset();f.m.value=CONFIG.defaultMinStock;save();render()};
$('#fs').onsubmit=e=>{e.preventDefault();const f=e.target,p=P(f.pid.value),q=+f.q.value;
  if(!p){alert('เพิ่มสินค้าก่อนบันทึกการขาย');return}
  if(q>p.stock){alert(`สต็อกไม่พอ ${p.name} เหลือ ${p.stock} ชิ้น`);return}
  p.stock-=q;db.s.push({id:uid(),d:f.d.value,pid:p.id,n:p.name,q,pr:p.price,c:p.cost});
  f.q.value=1;save();render()};
$('#tp').onclick=e=>{const b=e.target.closest('button');if(!b)return;const p=P(b.dataset.id);if(!p)return;
  if(b.dataset.a==='add'){const n=parseInt(prompt('เติมสต็อกเพิ่มกี่ชิ้น?','10'));if(n>0)p.stock+=n}
  else if(confirm(`ลบ "${p.name}" ออกจากรายการ? ประวัติการขายจะยังอยู่`))db.p=db.p.filter(x=>x!==p);
  save();render()};
