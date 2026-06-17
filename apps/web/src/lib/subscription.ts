import { auth } from "./auth";

export type Tier = "free" | "premium" | "enterprise";

interface FeatureAccess {
  maxLessons: number;
  maxSrsReviewsPerDay: number;
  maxConversationsPerWeek: number;
  hasGrammarTutor: boolean;
  hasOfflineDownloads: boolean;
  hasPronunciationScoring: boolean;
  hasDailyChallenges: boolean;
}

const features: Record<Tier, FeatureAccess> = {
  free: { maxLessons: 10, maxSrsReviewsPerDay: 5, maxConversationsPerWeek: 1, hasGrammarTutor: false, hasOfflineDownloads: false, hasPronunciationScoring: false, hasDailyChallenges: false },
  premium: { maxLessons: Infinity, maxSrsReviewsPerDay: Infinity, maxConversationsPerWeek: Infinity, hasGrammarTutor: true, hasOfflineDownloads: true, hasPronunciationScoring: true, hasDailyChallenges: true },
  enterprise: { maxLessons: Infinity, maxSrsReviewsPerDay: Infinity, maxConversationsPerWeek: Infinity, hasGrammarTutor: true, hasOfflineDownloads: true, hasPronunciationScoring: true, hasDailyChallenges: true },
};

export async function getUserTier(): Promise<Tier> {
  const session = await auth();
  return (session?.user as any)?.subscriptionTier ?? "free";
}

export function getFeatureAccess(tier: Tier): FeatureAccess {
  return features[tier];
}
