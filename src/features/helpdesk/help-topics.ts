// Plain data (no mongoose) so client components can import it.
export const HELP_TOPICS = ["Registration", "Payment", "Teams", "Accommodation", "Event rules", "Account", "Other"] as const;
export type HelpTopic = (typeof HELP_TOPICS)[number];
