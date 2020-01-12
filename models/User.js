import mongoose from 'mongoose';

const { String } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false //to exclude password from user date if we have to send them to him.
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ["user", "admin", "root"]
  }
}, {
  // to show when the user is signed up or update his profile
  timestamps: true
})

export default mongoose.models.User || mongoose.model("User", UserSchema);