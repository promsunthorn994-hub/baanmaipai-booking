import { useState, useEffect } from "react";

const LOGO = "data:image/png;base64,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";
const SK = "bmp_v4";
const ADMIN_PW = "bmp2026";
async function load() { try { const r=await window.storage.get(SK); return r?JSON.parse(r.value):[]; } catch{return[];} }
async function save(d) { try{await window.storage.set(SK,JSON.stringify(d));}catch{} }

// ── THAI PUBLIC HOLIDAYS 2025-2026 ───────────────────────────────────────────
const HOLIDAYS = new Set([
  // 2025
  "2025-01-01","2025-02-12","2025-04-06","2025-04-07","2025-04-08",
  "2025-04-13","2025-04-14","2025-04-15","2025-05-01","2025-05-05",
  "2025-05-12","2025-06-03","2025-07-10","2025-07-28","2025-08-12",
  "2025-10-13","2025-10-23","2025-12-05","2025-12-10","2025-12-31",
  // 2026
  "2026-01-01","2026-03-03","2026-04-06","2026-04-13","2026-04-14",
  "2026-04-15","2026-05-01","2026-05-04","2026-05-20","2026-06-03",
  "2026-07-13","2026-07-28","2026-08-12","2026-10-13","2026-10-23",
  "2026-12-05","2026-12-10","2026-12-31",
]);

function isOpenDay(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const dow = d.getDay(); // 0=Sun, 6=Sat
  return dow === 0 || dow === 6 || HOLIDAYS.has(dateStr);
}

function getNextOpenDay() {
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const s = d.toISOString().slice(0, 10);
    if (isOpenDay(s)) return s;
    d.setDate(d.getDate() + 1);
  }
  return new Date().toISOString().slice(0, 10);
}

// ── TIME / AVAILABILITY ───────────────────────────────────────────────────────
function buildSlots() {
  const slots = [];
  for (let h = 8; h <= 17; h++) {
    slots.push(`${String(h).padStart(2,'0')}:00`);
    if (h < 17) slots.push(`${String(h).padStart(2,'0')}:30`);
  }
  return slots;
}
const TIME_SLOTS = buildSlots();
const GAP = 30;

