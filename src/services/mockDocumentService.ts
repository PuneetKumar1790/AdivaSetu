import { DocumentItem, DocumentType, VerificationStatus } from '../types';

export interface AIScanStage {
  stage: number;
  name: string;
  hindiName: string;
  durationMs: number;
}

export const AI_SCAN_STAGES: AIScanStage[] = [
  { stage: 1, name: 'Document Quality & Blur Check', hindiName: 'दस्तावेज़ स्पष्टता व गुणवत्ता जांच', durationMs: 400 },
  { stage: 2, name: 'Multilingual OCR Extraction', hindiName: 'बहुभाषी ओसीआर पाठ निष्कर्षण', durationMs: 500 },
  { stage: 3, name: 'Document Classification & Seal Detection', hindiName: 'प्रमाणपत्र वर्गीकरण व शासकीय मुहर पहचान', durationMs: 450 },
  { stage: 4, name: 'DigiLocker / e-Pramaan Registry Match', hindiName: 'डिजीलॉकर / ई-प्रमाण डेटाबेस मिलान', durationMs: 500 },
  { stage: 5, name: 'Scheme Rule & Income Threshold Match', hindiName: 'योजना पात्रता व आय सीमा अनुपालन', durationMs: 450 },
  { stage: 6, name: 'Tamper & Anomaly Risk Analysis', hindiName: 'छेड़छाड़ व विसंगति जोखिम मूल्यांकन', durationMs: 400 },
  { stage: 7, name: 'Confidence Score & Human Review Synthesis', hindiName: 'सत्यापन विश्वसनीयता स्कोर निर्धारण', durationMs: 350 },
];

export const mockDocumentService = {
  // Convert real browser File to object URL and mock metadata
  processUploadedFile(
    file: File,
    type: DocumentType,
    name: string
  ): { fileUrl: string; fileName: string; fileSize: string } {
    const fileUrl = URL.createObjectURL(file);
    const sizeInKB = Math.round(file.size / 1024);
    const fileSize = sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(1)} MB` : `${sizeInKB} KB`;

    return {
      fileUrl,
      fileName: file.name,
      fileSize,
    };
  },

  // Simulated AI Verification with extraction results
  async simulateAIVerification(
    type: DocumentType,
    fileName: string,
    isCorrectedUpload: boolean = false
  ): Promise<{
    status: VerificationStatus;
    aiConfidence: number;
    extractedData: Record<string, string>;
    flagReason?: string;
  }> {
    // Generate realistic extracted OCR fields based on document type
    if (type === 'income_certificate') {
      if (isCorrectedUpload || fileName.toLowerCase().includes('2026') || fileName.toLowerCase().includes('new') || fileName.toLowerCase().includes('valid')) {
        return {
          status: 'verified',
          aiConfidence: 98.2,
          extractedData: {
            'Certificate No': 'INC/DEL/2026/8940',
            'Applicant Name': 'Aarav Kumar',
            'Father / Guardian': 'Late Somnath Kumar',
            'Gross Annual Family Income': '₹2,40,000 (Within ₹6.0L ceiling)',
            'Validity Period': 'Financial Year 2026-27 (Valid)',
            'Issuing Authority': 'Tehsildar Office, District South-West, Delhi',
            'Digital Verification QR': 'Verified via Revenue e-District Portal',
          },
        };
      } else {
        return {
          status: 'deficient',
          aiConfidence: 71.0,
          flagReason: 'Income certificate validity expired. Document issue date is older than 12 months.',
          extractedData: {
            'Certificate No': 'INC/DEL/2023/4921',
            'Applicant Name': 'Aarav Kumar',
            'Gross Annual Family Income': '₹2,40,000',
            'Validity Period': 'Financial Year 2023-24 (Expired)',
            'Issuing Authority': 'Sub-Divisional Magistrate, Vasant Vihar',
          },
        };
      }
    }

    if (type === 'st_certificate') {
      return {
        status: 'verified',
        aiConfidence: 98.7,
        extractedData: {
          'Name': 'Aarav Kumar',
          'Certificate No': 'ST/DEL/2024/83921',
          'Community Identified': 'Gond Scheduled Tribe',
          'Issuing Authority': 'District Magistrate / SDM',
          'Issue Date': '15 May 2024',
          'e-District Seal': 'Authenticated via DigiLocker API',
        },
      };
    }

    if (type === 'aadhaar') {
      return {
        status: 'verified',
        aiConfidence: 99.4,
        extractedData: {
          'Name': 'Aarav Kumar',
          'Aadhaar Reference': 'XXXX XXXX 2841',
          'DOB': '12/06/1999',
          'Gender': 'Male',
          'UIDAI Authentication': 'Aadhaar e-KYC Match (100% Name & DOB Consistency)',
        },
      };
    }

    if (type === 'marksheet') {
      return {
        status: 'verified',
        aiConfidence: 96.8,
        extractedData: {
          'Candidate Name': 'Aarav Kumar',
          'Degree': 'Master of Science (M.Sc)',
          'Institution': 'Jawaharlal Nehru University',
          'Overall CGPA / Percentage': '8.82 / 10.0 (88.2%)',
          'Result Classification': 'First Class with Distinction',
        },
      };
    }

    if (type === 'bank_passbook') {
      return {
        status: 'verified',
        aiConfidence: 98.9,
        extractedData: {
          'Account Name': 'Aarav Kumar',
          'Bank': 'State Bank of India',
          'Account No': 'XXXX XXXX 4821',
          'IFSC Code': 'SBIN0001077',
          'Aadhaar DBT Seeding Status': 'Active (NPCI Linked)',
        },
      };
    }

    // Default for any other document
    return {
      status: 'verified',
      aiConfidence: 95.5,
      extractedData: {
        'Document Name': fileName,
        'Format': 'Standard Official Document',
        'Text Extraction': 'Completed without OCR degradation',
        'Human Review Flag': 'Cleared for Scrutiny',
      },
    };
  },
};
