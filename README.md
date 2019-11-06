# TRACT

Fully experimental project focused on usage of deep learning in computer vision\*. Basic goal is to provide on-line image processing (and particularly way to coloring gray-scale image based on provided colorful pattern). Project is available on-line on:

```sh
https://mysterious-ocean-98570.herokuapp.com/
```
Please be aware that newest verison is not deployed yet since the last big changes in project.

## Running app with Docker

App is splited into microservices and fully dockerized. Each service can be built independently (client, fileServer, cv_worker or e2e tests). To run whole stack type in terminal inside root directory:

```sh
make make-app
```

By default:

> file server is running on PORT 8081,
> cv worker is running on PORT 5000,
> client is served on port 3000.

You can also run each service individually by typing `docker-compose up <service_name>`. The whole configuration is placed in docker-compose.yml file , and can be adjusted for your needs.

## Development mode

In development mode you can run services without docker (please remember that client app relies on other services):

- for client app run `yarn install && yarn run start` inside client directory, 
- for file server run `npm install && npm run dev` inside fileServer directory,
- for cv_worker probably best way is to create new virtual environment. Personally I use [mkvirtualenv](https://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html) to manage this. Once you have new environment created run `pip install --no-cache-dir -r /tmp/requirements.txt` inside cv_worker dir and then `python server.py`

\*tensorflow model is part of repository but does not work as expected, currently solution based on k-means clustering is provided

## e2e tests

Tests are written with [cypress.io](https://www.cypress.io/). It's recommended to run them first to get general overview what's going on in this project. Once you run whole stack with `make dc-make-app` please navigate to e2e directory and run:
```sh
npm install && npm run cy:run
```

In this case you will see e2e tests running in Google Chrome. You can also run them via docker-compose by typing
```sh
make e2e
```
but in this case they are running in headless mode (only results in terminal)
