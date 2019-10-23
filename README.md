# TRACT

Fully experimental project focused on usage of deep learning in computer vision\*. Basic goal is to provide on-line image processing (and particularly way to coloring gray-scale image based on provided colorful pattern). Project is available on-line on:

```sh
https://mysterious-ocean-98570.herokuapp.com/
```

## Running app with Docker

App is splited into microservices and fully dockerized. Each service can be built independently (client, fileServer and cv_worker). To run whole stack via single command just type

```sh
docker-compose up
```

By default:

> file server is running on PORT 8081,
> cv worker is running on PORT 5000,
> client is served on port 3000.

You can also run each service individually by typing `docker-compose up <service_name>`. The whole configuration can is placed in docker-compose.yml file , and can be adjusted to your needs.

## Development mode

In development mode you can run services without docker (please remember that client app relies on other services):

- for client app run `yarn install && yarn run start` inside client directory, 
- for file server run `npm install && npm run start` inside fileServer directory,
- for cv_worker probably best way is to create new virtual environment. Personally I use [mkvirtualenv](https://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html) to manage this. Once you have new environment created run `pip install --no-cache-dir -r /tmp/requirements.txt` inside cv_worker dir and then `python server.py`

\*tensorflow model is part of repository but does not work as expected, currently solution based on k-means clustering is provided
