import "dotenv/config";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

import router from "./src/routes";
import { connectDB_Mongo } from "./src/config/dbConfig";

const port = process.env.PORT;

const app = express();

connectDB_Mongo();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(router);

const clientPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientPath));
app.get('*', function(_, res) {
    res.sendFile('index.html', {root: clientPath});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
