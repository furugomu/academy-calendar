import { type Channel, type Idol } from "./idols";

export type Entry = {
  /** 開始時刻 (UTC) */
  startAt: Date;
  /** 参加するアイドル */
  idols: Idol[];
  /** 配信するチャンネル */
  channels: Channel[];
  /** スケジュールのタイトル */
  title: string;
  /** 終日または時間指定 */
  scheduleType: "date" | "date-time";
};
