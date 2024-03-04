import Pins from '../models/Pins.js'
import asyncHandler from "express-async-handler"
import User from '../models/User.js';

export const generatePin = asyncHandler(async (req, res) => {
    const userFound = await User.findById(req.userAuth)

    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newPin = await Pins.create({
        user: userFound,
        pinCode
    });

    userFound.generatedPins.push(newPin._id)
    await userFound.save();

    res.status(201).json({
        status: "success",
        message: "Pin generated successfully",
        newPin,
    });
})

export const getAllPins = asyncHandler(async (req,res) => {
    const pins = await Pins.find()

    res.json({
        status: "success",
        message: "Pins fetched successfully",
        pins
    });
})