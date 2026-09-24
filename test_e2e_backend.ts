import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './server/db';
import app from './server/index';
import http from 'http';

interface TestResult {
  name: string;
  endpoint: string;
  status: 'PASS' | 'FAIL';
  statusCode: number;
  details?: string;
  responseTimeMs: number;
}

const results: TestResult[] = [];

async function runTests() {
  console.log('====================================================');
  console.log('🔍 ADIVASETU COMPREHENSIVE END-TO-END BACKEND TEST');
  console.log('====================================================\n');

  console.log('📡 Step 1: Connecting to MongoDB Atlas...');
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ MongoDB Atlas connection failed. Aborting tests.');
    process.exit(1);
  }
  console.log('✅ MongoDB Atlas connected successfully!\n');

  const TEST_PORT = 5055;
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(TEST_PORT, () => resolve()));
  console.log(`🚀 Test server listening on http://localhost:${TEST_PORT}\n`);

  const BASE_URL = `http://localhost:${TEST_PORT}`;

  async function testEndpoint(
    name: string,
    endpoint: string,
    options: RequestInit = {},
    expectedStatus: number = 200,
    validate?: (body: any) => boolean
  ) {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const time = Date.now() - start;
      const text = await res.text();
      let body: any = null;
      try {
        body = JSON.parse(text);
      } catch {}

      const statusMatches = res.status === expectedStatus;
      const customPass = validate ? validate(body) : true;
      const passed = statusMatches && customPass;

      results.push({
        name,
        endpoint,
        status: passed ? 'PASS' : 'FAIL',
        statusCode: res.status,
        responseTimeMs: time,
        details: passed ? undefined : `Expected ${expectedStatus}, got ${res.status}. Output: ${text.slice(0, 150)}`,
      });

      console.log(
        `${passed ? '✅ PASS' : '❌ FAIL'} [${res.status}] ${name} (${time}ms)`
      );
      return { status: res.status, body };
    } catch (err: any) {
      const time = Date.now() - start;
      results.push({
        name,
        endpoint,
        status: 'FAIL',
        statusCode: 0,
        responseTimeMs: time,
        details: err.message,
      });
      console.log(`❌ FAIL [ERR] ${name}: ${err.message}`);
      return { status: 0, body: null };
    }
  }

  try {
    // 1. Root Render Health Endpoint
    await testEndpoint('Root Render Health Check', '/', {}, 200, (b) => b.status === 'online');

    // 2. /api/health
    await testEndpoint('Core API Health Check', '/api/health', {}, 200, (b) => b.status === 'online');

    // 3. Analytics Stats
    await testEndpoint('Analytics Dashboard Stats', '/api/analytics/stats', {}, 200, (b) => {
      return typeof b.totalApplications === 'number' && b.totalApplications > 0;
    });

    // 4. Notifications List
    const notifRes = await testEndpoint('List Notifications', '/api/notifications', {}, 200, (b) => Array.isArray(b));

    // 5. Notification Read
    if (notifRes.body && notifRes.body.length > 0) {
      const notifId = notifRes.body[0].id;
      await testEndpoint(`Mark Notification ${notifId} as Read`, `/api/notifications/${notifId}/read`, { method: 'PATCH' }, 200);
    }

    // 6. Audit Logs
    await testEndpoint('Audit Security Ledger', '/api/audit-logs?page=1&pageSize=10', {}, 200, (b) => {
      return Array.isArray(b.data) && b.data.length > 0;
    });

    // 7. Applications: List Default Paginated
    const appListRes = await testEndpoint('Applications Paginated List', '/api/applications?page=1&pageSize=10', {}, 200, (b) => {
      return Array.isArray(b.data) && b.data.length > 0 && b.total >= 80;
    });

    // 8. Applications: Search Filter
    await testEndpoint('Applications Search (Santhal / Birsa / Aarav)', '/api/applications?search=Birsa', {}, 200, (b) => {
      return Array.isArray(b.data);
    });

    // 9. Applications: Scheme Filter
    await testEndpoint('Applications Filter by Scheme (NFST)', '/api/applications?scheme=NFST', {}, 200, (b) => {
      return Array.isArray(b.data) && b.data.every((a: any) => a.schemeCode === 'NFST');
    });

    // 10. Applications: Status Filter
    await testEndpoint('Applications Filter by Status (Deficient)', '/api/applications?status=Deficient', {}, 200, (b) => {
      return Array.isArray(b.data) && b.data.every((a: any) => a.status === 'Deficient');
    });

    // 11. Single Application Fetch
    let targetAppId = 'ADVS-NFST-2026-00482';
    if (appListRes.body?.data?.[0]?.id) {
      targetAppId = appListRes.body.data[0].id;
    }
    await testEndpoint(`Get Single Application by ID (${targetAppId})`, `/api/applications/${targetAppId}`, {}, 200, (b) => {
      return b.id === targetAppId;
    });

    // 12. Create New Application
    const newAppPayload = {
      id: `ADVS-TEST-${Date.now()}`,
      applicantId: 'usr-test-999',
      applicantName: 'Test Scholar Munda',
      schemeId: 'scheme-nfst',
      schemeCode: 'NFST',
      schemeName: 'National Fellowship for ST Students',
      academicYear: '2026-27',
      state: 'Jharkhand',
      district: 'Ranchi',
      aiScore: 95,
      aiConfidence: 98.2,
      formData: {
        fullName: 'Test Scholar Munda',
        category: 'ST',
        tribeCommunity: 'Munda',
        annualIncome: '180000',
        university: 'Ranchi University',
      },
      documents: [],
    };

    const createRes = await testEndpoint(
      'Create New Application (POST /api/applications)',
      '/api/applications',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppPayload),
      },
      201,
      (b) => b.id === newAppPayload.id
    );

    // 13. Update Application Status & Audit Trail
    const createdId = createRes.body?.id || newAppPayload.id;
    await testEndpoint(
      `Update Status to Screening (PATCH /api/applications/${createdId}/status)`,
      `/api/applications/${createdId}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Screening',
          actor: 'Dr. Rajesh Verma (Scrutiny Officer)',
          remarks: 'Applicant documents verified against Ministry norms.',
        }),
      },
      200,
      (b) => b.status === 'Screening'
    );

    // 14. Document Upload to Supabase Storage API
    const testDocBase64 = Buffer.from('Official Income Certificate Renewal Content').toString('base64');
    await testEndpoint(
      'Document Upload to Supabase Storage (POST /api/documents/upload)',
      '/api/documents/upload',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: 'income_certificate_2026.pdf',
          fileType: 'application/pdf',
          base64Data: `data:application/pdf;base64,${testDocBase64}`,
        }),
      },
      200,
      (b) => typeof b.fileUrl === 'string' && b.fileUrl.length > 0
    );

    // 15. Resolve Deficiency on the Application
    await testEndpoint(
      `Resolve Deficiency (POST /api/applications/${createdId}/deficiency)`,
      `/api/applications/${createdId}/deficiency`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'income_certificate',
          fileName: 'income_certificate_2026.pdf',
          fileSize: '1.2 MB',
          fileUrl: 'https://cizefhwkgycenajsbzdm.supabase.co/storage/v1/object/public/documents/test.txt',
        }),
      },
      200,
      (b) => b.id === createdId
    );

    // 16. Auth Login
    await testEndpoint(
      'Auth Login (POST /api/auth/login)',
      '/api/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'rajesh.verma@tribal.gov.in',
          password: 'any_password',
        }),
      },
      200,
      (b) => !!(b && (b.id || b.email || b.user))
    );

    // 17. Auth Me
    await testEndpoint('Auth Me (GET /api/auth/me)', '/api/auth/me', {}, 200, (b) => !!(b && (b.id || b.email || b.user)));
  } finally {
    server.close();

    console.log('\n====================================================');
    console.log('📊 TEST SUMMARY RESULTS');
    console.log('====================================================');
    const passedCount = results.filter((r) => r.status === 'PASS').length;
    const totalCount = results.length;
    console.log(`Total Endpoints Tested: ${totalCount}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${totalCount - passedCount}`);

    if (passedCount === totalCount) {
      console.log('\n🌟 ALL BACKEND API ENDPOINTS VERIFIED & WORKING 100%!');
    } else {
      console.log('\n⚠️ Some endpoints failed:');
      results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`- ${r.name}: ${r.details}`);
      });
    }

    const mongoose = await import('mongoose');
    await mongoose.default.disconnect();
    process.exit(passedCount === totalCount ? 0 : 1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
