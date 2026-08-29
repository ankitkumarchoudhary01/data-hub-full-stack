import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../services/api";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);
    const navigate = useNavigate();

    const handleDeletePost = async (id) => {
        try {
            setDeleteLoading(id);
            setError("");

            await deletePost(id);

            setPosts((previousPosts) =>
                previousPosts.filter((post) => post._id !== id)
            );
        } catch (error) {
            console.error("Failed to delete post:", error);
            setError(error.message || "Failed to delete post");
        } finally {
            setDeleteLoading(null);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPosts();

                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setError("Unable to load posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

                    <p className="text-gray-600">
                        Loading posts...
                    </p>
                </div>
            </main>
        );
    }


    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Data Hub
                </h1>
                {error && (
                    <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 text-sm font-medium text-red-700 underline"
                        >
                            Retry
                        </button>
                    </div>
                )}
                

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            No posts available.
                        </p>
                    </div>
                ) : (<>
                
                <button type="button" onClick={() => navigate("/create-post")} className="mb-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                    Create New Post
                </button>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article
                                key={post._id}
                                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                    {post.title}
                                </h2>

                                <p className="text-gray-600 mb-4">
                                    {post.content}
                                </p>

                                <div className="text-sm text-gray-500">
                                    <p>Author: {post.author}</p>

                                    {post.createdAt && (
                                        <p className="mt-1">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    disabled={deleteLoading === post._id}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    {deleteLoading === post._id ? "Deleting..." : "Delete"}
                                </button>
                            </article>
                        ))}
                    </div></>
                )}
            </div>
        </main>
    );
}

export default Homepage;