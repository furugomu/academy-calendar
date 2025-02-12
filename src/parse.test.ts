import { describe, test, expect } from "vitest";
import { parseSchedule } from "./parse";
import { readFile } from "node:fs/promises";

describe(parseSchedule.name, () => {
  test("schedule-2025-01.html", async () => {
    const html = await readFile("test/fixtures/schedule-2025-01.html", "utf-8");
    const entries = parseSchedule(html);
    expect(entries).toMatchSnapshot();
  });

  test("schedule-2025-02.html", async () => {
    const html = await readFile("test/fixtures/schedule-2025-02.html", "utf-8");
    const entries = parseSchedule(html);
    expect(entries).toMatchSnapshot();
  });
});
