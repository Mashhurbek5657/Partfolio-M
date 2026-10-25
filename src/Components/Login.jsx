import { useRef, useEffect, useLayoutEffect, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
 
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;
 
const cardData = [{}];
 
/* ===================================================================
   CONTACT FORM  (Register.jsx dagi tekshiruvlar + Telegram yuborish)
   =================================================================== */
 
// ---------------------------------------------------------------
// YUBORISH SOZLAMASI (faqat shu faylning o'zi yetadi, qo'shimcha fayl kerak emas)
//
// .env fayliga (loyiha ildizida) yozing:
//     VITE_BOT_TOKEN=123456:ABC...        <- BotFather bergan token
//     VITE_CHAT_ID=123456789              <- xabar boradigan chat id
// Saytni qayerga joylashingizdan qat'i nazar (Vercel, Netlify, GitHub Pages
// yoki lokal tarmoq) xabar istalgan qurilmadan to'g'ridan-to'g'ri botga boradi.
//
// DIQQAT: VITE_ bilan boshlangan o'zgaruvchilar brauzer kodiga kiradi, ya'ni
// token sayt ochiq ko'rinadigan joyda bo'ladi. Shuning uchun faqat shu forma
// uchun alohida bot oching. Token tashqariga chiqib ketsa, BotFather'da
// /revoke qilib yangisini oling.
//
// Token ochiq turishini xohlamasangiz: VITE_API_URL=https://saytingiz.vercel.app
// yozing, shunda xabar serverdagi /api/contact orqali yuboriladi (token yo'q).
// ---------------------------------------------------------------
const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
 
const MIN_NAME = 3; // Register'da 4 edi, xohlasangiz 4 qiling
const BTN_W = 170; // Send tugmasi o'lchami
const BTN_H = 54;
const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
const FIELD_ORDER = ['name', 'email', 'phone', 'subject', 'message'];
 
// +998 90 123 45 67 ko'rinishiga keltirish
function formatPhone(value) {
    let digits = value.replace(/\D/g, '');
    digits = digits.startsWith('998') ? digits.slice(3) : digits;
    const r = digits.slice(0, 9);
 
    let out = '+998 ';
    if (r.length > 0) out += r.slice(0, 2);
    if (r.length > 2) out += ' ' + r.slice(2, 5);
    if (r.length > 5) out += ' ' + r.slice(5, 7);
    if (r.length > 7) out += ' ' + r.slice(7, 9);
    return out;
}
 
const validators = {
    name: v => {
        const t = v.trim();
        if (!t) return 'Ism kiritilishi shart';
        if (!/^[\p{L}'ʻ’\s]+$/u.test(t)) return "Ism faqat harflardan iborat bo'lishi kerak";
        if (!/^\p{Lu}/u.test(t)) return 'Ism katta harf bilan boshlanishi kerak';
        if (t.length < MIN_NAME) return `Ism kamida ${MIN_NAME} ta harf bo'lishi kerak`;
        return '';
    },
    email: v => {
        const t = v.trim();
        if (!t) return 'Email kiritilishi shart';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return "Email noto'g'ri (masalan: ali@gmail.com)";
        return '';
    },
    phone: v => {
        const clean = v.replace(/\D/g, '');
        if (!clean.startsWith('998')) return 'Raqam +998 bilan boshlanishi kerak';
        if (clean.length !== 12) return "Telefon raqami to'liq (9 xonali) bo'lishi kerak";
        return '';
    },
    subject: v => {
        const t = v.trim();
        if (!t) return 'Mavzu kiritilishi shart';
        if (t.length < 3) return "Mavzu kamida 3 ta belgi bo'lishi kerak";
        return '';
    },
    message: v => {
        const t = v.trim();
        if (!t) return 'Xabar yozing';
        if (t.length < 10) return `Xabar kamida 10 ta belgi bo'lishi kerak (${t.length}/10)`;
        return '';
    }
};
 
const EMPTY_VALUES = { name: '', email: '', phone: '+998 ', subject: '', message: '' };
const NO_TOUCH = { name: false, email: false, phone: false, subject: false, message: false };
 
const Field = ({ icon, error, valid, tall = false, className = '', children }) => (
    <div className={className}>
        <div className={`cf-field ${tall ? 'cf-tall' : ''} ${error ? 'cf-error' : valid ? 'cf-valid' : ''}`}>
            <span className="cf-icon">{icon}</span>
            {children}
            <span className="cf-status" aria-hidden="true">
                {error ? '!' : valid ? '✓' : ''}
            </span>
        </div>
        {error && <p className="cf-msg">{error}</p>}
    </div>
);
 
const ContactForm = () => {
    const [values, setValues] = useState(EMPTY_VALUES);
    const [touched, setTouched] = useState(NO_TOUCH);
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [errorText, setErrorText] = useState('');
    const areaRef = useRef(null);
    const btnRef = useRef(null);
    const slotRef = useRef(null);
    const lineRef = useRef(null);
    const ringRef = useRef(null);
    const dotRef = useRef(null);
    const timerRef = useRef(null);
    const lastDodge = useRef(0);
    const cur = useRef({ x: 0, y: 0 });
    const vel = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const raf = useRef(0);
    const movedRef = useRef(false);
    const validRef = useRef(false);
    const sizeRef = useRef({ w: 0, h: 120 });
    const homeTimer = useRef(0);
 
    const errors = useMemo(() => {
        const out = {};
        FIELD_ORDER.forEach(f => {
            out[f] = validators[f](values[f]);
        });
        return out;
    }, [values]);
 
    const validCount = FIELD_ORDER.filter(f => !errors[f]).length;
    const isValid = validCount === FIELD_ORDER.length;
    const shownError = f => (touched[f] ? errors[f] : '');
    const shownValid = f => touched[f] && !errors[f];
 
    validRef.current = isValid;
 
    const homeOf = () => ({
        x: (sizeRef.current.w - BTN_W) / 2,
        y: (sizeRef.current.h - BTN_H) / 2
    });
 
    // Tugma va ipni to'g'ridan-to'g'ri DOM'da chizamiz (silliq, qayta render yo'q)
    const paint = () => {
        const btn = btnRef.current;
        const line = lineRef.current;
        if (!btn) return;
        const { x, y } = cur.current;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        if (line) {
            const h = homeOf();
            line.setAttribute('x2', x + BTN_W / 2);
            line.setAttribute('y2', y + BTN_H / 2);
            line.style.opacity = Math.hypot(x - h.x, y - h.y) > 6 ? 1 : 0;
        }
    };
 
    const step = () => {
        const c = cur.current;
        const v = vel.current;
        const t = target.current;
        v.x += (t.x - c.x) * 0.16;
        v.y += (t.y - c.y) * 0.16;
        v.x *= 0.74;
        v.y *= 0.74;
        c.x += v.x;
        c.y += v.y;
        paint();
        if (Math.abs(v.x) + Math.abs(v.y) + Math.abs(t.x - c.x) + Math.abs(t.y - c.y) < 0.3) {
            c.x = t.x;
            c.y = t.y;
            paint();
            raf.current = 0;
            return;
        }
        raf.current = requestAnimationFrame(step);
    };
 
    const run = () => {
        if (!raf.current) raf.current = requestAnimationFrame(step);
    };
 
    const layout = () => {
        const area = areaRef.current;
        if (!area) return;
        sizeRef.current = { w: area.clientWidth, h: area.clientHeight };
        const h = homeOf();
        const cx = h.x + BTN_W / 2;
        const cy = h.y + BTN_H / 2;
 
        const slot = slotRef.current;
        if (slot) {
            slot.style.width = `${BTN_W + 28}px`;
            slot.style.height = `${BTN_H + 18}px`;
            slot.style.left = `${cx - (BTN_W + 28) / 2}px`;
            slot.style.top = `${cy - (BTN_H + 18) / 2}px`;
        }
        const line = lineRef.current;
        if (line) {
            line.setAttribute('x1', cx);
            line.setAttribute('y1', cy);
        }
        [ringRef.current, dotRef.current].forEach(el => {
            if (el) {
                el.setAttribute('cx', cx);
                el.setAttribute('cy', cy);
            }
        });
 
        if (validRef.current || !movedRef.current) {
            cur.current = { ...h };
            target.current = { ...h };
            vel.current = { x: 0, y: 0 };
        } else {
            const maxX = Math.max(0, sizeRef.current.w - BTN_W);
            const maxY = Math.max(0, sizeRef.current.h - BTN_H);
            cur.current = { x: clampN(cur.current.x, 0, maxX), y: clampN(cur.current.y, 0, maxY) };
            target.current = { x: clampN(target.current.x, 0, maxX), y: clampN(target.current.y, 0, maxY) };
        }
        paint();
    };
 
    useLayoutEffect(() => {
        layout();
        const area = areaRef.current;
        const ro = new ResizeObserver(layout);
        if (area) ro.observe(area);
        return () => {
            ro.disconnect();
            cancelAnimationFrame(raf.current);
        };
    }, []);
 
    const goHome = () => {
        clearTimeout(homeTimer.current);
        target.current = homeOf();
        movedRef.current = false;
        run();
    };
 
    // Hammasi to'g'ri bo'lsa tugma uyachasiga qaytadi
    useEffect(() => {
        if (isValid) goHome();
    }, [isValid]);
 
    useEffect(() => () => {
        clearTimeout(timerRef.current);
        clearTimeout(homeTimer.current);
    }, []);
 
    // Kursordan teskari tomonga (yoki tasodifiy) qochish
    const dodge = (cx, cy) => {
        const area = areaRef.current;
        if (!area) return;
 
        const now = performance.now();
        if (now - lastDodge.current < 90) return;
        lastDodge.current = now;
 
        const rect = area.getBoundingClientRect();
        const maxX = Math.max(0, rect.width - BTN_W);
        const maxY = Math.max(0, rect.height - BTN_H);
        const c = cur.current;
        const hasPointer = typeof cx === 'number';
        const px = hasPointer ? cx - rect.left : c.x + BTN_W / 2 + (Math.random() - 0.5) * 10;
        const py = hasPointer ? cy - rect.top : c.y + BTN_H / 2 + (Math.random() - 0.5) * 10;
 
        let dx = c.x + BTN_W / 2 - px;
        let dy = c.y + BTN_H / 2 - py;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
 
        // Yaqin masofaga qochadi (uzoqqa emas)
        const jump = 75 + Math.random() * 45;
        let nx = clampN(c.x + dx * jump + (Math.random() - 0.5) * 40, 0, maxX);
        let ny = clampN(c.y + dy * jump + (Math.random() - 0.5) * 40, 0, maxY);
 
        // Burchakka qisilib qolsa: yaqin atrofdagi eng uzoq joyga o'tadi
        if (Math.hypot(nx - c.x, ny - c.y) < 50) {
            let bestD = -1;
            for (let i = 0; i < 10; i++) {
                const rx = clampN(c.x + (Math.random() - 0.5) * 240, 0, maxX);
                const ry = Math.random() * maxY;
                const d = Math.hypot(rx + BTN_W / 2 - px, ry + BTN_H / 2 - py);
                if (d > bestD) {
                    bestD = d;
                    nx = rx;
                    ny = ry;
                }
            }
        }
 
        target.current = { x: nx, y: ny };
        movedRef.current = true;
        run();
 
        // Ushlashga urinish to'xtasa tugma joyiga qaytadi
        clearTimeout(homeTimer.current);
        homeTimer.current = setTimeout(() => {
            if (!validRef.current) goHome();
        }, 900);
    };
 
    const handleAreaLeave = () => {
        if (validRef.current) return;
        clearTimeout(homeTimer.current);
        homeTimer.current = setTimeout(goHome, 250);
    };
 
    const handleAreaMove = e => {
        if (isValid || status === 'sending') return;
        const area = areaRef.current;
        if (!area) return;
        const rect = area.getBoundingClientRect();
        const bx = rect.left + cur.current.x + BTN_W / 2;
        const by = rect.top + cur.current.y + BTN_H / 2;
        const nx = (e.clientX - bx) / (BTN_W / 2 + 55);
        const ny = (e.clientY - by) / (BTN_H / 2 + 55);
        if (nx * nx + ny * ny < 1) dodge(e.clientX, e.clientY);
    };
 
    const handleBtnPointerDown = e => {
        if (!isValid && e.pointerType !== 'mouse') {
            e.preventDefault();
            dodge(e.clientX, e.clientY);
        }
    };
 
    const handleBtnClick = e => {
        if (!isValid) {
            e.preventDefault();
            setTouched({ name: true, email: true, phone: true, subject: true, message: true });
            dodge(e.detail ? e.clientX : undefined, e.detail ? e.clientY : undefined);
        }
    };
 
    const handleChange = e => {
        const { name, value } = e.target;
        const next = name === 'phone' ? formatPhone(value) : value;
        setValues(p => ({ ...p, [name]: next }));
        setTouched(p => ({ ...p, [name]: true }));
    };
 
    const handleBlur = e => {
        const { name } = e.target;
        setTouched(p => ({ ...p, [name]: true }));
    };
 
    const sendToTelegram = async () => {
        const data = {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone,
            subject: values.subject.trim(),
            message: values.message.trim()
        };

        // 1) Server orqali (token brauzerda yo'q): VITE_API_URL berilgan bo'lsa
        // 2) To'g'ridan-to'g'ri Telegram'ga: VITE_BOT_TOKEN va VITE_CHAT_ID berilgan bo'lsa
        // 3) Aks holda shu saytdagi /api/contact (Vercel serverless) ga
        const useDirect = !API_BASE && BOT_TOKEN && CHAT_ID;

        try {
            let res;
            if (useDirect) {
                const text =
                    `📩 <b>Yangi xabar</b>\n\n` +
                    `👤 Ism: ${esc(data.name)}\n` +
                    `✉️ Email: ${esc(data.email)}\n` +
                    `📱 Telefon: ${esc(data.phone)}\n` +
                    `📌 Mavzu: ${esc(data.subject)}\n\n` +
                    `💬 Xabar:\n${esc(data.message)}\n\n` +
                    `🕒 Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;
                res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
                });
            } else {
                res = await fetch(`${API_BASE}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.ok) {
                console.error('Yuborish xatosi:', res.status, json.description || '');
                return false;
            }
            return true;
        } catch (err) {
            console.error('Yuborish xatosi:', err);
            return false;
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (status === 'sending') return;
 
        if (!isValid) {
            setTouched({ name: true, email: true, phone: true, subject: true, message: true });
            dodge();
            return;
        }
 
        setStatus('sending');
        setErrorText('');
        const ok = await sendToTelegram();
 
        if (!ok) {
            setStatus('error');
            setErrorText("Yuborilmadi. Internetni tekshiring va qayta urinib ko'ring.");
            return;
        }
 
        setStatus('success');
        timerRef.current = setTimeout(() => {
            setValues(EMPTY_VALUES);
            setTouched(NO_TOUCH);
            setStatus('idle');
            goHome();
        }, 3500);
    };
 
    const sending = status === 'sending';
 
    return (
        <>
            <style>{`
        .cf-field {
          display: flex; align-items: center; gap: 12px;
          border: 2px solid #977ec6; border-radius: 9999px;
          padding: 12px 20px; background: rgba(255,255,255,0.02);
          transition: border-color .25s, box-shadow .25s, background .25s;
          animation: cf-slide .45s ease both;
        }
        .cf-field.cf-tall { align-items: flex-start; border-radius: 24px; padding: 14px 20px; }
        .cf-field:focus-within {
          border-color: #c4a8ff; background: rgba(151,126,198,0.08);
          box-shadow: 0 0 0 4px rgba(151,126,198,0.18), 0 0 22px rgba(132,0,255,0.35);
        }
        .cf-field.cf-error {
          border-color: #f87171; background: rgba(248,113,113,0.06);
          animation: cf-shake .4s ease;
        }
        .cf-field.cf-error:focus-within { box-shadow: 0 0 0 4px rgba(248,113,113,0.18); }
        .cf-field.cf-valid { border-color: #4ade80; }
        .cf-field.cf-valid:focus-within { box-shadow: 0 0 0 4px rgba(74,222,128,0.16), 0 0 18px rgba(74,222,128,0.3); }
        .cf-icon { font-size: 18px; transition: transform .25s; }
        .cf-field:focus-within .cf-icon { transform: scale(1.25) rotate(-8deg); }
        .cf-field input, .cf-field textarea {
          width: 100%; background: transparent; outline: none; color: #fff;
          font-size: 16px; font-weight: 500;
        }
        .cf-field textarea { resize: none; height: 78px; }
        .cf-field input::placeholder, .cf-field textarea::placeholder { color: rgba(255,255,255,0.45); }
        .cf-status {
          width: 22px; height: 22px; flex: none; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #060010;
        }
        .cf-valid .cf-status { background: #4ade80; animation: cf-pop .35s cubic-bezier(.3,1.6,.5,1); }
        .cf-error .cf-status { background: #f87171; animation: cf-pop .35s cubic-bezier(.3,1.6,.5,1); }
        .cf-msg {
          color: #fca5a5; font-size: 13px; margin: 6px 0 0 18px; font-weight: 500;
          animation: cf-drop .3s ease both;
        }
 
        .cf-progress { height: 6px; border-radius: 9999px; background: rgba(255,255,255,0.1); overflow: hidden; }
        .cf-progress > div {
          height: 100%; border-radius: inherit;
          background: linear-gradient(90deg, #8400ff, #22d3ee);
          transition: width .5s cubic-bezier(.3,1,.4,1);
          box-shadow: 0 0 12px rgba(132,0,255,.8);
        }
 
        .cf-area { position: relative; height: 120px; margin-top: 8px; touch-action: manipulation; }
        .cf-slot {
          position: absolute; pointer-events: none; border-radius: 9999px;
          border: 2px dashed rgba(45,212,191,.6); background: rgba(45,212,191,.06);
        }
        .cf-tether { filter: drop-shadow(0 0 6px #2dd4bf) drop-shadow(0 0 12px rgba(45,212,191,.6)); }
        .cf-btn {
          position: absolute; top: 0; left: 0; z-index: 10;
          display: flex; align-items: center; justify-content: center;
          border-radius: 9999px; font-size: 18px; font-weight: 600;
          color: #fff; white-space: nowrap; border: 2px solid #2dd4bf; background-clip: border-box;
          transition: background .3s, box-shadow .3s, opacity .3s, filter .2s;
          will-change: transform;
        }
        .cf-btn-locked { cursor: not-allowed; background: #3c4646; background-clip: border-box; box-shadow: 0 4px 14px rgba(0,0,0,.45); }
        .cf-btn-ready {
          cursor: pointer; border-style: solid; border-color: transparent;
          background: linear-gradient(90deg, #8400ff, #22d3ee);
          animation: cf-glow 1.8s ease-in-out infinite;
        }
        .cf-btn-ready:hover { filter: brightness(1.12); }
        .cf-btn-ready:active { filter: brightness(.9); }
        .cf-btn:disabled { opacity: .7; cursor: wait; }
 
        .cf-spinner {
          display: inline-block; width: 16px; height: 16px; margin-right: 8px; vertical-align: -2px;
          border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%;
          animation: cf-spin .7s linear infinite;
        }
 
        .cf-success {
          position: absolute; inset: 0; z-index: 20; border-radius: 24px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
          background: rgba(6,0,16,0.92); backdrop-filter: blur(6px);
          animation: cf-fade .35s ease both;
        }
        .cf-check {
          width: 84px; height: 84px; border-radius: 50%;
          background: linear-gradient(135deg, #4ade80, #22d3ee);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(74,222,128,.55);
          animation: cf-pop .55s cubic-bezier(.3,1.6,.5,1);
        }
        .cf-check svg path {
          stroke-dasharray: 40; stroke-dashoffset: 40; animation: cf-draw .5s .3s ease forwards;
        }
 
        .cf-fail {
          color: #fca5a5; font-size: 14px; font-weight: 500;
          border: 1px solid rgba(248,113,113,.5); border-radius: 12px; padding: 8px 14px;
          background: rgba(248,113,113,.08); animation: cf-drop .3s ease both;
        }
 
        @keyframes cf-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(3px)} }
        @keyframes cf-pop { 0%{transform:scale(0)} 100%{transform:scale(1)} }
        @keyframes cf-drop { from{opacity:0; transform:translateY(-6px)} to{opacity:1; transform:translateY(0)} }
        @keyframes cf-slide { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
        @keyframes cf-fade { from{opacity:0} to{opacity:1} }
        @keyframes cf-spin { to{transform:rotate(360deg)} }
        @keyframes cf-draw { to{stroke-dashoffset:0} }
        @keyframes cf-glow { 0%,100%{box-shadow:0 0 14px rgba(132,0,255,.55)} 50%{box-shadow:0 0 30px rgba(34,211,238,.75)} }
        @media (prefers-reduced-motion: reduce) {
          .cf-field, .cf-msg, .cf-btn-ready { animation: none !important; }
        }
      `}</style>
 
            <div className="relative w-full notranslate" translate="no">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-white"
                >
                    <Field icon="👤" error={shownError('name')} valid={shownValid('name')}>
                        <input
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Full Name *"
                            autoComplete="name"
                        />
                    </Field>
 
                    <Field icon="✉️" error={shownError('email')} valid={shownValid('email')}>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Email *"
                            autoComplete="email"
                        />
                    </Field>
 
                    <Field icon="📱" error={shownError('phone')} valid={shownValid('phone')}>
                        <input
                            type="tel"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="+998 90 123 45 67"
                            maxLength={17}
                            autoComplete="tel"
                        />
                    </Field>
 
                    <Field icon="📌" error={shownError('subject')} valid={shownValid('subject')}>
                        <input
                            name="subject"
                            value={values.subject}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Subject *"
                        />
                    </Field>
 
                    <Field
                        className="md:col-span-2"
                        icon="💬"
                        tall
                        error={shownError('message')}
                        valid={shownValid('message')}
                    >
                        <textarea
                            name="message"
                            value={values.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Message *"
                        />
                    </Field>
 
                    {/* Progress + qochuvchi tugma */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 text-[14px] font-medium">
                            <div className="cf-progress flex-1">
                                <div style={{ width: `${(validCount / FIELD_ORDER.length) * 100}%` }} />
                            </div>
                            <span className={isValid ? 'text-green-400' : 'text-purple-200'}>
                                {isValid ? '✅ Tayyor!' : `🔒 ${FIELD_ORDER.length - validCount} ta maydon qoldi`}
                            </span>
                        </div>
 
                        {status === 'error' && <p className="cf-fail mt-3">❌ {errorText}</p>}
 
                        <div ref={areaRef} className="cf-area" onPointerMove={handleAreaMove} onPointerLeave={handleAreaLeave}>
                            <div ref={slotRef} className="cf-slot" />
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" aria-hidden="true">
                                <line ref={lineRef} className="cf-tether" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" style={{ opacity: 0 }} />
                                <circle ref={ringRef} r="10" fill="none" stroke="#2dd4bf" strokeWidth="2" className="cf-tether" />
                                <circle ref={dotRef} r="3.5" fill="#2dd4bf" />
                            </svg>
                            <button
                                ref={btnRef}
                                type="submit"
                                disabled={sending}
                                aria-disabled={!isValid}
                                onPointerDown={handleBtnPointerDown}
                                onClick={handleBtnClick}
                                className={`cf-btn ${isValid ? 'cf-btn-ready' : 'cf-btn-locked'}`}
                                style={{ width: BTN_W, height: BTN_H }}
                            >
                                {sending ? (
                                    <>
                                        <span className="cf-spinner" />
                                        <span>Yuborilmoqda...</span>
                                    </>
                                ) : (
                                    <span>Send →</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
 
                {status === 'success' && (
                    <div className="cf-success" role="status">
                        <div className="cf-check">
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#060010" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-[20px] font-semibold text-white text-center">Ma'lumotlar yuborildi!</p>
                        <p className="text-[14px] text-purple-200 text-center">Tez orada aloqaga chiqishadi 🚀</p>
                    </div>
                )}
            </div>
        </>
    );
};
 
/* ===================================================================
   MAGIC BENTO (o'zgarmagan qism)
   =================================================================== */
 
const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
    return el;
};
 
const calculateSpotlightValues = radius => ({
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75
});
 
const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;
 
    card.style.setProperty('--glow-x', `${relativeX}%`);
    card.style.setProperty('--glow-y', `${relativeY}%`);
    card.style.setProperty('--glow-intensity', glow.toString());
    card.style.setProperty('--glow-radius', `${radius}px`);
};
 
const ParticleCard = ({
    children,
    className = '',
    disableAnimations = false,
    style,
    particleCount = DEFAULT_PARTICLE_COUNT,
    glowColor = DEFAULT_GLOW_COLOR,
    enableTilt = true,
    clickEffect = false,
    enableMagnetism = false
}) => {
    const cardRef = useRef(null);
    const particlesRef = useRef([]);
    const timeoutsRef = useRef([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef([]);
    const particlesInitialized = useRef(false);
    const magnetismAnimationRef = useRef(null);
 
    const initializeParticles = useCallback(() => {
        if (particlesInitialized.current || !cardRef.current) return;
 
        const { width, height } = cardRef.current.getBoundingClientRect();
        memoizedParticles.current = Array.from({ length: particleCount }, () =>
            createParticleElement(Math.random() * width, Math.random() * height, glowColor)
        );
        particlesInitialized.current = true;
    }, [particleCount, glowColor]);
 
    const clearAllParticles = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        magnetismAnimationRef.current?.kill();
 
        particlesRef.current.forEach(particle => {
            gsap.to(particle, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    particle.parentNode?.removeChild(particle);
                }
            });
        });
        particlesRef.current = [];
    }, []);
 
    const animateParticles = useCallback(() => {
        if (!cardRef.current || !isHoveredRef.current) return;
 
        if (!particlesInitialized.current) {
            initializeParticles();
        }
 
        memoizedParticles.current.forEach((particle, index) => {
            const timeoutId = setTimeout(() => {
                if (!isHoveredRef.current || !cardRef.current) return;
 
                const clone = particle.cloneNode(true);
                cardRef.current.appendChild(clone);
                particlesRef.current.push(clone);
 
                gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
 
                gsap.to(clone, {
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    rotation: Math.random() * 360,
                    duration: 2 + Math.random() * 2,
                    ease: 'none',
                    repeat: -1,
                    yoyo: true
                });
 
                gsap.to(clone, {
                    opacity: 0.3,
                    duration: 1.5,
                    ease: 'power2.inOut',
                    repeat: -1,
                    yoyo: true
                });
            }, index * 100);
 
            timeoutsRef.current.push(timeoutId);
        });
    }, [initializeParticles]);
 
    useEffect(() => {
        if (disableAnimations || !cardRef.current) return;
 
        const element = cardRef.current;
 
        const handleMouseEnter = () => {
            isHoveredRef.current = true;
            animateParticles();
 
            if (enableTilt) {
                gsap.to(element, {
                    rotateX: 5,
                    rotateY: 5,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            }
        };
 
        const handleMouseLeave = () => {
            isHoveredRef.current = false;
            clearAllParticles();
 
            if (enableTilt) {
                gsap.to(element, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
 
            if (enableMagnetism) {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };
 
        const handleMouseMove = e => {
            if (!enableTilt && !enableMagnetism) return;
 
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
 
            if (enableTilt) {
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
 
                gsap.to(element, {
                    rotateX,
                    rotateY,
                    duration: 0.1,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            }
 
            if (enableMagnetism) {
                const magnetX = (x - centerX) * 0.05;
                const magnetY = (y - centerY) * 0.05;
 
                magnetismAnimationRef.current = gsap.to(element, {
                    x: magnetX,
                    y: magnetY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };
 
        const handleClick = e => {
            if (!clickEffect) return;
 
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
 
            const maxDistance = Math.max(
                Math.hypot(x, y),
                Math.hypot(x - rect.width, y),
                Math.hypot(x, y - rect.height),
                Math.hypot(x - rect.width, y - rect.height)
            );
 
            const ripple = document.createElement('div');
            ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
 
            element.appendChild(ripple);
 
            gsap.fromTo(
                ripple,
                {
                    scale: 0,
                    opacity: 1
                },
                {
                    scale: 1,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => ripple.remove()
                }
            );
        };
 
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('click', handleClick);
 
        return () => {
            isHoveredRef.current = false;
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('click', handleClick);
            clearAllParticles();
        };
    }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);
 
    return (
        <div
            ref={cardRef}
            className={`${className} relative overflow-hidden`}
            style={{ ...style, position: 'relative', overflow: 'hidden' }}
        >
            {children}
        </div>
    );
};
 
const GlobalSpotlight = ({
    gridRef,
    disableAnimations = false,
    enabled = true,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    glowColor = DEFAULT_GLOW_COLOR
}) => {
    const spotlightRef = useRef(null);
    const isInsideSection = useRef(false);
 
    useEffect(() => {
        if (disableAnimations || !gridRef?.current || !enabled) return;
 
        const spotlight = document.createElement('div');
        spotlight.className = 'global-spotlight';
        spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
        document.body.appendChild(spotlight);
        spotlightRef.current = spotlight;
 
        const handleMouseMove = e => {
            if (!spotlightRef.current || !gridRef.current) return;
 
            const section = gridRef.current.closest('.bento-section');
            const rect = section?.getBoundingClientRect();
            const mouseInside =
                rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
 
            isInsideSection.current = mouseInside || false;
            const cards = gridRef.current.querySelectorAll('.card');
 
            if (!mouseInside) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                cards.forEach(card => {
                    card.style.setProperty('--glow-intensity', '0');
                });
                return;
            }
 
            const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
            let minDistance = Infinity;
 
            cards.forEach(card => {
                const cardElement = card;
                const cardRect = cardElement.getBoundingClientRect();
                const centerX = cardRect.left + cardRect.width / 2;
                const centerY = cardRect.top + cardRect.height / 2;
                const distance =
                    Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
                const effectiveDistance = Math.max(0, distance);
 
                minDistance = Math.min(minDistance, effectiveDistance);
 
                let glowIntensity = 0;
                if (effectiveDistance <= proximity) {
                    glowIntensity = 1;
                } else if (effectiveDistance <= fadeDistance) {
                    glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
                }
 
                updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
            });
 
            gsap.to(spotlightRef.current, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
 
            const targetOpacity =
                minDistance <= proximity
                    ? 0.8
                    : minDistance <= fadeDistance
                        ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
                        : 0;
 
            gsap.to(spotlightRef.current, {
                opacity: targetOpacity,
                duration: targetOpacity > 0 ? 0.2 : 0.5,
                ease: 'power2.out'
            });
        };
 
        const handleMouseLeave = () => {
            isInsideSection.current = false;
            gridRef.current?.querySelectorAll('.card').forEach(card => {
                card.style.setProperty('--glow-intensity', '0');
            });
            if (spotlightRef.current) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };
 
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
 
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
        };
    }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
 
    return null;
};
 
const BentoCardGrid = ({ children, gridRef }) => (
    <div
        ref={gridRef}
        className="
        bento-section
        relative
        select-none
        mx-auto
        max-w-[54rem]
        p-3
        grid
        gap-2
 
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
 
        lg:[&>.card:nth-child(3)]:col-span-2
        lg:[&>.card:nth-child(3)]:row-span-2
 
        lg:[&>.card:nth-child(4)]:col-span-2
        lg:[&>.card:nth-child(4)]:row-span-2
 
        lg:[&>.card:nth-child(6)]:col-start-4
        lg:[&>.card:nth-child(6)]:row-start-3
      "
        style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }}
    >
        {children}
    </div>
);
 
const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false);
 
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
 
        checkMobile();
        window.addEventListener('resize', checkMobile);
 
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
 
    return isMobile;
};
 
const MagicBento = ({
    textAutoHide = true,
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    disableAnimations = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    particleCount = DEFAULT_PARTICLE_COUNT,
    enableTilt = false,
    glowColor = DEFAULT_GLOW_COLOR,
    clickEffect = true,
    enableMagnetism = true
}) => {
    const gridRef = useRef(null);
    const isMobile = useMobileDetection();
    const shouldDisableAnimations = disableAnimations || isMobile;
 
    return (
        <>
            <style>
                {`
  .card--border-glow::after {
    content: '';
    position: absolute;
    inset: 0;
    padding: 6px;
    background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
      rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
      rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
      transparent 60%);
    border-radius: inherit;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
 
  .particle::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: rgba(${glowColor}, 0.2);
    border-radius: 50%;
    z-index: -1;
  }
 
  .text-clamp-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
 
  .text-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`}
            </style>
 
            {enableSpotlight && (
                <GlobalSpotlight
                    gridRef={gridRef}
                    disableAnimations={shouldDisableAnimations}
                    enabled={enableSpotlight}
                    spotlightRadius={spotlightRadius}
                    glowColor={glowColor}
                />
            )}
 
            <BentoCardGrid gridRef={gridRef}>
                <div className="">
                    {cardData.map((card, index) => {
                        const baseClassName = `
                        card
                        relative
                        flex
                        justify-center
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-solid
                        font-light
                        transition-all
                        duration-300
                        ease-in-out
                        hover:-translate-y-0.5
                        hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
 
                        w-full
                        min-h-[180px]
 
                        sm:min-h-[220px]
                        md:min-h-[260px]
                        lg:w-[700px]
                        lg:min-h-[460px]
 
                        ${enableBorderGlow ? 'card--border-glow' : ''}
                      `;
                        const cardStyle = {
                            backgroundColor: card.color || 'var(--background-dark)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--white)',
                            '--glow-x': '50%',
                            '--glow-y': '50%',
                            '--glow-intensity': '0',
                            '--glow-radius': '200px'
                        };
                        if (enableStars) {
                            return (
                                <ParticleCard
                                    key={index}
                                    className={baseClassName}
                                    style={cardStyle}
                                    disableAnimations={shouldDisableAnimations}
                                    particleCount={particleCount}
                                    glowColor={glowColor}
                                    enableTilt={enableTilt}
                                >
                                    <div className="block h-full w-full">
                                        <div
                                            className="relative h-full w-full rounded-[20px] overflow-hidden"
                                            style={{
                                                backgroundImage: card.img ? `url(${card.img})` : undefined,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            {/* overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/70"></div>
 
                                            {/* content */}
                                            <div className="relative z-10 p-6 text-white h-full flex flex-col justify-center">
                                                <div className="max-w-6xl mx-auto px-2 w-full">
                                                    <ContactForm />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ParticleCard>
                            );
                        }
                        return (
                            <div
                                key={index}
                                className={baseClassName}
                                style={cardStyle}
                                ref={el => {
                                    if (!el) return;
 
                                    const handleMouseMove = e => {
                                        if (shouldDisableAnimations) return;
 
                                        const rect = el.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
                                        const centerX = rect.width / 2;
                                        const centerY = rect.height / 2;
 
                                        if (enableTilt) {
                                            const rotateX = ((y - centerY) / centerY) * -10;
                                            const rotateY = ((x - centerX) / centerX) * 10;
 
                                            gsap.to(el, {
                                                rotateX,
                                                rotateY,
                                                duration: 0.1,
                                                ease: 'power2.out',
                                                transformPerspective: 1000
                                            });
                                        }
 
                                        if (enableMagnetism) {
                                            const magnetX = (x - centerX) * 0.05;
                                            const magnetY = (y - centerY) * 0.05;
 
                                            gsap.to(el, {
                                                x: magnetX,
                                                y: magnetY,
                                                duration: 0.3,
                                                ease: 'power2.out'
                                            });
                                        }
                                    };
 
                                    const handleMouseLeave = () => {
                                        if (shouldDisableAnimations) return;
 
                                        if (enableTilt) {
                                            gsap.to(el, {
                                                rotateX: 0,
                                                rotateY: 0,
                                                duration: 0.3,
                                                ease: 'power2.out'
                                            });
                                        }
 
                                        if (enableMagnetism) {
                                            gsap.to(el, {
                                                x: 0,
                                                y: 0,
                                                duration: 0.3,
                                                ease: 'power2.out'
                                            });
                                        }
                                    };
 
                                    const handleClick = e => {
                                        if (!clickEffect || shouldDisableAnimations) return;
 
                                        const rect = el.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
 
                                        const maxDistance = Math.max(
                                            Math.hypot(x, y),
                                            Math.hypot(x - rect.width, y),
                                            Math.hypot(x, y - rect.height),
                                            Math.hypot(x - rect.width, y - rect.height)
                                        );
 
                                        const ripple = document.createElement('div');
                                        ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `;
 
                                        el.appendChild(ripple);
 
                                        gsap.fromTo(
                                            ripple,
                                            {
                                                scale: 0,
                                                opacity: 1
                                            },
                                            {
                                                scale: 1,
                                                opacity: 0,
                                                duration: 0.8,
                                                ease: 'power2.out',
                                                onComplete: () => ripple.remove()
                                            }
                                        );
                                    };
 
                                    el.addEventListener('mousemove', handleMouseMove);
                                    el.addEventListener('mouseleave', handleMouseLeave);
                                    el.addEventListener('click', handleClick);
                                }}
                            >
                                <div className="card__header flex justify-between gap-3 relative text-white">
                                    <span className="card__label text-base">{card.label}</span>
                                </div>
                                <div className="card__content flex flex-col relative text-white">
                                    <h3 className={`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`}>
                                        {card.title}
                                    </h3>
                                    <p className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`}>
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </BentoCardGrid>
        </>
    );
};
 
export default MagicBento;