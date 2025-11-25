// License Plate Recognition Service
// This service provides OCR capabilities for extracting license plate numbers from images

/**
 * Mock OCR Implementation
 * In production, integrate with one of these:
 * - EasyOCR (Python-based, supports 80+ languages)
 * - Tesseract OCR (Open source)
 * - Google Vision API
 * - AWS Rekognition
 * - Plate Recognizer API (specialized for license plates)
 */

interface OCRResult {
  success: boolean
  plateNumber?: string
  confidence?: number
  error?: string
}

export async function extractPlateNumberFromImage(imageData: string): Promise<OCRResult> {
  try {
    // In development/testing, use mock data
    if (process.env.NODE_ENV === "development") {
      return mockExtractPlateNumber(imageData)
    }

    // Production: Call actual OCR service
    // For this implementation, we'll use a simple pattern-based approach
    return await performOCR(imageData)
  } catch (error) {
    console.error("[v0] OCR Error:", error)
    return {
      success: false,
      error: "Failed to process image",
    }
  }
}

async function performOCR(imageData: string): Promise<OCRResult> {
  // Convert base64 image to buffer if needed
  // Extract text using OCR library

  // Example with Tesseract (would require serverless deployment support)
  // const { createWorker } = require('tesseract.js');
  // const worker = await createWorker();
  // const { data: { text } } = await worker.recognize(imageBuffer);
  // await worker.terminate();

  // For now, return mock data
  return mockExtractPlateNumber(imageData)
}

function mockExtractPlateNumber(imageData: string): OCRResult {
  // Mock data for testing
  // Indian license plate format: [2 letter state code][2 digit district code][1 letter category][4 digit number]
  // Example: KA01AB1234

  const mockPlates = ["KA01AB1234", "KA01CD5678", "MH02EF9012", "DL03GH3456", "TN04IJ7890"]

  const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)]

  // Simulate OCR confidence (higher is better)
  const confidence = 0.85 + Math.random() * 0.15 // 85-100%

  return {
    success: true,
    plateNumber: randomPlate,
    confidence,
  }
}

/**
 * Validate License Plate Format
 * Indian License Plate Format: [State Code][District Code][Category][Serial Number]
 * Example: KA01AB1234
 */
export function validatePlateFormat(plateNumber: string): boolean {
  // Indian format: 2 letters + 2 digits + 1-2 letters + 4 digits
  const indianFormat = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/
  return indianFormat.test(plateNumber.toUpperCase())
}

/**
 * Clean and normalize plate number
 */
export function normalizePlateNumber(plateNumber: string): string {
  return plateNumber
    .toUpperCase()
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^A-Z0-9]/g, "") // Remove special characters
}

/**
 * Extract and validate plate number from OCR result
 */
export function extractValidPlate(ocrResult: OCRResult): string | null {
  if (!ocrResult.success || !ocrResult.plateNumber) {
    return null
  }

  const normalized = normalizePlateNumber(ocrResult.plateNumber)

  if (validatePlateFormat(normalized)) {
    return normalized
  }

  return null
}
