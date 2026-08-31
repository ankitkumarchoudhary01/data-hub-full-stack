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
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />

          <p className="text-sm font-medium text-zinc-500">
            Loading posts...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Data Hub
            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Explore and manage your blog posts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/create-post")}
            className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
          >
            Create Post
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Error */}
        {error && (
          <div className="mb-8 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-red-800">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Recent Posts
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {posts.length} {posts.length === 1 ? "post" : "posts"} available
            </p>
          </div>
        </div>

        {/* Empty State */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <span className="text-2xl text-zinc-500">+</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-900">
              No posts yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Create your first post and it will appear here automatically.
            </p>

            <button
              type="button"
              onClick={() => navigate("/create-post")}
              className="mt-6 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-zinc-100">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-zinc-400">
                        No image
                      </p>
                    </div>
                  )}
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center justify-between gap-4 text-xs text-zinc-400">
                    <span className="font-medium">
                      {post.authorId.name || "Unknown author"}
                    </span>

                    {post.createdAt && (
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <h2 className="mb-3 text-xl font-bold leading-snug text-zinc-950">
                    {post.title}
                  </h2>

                  <p className="mb-6 line-clamp-3 flex-1 text-sm leading-6 text-zinc-600">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                    <button className="text-xs  rounded-md border border-zinc-200 border-2 p-2 font-medium uppercase tracking-wider text-grey-400">
                      Save 
                    </button>

                    <button
                      onClick={() => handleDeletePost(post._id)}
                      disabled={deleteLoading === post._id}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleteLoading === post._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Homepage;