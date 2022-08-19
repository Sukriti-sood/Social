const mongoose = require("mongoose");
const { isEmail, contains } = require("validator");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "Must be valid email address"],
      },
    code: String,
    expireIn: Number
},{ timestamps: true }
)

module.exports = mongoose.model("otp", otpSchema, 'otp');