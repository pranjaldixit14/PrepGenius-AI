import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    // Sanitize extracted text
    let text = data.text || '';
    
    // Normalize excessive whitespace and remove null/control characters
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    text = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

    // Cap text to 15,000 characters to prevent prompt injection / payload attacks
    if (text.length > 15000) {
      text = text.substring(0, 15000) + '... [Truncated for analysis]';
    }

    if (text.length < 50) {
      throw new Error('The uploaded PDF appears to be empty or contains scanned images without selectable text.');
    }

    return text;
  } catch (error) {
    console.error('[PDF Extraction Error]', error.message);
    throw new Error(error.message || 'Failed to extract text from PDF document.');
  }
};

/**
 * Strict structural verification to determine if a document is a genuine resume/CV
 */
export const validateResumeContent = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      reason: 'Empty or unreadable document content.'
    };
  }

  const lower = text.toLowerCase();

  // 1. Negative Disqualification Patterns (Invoices, Receipts, Book Chapters, Legal Terms)
  const invoiceMarkers = [
    'invoice #', 'invoice number', 'bill to', 'ship to', 'amount due',
    'total due', 'subtotal', 'payment terms', 'remit payment', 'tax invoice',
    'due date', 'purchase order'
  ];
  const matchedInvoiceMarkers = invoiceMarkers.filter(m => lower.includes(m));
  if (matchedInvoiceMarkers.length >= 2) {
    return {
      isValid: false,
      reason: 'The uploaded file appears to be an invoice or billing document, not a candidate resume/CV.'
    };
  }

  const bookMarkers = ['table of contents', 'chapter 1', 'chapter 2', 'all rights reserved', 'isbn'];
  const matchedBookMarkers = bookMarkers.filter(m => lower.includes(m));
  if (matchedBookMarkers.length >= 2) {
    return {
      isValid: false,
      reason: 'The uploaded file appears to be a book chapter or publication, not a candidate resume/CV.'
    };
  }

  // 2. Minimum Length & Substance
  if (text.trim().length < 160) {
    return {
      isValid: false,
      reason: 'The uploaded document contains too little text to be evaluated as a professional resume.'
    };
  }

  // 3. Positive Resume Structural Indicators
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{10}\b/.test(text);
  const hasContactLinks = /github\.com|linkedin\.com|portfolio|gitlab\.com|leetcode\.com/i.test(text);
  const hasContactInfo = hasEmail || hasPhone || hasContactLinks;

  const hasEducation = /\b(education|academics|university|college|degree|bachelor|master|b\.tech|b\.e|b\.sc|m\.tech|m\.s|school|cgpa|gpa)\b/i.test(lower);
  const hasSkills = /\b(skills|technical skills|technologies|proficiencies|languages|frameworks|tools|stack|competencies)\b/i.test(lower);
  const hasExperience = /\b(experience|work experience|employment|internship|projects|developed|built|responsibilities|achievements)\b/i.test(lower);

  // Calculate matching section count
  let sectionPoints = 0;
  if (hasEducation) sectionPoints++;
  if (hasSkills) sectionPoints++;
  if (hasExperience) sectionPoints++;

  // A valid resume must have contact info and at least 2 key career sections
  if (!hasContactInfo && sectionPoints < 2) {
    return {
      isValid: false,
      reason: 'The uploaded document is missing required candidate resume sections (Contact Information, Education, Skills, Experience).'
    };
  }

  if (sectionPoints < 2) {
    return {
      isValid: false,
      reason: 'The uploaded document lacks core resume sections. Please upload a resume containing your Education, Technical Skills, and Projects/Experience.'
    };
  }

  return { isValid: true };
};

