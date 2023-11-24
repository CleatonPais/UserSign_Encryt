import mongoose from "mongoose";
import {} from "dotenv/config";

// export const uri =
//   "mongodb+srv://cleatonps:Roger4192@cluster0.axe3bfr.mongodb.net/conestoga_users?retryWrites=true&w=majority";
export const uri = process.env.MONGO_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("*****Connection to Mongo DB Successfule*****"))
  .catch((err) =>
    console.log(`Sorry connection to mongo dB failed due to \n ${err}`)
  );

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("conestoga_user", userSchema);

export default userModel;
