import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

/* ----- config (env with safe defaults) ----- */
const JWT_SECRET  = process.env.JWT_SECRET  || "this_secret_should_be_longer_than_it_is";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

/* ----- brute-force protection for /login ----- */
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, {
  freeRetries: 10,
  minWait: 60 * 1000,  // 1 minute
  lifetime: 60 * 60,   // 1 hour (in seconds)
});

/* ===========================
   POST /user/signup
   =========================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body || {};
    if (!name || !password) {
      return res.status(400).json({ message: "name and password are required" });
    }

    const users = await db.collection("users");
    const exists = await users.findOne({ name });
    if (exists) return res.status(409).json({ message: "name already taken" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await users.insertOne({
      name,
      password: passwordHash,
      createdAt: new Date(),
    });

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

/* ===========================
   POST /user/login
   =========================== */
router.post("/login", bruteforce.prevent, async (req, res) => {
  try {
    const { name, password } = req.body || {};
    if (!name || !password) {
      return res.status(400).json({ message: "name and password are required" });
    }

    const users = await db.collection("users");
    const user = await users.findOne({ name });
    if (!user) return res.status(401).json({ message: "Authentication failed" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Authentication failed" });

    const token = jwt.sign(
      { id: user._id.toString(), name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* (optional) quick health check */
router.get("/me", (req, res) => res.json({ ok: true }));

export default router;