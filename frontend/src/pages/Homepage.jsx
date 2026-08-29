import { useEffect, useState } from "react";
import { getPosts } from "../services/api";

function Homepage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                <p className="text-gray-600 text-lg">Loading posts...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                    >
                        Try Again
                    </button>
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

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            No posts available.
                        </p>
                    </div>
                ) : (
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
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Homepage;