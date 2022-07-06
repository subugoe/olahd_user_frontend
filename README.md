# OLA-HD Service

OLA-HD Service - Ein generischer Dienst für die Langzeitarchivierung historischer Drucke

**Note**

Das Ziel von OLA-HD Service ist die Entwicklung eines produktiven Dienstes für die Langzeitarchivierung von historischen Drucken im Rahmen von [OCR-D](https://ocr-d.de/). Auf dieser Website kann die prototypische Implementierung des Projekts ausprobiert werden. Über die Suche können in Kürze Archivobjekte gefunden, angesehen und heruntergeladen werden.

OLA-HD Service wird im Rahmen der DFG-Initiative [OCR-D](https://ocr-d.de/) gefördert. Das Hauptziel von OCR-D ist die konzeptionelle und technische Vorbereitung der Volltexttransformation der im deutschen Sprachraum erschienenen Drucke des 16.-18. Jahrhunderts. Die Aufgabe der automatischen Volltexterkennung wird in ihre einzelnen Prozessschritte zerlegt, die in der Open Source OCR-D-Software nachvollzogen werden können. Dies ermöglicht es, optimale Workflows für die zu prozessierenden Drucke zu erstellen und damit wissenschaftlich verwertbare Volltexte zu generieren. OLA-HD Service bietet einen Dienst für die Langzeitarchivierung dieser Ergebnisse.


# Overview

- [Getting Started (Developers)](#getting-started-developers)
  - [Prerequisites](#prerequisites)
  - [Environment setup](#environment-setup)
    - [Set up `nvm` and the recent stable version of `node.js`](#set-up-nvm-and-the-recent-stable-version-of-nodejs)
    - [Set up `global` project requirements via `npm`](#set-up-global-project-requirements-via-npm)
    - [Clone the repository](#clone-the-repository)
    - [Get the dependencies](#get-the-dependencies)
  - [Usage](#usage)
    - [`development mode` (hot reloading, error reporting, etc.)](#development-mode-hot-reloading-error-reporting-etc)
    - [`Linting`](#linting)
    - [`Testing`](#testing)
    - [`Building` the app for production](#building-the-app-for-production)


## Getting Started (Developers)

### Prerequisites

To get TIDO up and running you should have the following software installed:

- **curl**
- **yarn**

**Note**:

We recommend to make use of `nvm`, since there might be issues with npm regarding permissions.
The main purpose of `nvm` is to have multiple node versions installed in regards to different projects which might demand some sort of backwards compatibility.
It enables you to just switch to the appropriate node version.
Besides it also keeps track of resolving permission issues, since all your global installations go to your home directory (~/.nvm/) instead of being applied systemwide.

### Environment setup

#### Set up `nvm` and the recent stable version of `node.js`

**For MAC Users**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install stable
```

**For Linux/Ubuntu Users**
```bash
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
```

**Note**:
After the nvm installation is done, please `restart` your shell session once. That's due to changes to your profile environment.

#### Set up `global` project requirements via `npm`

```bash
npm install -g yarn
```

#### Clone the repository

```bash
git clone https://github.com/subugoe/olahd_user_frontend.git
```

#### Get the dependencies

Head over to your project directory, where you just cloned the repository to as described above and get all the dependencies needed by typing:

```bash
cd /path/to/projectdir
yarn install
```

That's it. You should now be able to run the Viewer.

### Usage

#### `development mode` (hot reloading, error reporting, etc.)

```bash
yarn serve
```

#### `Testing`

To test, run the application which loads applucation on port 8080, open a new terminal tab and run the below command:

```bash
yarn cypress
```

The OLAHD Service uses **Cypress E2E**; test suite.

Tests reside under **cypress/e2e/** and are supposed to have a file ending of either `*.cy.ts`.
