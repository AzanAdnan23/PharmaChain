import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_CONN_STRING;

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}

export default dbConnect;
