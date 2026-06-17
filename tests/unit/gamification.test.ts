import { describe, it, expect } from "vitest";
import { calculateLevel, getXpForLevel } from "@malay/shared";

describe("calculateLevel", () => {
  it("should return 0 for 0 XP", () => {
    expect(calculateLevel(0)).toBe(0);
  });

  it("should return 1 for 100 XP", () => {
    expect(calculateLevel(100)).toBe(1);
  });

  it("should return 2 for 400 XP", () => {
    expect(calculateLevel(400)).toBe(2);
  });

  it("should return 10 for 10000 XP", () => {
    expect(calculateLevel(10000)).toBe(10);
  });
});

describe("getXpForLevel", () => {
  it("should return 0 for level 0", () => {
    expect(getXpForLevel(0)).toBe(0);
  });

  it("should return 100 for level 1", () => {
    expect(getXpForLevel(1)).toBe(100);
  });

  it("should return 400 for level 2", () => {
    expect(getXpForLevel(2)).toBe(400);
  });
});
