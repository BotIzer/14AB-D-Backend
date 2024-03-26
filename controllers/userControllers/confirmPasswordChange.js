const tryCatchWrapper = require('../../middlewares/tryCatchWrapper')
const User = require('../../models/userModel')
const { StatusCodes } = require('http-status-codes')
const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const { noUserFoundError } = require('../../errors/userErrors/userErrors')
const nodemailer = require('nodemailer')

const confirmPasswordChange = tryCatchWrapper(async (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmailhu',
        host: 'pop.gmail.hu',
        port: 110,
        secure: false,
        auth: {
            user: 'blitzforfriends@gmail.hu',
            pass: 'BffPasswd1234.',
        },
    })

    var mailOptions = {
        from: 'blitzforfriends@gmail.hu',
        to: 'lajtai.benjamin@students.jedlik.eu',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    }) 
    return res.status(200).json({'message': 'Password changed successfully!' })
})

module.exports = confirmPasswordChange
