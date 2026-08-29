import { useState } from "react";
import { createPost } from "../services/api";
import { useNavigate } from "react-router-dom";

function PostForm() {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        authorId: "",
    });
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const newPost = await createPost(formData);
            if (newPost) {
                window.alert("Post created successfully!");
            }

            setFormData({
                title: "",
                content: "",
                authorId: "",
            });
        } catch (error) {
            console.error("Failed to create post:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-8"
        >
            <button type="button" onClick={() => navigate("/")} className="mb-6 px-4 py-2 bg-transparent border border-gray-300 text-black rounded-md hover:bg-gray-200">
                Homepage
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Create New Post
            </h2>

            {error && (
                <p className="text-red-600 text-sm mb-4">
                    {error}
                </p>
            )}

            <div className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Post title"
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Post content"
                    rows="4"
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <input
                    type="text"
                    name="authorId"
                    value={formData.authorId}
                    onChange={handleChange}
                    placeholder="authorId"
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Post"}
                </button>
            </div>
        </form>
    );
}

export default PostForm;