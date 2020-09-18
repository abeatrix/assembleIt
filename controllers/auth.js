const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");

/* BASE PATH */
// REGISTER FORM
router.get("/register", (req, res) => {
    res.render("auth/register");
})


// REGISTER POST
router.post("/register", async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ email: req.body.email });
        if(foundUser){
            return res.send({ message: "Account is already registered"});
        }
        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        await db.User.create(req.body);
    }
})


// LOGIN FORM



// LOGIN POST <- AUTHENTICATION



// LOGOUT / DELETE SESSION




module.exports = router;
