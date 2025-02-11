import { Document, Element, Window } from "happy-dom";
import type { Member, Channel, Entry } from "./types";

export const parse = (html: string): Entry[] => {
  const window = new Window();
  const document = window.document;
  document.documentElement.innerHTML = html;
  const months = selectMonths(document);
  const divs = selectContents(document);
  const allEntries: Entry[] = [];
  for (const [month, div] of zip(months, divs)) {
    if (!div) continue;
    const entries = parseEntries(div, month);
    allEntries.push(...entries);
  }
  return allEntries;
};

type YM = { year: number; month: number };

// 各月の見出し
const selectMonths = (doc: Document | Element): YM[] => {
  // 最初のswiper
  const swiper = doc.querySelector(".swiper-container");
  if (!swiper) throw new Error("swiper-container not found");
  // slideに月が入っている
  const slides = swiper.querySelectorAll(".swiper-slide");
  // 2025.1
  return Array.from(slides).map((slide) => {
    const text = slide.textContent;
    if (!text) throw new Error("slide text not found");
    const [year, month] = text.split(".");
    return { year: Number(year), month: Number(month) };
  });
};

// 各月のスケジュール一覧
const selectContents = (doc: Document): Element[] => {
  // 2番目のswiper
  const swiper = doc.querySelectorAll(".swiper-container")[1];
  if (!swiper) throw new Error("swiper-container not found");
  // slideに月が入っている
  const slides = swiper.querySelectorAll(".swiper-slide");
  return Array.from(slides);
};

const parseEntries = (root: Element, { year, month }: YM): Entry[] => {
  const entries: Entry[] = [];
  // 1日ずつ
  for (const dayContainer of root.querySelectorAll(".p-schedule-body__item")) {
    // .dataに日付が入っている。dateの間違いじゃない？
    const day = dayContainer.querySelector(".data > .num")?.textContent;
    if (!day) {
      console.error("day not found", dayContainer.outerHTML);
      continue;
    }

    // 1日に複数のスケジュールがある
    const posts = dayContainer.querySelectorAll(".post__item");
    for (const post of posts) {
      try {
        entries.push(parseEntry(post, { year, month, day: Number(day) }));
      } catch (e) {
        console.error(e, post.outerHTML);
      }
    }
  }
  return entries;
};

type YMD = { year: number; month: number; day: number };
const parseEntry = (post: Element, { year, month, day }: YMD): Entry => {
  const channels = detectChannels(post);
  const members = detectMembers(post);
  const text = post.querySelector("p")?.textContent;
  if (!text) throw new Error("p not found");
  // 12:00〜 みえる個人配信
  // 17:00- にじさんじ”さんコラボリレー配信
  const m = /([0-9]+):([0-9]+)[-〜～]?\s*(.+)/.exec(text);
  if (m) {
    const hour = Number(m[1]);
    const minute = Number(m[2]);
    const title = m[3] || "";
    const startAt = new Date(
      Date.UTC(
        year,
        month - 1,
        Number(day),
        hour - 9, // Asia/Tokyo -> UTC
        minute
      )
    );
    return { startAt, members, channels, title, scheduleType: "date-time" };
  } else {
    const title = text;
    const startAt = new Date(year, month - 1, day);
    return { startAt, members, channels, title, scheduleType: "date" };
  }
};

const detectChannels = (el: Element): Channel[] => {
  // catにyoutubeがなければ他
  const cat = el.querySelector(".cat");
  if (cat && !cat.classList.contains("youtube")) return ["他"];

  const text = el.textContent;
  if (!text) return ["他"];
  // Member のうち最初に現れるものを返す
  const m = /みえる|メエ|パリン|たいむ/.exec(text);
  if (m) return [m[0]] as Channel[];
  // 全員
  if (text.includes("全員")) return ["みえる", "メエ", "パリン", "たいむ"];
  // 部
  // フレッシュアイドルフェス等はどうなっていた？
  if (text.includes("配信部") || text.includes("デミカツ通信")) return ["部"];
  return ["他"];
};

const detectMembers = (el: Element): Member[] => {
  const all = ["みえる", "メエ", "パリン", "たいむ"] as const;
  const text = el.textContent;
  if (!text) return [];
  if (text.includes("全員")) return [...all];

  const members: Member[] = [];
  if (text.includes("みえる")) members.push("みえる");
  if (text.includes("メエ")) members.push("メエ");
  if (text.includes("パリン")) members.push("パリン");
  if (text.includes("たいむ")) members.push("たいむ");
  // 空だったらたぶん全員
  if (members.length === 0) return [...all];
  return members;
};

const zip = <T, U>(a: T[], b: U[]): [T, U | undefined][] => {
  return a.map((v, i) => [v, b[i]]);
};
