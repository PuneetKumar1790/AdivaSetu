import { Application } from '../types';
import { formatCurrencyINR, formatDate } from './formatters';

export function downloadMockCertificate(application: Application): void {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Award Letter - ${application.id}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #1e293b; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #0d3829; padding-bottom: 20px; margin-bottom: 30px; }
        .emblem { font-size: 24px; font-weight: bold; color: #0d3829; }
        .ministry { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #475569; }
        .title { font-size: 20px; font-weight: bold; margin-top: 15px; color: #b45309; }
        .content { margin: 30px 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table td { padding: 8px 12px; border: 1px solid #cbd5e1; }
        .details-table td:first-child { font-weight: bold; width: 35%; background: #f8fafc; }
        .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
        .seal { border: 2px dashed #0d3829; border-radius: 50%; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 11px; text-align: center; color: #0d3829; }
        .signature { text-align: right; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="emblem">सत्यमेव जयते</div>
        <div class="ministry">Ministry of Tribal Affairs | जनजाति कार्य मंत्रालय</div>
        <div>Government of India | भारत सरकार</div>
        <div class="title">PROVISIONAL FELLOWSHIP AWARD LETTER (अस्थायी अधिछात्रवृत्ति पत्र)</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Reference ID: ${application.id} | Date: ${formatDate(new Date().toISOString())}</div>
      </div>

      <div class="content">
        <p>Dear <strong>${application.applicantName}</strong>,</p>
        <p>We are pleased to inform you that upon comprehensive AI-assisted scrutiny and merit-based evaluation by the Screening Committee of the Ministry of Tribal Affairs, you have been selected for the award of:</p>
        
        <div style="background: #fdfbf7; border: 1px solid #d97706; padding: 12px 16px; border-radius: 4px; font-size: 16px; font-weight: bold; color: #0d3829; margin: 15px 0;">
          ${application.schemeName} (${application.schemeCode})
        </div>

        <table class="details-table">
          <tr>
            <td>Applicant Full Name</td>
            <td>${application.applicantName}</td>
          </tr>
          <tr>
            <td>Category & Community</td>
            <td>ST (${application.formData.tribeCommunity || 'Gond / Santhal'})</td>
          </tr>
          <tr>
            <td>State of Domicile</td>
            <td>${application.state}</td>
          </tr>
          <tr>
            <td>Enrolled Institution</td>
            <td>${application.formData.institution || application.formData.university}</td>
          </tr>
          <tr>
            <td>Course / Specialization</td>
            <td>${application.formData.course} - ${application.formData.specialization}</td>
          </tr>
          <tr>
            <td>Approved Fellowship Tenor</td>
            <td>5 Years (Subject to Annual Progress Review)</td>
          </tr>
          <tr>
            <td>Direct Benefit Transfer (DBT) Bank</td>
            <td>${application.formData.bankName} (A/C: ****${application.formData.accountNumber?.slice(-4) || '4821'})</td>
          </tr>
        </table>

        <p>The monthly stipend and contingency grants will be disbursed directly to your Aadhaar-linked bank account via the Public Financial Management System (PFMS) / DBT gateway.</p>
        <p><em>Note: This provisional letter is digitally signed and system-generated under the AdivaSetu Digital Public Infrastructure framework.</em></p>
      </div>

      <div class="footer">
        <div class="seal">
          ADIVASETU<br/>DIGITAL SEAL<br/>VERIFIED
        </div>
        <div class="signature">
          <div style="font-weight: bold; color: #0d3829;">(Dr. Rajesh Soren, IPoS)</div>
          <div style="font-size: 13px; color: #475569;">Deputy Secretary (Scholarships & Fellowships)</div>
          <div style="font-size: 12px; color: #64748b;">Ministry of Tribal Affairs, New Delhi</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.focus();
  } else {
    // fallback download
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdivaSetu_Award_Letter_${application.id}.html`;
    a.click();
  }
}
