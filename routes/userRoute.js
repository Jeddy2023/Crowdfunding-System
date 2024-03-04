import express from "express";
import { getAllReferrals, getAllUsers, loginUser, registerUser, userProfile } from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/profile", isLoggedIn, userProfile);
userRoutes.get('/', getAllUsers)
userRoutes.get('/referrals',isLoggedIn, getAllReferrals)

export default userRoutes;