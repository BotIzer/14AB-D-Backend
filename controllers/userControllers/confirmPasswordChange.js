const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { noUserFoundError } = require('../../errors/userErrors/userErrors')
const nodemailer = require('nodemailer')

const confirmPasswordChange = tryCatchWrapper(async (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    })

    var mailOptions = {
        from: { name: 'BlitzForFriends', address: process.env.EMAIL },
        to: 'lajtai.benjamin@students.jedlik.eu',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html: '<b><i>That was easy!</i></b>',
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
    return res.status(200).json({ message: 'Password changed successfully!' })
})

module.exports = confirmPasswordChange
