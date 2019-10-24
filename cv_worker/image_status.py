import pickle
from enum import Enum, unique
from os.path import exists, getsize

picklename = "data.pickle"


@unique
class ImgStatus(Enum):
    NOT_AVAILABLE = 0
    PROCESSED = 1
    READY = 2


def set_status(name, status):
    if not type(status) == ImgStatus:
        raise ValueError(f"status must be of type {ImgStatus.__str__}")
    if exists(picklename):
        with open(picklename, "rb") as handle:
            data = pickle.load(handle)
    else:
        data = {}
    data[name] = status
    with open(picklename, "wb") as handle:
        pickle.dump(data, handle)


def check_status(name):
    if getsize(picklename) > 0:
        with open(picklename, "rb") as handle:
            data = pickle.load(handle)
            return data.get(name, ImgStatus.NOT_AVAILABLE)
    return ImgStatus.NOT_AVAILABLE
