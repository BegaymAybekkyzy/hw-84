import * as mongoose from "mongoose";
import * as argon2 from "argon2";
import {randomUUID} from "node:crypto";
import {HydratedDocument, Model} from "mongoose";
import {IUser} from "../types";

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateToken: () => void;
}

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1
}

type UserModel = Model<IUser, {}, UserMethods>;

const UserSchema = new mongoose.Schema<
    HydratedDocument<IUser>,
    UserModel,
    UserMethods,
    {}
>({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
    }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
});

UserSchema.methods.checkPassword = async function (password: string) {
    return await argon2.verify(this.password, password);
};

UserSchema.methods.generateToken = async function () {
    this.token = randomUUID();
};

UserSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    }
})

const User = mongoose.model("User", UserSchema);
export default User;