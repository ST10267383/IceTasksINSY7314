import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import checkauth from "../check-auth.mjs";   // <- your JWT middleware

const router = express.Router();

/* ===========================
   GET /post/        (all)
   =========================== */
router.get("/", async (_req, res) => {
  const collection = await db.collection("posts");
  const results = await collection.find({}).toArray();
  return res.status(200).json(results);
});

/* ===========================
   GET /post/:id     (one)
   =========================== */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let query;

  try {
    query = { _id: new ObjectId(id) };
  } catch {
    return res.status(400).json({ message: "invalid id" });
  }

  const collection = await db.collection("posts");
  const result = await collection.findOne(query);

  if (!result) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(result);
});

/* ===========================
   POST /post/upload  (create)
   protected
   =========================== */
router.post("/upload", checkauth, async (req, res) => {
  const { user, content, image } = req.body || {};
  if (!user || !content) {
    return res.status(400).json({ message: "user and content are required" });
  }

  const newDocument = {
    user,
    content,
    image: image ?? null,
    createdAt: new Date(),
  };

  const collection = await db.collection("posts");
  const result = await collection.insertOne(newDocument);
  return res.status(201).json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
});

/* ===========================
   PATCH /post/:id    (update)
   protected
   =========================== */
router.patch("/:id", checkauth, async (req, res) => {
  const id = req.params.id;
  let query;

  try {
    query = { _id: new ObjectId(id) };
  } catch {
    return res.status(400).json({ message: "invalid id" });
  }

  // Only set the fields provided in the body
  const $set = {};
  if (req.body.user !== undefined) $set.user = req.body.user;
  if (req.body.content !== undefined) $set.content = req.body.content;
  if (req.body.image !== undefined) $set.image = req.body.image;

  if (Object.keys($set).length === 0) {
    return res.status(400).json({ message: "no fields to update" });
  }

  const collection = await db.collection("posts");
  const result = await collection.updateOne(query, { $set });
  return res.status(200).json({ matched: result.matchedCount, modified: result.modifiedCount });
});

/* ===========================
   DELETE /post/:id   (delete)
   protected
   =========================== */
router.delete("/:id", checkauth, async (req, res) => {
  const id = req.params.id;
  let query;

  try {
    query = { _id: new ObjectId(id) };
  } catch {
    return res.status(400).json({ message: "invalid id" });
  }

  const collection = await db.collection("posts");
  const result = await collection.deleteOne(query);
  return res.status(200).json({ deleted: result.deletedCount });
});

export default router;