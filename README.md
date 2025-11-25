# Student Parking Meter - License Plate Recognition System

A full-stack web application that uses camera-based license plate recognition to automatically manage student vehicle registration and verification.

## Features

- **Real-time Camera Capture** - Capture license plates directly from a webcam
- **License Plate OCR** - Automatic extraction of vehicle numbers from images
- **Student Registration** - Simple multi-step registration with student details
- **Vehicle Verification** - Instant lookup and verification of registered vehicles
- **MongoDB Storage** - Secure data storage with unique plate identifiers
- **Modern UI** - Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Next.js 16** - Full-stack framework
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **WebRTC** - Camera access

### Backend
- **Next.js API Routes** - REST API
- **Node.js** - Runtime
- **MongoDB** - NoSQL database
- **TypeScript** - Type safety

### License Plate Recognition
- **OCR Technology** - Supports Indian license plate format
- **EasyOCR / Tesseract** - Optional for production
- **Plate Validator** - Format validation and state code verification

## Project Structure

\`\`\`
student-parking-meter/
├── app/
│   ├── api/
│   │   ├── register/          # Vehicle registration endpoint
│   │   ├── scan/              # License plate scanning endpoint
│   │   └── vehicles/          # Vehicle lookup endpoint
│   ├── register/              # Registration page
│   ├── dashboard/             # Verification dashboard
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn components
│   └── camera-capture.tsx     # Camera capture component
├── lib/
│   ├── ocr-service.ts         # OCR utilities
│   ├── mongodb.ts             # MongoDB connection
│   ├── plate-validator.ts     # Plate validation
│   └── utils.ts               # Helper functions
├── public/                    # Static assets
├── README.md                  # Documentation
└── package.json               # Dependencies
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or cloud)
- Webcam for camera capture

### Step 1: Clone and Install

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd student-parking-meter

# Install dependencies
npm install
\`\`\`

### Step 2: Environment Setup

Create a `.env.local` file in the project root:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=parking_meter

# Next.js Environment
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

#### MongoDB Connection Compass Setup

1. **Download MongoDB Compass**
   - Go to https://www.mongodb.com/products/compass
   - Download and install for your OS

2. **Connect to Local MongoDB**
   - Open MongoDB Compass
   - Connection String: `mongodb://localhost:27017`
   - Click "Connect"

3. **Create Database**
   - Right-click in left sidebar
   - Select "Create Database"
   - Database name: `parking_meter`
   - Collection name: `vehicles`

4. **Create Indexes** (optional but recommended)
   \`\`\`javascript
   db.vehicles.createIndex({ vehicleNumber: 1 }, { unique: true })
   db.vehicles.createIndex({ usn: 1 })
   db.vehicles.createIndex({ registrationDate: 1 })
   \`\`\`

### Step 3: Run the Application

\`\`\`bash
# Development server
npm run dev

# Production build
npm run build
npm start
\`\`\`

Visit `http://localhost:3000` in your browser.

## Database Schema

### vehicles Collection

