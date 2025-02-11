import type { Channel, Entry, Member } from "./types";

export const generateCalendar = async (
  entries: Entry[],
  member: Member
): Promise<string> => {
  const vEvents = await Promise.all(
    entries
      // 指定されたメンバーが参加するスケジュールのみ抽出
      .filter((entry) => entry.members.indexOf(member) >= 0)
      .map((entry) => entryToVEvent(entry, member))
  );
  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//example.com//iCalendar Generator//EN");
  lines.push(vEvents.join("\n"));
  lines.push("END:VCALENDAR");
  return lines.join("\n");
};

/** iCalendarのVEVENTを生成する */
export const entryToVEvent = async (
  entry: Entry,
  member: Member
): Promise<string> => {
  const lines: string[] = [];
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${await uid(entry, member)}@example.com`);
  lines.push(`DTSTAMP:${formatDate(new Date(), "date-time")}`);
  const dtStart = formatDate(entry.startAt, entry.scheduleType);
  lines.push(
    `DTSTART${entry.scheduleType === "date" ? ";VALUE=DATE" : ""}:${dtStart}`
  );
  lines.push(`SUMMARY:${entry.title}`);
  lines.push(`DESCRIPTION:${entry.members.join(", ")}`);
  const channel =
    entry.channels.indexOf(member) >= 0 ? member : entry.channels[0];
  const url = channelToUrl(channel);
  if (url) lines.push(`URL:${url}`);
  lines.push("END:VEVENT");
  return lines.join("\n");
};

const formatDate = (date: Date, type: Entry["scheduleType"]): string => {
  if (type === "date") {
    return date.toISOString().split("T")[0]!.replace(/-/g, "");
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

const uid = async (entry: Entry, member: Member): Promise<string> => {
  // entry.startAt, entry.title, member を sha-1 でハッシュ化
  const text = `${entry.startAt.toISOString()}${entry.title}${member}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const channelToUrl = (channel?: Channel): string => {
  if (!channel) return "";
  switch (channel) {
    case "みえる":
      return "https://www.youtube.com/@himeno-mieru";
    case "メエ":
      return "https://www.youtube.com/@mamimu-meh";
    case "パリン":
      return "https://www.youtube.com/@wao-parin";
    case "たいむ":
      return "https://www.youtube.com/@rindou-time";
    case "部":
      return "https://www.youtube.com/@aikatsu-academy";
    default:
      return "";
  }
};
