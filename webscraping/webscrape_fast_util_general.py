from webscrape_fast import *
import json
from concurrent.futures import ThreadPoolExecutor
from tqdm.auto import tqdm

def load_urls(filename):
    with open('data/' + filename) as f:
        urls = json.load(f)
    return urls

def get_all_data(func_data, urls, data=[], batch=[0, 0]):

    if not data:
        for _ in urls:
            data.append("not_loaded")

    if batch[1] == 0:
        batch[1] = len(data)

    executor = ThreadPoolExecutor()
    futures = [(batch[0] + i, executor.submit(func_data, urls[batch[0] + i])) for i, _ in filter(lambda x: isinstance(x[1], str) and x[1] != "<class 'ValueError'>", enumerate(data[batch[0]:batch[1]]))]
    for i, f in tqdm(futures):
        try:
            data[i] = f.result()
        except Exception as exc:
            data[i] = str(type(exc))
    return data

def save_data(data, filename):
    data_to_json = []
    for el in tqdm(data):
        if isinstance(el, str):
            data_to_json.append(el)
        else:
            data_to_json.append((el[0], json.loads(el[1].to_json())))
        
    with open('data/' + filename, 'w') as f:
        json.dump(data_to_json, f, indent=4)

def load_data(filename):
    with open('data/' + filename) as f:
        data_loaded_raw = json.load(f)
    data_loaded = []
    for el in tqdm(data_loaded_raw):
        if isinstance(el, str):
            data_loaded.append(el)
        else:
            data_loaded.append((el[0], pd.DataFrame.from_dict(el[1])))
    return data_loaded

def print_stats(data, urls, print_all_errored=False):
    errored = []
    loaded = 0
    for i, el in enumerate(data):
        if not isinstance(el, str):
            loaded += 1
        elif el != "not_loaded" and el != "<class 'ValueError'>":
            errored.append((i, el, urls[i]))

    print("loaded {}/{}".format(loaded, len(data)))
    print("errored {}/{}".format(len(errored), len(errored) + loaded))
    if (print_all_errored):
        print("all errored:")
        for el in errored:
            print(el)

    print(set([el for _, el, _ in errored]))