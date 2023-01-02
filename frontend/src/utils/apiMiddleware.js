const address = 'http://localhost:5000/api'

const throwError = (code, message) => (error) => {
    throw { code, message }
}

const throwIf = (func, code, message) => (res) => {
    if (!func(res)) {
        return res
    } else {
        return throwError(code, message)()
    }
}

const fetchApi = async (endpoint, args) => {
    const res = await fetch(address, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            endpoint,
            args
        }),
    }).catch(throwError(683, 'Network Error')) //ustandaryzowac bledy!!!

    const data = await res.json().catch(throwError(547, 'JSON Error'))

    if (data.error) {
        throw JSON.stringify(data.error)
    }

    return data
}

export { fetchApi, throwIf, throwError }