// const existingUser = await User.findOne({ 'generatedPins.code': pinCode, 'generatedPins.status': 'unused' });
const existingUser = await User.findOne({ 'generatedPins': pinCode, 'status': 'unused' });
if (!existingUser) {
    throw new Error('Invalid or used pin code');
}

existingUser.status = 'used'
await existingUser.save()
// existingUser.generatedPins.find(pc => pc.code === pinCode).status = 'used';
// await existingUser.save();

await updateReferrals(existingUser, user);


const updateReferrals = async (user, newUser) => {
    // Check if the new user ID already exists in referrals of the parent user
    if (!user.referrals.includes(newUser._id)) {
        user.referrals.push(newUser._id);
        await user.save();
    }

    // Find the parent user based on pinCode
    const parentUser = await User.findOne({ 'generatedPins': user.pinCode, 'generatedPins.status': 'used' });
    console.log(parentUser);

    // If parent user exists, update its referrals and recursively update referrals for the parent
    if (parentUser && !parentUser.referrals.includes(newUser._id)) {
        parentUser.referrals.push(newUser._id);
        await parentUser.save();
        await updateReferrals(parentUser, newUser);
    }
};









// Referral middleware
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { updateUserLevel } from '../util/referralUtil.js';
import cron from 'node-cron';

// Function to periodically update user levels based on referrals
const updateReferralLevels = async () => {
    const users = await User.find();
    if(!users){
        throw new Error("Users not found")
    }
    for (const user of users) {
        const referrals = await User.find({ referredBy: user._id });
        await updateUserLevel(user, referrals.length);
    }
};

// Middleware to check user's referral count and update level
export const checkAndUpdateReferralLevels = asyncHandler(async (req, res, next) => {
    // cron.schedule('0 0 * * *', updateReferralLevels);
    // cron.schedule('* * * * *', updateReferralLevels);
    // updateReferralLevels(); 
    // setInterval(updateReferralLevels, 60000);
    setInterval(() => {
        console.log("Yes")
    }, 1000)
    next();
});

export default checkAndUpdateReferralLevels;









// Referral Util
// Function to update user level based on the number of referrals
export const updateUserLevel = async (user, referralCount) => {
    switch (true) {
        case referralCount >= 2187:
            user.level = "excel";
            break;
        case referralCount >= 729:
            user.level = "royalty";
            break;
        case referralCount >= 243:
            user.level = "elite";
            break;
        case referralCount >= 81:
            user.level = "emerald";
            break;
        case referralCount >= 27:
            user.level = "classical";
            break;
        case referralCount >= 9:
            user.level = "silicon";
            break;
        case referralCount >= 3:
            user.level = "sapphire";
            console.log("This sapphire case has been run")
            break;
        default:
            user.level = "beginner";
            break;
    }
    await user.save();
};