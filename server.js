import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotevn from 'dotenv';
import express from 'express';
import config from './config.js';
import connectDB from './db.js';
// import fs from 'node:fs'
// import https from 'node:https'
// import os from 'node:os';
import { errorHandler, notFoundHandler } from "./middlewares/common/errorHandler.js";
import { anyUploader } from './middlewares/uploader/uploader.js';
import Router from './routes/index.js';



// main 

const main =  ()=>{
    dotevn.config();
    const app = express();

// parser 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(config.cookie.key))
app.use(cors())
// routes 
app.get('/' , (req , res)=>{
    res.json({x:"hello"})
})

// test 
app.post('/' , anyUploader, (req , res)=>{

    res.json({body:req.body , file: req.files})
})

app.use(Router)

// error handler 
app.use(notFoundHandler)
app.use(errorHandler)

// set engine 
app.set('view engine' ,'ejs')

// DB connect 
connectDB(`${config.db.url}/practice1`).then(()=>{

    console.log("DB is connected!");
// server 

// const server = https.createServer()

app.listen(config.app.port , ()=>{
    console.log(`server is running on ${config.app.port} port`);
})

}).catch((err)=>{
    console.log(err);
})


}


main()