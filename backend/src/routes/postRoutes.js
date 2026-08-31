import express from "express";

import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  getRecentPosts,
} from "../controllers/postController.js";

import upload from "../middleware/upload.js";

const router = express.Router();
router.get("/recent", getRecentPosts);
router.get("/", getPosts);
router.post("/", upload.single("image"), createPost);
router.delete("/:id", deletePost);
router.get("/:id", getPostById);

export default router;