from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

import re
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup

import time

def get_city(driver, city_name):
    try:
        # searching city
        search = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "search-home")))
        search.clear()
        search.send_keys(city_name)
        results = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "autocomplete-item")))

        for r in results:
            if city_name + ',' in r.text: # can match undesired cities for example it can match Bielawy-Toruń instead of Toruń
                result = r

        result.click()

        # loading table html and parsing to put it in pd.Dataframe
        table = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "table-responsive")))

        html = table.get_attribute("innerHTML")

        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table')
        rows = table.tbody.find_all('tr')
        columns = [r.text.strip() for r in rows[0].find_all('th')]

        df = pd.DataFrame(columns=columns)

        for row in rows[1:]:    
            elements = [e.text.strip() for e in row.find_all('td')]
            for i in range(1, len(elements)):
                elements[i] = float(re.sub(r'\(.*?\)', '', elements[i]))
            df.loc[len(df.index)] = elements
    except:
        print("ERROR!")
    finally:
        return df
        
cities = ["Konin", "Swarzędz", "Kórnik", "Luboń", "Murowana Goślina", "Września", "Odolanów", "Oborniki", "Bydgoszcz", "Toruń"]

options = Options()
options.headless = True
options.add_argument("--window-size=800,600")
options.add_argument("disable-gpu")

driver = webdriver.Chrome(options=options)
driver.get("https://tcktcktck.org/")

# actual webscraping
start = time.time()

data = []
for city in cities:
    data.append(get_city(driver, city))

end = time.time()

# printing results
print("time: ", end-start, "\tcities: ", len(cities), "\ttime/cities: ", (end-start)/len(cities))

driver.close()

for c, df in zip(cities, data):
    print(c, " -----------------------------------------")
    print(df)
