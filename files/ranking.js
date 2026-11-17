/* ===== ranking.js: หน้าอันดับสินค้า (mode: q=จำนวน r=ยอดขาย p=กำไร) ===== */
let mode='q';
function rRank(){
  const L=grp().sort((a,b)=>b[mode]-a[mode]),mx=Math.max(...L.map(x=>x[mode]),1);
  $('#rk').innerHTML=L.map((x,i)=>`<div class="rk"><b>${i+1}</b><div><div class="rn"><span>${esc(x.n)}</span><span>${fm(x[mode])}${mode==='q'?' ชิ้น':' บาท'}</span></div><div class="track"><i style="width:${Math.max(x[mode],0)/mx*100}%"></i></div></div></div>`).join('')||'<p class="empty">ยังไม่มีข้อมูลการขาย บันทึกการขายในหน้าสต็อกสินค้าเพื่อดูอันดับ</p>';
}
$('#seg').onclick=e=>{const b=e.target.closest('button');if(!b)return;mode=b.dataset.m;$$('#seg button').forEach(x=>x.classList.toggle('on',x===b));rRank()};
