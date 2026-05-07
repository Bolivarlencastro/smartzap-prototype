export interface CertificateValidationDto {
  userName: string;
  courseName: string;
  issuedAt: string;
  issuerName: string | null;
  pdfUrl: string;
}
