import { ErrorContext } from "../components/ErrorContext"
import { useContext } from "react"

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

const useFetchApi = () => {
    const { setIsMessageOn, setCurrentMessage, setCurrentSeverity } = useContext(ErrorContext);

    const setMessage = (message) => {
        setIsMessageOn(true);
        setCurrentMessage(message)
        setCurrentSeverity("error");
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
        }).catch(()=>
            setMessage("Network error")
        )
    
        const data = await res.json().catch(throwError(547, 'JSON Error'))
    
        if (data.error) {
            setMessage(data.error.message)
        }
    
        return data
    }
    
    return fetchApi;
}

export { useFetchApi, throwIf, throwError }