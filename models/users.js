import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const  schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose);

export default model("User", userSchema);