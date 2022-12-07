const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const EmailVerificationToken = require('../models/emailVerificationToken')
const PasswordResetToken = require("../models/passwordResetToken")
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");

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
    if (alreadyHasToken) return sendError(res, 'You can request for a new code after an hour')

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

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) return sendError(res, 'Email is missing')

    const user = await User.findOne({ email })
    if (!user) return sendError(res, 'User Not Found', 404)

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id })
    if (alreadyHasToken) return sendError(res, 'You can request for a new code after an hour')

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token })
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`

    const transport = generateMailTransporter()

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: 'Reset Password Link',
        html: `
        <p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Change Password</a>
        `
    })

    res.json({ message: 'Link sent to your email' })
}

exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({ valid: true })
}

exports.resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;

    const user = await User.findById(userId)
    const matched = await user.comparePassword(newPassword)
    if (matched) return sendError(res, 'The new password cannot be same as old password')

    user.password = newPassword
    await user.save()

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id)

    const transport = generateMailTransporter()

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: 'Password Reset Successfuly',
        html: `
        <h1>Password Reset Successfuly</h1>
        <p>Now you can use your new password</p>
        `
    })

    res.json({ message: 'Password Reset Successfully, You can use your new password now' })
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) return sendError(res, 'Email/Password mismatch')

    const matched = await user.comparePassword(password)
    if (!matched) return sendError(res, 'Email/Password mismatch')

    const { _id, name } = user;

    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET)

    res.json({ user: { id: _id, name, email, token: jwtToken } })
}