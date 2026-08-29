import Post from "../models/Post.js";

// GET /posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("authorId");
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

// POST /posts
export const createPost = async (req, res) => {
  try {
    console.log("POST /posts body:", req.body);

    const { title, content, authorId } = req.body;

    const post = await Post.create({
      title,
      content,
      authorId,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// DELETE /posts/:id
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

// GET /posts/:id
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("authorId");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid post ID",
      error: error.message,
    });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId")
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent posts",
      error: error.message,
    });
  }
};
