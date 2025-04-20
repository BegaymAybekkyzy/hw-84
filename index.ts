import express from "express";
import userRouter from "./routers/users";
import taskRouter from "./routers/tasks";
import mongoose from "mongoose";
import config from "./config";

const app = express();
const port = 8000;

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on("exit", ()=> {
        mongoose.disconnect();
    })
};

run().catch((console.error));