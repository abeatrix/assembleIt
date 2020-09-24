/* EXTERNAL MODULES */
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash  = require('req-flash');
const MongoStore = require("connect-mongo")(session);

// SECURITY
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const cors = require("cors");
// logging
const morgan = require("mongoose-morgan");

/* INTERNAL MODULES */
const db = require("./models");
const controllers = require("./controllers");
const {notFound, methodNotAllowed} = require("./middleware/responseHandlers")
const authRequired = require("./middleware/authRequired")

/* INSTANCED MODULES */
const app = express();

/* CONFIGURATION*/

const corsOptions = {
    origin: ["https://assembleit.herokuapp.com/"], //set url for live app
    optionsSuccessStatus: 200, //for legacy ports where some legacy browsers will choke on status 204

}
app.use(cors(corsOptions));

// all uses of .env
require("dotenv").config();
const PORT = process.env.PORT;

app.set("view engine", "ejs")

//RATE LIMIT SETUP
const LIMIT = rateLimit({
    max: 10000,
    windowMs: 24 * 60 * 60 * 1000, //limited to 10k requests per 1 day in millisecond
    message: "Too many requests",
});

// MIDDLEWARE
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI || "mongodb://localhost:27017/assembleIt-sessions"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 24 * 7 * 2
    }
}));
app.use(flash());
app.use(function (req, res, next){
    res.locals.user = req.session.currentUser;
    next();
})
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});
//use rate limiting
app.use(LIMIT);
//HELMET - reset headers in response for security
//app.use(helmet());
// SANITIZE DATA coming in from req.body
app.use(mongoSanitize());
// logging
const morganOptions = {
    connectionString: process.env.MONGODB_URI,
}
app.use(morgan(morganOptions, {
    skip: function(req, res){ //adding this for tracking error only
        return res.statusCode < 400;
    }
}, "dev"));
// moment - formatting time
app.locals.moment = require('moment');


/* ROUTES */

// VIEW ROUTES
app.get("/", async (req, res) => {
    try {
        const foundPosts = await db.Post.find({});
        const allSubreddits = await db.Post.distinct("subreddit");
        const context = {
            posts: foundPosts,
            user: req.session.currentUser,
            subreddits: allSubreddits,
        };
        res.render("posts/index.ejs", context);
    } catch (error) {
        res.send({ message: "Internal server error" });
    }
});

// AUTH ROUTES
app.use("/", controllers.auth);

// USER ROUTES
app.use("/users", controllers.user);

// POSTS ROUTES
app.use("/posts", authRequired, controllers.post);

// RESPONSE MIDDLEWARE
app.get("/*", notFound);
app.use(methodNotAllowed);


// SERVER LISTENER
app.listen(process.env.PORT || 3000, function () {
    console.log(`server up and running on PORT ${PORT}`)
})


