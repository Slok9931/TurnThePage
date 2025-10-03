const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profilePicture: {
      url: String,
      publicId: String,
    },
    coverPicture: {
      url: String,
      publicId: String,
    },
    location: String,
    website: String,
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    favoriteGenres: [String],
    readingGoal: {
      yearly: {
        target: Number,
        current: Number,
      },
    },
    socialStats: {
      followersCount: {
        type: Number,
        default: 0,
      },
      followingCount: {
        type: Number,
        default: 0,
      },
      booksAddedCount: {
        type: Number,
        default: 0,
      },
      reviewsCount: {
        type: Number,
        default: 0,
      },
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        follows: {
          type: Boolean,
          default: true,
        },
        reviews: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        showEmail: {
          type: Boolean,
          default: false,
        },
        showReadingActivity: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
