// License Plate Validation Utilities

export interface PlateValidationResult {
  isValid: boolean
  errors: string[]
  plateNumber?: string
}

/**
 * Comprehensive plate validation
 */
export function validatePlate(plateNumber: string): PlateValidationResult {
  const errors: string[] = []
  const normalized = normalizePlateNumber(plateNumber)

  // Check format
  if (!validateIndianFormat(normalized)) {
    errors.push("Invalid Indian license plate format")
  }

  // Check length
  if (normalized.length !== 10) {
    errors.push("License plate must be 10 characters (including state and district codes)")
  }

  // Check state code validity
  const stateCode = normalized.substring(0, 2)
  if (!isValidStateCode(stateCode)) {
    errors.push(`Invalid state code: ${stateCode}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    plateNumber: errors.length === 0 ? normalized : undefined,
  }
}

function normalizePlateNumber(plate: string): string {
  return plate
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "")
}

function validateIndianFormat(plate: string): boolean {
  // Indian format: 2 letters (state) + 2 digits (district) + 1-2 letters (category) + 4 digits (serial)
  const pattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/
  return pattern.test(plate)
}

function isValidStateCode(code: string): boolean {
  // Valid Indian state codes
  const validStates = [
    "AN",
    "AP",
    "AR",
    "AS",
    "BR",
    "CG",
    "CH",
    "CT",
    "DD",
    "DL",
    "DN",
    "GA",
    "GJ",
    "HR",
    "HP",
    "JK",
    "JH",
    "KA",
    "KL",
    "LA",
    "LD",
    "MH",
    "ML",
    "MN",
    "MP",
    "MZ",
    "NL",
    "OR",
    "OD",
    "PB",
    "PY",
    "RJ",
    "SK",
    "TG",
    "TR",
    "TN",
    "TR",
    "UP",
    "UT",
    "UK",
    "WB",
  ]
  return validStates.includes(code.toUpperCase())
}

/**
 * Get state name from state code
 */
export function getStateName(stateCode: string): string | null {
  const stateMap: Record<string, string> = {
    AP: "Andhra Pradesh",
    AR: "Arunachal Pradesh",
    AS: "Assam",
    BR: "Bihar",
    CG: "Chhattisgarh",
    CH: "Chandigarh",
    CT: "Chhattisgarh",
    DD: "Daman and Diu",
    DL: "Delhi",
    DN: "Dadra and Nagar Haveli",
    GA: "Goa",
    GJ: "Gujarat",
    HR: "Haryana",
    HP: "Himachal Pradesh",
    JK: "Jammu and Kashmir",
    JH: "Jharkhand",
    KA: "Karnataka",
    KL: "Kerala",
    LA: "Ladakh",
    MH: "Maharashtra",
    ML: "Meghalaya",
    MN: "Manipur",
    MP: "Madhya Pradesh",
    MZ: "Mizoram",
    NL: "Nagaland",
    OR: "Odisha",
    OD: "Odisha",
    PB: "Punjab",
    PY: "Puducherry",
    RJ: "Rajasthan",
    SK: "Sikkim",
    TG: "Telangana",
    TN: "Tamil Nadu",
    TR: "Tripura",
    UP: "Uttar Pradesh",
    UT: "Uttarakhand",
    UK: "Uttarakhand",
    WB: "West Bengal",
  }
  return stateMap[stateCode.toUpperCase()] || null
}
