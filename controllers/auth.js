const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const users = require("../controllers/user")
const nodemailer = require('nodemailer');

/* BASE PATH */
// REGISTER FORM
router.get("/signup", (req, res) => {
    res.render("auth/signup", {user: req.session.currentUser});
});

// REGISTER FORM
router.get("/404", (req, res) => {
    res.render("auth/404", {user: req.session.currentUser});
});


// REGISTER USER
router.post("/signup", async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ username: req.body.username });
        const foundEmail = await db.User.findOne({ email: req.body.email });

        if(foundUser){                                                                        // if username exists
            req.flash('error', '*Username Exists');
            return res.redirect("signup");
        }

        if(foundEmail){                                                                        // if email exists
            req.flash('error', '*Email is already registered');
            return res.redirect("signup");
        }

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(req.body.password, salt);                             // hash password
        req.body.password = hash;

        await db.User.create(req.body);                                                      // create User

        res.redirect("/login");                                                              // redirect to login
    } catch(error) {
        req.flash('error', 'Your Username must be between 4 - 12 characters.');
        return res.redirect("404");                                                          // redirect to 404 Page if there is an error
    }
});


// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("auth/login", {user: req.session.currentUser});
});


// LOGIN POST <- AUTHENTICATION
router.post("/login", async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ username: req.body.username });

        if(!foundUser){                                                                     // if user does not exist => error
            req.flash('error', "User does not exist");
            return res.redirect("login");
        }

        // if(!foundUser.isVerified){
        //     req.flash('error', "Email is not verified. Please verify your email in your inbox before continue.");
        //     return res.redirect("login");
        // }

        const match = await bcrypt.compare(req.body.password, foundUser.password);          // if user exist then compare login info with db

        if(!match){                                                                         //if login info doesn't match db
            req.flash('error', "Incorrect login info");
            return res.redirect("login");
        }

        req.session.currentUser = {                                                         // if login info match, create session for authentication
            username: foundUser.username,
            id: foundUser._id,
        }

        res.redirect("/")                                                                   // redirect to home after logged-in
    } catch(err) {
        req.flash('error', err);
        return res.redirect("404");                                                         // redirect to 404 Page if there is an error
    }
})


// LOGOUT / DELETE SESSION
router.delete("/logout", async (req, res) => {
    await req.session.destroy();
    res.redirect("/");                                                                      // redirect to home after logged-out
})


//TOKEN ROUTES
// router.get("/confirmation", (req, res) => {
//     res.render("auth/confirmation", {user: req.session.currentUser});
// });

// router.post('/confirmation', users.confirmationPost);


// router.get("/resend", (req, res) => {
//     res.render("auth/resend", {user: req.session.currentUser});
// });
// router.post('/resend', users.resendTokenPost);

module.exports = router;
