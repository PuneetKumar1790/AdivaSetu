import { EligibilityFactor, EligibilityQuery, EligibilityResult } from '../types';

export const mockEligibilityService = {
  evaluateEligibility(query: Partial<EligibilityQuery>): EligibilityResult {
    const factors: EligibilityFactor[] = [];
    let passedCount = 0;
    const totalFactors = 5;

    // 1. ST Category
    const isST = query.category === 'ST' || query.category === 'Scheduled Tribe';
    factors.push({
      factor: 'ST Category Requirement',
      satisfied: isST,
      notes: isST
        ? 'Scheduled Tribe category affirmed. Requires competent authority certificate.'
        : 'Only Scheduled Tribe (ST) applicants are eligible under MoTA schemes.',
    });
    if (isST) passedCount++;

    // 2. Academic Performance
    const pct = query.percentage || 75;
    const isAcademicPass = pct >= 55;
    factors.push({
      factor: 'Academic Criterion (Min. 55%)',
      satisfied: isAcademicPass,
      notes: isAcademicPass
        ? `Academic score of ${pct}% satisfies Master's/Qualifying requirement (≥ 55%).`
        : `Academic score of ${pct}% falls below the mandatory 55% threshold.`,
    });
    if (isAcademicPass) passedCount++;

    // 3. Family Income Criterion
    const income = query.annualIncome || 240000;
    const isIncomePass = income <= 600000;
    factors.push({
      factor: 'Family Income Ceiling (≤ ₹6.0 Lakh)',
      satisfied: isIncomePass,
      notes: isIncomePass
        ? `Annual income ₹${income.toLocaleString('en-IN')} is within the prescribed ₹6,00,000 threshold.`
        : `Annual income ₹${income.toLocaleString('en-IN')} exceeds the standard ₹6,00,000 ceiling.`,
    });
    if (isIncomePass) passedCount++;

    // 4. Enrolment / Admission Status
    const isEnrolled = query.admissionStatus !== 'Not Applied';
    factors.push({
      factor: 'Programme Enrolment & Institution Fit',
      satisfied: isEnrolled,
      notes: isEnrolled
        ? `Enrolled or admitted in recognized university/institute (${query.institution || 'University'}).`
        : 'Valid admission or registration in a UGC/Govt recognized institution is mandatory.',
    });
    if (isEnrolled) passedCount++;

    // 5. Age Requirement
    const age = query.age || 26;
    const isAgePass = age <= 36;
    factors.push({
      factor: 'Age Limit Criterion (≤ 36 Years)',
      satisfied: isAgePass,
      notes: isAgePass
        ? `Candidate age of ${age} years meets the age guidelines as of cut-off date.`
        : `Candidate age of ${age} years exceeds the maximum age limit of 36 years.`,
    });
    if (isAgePass) passedCount++;

    const isLikelyEligible = passedCount >= 4;
    const confidence = isLikelyEligible ? 94 : Math.round((passedCount / totalFactors) * 85);

    const matchedSchemes = [];
    if (query.studyDestination === 'Overseas') {
      matchedSchemes.push('National Overseas Scholarship for ST Students (NOS)');
    } else {
      matchedSchemes.push('National Fellowship for Scheduled Tribes (NFST)');
      if (pct >= 80) {
        matchedSchemes.push('Top Class Education Scheme for ST Students');
      }
    }

    return {
      isLikelyEligible,
      confidence,
      verdict: isLikelyEligible
        ? 'Likely Eligible'
        : passedCount >= 3
        ? 'Conditional Eligibility'
        : 'Not Eligible',
      factors,
      matchedSchemes,
      disclaimer:
        'AI decision-support estimate based on self-reported inputs. Final eligibility will be officially determined during document scrutiny by the Ministry of Tribal Affairs.',
    };
  },
};
