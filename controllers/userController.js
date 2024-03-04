import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler"
import generateToken from "../util/generateToken.js";
import Pins from "../models/Pins.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, pinCode } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if email is in correct format
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email address format");
    }
    //Check if the user exists in the database already
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
        throw new Error("Email already in use");
    }

    const pin = await Pins.findOne({ 'pinCode': pinCode, 'pinStatus': 'unused' })
    if(!pin){
        throw new Error("Pin not available")
    }
    const existingUser = await User.findOne({ 'generatedPins': pin._id });
    if(!existingUser){
        throw new Error("User not found")
    }

    pin.pinStatus = 'used';
    await pin.save();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        userName,
        email,
        password: hashedPassword,
        pinCode
    });

    user.referredBy.push(existingUser._id)
    if(existingUser.referredBy.length > 0){
        existingUser.referredBy.forEach((referredByUser) => {
            user.referredBy.push(referredByUser._id)
        })
    }
    await user.save();

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: user,
    });
});

// Controller to handle user login
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (userFound && (await bcrypt.compare(password, userFound.password))) {
        res.json({
            status: "success",
            message: "User logged in successfully",
            userFound,
            token: generateToken(userFound._id),
        });
    } else {
        throw new Error("Invalid email or password");
    }
})

// Controller to get logged in user
export const userProfile = asyncHandler(async (req, res) => {
    const userFound = await User.findById(req.userAuth)

    res.json({
        status: "success",
        message: "User profile fetched successfully",
        userFound
    });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const userFound = await User.find()

    res.json({
        status: "success",
        message: "User profile fetched successfully",
        userFound
    });
});

export const getAllReferrals = asyncHandler(async (req, res) => {
    const userFound = await User.findById(req.userAuth)

    const referrals = await User.find({ referredBy: userFound });
    const referralCount = referrals.length;
    switch (true) {
        case referralCount >= 2187:
            userFound.level = "excel";
            break;
        case referralCount >= 729:
            userFound.level = "royalty";
            break;
        case referralCount >= 243:
            userFound.level = "elite";
            break;
        case referralCount >= 81:
            userFound.level = "emerald";
            break;
        case referralCount >= 27:
            userFound.level = "classical";
            break;
        case referralCount >= 9:
            userFound.level = "silicon";
            break;
        case referralCount >= 3:
            userFound.level = "sapphire";
            break;
        default:
            userFound.level = "beginner";
            break;
    }
    await userFound.save();

    res.status(200).json({
        status: "success",
        message: "All referrals found successfully",
        data: referralCount,
        userFound
    });
})