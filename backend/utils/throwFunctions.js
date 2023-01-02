const throwError = (code, message) => (error) => {
    throw { code, message }
}

const throwIf = (func, code, message) => (res) => {
    if (func(res)) {
        return throwError(code, message)()
    } else {
        return res
    }
}

module.exports = { throwError, throwIf }