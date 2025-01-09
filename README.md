OLA-HD frontend
===============

The OLA-HD frontend is the frontend for the [OLA-HD Service](https://github.com/subugoe/olahd_backend) build with [Vue.js](https://vuejs.org/).

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#run-the-application">Run the application</a></li>
    <li><a href="#run-tests">Run tests</a></li>
  </ol>
</details>


Introduction
------------
OLA-HD Service is one of the module projects funded within the DFG initiative OCR-D. The main goal
of OCR-D is the conceptual and technical preparation of the full text transformation of the 16th to
18th century prints published in the German language area. The task of automatic full-text
recognition will be broken down into its individual process steps, which can be reproduced in the
open source OCR-D software. This makes it possible to create optimal workflows for the prints to be
processed and thus generate scientifically usable full texts.

The goal of OLA-HD Service is to develop a productive service for long-term archiving of historical
prints in the context of OCR-D. This OLA-HD Service builds on the corresponding prototype from
OCR-D Phase II, extends it according to the requirements of the implementation projects, is
integrated into the OCR-D framework, and is generically designed and implemented according to the
tender requirements.


Run the application:
--------------------

### Prerequisites
To run, the OLA-HD Service currently uses the classic [yarn package
manager](https://classic.yarnpkg.com/lang/en/). This must be installed to run the frontend.

### Install and run the application
Clone this repository
```
git clone https://github.com/subugoe/olahd_user_frontend.git
cd olahd_user_frontend
```

### Install the project dependencies
`yarn install`

### Set OLA-HD Service backend URL
The frontend needs the backend to query search results and other data. The connection is set in the
file `src/axios-config.ts`. By default, the application is supposed to run with Docker, so the
`baseURL` is set to '/api/'. This is because the backend is expected to run on the same host and to
be available at path `api`. For development purposes, this could be changed to a local running
OLA-HD backend: `http://localhost:8080` or to the running service: `https://ola-hd.ocr-d.de/api`.

### Local startup
`yarn run dev` starts the frontend on the local machine.

### Docker startup
The frontend is supposed to be run together with the
[OLA-HD Service backend](https://github.com/subugoe/olahd_backend). Therefore docker-compose.yml is
provided in this repository. It expects the backend to be running alongside and in the same network
called `olahd`. If the backend runs according to its documentation the frontend can be started
simply with `docker-compose -f docker-compose.yml up -d` or with `docker-compose -f
docker-compose.yml -f docker-compose.https.yaml up -d` if HTTPS is used. In the latter case the
file `docker-compose.https.yaml` must be created according to `docker-compose.https.example.yaml`.

### Keycloak authentication
By default users are authenticated through the backend. Keycloak can optionally be configured to be
used to authenticated users. See `docker.env` for more information.


Run tests:
----------
OLA-HD Service uses Cypress E2E to test the application. The tests are executed on a running OLA-HD
Service application. Therefore the service must run locally. It is also possible for example to run
the tests on a remote-running instance of the service. The URL of the service (where the frontend is
available) must be set to `baseUrl` in the file `cypress.config.js`.

The tests can be started with `yarn run cypress open` which starts Cypress in a browser for running
the tests.

For some of the tests environment variables are needed. The password is necessary to upload data to
the OLA-HD Service. The environment variables can be set in the file `cypres.env.json`, for example:
```
{
    "PASSWORD": "xyz"
}
```
