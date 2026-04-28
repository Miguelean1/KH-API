const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { username, password, roles } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username y password son requeridos" });
    }

    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const user = new User({
      username,
      password,
      roles: roles || ["user"],
    });

    await user.save();

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      refreshToken,
      user: { id: user._id, username: user.username, roles: user.roles },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username y password son requeridos" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: "Login exitoso",
      token,
      refreshToken,
      user: { id: user._id, username: user.username, roles: user.roles },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/refresh-token", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const token = generateToken(user);
    res.json({
      message: "Token refrescado",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
