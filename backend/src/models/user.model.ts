import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  username?: string; // новое поле
  password?: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: mongoose.Types.ObjectId | null;
  isNewUser: boolean;
  onboardingAnswer?: string | null;
  userRole?: "coach" | "athlete" | null; // роль пользователя: тренер или спортсмен
  // Личные данные
  phoneNumber?: string | null;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | null;
  birthDate?: string | null;
  city?: string | null;
  websiteData?: {
    title: string;
    description: string;
    about: string;
    gallery: string[];
    isPublished: boolean;
  };
  // Настройки уведомлений
  notificationSettings?: {
    email: boolean;
    push: boolean;
    tasks: boolean;
    newTasks: boolean;
    taskUpdates: boolean;
    projectUpdates: boolean;
  };
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: true },
    profilePicture: {
      type: String,
      default: null,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    isNewUser: { type: Boolean, default: true },
    onboardingAnswer: { type: String, default: null },
    userRole: { 
      type: String, 
      enum: ["coach", "athlete", null], 
      default: null 
    },
    // Личные данные
    phoneNumber: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    gender: { 
      type: String, 
      enum: ["male", "female", null], 
      default: null 
    },
    birthDate: { type: String, default: null },
    city: { type: String, default: null },
    websiteData: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      about: { type: String, default: "" },
      gallery: [{ type: String }],
      isPublished: { type: Boolean, default: false }
    },
    // Настройки уведомлений
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      tasks: { type: Boolean, default: true },
      newTasks: { type: Boolean, default: true },
      taskUpdates: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true }
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

const followerSchema = new Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // кто подписался
  following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // на кого подписан
}, { timestamps: true });

export const FollowerModel = mongoose.model("Follower", followerSchema);

const postSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const PostModel = mongoose.model("Post", postSchema);

export default UserModel;
