export interface FeatureItem {
  feature: string;
  key: string;
}

/**
 * Builds stable React keys for feature lists while preserving duplicate labels.
 *
 * @param features - Product feature labels in render order.
 * @returns Feature labels paired with duplicate-safe keys.
 */
export function buildFeatureItems(features: readonly string[]): FeatureItem[] {
  const occurrenceCounts = new Map<string, number>();

  return features.map((feature) => {
    const occurrence = occurrenceCounts.get(feature) ?? 0;
    occurrenceCounts.set(feature, occurrence + 1);

    return {
      feature,
      key: `${feature.length}:${feature}:${occurrence}`,
    };
  });
}
