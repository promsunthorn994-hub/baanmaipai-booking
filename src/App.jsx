import { useState, useEffect } from "react";
import { LOGO, IMG_WATER_SPORTS, IMG_KAYAK1, IMG_KAYAK2, IMG_WATERCYCLE, IMG_SUP, IMG_TOUR, IMG_HERO_COVER, IMG_TNC_COVER, IMG_SUCCESS_COVER } from "./images.js";

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
  { id:"kayak1", icon:"🛶", img:IMG_KAYAK1, maxUnits:4, minDur:60, stepDur:60, pricingType:"fixed", price:100, seatOptions:null, hasGuide:false,
    names:{th:"คายัค 1 ที่นั่ง",en:"Kayak (1-seat)",zh:"单人皮划艇",ko:"카약 (1인승)",ja:"カヤック（1人用）"},
    prices:{th:"100 ฿/ชม.",en:"100 ฿/hr",zh:"100 ฿/时",ko:"100 ฿/시간",ja:"100 ฿/時間"}},
  { id:"kayak2", icon:"🚣", img:IMG_KAYAK2, maxUnits:12, minDur:60, stepDur:60, pricingType:"seats", price:null,
    seatOptions:[{seats:2,price:200},{seats:3,price:250}], hasGuide:true,
    names:{th:"คายัค 2+1 ที่นั่ง",en:"Kayak (2+1 seats)",zh:"双人皮划艇",ko:"카약 (2+1인승)",ja:"カヤック（2+1人用）"},
    prices:{th:"200–250 ฿/ชม.",en:"200–250 ฿/hr",zh:"200–250 ฿/时",ko:"200–250 ฿/시간",ja:"200–250 ฿/時間"}},
  { id:"watercycle", icon:"🚲", img:IMG_WATERCYCLE, maxUnits:4, minDur:30, stepDur:30, pricingType:"fixed", price:200, seatOptions:null, hasGuide:false,
    names:{th:"จักรยานน้ำ",en:"Water Cycle",zh:"水上自行车",ko:"수상 자전거",ja:"水上自転車"},
    prices:{th:"200 ฿/30นาที",en:"200 ฿/30min",zh:"200 ฿/30分",ko:"200 ฿/30분",ja:"200 ฿/30分"}},
  { id:"sup", icon:"🏄", img:IMG_SUP, maxUnits:4, minDur:60, stepDur:60, pricingType:"fixed", price:150, seatOptions:null, hasGuide:false,
    names:{th:"ซับบอร์ด (SUP)",en:"SUP Board",zh:"桨板（SUP）",ko:"SUP 보드",ja:"SUPボード"},
    prices:{th:"150 ฿/ชม.",en:"150 ฿/hr",zh:"150 ฿/时",ko:"150 ฿/시간",ja:"150 ฿/時間"}},
];
const TOUR = { id:"tour", icon:"⛵", img:IMG_TOUR, maxUnits:20, minDur:120, stepDur:120, pricingType:"fixed", price:600, hasGuide:false,
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

// ── ACTIVITY PHOTOS (Ghibli-style illustrations) ──────────────────────────────


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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Baloo+2:wght@500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#1b2f4e;--navy2:#2a4a70;--navy3:#1e3a5f;--cream:#f0fbf8;--gold:#c9a84c;--gold2:#e8c96a;--white:#fff;--fog:#d4f3ec;--danger:#e0654f;--green:#3aa688;--text:#1e3a3a;--muted:#5a8a82;--sh:0 6px 22px rgba(64,196,180,.18);--sh2:0 3px 12px rgba(64,196,180,.12);--turq:#5fd4c4;--turq2:#7fe3d4;--turq-deep:#2bb5a0;--lime:#c4e85c;--lime2:#d9f27d;--lime-deep:#9fc940;--peach:#ffd6a5;--bg-grad:linear-gradient(160deg,#eafff9 0%,#e8f9d8 100%);--band-bg:#dcf5ee}
body{font-family:'Baloo 2','Noto Sans Thai','Noto Sans JP','Noto Sans KR','Noto Sans SC',sans-serif;background:var(--band-bg);color:var(--text);min-height:100vh}
.nav{background:linear-gradient(100deg,var(--turq-deep),var(--turq));display:flex;align-items:center;justify-content:space-between;padding:0 13px;height:56px;position:sticky;top:0;z-index:100;box-shadow:0 4px 16px rgba(43,181,160,.25);gap:7px}
.nav-brand{display:flex;align-items:center;gap:7px;flex-shrink:0}
.nav-logo{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2.5px solid var(--white);box-shadow:0 2px 8px rgba(0,0,0,.15)}
.nav-title{font-family:'Baloo 2',sans-serif;font-weight:700;font-size:16px;color:var(--white);text-shadow:0 1px 3px rgba(0,0,0,.15)}
.nav-sub{font-size:9px;color:rgba(255,255,255,.75)}
.nav-right{display:flex;align-items:center;gap:4px;flex-shrink:0}
.nav-tab{background:rgba(255,255,255,.18);border:none;color:rgba(255,255,255,.85);font-size:11px;padding:6px 10px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:inherit;font-weight:600}
.nav-tab.active,.nav-tab:hover{background:var(--white);color:var(--turq-deep)}
.lang-sel{background:rgba(255,255,255,.25);border:1.5px solid rgba(255,255,255,.4);color:var(--white);font-size:11px;padding:5px 7px;border-radius:14px;cursor:pointer;outline:none;font-family:inherit;font-weight:600}
.lang-sel option{background:var(--turq-deep);color:var(--white)}
.hero{background:linear-gradient(155deg,var(--turq) 0%,var(--turq-deep) 55%,var(--lime-deep) 100%);color:var(--white);padding:26px 16px 22px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 15% 20%,rgba(255,255,255,.18) 0,transparent 8%),radial-gradient(circle at 85% 15%,rgba(255,255,255,.15) 0,transparent 7%),radial-gradient(circle at 75% 75%,rgba(255,255,255,.12) 0,transparent 9%),radial-gradient(circle at 25% 80%,rgba(255,255,255,.14) 0,transparent 6%)}
.hero-logo{width:72px;height:72px;border-radius:50%;object-fit:cover;border:4px solid var(--white);margin-bottom:10px;box-shadow:0 4px 18px rgba(0,0,0,.18);position:relative}
.hero-title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;color:var(--white);position:relative;text-shadow:0 2px 6px rgba(0,0,0,.12)}
.hero-sub{font-size:11px;color:rgba(255,255,255,.92);margin-top:4px;position:relative;font-weight:500}
.hero-badges{display:flex;gap:6px;justify-content:center;margin-top:11px;flex-wrap:wrap;position:relative}
.hero-badge{background:rgba(255,255,255,.28);border:1.5px solid rgba(255,255,255,.4);color:var(--white);font-size:10px;font-weight:600;padding:4px 11px;border-radius:20px}
.section{max-width:800px;margin:0 auto;padding:16px 12px;background:var(--band-bg);position:relative}
.section::before{content:'';position:fixed;inset:0;z-index:-1;background:var(--band-bg);background-image:radial-gradient(circle at 10% 10%,rgba(255,255,255,.5) 0,transparent 3%),radial-gradient(circle at 90% 25%,rgba(255,255,255,.4) 0,transparent 2.5%),radial-gradient(circle at 30% 85%,rgba(255,255,255,.45) 0,transparent 3%),radial-gradient(circle at 75% 70%,rgba(255,255,255,.4) 0,transparent 2.5%)}
.sec-title{font-size:14.5px;font-weight:700;color:var(--turq-deep);border-left:4px solid var(--lime-deep);padding-left:9px;margin-bottom:12px;border-radius:2px}
.card{background:var(--white);border-radius:18px;box-shadow:0 8px 28px rgba(30,90,80,.16);padding:16px;margin-bottom:11px;border:none}
.steps{display:flex;align-items:center;justify-content:center;margin-bottom:14px;flex-wrap:wrap;gap:1px}
.step{display:flex;align-items:center;gap:3px;font-size:10px;color:var(--muted)}
.step.active{color:var(--turq-deep);font-weight:700}.step.done{color:var(--lime-deep)}
.step-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:2.5px solid currentColor;flex-shrink:0}
.step-line{width:12px;height:2.5px;background:var(--fog);margin:0 1px;border-radius:2px}
.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cat-card{background:var(--white);border:2.5px solid var(--fog);border-radius:18px;padding:0;cursor:pointer;transition:all .2s;text-align:center;overflow:hidden}
.cat-card:hover{border-color:var(--turq);transform:translateY(-3px) scale(1.02);box-shadow:var(--sh)}
.cat-photo{width:100%;aspect-ratio:1/1;object-fit:cover;display:block}
.cat-body{padding:12px 10px 14px}
.cat-icon{font-size:30px}.cat-name{font-size:13.5px;font-weight:700;color:var(--turq-deep);margin-top:6px}.cat-desc{font-size:11px;color:var(--muted);margin-top:3px}
.closed-banner{background:#fff3cd;border:1.5px solid #ffc107;border-radius:14px;padding:12px 14px;text-align:center;margin-bottom:10px}
.time-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}
.t-chip{padding:7px 11px;border-radius:14px;border:2.5px solid;font-size:11px;cursor:pointer;transition:all .15s;text-align:center;min-width:56px;font-family:inherit;font-weight:600}
.t-chip.ok{border-color:var(--turq);color:var(--turq-deep);background:var(--white)}
.t-chip.ok:hover,.t-chip.ok.sel{background:var(--turq-deep);color:var(--white);border-color:var(--turq-deep);transform:scale(1.05)}
.eq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:9px}
.eq-card{background:var(--white);border:2.5px solid var(--fog);border-radius:16px;padding:0;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.eq-card:hover{border-color:var(--turq);transform:translateY(-3px);box-shadow:var(--sh)}
.eq-card.in-cart{border-color:var(--lime-deep);background:#f7ffe8}
.eq-card.full-card{opacity:.38;cursor:not-allowed;transform:none}
.eq-photo{width:100%;aspect-ratio:1/1;object-fit:cover;display:block}
.eq-body{padding:10px 12px 12px}
.eq-icon{font-size:23px}.eq-name{font-size:11.5px;font-weight:700;color:var(--turq-deep);margin-top:3px}
.eq-price{font-size:10px;color:var(--muted);margin-top:1px}.eq-avail{font-size:10px;font-weight:700;margin-top:3px}
.eq-avail.ok{color:var(--lime-deep)}.eq-avail.full{color:var(--danger)}
.eq-badge{position:absolute;top:6px;right:6px;background:var(--lime-deep);color:var(--white);font-size:9px;padding:1px 6px;border-radius:10px;font-weight:800}
.eq-config{background:#eafdf8;border-radius:12px;padding:11px;margin-top:7px;border:1.5px solid var(--fog)}
.cfg-row{display:flex;gap:7px;margin-bottom:7px;flex-wrap:wrap}
.cfg-col{flex:1;min-width:85px}
.cfg-label{font-size:11px;font-weight:600;color:var(--turq-deep);margin-bottom:3px}
.form-sel,.form-inp{border:2px solid var(--fog);border-radius:11px;padding:7px 9px;font-family:inherit;font-size:12px;color:var(--text);background:var(--white);outline:none;transition:border .18s;width:100%}
.form-sel:focus,.form-inp:focus{border-color:var(--turq)}
.addon-box{background:#fff8ee;border:2px solid rgba(255,182,108,.45);border-radius:12px;padding:10px 12px;margin-top:7px}
.addon-title{font-weight:700;font-size:11px;color:var(--turq-deep);margin-bottom:2px}
.addon-desc{font-size:10px;color:var(--muted);margin-bottom:6px}
.qty-row{display:flex;align-items:center;gap:6px}
.qty-btn{width:26px;height:26px;border-radius:9px;border:2px solid var(--turq);background:var(--white);color:var(--turq-deep);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:800;transition:all .15s}
.qty-btn:hover{background:var(--turq);color:var(--white)}
.qty-num{font-size:13px;font-weight:800;min-width:17px;text-align:center}
.cart-box{background:linear-gradient(135deg,#eafff9,#eefcd8);border:2px solid var(--fog);border-radius:16px;padding:14px}
.cart-item{display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1.5px dashed rgba(58,166,136,.25);font-size:11px}
.cart-item:last-child{border-bottom:none}
.cart-total{font-size:17px;font-weight:800;color:var(--turq-deep);border-top:2px solid var(--fog);padding-top:9px;margin-top:7px;display:flex;justify-content:space-between}
.sum-row{display:flex;justify-content:space-between;font-size:11px;padding:2px 0}
/* PAY */
.pay-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:13px}
.pay-card{border:2.5px solid var(--fog);border-radius:14px;padding:11px 8px;cursor:pointer;background:var(--white);transition:all .15s;text-align:center}
.pay-card:hover{border-color:var(--turq);transform:translateY(-2px)}
.pay-card.sel{border-width:3px;background:#eafffa}
.pay-card-icon{font-size:21px}
.pay-card-label{font-size:11px;font-weight:700;margin-top:4px;color:var(--turq-deep)}
.pay-howto{background:#fff8ee;border:1.5px solid rgba(255,182,108,.4);border-radius:12px;padding:10px 12px;font-size:11px;color:var(--text);margin-bottom:10px;line-height:1.55}
.qr-wrap{text-align:center;padding:11px 8px}
.qr-wrap img{border:2px solid var(--fog);border-radius:14px;max-width:160px}
.qr-note{font-size:11px;color:var(--muted);margin-top:7px;line-height:1.5}
.qr-ref{font-family:monospace;font-size:14px;font-weight:700;color:var(--turq-deep);background:var(--white);border-radius:10px;padding:4px 13px;display:inline-block;margin-top:5px;letter-spacing:1px;border:2px solid var(--fog)}
/* SLIP */
.slip-box{border:2.5px dashed var(--turq);border-radius:16px;padding:17px;text-align:center;background:#f3fffc;margin-top:10px;cursor:pointer;transition:border .18s}
.slip-box:hover{border-color:var(--turq-deep)}
.slip-box.has-file{border-color:var(--lime-deep);background:#f7ffe8}
/* TNC */
.tnc-item{background:var(--white);border:2px solid var(--fog);border-radius:14px;padding:12px 13px;margin-bottom:9px;transition:border .18s}
.tnc-item.checked{border-color:var(--lime-deep);background:#f7ffe8}
.tnc-header{display:flex;align-items:flex-start;gap:9px;cursor:pointer}
.tnc-cb{width:20px;height:20px;border-radius:7px;border:2.5px solid var(--fog);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:all .15s}
.tnc-cb.chk{background:var(--lime-deep);border-color:var(--lime-deep);color:var(--white)}
.tnc-num{font-size:10px;font-weight:800;color:var(--turq-deep);min-width:16px}
.tnc-title{font-size:12px;font-weight:700;color:var(--turq-deep)}
.tnc-body{font-size:11px;color:var(--muted);margin-top:6px;margin-left:29px;line-height:1.55}
.tnc-progress{background:var(--fog);border-radius:20px;height:6px;margin-bottom:11px;overflow:hidden}
.tnc-bar{background:linear-gradient(90deg,var(--turq),var(--lime-deep));height:100%;border-radius:20px;transition:width .3s}
.tnc-accept-all{display:flex;align-items:center;gap:8px;background:linear-gradient(100deg,var(--turq-deep),var(--lime-deep));border-radius:16px;padding:13px 15px;cursor:pointer;margin-top:12px;box-shadow:0 4px 14px rgba(43,181,160,.25)}
.tnc-accept-all-cb{width:23px;height:23px;border-radius:8px;border:2.5px solid rgba(255,255,255,.6);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;background:rgba(255,255,255,.15)}
.tnc-accept-all-cb.chk{background:var(--white);border-color:var(--white);color:var(--turq-deep)}
/* SUCCESS */
.success-card{background:linear-gradient(150deg,#eafff9,#f3ffd9);border:3px solid var(--turq);border-radius:22px;padding:26px 18px;text-align:center}
.success-id{font-family:monospace;font-size:18px;font-weight:800;color:var(--turq-deep);background:var(--white);border-radius:12px;padding:7px 16px;display:inline-block;margin:9px 0;letter-spacing:2px;border:2.5px solid var(--turq)}
.success-screenshot{background:linear-gradient(100deg,var(--lime-deep),var(--lime));color:var(--white);border-radius:14px;padding:10px 15px;font-size:12px;font-weight:700;margin:10px 0}
/* BTNS */
.btn{font-family:inherit;font-size:12px;font-weight:700;border:none;border-radius:20px;padding:9px 18px;cursor:pointer;transition:all .18s}
.btn-primary{background:linear-gradient(100deg,var(--turq-deep),var(--turq));color:var(--white);box-shadow:0 3px 10px rgba(43,181,160,.3)}
.btn-primary:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 5px 16px rgba(43,181,160,.4)}
.btn-primary:disabled{background:#c8d6d2;cursor:not-allowed;transform:none;box-shadow:none}
.btn-gold{background:linear-gradient(100deg,var(--lime-deep),var(--lime));color:var(--white);box-shadow:0 3px 10px rgba(159,201,64,.3)}
.btn-gold:hover{transform:translateY(-2px) scale(1.02)}
.btn-outline{background:var(--white);border:2px solid var(--turq);color:var(--turq-deep)}
.btn-outline:hover{background:var(--fog)}
.btn-danger{background:var(--danger);color:var(--white);font-size:10px;padding:5px 11px;border-radius:14px}
.btn-sm{padding:5px 12px;font-size:11px}
.btn-full{width:100%}
.flex-end{display:flex;justify-content:flex-end;gap:7px;margin-top:13px}
.return-badge{display:inline-block;background:#eafff9;color:var(--turq-deep);font-size:10px;padding:2px 9px;border-radius:11px;margin-top:3px;font-weight:700;border:1px solid var(--fog)}
/* ADMIN */
.admin-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:13px}
.stat-card{background:var(--white);border-radius:14px;padding:13px;text-align:center;border:2px solid var(--fog)}
.stat-num{font-size:21px;font-weight:800;color:var(--turq-deep)}.stat-label{font-size:10px;color:var(--muted);margin-top:1px}
.b-table{width:100%;border-collapse:collapse;font-size:11px}
.b-table th{background:var(--turq-deep);color:var(--white);font-weight:700;padding:7px 8px;text-align:left}
.b-table td{padding:7px 8px;border-bottom:1px solid var(--fog);vertical-align:top}
.b-table tr:hover td{background:#eafffa}
.s-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.s-confirmed{background:#eafff9;color:var(--turq-deep)}.s-cancelled{background:#fde8e8;color:var(--danger)}
.filter-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;align-items:center}
.no-data{text-align:center;color:var(--muted);padding:28px 0;font-size:12px}
.modal-bg{position:fixed;inset:0;background:rgba(20,60,55,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:12px}
.modal{background:var(--white);border-radius:20px;padding:19px;max-width:430px;width:100%;max-height:88vh;overflow-y:auto;border:3px solid var(--turq)}
.modal h3{font-family:'Baloo 2',sans-serif;font-weight:700;color:var(--turq-deep);margin-bottom:11px;font-size:16px}
.login-wrap{min-height:calc(100vh - 56px);display:flex;align-items:center;justify-content:center;padding:16px;background:var(--band-bg)}
.login-box{background:var(--white);border-radius:20px;padding:26px;box-shadow:var(--sh);text-align:center;width:100%;max-width:300px;border:3px solid var(--turq)}
.login-box h2{font-family:'Baloo 2',sans-serif;font-weight:700;color:var(--turq-deep);margin-bottom:3px}
.login-box p{font-size:11px;color:var(--muted);margin-bottom:13px}
.login-error{background:#fde8e8;color:var(--danger);font-size:11px;border-radius:11px;padding:7px 11px;margin-bottom:10px}
.toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:var(--turq-deep);color:var(--white);padding:9px 18px;border-radius:20px;font-size:12px;font-weight:600;z-index:300;box-shadow:0 4px 14px rgba(0,0,0,.2);animation:fadeUp .25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:10px}
@media(max-width:460px){.form-row{grid-template-columns:1fr}}
.form-group{display:flex;flex-direction:column;gap:3px}
.form-label{font-size:11px;font-weight:600;color:var(--turq-deep)}
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
      <img src={IMG_HERO_COVER} alt="บ้านไม้พาย" style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:14,marginBottom:10,border:"2px solid rgba(255,255,255,.25)"}}/>
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
            <img src={IMG_WATER_SPORTS} alt="กีฬาทางน้ำ" className="cat-photo"/>
            <div className="cat-body">
              <div className="cat-icon">🏄</div><div className="cat-name">{t.cat_water}</div><div className="cat-desc">{t.cat_water_desc}</div>
            </div>
          </div>
          <div className="cat-card" onClick={()=>{setCategory("tour");setStep(1);}}>
            <img src={IMG_TOUR} alt="นั่งเรือชมคลอง" className="cat-photo"/>
            <div className="cat-body">
              <div className="cat-icon">⛵</div><div className="cat-name">{t.cat_tour}</div><div className="cat-desc">{t.cat_tour_desc}</div>
            </div>
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
                  <img src={eq.img} alt={eq.names[lang]||eq.names.en} className="eq-photo"/>
                  <div className="eq-body">
                    <div className="eq-name">{eq.names[lang]||eq.names.en}</div>
                    <div className="eq-price">{eq.prices[lang]||eq.prices.en}</div>
                    <div className={"eq-avail "+(full?"full":"ok")}>{full?t.full:`${t.avail} ${av}`}</div>
                  </div>
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
        <img src={IMG_TNC_COVER} alt="Policy" style={{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:12,marginBottom:12,border:"2px solid var(--fog)"}}/>
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
        <img src={IMG_SUCCESS_COVER} alt="สำเร็จ" style={{width:"100%",maxHeight:150,objectFit:"cover",borderRadius:12,marginBottom:10,border:"2px solid var(--turq)"}}/>
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
