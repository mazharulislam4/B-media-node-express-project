import cookieParser from "cookie-parser";
import cors from "cors";
import dotevn from "dotenv";
import express from "express";
import http from 'node:http';
import config from "./config.js";
import connectDB from "./db.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/common/errorHandler.js";
import Router from "./routes/index.js";
import SocketIo from "./socket/socket.js";


// main
const main = () => {
  dotevn.config();
  const app = express()
  const httpServer = http.createServer(app)
  // parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(config.cookie.key));
  app.use(cors({origin:'*'}));

  // routes
  app.get("/", (req, res) => {
    res.json({ x: "hello" });
  });

  // routers
  app.use(Router);



  // set engine
  app.set("view engine", "ejs");

  // DB connect
  connectDB(`${config.db.url}/practice1`)
    .then(() => {
      console.log("DB is connected!");
    
      // server
       httpServer.listen(config.app.port, () => {
        console.log(`server is running on ${config.app.port} port`);
      });
      // socekt 
      SocketIo(httpServer);
    })
    .catch((err) => {
      console.log(err);
    });

      // error handler
  app.use(notFoundHandler);
  app.use(errorHandler);
};

main();
