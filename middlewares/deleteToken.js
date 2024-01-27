const deleteToken = (req,res) => {
    const options = {
        httpOnly: true,
        secure: false
    }
    res.clearCookie('token',options);
    res.json({success: 'true'})
    return
}

module.exports = deleteToken