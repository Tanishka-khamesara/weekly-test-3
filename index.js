const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json()); // To parse JSON request bodies

function isUpperCase(char) {
    return char >= 'A' && char <= 'Z';
}

function isLowerCase(char) {
    return char >= 'a' && char <= 'z';
}

function containsAtSymbol(email) {
    return email.includes("@");
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10}$/; // Valid phone numbers are exactly 10 digits long
    return phoneRegex.test(phoneNumber);
}

const userRegistrationMiddleware = (req, res, next) => {
    const { firstName, lastName, password, email, phoneNumber } = req.body;

    // Validate first name
    if (firstName === "" || !isUpperCase(firstName.charAt(0))) {
        return res.status(400).json({
            message: "First name must start with an uppercase letter."
        });
    }

    // Validate last name
    if (lastName === "" || !isUpperCase(lastName.charAt(0))) {
        return res.status(400).json({
            message: "Last name must start with an uppercase letter."
        });
    }

    // Password validation
    const specialChars = "!@#$%^&*()_+[]{}|;':,.<>?"; // Define special characters
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasSpecialChar = false;
    let hasNumber = false;

    for (let i = 0; i < password.length; i++) {
        let char = password.charAt(i);
        if (isUpperCase(char)) {
            hasUpperCase = true;
        } else if (isLowerCase(char)) {
            hasLowerCase = true;
        } else if (specialChars.includes(char)) {
            hasSpecialChar = true;
        } else if (!isNaN(char) && char !== ' ') {
            hasNumber = true;
        }
    }

    if (!hasUpperCase || !hasLowerCase || !hasSpecialChar || !hasNumber) {
        return res.status(400).json({
            message: "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }

    // Validate email
    if (!containsAtSymbol(email)) {
        return res.status(400).json({
            message: "Email must contain '@'."
        });
    }

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({
            message: "Phone number must be exactly 10 digits long."
        });
    }

    next();
}

app.post("/user/registration/first", userRegistrationMiddleware, (req, res) => {
    res.send({
        message: "USER REGISTERED SUCCESSFULLY",
        welcomeMsg: "Hello User😎"
    });
});

app.listen(PORT, () => {
    console.log(`SERVER IS UP AND RUNNING ON PORT ${PORT}`);
});