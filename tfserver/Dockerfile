FROM tensorflow/tensorflow:1.8.0-py3

RUN apt-get update
RUN apt-get -y install netbase

RUN pip install Flask pillow numpy waitress
WORKDIR /usr/src/app
COPY . .

CMD [ "python", "tfserver.py" ]
