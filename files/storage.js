/* ===== storage.js: ตั้งค่า ข้อมูล และฟังก์ชันช่วย (ต้องโหลดเป็นไฟล์แรก) =====
   ข้อมูลทั้งหมดอยู่ใน db แล้วบันทึกลง localStorage
   db.p = สินค้า, db.s = รายการขาย, db.e = ค่าใช้จ่ายอื่น */
const CONFIG={
  shopName:'ร้านของฉัน',   // ชื่อร้านบนหัวเว็บ
  defaultMinStock:5,        // ค่าเริ่มต้นของ "แจ้งเตือนเมื่อเหลือไม่เกิน"
  chartDays:14,             // จำนวนวันในกราฟยอดขายรายวัน
  recentExpenses:8,         // จำนวนค่าใช้จ่ายล่าสุดที่แสดง
  demoProducts:[            // [ชื่อ, ต้นทุน, ราคาขาย, สต็อก, แจ้งเตือนเมื่อเหลือ]
    ['น้ำดื่ม 600 มล.',5,10,120,20],
    ['ขนมปังไส้ครีม',8,15,60,10],
    ['กาแฟกระป๋อง',12,20,80,15],
    ['บะหมี่กึ่งสำเร็จรูป',5,8,100,20],
    ['ข้าวกล่องพร้อมทาน',25,45,30,8]
  ]
};
const KEY='shopAnalytics.v2';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}
db=db||{p:[],s:[],e:[]};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fm=n=>Number(n).toLocaleString('th-TH',{maximumFractionDigits:2});
const ymd=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=()=>ymd(new Date());
const sum=(a,f)=>a.reduce((t,x)=>t+f(x),0);
const rv=s=>s.q*s.pr, cs=s=>s.q*s.c;            // ยอดขาย / ต้นทุน ของรายการขาย
const P=id=>db.p.find(x=>x.id===id);
const sold=id=>sum(db.s.filter(s=>s.pid===id),s=>s.q);
const emptyRow=(n,t)=>`<tr><td colspan="${n}" class="empty">${t}</td></tr>`;
// รวมยอดขายแยกตามสินค้า: q=จำนวน r=ยอดขาย c=ต้นทุน p=กำไร
const grp=()=>{const o={};db.s.forEach(s=>{const x=o[s.pid]=o[s.pid]||{n:s.n,q:0,r:0,c:0,p:0};x.q+=s.q;x.r+=rv(s);x.c+=cs(s);x.p+=rv(s)-cs(s)});return Object.values(o)};
