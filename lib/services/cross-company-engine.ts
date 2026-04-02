/**
 * Cross-Company Engine — Phase 5
 *
 * Manages cross-company events: alumni references, competitive pressure,
 * partnership mentions, and market shifts. Characters from Company A
 * naturally reference Company B in emails and conversations.
 */

import type { CrossCompanyReference, SimDomain } from '../types';

// ── Built-in Cross-Company Relationships ────────────────────────────────────

export const CROSS_COMPANY_RELATIONSHIPS: CrossCompanyReference[] = [
  // Technology sector — competitive dynamics
  {
    sourceCompanyId: 'nexus-technologies',
    targetCompanyId: 'orbit-layer',
    characterId: 'tom',
    eventType: 'competitive_pressure',
    messageTemplate: "By the way — I heard Orbit Layer just closed a big enterprise deal with SSO as the differentiator. They're moving fast in this space.",
    triggerCondition: { minElapsedSeconds: 300, minTrust: 0.55 },
  },
  {
    sourceCompanyId: 'nexus-technologies',
    targetCompanyId: 'brightforge-systems',
    characterId: 'marcus',
    eventType: 'alumni_reference',
    messageTemplate: "My former colleague at Brightforge went through a similar SSO integration last quarter. WorkOS was their choice too — shipped in 10 days.",
    triggerCondition: { minElapsedSeconds: 400, minTrust: 0.65 },
  },

  // Consulting sector — alumni network
  {
    sourceCompanyId: 'crestline-advisory',
    targetCompanyId: 'beacon-mercer',
    characterId: 'james',
    eventType: 'alumni_reference',
    messageTemplate: "I was at Beacon Mercer before joining Crestline. Different culture entirely — more structured, less entrepreneurial. But they taught me how to run a tight engagement.",
    triggerCondition: { minElapsedSeconds: 350, minTrust: 0.60 },
  },
  {
    sourceCompanyId: 'crestline-advisory',
    targetCompanyId: 'elm-quarry',
    characterId: 'lucy',
    eventType: 'competitive_pressure',
    messageTemplate: "Elm & Quarry pitched the same client last month with a lower fee structure. We won on methodology quality, but the pricing pressure is real.",
    triggerCondition: { minElapsedSeconds: 450, minTrust: 0.55 },
  },

  // Financial services — market dynamics
  {
    sourceCompanyId: 'silverline-capital',
    targetCompanyId: 'harborside-finance',
    characterId: 'victoria',
    eventType: 'market_shift',
    messageTemplate: "Harborside Finance just announced a new ESG analytics platform. If they move into our credit analytics space, we need to be ready.",
    triggerCondition: { minElapsedSeconds: 400, minTrust: 0.50 },
  },

  // Consumer goods — partnership
  {
    sourceCompanyId: 'verve-market',
    targetCompanyId: 'meadow-main',
    characterId: 'sophia',
    eventType: 'partnership',
    messageTemplate: "Meadow & Main reached out about a joint seasonal campaign. Their brand aligns well with our DTC positioning — could be worth exploring.",
    triggerCondition: { minElapsedSeconds: 350, minTrust: 0.60 },
  },

  // Healthcare — regulatory dynamics
  {
    sourceCompanyId: 'novacare-labs',
    targetCompanyId: 'clearpath-health',
    characterId: 'dr_chen',
    eventType: 'market_shift',
    messageTemplate: "Clearpath Health just received FDA fast-track designation for their diagnostic platform. The regulatory landscape is shifting — we need to accelerate our own submission.",
    triggerCondition: { minElapsedSeconds: 300, minTrust: 0.55 },
  },

  // Cross-industry — alumni moves
  {
    sourceCompanyId: 'orbit-layer',
    targetCompanyId: 'nexus-technologies',
    characterId: 'alex',
    eventType: 'alumni_reference',
    messageTemplate: "I know someone at Nexus Technologies who dealt with exactly this kind of roadmap crisis. They solved it by bringing in a third-party integration — saved them weeks.",
    triggerCondition: { minElapsedSeconds: 400, minTrust: 0.65 },
  },
  {
    sourceCompanyId: 'brightforge-systems',
    targetCompanyId: 'silverline-capital',
    characterId: 'maya',
    eventType: 'partnership',
    messageTemplate: "Silverline Capital is using our API for their risk calculations. If we break backward compatibility in v3, they'll be affected. Worth flagging before we scope the migration.",
    triggerCondition: { minElapsedSeconds: 350, minTrust: 0.55 },
  },
];

/**
 * Get applicable cross-company references for a given session state.
 */
export function getApplicableCrossCompanyEvents(
  companyId: string,
  elapsedSeconds: number,
  characterTrust: Record<string, number>,
  firedEventIds: string[],
): CrossCompanyReference[] {
  return CROSS_COMPANY_RELATIONSHIPS.filter(ref => {
    if (ref.sourceCompanyId !== companyId) return false;
    if (firedEventIds.includes(`${ref.sourceCompanyId}-${ref.targetCompanyId}-${ref.eventType}`)) return false;
    if (elapsedSeconds < (ref.triggerCondition.minElapsedSeconds ?? 0)) return false;
    const trust = characterTrust[ref.characterId] ?? 0.5;
    if (trust < (ref.triggerCondition.minTrust ?? 0)) return false;
    return true;
  });
}

/**
 * Generate a cross-company event ID for deduplication.
 */
export function crossCompanyEventId(ref: CrossCompanyReference): string {
  return `${ref.sourceCompanyId}-${ref.targetCompanyId}-${ref.eventType}`;
}

/**
 * Get all companies that have relationships with a given company.
 */
export function getRelatedCompanies(companyId: string): string[] {
  const related = new Set<string>();
  for (const ref of CROSS_COMPANY_RELATIONSHIPS) {
    if (ref.sourceCompanyId === companyId) related.add(ref.targetCompanyId);
    if (ref.targetCompanyId === companyId) related.add(ref.sourceCompanyId);
  }
  return [...related];
}