function toMins(t) { const [h,m]=t.split(':').map(Number); return h*60+m; }
function fromMins(m) { return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`; }
function returnTime(startTime, durMins) { return fromMins(toMins(startTime)+durMins); }

function getAvailUnits(eq, date, startTime, durMins, bookings) {
  const startM = toMins(startTime), endM = startM + durMins;
  let used = 0;
  bookings.forEach(b => {
    if (b.status==="cancelled" || b.date!==date) return;
    b.items?.forEach(it => {
      if (it.activityId !== eq.id) return;
      const bS = toMins(b.time), bE = bS + it.durMins + GAP;
      if (startM < bE && endM + GAP > bS) used += it.qty;
    });
  });
  return Math.max(0, eq.maxUnits - used);
}

function getTourAvail(date, startTime, bookings) {
  const startM = toMins(startTime), endM = startM + 120;
  let used = 0;
  bookings.forEach(b => {
    if (b.status==="cancelled" || b.date!==date) return;
    b.items?.forEach(it => {
      if (it.activityId !== "tour") return;
      const bS = toMins(b.time), bE = bS + 120 + GAP;
      if (startM < bE && endM + GAP > bS) used += it.qty;
    });
  });
  return Math.max(0, 20 - used);
}

// ── EQUIPMENT DATA ────────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id:"kayak1", icon:"🛶", maxUnits:4, minDur:60, stepDur:60, pricingType:"fixed", price:100, seatOptions:null, hasGuide:false,
    names:{th:"คายัค 1 ที่นั่ง",en:"Kayak (1-seat)",zh:"单人皮划艇",ko:"카약 (1인승)",ja:"カヤック（1人用）"},
    prices:{th:"100 ฿/ชม.",en:"100 ฿/hr",zh:"100 ฿/时",ko:"100 ฿/시간",ja:"100 ฿/時間"}},
  { id:"kayak2", icon:"🚣", maxUnits:12, minDur:60, stepDur:60, pricingType:"seats", price:null,
    seatOptions:[{seats:2,price:200},{seats:3,price:250}], hasGuide:true,
    names:{th:"คายัค 2+1 ที่นั่ง",en:"Kayak (2+1 seats)",zh:"双人皮划艇",ko:"카약 (2+1인승)",ja:"カヤック（2+1人用）"},
    prices:{th:"200–250 ฿/ชม.",en:"200–250 ฿/hr",zh:"200–250 ฿/时",ko:"200–250 ฿/시간",ja:"200–250 ฿/時間"}},
  { id:"watercycle", icon:"🚲", maxUnits:4, minDur:30, stepDur:30, pricingType:"fixed", price:200, seatOptions:null, hasGuide:false,
    names:{th:"จักรยานน้ำ",en:"Water Cycle",zh:"水上自行车",ko:"수상 자전거",ja:"水上自転車"},
    prices:{th:"200 ฿/30นาที",en:"200 ฿/30min",zh:"200 ฿/30分",ko:"200 ฿/30분",ja:"200 ฿/30分"}},
  { id:"sup", icon:"🏄", maxUnits:4, minDur:60, stepDur:60, pricingType:"fixed", price:150, seatOptions:null, hasGuide:false,
    names:{th:"ซับบอร์ด (SUP)",en:"SUP Board",zh:"桨板（SUP）",ko:"SUP 보드",ja:"SUPボード"},
    prices:{th:"150 ฿/ชม.",en:"150 ฿/hr",zh:"150 ฿/时",ko:"150 ฿/시간",ja:"150 ฿/時間"}},
];
const TOUR = { id:"tour", icon:"⛵", maxUnits:20, minDur:120, stepDur:120, pricingType:"fixed", price:600, hasGuide:false,
  names:{th:"นั่งเรือชมคลอง",en:"Canal Cruise",zh:"运河游览",ko:"운하 크루즈",ja:"運河クルーズ"},
  prices:{th:"600 ฿/คน (2ชม.)",en:"600 ฿/pax (2hr)",zh:"600 ฿/人(2小时)",ko:"600 ฿/인(2시간)",ja:"600 ฿/人(2時間)"}};

function getDurOptions(eq) {
  const opts = [], max = eq.id==="tour" ? eq.minDur : 180;
  for (let d = eq.minDur; d <= max; d += eq.stepDur) opts.push(d);
  return opts;
}

function calcItemPrice(eq, qty, durMins, seats, guideQty=0) {
  let base = 0;
  if (eq.pricingType==="fixed") {
    base = eq.price * (durMins/eq.stepDur) * qty;
  } else {
    const opt = eq.seatOptions.find(o=>o.seats===seats)||eq.seatOptions[0];
    base = opt.price * (durMins/60) * qty;
  }
  return base + (eq.hasGuide ? 300*(durMins/60)*guideQty : 0);
}

function durLabel(mins, lang) {
  if (mins < 60) { return {th:`${mins} นาที`,en:`${mins} min`,zh:`${mins}分`,ko:`${mins}분`,ja:`${mins}分`}[lang]||`${mins}min`; }
  if (mins%60===0) { const h=mins/60; return {th:`${h} ชม.`,en:`${h} hr`,zh:`${h}小时`,ko:`${h}시간`,ja:`${h}時間`}[lang]||`${h}hr`; }
  const h=Math.floor(mins/60),m=mins%60;
  return {th:`${h} ชม. ${m} นาที`,en:`${h}hr ${m}min`,zh:`${h}小时${m}分`,ko:`${h}시간 ${m}분`,ja:`${h}時間${m}分`}[lang]||`${h}h${m}m`;
}

function genId() { return "BMP"+Date.now().toString(36).toUpperCase(); }
function todayStr() { return new Date().toISOString().slice(0,10); }
function formatDate(d, lang) {
  if (!d) return "";
  const [y,m,day] = d.split("-");
  if (lang==="th") { const mo=["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]; return `${parseInt(day)} ${mo[parseInt(m)]} ${parseInt(y)+543}`; }
  return `${parseInt(day)}/${parseInt(m)}/${y}`;
}

// ── PAYMENT METHODS ───────────────────────────────────────────────────────────
const PAY_METHODS = [
  { id:"promptpay", icon:"🇹🇭", label:{th:"PromptPay",en:"PromptPay",zh:"PromptPay",ko:"PromptPay",ja:"PromptPay"}, color:"#1b2f4e" },
  { id:"kbank",     icon:"💚", label:{th:"KBank QR",en:"KBank QR",zh:"KBank QR",ko:"KBank QR",ja:"KBank QR"}, color:"#138f2d" },
  { id:"alipay",    icon:"🔵", label:{th:"Alipay",en:"Alipay",zh:"支付宝",ko:"알리페이",ja:"Alipay"}, color:"#009FE8" },
  { id:"wechat",    icon:"💬", label:{th:"WeChat Pay",en:"WeChat Pay",zh:"微信支付",ko:"위챗페이",ja:"WeChat Pay"}, color:"#07C160" },
  { id:"linepay",   icon:"🟢", label:{th:"LINE Pay",en:"LINE Pay",zh:"LINE Pay",ko:"LINE Pay",ja:"LINE Pay"}, color:"#00B900" },
];

// SVG QR placeholders per method
function makeQR(color, line1, line2) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 210" width="180" height="210"><rect width="200" height="210" fill="white"/><rect x="20" y="20" width="46" height="46" rx="4" fill="none" stroke="${color}" stroke-width="3"/><rect x="29" y="29" width="28" height="28" rx="2" fill="${color}"/><rect x="134" y="20" width="46" height="46" rx="4" fill="none" stroke="${color}" stroke-width="3"/><rect x="143" y="29" width="28" height="28" rx="2" fill="${color}"/><rect x="20" y="144" width="46" height="46" rx="4" fill="none" stroke="${color}" stroke-width="3"/><rect x="29" y="153" width="28" height="28" rx="2" fill="${color}"/><rect x="80" y="20" width="9" height="9" fill="${color}"/><rect x="93" y="20" width="17" height="9" fill="${color}"/><rect x="80" y="33" width="22" height="9" fill="${color}"/><rect x="80" y="46" width="9" height="9" fill="${color}"/><rect x="93" y="46" width="9" height="9" fill="${color}"/><rect x="80" y="77" width="9" height="9" fill="${color}"/><rect x="93" y="77" width="22" height="9" fill="${color}"/><rect x="80" y="90" width="9" height="9" fill="${color}"/><rect x="93" y="90" width="9" height="9" fill="${color}"/><rect x="80" y="103" width="22" height="9" fill="${color}"/><rect x="134" y="77" width="9" height="9" fill="${color}"/><rect x="147" y="77" width="22" height="9" fill="${color}"/><rect x="134" y="90" width="22" height="9" fill="${color}"/><rect x="134" y="103" width="9" height="9" fill="${color}"/><rect x="152" y="103" width="17" height="9" fill="${color}"/><rect x="80" y="124" width="9" height="9" fill="${color}"/><rect x="93" y="124" width="22" height="9" fill="${color}"/><rect x="80" y="137" width="22" height="9" fill="${color}"/><rect x="80" y="150" width="9" height="9" fill="${color}"/><rect x="93" y="150" width="9" height="9" fill="${color}"/><rect x="80" y="163" width="22" height="9" fill="${color}"/><rect x="134" y="124" width="22" height="9" fill="${color}"/><rect x="147" y="137" width="22" height="9" fill="${color}"/><rect x="134" y="150" width="9" height="9" fill="${color}"/><rect x="152" y="150" width="17" height="9" fill="${color}"/><rect x="134" y="163" width="22" height="9" fill="${color}"/><text x="100" y="195" text-anchor="middle" font-size="10" fill="#333" font-family="sans-serif">${line1}</text><text x="100" y="207" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif">${line2}</text></svg>`)}`;
}

const QR_IMGS = {
  promptpay: makeQR("#1b2f4e","PromptPay · บ้านไม้พาย","แทนที่ด้วย QR จริงจากธนาคาร"),
  kbank:     makeQR("#138f2d","KBank QR · บ้านไม้พาย","Replace with actual KBank QR"),
  alipay:    makeQR("#009FE8","Alipay · Baan Mai Pai","Replace with actual Alipay QR"),
  wechat:    makeQR("#07C160","WeChat Pay · Baan Mai Pai","Replace with actual WeChat QR"),
  linepay:   makeQR("#00B900","LINE Pay · บ้านไม้พาย","Replace with actual LINE Pay QR"),
};


// ── LANGS & I18N ─────────────────────────────────────────────────────────────
const LANGS=[{code:"th",label:"🇹🇭 ไทย"},{code:"en",label:"🇬🇧 EN"},{code:"zh",label:"🇨🇳 中文"},{code:"ko",label:"🇰🇷 한국어"},{code:"ja",label:"🇯🇵 日本語"}];

const T={
  th:{
    book:"จองกิจกรรม",admin:"แอดมิน",hero_sub:"คลองอ้อมนนท์ · วัดปรางค์หลวง · บางใหญ่ นนทบุรี",
    cat_water:"🏄 กีฬาทางน้ำ",cat_tour:"⛵ นั่งเรือชมคลอง",
    cat_water_desc:"เลือกได้หลายอย่าง จ่ายรวมครั้งเดียว",cat_tour_desc:"ล่องชมวิถีชีวิตริมคลองอ้อมนนท์",
    step_dt:"วันที่/เวลา",step_act:"กิจกรรม",step_cart:"ตะกร้า",step_info:"ข้อมูล",step_tnc:"เงื่อนไข",step_pay:"ชำระเงิน",
    date_label:"วันที่",time_label:"รอบเวลา",
    time_note:"ปล่อยเรือ 08:00–17:00 · คืนเรือไม่เกิน 19:00",
    open_only:"เปิดให้บริการเฉพาะ เสาร์–อาทิตย์ และวันหยุดนักขัตฤกษ์",
    closed_day:"วันนี้ไม่เปิดให้บริการ กรุณาเลือกวันเสาร์ อาทิตย์ หรือวันหยุดนักขัตฤกษ์",
    holiday:"วันหยุดนักขัตฤกษ์",
    select_act:"เลือกกิจกรรม",avail:"ว่าง",full:"เต็ม",
    cart:"ตะกร้า",cart_empty:"ยังไม่มีรายการ",remove:"ลบ",
    qty:"จำนวน",duration:"ระยะเวลา",seats_per:"ผู้โดยสาร/ลำ",
    guide_addon:"👤 เพิ่มผู้ช่วยพาย (ไม่บังคับ)",guide_desc:"300 ฿/คน/ชม.",
    subtotal:"ราคา",total:"รวมทั้งหมด",back:"← ย้อนกลับ",next:"ถัดไป →",
    contact:"ข้อมูลผู้จอง",name:"ชื่อ-นามสกุล",phone:"เบอร์โทรศัพท์",
    email:"อีเมล (รับยืนยันการจอง)",email_ph:"example@email.com",
    note:"หมายเหตุ",note_ph:"เช่น มีเด็กเล็ก, ผู้สูงอายุ...",
    tnc_title:"เงื่อนไขการจองและการใช้บริการ",
    tnc_must:"กรุณาอ่านและทำความเข้าใจเงื่อนไขทุกข้อ",
    tnc_accept_all:"✓ ฉันอ่านและยอมรับเงื่อนไขทุกข้อแล้ว",
    pay_title:"ชำระเงิน",pay_note:"สแกน QR แล้วแจ้งชื่อผู้จอง",pay_ref:"อ้างอิง:",
    pay_how:"วิธีสมัคร",
    slip_title:"📎 แนบสลิปการโอนเงิน",
    slip_desc:"กรุณาอัปโหลดสลิปหลังโอนเงินเพื่อยืนยันการจอง",
    slip_btn:"เลือกไฟล์สลิป",slip_uploaded:"✓ อัปโหลดสลิปแล้ว",
    slip_optional:"(ไม่บังคับ สามารถส่งสลิปผ่าน LINE ภายหลังได้)",
    confirm:"✓ ยืนยันการจอง",
    success:"🎉 จองสำเร็จแล้ว!",
    success_screenshot:"📱 กรุณาแคปหน้าจอนี้ไว้เป็นหลักฐาน",
    success_email:"หรือเช็คอีเมลยืนยันที่",
    success_show:"กรุณาแสดงรหัสจองเมื่อถึงจุดบริการ",
    line_contact:"📞 ติดต่อสอบถาม: LINE @baanmaipai",
    book_more:"+ จองเพิ่ม",items:"รายการ",pax:"คน",return_at:"คืนเรือ",
    admin_title:"📊 ภาพรวม",total_b:"จองทั้งหมด",today_b:"วันนี้",revenue:"รายได้ (฿)",cancelled_n:"ยกเลิก",
    all_b:"รายการจองทั้งหมด",all_status:"ทุกสถานะ",confirmed_s:"ยืนยันแล้ว",cancelled_s:"ยกเลิก",
    clear:"✕ ล้าง",view:"ดู",cancel_b:"ยกเลิก",close:"ปิด",
    b_id:"รหัสจอง",b_date:"วันที่",booker:"ผู้จอง",tel:"โทร",status:"สถานะ",remarks:"หมายเหตุ",
    conf_badge:"✓ ยืนยัน",canc_badge:"✕ ยกเลิก",no_b:"ไม่มีรายการจอง",
    cancel_q:"ยืนยันยกเลิกการจองนี้?",cancelled_toast:"ยกเลิกแล้ว",
    pw:"รหัสผ่าน",login:"เข้าสู่ระบบ",wrong_pw:"รหัสผ่านไม่ถูกต้อง",loading:"กำลังโหลด...",b_detail:"รายละเอียดการจอง",
    edit_detail:"▼ ปรับรายละเอียด",
  },
  en:{
    book:"Book Activities",admin:"Admin",hero_sub:"Om Non Canal · Wat Prang Luang · Bang Yai, Nonthaburi",
    cat_water:"🏄 Water Sports",cat_tour:"⛵ Canal Cruise",
    cat_water_desc:"Mix & match, pay once",cat_tour_desc:"Explore life along Om Non Canal",
    step_dt:"Date/Time",step_act:"Activity",step_cart:"Cart",step_info:"Info",step_tnc:"T&C",step_pay:"Payment",
    date_label:"Date",time_label:"Time Slot",time_note:"Launch 08:00–17:00 · Return by 19:00",
    open_only:"Open on Saturdays, Sundays & Public Holidays only",
    closed_day:"Closed today. Please select a Saturday, Sunday or Public Holiday.",
    holiday:"Public Holiday",
    select_act:"Select Activity",avail:"Available",full:"Full",
    cart:"Cart",cart_empty:"No items yet",remove:"Remove",
    qty:"Qty",duration:"Duration",seats_per:"Passengers/boat",
    guide_addon:"👤 Add Paddling Guide (Optional)",guide_desc:"300 ฿/person/hr",
    subtotal:"Price",total:"Grand Total",back:"← Back",next:"Next →",
    contact:"Booking Info",name:"Full Name",phone:"Phone Number",
    email:"Email (for booking confirmation)",email_ph:"example@email.com",
    note:"Remarks",note_ph:"e.g. children, elderly...",
    tnc_title:"Terms & Conditions",tnc_must:"Please read and understand all terms",
    tnc_accept_all:"✓ I have read and accept all terms",
    pay_title:"Payment",pay_note:"Scan QR and state your name",pay_ref:"Ref:",
    pay_how:"How to sign up",
    slip_title:"📎 Upload Payment Slip",
    slip_desc:"Please upload your transfer slip to confirm booking",
    slip_btn:"Select Slip File",slip_uploaded:"✓ Slip uploaded",
    slip_optional:"(Optional — you can also send via LINE)",
    confirm:"✓ Confirm Booking",
    success:"🎉 Booking Confirmed!",
    success_screenshot:"📱 Please screenshot this page as proof",
    success_email:"Or check confirmation email at",
    success_show:"Show this code on arrival",
    line_contact:"📞 Contact: LINE @baanmaipai",
    book_more:"+ Book More",items:"items",pax:"pax",return_at:"Return by",
    admin_title:"📊 Overview",total_b:"Total",today_b:"Today",revenue:"Revenue (฿)",cancelled_n:"Cancelled",
    all_b:"All Bookings",all_status:"All Status",confirmed_s:"Confirmed",cancelled_s:"Cancelled",
    clear:"✕ Clear",view:"View",cancel_b:"Cancel",close:"Close",
    b_id:"Booking ID",b_date:"Date",booker:"Name",tel:"Tel",status:"Status",remarks:"Remarks",
    conf_badge:"✓ Confirmed",canc_badge:"✕ Cancelled",no_b:"No bookings found",
    cancel_q:"Confirm cancellation?",cancelled_toast:"Booking cancelled",
    pw:"Password",login:"Login",wrong_pw:"Incorrect password",loading:"Loading...",b_detail:"Booking Detail",
    edit_detail:"▼ Edit details",
  },
  zh:{
    book:"预约活动",admin:"管理员",hero_sub:"奥姆农运河 · 帕朗鲁昂寺 · 邦亚 暖武里",
    cat_water:"🏄 水上运动",cat_tour:"⛵ 运河游览",
    cat_water_desc:"多选设备，一次结算",cat_tour_desc:"探索奥姆农运河沿岸风情",
    step_dt:"日期/时间",step_act:"活动",step_cart:"购物车",step_info:"信息",step_tnc:"条款",step_pay:"付款",
    date_label:"日期",time_label:"时间段",time_note:"出发 08:00–17:00 · 19:00前归还",
    open_only:"仅周六、周日及法定节假日开放",
    closed_day:"今日不开放，请选择周六、周日或法定节假日",
    holiday:"法定节假日",
    select_act:"选择活动",avail:"可用",full:"已满",
    cart:"购物车",cart_empty:"暂无项目",remove:"删除",
    qty:"数量",duration:"时长",seats_per:"乘客/艘",
    guide_addon:"👤 添加向导（可选）",guide_desc:"300 ฿/人/小时",
    subtotal:"价格",total:"合计",back:"← 返回",next:"下一步 →",
    contact:"预约信息",name:"姓名",phone:"电话",
    email:"邮箱（接收预约确认）",email_ph:"example@email.com",
    note:"备注",note_ph:"例：带小孩、老人...",
    tnc_title:"预约条款与条件",tnc_must:"请阅读并理解所有条款",
    tnc_accept_all:"✓ 我已阅读并同意所有条款",
    pay_title:"付款",pay_note:"扫码后请注明姓名",pay_ref:"参考号:",
    pay_how:"如何注册",
    slip_title:"📎 上传付款凭证",
    slip_desc:"请上传转账截图以确认预约",
    slip_btn:"选择文件",slip_uploaded:"✓ 已上传",
    slip_optional:"（可选 — 也可通过LINE发送）",
    confirm:"✓ 确认预约",
    success:"🎉 预约成功！",
    success_screenshot:"📱 请截图保存此页面作为凭证",
    success_email:"或查看确认邮件",
    success_show:"到达时请出示此码",
    line_contact:"📞 联系: LINE @baanmaipai",
    book_more:"+ 继续预约",items:"项目",pax:"人",return_at:"归还时间",
    admin_title:"📊 概览",total_b:"总预约",today_b:"今天",revenue:"收入 (฿)",cancelled_n:"已取消",
    all_b:"所有预约",all_status:"所有状态",confirmed_s:"已确认",cancelled_s:"已取消",
    clear:"✕ 清除",view:"查看",cancel_b:"取消",close:"关闭",
    b_id:"预约编号",b_date:"日期",booker:"姓名",tel:"电话",status:"状态",remarks:"备注",
    conf_badge:"✓ 已确认",canc_badge:"✕ 已取消",no_b:"没有预约记录",
    cancel_q:"确认取消？",cancelled_toast:"预约已取消",
    pw:"密码",login:"登录",wrong_pw:"密码错误",loading:"加载中...",b_detail:"预约详情",
    edit_detail:"▼ 调整",
  },
  ko:{
    book:"액티비티 예약",admin:"관리자",hero_sub:"옴논 운하 · 왓 프랑 루앙 · 방야이 논타부리",
    cat_water:"🏄 수상 스포츠",cat_tour:"⛵ 운하 크루즈",
    cat_water_desc:"여러 장비 선택, 한 번에 결제",cat_tour_desc:"옴논 운하 탐방",
    step_dt:"날짜/시간",step_act:"액티비티",step_cart:"장바구니",step_info:"정보",step_tnc:"약관",step_pay:"결제",
    date_label:"날짜",time_label:"시간대",time_note:"출발 08:00–17:00 · 19:00 전 반납",
    open_only:"토·일요일 및 공휴일만 운영",
    closed_day:"오늘은 운영하지 않습니다. 토·일요일 또는 공휴일을 선택해 주세요.",
    holiday:"공휴일",
    select_act:"액티비티 선택",avail:"가능",full:"마감",
    cart:"장바구니",cart_empty:"항목 없음",remove:"삭제",
    qty:"수량",duration:"이용 시간",seats_per:"탑승 인원/보트",
    guide_addon:"👤 가이드 추가 (선택)",guide_desc:"300 ฿/인/시간",
    subtotal:"가격",total:"총계",back:"← 뒤로",next:"다음 →",
    contact:"예약 정보",name:"성명",phone:"전화번호",
    email:"이메일 (예약 확인용)",email_ph:"example@email.com",
    note:"비고",note_ph:"예: 어린이 동반, 노인...",
    tnc_title:"이용 약관",tnc_must:"모든 항목을 읽고 이해해 주세요",
    tnc_accept_all:"✓ 모든 약관을 읽고 동의합니다",
    pay_title:"결제",pay_note:"QR 스캔 후 이름 알려주세요",pay_ref:"참조번호:",
    pay_how:"가입 방법",
    slip_title:"📎 결제 영수증 업로드",
    slip_desc:"예약 확인을 위해 이체 영수증을 업로드해 주세요",
    slip_btn:"파일 선택",slip_uploaded:"✓ 업로드 완료",
    slip_optional:"(선택사항 — LINE으로도 전송 가능)",
    confirm:"✓ 예약 확정",
    success:"🎉 예약 완료!",
    success_screenshot:"📱 이 페이지를 스크린샷으로 저장해 주세요",
    success_email:"또는 확인 이메일 확인",
    success_show:"도착 시 이 코드를 보여주세요",
    line_contact:"📞 문의: LINE @baanmaipai",
    book_more:"+ 추가 예약",items:"항목",pax:"인",return_at:"반납 시간",
    admin_title:"📊 개요",total_b:"총 예약",today_b:"오늘",revenue:"수익 (฿)",cancelled_n:"취소",
    all_b:"모든 예약",all_status:"모든 상태",confirmed_s:"확정됨",cancelled_s:"취소됨",
    clear:"✕ 초기화",view:"보기",cancel_b:"취소",close:"닫기",
    b_id:"예약 번호",b_date:"날짜",booker:"성명",tel:"전화",status:"상태",remarks:"비고",
    conf_badge:"✓ 확정",canc_badge:"✕ 취소",no_b:"예약 없음",
    cancel_q:"예약을 취소하시겠습니까?",cancelled_toast:"예약 취소됨",
    pw:"비밀번호",login:"로그인",wrong_pw:"잘못된 비밀번호",loading:"로딩 중...",b_detail:"예약 상세",
    edit_detail:"▼ 수정",
  },
  ja:{
    book:"予約する",admin:"管理者",hero_sub:"オムノン運河 · ワット・プラン・ルアン · バーンヤイ ノンタブリー",
    cat_water:"🏄 ウォータースポーツ",cat_tour:"⛵ 運河クルーズ",
    cat_water_desc:"複数選択・まとめて支払い",cat_tour_desc:"オムノン運河の生活を探索",
    step_dt:"日付/時間",step_act:"アクティビティ",step_cart:"カート",step_info:"情報",step_tnc:"規約",step_pay:"支払い",
    date_label:"日付",time_label:"時間帯",time_note:"出発 08:00–17:00 · 19:00までに返却",
    open_only:"土・日曜日および祝日のみ営業",
    closed_day:"本日は営業しておりません。土・日曜日または祝日をお選びください。",
    holiday:"祝日",
    select_act:"アクティビティ選択",avail:"空き",full:"満席",
    cart:"カート",cart_empty:"なし",remove:"削除",
    qty:"数量",duration:"利用時間",seats_per:"乗客数/艇",
    guide_addon:"👤 ガイド追加（任意）",guide_desc:"300 ฿/人/時間",
    subtotal:"料金",total:"合計",back:"← 戻る",next:"次へ →",
    contact:"予約情報",name:"氏名",phone:"電話番号",
    email:"メール（予約確認用）",email_ph:"example@email.com",
    note:"備考",note_ph:"例：子供連れ、高齢者...",
    tnc_title:"利用規約",tnc_must:"すべての項目をお読みください",
    tnc_accept_all:"✓ すべての規約を読み、同意します",
    pay_title:"お支払い",pay_note:"QRスキャン後、お名前をお知らせください",pay_ref:"参照番号:",
    pay_how:"登録方法",
    slip_title:"📎 支払い領収書をアップロード",
    slip_desc:"予約確認のため、振込領収書をアップロードしてください",
    slip_btn:"ファイルを選択",slip_uploaded:"✓ アップロード完了",
    slip_optional:"（任意 — LINEでも送信可能）",
    confirm:"✓ 予約を確定する",
    success:"🎉 予約完了！",
    success_screenshot:"📱 このページをスクリーンショットで保存してください",
    success_email:"または確認メールを確認",
    success_show:"到着時にコードをご提示ください",
    line_contact:"📞 お問い合わせ: LINE @baanmaipai",
    book_more:"+ さらに予約",items:"アイテム",pax:"名",return_at:"返却時間",
    admin_title:"📊 概要",total_b:"総予約",today_b:"本日",revenue:"収益 (฿)",cancelled_n:"キャンセル",
    all_b:"全予約",all_status:"全ステータス",confirmed_s:"確定済み",cancelled_s:"キャンセル済み",
    clear:"✕ クリア",view:"詳細",cancel_b:"キャンセル",close:"閉じる",
    b_id:"予約番号",b_date:"日付",booker:"氏名",tel:"電話",status:"ステータス",remarks:"備考",
    conf_badge:"✓ 確定",canc_badge:"✕ キャンセル",no_b:"予約なし",
    cancel_q:"キャンセルしますか？",cancelled_toast:"予約キャンセル済み",
    pw:"パスワード",login:"ログイン",wrong_pw:"パスワードが違います",loading:"読み込み中...",b_detail:"予約詳細",
    edit_detail:"▼ 詳細を編集",
  },
};


// ── T&C ───────────────────────────────────────────────────────────────────────
const TNC={
  th:[
    {id:"a",title:"การยืนยันการจอง",body:"การจองสมบูรณ์เมื่อชำระเงินครบถ้วนและได้รับรหัสจองแล้วเท่านั้น"},
    {id:"b",title:"นโยบายไม่คืนเงิน",body:"หลังชำระเงินแล้ว ไม่สามารถขอคืนเงินได้ทุกกรณี รวมถึงการเปลี่ยนใจหรือไม่สามารถมาใช้บริการได้"},
    {id:"c",title:"การมาสาย",body:"กรุณามาถึงก่อนเวลาจอง 10–15 นาที หากมาหลังเวลาจอง เวลาเล่นจะนับจากเวลาจองที่ระบุ ไม่มีการขยายเวลาหรือชดเชยใดๆ"},
    {id:"d",title:"ความปลอดภัย",body:"ผู้ใช้บริการต้องสวมชูชีพตลอดเวลา เด็กอายุต่ำกว่า 12 ปีต้องมีผู้ปกครองดูแลตลอดเวลา ผู้ที่ว่ายน้ำไม่เป็นต้องแจ้งเจ้าหน้าที่"},
    {id:"e",title:"ความรับผิดชอบต่อร่างกาย",body:"กิจกรรมทางน้ำมีความเสี่ยงโดยธรรมชาติ ผู้ใช้บริการรับทราบและยอมรับความเสี่ยงด้วยตนเอง บ้านไม้พายไม่รับผิดชอบต่อการบาดเจ็บหรืออุบัติเหตุ เว้นแต่เกิดจากความประมาทเลินเล่ออย่างร้ายแรงของเจ้าหน้าที่ ผู้มีโรคประจำตัว ตั้งครรภ์ หรือมีข้อจำกัดทางร่างกายควรปรึกษาแพทย์ก่อน"},
    {id:"f",title:"ความรับผิดชอบต่อสถานที่และอุปกรณ์",body:"ผู้ใช้บริการต้องดูแลรักษาอุปกรณ์และสถานที่ให้อยู่ในสภาพเรียบร้อย หากเกิดความเสียหายจากการใช้งานที่ไม่เหมาะสม ผู้ใช้บริการต้องรับผิดชอบค่าซ่อมแซมหรือชดใช้ตามจริง"},
    {id:"g",title:"การอนุรักษ์สิ่งแวดล้อมและธรรมชาติ",body:"ห้ามทิ้งขยะหรือสิ่งใดลงในแหล่งน้ำและพื้นที่โดยรอบ ห้ามส่งเสียงดังรบกวนชุมชนและสัตว์ในธรรมชาติ ห้ามนำพืชหรือสัตว์ออกจากพื้นที่ การฝ่าฝืนอาจถูกดำเนินคดีตามกฎหมาย"},
    {id:"h",title:"สภาพอากาศ",body:"หากสภาพอากาศไม่เอื้ออำนวยและทางเราต้องยกเลิกบริการ ผู้จองจะได้รับการนัดวันใหม่หรือรับเครดิตเต็มจำนวน ซึ่งเป็นข้อยกเว้นของนโยบายไม่คืนเงิน"},
    {id:"i",title:"ทรัพย์สินส่วนตัว",body:"บ้านไม้พายไม่รับผิดชอบต่อทรัพย์สินส่วนตัวที่สูญหายหรือเสียหายระหว่างใช้บริการ กรุณาเก็บของมีค่าไว้กับผู้ดูแลบนฝั่ง"},
    {id:"j",title:"การยกเลิกโดยผู้จอง",body:"หากต้องการเลื่อนวัน กรุณาติดต่อล่วงหน้าอย่างน้อย 24 ชั่วโมง ขึ้นอยู่กับดุลยพินิจของทางเรา"},
  ],
  en:[
    {id:"a",title:"Booking Confirmation",body:"Booking is complete only upon full payment and receipt of a booking code."},
    {id:"b",title:"No Refund Policy",body:"All payments are non-refundable under any circumstances, including change of mind or inability to attend."},
    {id:"c",title:"Late Arrival",body:"Please arrive 10–15 minutes before your booking time. If you arrive late, activity time is counted from the booked start time with no extension or compensation."},
    {id:"d",title:"Safety",body:"Life jackets must be worn at all times. Children under 12 must be accompanied by an adult. Non-swimmers must inform staff before use."},
    {id:"e",title:"Physical Liability",body:"Water activities carry inherent risks. Participants acknowledge and accept these risks. Baan Mai Pai is not liable for injury or accidents unless caused by gross negligence of staff. Those with medical conditions, pregnancy, or physical limitations should consult a doctor first."},
    {id:"f",title:"Venue & Equipment",body:"Guests must care for all equipment and facilities. Damage caused by improper use will be the guest's financial responsibility."},
    {id:"g",title:"Environmental Conservation",body:"Do not litter in the waterway or surrounding area. Do not disturb wildlife or the community. Removing plants or animals is prohibited and may result in legal action."},
    {id:"h",title:"Weather Cancellation",body:"If we cancel due to unsafe weather, guests will be offered a reschedule or full credit. This is the sole exception to the no-refund policy."},
    {id:"i",title:"Personal Belongings",body:"Baan Mai Pai is not responsible for lost or damaged personal property. Please leave valuables with someone on shore."},
    {id:"j",title:"Guest Cancellation",body:"To reschedule, please contact us at least 24 hours in advance. Subject to availability and management discretion."},
  ],
  zh:[
    {id:"a",title:"预约确认",body:"仅在全额付款并收到预约码后，预约方为完成。"},
    {id:"b",title:"不退款政策",body:"付款后，任何情况下均不予退款，包括改变主意或无法出席。"},
    {id:"c",title:"迟到政策",body:"请提前10–15分钟到达。若迟到，活动时间从预约时间开始计算，不予延时或补偿。"},
    {id:"d",title:"安全须知",body:"全程必须穿戴救生衣。12岁以下儿童须由成人全程陪同。不会游泳者须事先告知工作人员。"},
    {id:"e",title:"人身责任",body:"水上活动存在固有风险，参与者自行承担风险。除工作人员严重疏失外，不对受伤或事故负责。有病史、孕妇或有身体限制者请先咨询医生。"},
    {id:"f",title:"场地及设备",body:"宾客须爱护所有设备及设施。因不当使用造成的损坏，须由宾客承担修缮费用。"},
    {id:"g",title:"环境保护",body:"禁止向水域或周边区域乱扔垃圾。禁止打扰野生动物或当地社区。禁止带走动植物，违者可能面临法律追究。"},
    {id:"h",title:"天气取消",body:"如因恶劣天气取消服务，可安排改期或获得全额积分。"},
    {id:"i",title:"个人财物",body:"不对个人财物的丢失或损坏负责，请将贵重物品交由岸上人员保管。"},
    {id:"j",title:"客户取消",body:"如需改期，请至少提前24小时联系我们，改期视情况而定。"},
  ],
  ko:[
    {id:"a",title:"예약 확인",body:"전액 결제 후 예약 코드를 받은 경우에만 예약이 완료됩니다."},
    {id:"b",title:"환불 불가 정책",body:"결제 후에는 어떠한 경우에도 환불이 불가합니다."},
    {id:"c",title:"지각 정책",body:"예약 시간 10–15분 전에 도착해 주세요. 늦게 도착하면 활동 시간은 예약 시간부터 계산됩니다."},
    {id:"d",title:"안전 수칙",body:"구명조끼는 항상 착용해야 합니다. 12세 미만 어린이는 보호자가 동반해야 합니다."},
    {id:"e",title:"신체 책임",body:"수상 활동은 고유한 위험을 동반합니다. 참가자는 이러한 위험을 인지하고 자기 책임으로 참가합니다."},
    {id:"f",title:"시설 및 장비",body:"모든 장비와 시설을 소중히 다뤄주세요. 부적절한 사용으로 인한 손상은 고객이 책임집니다."},
    {id:"g",title:"환경 보전",body:"수역이나 주변 지역에 쓰레기를 버리지 마세요. 야생동물 방해 및 동식물 반출은 금지됩니다."},
    {id:"h",title:"날씨 취소",body:"기상 악화로 취소 시, 일정 변경 또는 전액 크레딧을 제공합니다."},
    {id:"i",title:"개인 소지품",body:"Baan Mai Pai는 개인 소지품의 분실이나 손상에 책임지지 않습니다."},
    {id:"j",title:"고객 취소",body:"일정 변경은 최소 24시간 전에 문의해 주세요."},
  ],
  ja:[
    {id:"a",title:"予約の確認",body:"全額支払い後、予約コードを受け取った時点で予約が完了します。"},
    {id:"b",title:"返金不可ポリシー",body:"支払い後は、いかなる理由においても返金はできません。"},
    {id:"c",title:"遅刻について",body:"予約時間の10〜15分前にお越しください。遅刻の場合、活動時間は予約時間から計算されます。"},
    {id:"d",title:"安全について",body:"ライフジャケットは常に着用してください。12歳未満のお子様は常に保護者が同伴してください。"},
    {id:"e",title:"身体的責任",body:"水上アクティビティには固有のリスクが伴います。参加者は自己責任で参加します。"},
    {id:"f",title:"施設・機器",body:"すべての機器・施設を大切に扱ってください。不適切な使用による損傷はお客様の負担となります。"},
    {id:"g",title:"環境保全",body:"水域や周辺地域にゴミを捨てないでください。動植物の持ち出しは禁止されています。"},
    {id:"h",title:"天候キャンセル",body:"悪天候によりキャンセルの場合、日程変更または全額クレジットを提供します。"},
    {id:"i",title:"個人の所持品",body:"Baan Mai Paiは個人の所持品の紛失・損傷について責任を負いません。"},
    {id:"j",title:"お客様都合のキャンセル",body:"日程変更は少なくとも24時間前にご連絡ください。"},
  ],
};

// Payment signup info
const PAY_HOWTO = {
  promptpay: { th:"ผูก PromptPay ผ่านแอปธนาคารที่ใช้อยู่ → เมนู PromptPay → ผูกหมายเลขบัตรประชาชนหรือเบอร์มือถือ ไม่มีค่าธรรมเนียม", en:"Link PromptPay via your bank app → PromptPay menu → Link your national ID or mobile number. Free of charge.", zh:"通过您的银行App → PromptPay菜单 → 绑定身份证号或手机号。免手续费。", ko:"은행 앱 → PromptPay 메뉴 → 주민번호 또는 휴대폰 번호 연결. 수수료 없음.", ja:"銀行アプリ → PromptPayメニュー → 国民IDまたは携帯番号を登録。手数料なし。" },
  kbank:     { th:"สมัคร K-Payment ผ่าน kbankaccount.com หรือที่ธนาคารกสิกรไทย รองรับ Alipay และ WeChat Pay ในตัว ค่าธรรมเนียม 1.5%", en:"Sign up for K-Payment at kbankaccount.com or KBank branch. Includes Alipay & WeChat Pay. 1.5% fee.", zh:"在kbankaccount.com或开泰银行分支申请K-Payment，已包含支付宝和微信支付，手续费1.5%。", ko:"kbankaccount.com 또는 KBank 지점에서 K-Payment 신청. Alipay·WeChat Pay 포함. 수수료 1.5%.", ja:"kbankaccount.comまたはKBank支店でK-Paymentに申し込み。Alipay・WeChat Pay対応。手数料1.5%。" },
  alipay:    { th:"สมัครผ่าน KBank (แนะนำ) หรือติดต่อ Alipay Thailand โดยตรง ต้องมีเอกสารธุรกิจ", en:"Apply via KBank (recommended) or contact Alipay Thailand directly. Business documents required.", zh:"通过开泰银行申请（推荐）或直接联系支付宝泰国。需要提供营业执照。", ko:"KBank를 통해 신청(권장) 또는 Alipay 태국에 직접 연락. 사업자 서류 필요.", ja:"KBank経由で申請（推奨）またはAlipay Thailandに直接連絡。事業書類が必要。" },
  wechat:    { th:"สมัครผ่าน KBank (แนะนำ) รองรับในแพ็กเกจ K-Payment เดียวกับ Alipay", en:"Apply via KBank (recommended). Included in same K-Payment package as Alipay.", zh:"通过开泰银行申请（推荐），与支付宝同一套K-Payment套餐。", ko:"KBank를 통해 신청(권장). Alipay와 동일한 K-Payment 패키지에 포함.", ja:"KBank経由で申請（推奨）。AlipayとセットのK-Paymentパッケージに含まれます。" },
  linepay:   { th:"สมัครที่ business.line.me/th เลือก LINE Pay for Merchants อัปโหลดเอกสารธุรกิจ ค่าธรรมเนียม 2.5%", en:"Sign up at business.line.me/th → LINE Pay for Merchants. Upload business docs. 2.5% fee.", zh:"在business.line.me/th注册 → LINE Pay商家版。上传营业执照。手续费2.5%。", ko:"business.line.me/th에서 가입 → LINE Pay 가맹점. 사업자 서류 업로드. 수수료 2.5%.", ja:"business.line.me/thで登録 → LINE Pay加盟店。事業書類をアップロード。手数料2.5%。" },
};


const css=`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#1b2f4e;--navy2:#243d66;--navy3:#0e1e33;--cream:#f5f0e6;--gold:#c9a84c;--gold2:#e8c96a;--white:#fff;--fog:#dce6f0;--danger:#c0392b;--green:#1a7c6e;--text:#1e2d3d;--muted:#6e7f8f;--sh:0 4px 20px rgba(27,47,78,.13);--sh2:0 2px 8px rgba(0,0,0,.07)}
body{font-family:'Noto Sans Thai','Noto Sans JP','Noto Sans KR','Noto Sans SC',sans-serif;background:var(--cream);color:var(--text);min-height:100vh}
.nav{background:var(--navy3);display:flex;align-items:center;justify-content:space-between;padding:0 13px;height:54px;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.25);gap:7px}
.nav-brand{display:flex;align-items:center;gap:7px;flex-shrink:0}
.nav-logo{width:33px;height:33px;border-radius:50%;object-fit:cover;border:2px solid var(--gold)}
.nav-title{font-family:'Playfair Display',serif;font-size:15px;color:var(--gold)}
.nav-sub{font-size:9px;color:rgba(255,255,255,.4)}
.nav-right{display:flex;align-items:center;gap:4px;flex-shrink:0}
.nav-tab{background:none;border:none;color:rgba(255,255,255,.55);font-size:11px;padding:5px 8px;border-radius:5px;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:inherit}
.nav-tab.active,.nav-tab:hover{background:rgba(201,168,76,.2);color:var(--gold)}
.lang-sel{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:var(--gold);font-size:11px;padding:4px 6px;border-radius:5px;cursor:pointer;outline:none;font-family:inherit}
.lang-sel option{background:var(--navy3);color:var(--white)}
.hero{background:linear-gradient(160deg,var(--navy) 0%,var(--navy3) 100%);color:var(--white);padding:24px 16px 20px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 58px,rgba(255,255,255,.02) 60px),repeating-linear-gradient(90deg,transparent,transparent 58px,rgba(255,255,255,.02) 60px)}
.hero-logo{width:68px;height:68px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);margin-bottom:9px;box-shadow:0 0 20px rgba(201,168,76,.28);position:relative}
.hero-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--gold);position:relative}
.hero-sub{font-size:11px;color:rgba(255,255,255,.58);margin-top:3px;position:relative}
.hero-badges{display:flex;gap:5px;justify-content:center;margin-top:9px;flex-wrap:wrap;position:relative}
.hero-badge{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.86);font-size:10px;padding:2px 9px;border-radius:20px}
.section{max-width:800px;margin:0 auto;padding:16px 12px}
.sec-title{font-size:14px;font-weight:600;color:var(--navy);border-left:3px solid var(--gold);padding-left:8px;margin-bottom:11px}
.card{background:var(--white);border-radius:12px;box-shadow:var(--sh2);padding:15px;margin-bottom:10px;border:1px solid rgba(27,47,78,.06)}
.steps{display:flex;align-items:center;justify-content:center;margin-bottom:14px;flex-wrap:wrap;gap:1px}
.step{display:flex;align-items:center;gap:3px;font-size:10px;color:var(--muted)}
.step.active{color:var(--navy);font-weight:600}.step.done{color:var(--gold)}
.step-num{width:19px;height:19px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid currentColor;flex-shrink:0}
.step-line{width:12px;height:2px;background:var(--fog);margin:0 1px}
.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.cat-card{background:var(--white);border:2px solid var(--fog);border-radius:12px;padding:16px 12px;cursor:pointer;transition:all .18s;text-align:center}
.cat-card:hover{border-color:var(--navy2);transform:translateY(-2px);box-shadow:var(--sh)}
.cat-icon{font-size:28px}.cat-name{font-size:13px;font-weight:600;color:var(--navy);margin-top:6px}.cat-desc{font-size:11px;color:var(--muted);margin-top:3px}
.closed-banner{background:#fff3cd;border:1.5px solid #ffc107;border-radius:10px;padding:12px 14px;text-align:center;margin-bottom:10px}
.time-grid{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}
.t-chip{padding:6px 10px;border-radius:6px;border:2px solid;font-size:11px;cursor:pointer;transition:all .15s;text-align:center;min-width:56px;font-family:inherit}
.t-chip.ok{border-color:var(--navy2);color:var(--navy);background:var(--white)}
.t-chip.ok:hover,.t-chip.ok.sel{background:var(--navy);color:var(--white);border-color:var(--navy)}
.eq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:8px}
.eq-card{background:var(--white);border:2px solid var(--fog);border-radius:10px;padding:11px;cursor:pointer;transition:all .18s;position:relative}
.eq-card:hover{border-color:var(--navy2);transform:translateY(-2px);box-shadow:var(--sh)}
.eq-card.in-cart{border-color:var(--gold);background:#fffbf0}
.eq-card.full-card{opacity:.38;cursor:not-allowed;transform:none}
.eq-icon{font-size:21px}.eq-name{font-size:11px;font-weight:600;color:var(--navy);margin-top:3px}
.eq-price{font-size:10px;color:var(--muted);margin-top:1px}.eq-avail{font-size:10px;font-weight:600;margin-top:3px}
.eq-avail.ok{color:var(--navy2)}.eq-avail.full{color:var(--danger)}
.eq-badge{position:absolute;top:6px;right:6px;background:var(--gold);color:var(--white);font-size:9px;padding:1px 5px;border-radius:9px;font-weight:700}
.eq-config{background:#f4f8ff;border-radius:8px;padding:10px;margin-top:6px}
.cfg-row{display:flex;gap:7px;margin-bottom:7px;flex-wrap:wrap}
.cfg-col{flex:1;min-width:85px}
.cfg-label{font-size:11px;font-weight:500;color:var(--navy);margin-bottom:3px}
.form-sel,.form-inp{border:1.5px solid #cdd8e8;border-radius:7px;padding:7px 8px;font-family:inherit;font-size:12px;color:var(--text);background:var(--white);outline:none;transition:border .18s;width:100%}
.form-sel:focus,.form-inp:focus{border-color:var(--navy2)}
.addon-box{background:#fffbf0;border:1.5px solid rgba(201,168,76,.38);border-radius:8px;padding:9px 11px;margin-top:6px}
.addon-title{font-weight:600;font-size:11px;color:var(--navy);margin-bottom:2px}
.addon-desc{font-size:10px;color:var(--muted);margin-bottom:6px}
.qty-row{display:flex;align-items:center;gap:6px}
.qty-btn{width:24px;height:24px;border-radius:6px;border:1.5px solid var(--navy2);background:var(--white);color:var(--navy);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;transition:all .15s}
.qty-btn:hover{background:var(--navy);color:var(--white)}
.qty-num{font-size:13px;font-weight:700;min-width:17px;text-align:center}
.cart-box{background:linear-gradient(135deg,#eef3fa,#e4edf8);border:1.5px solid rgba(27,47,78,.11);border-radius:10px;padding:13px}
.cart-item{display:flex;justify-content:space-between;align-items:flex-start;padding:6px 0;border-bottom:1px solid rgba(27,47,78,.07);font-size:11px}
.cart-item:last-child{border-bottom:none}
.cart-total{font-size:16px;font-weight:700;color:var(--navy);border-top:1.5px solid rgba(27,47,78,.11);padding-top:8px;margin-top:6px;display:flex;justify-content:space-between}
.sum-row{display:flex;justify-content:space-between;font-size:11px;padding:2px 0}
/* PAY */
.pay-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:7px;margin-bottom:13px}
.pay-card{border:2px solid var(--fog);border-radius:9px;padding:10px 8px;cursor:pointer;background:var(--white);transition:all .15s;text-align:center}
.pay-card:hover{border-color:var(--navy2);transform:translateY(-1px)}
.pay-card.sel{border-width:2.5px;background:#eef3fa}
.pay-card-icon{font-size:20px}
.pay-card-label{font-size:11px;font-weight:600;margin-top:4px;color:var(--navy)}
.pay-howto{background:#fffbf0;border:1px solid rgba(201,168,76,.3);border-radius:8px;padding:9px 11px;font-size:11px;color:var(--text);margin-bottom:10px;line-height:1.55}
.qr-wrap{text-align:center;padding:10px 8px}
.qr-wrap img{border:1px solid var(--fog);border-radius:8px;max-width:160px}
.qr-note{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.5}
.qr-ref{font-family:monospace;font-size:14px;font-weight:700;color:var(--navy);background:var(--white);border-radius:6px;padding:4px 12px;display:inline-block;margin-top:4px;letter-spacing:1px;border:1px solid var(--fog)}
/* SLIP */
.slip-box{border:2px dashed var(--fog);border-radius:10px;padding:16px;text-align:center;background:#fafcff;margin-top:10px;cursor:pointer;transition:border .18s}
.slip-box:hover{border-color:var(--navy2)}
.slip-box.has-file{border-color:var(--green);background:#f0faf8}
/* TNC */
.tnc-item{background:var(--white);border:1.5px solid var(--fog);border-radius:9px;padding:11px 12px;margin-bottom:8px;transition:border .18s}
.tnc-item.checked{border-color:var(--green);background:#f0faf8}
.tnc-header{display:flex;align-items:flex-start;gap:9px;cursor:pointer}
.tnc-cb{width:19px;height:19px;border-radius:5px;border:2px solid var(--fog);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:all .15s}
.tnc-cb.chk{background:var(--green);border-color:var(--green);color:var(--white)}
.tnc-num{font-size:10px;font-weight:700;color:var(--gold);min-width:16px}
.tnc-title{font-size:12px;font-weight:600;color:var(--navy)}
.tnc-body{font-size:11px;color:var(--muted);margin-top:6px;margin-left:28px;line-height:1.55}
.tnc-progress{background:var(--fog);border-radius:20px;height:5px;margin-bottom:11px;overflow:hidden}
.tnc-bar{background:var(--green);height:100%;border-radius:20px;transition:width .3s}
.tnc-accept-all{display:flex;align-items:center;gap:8px;background:var(--navy);border-radius:9px;padding:12px 14px;cursor:pointer;margin-top:12px}
.tnc-accept-all-cb{width:22px;height:22px;border-radius:6px;border:2px solid rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;background:rgba(255,255,255,.1)}
.tnc-accept-all-cb.chk{background:var(--gold);border-color:var(--gold);color:var(--white)}
/* SUCCESS */
.success-card{background:linear-gradient(135deg,#eef3fa,#dce9f8);border:2px solid var(--navy2);border-radius:14px;padding:24px 16px;text-align:center}
.success-id{font-family:monospace;font-size:18px;font-weight:700;color:var(--navy);background:var(--white);border-radius:7px;padding:6px 15px;display:inline-block;margin:8px 0;letter-spacing:2px;border:1.5px solid var(--fog)}
.success-screenshot{background:var(--gold);color:var(--white);border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600;margin:10px 0}
/* BTNS */
.btn{font-family:inherit;font-size:12px;font-weight:600;border:none;border-radius:7px;padding:8px 16px;cursor:pointer;transition:all .18s}
.btn-primary{background:var(--navy);color:var(--white)}
.btn-primary:hover{background:var(--navy2);transform:translateY(-1px)}
.btn-primary:disabled{background:#aab;cursor:not-allowed;transform:none}
.btn-gold{background:var(--gold);color:var(--white)}
.btn-gold:hover{background:var(--gold2);color:var(--navy)}
.btn-outline{background:none;border:1.5px solid var(--navy2);color:var(--navy)}
.btn-outline:hover{background:var(--fog)}
.btn-danger{background:var(--danger);color:var(--white);font-size:10px;padding:4px 9px}
.btn-sm{padding:4px 10px;font-size:11px}
.btn-full{width:100%}
.flex-end{display:flex;justify-content:flex-end;gap:6px;margin-top:12px}
.return-badge{display:inline-block;background:#e3eefa;color:var(--navy);font-size:10px;padding:2px 8px;border-radius:11px;margin-top:3px;font-weight:500}
/* ADMIN */
.admin-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:13px}
.stat-card{background:var(--white);border-radius:10px;padding:12px;text-align:center;border:1px solid var(--fog)}
.stat-num{font-size:21px;font-weight:700;color:var(--navy)}.stat-label{font-size:10px;color:var(--muted);margin-top:1px}
.b-table{width:100%;border-collapse:collapse;font-size:11px}
.b-table th{background:var(--navy3);color:var(--gold);font-weight:600;padding:7px 8px;text-align:left}
.b-table td{padding:7px 8px;border-bottom:1px solid var(--fog);vertical-align:top}
.b-table tr:hover td{background:#f4f8ff}
.s-badge{display:inline-block;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:600}
.s-confirmed{background:#e3eefa;color:var(--navy)}.s-cancelled{background:#fde8e8;color:var(--danger)}
.filter-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;align-items:center}
.no-data{text-align:center;color:var(--muted);padding:28px 0;font-size:12px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:12px}
.modal{background:var(--white);border-radius:13px;padding:18px;max-width:430px;width:100%;max-height:88vh;overflow-y:auto}
.modal h3{font-family:'Playfair Display',serif;color:var(--navy);margin-bottom:10px;font-size:15px}
.login-wrap{min-height:calc(100vh - 54px);display:flex;align-items:center;justify-content:center;padding:16px}
.login-box{background:var(--white);border-radius:13px;padding:24px;box-shadow:var(--sh);text-align:center;width:100%;max-width:300px}
.login-box h2{font-family:'Playfair Display',serif;color:var(--navy);margin-bottom:3px}
.login-box p{font-size:11px;color:var(--muted);margin-bottom:12px}
.login-error{background:#fde8e8;color:var(--danger);font-size:11px;border-radius:7px;padding:6px 10px;margin-bottom:9px}
.toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:var(--navy3);color:var(--white);padding:8px 16px;border-radius:8px;font-size:12px;z-index:300;box-shadow:0 4px 14px rgba(0,0,0,.2);animation:fadeUp .25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:10px}
@media(max-width:460px){.form-row{grid-template-columns:1fr}}
.form-group{display:flex;flex-direction:column;gap:3px}
.form-label{font-size:11px;font-weight:500;color:var(--navy)}
`;

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang,setLang]=useState("th");
  const [tab,setTab]=useState("book");
  const [bookings,setBookings]=useState([]);
  const [adminAuth,setAdminAuth]=useState(false);
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);
  const t=T[lang];

  useEffect(()=>{load().then(b=>{setBookings(b);setLoading(false);});},[]);
  const addBooking=async(b)=>{const u=[b,...bookings];setBookings(u);await save(u);};
  const cancelBooking=async(id)=>{
    const u=bookings.map(b=>b.id===id?{...b,status:"cancelled"}:b);
    setBookings(u);await save(u);showToast(t.cancelled_toast);
  };
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2800);};

  if(loading)return <div style={{textAlign:"center",padding:"60px",fontFamily:"inherit"}}>{t.loading}</div>;
  return(<>
    <style>{css}</style>
    <div className="nav">
      <div className="nav-brand">
        <img src={LOGO} alt="logo" className="nav-logo"/>
        <div><div className="nav-title">บ้านไม้พาย</div><div className="nav-sub">Baan-Mai-Pai</div></div>
      </div>
      <div className="nav-right">
        <select className="lang-sel" value={lang} onChange={e=>setLang(e.target.value)}>
          {LANGS.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
        <button className={"nav-tab"+(tab==="book"?" active":"")} onClick={()=>setTab("book")}>{t.book}</button>
        <button className={"nav-tab"+(tab==="admin"?" active":"")} onClick={()=>setTab("admin")}>{t.admin}</button>
      </div>
    </div>
    {tab==="book"&&<BookingPage bookings={bookings} onBook={addBooking} lang={lang} t={t}/>}
    {tab==="admin"&&(adminAuth?<AdminPage bookings={bookings} onCancel={cancelBooking} lang={lang} t={t}/>:<AdminLogin onAuth={()=>setAdminAuth(true)} t={t}/>)}
    {toast&&<div className="toast">{toast}</div>}
  </>);
}

// ── BOOKING PAGE ──────────────────────────────────────────────────────────────
function BookingPage({bookings,onBook,lang,t}){
  const initDate = getNextOpenDay();
  const [step,setStep]=useState(0);
  const [date,setDate]=useState(initDate);
  const [time,setTime]=useState("");
  const [category,setCategory]=useState(null);
  const [cartItems,setCartItems]=useState([]);
  const [expandedEq,setExpandedEq]=useState(null);
  const [tourQty,setTourQty]=useState(1);
  const [contact,setContact]=useState({name:"",phone:"",email:"",note:""});
  const [payMethod,setPayMethod]=useState("promptpay");
  const [slipFile,setSlipFile]=useState(null);
  const [tncChecked,setTncChecked]=useState({});
  const [confirmed,setConfirmed]=useState(null);
  const [showHowto,setShowHowto]=useState(false);

  const tncs=TNC[lang]||TNC.en;
  const allTncChecked=tncs.every(item=>tncChecked[item.id]);
  const checkedCount=tncs.filter(item=>tncChecked[item.id]).length;

  function toggleTnc(id){setTncChecked(p=>({...p,[id]:!p[id]}));}
  function toggleAllTnc(){if(allTncChecked)setTncChecked({});else{const a={};tncs.forEach(i=>a[i.id]=true);setTncChecked(a);}}

  function avail(eqId,durMins){
    const eq=[...EQUIPMENT,TOUR].find(e=>e.id===eqId);
    if(!eq||!date||!time)return eq?eq.maxUnits:0;
    return getAvailUnits(eq,date,time,durMins,bookings);
  }
  function tourAv(){if(!date||!time)return TOUR.maxUnits;return getTourAvail(date,time,bookings);}

  function getCI(eqId){return cartItems.find(c=>c.eqId===eqId);}
  function toggleCart(eq){
    const ci=getCI(eq.id);
    if(ci){setCartItems(cartItems.filter(c=>c.eqId!==eq.id));if(expandedEq===eq.id)setExpandedEq(null);}
    else{setCartItems([...cartItems,{eqId:eq.id,qty:1,durMins:eq.minDur,seats:eq.seatOptions?.[0]?.seats??2,guideQty:0}]);setExpandedEq(eq.id);}
  }
  function updCI(eqId,field,val){setCartItems(cartItems.map(c=>c.eqId===eqId?{...c,[field]:val}:c));}

  const cartTotal=cartItems.reduce((s,ci)=>{const eq=EQUIPMENT.find(e=>e.id===ci.eqId);return s+(eq?calcItemPrice(eq,ci.qty,ci.durMins,ci.seats,ci.guideQty):0);},0);
  const tourTotal=TOUR.price*tourQty;
  const grandTotal=category==="water"?cartTotal:tourTotal;

  function handleSubmit(){
    const id=genId();
    const items=category==="water"
      ?cartItems.map(ci=>{const eq=EQUIPMENT.find(e=>e.id===ci.eqId);return{activityId:ci.eqId,activityName:eq.names[lang]||eq.names.en,activityIcon:eq.icon,qty:ci.qty,durMins:ci.durMins,seats:ci.seats,guideQty:ci.guideQty,price:calcItemPrice(eq,ci.qty,ci.durMins,ci.seats,ci.guideQty)};})
      :[{activityId:"tour",activityName:TOUR.names[lang]||TOUR.names.en,activityIcon:TOUR.icon,qty:tourQty,durMins:120,seats:null,guideQty:0,price:tourTotal}];
    const booking={id,category,date,time,items,total:grandTotal,name:contact.name,phone:contact.phone,email:contact.email,note:contact.note,payMethod,hasSlip:!!slipFile,status:"confirmed",createdAt:new Date().toISOString(),lang};
    onBook(booking);setConfirmed(booking);setStep(7);
  }

  function reset(){
    setStep(0);setCategory(null);setDate(initDate);setTime("");setCartItems([]);setExpandedEq(null);
    setTourQty(1);setContact({name:"",phone:"",email:"",note:""});setPayMethod("promptpay");
    setSlipFile(null);setTncChecked({});setConfirmed(null);setShowHowto(false);
  }

  const STEP_LABELS=[t.step_dt,t.step_act,t.step_cart,t.step_info,t.step_tnc,t.step_pay];
  const pm=PAY_METHODS.find(p=>p.id===payMethod)||PAY_METHODS[0];

  return(<>
    <div className="hero">
      <img src={LOGO} alt="logo" className="hero-logo"/>
      <div className="hero-title">บ้านไม้พาย</div>
      <div className="hero-sub">{t.hero_sub}</div>
      <div className="hero-badges">
        <span className="hero-badge">🛶 คายัค</span>
        <span className="hero-badge">🚲 จักรยานน้ำ</span>
        <span className="hero-badge">🏄 SUP</span>
        <span className="hero-badge">⛵ ล่องเรือ</span>
      </div>
    </div>
    <div className="section">
      {step>0&&step<7&&(
        <div className="steps">
          {STEP_LABELS.map((label,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              <div className={"step"+(step===i+1?" active":step>i+1?" done":"")}>
                <div className="step-num">{step>i+1?"✓":i+1}</div>
                <span style={{display:window.innerWidth<480?"none":"inline"}}>{label}</span>
              </div>
              {i<5&&<div className="step-line"/>}
            </div>
          ))}
        </div>
      )}

      {/* STEP 0 */}
      {step===0&&(<div className="card">
        <div className="sec-title">เลือกประเภทกิจกรรม</div>
        <div className="cat-grid">
          <div className="cat-card" onClick={()=>{setCategory("water");setStep(1);}}>
            <div className="cat-icon">🏄</div><div className="cat-name">{t.cat_water}</div><div className="cat-desc">{t.cat_water_desc}</div>
          </div>
          <div className="cat-card" onClick={()=>{setCategory("tour");setStep(1);}}>
            <div className="cat-icon">⛵</div><div className="cat-name">{t.cat_tour}</div><div className="cat-desc">{t.cat_tour_desc}</div>
          </div>
        </div>
      </div>)}

      {/* STEP 1: Date & Time */}
      {step===1&&(<div className="card">
        <div className="sec-title">{t.step_dt}</div>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:10,background:"var(--fog)",borderRadius:7,padding:"6px 10px"}}>{t.open_only}</div>
        <div className="form-group" style={{marginBottom:14}}>
          <label className="form-label">{t.date_label}</label>
          <input type="date" className="form-inp" style={{maxWidth:185}} value={date} min={todayStr()}
            onChange={e=>{const v=e.target.value;setDate(v);setTime("");}}/>
          {date&&!isOpenDay(date)&&(<div className="closed-banner" style={{marginTop:8,fontSize:11,color:"#856404"}}>⚠️ {t.closed_day}</div>)}
          {date&&isOpenDay(date)&&HOLIDAYS.has(date)&&(<div style={{fontSize:10,color:"var(--green)",marginTop:5,fontWeight:600}}>🎌 {t.holiday}</div>)}
        </div>
        {date&&isOpenDay(date)&&(<>
          <div className="form-label" style={{marginBottom:5}}>{t.time_label}</div>
          <div style={{fontSize:10,color:"var(--muted)",marginBottom:6}}>{t.time_note}</div>
          <div className="time-grid">
            {TIME_SLOTS.map(ts=>(
              <button key={ts} className={"t-chip ok"+(time===ts?" sel":"")} onClick={()=>setTime(ts)}>
                <div style={{fontWeight:600,fontSize:12}}>{ts}</div>
              </button>
            ))}
          </div>
        </>)}
        <div className="flex-end">
          <button className="btn btn-outline" onClick={()=>setStep(0)}>{t.back}</button>
          <button className="btn btn-primary" disabled={!date||!time||!isOpenDay(date)} onClick={()=>setStep(2)}>{t.next}</button>
        </div>
      </div>)}

      {/* STEP 2: Activity */}
      {step===2&&(<div className="card">
        <div className="sec-title">{t.select_act}</div>
        <div style={{fontSize:11,color:"var(--muted)",marginBottom:10}}>{formatDate(date,lang)} · {time}</div>

        {category==="water"&&(<>
          <div className="eq-grid">
            {EQUIPMENT.map(eq=>{
              const ci=getCI(eq.id);
              const durMins=ci?ci.durMins:eq.minDur;
              const av=avail(eq.id,durMins);
              const full=av===0&&!ci;
              const durOpts=getDurOptions(eq);
              return(<div key={eq.id}>
                <div className={"eq-card"+(ci?" in-cart":"")+(full?" full-card":"")} onClick={()=>!full&&toggleCart(eq)}>
                  {ci&&<div className="eq-badge">✓</div>}
                  <div className="eq-icon">{eq.icon}</div>
                  <div className="eq-name">{eq.names[lang]||eq.names.en}</div>
                  <div className="eq-price">{eq.prices[lang]||eq.prices.en}</div>
                  <div className={"eq-avail "+(full?"full":"ok")}>{full?t.full:`${t.avail} ${av}`}</div>
                </div>
                {ci&&expandedEq===eq.id&&(<div className="eq-config">
                  <div className="cfg-row">
                    <div className="cfg-col">
                      <div className="cfg-label">{t.qty}</div>
                      <select className="form-sel" value={ci.qty} onChange={e=>updCI(eq.id,"qty",+e.target.value)}>
                        {Array.from({length:Math.min(eq.maxUnits,avail(eq.id,ci.durMins)+ci.qty)},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="cfg-col">
                      <div className="cfg-label">{t.duration}</div>
                      <select className="form-sel" value={ci.durMins} onChange={e=>updCI(eq.id,"durMins",+e.target.value)}>
                        {durOpts.map(d=><option key={d} value={d}>{durLabel(d,lang)}</option>)}
                      </select>
                    </div>
                  </div>
                  {eq.pricingType==="seats"&&(<div style={{marginBottom:7}}>
                    <div className="cfg-label">{t.seats_per}</div>
                    <select className="form-sel" value={ci.seats} onChange={e=>updCI(eq.id,"seats",+e.target.value)}>
                      {eq.seatOptions.map(o=><option key={o.seats} value={o.seats}>{o.seats} {t.pax} — {o.price}฿/hr</option>)}
                    </select>
                  </div>)}
                  {eq.hasGuide&&(<div className="addon-box">
                    <div className="addon-title">{t.guide_addon}</div>
                    <div className="addon-desc">{t.guide_desc}</div>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={()=>updCI(eq.id,"guideQty",Math.max(0,ci.guideQty-1))}>−</button>
                      <span className="qty-num">{ci.guideQty}</span>
                      <button className="qty-btn" onClick={()=>updCI(eq.id,"guideQty",Math.min(ci.qty*ci.seats,ci.guideQty+1))}>+</button>
                      {ci.guideQty>0&&<span style={{fontSize:10,color:"var(--navy)",fontWeight:600,marginLeft:"auto"}}>+{(300*ci.guideQty*(ci.durMins/60)).toLocaleString()}฿</span>}
                    </div>
                  </div>)}
                  <div style={{marginTop:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span className="return-badge">{t.return_at}: {returnTime(time,ci.durMins)}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"var(--navy)"}}>{calcItemPrice(eq,ci.qty,ci.durMins,ci.seats,ci.guideQty).toLocaleString()} ฿</span>
                  </div>
                </div>)}
                {ci&&expandedEq!==eq.id&&(<div style={{fontSize:10,textAlign:"center",color:"var(--navy2)",cursor:"pointer",marginTop:2,padding:2}} onClick={()=>setExpandedEq(eq.id)}>{t.edit_detail}</div>)}
              </div>);
            })}
          </div>
          {cartItems.length>0&&(<div style={{marginTop:10,padding:"8px 11px",background:"var(--fog)",borderRadius:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:600,color:"var(--navy)"}}>{t.cart}: {cartItems.length} {t.items}</span>
            <span style={{fontSize:13,fontWeight:700,color:"var(--navy)"}}>{cartTotal.toLocaleString()} ฿</span>
          </div>)}
        </>)}

        {category==="tour"&&(<div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
            <div style={{fontSize:28}}>{TOUR.icon}</div>
            <div>
              <div style={{fontWeight:600,color:"var(--navy)",fontSize:13}}>{TOUR.names[lang]||TOUR.names.en}</div>
              <div style={{fontSize:10,color:"var(--muted)"}}>{TOUR.prices[lang]||TOUR.prices.en}</div>
              <div style={{fontSize:10,color:"var(--navy2)",marginTop:2}}>{t.avail}: {tourAv()} {t.pax}</div>
              {time&&<span className="return-badge">{t.return_at}: {returnTime(time,120)}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t.pax}</label>
            <select className="form-sel" style={{maxWidth:150}} value={tourQty} onChange={e=>setTourQty(+e.target.value)}>
              {Array.from({length:Math.min(TOUR.maxUnits,tourAv())},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} {t.pax}</option>)}
            </select>
          </div>
          <div style={{marginTop:9,fontWeight:700,color:"var(--navy)",fontSize:13}}>{t.total}: {tourTotal.toLocaleString()} ฿</div>
        </div>)}

        <div className="flex-end">
          <button className="btn btn-outline" onClick={()=>setStep(1)}>{t.back}</button>
          <button className="btn btn-primary" disabled={category==="water"?cartItems.length===0:tourAv()===0} onClick={()=>setStep(3)}>{t.next}</button>
        </div>
      </div>)}

      {/* STEP 3: Cart */}
      {step===3&&(<div className="card">
        <div className="sec-title">{t.cart}</div>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:10}}>{formatDate(date,lang)} · {time}</div>
        <div className="cart-box">
          {category==="water"&&cartItems.map(ci=>{
            const eq=EQUIPMENT.find(e=>e.id===ci.eqId);if(!eq)return null;
            return(<div key={ci.eqId} className="cart-item">
              <div>
                <div style={{fontWeight:600,fontSize:12}}>{eq.icon} {eq.names[lang]||eq.names.en}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{ci.qty} · {durLabel(ci.durMins,lang)}{eq.pricingType==="seats"?` · ${ci.seats}${t.pax}`:""}{ci.guideQty>0?` · 👤×${ci.guideQty}`:""}</div>
                <span className="return-badge">{t.return_at}: {returnTime(time,ci.durMins)}</span>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700,color:"var(--navy)",fontSize:12}}>{calcItemPrice(eq,ci.qty,ci.durMins,ci.seats,ci.guideQty).toLocaleString()} ฿</div>
                <button className="btn btn-danger btn-sm" style={{marginTop:2}} onClick={()=>setCartItems(cartItems.filter(c=>c.eqId!==ci.eqId))}>{t.remove}</button>
              </div>
            </div>);
          })}
          {category==="tour"&&(<div className="cart-item">
            <div>
              <div style={{fontWeight:600,fontSize:12}}>{TOUR.icon} {TOUR.names[lang]}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{tourQty} {t.pax} · 2hr</div>
              {time&&<span className="return-badge">{t.return_at}: {returnTime(time,120)}</span>}
            </div>
            <div style={{fontWeight:700,color:"var(--navy)",fontSize:12}}>{tourTotal.toLocaleString()} ฿</div>
          </div>)}
          <div className="cart-total"><span>{t.total}</span><span>{grandTotal.toLocaleString()} ฿</span></div>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={()=>setStep(2)}>{t.back}</button>
          <button className="btn btn-primary" onClick={()=>setStep(4)}>{t.next}</button>
        </div>
      </div>)}

      {/* STEP 4: Contact */}
      {step===4&&(<div className="card">
        <div className="sec-title">{t.contact}</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">{t.name} *</label><input className="form-inp" value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">{t.phone} *</label><input className="form-inp" value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})}/></div>
        </div>
        <div className="form-group" style={{marginBottom:10}}>
          <label className="form-label">{t.email}</label>
          <input className="form-inp" type="email" placeholder={t.email_ph} value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/>
        </div>
        <div className="form-group" style={{marginBottom:12}}>
          <label className="form-label">{t.note}</label>
          <input className="form-inp" placeholder={t.note_ph} value={contact.note} onChange={e=>setContact({...contact,note:e.target.value})}/>
        </div>
        <div className="cart-box">
          <div className="sum-row"><span style={{color:"var(--muted)"}}>{t.date_label}</span><span>{formatDate(date,lang)} · {time}</span></div>
          <div className="sum-row"><span style={{color:"var(--muted)"}}>{t.items}</span><span>{category==="water"?`${cartItems.length} ${t.items}`:TOUR.names[lang]}</span></div>
          <div className="cart-total"><span>{t.total}</span><span>{grandTotal.toLocaleString()} ฿</span></div>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={()=>setStep(3)}>{t.back}</button>
          <button className="btn btn-primary" disabled={!contact.name||!contact.phone} onClick={()=>setStep(5)}>{t.next}</button>
        </div>
      </div>)}

      {/* STEP 5: T&C */}
      {step===5&&(<div className="card">
        <div className="sec-title">{t.tnc_title}</div>
        <div style={{fontSize:10,color:"var(--muted)",marginBottom:10}}>{t.tnc_must}</div>
        <div className="tnc-progress"><div className="tnc-bar" style={{width:`${(checkedCount/tncs.length)*100}%`}}/></div>
        {tncs.map((item,idx)=>(
          <div key={item.id} className={"tnc-item"+(tncChecked[item.id]?" checked":"")}>
            <div className="tnc-header" onClick={()=>toggleTnc(item.id)}>
              <div className={"tnc-cb"+(tncChecked[item.id]?" chk":"")}>{tncChecked[item.id]&&<span style={{fontSize:11}}>✓</span>}</div>
              <div><span className="tnc-num">{idx+1}.</span><span className="tnc-title"> {item.title}</span></div>
            </div>
            <div className="tnc-body">{item.body}</div>
          </div>
        ))}
        <div className="tnc-accept-all" onClick={toggleAllTnc}>
          <div className={"tnc-accept-all-cb"+(allTncChecked?" chk":"")}>{allTncChecked&&<span style={{fontSize:13}}>✓</span>}</div>
          <span style={{fontSize:13,fontWeight:600,color:allTncChecked?"var(--gold)":"rgba(255,255,255,.7)"}}>{t.tnc_accept_all} ({checkedCount}/{tncs.length})</span>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={()=>setStep(4)}>{t.back}</button>
          <button className="btn btn-primary" disabled={!allTncChecked} onClick={()=>setStep(6)}>{t.next}</button>
        </div>
      </div>)}

      {/* STEP 6: Payment */}
      {step===6&&(<div className="card">
        <div className="sec-title">{t.pay_title}</div>
        <div className="pay-grid">
          {PAY_METHODS.map(pm=>(
            <div key={pm.id} className={"pay-card"+(payMethod===pm.id?" sel":"")} style={{borderColor:payMethod===pm.id?pm.color:"var(--fog)"}} onClick={()=>setPayMethod(pm.id)}>
              <div className="pay-card-icon">{pm.icon}</div>
              <div className="pay-card-label" style={{color:payMethod===pm.id?pm.color:"var(--navy)"}}>{pm.label[lang]||pm.label.en}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
          <button className="btn btn-outline btn-sm" onClick={()=>setShowHowto(p=>!p)}>ℹ️ {t.pay_how}</button>
        </div>
        {showHowto&&(<div className="pay-howto">{(PAY_HOWTO[payMethod]||{})[lang]||(PAY_HOWTO[payMethod]||{}).en||""}</div>)}
        <div className="qr-wrap">
          <img src={QR_IMGS[payMethod]||QR_IMGS.promptpay} alt="QR"/>
          <div className="qr-note">{t.pay_note}</div>
          <div className="qr-ref">{t.pay_ref} {contact.name}</div>
          <div style={{fontSize:19,fontWeight:700,color:"var(--navy)",marginTop:8}}>{grandTotal.toLocaleString()} ฿</div>
        </div>
        <div className={"slip-box"+(slipFile?" has-file":"")} onClick={()=>document.getElementById('slip-input').click()}>
          <div style={{fontSize:11,fontWeight:600,color:"var(--navy)",marginBottom:4}}>{t.slip_title}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>{t.slip_desc}</div>
          {slipFile
            ?<div style={{fontSize:12,color:"var(--green)",fontWeight:600}}>✓ {slipFile.name}</div>
            :<div className="btn btn-outline btn-sm">{t.slip_btn}</div>}
          <div style={{fontSize:10,color:"var(--muted)",marginTop:6}}>{t.slip_optional}</div>
          <input id="slip-input" type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e=>setSlipFile(e.target.files?.[0]||null)}/>
        </div>
        <div className="flex-end">
          <button className="btn btn-outline" onClick={()=>setStep(5)}>{t.back}</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{t.confirm}</button>
        </div>
      </div>)}

      {/* STEP 7: Success */}
      {step===7&&confirmed&&(<div className="success-card">
        <div style={{fontSize:40}}>🎉</div>
        <div style={{fontSize:17,fontWeight:700,color:"var(--navy)",marginTop:8}}>{t.success}</div>
        <div className="success-id">{confirmed.id}</div>
        <div className="success-screenshot">{t.success_screenshot}</div>
        <div style={{fontSize:11,color:"var(--text)",lineHeight:1.7,marginTop:4}}>
          {formatDate(confirmed.date,lang)} · {confirmed.time}<br/>
          {confirmed.items?.map(it=><span key={it.activityId}>{it.activityIcon} {it.activityName} ×{it.qty}<br/></span>)}
        </div>
        <div style={{fontSize:19,fontWeight:700,color:"var(--navy)",margin:"8px 0"}}>{confirmed.total?.toLocaleString()} ฿</div>
        {confirmed.email&&(<div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>{t.success_email}: <strong>{confirmed.email}</strong></div>)}
        <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.6,marginTop:4}}>{t.success_show}<br/>{t.line_contact}</div>
        <button className="btn btn-gold" style={{marginTop:13}} onClick={reset}>{t.book_more}</button>
      </div>)}
    </div>
  </>);
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
function AdminLogin({onAuth,t}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const try_=()=>{if(pw===ADMIN_PW)onAuth();else{setErr(true);setTimeout(()=>setErr(false),2000);}};
  return(<div className="login-wrap"><style>{css}</style>
    <div className="login-box">
      <img src={LOGO} alt="logo" style={{width:55,height:55,borderRadius:"50%",border:"2px solid var(--gold)",objectFit:"cover",marginBottom:9}}/>
      <h2>Admin</h2><p>บ้านไม้พาย · Booking Management</p>
      {err&&<div className="login-error">{t.wrong_pw}</div>}
      <div className="form-group" style={{marginBottom:9,textAlign:"left"}}>
        <label className="form-label">{t.pw}</label>
        <input type="password" className="form-inp" value={pw} placeholder="••••••••" onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&try_()}/>
      </div>
      <button className="btn btn-primary btn-full" onClick={try_}>{t.login}</button>
    </div>
  </div>);
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage({bookings,onCancel,lang,t}){
  const[fDate,setFDate]=useState("");const[fStatus,setFStatus]=useState("");const[detail,setDetail]=useState(null);
  const active=bookings.filter(b=>b.status!=="cancelled");
  const todayB=active.filter(b=>b.date===todayStr());
  const totalRev=active.reduce((s,b)=>s+(b.total||0),0);
  const filtered=bookings.filter(b=>{if(fDate&&b.date!==fDate)return false;if(fStatus&&b.status!==fStatus)return false;return true;});
  return(<div className="section"><style>{css}</style>
    <div className="sec-title" style={{marginBottom:11}}>{t.admin_title}</div>
    <div className="admin-stats">
      <div className="stat-card"><div className="stat-num">{active.length}</div><div className="stat-label">{t.total_b}</div></div>
      <div className="stat-card"><div className="stat-num">{todayB.length}</div><div className="stat-label">{t.today_b}</div></div>
      <div className="stat-card"><div className="stat-num">{totalRev.toLocaleString()}</div><div className="stat-label">{t.revenue}</div></div>
      <div className="stat-card"><div className="stat-num">{bookings.filter(b=>b.status==="cancelled").length}</div><div className="stat-label">{t.cancelled_n}</div></div>
    </div>
    <div className="sec-title">{t.all_b}</div>
    <div className="filter-bar">
      <input type="date" className="form-inp" style={{width:145}} value={fDate} onChange={e=>setFDate(e.target.value)}/>
      <select className="form-sel" style={{width:125}} value={fStatus} onChange={e=>setFStatus(e.target.value)}>
        <option value="">{t.all_status}</option>
        <option value="confirmed">{t.confirmed_s}</option>
        <option value="cancelled">{t.cancelled_s}</option>
      </select>
      {(fDate||fStatus)&&<button className="btn btn-outline btn-sm" onClick={()=>{setFDate("");setFStatus("");}}>{t.clear}</button>}
    </div>
    {filtered.length===0?<div className="no-data">{t.no_b}</div>:(
      <div style={{overflowX:"auto"}}>
        <table className="b-table">
          <thead><tr><th>{t.b_id}</th><th>Cat.</th><th>{t.b_date}</th><th>{t.booker}</th><th>{t.items}</th><th>฿</th><th>Slip</th><th>{t.status}</th><th></th></tr></thead>
          <tbody>
            {filtered.map(b=>(
              <tr key={b.id}>
                <td><code style={{fontSize:10}}>{b.id}</code></td>
                <td>{b.category==="tour"?"⛵":"🏄"}</td>
                <td>{formatDate(b.date,lang)}<br/><span style={{color:"var(--muted)",fontSize:10}}>{b.time}</span></td>
                <td>{b.name}<br/><span style={{color:"var(--muted)",fontSize:10}}>{b.phone}</span>{b.email&&<><br/><span style={{color:"var(--muted)",fontSize:10}}>{b.email}</span></>}</td>
                <td>{b.items?.length} {t.items}</td>
                <td style={{fontWeight:600,color:"var(--navy)"}}>{b.total?.toLocaleString()}</td>
                <td style={{fontSize:12}}>{b.hasSlip?"✅":"—"}</td>
                <td><span className={"s-badge s-"+b.status}>{b.status==="confirmed"?t.conf_badge:t.canc_badge}</span></td>
                <td style={{display:"flex",gap:3}}>
                  <button className="btn btn-sm btn-outline" onClick={()=>setDetail(b)}>{t.view}</button>
                  {b.status==="confirmed"&&<button className="btn btn-sm btn-danger" onClick={()=>{if(confirm(t.cancel_q))onCancel(b.id);}}>{t.cancel_b}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {detail&&(<div className="modal-bg" onClick={()=>setDetail(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>{t.b_detail}</h3>
        <div className="cart-box">
          {[[t.b_id,detail.id],[t.b_date,`${formatDate(detail.date,lang)} · ${detail.time}`],[t.booker,detail.name],[t.tel,detail.phone],detail.email&&["Email",detail.email],detail.note&&[t.remarks,detail.note],["Payment",detail.payMethod],["Slip",detail.hasSlip?"✅ Uploaded":"—"],[t.status,detail.status==="confirmed"?t.conf_badge:t.canc_badge]].filter(Boolean).map(([k,v])=>(
            <div key={k} className="sum-row"><span style={{color:"var(--muted)"}}>{k}</span><span style={{fontWeight:500,fontSize:11}}>{v}</span></div>
          ))}
          <div style={{borderTop:"1px solid rgba(27,47,78,.1)",paddingTop:6,marginTop:6}}>
            {detail.items?.map((it,i)=>(
              <div key={i} className="sum-row"><span>{it.activityIcon} {it.activityName} ×{it.qty} · {durLabel(it.durMins,lang)}</span><span style={{fontWeight:600}}>{it.price?.toLocaleString()} ฿</span></div>
            ))}
          </div>
          <div className="cart-total"><span>{t.total}</span><span>{detail.total?.toLocaleString()} ฿</span></div>
        </div>
        <div className="flex-end">
          {detail.status==="confirmed"&&<button className="btn btn-danger" onClick={()=>{onCancel(detail.id);setDetail(null);}}>{t.cancel_b}</button>}
          <button className="btn btn-outline" onClick={()=>setDetail(null)}>{t.close}</button>
        </div>
      </div>
    </div>)}
  </div>);
}
