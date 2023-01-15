const generateWeather = () => {
    return {
        "Record high": Math.floor(Math.random() * 10000) / 100,
        "Average high": Math.floor(Math.random() * 10000) / 100,
        "Daily mean": Math.floor(Math.random() * 10000) / 100,
        "Average low": Math.floor(Math.random() * 10000) / 100,
        "Record low": Math.floor(Math.random() * 10000) / 100,

        "Average precipitation":        Math.floor(Math.random() * 10000) / 100,
        "Average precipitation days":   Math.floor(Math.random() * 3000) / 100,
        "Mean monthly sunshine hours":  Math.floor(Math.random() * 2400) / 100
    }
}

export const exampleData = [
    {
        placeId: 0,
        placeName: "Toruń",
        latitude: 53,
        longitude: 18.6,
        weather: generateWeather()
    },
    {
        placeId: 69,
        placeName: "Poznań",
        latitude: 52.4,
        longitude: 16.93,
        weather: generateWeather()
    },
    {
        placeId: 420,
        placeName: "Bydgoszcz",
        latitude: 53.12,
        longitude: 18,
        weather: generateWeather()
    },
    {
        placeId: 2137,
        placeName: "Wadowice",
        latitude: 49.9,
        longitude: 19.5,
        weather: generateWeather()
    },
];