\`\`\`javascript
{
  _id: ObjectId,
  studentName: String,
  usn: String,              // University Serial Number
  hostelRoom: String,       // e.g., "A-201"
  vehicleNumber: String,    // License plate, e.g., "KA01AB1234"
  licensePlateImage: String, // Base64 encoded image
  registrationDate: Date
}
\`\`\`

## API Endpoints

### 1. Register Vehicle
**POST** `/api/register`

Request:
\`\`\`json
{
  "studentName": "John Doe",
  "usn": "1BM19CS001",
  "hostelRoom": "A-201",
  "vehicleNumber": "KA01AB1234",
  "licensePlateImage": "data:image/jpeg;base64,..."
}
\`\`\`

Response (201):
\`\`\`json
{
  "success": true,
  "message": "Vehicle registered successfully",
  "data": { ... }
}
\`\`\`

### 2. Scan License Plate
**POST** `/api/scan`

Request:
\`\`\`json
{
  "licensePlateImage": "data:image/jpeg;base64,..."
}
\`\`\`

Response (200):
\`\`\`json
{
  "success": true,
  "found": true,
  "student": {
    "studentName": "John Doe",
    "usn": "1BM19CS001",
    "hostelRoom": "A-201",
    "vehicleNumber": "KA01AB1234",
    "registrationDate": "2025-01-15T10:30:00Z"
  },
  "ocrConfidence": 0.92
}
\`\`\`

### 3. Lookup Vehicle
**GET** `/api/vehicles?vehicleNumber=KA01AB1234`

**GET** `/api/vehicles?usn=1BM19CS001`

Response (200):
\`\`\`json
{
  "success": true,
  "found": true,
  "student": { ... }
}
\`\`\`

## License Plate Format

The system supports Indian license plate format:

**Format**: `[State Code][District Code][Category][Serial Number]`

**Example**: `KA01AB1234`

- **State Code** (2 letters): KA (Karnataka), MH (Maharashtra), etc.
- **District Code** (2 digits): 01-99
- **Category** (1-2 letters): A-Z
- **Serial Number** (4 digits): 0001-9999

### Valid State Codes
\`\`\`
AP, AR, AS, BR, CG, CH, CT, DD, DL, DN, GA, GJ, HR, HP, JK, JH, 
KA, KL, LA, LD, MH, ML, MN, MP, MZ, NL, OR, OD, PB, PY, RJ, SK, 
TG, TR, TN, UP, UT, UK, WB
\`\`\`

## OCR Integration

### Current Implementation
- Mock OCR for development/testing
- Returns random valid plates for testing

### Production OCR Options

#### Option 1: EasyOCR (Recommended)
\`\`\`bash
pip install easyocr
\`\`\`

\`\`\`python
import easyocr
reader = easyocr.Reader(['en'])
results = reader.readtext('license_plate.jpg')
plate_number = ''.join([text[1] for text in results])
\`\`\`

#### Option 2: Tesseract OCR
\`\`\`bash
npm install tesseract.js
\`\`\`

\`\`\`typescript
const { createWorker } = require('tesseract.js');
const worker = await createWorker();
const result = await worker.recognize('image.jpg');
const text = result.data.text;
\`\`\`

#### Option 3: Third-party API
- **Plate Recognizer**: https://platerecognizer.com (specialized)
- **AWS Rekognition**: Amazon's ML service
- **Google Vision API**: Google's computer vision

## Deployment

### Deploy to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Dashboard → Settings → Environment Variables
\`\`\`

### Deploy to Other Platforms

#### Heroku
\`\`\`bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
\`\`\`

#### AWS, DigitalOcean, etc.
1. Build: `npm run build`
2. Start: `npm start`
3. Set environment variables in platform settings

## Troubleshooting

### Camera Access Denied
- Check browser permissions (Settings → Privacy → Camera)
- Use HTTPS in production
- Grant permission when prompted

### MongoDB Connection Error
- Verify MongoDB is running locally: `mongod`
- Check connection string in `.env.local`
- In MongoDB Compass, verify server is running

### OCR Not Working
- Ensure image is clear and well-lit
- Plate should be centered in frame
- Check console logs for debug information
- Use test plates: KA01AB1234, KA01CD5678

### License Plate Not Recognized
- Plate format must match Indian standard
- State code must be valid
- No special characters or formatting
- Example: KA01AB1234 (no spaces or dashes)

## Testing

### Test Accounts (Development)
\`\`\`
Vehicle 1: KA01AB1234 - John Doe
Vehicle 2: KA01CD5678 - Jane Smith
\`\`\`

### Manual Testing Flow
1. Visit `http://localhost:3000`
2. Click "Register Vehicle"
3. Fill in student details
4. Capture license plate (will use mock OCR)
5. Confirm registration
6. Visit Dashboard
7. Scan a plate to verify

## Performance Optimization

- **Image Compression**: Compress captured images before upload
- **Database Indexing**: Unique index on vehicleNumber for fast lookups
- **Caching**: Cache frequently accessed student records
- **CDN**: Use CDN for static assets in production

## Security Considerations

- **Input Validation**: All inputs validated before processing
- **Data Encryption**: Store sensitive data encrypted
- **Rate Limiting**: Implement rate limiting on API endpoints
- **CORS**: Configure CORS properly for production
- **Authentication**: Add user authentication for admin features

## Future Enhancements

- [ ] Admin dashboard with analytics
- [ ] Real-time SMS/Email notifications
- [ ] Vehicle history and audit logs
- [ ] Mobile app (React Native)
- [ ] Advanced OCR with ML models
- [ ] Payment integration for parking fees
- [ ] QR code generation for quick lookup
- [ ] Parking slot availability tracking
- [ ] Multi-campus support
- [ ] Integration with campus security system

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: parking-system@university.edu

## Changelog

### v1.0.0 (2025-01-24)
- Initial release
- Landing page with feature overview
- Multi-step registration process
- Real-time license plate scanning
- Vehicle verification dashboard
- MongoDB integration setup
- Comprehensive documentation
