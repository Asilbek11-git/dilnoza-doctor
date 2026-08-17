import os
import requests
import logging

logger = logging.getLogger(__name__)

def send_telegram_notification(appointment):
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    is_enabled = os.getenv('TELEGRAM_NOTIFICATIONS_ENABLED', 'false').lower() == 'true'

    if not is_enabled or not bot_token or not chat_id:
        logger.info(f"[Simulation] Telegram notification recorded for appointment #{appointment.id}: {appointment.name}")
        return True

    text = (
        f"🔔 <b>YANGI QABUL</b>\n\n"
        f"👤 <b>Ism:</b> {appointment.name}\n"
        f"📞 <b>Telefon:</b> {appointment.phone}\n"
        f"🩺 <b>Xizmat:</b> {appointment.service_title or (appointment.service.title if appointment.service else 'Terapevtik konsultatsiya')}\n"
        f"📅 <b>Sana:</b> {appointment.preferred_date or 'Kelishiladi'}\n"
        f"💬 <b>Xabar:</b> {appointment.message or 'Xabar yo‘q'}\n\n"
        f"<b>Status:</b> {appointment.status}"
    )

    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'HTML'
        }
        res = requests.post(url, json=payload, timeout=5)
        return res.status_code == 200
    except Exception as e:
        logger.error(f"Error sending telegram notification: {e}")
        return False
