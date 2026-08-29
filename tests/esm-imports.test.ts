import { describe, expect, test } from "bun:test";
import { Glob } from "bun";

// Node ESM needs explicit ".js" on relative imports. Bun resolves without it,
// so a missing extension only fails for npm consumers (issue #11).
describe("ESM import extensions", () => {
  test("every relative import in src ends with .js", async () => {
    const offenders: string[] = [];
    for (const path of new Glob("**/*.ts").scanSync("src")) {
      const text = await Bun.file(`src/${path}`).text();
      for (const m of text.matchAll(/from\s+["'](\.\.?\/[^"']+)["']/g)) {
        if (!m[1].endsWith(".js")) offenders.push(`${path}: ${m[1]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
