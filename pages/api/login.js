import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt'; //to Hash the user password
import jwt from 'jsonwebtoken'; // to generate user token

connectDb();


export default async (req, res) => {
  const { email, password } = req.body;

  try {

    //1) Check if the user's EMAIL exist in the DB
    const user = await User.findOne({ email }).select('+password');

    //2) -- if not, return error
    if (!user) {
      return res.status(404).send("No user exist with that Email")
    }

    //3) Check if the user's PASSWORD match the one in the DB
    const passwordMatch = await bcrypt.compare(password, user.password);

    //4) -- if so, generate a TOKEN
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

      //5) Send that Token to the client
      res.status(200).json(token)
    } else {
      res.status(401).send("Password do not match")
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging is user")
  }
}