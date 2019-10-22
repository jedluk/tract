# TRACT

Fully experimental project focused on usage of deep learning in computer vision\*. Basic goal is to provide on-line image processing (and particularly way to coloring gray-scale image based on provided colorful pattern). Project is available on-line on:

```sh
https://mysterious-ocean-98570.herokuapp.com/
```

## Installation

App is splited into microservices and fully dockerized. Each service can be built independently (client, fileServer and cv_worker). To run whole stack via single command just type

```sh
docker-compose up
```

By default:

> file server is running on PORT 8081,
> cv worker is running on PORT 6300,
> client is served on port 3000.

You can change the whole configuration in docker-compose.yml file

\*tensorflow model is part of repository but does not work as expected, currently solution based on k-means clustering is provided
