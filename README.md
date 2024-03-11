# Backend of my Pokemon game

API Rest in NodeJS to control the Pokemon fights of my application

## Instalation

> Pre-requisites: docker & docker-compose

1. Download or clone this repo

```bash
git clone https://github.com/pacsanmanu/ProjectBackend.git
cd ProjectBackend
```

2. Install npm dependencies

```bash
npm i
```

3. Copy & configure env file

```bash
npm run copy:env
```

4. Run a MongoDB Docker container

```bash
npm run compose:app
```

5. Verify installation: Access http://localhost:3000 to check if the API is running.

By default, the app deploy on port 3000. To use the app you can:
    - **SwaggerUI** go to [localhost:3000/docs](http://localhost:3000/api-docs) to see swagger playground
    - **Postman** Use the provided [postman collectión](.postman_collection.json).

## Architecture

```bash
📦pokemon-api
 ┣ 📂.vscode
 ┃ ┗ 📜launch.json # Debugging configuration file
 ┣ 📂docker
 ┃ ┣ 📜docker-compose.app.yml # Build and deploy app
 ┃ ┗ 📜docker-compose.test.yml # Deploy Sonarqube
 ┣ 📂src
 ┃ ┣ 📂config # Modules configurations
 ┃ ┣ 📂controllers # API controllers
 ┃ ┣ 📂loaders # Setup server and services on load
 ┃ ┣ 📂middlewares # API middlewares
 ┃ ┣ 📂models # API models
 ┃ ┣ 📂openapi # Openapi (Swagger v3) specification
 ┃ ┣ 📂routes # API routes
 ┃ ┣ 📂services # External services
 ┃ ┣ 📂utils # Utils to make code easier
 ┃ ┣ 📜app.js # App main
 ┃ ┣ 📜config.js # Centralize user variables
 ┃ ┗ 📜index.js # Launch app
 ┣ 📂test
 ┃ ┗ 📜sonar.js
 ┣ 📜.dockerignore
 ┣ 📜.editorconfig
 ┣ 📜.env
 ┣ 📜.env.template
 ┣ 📜.eslintrc.json
 ┣ 📜.gitattributes
 ┣ 📜.gitignore
 ┣ 📜Dockerfile
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜postman_collection.json
 ┣ 📜postman_environment.json
 ┣ 📜README.md
 ┗ 📜requirements.md
```

## Main dependencies

- `express`
- `express-openapi`
- `swagger-ui-express`
- `morgan`
- `winston`
- `cors`
- `dotenv`
- `jsonwebtoken`

## Test

There are npm script created to easily run test:

- `npm run test`
- `npm run test:watch`
- `npm run test:report` Must be sonarqube running
    - To run sonarqube server: `npm run compose:test`
    - First time deploy: user _admin_, password: _admin_
        - change password to _adminadmin_
    - After the report go to [localhost:9000](http://localhost:9000/) and see analysis