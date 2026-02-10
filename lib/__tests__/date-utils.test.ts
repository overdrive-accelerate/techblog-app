import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDate, formatDistanceToNow } from "../date-utils";

describe("date-utils", () => {
    describe("formatDate", () => {
        it("formats a date string correctly", () => {
            const date = "2024-01-15T10:30:00.000Z";
            const result = formatDate(date);
            expect(result).toBe("January 15, 2024");
        });

        it("formats a Date object correctly", () => {
            const date = new Date("2024-01-15T10:30:00.000Z");
            const result = formatDate(date);
            expect(result).toBe("January 15, 2024");
        });

        it("handles different months", () => {
            const date = "2024-12-25T10:30:00.000Z";
            const result = formatDate(date);
            expect(result).toBe("December 25, 2024");
        });
    });

    describe("formatDistanceToNow", () => {
        beforeEach(() => {
            // Mock the current time to 2024-01-15 12:00:00
            vi.useFakeTimers();
            vi.setSystemTime(new Date("2024-01-15T12:00:00.000Z"));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('returns "just now" for dates less than 60 seconds ago', () => {
            const date = new Date("2024-01-15T11:59:30.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("just now");
        });

        it("returns minutes for dates less than 60 minutes ago", () => {
            const date = new Date("2024-01-15T11:45:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("15 minutes ago");
        });

        it("returns singular minute for 1 minute ago", () => {
            const date = new Date("2024-01-15T11:59:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("1 minute ago");
        });

        it("returns hours for dates less than 24 hours ago", () => {
            const date = new Date("2024-01-15T09:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("3 hours ago");
        });

        it("returns singular hour for 1 hour ago", () => {
            const date = new Date("2024-01-15T11:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("1 hour ago");
        });

        it("returns days for dates less than 30 days ago", () => {
            const date = new Date("2024-01-10T12:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("5 days ago");
        });

        it("returns singular day for 1 day ago", () => {
            const date = new Date("2024-01-14T12:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("1 day ago");
        });

        it("returns months for dates less than 12 months ago", () => {
            const date = new Date("2023-11-15T12:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("2 months ago");
        });

        it("returns singular month for 1 month ago", () => {
            const date = new Date("2023-12-15T12:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("1 month ago");
        });

        it("returns years for dates more than 12 months ago", () => {
            const date = new Date("2022-01-15T12:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("2 years ago");
        });

        it("returns singular year for 1 year ago", () => {
            const date = new Date("2023-01-15T12:00:00.000Z");
            const result = formatDistanceToNow(date);
            expect(result).toBe("1 year ago");
        });

        it("handles string dates", () => {
            const date = "2024-01-15T11:45:00.000Z";
            const result = formatDistanceToNow(date);
            expect(result).toBe("15 minutes ago");
        });
    });
});
