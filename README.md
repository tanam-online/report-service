# Tanam Report Service

API is documented at Swagger [https://app.swaggerhub.com/apis-docs/isfanr/Tanam/1.0.0](https://app.swaggerhub.com/apis-docs/isfanr/Tanam/1.0.0).<br />

API is accessible on [api-report-tanam.herokuapp.com](https://api-report-tanam.herokuapp.com).<br />

This project was bootstrapped with [Express Generator](https://expressjs.com/en/starter/generator.html).

## Endpoints List

``` bash
[GET] '/' = Check if API is live
[GET] '/download/:landId/:timeStart?/:timeEnd?' = Download land report by land id
[GET] '/send-email/:id' = Send email to user by user id
```

## Available Scripts

In the project directory, you can run:

### `npm install`

Install required dependencies.

### `npm start`

Runs the app in the development mode.<br />
API will run on [http://localhost:6001](http://localhost:6001).

### `npm run dev`

Runs the app in the development mode with hot reload.<br />
API will run on [http://localhost:6001](http://localhost:6001).

### `npm run lint`

Checks if there is any warning or wrong in codes lint.

### `npm run lint-fix`

Checks if there is any warning or wrong in codes lint.<br />
And automatically fixes what can be fixed.

## Learn More

You can learn more in the [Express documentation](https://expressjs.com/).