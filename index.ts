import { readFile } from "node:fs/promises";
import { parse } from "./src/parse.ts";
import { generateCalendar } from "./src/calendar.ts";

const main = async () => {
  const html = await readFile("./schedule-2025-02.html", { encoding: "utf-8" });
  const entries = parse(html);
  // console.debug(entries);
  const calendar = await generateCalendar(entries, "みえる");
  console.log(calendar);
};
main();
