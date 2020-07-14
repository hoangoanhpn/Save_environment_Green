//Get data from .env file
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const cors = require('cors');
const http = require("http");
const morgan = require("morgan");
const cluster = require("cluster");

const router = express.Router;

const upload = require("./routes/upload");

const app = express();
const port = process.env.PORT;

//const userRoutes = require('./routes/user');
const deviceRoutes = require("./routes/device");
const mlRoutes = require("./routes/ml");

let workers = [];

const setupWorkerProcesses = () => {
    //to read the number of cores on system
    let numCores = require("os").cpus().length;
    console.log("Master cluster setting up " + numCores + " workers ");

    // iterate on number of cores need to be utilized by an application
    // current example will utilize all of them
    for(let i = 0; i < numCores; i++) {
        // creating workers and pushing reference in an array
        // these references can be used to receive messages from workers
        workers.push(cluster.fork());

        // to receive messages from worker process
        workers[i].on("message", function(message) {
            console.log("Message is " + message);
        });
    }

    // process is clustered on a core and process id is assigned
    cluster.on("online", function(worker) {
        console.log("Worker " + worker.process.pid + " is listening");
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on("exit", function(worker, code, signal) {
        console.log("Worker " + worker.process.pid + " died with code: " + code + ", and signal: " + signal);
        console.log("Starting a new worker");
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length-1].on("message", function(message) {
            console.log(message);
        });
    });
};

/**
 * Setup an express server and define port to listen all incoming requests for this application
 */
const setupExpress = () => {
    //create server
    app.server = http.createServer(app);

    //logger
    app.use(morgan("tiny"));

    //cors
    app.use(cors());

    //parse application/json
    app.use(bodyParser.json({
        limit: "2000kb",
    }));
    app.use(bodyParser.urlencoded({extended: true}));
    app.disable("x-powered-by");
    app.disable("etag");

    // routes
    //app.use('/user', userRoutes);
    app.use("/api/devices", deviceRoutes);
    app.use("/api/ml", mlRoutes);
    //app.use('/uploads', express.static('uploads'));
    app.use(express.static(__dirname + "/public"));
    app.use(upload);

    //start server
    app.server.listen(port, () => {
        console.log(`Started server on => http://localhost:${app.server.address().port} for Process Id ${process.pid}`);
    });

    (async () => {
        try {
            mongoose.Promise = global.Promise;
            await mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true
            }).then(() => { console.log("MONGODB Database is connected");});
            mongoose.set("useFindAndModify", false);
        } catch (err) {
            console.error(err);
        }
    })();

    //in case of an error
    app.on("error", (appErr, appCtx) => {
        console.error("app error", appErr.stack);
        console.error("on url", appCtx.req.url);
        console.error("with headers", appCtx.req.headers);
    });
};

/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 */
const setupServer = (isClusterRequired) => {

    // if it is a master process then call setting up worker process
    if(isClusterRequired && cluster.isMaster) {
        setupWorkerProcesses();
    } else {
        // to setup server configurations and share port address for incoming requests
        setupExpress();
    }
};

setupServer(true);

app.get("/", (req, res) => {
   res.send("My Backend");
});

module.exports = {router, app};
