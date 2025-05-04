// config/db.js
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
console.log(`MongoDB Connected`);
  const db = mongoose.connection;
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
};

const getGFS = () => gfs;

module.exports = { connectDB, getGFS };
