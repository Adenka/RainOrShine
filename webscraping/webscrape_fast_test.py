from webscrape_fast import *

countries_urls = get_countries_urls()
print(countries_urls[0])
regions_urls = get_regions_urls(countries_urls[0])
print("https://tcktcktck.org" + regions_urls[0] + "/locations")
cities_urls = get_cities_urls(regions_urls[0])
print(cities_urls[0])
city_data = get_city_data(cities_urls[0])
data, df = city_data
print(data)
print(df)