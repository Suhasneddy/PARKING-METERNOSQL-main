# MongoDB Setup Guide for Student Parking Meter

This guide explains how to set up and connect MongoDB Compass for data storage.

## What is MongoDB?

MongoDB is a NoSQL database that stores data in flexible JSON-like documents. Perfect for our parking meter system because:
- No strict schema required
- Easy to scale
- Fast queries with indexing
- Cloud and local options

## Installation Options

### Option 1: MongoDB Community Edition (Local)

#### Windows
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install as Service"
4. Complete the installation

#### macOS
\`\`\`bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
\`\`\`

#### Linux (Ubuntu)
\`\`\`bash
# Import GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
\`\`\`

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster
4. Get connection string
5. Add to `.env.local`:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   \`\`\`

### Option 3: Docker

\`\`\`bash
# Pull MongoDB image
docker pull mongo:latest

# Run container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# View logs
docker logs mongodb
\`\`\`

## MongoDB Compass Installation

1. Download: https://www.mongodb.com/products/compass
2. Install for your operating system
3. Launch the application

## Connect Compass to MongoDB

### Local Connection
1. Open MongoDB Compass
2. Use default connection string: `mongodb://localhost:27017`
3. Click "Connect"

### Atlas (Cloud) Connection
1. In Atlas, click "Connect"
2. Select "Connect with MongoDB Compass"
3. Copy connection string
4. Paste in MongoDB Compass
5. Click "Connect"

## Create Database and Collections

### Using Compass UI

1. In the left sidebar, click "Create Database"
2. Enter database name: `parking_meter`
3. Enter collection name: `vehicles`
4. Click "Create Database"

### Using MongoDB Shell (Alternative)

\`\`\`bash
# Start MongoDB shell
mongosh

# Create database
use parking_meter

# Create collection
db.createCollection("vehicles")

# Verify
show collections
\`\`\`

## Create Indexes

Indexes speed up queries significantly. Create these indexes:

### Using Compass
1. Navigate to `parking_meter` → `vehicles` collection
2. Go to "Indexes" tab
3. Add new index:
   - Field: `vehicleNumber`
   - Type: Ascending
   - Options: Unique

4. Add second index:
   - Field: `usn`
   - Type: Ascending

### Using Shell
\`\`\`bash
use parking_meter

# Unique index on vehicle number
db.vehicles.createIndex({ vehicleNumber: 1 }, { unique: true })

# Index on USN
db.vehicles.createIndex({ usn: 1 })

# Index on registration date
db.vehicles.createIndex({ registrationDate: 1 })

# View all indexes
db.vehicles.getIndexes()
\`\`\`

## Insert Sample Data

### Using Compass

1. Go to `parking_meter` → `vehicles` collection
2. Click "Add Data" → "Insert Document"
3. Click "Insert" and fill in:

\`\`\`json
{
  "studentName": "John Doe",
  "usn": "1BM19CS001",
  "hostelRoom": "A-201",
  "vehicleNumber": "KA01AB1234",
  "licensePlateImage": "base64_encoded_image_here",
  "registrationDate": new Date()
}
\`\`\`

### Using Shell

\`\`\`bash
use parking_meter

db.vehicles.insertMany([
  {
    studentName: "John Doe",
    usn: "1BM19CS001",
    hostelRoom: "A-201",
    vehicleNumber: "KA01AB1234",
    licensePlateImage: "",
    registrationDate: new Date()
  },
  {
    studentName: "Jane Smith",
    usn: "1BM19CS002",
    hostelRoom: "B-305",
    vehicleNumber: "KA01CD5678",
    licensePlateImage: "",
    registrationDate: new Date()
  }
])

# Verify insertion
db.vehicles.find().pretty()
\`\`\`

## Common Queries

### Find Vehicle by Plate
\`\`\`javascript
db.vehicles.findOne({ vehicleNumber: "KA01AB1234" })
\`\`\`

### Find All Vehicles by Student
\`\`\`javascript
db.vehicles.findOne({ usn: "1BM19CS001" })
\`\`\`

### Update Vehicle Information
\`\`\`javascript
db.vehicles.updateOne(
  { vehicleNumber: "KA01AB1234" },
  { $set: { hostelRoom: "A-202" } }
)
\`\`\`

### Delete Vehicle
\`\`\`javascript
db.vehicles.deleteOne({ vehicleNumber: "KA01AB1234" })
\`\`\`

### Count Total Vehicles
\`\`\`javascript
db.vehicles.countDocuments()
\`\`\`

### Get All Vehicles Registered Today
\`\`\`javascript
db.vehicles.find({
  registrationDate: {
    $gte: new Date(new Date().setHours(0,0,0,0))
  }
})
\`\`\`

## Backup and Restore

### Backup (Linux/macOS)
\`\`\`bash
mongodump --db parking_meter --out ./backup

# With authentication
mongodump --username user --password pass --db parking_meter --out ./backup
\`\`\`

### Restore
\`\`\`bash
mongorestore --db parking_meter ./backup/parking_meter
\`\`\`

### Backup in Windows
\`\`\`bash
mongodump --db parking_meter --out C:\backup
\`\`\`

## Troubleshooting

### MongoDB Server Not Running
\`\`\`bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - check Services app
\`\`\`

### Connection Refused Error
- Ensure MongoDB is running on port 27017
- Check firewall settings
- Verify connection string is correct

### Authentication Failed (Atlas)
- Double-check username and password
- Ensure IP address is whitelisted in Atlas
- Verify connection string format

### Database Size Too Large
\`\`\`javascript
// Check collection sizes
db.collection.stats()

// Delete old records
db.vehicles.deleteMany({
  registrationDate: {
    $lt: new Date(Date.now() - 365*24*60*60*1000) // older than 1 year
  }
})
\`\`\`

## Performance Tips

1. **Always index search fields** - vehicleNumber, usn
2. **Limit returned fields** - Only fetch needed columns
3. **Use projection** - `db.vehicles.find({}, { studentName: 1, vehicleNumber: 1 })`
4. **Batch operations** - Insert/update multiple records at once
5. **Monitor with Compass** - View query performance and resource usage

## Security Best Practices

1. **Strong passwords** - Use complex passwords
2. **IP Whitelisting** - Restrict access to known IPs
3. **Encryption** - Enable encryption at rest and in transit
4. **Backups** - Regular automated backups
5. **Principle of Least Privilege** - Use minimal required permissions
