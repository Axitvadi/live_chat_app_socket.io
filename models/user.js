const mongoose = require("mongoose");
const becrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        image: {
            type: String
        },
        verified: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamp: true,
    }
);

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await becrypt.hash(this.password, 12)

        return next()

    } catch (error) {
        next(error)
    }
});

const user = mongoose.model("user", userSchema);

module.exports = user;
