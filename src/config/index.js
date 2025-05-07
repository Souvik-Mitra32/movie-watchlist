require("dotenv").config();

const dbLocal = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    url: process.env.DB_URL,
}

const apiEx = {
    baseUrl: process.env.BASE_URL_EX,
    imgUrl: process.env.IMAGE_URL_EX,
    basicAuth: {
        username: process.env.USERNAME_EX,
        password: process.env.PASSWORD_EX,
    },
    tokenAuth: {
        apiKey: process.env.API_KEY_EX,
        bearerToken: process.env.BEARER_TOKEN_EX,
    }
}

module.exports = {
    dbLocal,
    apiEx,
}