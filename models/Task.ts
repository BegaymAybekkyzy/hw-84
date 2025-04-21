import mongoose, {Schema, Types} from "mongoose";
import User from "./User";

const TaskSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async (value: Types.ObjectId)=> {
                const user = await User.findById(value._id);
                return !!user;
            },
            message: "User not found",
        }
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["new", "in_progress", "complete"],
        default: "new",
    }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;