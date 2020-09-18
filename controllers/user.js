const express = require("express");
const router = express.Router();

const db = require("../models");


// INDEX VIEW
router.get("/", async (req, res) => {
    try {
        const foundUsers = await db.Author.find({});
        const context = {
            users: foundUsers,
        }
        res.render("users/index", context);
    } catch (err){
        console.log(err);
        res.send({ message: "Internal Server Error "});
    }
});



// NEW VIEW
router.get("/new", (req, res) => {
    res.render("users/new")
})



// CREATE
router.post("/", (req, res) => {

    db.User.create(req.body, (err, createdUser) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        res.redirect("/auth/login")
    })
})



// SHOW
router.get("/:id", (req, res) => {
    db.User.findById(req.params.id).populate("posts").exec( (err, foundUser) => {                   //linking posts to user
        if(err){
            console.log(err);
            return res.send(err);
        }
        const context = { user: foundUser };
        res.render("users/profile", context);
    });
});



// EDIT




// UPDATE




// DELETE





module.exports = router;
