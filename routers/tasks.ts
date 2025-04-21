import express from "express";
import Task from "../models/Task";
import authorization, {ReqWithUser} from "../middleware/authorization";
import {Error} from "mongoose";

const taskRouter = express.Router();

taskRouter.post("/",authorization, async (req, res, next) => {
    try {
        const newTask = new Task({
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        await newTask.save();
        res.send(newTask);
    } catch (error) {
        if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

taskRouter.get("/",authorization, async (req, res, next) => {
    try {
        const user = (req as ReqWithUser).user;
        const userTasks = await Task.find({user: user._id});

        if (!userTasks) {
            res.status(404).send({error: "Task not found"});
        }

        res.send(userTasks);
    } catch (error) {
        if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

taskRouter.patch("/:id",authorization, async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = (req as ReqWithUser).user;

        const filter =  { _id: id, user: user._id };
        const update = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        };

        const updatedTask = await Task.findOneAndUpdate(
            filter,
            update,
        );

        if (!updatedTask) {
            res.status(403).send({ error: "Task not found or not owned by user" });
            return;
        }

        res.send(updatedTask);
    } catch (error) {
        if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

taskRouter.delete("/:id",authorization, async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = (req as ReqWithUser).user;

        const deletedTask = await Task.findOneAndDelete({
            _id: id,
            user: user._id
        });

        if (!deletedTask) {
            res.status(403).send({ error: "Task not found or not owned by user" });
            return;
        }

        res.send({message: "Task deleted"});

    }catch (error) {
        if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
            res.status(400).send(error);
        }
        next(error);
    }
});

export default taskRouter;