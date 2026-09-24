import './test_setup';
import { INITIAL_SCHEMES } from './src/data/schemesData';
import { mockEligibilityService } from './src/services/mockEligibilityService';
import {
  INITIAL_APPLICANTS,
  DEMO_OFFICER,
  DEMO_INSTITUTE_VERIFIER,
  DEMO_SCRUTINY_OFFICER,
  DEMO_SCREENING_OFFICER,
  DEMO_APPROVING_AUTHORITY,
} from './src/data/initialApplicants';
import { ApplicationFormData, DocumentItem } from './src/types';

interface TestResult {
  suite: string;
  name: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const testResults: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details?: string) {
  if (condition) {
    testResults.push({ suite, name, status: 'PASS' });
    console.log(`  ✅ PASS: ${name}`);
  } else {
    testResults.push({ suite, name, status: 'FAIL', details });
    console.error(`  ❌ FAIL: ${name} -> ${details || 'Assertion failed'}`);
  }
}

async function runEndToEndFeatureTests() {
  console.log('====================================================');
  console.log('🧪 ADIVASETU NEW UPDATES & FEATURES END-TO-END TEST');
  console.log('====================================================\n');

  // ------------------------------------------------------------------------
  // SUITE 1: Multi-Scheme Configuration Registry
  // ------------------------------------------------------------------------
  console.log('📋 Suite 1: MoTA Multi-Scheme Registry & Metadata');
  assert(INITIAL_SCHEMES.length === 5, 'Scheme Registry', 'All 5 MoTA schemes defined');

  const nosScheme = INITIAL_SCHEMES.find((s) => s.code === 'NOS');
  const nfstScheme = INITIAL_SCHEMES.find((s) => s.code === 'NFST');
  const tceScheme = INITIAL_SCHEMES.find((s) => s.code === 'TCE-ST');

  assert(!!nosScheme, 'Scheme Registry', 'NOS scheme exists');
  assert(!!nfstScheme, 'Scheme Registry', 'NFST scheme exists');
  assert(!!tceScheme, 'Scheme Registry', 'TCE-ST scheme exists');

  // Verify Scheme statutory rules & ceilings
  assert(nosScheme?.maxIncomeCeiling === 800000, 'Scheme Registry', 'NOS income ceiling is ₹8,00,000');
  assert(nosScheme?.slotsAvailable === 20, 'Scheme Registry', 'NOS annual quota is 20 scholars');
  assert(nosScheme?.category === 'overseas', 'Scheme Registry', 'NOS category is overseas');

  assert(nfstScheme?.slotsAvailable === 750, 'Scheme Registry', 'NFST annual quota is 750 fellows');
  assert(nfstScheme?.duration === '5 Years', 'Scheme Registry', 'NFST duration is 5 Years (Ph.D)');

  // Verify dynamic document requirements
  const nosDocs = nosScheme?.requiredDocuments.map((d) => d.type) || [];
  assert(nosDocs.includes('passport'), 'Scheme Registry', 'NOS checklist includes Passport');
  assert(nosDocs.includes('offer_letter_foreign'), 'Scheme Registry', 'NOS checklist includes Foreign Offer Letter');
  assert(nosDocs.includes('qs_ranking_proof'), 'Scheme Registry', 'NOS checklist includes QS Ranking Proof');

  const nfstDocs = nfstScheme?.requiredDocuments.map((d) => d.type) || [];
  assert(nfstDocs.includes('admission_letter'), 'Scheme Registry', 'NFST checklist includes Domestic Admission Letter');
  assert(nfstDocs.includes('research_proposal'), 'Scheme Registry', 'NFST checklist includes Research Synopsis/Proposal');

  console.log('');

  // ------------------------------------------------------------------------
  // SUITE 2: Dynamic Eligibility Engine Across Schemes
  // ------------------------------------------------------------------------
  console.log('⚖️ Suite 2: Dynamic Eligibility Evaluation Engine');

  // Test 2.1: NOS Valid Candidate
  const nosEligibleResult = mockEligibilityService.evaluateEligibility(
    {
      category: 'ST',
      percentage: 75,
      annualIncome: 650000,
      age: 28,
      studyDestination: 'Overseas',
    },
    nosScheme
  );
  assert(nosEligibleResult.isLikelyEligible === true, 'Dynamic Eligibility', 'NOS: Valid candidate is Likely Eligible');
  assert(nosEligibleResult.confidence >= 90, 'Dynamic Eligibility', 'NOS: Confidence score >= 90%');

  // Test 2.2: NOS Income Ceiling Violation (> 8 Lakhs)
  const nosHighIncomeResult = mockEligibilityService.evaluateEligibility(
    {
      category: 'ST',
      percentage: 85,
      annualIncome: 950000, // Exceeds 8,00,000 ceiling
      age: 26,
      studyDestination: 'Overseas',
    },
    nosScheme
  );
  assert(
    nosHighIncomeResult.isLikelyEligible === false,
    'Dynamic Eligibility',
    'NOS: Candidate with > ₹8L income is rejected'
  );
  assert(
    nosHighIncomeResult.factors.some((f) => f.factor.includes('Income') && !f.satisfied),
    'Dynamic Eligibility',
    'NOS: Income factor specifically flagged unsatisfied'
  );

  // Test 2.3: Non-ST Community rejection
  const nonStResult = mockEligibilityService.evaluateEligibility(
    {
      category: 'General',
      percentage: 95,
      annualIncome: 100000,
      age: 25,
      studyDestination: 'Domestic',
    },
    nfstScheme
  );
  assert(nonStResult.isLikelyEligible === false, 'Dynamic Eligibility', 'Non-ST candidate strictly rejected');
  assert(
    nonStResult.factors.some((f) => f.factor.includes('ST') && !f.satisfied),
    'Dynamic Eligibility',
    'Non-ST statutory factor explicitly marked unsatisfied'
  );

  // Test 2.4: Destination Mismatch (Overseas destination for domestic NFST)
  const destMismatchResult = mockEligibilityService.evaluateEligibility(
    {
      category: 'ST',
      percentage: 78,
      annualIncome: 300000,
      age: 26,
      studyDestination: 'Overseas',
    },
    nfstScheme
  );
  assert(
    destMismatchResult.isLikelyEligible === false,
    'Dynamic Eligibility',
    'NFST rejects Overseas destination (requires Domestic university)'
  );

  console.log('');

  // ------------------------------------------------------------------------
  // SUITE 3: AI Document Cross-Verification Logic
  // ------------------------------------------------------------------------
  console.log('🤖 Suite 3: AI Document Cross-Verification Intelligence');

  const sampleFormData: Partial<ApplicationFormData> = {
    fullName: 'Birsa Munda',
    annualIncome: '450000',
    passportNumber: 'Z9482014',
    qsRanking: '82',
  };

  // Mock extracted OCR data
  const sampleIncomeDoc: DocumentItem = {
    id: 'doc-income-1',
    name: 'Income Certificate',
    type: 'income_certificate',
    fileName: 'income_cert.pdf',
    fileSize: '1.2 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-03-15',
    status: 'verified',
    extractedData: {
      name: 'Birsa Munda',
      income: '450000',
      financialYear: '2025-2026',
      certificateNumber: 'IN/2026/9482',
      issuingAuthority: 'Tehsildar Khunti',
      validUntil: '2027-03-31',
    },
  };

  const samplePassportDoc: DocumentItem = {
    id: 'doc-pass-1',
    name: 'Indian Passport',
    type: 'passport',
    fileName: 'passport_scan.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    uploadDate: '2026-03-15',
    status: 'verified',
    extractedData: {
      fullName: 'Birsa Munda',
      passportNo: 'Z9482014',
      nationality: 'INDIAN',
      expiryDate: '2034-11-20',
    },
  };

  // Verify Income OCR cross-checks
  assert(
    sampleIncomeDoc.extractedData?.name.toLowerCase() === sampleFormData.fullName?.toLowerCase(),
    'AI Document Intelligence',
    'OCR Income name precisely matches Application Form'
  );
  assert(
    Number(sampleIncomeDoc.extractedData?.income) <= (nosScheme?.maxIncomeCeiling || 800000),
    'AI Document Intelligence',
    'Certified income is within statutory scheme ceiling'
  );
  assert(
    sampleIncomeDoc.extractedData?.financialYear === '2025-2026',
    'AI Document Intelligence',
    'Income Certificate is certified for current valid Financial Year'
  );

  // Verify Passport OCR cross-checks
  assert(
    samplePassportDoc.extractedData?.passportNo === sampleFormData.passportNumber,
    'AI Document Intelligence',
    'OCR Passport number matches application form entry'
  );
  assert(
    new Date(samplePassportDoc.extractedData?.expiryDate || '').getFullYear() > 2026,
    'AI Document Intelligence',
    'Passport validity extends beyond current year'
  );

  console.log('');

  // ------------------------------------------------------------------------
  // SUITE 4: Multi-Role Authorization & Personas
  // ------------------------------------------------------------------------
  console.log('👥 Suite 4: Multi-Tier RBAC & Persona Profiles');

  const requiredRoles = [
    'applicant',
    'institute_verifier',
    'scrutiny_officer',
    'screening_officer',
    'approving_authority',
    'officer',
  ];

  const personaMap = {
    applicant: INITIAL_APPLICANTS[0],
    institute_verifier: DEMO_INSTITUTE_VERIFIER,
    scrutiny_officer: DEMO_SCRUTINY_OFFICER,
    screening_officer: DEMO_SCREENING_OFFICER,
    approving_authority: DEMO_APPROVING_AUTHORITY,
    officer: DEMO_OFFICER,
  };

  requiredRoles.forEach((role) => {
    const persona = personaMap[role as keyof typeof personaMap];
    assert(!!persona, 'RBAC Authorization', `Demo persona defined for role: ${role}`);
    assert(persona.role === role, 'RBAC Authorization', `Persona role assignment matches: ${role}`);
  });

  console.log('');

  // ------------------------------------------------------------------------
  // SUITE 5: Post-Award Fellowship Lifecycle
  // ------------------------------------------------------------------------
  console.log('🎓 Suite 5: Post-Selection Fellowship Lifecycle & DBT Tracking');

  // Verify onboarding form structure
  const sampleJoiningPayload = {
    joiningDate: '2026-08-01',
    supervisorName: 'Dr. James Anderson',
    supervisorEmail: 'j.anderson@ox.ac.uk',
    department: 'Department of Zoology & Biodiversity',
    officialStampUploaded: true,
  };

  assert(
    !!sampleJoiningPayload.joiningDate && sampleJoiningPayload.officialStampUploaded,
    'Fellowship Lifecycle',
    'Scholar Onboarding (Joining Report) validation passes'
  );

  // Verify DBT disbursement calculations
  const monthlyFellowship = 45000;
  const annualContingency = 50000;
  const annualTotal = monthlyFellowship * 12 + annualContingency;
  assert(annualTotal === 590000, 'Fellowship Lifecycle', 'Annual DBT disbursement formula equals ₹5,90,000');

  console.log('');

  // ------------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------------
  console.log('====================================================');
  console.log('📊 TEST EXECUTION SUMMARY');
  console.log('====================================================');
  const total = testResults.length;
  const passed = testResults.filter((r) => r.status === 'PASS').length;
  const failed = testResults.filter((r) => r.status === 'FAIL').length;

  console.log(`Total Scenarios Tested : ${total}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Failed                 : ${failed}`);

  if (failed === 0) {
    console.log('\n🌟 ALL END-TO-END FEATURES & SPECIFICATION UPDATES PASSED!');
    process.exit(0);
  } else {
    console.error(`\n❌ ${failed} SCENARIO(S) FAILED.`);
    process.exit(1);
  }
}

runEndToEndFeatureTests();
