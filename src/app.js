import express from 'express';
import cors from 'cors';

const app=express();

// app.use is a middleware function to parse json data 
// below are the configurations for parsing the incoming request body
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.static('public'));

// CORS Configuration
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",")||"http://localhost:5173",
    credential:true,
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
}))

// import the routes 
import healthCheckRouter from './routes/healthcheck.routes.js';
// so the app.use here is used, when a user hits the /api/v1/healthcheck endpoint
// it will be directed to healthCheckRouter and then the healthckeck is done in the controller via 
// the route defined in healthcheck.routes.js
app.use("/api/v1/healthcheck",healthCheckRouter);

app.get('/',(req,res)=>{
    res.send('Hello world!!!!!!!!!');
})

export default app;