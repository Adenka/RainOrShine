from webscrape_fast import *
import json
from concurrent.futures import ThreadPoolExecutor
from tqdm.auto import tqdm

def load_cities_urls():
    with open('data/cities_urls.json') as f:
        cities_urls = json.load(f)
    return cities_urls

def get_all_cities_data(cities_data=[], batch=(0, 0), cities_urls=load_cities_urls()):
    if not cities_data:
        for _ in cities_urls:
            cities_data.append("not_loaded")

    if batch[1] == 0:
        batch[1] = len(cities_data())

    executor = ThreadPoolExecutor()
    futures = [(batch[0] + i, executor.submit(get_city_data, cities_urls[batch[0] + i])) for i, _ in filter(lambda x: isinstance(x[1], str) and x[1] != "<class 'ValueError'>", enumerate(cities_data[batch[0]:batch[1]]))]
    for i, f in tqdm(futures):
        try:
            cities_data[i] = f.result()
        except Exception as exc:
            cities_data[i] = str(type(exc))
    return cities_data

def save_cities_data(cities_data):
    cities_data_to_json = []
    for el in tqdm(cities_data):
        if isinstance(el, str):
            cities_data_to_json.append(el)
        else:
            cities_data_to_json.append((el[0], json.loads(el[1].to_json())))
        
    with open('data/cities_data.json', 'w') as f:
        json.dump(cities_data_to_json, f, indent=4)

def load_cities_data():
    with open('data/cities_data.json') as f:
        cities_data_loaded_raw = json.load(f)
    cities_data_loaded = []
    for el in tqdm(cities_data_loaded_raw):
        if isinstance(el, str):
            cities_data_loaded.append(el)
        else:
            cities_data_loaded.append((el[0], pd.DataFrame.from_dict(el[1])))
    return cities_data_loaded