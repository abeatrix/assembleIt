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
        res.render("user/index", context);
    } catch (err){
        console.log(err);
        res.send({ message: "Internal Server Error "});
    }
});



// NEW VIEW
router.get("/new", (req, res) => {
    res.render("user/new")
})



// CREATE
router.post("/", (req, res) => {

    db.User.create(req.body, function (err, createdUser) {
        if(err){
            console.log(err);
            return res.send(err);
        }
        res.redirect("/auth/login")
    })
})



// SHOW




// EDIT




// UPDATE




// DELETE





module.exports = router;
