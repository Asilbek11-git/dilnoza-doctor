import { Appointment, getDatabase, saveDatabase } from './db.ts';

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8991757788:AAFgXsxRwW2mhiAmdN23JwM8V0Tzdo9o2cA';
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8484696541';

export interface TelegramLog {
  sent: boolean;
  timestamp: string;
  recipient: string;
  messageFormatted: string;
  error?: string;
}

const telegramLogs: TelegramLog[] = [];

export function formatPrice(price?: number | string): string {
  if (!price) return "Kelishiladi (Muolaja turiga qarab)";
  if (typeof price === 'string') {
    if (price.toLowerCase().includes("so'm") || price.toLowerCase().includes("som")) return price;
    const num = Number(price.replace(/[^0-9]/g, ''));
    return isNaN(num) || num === 0 ? price : `${num.toLocaleString('uz-UZ')} so'm`;
  }
  return `${price.toLocaleString('uz-UZ')} so'm`;
}

export function formatTelegramAppointmentMessage(apt: Appointment): string {
  const priceDisplay = formatPrice(apt.price);
  const timeDisplay = apt.preferred_time || "Kelishiladi";
  const dateDisplay = apt.preferred_date || "Belgilanmagan";

  return `🏥 <b>YANGI MUOLAJA QABULI!</b>\n\n` +
    `👤 <b>Bemor:</b> ${escapeHtml(apt.name)}\n` +
    `📞 <b>Telefon:</b> ${escapeHtml(apt.phone)}\n` +
    `💉 <b>Muolaja turi:</b> ${escapeHtml(apt.service_title || 'Tibbiy muolaja')}\n` +
    `📅 <b>Sana:</b> ${escapeHtml(dateDisplay)}\n` +
    `⏰ <b>Qabul vaqti:</b> ${escapeHtml(timeDisplay)}\n` +
    `💰 <b>To'lov summasi:</b> <b>${escapeHtml(priceDisplay)}</b>\n` +
    (apt.message ? `💬 <b>Izoh / Buyurtma:</b> <i>${escapeHtml(apt.message)}</i>\n` : '') +
    `\n❓ <b>Qabul qilasizmi yoki Rad etasizmi?</b>`;
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendAppointmentToTelegram(apt: Appointment): Promise<TelegramLog> {
  const text = formatTelegramAppointmentMessage(apt);
  const token = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  const log: TelegramLog = {
    sent: false,
    timestamp: new Date().toISOString(),
    recipient: chatId,
    messageFormatted: text
  };

  const keyboard = {
    inline_keyboard: [
      [
        { text: "✅ Qabul qilish", callback_data: `accept_${apt.id}` },
        { text: "❌ Rad etish", callback_data: `reject_${apt.id}` }
      ]
    ]
  };

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
    });

    const data = await response.json();
    if (data.ok) {
      log.sent = true;
      console.log(`[Telegram Bot] Message sent successfully to ${chatId} for appointment ${apt.id}`);
    } else {
      log.error = data.description || 'Telegram API xatolik berdi';
      console.error(`[Telegram Bot] Send error:`, data);
    }
  } catch (err: any) {
    log.error = err?.message || 'Tarmoq xatosi';
    console.error(`[Telegram Bot] Network error:`, err);
  }

  telegramLogs.unshift(log);
  if (telegramLogs.length > 50) telegramLogs.pop();

  return log;
}

// Background Telegram Callback Polling Handler
let isPolling = false;
let lastUpdateId = 0;

export function startTelegramPolling() {
  if (isPolling) return;
  isPolling = true;
  console.log(`[Telegram Bot] Polling started for token ${TELEGRAM_BOT_TOKEN.slice(0, 10)}...`);

  const poll = async () => {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          await handleTelegramUpdate(update);
        }
      }
    } catch (err) {
      // transient network timeout or abort is expected
    }

    // Schedule next poll safely
    setTimeout(poll, 1500);
  };

  poll();
}

async function handleTelegramUpdate(update: any) {
  if (!update.callback_query) return;

  const callbackQuery = update.callback_query;
  const callbackData = callbackQuery.data || '';
  const messageId = callbackQuery.message?.message_id;
  const chatId = callbackQuery.message?.chat?.id;

  if (callbackData.startsWith('accept_') || callbackData.startsWith('reject_')) {
    const isAccept = callbackData.startsWith('accept_');
    const aptId = callbackData.replace(isAccept ? 'accept_' : 'reject_', '');

    const db = getDatabase();
    const aptIndex = db.appointments.findIndex(a => a.id === aptId);
    let apt = aptIndex !== -1 ? db.appointments[aptIndex] : null;

    if (apt) {
      apt.status = isAccept ? 'CONFIRMED' : 'CANCELLED';
      apt.admin_notes = isAccept ? "Telegram bot orqali qabul qilindi" : "Telegram bot orqali rad etildi";
      apt.updated_at = new Date().toISOString();
      db.appointments[aptIndex] = apt;
      saveDatabase(db);
    }

    // Answer callback query popup
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
          text: isAccept ? "✅ Qabul tasdiqlandi!" : "❌ Qabul rad etildi!",
          show_alert: true
        })
      });
    } catch (e) {
      console.error("[Telegram Bot] Answer callback error:", e);
    }

    // Edit Telegram message to reflect decision
    if (chatId && messageId) {
      const statusBadge = isAccept ? "✅ <b>QABUL QILINDI (TASDIQLANDI)</b>" : "❌ <b>RAD ETILDI</b>";
      const cleanPhone = apt?.phone?.replace(/[^0-9+]/g, '') || '';
      
      const updatedText = `🏥 <b>MUOLAJA QABULI — ${statusBadge}</b>\n\n` +
        `👤 <b>Bemor:</b> ${escapeHtml(apt?.name || "Bemor")}\n` +
        `📞 <b>Telefon:</b> ${escapeHtml(apt?.phone || "")}\n` +
        `💉 <b>Muolaja turi:</b> ${escapeHtml(apt?.service_title || "Tibbiy muolaja")}\n` +
        `📅 <b>Sana:</b> ${escapeHtml(apt?.preferred_date || "")}\n` +
        `⏰ <b>Vaqt:</b> ${escapeHtml(apt?.preferred_time || "Kelishiladi")}\n` +
        `💰 <b>To'lov summasi:</b> <b>${escapeHtml(formatPrice(apt?.price))}</b>\n` +
        (apt?.message ? `💬 <b>Izoh:</b> <i>${escapeHtml(apt.message)}</i>\n` : '') +
        `\n📌 <b>Qaror:</b> ${isAccept ? "Muolajaga rozilik berildi va qabul belgilandi." : "Muolaja vaqti mos kelmadi yoki rad etildi."}\n` +
        `⏱ <i>Holat o'zgardi: ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</i>`;

      const nextKeyboard = isAccept && cleanPhone ? {
        inline_keyboard: [
          [
            { text: "📞 Bemorga qo'ng'iroq qilish", url: `https://t.me/+${cleanPhone.replace('+', '')}` },
            { text: "❌ Bekor qilish", callback_data: `reject_${aptId}` }
          ]
        ]
      } : {
        inline_keyboard: [
          [
            { text: "✅ Qaytadan qabul qilish", callback_data: `accept_${aptId}` }
          ]
        ]
      };

      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: updatedText,
            parse_mode: 'HTML',
            reply_markup: nextKeyboard
          })
        });
      } catch (e) {
        console.error("[Telegram Bot] Edit message error:", e);
      }
    }
  }
}

export function getTelegramLogs() {
  return [...telegramLogs];
}
