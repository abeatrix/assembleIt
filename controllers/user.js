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




module.exports = router;
