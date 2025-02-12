import { Hono } from "hono";
import { fetchSchedule } from "./fetch";
import { parseSchedule } from "./parse";
import { generateCalendar } from "./calendar";
import { findIdolById } from "./idols";

const app = new Hono<{ Bindings: Env }>();
export default app;

app.get("/", async (c) => {
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
  const idol = findIdolById(id);
  if (!idol) return c.text("not found", 404);
  const html = await fetchSchedule(c.env);
  const entries = parseSchedule(html);
  const calendar = await generateCalendar(entries, idol);
  return c.body(calendar, 200, { "content-type": "text/calendar" });
});
