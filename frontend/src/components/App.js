import { Button } from "@mui/material"
import { fetchApi } from "../utils/apiMiddleware"

const App = () => {
    const buttonOnClick = async () => {
        const data = await fetchApi("cityId", {id: 5})
        console.log(data)
    }

    return (
        <Button onClick={buttonOnClick}>
            click to query
        </Button>
    )
}

export default App
