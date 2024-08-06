const { Router } = require("express");
const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) throw new Error("no users found");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const users = await userModel.findById(id);
    console.log(users);
    if (!users) throw new Error("user not found");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// signup
router.post("/", async (req, res) => {
  console.log("checking existing user");
  const { username, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    console.log("checked existing user");
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const userSaved = await newUser.save();
    if (!userSaved) throw new Error("something went wrong while saving user");
    res.status(200).json(userSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  try {
    const existingUser = await userModel.findOne({
        $or: [
          { email: user.email },
          { username: user.username }
        ],
        _id: { $ne: id } // Exclude the current user by ID
      });

    console.log("checked existing user");
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const response = await userModel.findByIdAndUpdate(id, req.body);
    if (!response) throw Error("something went wrong while updating user");
    const updated = { ...response._doc, ...req.body };
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await userModel.findByIdAndDelete(id);
    if (!response) throw Error("something went wrong while deleting user");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
