import { EligibilityFactor, EligibilityQuery, EligibilityResult, Scheme } from '../types';
import { browserDb } from './db/browserDb';

export const mockEligibilityService = {
  evaluateEligibility(query: Partial<EligibilityQuery>, targetScheme?: Scheme): EligibilityResult {
    const factors: EligibilityFactor[] = [];
    let passedCount = 0;

    const scheme = targetScheme || browserDb.getSchemeByCode('NFST') || browserDb.getSchemes()[0];
    const incomeCeiling = scheme?.maxIncomeCeiling || 600000;
    const minMarks = scheme?.minPercentage || 55;
    const maxAge = scheme?.maxAgeLimit || 36;
    const isOverseasScheme = scheme?.category === 'overseas';

    // 1. ST Category Mandate
    const isST = query.category === 'ST' || query.category === 'Scheduled Tribe';
    factors.push({
      factor: 'Scheduled Tribe (ST) Statutory Requirement',
      satisfied: isST,
      notes: isST
        ? 'Scheduled Tribe category affirmed. Competent authority caste certificate required.'
        : 'Candidate does not belong to ST category. MoTA fellowship schemes are strictly reserved for ST scholars.',
    });
    if (isST) passedCount++;

    // 2. Academic Criteria
    const pct = query.percentage || 75;
    const isAcademicPass = pct >= minMarks;
    factors.push({
      factor: `Academic Qualifying Merit (Min. ${minMarks}% for ${scheme.code})`,
      satisfied: isAcademicPass,
      notes: isAcademicPass
        ? `Academic score of ${pct}% satisfies the prescribed ${minMarks}% minimum threshold.`
        : `Academic score of ${pct}% falls below the mandatory ${minMarks}% threshold under ${scheme.code} rules.`,
    });
    if (isAcademicPass) passedCount++;

    // 3. Family Income Ceiling
    const income = query.annualIncome || 240000;
    const isIncomePass = income <= incomeCeiling;
    factors.push({
      factor: `Annual Family Income Ceiling (<= ₹${(incomeCeiling / 100000).toFixed(1)} Lakh for ${scheme.code})`,
      satisfied: isIncomePass,
      notes: isIncomePass
        ? `Annual family income ₹${income.toLocaleString('en-IN')} is within the prescribed ₹${incomeCeiling.toLocaleString('en-IN')} statutory limit.`
        : `Annual family income ₹${income.toLocaleString('en-IN')} exceeds the ${scheme.code} statutory ceiling of ₹${incomeCeiling.toLocaleString('en-IN')}.`,
    });
    if (isIncomePass) passedCount++;

    // 4. Age Limit
    const age = query.age || 26;
    const isAgePass = age <= maxAge;
    factors.push({
      factor: `Candidate Age Limit (<= ${maxAge} Years for ${scheme.code})`,
      satisfied: isAgePass,
      notes: isAgePass
        ? `Candidate age (${age} years) satisfies statutory age criteria as of cut-off date.`
        : `Candidate age (${age} years) exceeds the maximum age limit of ${maxAge} years.`,
    });
    if (isAgePass) passedCount++;

    // 5. Study Destination & Enrolment Fit
    const destination = query.studyDestination || 'Domestic';
    const isDestinationPass = isOverseasScheme ? destination === 'Overseas' : destination === 'Domestic';
    factors.push({
      factor: `Study Destination & Programme Fit (${isOverseasScheme ? 'Top 1000 QS Foreign University' : 'Recognized Indian University'})`,
      satisfied: isDestinationPass,
      notes: isDestinationPass
        ? `Study destination (${destination}) aligns with ${scheme.name} institutional guidelines.`
        : `Destination mismatch: ${scheme.code} requires ${isOverseasScheme ? 'Overseas admission' : 'Domestic Indian university admission'}.`,
    });
    if (isDestinationPass) passedCount++;

    const totalFactors = factors.length;
    const isLikelyEligible = passedCount === totalFactors;
    const confidence = isLikelyEligible ? 96 : Math.round((passedCount / totalFactors) * 85);

    // Dynamic Matched Schemes
    const allSchemes = browserDb.getSchemes();
    const matchedSchemes: string[] = [];

    allSchemes.forEach((s) => {
      const matchCat = isST;
      const matchInc = income <= (s.maxIncomeCeiling || 600000);
      const matchPct = pct >= (s.minPercentage || 50);
      const matchAge = age <= (s.maxAgeLimit || 36);
      const matchDest = s.category === 'overseas' ? destination === 'Overseas' : destination === 'Domestic';

      if (matchCat && matchInc && matchPct && matchAge && matchDest) {
        matchedSchemes.push(`${s.name} (${s.code})`);
      }
    });

    return {
      isLikelyEligible,
      confidence,
      verdict: isLikelyEligible
        ? 'Likely Eligible'
        : passedCount >= 3
        ? 'Conditional Eligibility'
        : 'Not Eligible',
      factors,
      matchedSchemes: matchedSchemes.length > 0 ? matchedSchemes : [`${scheme.name} (${scheme.code})`],
      disclaimer:
        'AI decision-support analysis based on real-time statutory scheme rules. Official eligibility will be determined upon document scrutiny under Rule 14(b) by the Ministry of Tribal Affairs.',
    };
  },
};
