const User = require("../models/user")
const EmailVerificationToken = require('../models/emailVerificationToken')
const nodemailer = require("nodemailer");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError } = require("../utils/helper");

exports.create = async (req, res) => {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email })
    if (oldUser) return sendError(res, 'This email is already in use')

    const newUser = new User({ name, email, password })
    await newUser.save();

    let OTP = generateOTP()

    const newEmailVerificationToken = new EmailVerificationToken({ owner: newUser._id, token: OTP })

    await newEmailVerificationToken.save()

    var transport = generateMailTransporter()

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
        <p>Your verification code</p>
        <h1>${OTP}</h1>
        `
    })

    res.status(201).json({ message: 'Please verify your email. verification code has been sent to your email' })
}

exports.verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;

    if (!isValidObjectId(userId)) return res.json({ error: 'Invalid user' })

    const user = await User.findById(userId)
    if (!user) return sendError(res, 'User Not Found', 404)

    if (user.isVerified) sendError(res, 'User is already verified')

    const token = await EmailVerificationToken.findOne({ owner: userId })
    if (!token) return sendError(res, 'Token Not Found')

    const isMatched = await token.compareToken(OTP)
    if (!isMatched) return sendError(res, 'Please submit a valid code')

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id)

    var transport = generateMailTransporter()

    transport.sendMail({
        from: 'welcome@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email',
        html: `<h1>Welcome to our app and thanks for choosing us.</h1>`
    })

    res.json({ message: "Your email is verified" })

}

exports.resendEmailVerificationToken = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId)
    if (!user) return sendError(res, "User Not Found")

    if (user.isVerified) return sendError(res, "This email is already verified")

    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId })
    if (alreadyHasToken) return sendError(res, 'You can request for a new code')

    let OTP = generateOTP();

    const newEmailVerificationToken = new EmailVerificationToken({ owner: user._id, token: OTP })

    await newEmailVerificationToken.save()

    var transport = generateMailTransporter()

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
        <p>Your verification code</p>
        <h1>${OTP}</h1>
        `
    })

    res.json({ message: 'New verification code has been sent to your email' })
}