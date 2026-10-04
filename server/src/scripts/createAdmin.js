// Run from the server/ folder:
//   node src/scripts/createAdmin.js <username> <email> <password>
//
// Example:
//   node src/scripts/createAdmin.js sumati_admin admin@furnest.com SomeStrongPassword123
//
// If the username/email already exists as a regular user, this promotes
// that account to admin instead of creating a duplicate.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function main() {
    const [, , username, email, password] = process.argv;

    if (!username || !email || !password) {
        console.error("Usage: node src/scripts/createAdmin.js <username> <email> <password>");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
        user.isAdmin = true;
        await user.save();
        console.log(`Existing user "${user.username}" promoted to admin.`);
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            username,
            name: username,
            email,
            password: hashedPassword,
            isAdmin: true
        });
        console.log(`Admin account "${user.username}" created.`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((error) => {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
});
