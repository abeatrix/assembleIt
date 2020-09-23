/* EXTERNAL MODULES */
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash  = require('req-flash');
const MongoStore = require("connect-mongo")(session);

/* INTERNAL MODULES */
const db = require("./models");
const controllers = require("./controllers");

/* INSTANCED MODULES */
const app = express();
const PORT = 3000;

app.set("view engine", "ejs")

// MIDDLEWARE
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "AverageAssemble",
    store: new MongoStore({
        url: "mongodb://localhost:27017/reddit-sessions"
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

app.locals.moment = require('moment');

const authRequired = (req, res, next) => {
    if(!req.session.currentUser){
        return res.redirect("/login");
    }
    next();
}


/* ROUTES */

// VIEW ROUTES
app.get("/", async (req, res) => {
    try {
        const foundPosts = await db.Post.find({});

        const context = {
            posts: foundPosts,
            user: req.session.currentUser,
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
app.use("/posts", controllers.post);


// SERVER LISTENER
app.listen(PORT, function () {
    console.log(`server up and running on PORT ${PORT}`)
})
