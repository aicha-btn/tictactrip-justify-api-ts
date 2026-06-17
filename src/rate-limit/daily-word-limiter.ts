import { DAILY_WORD_LIMIT } from "../config.js";

export interface RateLimitResult {
  accepted: boolean;
  consumedWords: number;
  remainingWords: number;
  resetDate: string;
}

interface TokenUsage {
  day: string;
  words: number;
}

export class DailyWordLimiter {
  private readonly usageByToken = new Map<string, TokenUsage>();

  constructor(private readonly dailyLimit = DAILY_WORD_LIMIT) {}

  consume(token: string, words: number, now = new Date()): RateLimitResult {
    const resetDate = toUtcDateKey(now);
    const currentUsage = this.getUsageForToday(token, resetDate);
    const nextUsage = currentUsage.words + words;

    if (nextUsage > this.dailyLimit) {
      return {
        accepted: false,
        consumedWords: currentUsage.words,
        remainingWords: Math.max(0, this.dailyLimit - currentUsage.words),
        resetDate,
      };
    }

    this.usageByToken.set(token, {
      day: resetDate,
      words: nextUsage,
    });

    return {
      accepted: true,
      consumedWords: nextUsage,
      remainingWords: this.dailyLimit - nextUsage,
      resetDate,
    };
  }

  private getUsageForToday(token: string, day: string): TokenUsage {
    const usage = this.usageByToken.get(token);

    if (usage === undefined || usage.day !== day) {
      return { day, words: 0 };
    }

    return usage;
  }
}

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
