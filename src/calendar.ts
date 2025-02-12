import type { Idol } from "./idols";
import type { Entry } from "./types";

export const generateCalendar = async (
  entries: Entry[],
  idol: Idol
): Promise<string> => {
  const vEvents = await Promise.all(
    entries
      // 指定されたメンバーが参加するスケジュールのみ抽出
      .filter((entry) => entry.idols.some(({ id }) => id === idol.id))
      .map((entry) => entryToVEvent(entry, idol))
  );
  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//example.com//iCalendar Generator//EN");
  lines.push(`NAME:${idol.fullName}`);
  lines.push(`X-WR-CALNAME:${idol.fullName}`);
  lines.push("URL:https://academy-calendar.furugomu.worker.dev/");
  lines.push(`SOURCE:https://academy-calendar.furugomu.worker.dev/${idol.id}`);
  lines.push("REFRESH-INTERVAL;VALUE=DURATION:PT4H");
  lines.push(`COLOR:${idol.color}`);
  lines.push(vEvents.join("\n"));
  lines.push("END:VCALENDAR");
  return lines.join("\n");
};

/** iCalendarのVEVENTを生成する */
export const entryToVEvent = async (
  entry: Entry,
  idol: Idol
): Promise<string> => {
  const lines: string[] = [];
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${await uid(entry, idol)}@example.com`);
  lines.push(`DTSTAMP:${formatDate(new Date(), "date-time")}`);
  const dtStart = formatDate(entry.startAt, entry.scheduleType);
  lines.push(
    `DTSTART${entry.scheduleType === "date" ? ";VALUE=DATE" : ""}:${dtStart}`
  );
  lines.push(`SUMMARY:${entry.title}`);
  lines.push(`DESCRIPTION:${entry.idols.map((i) => i.name).join(", ")}`);
  const channel =
    entry.channels.find((c) => c.id === idol.id) ?? entry.channels[0];
  if (channel) lines.push(`URL:${channel.youtubeUrl}`);
  lines.push("END:VEVENT");
  return lines.join("\n");
};

const formatDate = (date: Date, type: Entry["scheduleType"]): string => {
  if (type === "date") {
    return date.toISOString().split("T")[0]!.replace(/-/g, "");
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

const uid = async (entry: Entry, idol: Idol): Promise<string> => {
  // entry.startAt, entry.title, idol.id を sha-1 でハッシュ化
  const text = `${entry.startAt.toISOString()}${entry.title}${idol.id}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
