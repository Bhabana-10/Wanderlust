
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.js");

async function resetPassword() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

        const user = await User.findOne({ username: "sigma-student" });

        if (!user) {
            console.log("User sigma-student not found!");
            return;
        }

        await user.setPassword("SigmaNew123!");
        await user.save();

        console.log("Password reset successfully!");
        console.log("Username: sigma-student");
        console.log("New password: SigmaNew123!");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword();
