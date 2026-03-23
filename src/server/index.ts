const PORT = 5000;

import express from "express";
import cors from "cors";

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const publicPath = path.join(__dirname, "../public");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});