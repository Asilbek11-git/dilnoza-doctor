import { Appointment } from './db.ts';
import {
  sendAppointmentToTelegram,
  formatTelegramAppointmentMessage,
  getTelegramLogs,
  TelegramLog
} from './telegramBot.ts';

export type TelegramNotificationResult = TelegramLog;

export { formatTelegramAppointmentMessage };

export async function sendTelegramNotification(apt: Appointment): Promise<TelegramNotificationResult> {
  return await sendAppointmentToTelegram(apt);
}

export function getNotificationLogs(): TelegramNotificationResult[] {
  return getTelegramLogs();
}
