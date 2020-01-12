import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import Cart from '../../models/Cart';
import bcrypt from 'bcrypt'; //to Hash the user password
import jwt from 'jsonwebtoken'; // to generate user token
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';



connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {

    //1) Validate (Name, Email, Password) values
    if (!isLength(name, { min: 3, max: 12 })) {
      return res.status(422).send("Name must be 3-12 characters long")
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send("Password must at least 6 characters")
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid")
    }

    // 2) If the user exists in the database
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User already exist with email ${email}`)
    }
    // 3) -- If not, hash their password
    const hash = await bcrypt.hash(password, 10);

    // 4) create user
    const newUser = await new User({
      name,
      email,
      password: hash
    }).save()
    console.log({ user });

    // 5) Create CART for the new user
    await new Cart({ user: newUser._id }).save();

    // 6) create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // 7) send back the token 
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send(" Error signing up user. Please try again later");

  }
}