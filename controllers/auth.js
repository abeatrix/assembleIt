const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");

/* BASE PATH */
// REGISTER FORM
router.get("/signup", (req, res) => {
    res.render("auth/signup");
});


// REGISTER POST
router.post("/signup", async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ username: req.body.username });
        if(foundUser){                                                                        // if username exists
            return res.send({ message: "Username exists"});
        }
        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        await db.User.create(req.body);

        res.redirect("/login");                                                              // redirect to login
    } catch(error) {
        res.redirect("404")                                                                 // redirect to 404 Page if there is an error
    }
});


// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("auth/login");
});


// LOGIN POST <- AUTHENTICATION
router.post("/login", async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ username: req.body.username });

        if(!foundUser){                                                                     // if user does not exist => error
            return res.send({message: "User does not exist"});
        }

        const match = await bcrypt.compare(req.body.password, foundUser.password);          // if user exist then compare login info with db

        if(!match){                                                                         //if login info doesn't match db
            return res.send({message: "Incorrect login info"})
        }

        req.session.currentUser = {                                                         // if login info match, create session for authentication
            username: foundUser.usernman,
            id: foundUser._id,
        }

        res.redirect("/")                                                                   // redirect to home after logged-in
    } catch(err) {
        res.send({ message: "Internal Server Error", err: err });
    }
})


// LOGOUT / DELETE SESSION
router.delete("/logout", async (req, res) => {
    await req.session.destroy();
    res.direct("/");                                                                        // redirect to home after logged-out
})




module.exports = router;
