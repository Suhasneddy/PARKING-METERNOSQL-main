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
        if (("TURBOPACK compile-time value", "development") === "development") {
        // return mockExtractPlateNumber(imageData);
        }
        // Production: Call actual OCR service
        // For this implementation, we'll use a simple pattern-based approach
        return await performOCR(imageData);
    } catch (error) {
        console.error("[v0] OCR Error:", error);
        return {
            success: false,
            error: "Failed to process image"
        };
    }
}
async function performOCR(imageData) {
    const apiKey = process.env.PLATE_RECOGNIZER_API_KEY;
    if (!apiKey) {
        console.error("PLATE_RECOGNIZER_API_KEY is not set.");
        return {
            success: false,
            error: "API key not configured"
        };
    }
    // The API expects a base64 string without the data URL prefix
    const base64Image = imageData.split(",");
    try {
        const response = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                upload: base64Image,
                region: "in"
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Plate Recognizer API Error:", errorData);
            return {
                success: false,
                error: `API request failed with status ${response.status}`
            };
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const plate = data.results;
            return {
                success: true,
                plateNumber: plate.plate,
                confidence: plate.score
            };
        } else {
            return {
                success: false,
                error: "No license plate found"
            };
        }
    } catch (error) {
        console.error("Error calling Plate Recognizer API:", error);
        return {
            success: false,
            error: "Failed to connect to the OCR service"
        };
    }
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
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
const uri = ("TURBOPACK compile-time value", "mongodb+srv://snr200564_db_user:Suhas200564@cluster0.kx4p8mt.mongodb.net/");
const dbName = process.env.MONGODB_DB_NAME || "parking_meter";
let client = null;
let db = null;
async function connectToDatabase() {
    if (db && client) return {
        client,
        db
    };
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri);
    await client.connect();
    db = client.db(dbName);
    return {
        client,
        db
    };
}
}),
"[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/app/api/scan/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$ocr$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/ocr-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/NO SQL/PARKING-METERNOSQL-main/lib/mongodb.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { licensePlateImage } = body;
        if (!licensePlateImage) {
            console.log("[v1] No image provided for scanning");
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No image provided"
            }, {
                status: 400
            });
        }
        console.log("[v1] Processing license plate scan...");
        // Extract plate number using OCR
        const ocrResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$ocr$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractPlateNumberFromImage"])(licensePlateImage);
        if (!ocrResult.success) {
            console.log("[v1] OCR processing failed:", ocrResult.error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Failed to process image",
                found: false
            });
        }
        const extractedPlate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$ocr$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractValidPlate"])(ocrResult);
        if (!extractedPlate) {
            console.log("[v1] Could not extract valid plate from OCR result");
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                found: false,
                message: "Could not extract valid plate number from image"
            });
        }
        console.log(`[v1] Extracted Plate: ${extractedPlate}, Confidence: ${ocrResult.confidence?.toFixed(2)}%`);
        // Search for vehicle in database
        const { db } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const student = await db.collection("vehicles").findOne({
            vehicleNumber: extractedPlate
        });
        if (student) {
            console.log("[v1] Vehicle found in database:", extractedPlate);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                found: true,
                student: {
                    studentName: student.studentName,
                    usn: student.usn,
                    hostelRoom: student.hostelRoom,
                    vehicleNumber: student.vehicleNumber,
                    registrationDate: student.registrationDate.toISOString()
                },
                ocrConfidence: ocrResult.confidence
            });
        } else {
            console.log("[v1] Vehicle not found in database:", extractedPlate);
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                found: false,
                message: "Vehicle not registered in system",
                detectedPlate: extractedPlate,
                ocrConfidence: ocrResult.confidence
            });
        }
    } catch (error) {
        console.error("[v0] Scan error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to process scan",
            success: false
        }, {
            status: 500
        });
    }
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$NO__SQL$2f$PARKING$2d$METERNOSQL$2d$main$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: "License Plate Scanning API",
        method: "POST",
        description: "Scan a license plate to verify vehicle registration"
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2ef63ab4._.js.map