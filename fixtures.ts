import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";
import crypto from "crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection("users");
        await db.dropCollection("tasks");
    } catch (err) {
        console.error(err);
    }
    const [user1, user2] = await User.create(
        {
            username: "Bob",
            password: "baba",
            token: crypto.randomUUID(),
        },
        {
            username: "burger",
            password: "123",
            token: crypto.randomUUID(),
        }
    )

    await Task.create(
        {
            user: user1._id,
            title: "exercise",
            description: null,
            status: "new",
        },
        {
            user: user2._id,
            title: "cooking",
            description: "Lorem",
            status: "in_progress",
        },
    );

    await db.close();
}

run().catch((console.error));