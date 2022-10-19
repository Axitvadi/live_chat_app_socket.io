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
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

userSchema.pre("save", async function (next){
  try {
    if (!this.isModified("password")) {
      return next(); 
    }

    const hashPw = await becrypt.hash(this.password, 12)
    this.password = hashPw
  
    return next()

  } catch (error) {
    next(error)
  }
});

const user = mongoose.model("user", userSchema);

module.exports = user;
