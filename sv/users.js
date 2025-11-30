const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET = "proyecto_final";

const usersPath = path.join(__dirname, "api/users/users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Debe enviar usuario y contraseña." });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;