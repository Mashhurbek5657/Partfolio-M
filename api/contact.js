// Vercel serverless funksiya: token faqat serverda turadi (brauzerga chiqmaydi)
// Vercel -> Settings -> Environment Variables: BOT_TOKEN va CHAT_ID
// CORS yoqilgan: lokal sayt (localhost) yoki boshqa domendan ham so'rov qabul qiladi.

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false });

    const { name, email, phone, subject, message } = req.body || {};
    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ ok: false, error: 'Maydonlar to‘liq emas' });
    }

    if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
        console.error('BOT_TOKEN yoki CHAT_ID Vercel Environment Variables da yo‘q');
        return res.status(500).json({ ok: false });
    }

    const text =
        `📩 <b>Yangi xabar</b>\n\n` +
        `👤 Ism: ${esc(String(name).slice(0, 100))}\n` +
        `✉️ Email: ${esc(String(email).slice(0, 100))}\n` +
        `📱 Telefon: ${esc(String(phone).slice(0, 30))}\n` +
        `📌 Mavzu: ${esc(String(subject).slice(0, 200))}\n\n` +
        `💬 Xabar:\n${esc(String(message).slice(0, 2000))}\n\n` +
        `🕒 Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

    try {
        const r = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: process.env.CHAT_ID, text, parse_mode: 'HTML' })
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.ok) {
            console.error('Telegram:', data.description);
            return res.status(502).json({ ok: false });
        }
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Telegram xato:', err);
        return res.status(500).json({ ok: false });
    }
}