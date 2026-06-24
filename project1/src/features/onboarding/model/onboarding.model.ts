export interface OnboardingProfile {
  location: string;
  displayName: string;
}

export type OnboardingStep = "location" | "name";

export function hasRequiredValue(value: string) {
  return value.trim().length > 0;
}
