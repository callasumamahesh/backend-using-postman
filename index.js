import express from 'express'
import connectDB  from './config/db.js'
import User from './models/User.js';
import bcrypt from 'bcrypt'

const app = express()

connectDB()

app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isPasswordMatch = await bcrypt.compare(
      password,   
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/signup", async (req, res) => {

  try {
    const { email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound)
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(3000, () => {
    console.log('Port is listening in 3000')
})