const deleteToken = (req,res) => {
    const options = {
        expires: new Date(0),
        httpOnly: true,
        secure: false
    }
    res.clearCookie('token',options);
    res.json({success: 'true'})
    return
}

module.exports = deleteToken