// const tryCatchWrapper = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next)
//         } catch (error) {
//             console.log(error)
//             next(error)
//         }
//     }
//     // return async (...arguments) => {
//     //     try {
//     //         await fn(...arguments)
//     //     } catch (error) {
//     //         console.log(error)
//     //         next(error)
//     //     }
//     // }
// }

const tryCatchWrapper = (fn) => {
    return async (...args) => {
        try {
            await fn(...args)
        } catch (error) {
            console.log(error)
            if (typeof args[args.length - 1] === 'function') {
                args[args.length - 1](error)
            }
        }
    }
}

module.exports = tryCatchWrapper
