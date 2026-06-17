import { describe, it, expect } from "vitest";
import { calculateSrs, getNextReviewDate, getStatus } from "@malay/shared";

describe("calculateSrs", () => {
  it("should reset on fail (grade < 3)", () => {
    const result = calculateSrs({ repetitions: 5, easeFactor: 250, interval: 30 }, 1);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });

  it("should increase interval on good (grade >= 3)", () => {
    const result = calculateSrs({ repetitions: 2, easeFactor: 250, interval: 6 }, 4);
    expect(result.repetitions).toBe(3);
    expect(result.interval).toBeGreaterThanOrEqual(6);
  });

  it("should set interval to 1 on first correct", () => {
    const result = calculateSrs({ repetitions: 0, easeFactor: 250, interval: 0 }, 4);
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
  });

  it("should set interval to 6 on second correct", () => {
    const result = calculateSrs({ repetitions: 1, easeFactor: 250, interval: 1 }, 4);
    expect(result.repetitions).toBe(2);
    expect(result.interval).toBe(6);
  });

  it("should never decrease ease factor below 1.3", () => {
    const result = calculateSrs({ repetitions: 0, easeFactor: 130, interval: 0 }, 1);
    expect(result.easeFactor).toBeGreaterThanOrEqual(130);
  });

  it("should adjust ease factor based on grade", () => {
    const perfect = calculateSrs({ repetitions: 0, easeFactor: 250, interval: 0 }, 5);
    const good = calculateSrs({ repetitions: 0, easeFactor: 250, interval: 0 }, 4);
    expect(perfect.easeFactor).toBeGreaterThanOrEqual(good.easeFactor);
  });
});

describe("getNextReviewDate", () => {
  it("should return a date string in YYYY-MM-DD format", () => {
    const date = getNextReviewDate(1);
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should return future date for positive interval", () => {
    const date = getNextReviewDate(7);
    const today = new Date().toISOString().split("T")[0];
    expect(date > today).toBe(true);
  });
});

describe("getStatus", () => {
  it("should return 'new' for zero repetitions", () => {
    expect(getStatus(0, 0)).toBe("new");
  });

  it("should return 'learning' for repetitions < 3", () => {
    expect(getStatus(2, 6)).toBe("learning");
  });

  it("should return 'familiar' for reps >= 3 and interval < 21", () => {
    expect(getStatus(3, 7)).toBe("familiar");
  });

  it("should return 'mastered' for reps >= 3 and interval >= 21", () => {
    expect(getStatus(3, 21)).toBe("mastered");
  });
});
