import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { generatePin, getAllPins } from "../controllers/pinController.js";

const pinRoutes = express.Router();

pinRoutes.post("/generate", isLoggedIn, generatePin);
pinRoutes.get("/", getAllPins);

export default pinRoutes;