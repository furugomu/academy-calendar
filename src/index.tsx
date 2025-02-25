import { Hono } from "hono";
import { generateCalendar } from "./calendar";
import { fetchSchedule } from "./fetch";
import { findIdolById } from "./idols";
import { parseSchedule } from "./parse";
import { Root } from "./Root";

const app = new Hono<{ Bindings: Env }>();
export default app;

app.get("/", async (c) => {
  return c.html(<Root />);
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
