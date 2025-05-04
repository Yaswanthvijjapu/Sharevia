const mongoose = require('mongoose');

let gfs;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Initialize GridFS
    gfs = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'uploads',
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Export gfs and connectDB
module.exports = { connectDB, getGfs: () => gfs };