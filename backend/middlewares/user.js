const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");

exports.isValidPassResetToken = async (req, res, next) => {
    const {token, userId} = req.body;

    if(!token.trim() || !isValidObjectId(userId)) return sendError(res, 'Invalid Request')

    const resetToken = await PasswordResetToken.findOne({owner: userId})
    if(!resetToken) return sendError(res, 'Unauthorized access')

    const matched = await resetToken.compareToken(token)
    if(!matched) sendError(res, 'Unauthorized access - Invalid token')

    req.resetToken = resetToken
    next()
}