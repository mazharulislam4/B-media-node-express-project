import { config as Config } from "dotenv";

Config()

const config = {};

config.app = {
  port: parseInt(process.env.PORT) || 5000 ,
};

config.db = {
  url: process.env.DB_URL || "mongodb://127.0.0.1:27017",
};

config.jwt = {
  key: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRESIN || '2h'
}

config.cookie = {
  key: process.env.COOKIE_SECRET,
  name: process.env.COOKIE_NAME,
  expiresIn: parseInt(process.env.COOKIE_EXPIRESIN) || 120000
}


config.global = {
  secretKey: process.env.SECRET_KEY || 'dkjaoeruaweioru39udjg',
  baseURL: process.env.BASE_URL && process.env.PORT ? `${process.env.BASE_URL}${process.env.PORT}` : 'https://localhost:5000',
  email: process.env.EMAIL || null,
  pass: process.env.EMAIL_PASS || null
}

export default config;