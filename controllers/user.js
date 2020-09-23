const express = require("express");
const router = express.Router();

const db = require("../models");


// INDEX VIEW
router.get("/", async (req, res) => {
    try {
        const foundUsers = await db.User.find({});
        const context = {
            users: foundUsers,
            user: req.session.currentUser,
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
        res.redirect("/auth/login")                                                                //redirect to login page after signup
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
router.get("/:id/edit", (req, res) => {
    db.User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        const context = { user: foundUser };
        res.render("users/edit", context)
    });
});



// UPDATE
router.put("/:id", (req, res) => {
    db.User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedUser) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        res.redirect(`${updatedUser._id}`);
    });
});

// USER DEACTIVATE VIEW
router.get("/:id/deactivate", (req, res) => {
    db.User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        const context = { user: foundUser };
        res.render("users/delete", context)
    });
})

// DELETE
router.delete("/:id", (req, res) => {
    db.User.findByIdAndDelete(req.params.id, (err, deletedUser) => {                                // remove posts by users after user is deleted
        if(err){
            console.log(err);
            return res.send(err);
        }
        db.Post.remove({user: deletedUser._id}, (err, removedPosts) => {
            if(err){
                console.log(err);
                return res.send(err);
            }
            req.session.destroy();
            res.redirect("/")
        });
    });
});



module.exports = router;
