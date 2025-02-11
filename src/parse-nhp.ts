import { parse, type HTMLElement } from "node-html-parser";
import type { Entry } from "./types";
import {
  findIdolByName,
  allIdols,
  meh,
  mieru,
  parin,
  taimu,
  type Idol,
  bu,
  findChannelByName,
  type Channel,
} from "./idols";

export const parseSchedule = (html: string): Entry[] => {
  const root = parse(html);
  const months = selectMonths(root);
  const divs = selectContents(root);
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
const selectMonths = (doc: HTMLElement): YM[] => {
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
const selectContents = (doc: HTMLElement): HTMLElement[] => {
  // 2番目のswiper
  const swiper = doc.querySelectorAll(".swiper-container")[1];
  if (!swiper) throw new Error("swiper-container not found");
  // slideに月が入っている
  const slides = swiper.querySelectorAll(".swiper-slide");
  return Array.from(slides);
};

const parseEntries = (root: HTMLElement, { year, month }: YM): Entry[] => {
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
const parseEntry = (post: HTMLElement, { year, month, day }: YMD): Entry => {
  const channels = detectChannels(post);
  const idols = detectIdols(post);
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
    return { startAt, idols, channels, title, scheduleType: "date-time" };
  } else {
    const title = text;
    const startAt = new Date(year, month - 1, day);
    return { startAt, idols, channels, title, scheduleType: "date" };
  }
};

const detectChannels = (el: HTMLElement): Channel[] => {
  // catにyoutubeがなければ配信ではない
  const cat = el.querySelector(".cat");
  if (cat && !cat.classList.contains("youtube")) return [];

  const text = el.textContent;
  if (!text) return [];
  // Channel のうち最初に現れるものを返す
  // TODO: 同時配信だったら全員返したい (21:00〜 みえる・メエ同時配信, 18:00〜 パリンたいむ同時配信)
  const m = /みえる|メエ|パリン|たいむ/.exec(text);
  if (m) {
    const c = findChannelByName(m[0]);
    if (c) return [c];
  }
  // 全員
  if (text.includes("全員")) return allIdols;
  // 部
  if (text.includes("配信部") || text.includes("デミカツ通信")) return [bu];
  return [];
};

const detectIdols = (el: HTMLElement): Idol[] => {
  const text = el.textContent;
  if (!text) return [];
  if (text.includes("全員")) return allIdols;

  const idols: Idol[] = [];
  if (text.includes("みえる")) idols.push(mieru);
  if (text.includes("メエ")) idols.push(meh);
  if (text.includes("パリン")) idols.push(parin);
  if (text.includes("たいむ")) idols.push(taimu);
  // 空だったらたぶん全員
  if (idols.length === 0) return allIdols;
  return idols;
};

const zip = <T, U>(a: T[], b: U[]): [T, U | undefined][] => {
  return a.map((v, i) => [v, b[i]]);
};
