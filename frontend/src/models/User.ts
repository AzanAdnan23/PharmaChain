import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  pfpURL: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
