import express from "express";

import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  getRecentPosts,
} from "../controllers/postController.js";

const router = express.Router();
router.get("/recent", getRecentPosts);
router.get("/", getPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.get("/:id", getPostById);

export default router;