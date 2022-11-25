import re
import pandas as pd
from bs4 import BeautifulSoup
import requests

# countries
def get_countries_urls(timeout=20.0):
    base_url = "https://tcktcktck.org/countries"
    req = requests.get(base_url, timeout=timeout)
    soup = BeautifulSoup(req.text, "html.parser")
    table = soup.find("table", class_="tb1")

    countries_urls = []
    for a in table.find_all("a", href=True):
        countries_urls.append(a["href"])
    return countries_urls

# regions
def get_regions_urls(country_url, timeout=10.0):
    req = requests.get(country_url, timeout=timeout)
    return get_regions_urls_req(req)

def get_regions_urls_req(req):
    soup = BeautifulSoup(req.text, "html.parser")
    table = soup.find("div", class_="s7_m")

    regions_urls = []
    for a in table.find_all("a", href=True):
        regions_urls.append(a["href"])
    return regions_urls

# cities
def get_cities_urls(region_url, timeout=10.0):
    req = requests.get("https://tcktcktck.org" + region_url + "/locations", timeout=timeout)
    return get_cities_urls_req(req)

def get_cities_urls_req(req):
    soup = BeautifulSoup(req.text, "html.parser")
    table = soup.find("table", class_="tb10")

    cities_urls = []
    for a in table.find_all("a", href=True):
        cities_urls.append(a["href"])
    return cities_urls

# data
def get_city_data(city_url, timeout=10.0):
    req = requests.get(city_url, timeout=timeout)
    return get_city_data_req(req)

def get_city_data_req(req):
    soup = BeautifulSoup(req.text, "html.parser")
    header = soup.find("h1", class_="s_t")
    table_gene = soup.find("table", class_="tb9")

    general = [row.find_all('td')[1].text.strip() for row in table_gene.tbody.find_all('tr')[:4]]

    data = {
        "city" : header.text.strip().split(',')[0],
        "region" : general[1],
        "country" : general[0],
        "coords" : [float(general[2]), float(general[3])]
    }

    table_temp = soup.find("table", class_="tb6")
    rows = table_temp.tbody.find_all('tr')
    columns = [r.text.strip() for r in rows[0].find_all('th')]

    df = pd.DataFrame(columns=columns)
    for row in rows[1:]:    
        elements = [e.text.strip() for e in row.find_all('td')]
        for i in range(1, len(elements)):
            elements[i] = float(re.sub(r'\(.*?\)', '', elements[i]))
        df.loc[len(df.index)] = elements
    return data, df