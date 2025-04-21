import express from "express";
import User from "../models/User";
import {Error} from "mongoose";

const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });
        newUser.generateToken();
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

userRouter.post("/sessions", async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            res.status(400).send({message: "User not found"});
            return;
        }

        if(!req.body.password){
            res.status(400).send({error: "Enter your password"});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            res.status(400).send({error: "Invalid password"});
            return;
        }

        user.generateToken();
        await user.save();
        res.send({message: "Username and password correct", user});
    } catch (error) {
        next(error);
    }
});

export default userRouter;
