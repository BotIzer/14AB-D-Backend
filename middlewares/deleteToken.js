const deleteToken = (req,res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }
    res.clearCookie('token',options);
    res.clearCookie('userInfo')
    res.json({success: 'true'})
    return
}

module.exports = deleteToken