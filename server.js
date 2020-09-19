/* EXTERNAL MODULES */
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
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
}))

app.locals.moment = require('moment');

const authRequired = (req, res, next) => {
    if(!req.session.currentUser){
        return res.redirect("/login");
    }
    next();
}


/* ROUTES */

// AUTH ROUTES
app.use("/", controllers.auth);

// VIEW ROUTES
app.get("/", async (req, res) => {
    try {
        const foundPosts = await db.Post.find({});
        const context = {
          posts: foundPosts
        };
        res.render("posts/index.ejs", context);
      } catch (error) {
        res.send({ message: "Internal server error" });
      }
});



// USER ROUTES
app.use("/users", controllers.user);


// POSTS ROUTES
app.use("/posts", controllers.post);


//COMMENTS ROUTES
// app.use("/comments", controllers.comment);


// SERVER LISTENER
app.listen(PORT, function () {
    console.log(`server up and running on PORT ${PORT}`)
})
