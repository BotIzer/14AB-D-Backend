const deleteToken = (req,res) => {
    const options = {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
    }
    res.clearCookie('token',options)
    res.end();
    return 
}

module.exports = deleteToken