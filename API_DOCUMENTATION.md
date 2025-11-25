# API Documentation - Student Parking Meter

Complete REST API reference for the Student Parking Meter system.

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
Currently, the system doesn't require authentication. In production, implement JWT or OAuth2.

---

## Endpoints

### 1. Register Vehicle

Register a new student vehicle in the system.

**Endpoint:** `POST /api/register`

**Content-Type:** `application/json`

**Request Body:**
\`\`\`json
{
  "studentName": "John Doe",
  "usn": "1BM19CS001",
  "hostelRoom": "A-201",
  "vehicleNumber": "KA01AB1234",
  "licensePlateImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
\`\`\`

**Field Descriptions:**
- `studentName` (string, required): Full name of the student
- `usn` (string, required): University Serial Number (format: 1BM19CS001)
- `hostelRoom` (string, required): Hostel room number (e.g., A-201, B-305)
- `vehicleNumber` (string, required): License plate number (Indian format: KA01AB1234)
- `licensePlateImage` (string, required): Base64 encoded image of the license plate

**Success Response (201 Created):**
\`\`\`json
{
  "success": true,
  "message": "Vehicle registered successfully",
  "data": {
    "_id": "1705238400000",
    "studentName": "John Doe",
    "usn": "1BM19CS001",
    "hostelRoom": "A-201",
    "vehicleNumber": "KA01AB1234",
    "registrationDate": "2025-01-15T10:30:00.000Z"
  }
}
\`\`\`

**Error Responses:**

400 Bad Request:
\`\`\`json
{
  "error": "Invalid license plate format",
  "details": ["Invalid Indian license plate format"]
}
\`\`\`

409 Conflict:
\`\`\`json
{
  "error": "Vehicle already registered"
}
\`\`\`

500 Server Error:
\`\`\`json
{
  "error": "Failed to register vehicle"
}
\`\`\`

**Example cURL:**
\`\`\`bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "usn": "1BM19CS001",
    "hostelRoom": "A-201",
    "vehicleNumber": "KA01AB1234",
    "licensePlateImage": "data:image/jpeg;base64,..."
  }'
\`\`\`

**Example JavaScript:**
\`\`\`javascript
async function registerVehicle(data) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
\`\`\`

---

### 2. Scan License Plate

Scan a license plate image to verify vehicle registration.

**Endpoint:** `POST /api/scan`

**Content-Type:** `application/json`

**Request Body:**
\`\`\`json
{
  "licensePlateImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
\`\`\`

**Field Descriptions:**
- `licensePlateImage` (string, required): Base64 encoded image of the license plate

**Success Response (200 OK) - Vehicle Found:**
\`\`\`json
{
  "success": true,
  "found": true,
  "student": {
    "studentName": "John Doe",
    "usn": "1BM19CS001",
    "hostelRoom": "A-201",
    "vehicleNumber": "KA01AB1234",
    "registrationDate": "2025-01-15T10:30:00.000Z"
  },
  "ocrConfidence": 0.92
}
\`\`\`

**Success Response (200 OK) - Vehicle Not Found:**
\`\`\`json
{
  "success": true,
  "found": false,
  "message": "Vehicle not registered in system",
  "detectedPlate": "KA01CD5678",
  "ocrConfidence": 0.88
}
\`\`\`

**Error Response (500 Server Error):**
\`\`\`json
{
  "error": "Failed to process scan",
  "success": false
}
\`\`\`

**Field Descriptions (Response):**
- `success` (boolean): Request processed successfully
- `found` (boolean): Vehicle found in database
- `student` (object): Student details if found
  - `studentName`: Full name
  - `usn`: University Serial Number
  - `hostelRoom`: Hostel room number
  - `vehicleNumber`: License plate number
  - `registrationDate`: ISO 8601 timestamp
- `ocrConfidence` (number): OCR confidence score (0-1)
- `detectedPlate` (string): Plate number extracted by OCR
- `message` (string): Human-readable message

**Example cURL:**
\`\`\`bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "licensePlateImage": "data:image/jpeg;base64,..."
  }'
\`\`\`

**Example JavaScript:**
\`\`\`javascript
async function scanPlate(imageData) {
  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licensePlateImage: imageData })
  });
  const result = await response.json();
  
  if (result.found) {
    console.log('Vehicle registered:', result.student.studentName);
  } else {
    console.log('Vehicle not registered');
  }
  
  return result;
}
\`\`\`

---

### 3. Lookup Vehicle by Number Plate

Query vehicle details by license plate number.

**Endpoint:** `GET /api/vehicles?vehicleNumber={plateNumber}`

**Query Parameters:**
- `vehicleNumber` (string, optional): License plate to search
- `usn` (string, optional): University Serial Number to search

**Success Response (200 OK) - Found:**
\`\`\`json
{
  "success": true,
  "found": true,
  "student": {
    "studentName": "John Doe",
    "usn": "1BM19CS001",
    "hostelRoom": "A-201",
    "vehicleNumber": "KA01AB1234",
    "registrationDate": "2025-01-15T10:30:00.000Z"
  }
}
\`\`\`

**Success Response (200 OK) - Not Found:**
\`\`\`json
{
  "success": true,
  "found": false,
  "message": "Vehicle not found in system"
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "error": "Vehicle number is required"
}
\`\`\`

**Example cURL:**
\`\`\`bash
# Search by vehicle number
curl http://localhost:3000/api/vehicles?vehicleNumber=KA01AB1234

# Search by USN
curl http://localhost:3000/api/vehicles?usn=1BM19CS001
\`\`\`

**Example JavaScript:**
\`\`\`javascript
async function lookupVehicle(vehicleNumber) {
  const response = await fetch(
    `/api/vehicles?vehicleNumber=${encodeURIComponent(vehicleNumber)}`
  );
  return response.json();
}

// Or by USN
async function lookupByUSN(usn) {
  const response = await fetch(
    `/api/vehicles?usn=${encodeURIComponent(usn)}`
  );
  return response.json();
}
\`\`\`

---

### 4. Get All Vehicles (Admin)

Retrieve all registered vehicles.

**Endpoint:** `POST /api/vehicles`

**Content-Type:** `application/json`

**Request Body:**
\`\`\`json
{
  "action": "getAllVehicles"
}
\`\`\`

**Success Response (200 OK):**
\`\`\`json
{
  "success": true,
  "vehicles": [
    {
      "studentName": "John Doe",
      "usn": "1BM19CS001",
      "hostelRoom": "A-201",
      "vehicleNumber": "KA01AB1234",
      "registrationDate": "2025-01-15T10:30:00.000Z"
    },
    {
      "studentName": "Jane Smith",
      "usn": "1BM19CS002",
      "hostelRoom": "B-305",
      "vehicleNumber": "KA01CD5678",
      "registrationDate": "2025-01-10T14:22:00.000Z"
    }
  ],
  "count": 2
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "error": "Invalid action"
}
\`\`\`

**Example cURL:**
\`\`\`bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"action": "getAllVehicles"}'
\`\`\`

**Example JavaScript:**
\`\`\`javascript
async function getAllVehicles() {
  const response = await fetch('/api/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getAllVehicles' })
  });
  const result = await response.json();
  return result.vehicles;
}
\`\`\`

---

## Error Codes

| Code | Message | Explanation |
|------|---------|-------------|
| 400 | Bad Request | Missing or invalid required fields |
| 409 | Conflict | Vehicle already registered |
| 500 | Server Error | Internal server error, check logs |

## Rate Limiting

Currently not implemented. Add in production:
\`\`\`
- 100 requests per minute per IP
- 1000 requests per hour per IP
\`\`\`

## CORS

Endpoints support CORS for cross-origin requests. In production, configure allowed origins.

## Response Format

All responses are in JSON format with structure:
\`\`\`json
{
  "success": boolean,
  "data": { /* ... */ },
  "error": "error message (if any)",
  "message": "description"
}
\`\`\`

## Testing the APIs

### Using Postman

1. Create new Request
2. Set method to POST/GET
3. Enter URL: `http://localhost:3000/api/scan`
4. Add headers: `Content-Type: application/json`
5. Add request body
6. Click Send

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create new request
3. Fill in details and send

### Using cURL
See examples above for each endpoint.

---

## Webhooks (Future)

Planned webhook support:
- `vehicle.registered` - When new vehicle is registered
- `vehicle.scanned` - When vehicle is scanned
- `verification.failed` - When plate not found

---

## Changelog

### v1.0.0
- Initial API release
- 4 endpoints: register, scan, lookup, list all
- Mock OCR implementation
- MongoDB integration
