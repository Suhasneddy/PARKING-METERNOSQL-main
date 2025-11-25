module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/ocr-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "extractPlateNumberFromImage",
    ()=>extractPlateNumberFromImage,
    "extractValidPlate",
    ()=>extractValidPlate,
    "normalizePlateNumber",
    ()=>normalizePlateNumber,
    "validatePlateFormat",
    ()=>validatePlateFormat
]);
async function extractPlateNumberFromImage(imageData) {
    try {
        // In development/testing, use mock data
        if ("TURBOPACK compile-time truthy", 1) {
            return mockExtractPlateNumber(imageData);
        }
        //TURBOPACK unreachable
        ;
    } catch (error) {
        console.error("[v0] OCR Error:", error);
        return {
            success: false,
            error: "Failed to process image"
        };
    }
}
async function performOCR(imageData) {
    // Convert base64 image to buffer if needed
    // Extract text using OCR library
    // Example with Tesseract (would require serverless deployment support)
    // const { createWorker } = require('tesseract.js');
    // const worker = await createWorker();
    // const { data: { text } } = await worker.recognize(imageBuffer);
    // await worker.terminate();
    // For now, return mock data
    return mockExtractPlateNumber(imageData);
}
function mockExtractPlateNumber(imageData) {
    // Mock data for testing
    // Indian license plate format: [2 letter state code][2 digit district code][1 letter category][4 digit number]
    // Example: KA01AB1234
    const mockPlates = [
        "KA01AB1234",
        "KA01CD5678",
        "MH02EF9012",
        "DL03GH3456",
        "TN04IJ7890"
    ];
    const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    // Simulate OCR confidence (higher is better)
    const confidence = 0.85 + Math.random() * 0.15 // 85-100%
    ;
    return {
        success: true,
        plateNumber: randomPlate,
        confidence
    };
}
function validatePlateFormat(plateNumber) {
    // Indian format: 2 letters + 2 digits + 1-2 letters + 4 digits
    const indianFormat = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
    return indianFormat.test(plateNumber.toUpperCase());
}
function normalizePlateNumber(plateNumber) {
    return plateNumber.toUpperCase().replace(/\s+/g, "") // Remove spaces
    .replace(/[^A-Z0-9]/g, "") // Remove special characters
    ;
}
function extractValidPlate(ocrResult) {
    if (!ocrResult.success || !ocrResult.plateNumber) {
        return null;
    }
    const normalized = normalizePlateNumber(ocrResult.plateNumber);
    if (validatePlateFormat(normalized)) {
        return normalized;
    }
    return null;
}
}),
"[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/plate-validator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// License Plate Validation Utilities
__turbopack_context__.s([
    "getStateName",
    ()=>getStateName,
    "validatePlate",
    ()=>validatePlate
]);
function validatePlate(plateNumber) {
    const errors = [];
    const normalized = normalizePlateNumber(plateNumber);
    // Check format
    if (!validateIndianFormat(normalized)) {
        errors.push("Invalid Indian license plate format");
    }
    // Check length
    if (normalized.length !== 10) {
        errors.push("License plate must be 10 characters (including state and district codes)");
    }
    // Check state code validity
    const stateCode = normalized.substring(0, 2);
    if (!isValidStateCode(stateCode)) {
        errors.push(`Invalid state code: ${stateCode}`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        plateNumber: errors.length === 0 ? normalized : undefined
    };
}
function normalizePlateNumber(plate) {
    return plate.toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "");
}
function validateIndianFormat(plate) {
    // Indian format: 2 letters (state) + 2 digits (district) + 1-2 letters (category) + 4 digits (serial)
    const pattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
    return pattern.test(plate);
}
function isValidStateCode(code) {
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
        "WB"
    ];
    return validStates.includes(code.toUpperCase());
}
function getStateName(stateCode) {
    const stateMap = {
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
        WB: "West Bengal"
    };
    return stateMap[stateCode.toUpperCase()] || null;
}
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/mongodb.ts
__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
let client;
let db;
if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing. Add it to .env.local");
}
const uri = process.env.MONGODB_URI;
const dbName = uri.split("/").pop()?.split("?")[0] || "parking_meter";
async function connectToDatabase() {
    if (db) return {
        client,
        db
    };
    client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB:", dbName);
    return {
        client,
        db
    };
}
}),
"[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/app/api/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$ocr$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/ocr-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$plate$2d$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/plate-validator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/mongodb.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    try {
        const { db } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const body = await request.json();
        const { studentName, usn, hostelRoom, vehicleNumber, licensePlateImage } = body;
        console.log("[v0] Registration request received for vehicle:", vehicleNumber);
        // Validate required fields
        if (!studentName || !usn || !hostelRoom || !vehicleNumber || !licensePlateImage) {
            console.log("[v0] Missing required fields in registration");
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        // Validate plate format
        const plateValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$plate$2d$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validatePlate"])(vehicleNumber);
        if (!plateValidation.isValid) {
            console.log("[v0] Invalid plate format:", vehicleNumber);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid license plate format",
                details: plateValidation.errors
            }, {
                status: 400
            });
        }
        const normalizedPlate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$ocr$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePlateNumber"])(vehicleNumber);
        // Check if vehicle already registered
        const existingVehicle = await db.collection("vehicles").findOne({
            vehicleNumber: normalizedPlate
        });
        if (existingVehicle) {
            console.log("[v0] Vehicle already registered:", normalizedPlate);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Vehicle already registered"
            }, {
                status: 409
            });
        }
        // Validate student data
        if (!usn.match(/^[0-9]{1}[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3,4}$/)) {
            console.log("[v0] Invalid USN format:", usn);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid USN format"
            }, {
                status: 400
            });
        }
        // Create new record
        const newRecord = {
            studentName,
            usn: usn.toUpperCase(),
            hostelRoom,
            vehicleNumber: normalizedPlate,
            licensePlateImage,
            registrationDate: new Date()
        };
        const result = await db.collection("vehicles").insertOne(newRecord);
        newRecord._id = result.insertedId;
        console.log("[v0] Vehicle registered successfully:", normalizedPlate);
        console.log("[v0] Total registrations:", await db.collection("vehicles").countDocuments());
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Vehicle registered successfully",
            data: newRecord
        }, {
            status: 201
        });
    } catch (error) {
        console.error("[v0] Registration error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to register vehicle"
        }, {
            status: 500
        });
    }
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: "Vehicle Registration API",
        method: "POST",
        description: "Register a new student vehicle"
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__003fa454._.js.map