import mongoose from "mongoose";

export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    try {
      return mongoose.connection.asPromise();
    } catch (error) {
      console.log(`Unable to connect to the Mongodb  ${error} `);
    }
  } else {
    try {
      const uri = process.env.MONGODB_URI as string;
      return mongoose.connect(uri);
    } catch (error) {
      console.log(`Unable to connect to the Mongodb  ${error} `);
    }
  }
}
