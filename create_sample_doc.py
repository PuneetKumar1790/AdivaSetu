# Generate a valid, professional sample PDF document for AdivaSetu testing
def create_pdf(filename):
    title = "GOVERNMENT OF JHARKHAND"
    dept = "OFFICE OF THE SUB-DIVISIONAL MAGISTRATE / TEHSILDAR, RANCHI"
    doc_title = "ANNUAL FAMILY INCOME CERTIFICATE (FY 2026-27)"
    cert_no = "Certificate No: INC/JH/2026/8940"
    issue_date = "Date of Issue: 12 April 2026"
    validity = "Validity: 01 April 2026 to 31 March 2027"
    
    text_lines = [
        "This is to certify that Sri / Kum: AARAV KUMAR",
        "Son / Daughter of: Late Somnath Kumar & Smt. Radha Devi",
        "Permanent Resident of: Village Bero, P.O. Bero, District Ranchi, Jharkhand",
        "Category: Scheduled Tribe (ST) - Community: Santhal",
        "",
        "Gross Annual Family Income from all sources (Agriculture, Salary, Business):",
        "Rs. 2,40,000/- (Rupees Two Lakh Forty Thousand Only)",
        "",
        "This certificate is issued for higher education fellowship & scholarship purposes",
        "under the Ministry of Tribal Affairs (MoTA) Direct Benefit Transfer (DBT) guidelines.",
        "",
        "Digital Verification Seal: VERIFIED & AUTHENTIC",
        "Signatory Authority: Sub-Divisional Officer / Tehsildar, Sadar Ranchi",
        "Digitally Signed under Information Technology Act, 2000 via e-District Portal"
    ]

    # Build PDF stream
    stream_content = "BT\n"
    stream_content += "/F1 16 Tf\n"
    stream_content += "50 740 Td\n"
    stream_content += f"({title}) Tj\n"
    stream_content += "/F1 11 Tf\n"
    stream_content += "0 -22 Td\n"
    stream_content += f"({dept}) Tj\n"
    stream_content += "/F1 13 Tf\n"
    stream_content += "0 -30 Td\n"
    stream_content += f"({doc_title}) Tj\n"
    stream_content += "/F1 10 Tf\n"
    stream_content += "0 -24 Td\n"
    stream_content += f"({cert_no}   |   {issue_date}) Tj\n"
    stream_content += "0 -16 Td\n"
    stream_content += f"({validity}) Tj\n"
    stream_content += "0 -30 Td\n"

    for line in text_lines:
        if line == "":
            stream_content += "0 -16 Td\n"
        else:
            safe_line = line.replace("(", "\(").replace(")", "\)")
            stream_content += f"({safe_line}) Tj\n"
            stream_content += "0 -18 Td\n"

    stream_content += "ET\n"
    stream_len = len(stream_content.encode('utf-8'))

    pdf = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length {stream_len} >>
stream
{stream_content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000000 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
{250 + stream_len}
%%EOF
"""
    with open(filename, "wb") as f:
        f.write(pdf.encode('latin1'))
    print(f"Created {filename} successfully ({len(pdf.encode('latin1'))} bytes)")

if __name__ == "__main__":
    create_pdf("Income_Certificate_Aarav_Kumar_2026.pdf")
