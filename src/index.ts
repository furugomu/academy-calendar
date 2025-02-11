import { Hono } from "hono";
import type { Member } from "./types";
import { fetchSchedule } from "./fetch";
import { parseSchedule } from "./parse-nhp";
import { generateCalendar } from "./calendar";

const app = new Hono<{ Bindings: Env }>();
export default app;

app.get("/", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>アイカツアカデミー スケジュール</title>
  <body>
    <h1>アイカツアカデミー スケジュール</h1>
    <p>試験運用中。</p>
    <p><a href="https://calendar.google.com/calendar/r/settings/addbyurl">Google カレンダーに追加</a>などして使ってください。</p>
    <ul>
      <li><a href="/mieru">みえる</a></li>
      <li><a href="/meh">メエ</a></li>
      <li><a href="/parin">パリン</a></li>
      <li><a href="/taimu">たいむ</a></li>
    </ul>
  </body>
</html>
    `);
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();
  const member = findMember(id);
  if (!member) return c.text("not found", 404);
  const html = await fetchSchedule(c.env);
  const entries = parseSchedule(html);
  const calendar = await generateCalendar(entries, member);
  return c.body(calendar, 200, { "content-type": "text/calendar" });
});

const findMember = (id: string): Member | null => {
  switch (id) {
    case "mieru":
      return "みえる";
    case "meh":
      return "メエ";
    case "parin":
      return "パリン";
    case "taimu":
      return "たいむ";
    default:
      return null;
  }
};
