const tryCatchWrapper = (fn) => {
    // return async (req, res, next) => {
    //     try {
    //         await fn(req, res, next)
    //     } catch (error) {
    //         console.log(error)
    //         next(error)
    //     }
    // }
    return async (...arguments) => {
        try {
            await fn(...arguments)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = tryCatchWrapper
