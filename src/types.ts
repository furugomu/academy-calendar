export type Member = "みえる" | "メエ" | "パリン" | "たいむ";
export type Channel = "みえる" | "メエ" | "パリン" | "たいむ" | "部" | "他";
export type Entry = {
  /** 開始時刻 (UTC) */
  startAt: Date;
  /** 参加するメンバーの名前 */
  members: Member[];
  /** 配信するチャンネルの名前 */
  channels: Channel[];
  /** スケジュールのタイトル */
  title: string;
  /** 終日または時間指定 */
  scheduleType: "date" | "date-time";
};
