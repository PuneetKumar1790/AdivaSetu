import { AIScrutinyReport, Application } from '../types';

export const mockAIScrutinyService = {
  analyzeApplication(app: Application): AIScrutinyReport {
    // If has unresolved deficiencies
    const openDeficiencies = app.deficiencies.filter((d) => d.status === 'open');
    if (openDeficiencies.length > 0) {
      return {
        overallConfidence: 78.4,
        eligibilityDecision: 'FLAG',
        documentCompleteness: 100,
        consistencyScore: 92.0,
        anomalyIndicator: 'Medium',
        duplicateIndicator: 'Low',
        riskFlags: {
          critical: 0,
          informational: openDeficiencies.length,
          details: openDeficiencies.map((d) => `${d.documentName}: ${d.issue}`),
        },
        recommendation: 'Deficiencies detected',
        recommendationDetails:
          '1 document requires applicant replacement due to validity expiration. Academic criteria and caste certificate verified successfully.',
        processedAt: new Date().toISOString(),
      };
    }

    // Fully verified
    return {
      overallConfidence: 96.4,
      eligibilityDecision: 'PASS',
      documentCompleteness: 100,
      consistencyScore: 98.6,
      anomalyIndicator: 'Low',
      duplicateIndicator: 'Low',
      riskFlags: {
        critical: 0,
        informational: 0,
        details: [],
      },
      recommendation: 'Recommend for human approval',
      recommendationDetails:
        'All mandatory documents are present and digitally authenticated. Extracted identity and academic details are 100% consistent across submitted documents. No anomaly or duplicate indicators detected.',
      processedAt: new Date().toISOString(),
    };
  },
};
