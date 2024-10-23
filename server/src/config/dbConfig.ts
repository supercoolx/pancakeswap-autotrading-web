import mongoose from "mongoose";

const connectDB_Mongo = async () => {
  try {
    const mongoDBUsername = process.env.MONGO_DB_USERNAME;
    const mongoDBPassword = process.env.MONGO_DB_PASSWORD;
    const mongoDBUrl = process.env.MONGO_DB_URL;
    const mongoDBName = process.env.MONGO_DB_NAME;

    const mongoUrl = mongoDBUrl
      ?.replace("<db_username>", mongoDBUsername || "")
      .replace("<db_password>", mongoDBPassword || "")
      .replace("<db_name>", mongoDBName || "");

    await mongoose.connect(mongoUrl || "", {});
    const db = mongoose.connection.db;
    console.log(`MongoDB connected to DB: ${db?.databaseName}\n`);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export { connectDB_Mongo };
