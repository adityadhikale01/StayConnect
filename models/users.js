import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const  {Schema} = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ]
});

userSchema.plugin(passportLocalMongoose.default);

export default mongoose.model("User", userSchema);
