import { DocumentItem, DocumentType, VerificationStatus } from '../../types';
import { apiConfig } from './apiConfig';
import { eventBus } from '../events/eventBus';
import { uploadDocumentToSupabase } from '../storage/supabaseClient';

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

export interface UploadedFileResponse {
  fileUrl: string;
  fileName: string;
  fileSize: string;
  documentType: DocumentType;
}

export interface VerificationResult {
  status: VerificationStatus;
  aiConfidence: number;
  extractedData: Record<string, string>;
  flagReason?: string;
  stagesCompleted: number;
}

export const documentService = {
  /**
   * Simulated API upload with real latency and browser ObjectURL creation
   */
  async uploadDocument(file: File, type: DocumentType): Promise<UploadedFileResponse> {
    await apiConfig.simulateLatency('documentUpload', `Uploading ${file.name} to secure Supabase vault...`);

    let fileUrl: string;
    try {
      const res = await uploadDocumentToSupabase(file);
      fileUrl = res.publicUrl || URL.createObjectURL(file);
    } catch {
      fileUrl = URL.createObjectURL(file);
    }

    const sizeInKB = Math.round(file.size / 1024);
    const fileSize = sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(1)} MB` : `${sizeInKB} KB`;

    eventBus.publish('document:uploaded', { fileName: file.name, type });

    return {
      fileUrl,
      fileName: file.name,
      fileSize,
      documentType: type,
    };
  },

  /**
   * Multi-stage Asynchronous AI Processing Pipeline
   */
  async runAIVerification(
    type: DocumentType,
    fileName: string,
    onStageUpdate?: (currentStage: number) => void
  ): Promise<VerificationResult> {
    const isProfileMatch =
      fileName.toLowerCase().includes('2026') ||
      fileName.toLowerCase().includes('new') ||
      fileName.toLowerCase().includes('valid') ||
      fileName.toLowerCase().includes('aarav');

    // Run through the 7 stages asynchronously with realistic delay
    for (let i = 0; i < AI_SCAN_STAGES.length; i++) {
      const stage = AI_SCAN_STAGES[i];
      if (onStageUpdate) {
        onStageUpdate(stage.stage);
      }
      eventBus.publish('verification:stage', { stage: stage.stage, name: stage.name });
      await new Promise((r) => setTimeout(r, stage.durationMs));
    }

    let extractedData: Record<string, string> = {};
    let status: VerificationStatus = 'verified';
    let aiConfidence = 98.4;
    let flagReason: string | undefined = undefined;

    if (type === 'income_certificate') {
      if (isProfileMatch) {
        extractedData = {
          'Certificate No': 'INC/JH/2026/8940',
          'Applicant Name': 'Aarav Kumar',
          'Father / Guardian': 'Late Somnath Kumar',
          'Gross Annual Family Income': '₹2,40,000 (Within ₹6.0L ceiling)',
          'Validity Period': 'Financial Year 2026-27 (Valid & Active)',
          'Issuing Authority': 'Tehsildar / Sub-Divisional Officer, Ranchi',
          'Digital Signature': 'Valid & Verified via e-District Jharkhand',
        };
      } else {
        status = 'flagged';
        aiConfidence = 64.0;
        flagReason = 'Certificate validity expired (Issued FY 2024-25). Requires valid renewal for 2026-27.';
        extractedData = {
          'Certificate No': 'INC/JH/2024/1102',
          'Applicant Name': 'Aarav Kumar',
          'Validity Period': 'Financial Year 2024-25 (Expired)',
        };
      }
    } else if (type === 'st_certificate') {
      extractedData = {
        'Certificate No': 'ST/RNC/2019/5431',
        'Applicant Name': 'Aarav Kumar',
        'Tribe / Community': 'Santhal (Scheduled Tribe of Jharkhand)',
        'Issuing Authority': 'Sub-Divisional Magistrate, Ranchi',
        'State Code': 'JH-02',
        'Status': 'Life-Time Permanent Certificate (Valid)',
      };
      aiConfidence = 99.1;
    } else {
      extractedData = {
        'Document Type': type.replace(/_/g, ' ').toUpperCase(),
        'Document Name': fileName,
        'Format': 'PDF / Image Verified',
        'Integrity Check': 'SHA-256 Checksum Verified',
        'Verification Status': 'Authentic & Unaltered',
      };
      aiConfidence = 96.8;
    }

    const result: VerificationResult = {
      status,
      aiConfidence,
      extractedData,
      flagReason,
      stagesCompleted: 7,
    };

    eventBus.publish('verification:completed', result);
    return result;
  },
};
