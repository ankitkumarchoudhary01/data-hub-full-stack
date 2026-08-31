import { useState } from "react";
import { createPost } from "../services/api";
import { useNavigate } from "react-router-dom";

function PostForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorId: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImage(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const postFormData = new FormData();

      postFormData.append("title", formData.title);
      postFormData.append("content", formData.content);
      postFormData.append("authorId", formData.authorId);

      if (image) {
        postFormData.append("image", image);
      }

      const newPost = await createPost(postFormData);

      if (newPost) {
        setSuccess("Post created successfully.");

        setFormData({
          title: "",
          content: "",
          authorId: "",
        });

        setImage(null);
        setImagePreview("");

        event.target.reset();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      setError(error.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            <span aria-hidden="true">←</span>
            Back to Data Hub
          </button>

          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Data Hub
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            Create a new post
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Add content and an optional image to publish a new post.
          </p>
        </div>
      </header>

      {/* Form area */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
        >
          <div className="space-y-7 p-6 sm:p-8">
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-green-800">
                  {success}
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-zinc-900"
              >
                Post title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a clear and descriptive title"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-zinc-900"
              >
                Content
              </label>

              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the content of your post..."
                rows="7"
                required
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <p className="mt-2 text-xs text-zinc-400">
                Keep your content clear and easy to read.
              </p>
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="authorId"
                className="mb-2 block text-sm font-semibold text-zinc-900"
              >
                Author ID
              </label>

              <input
                id="authorId"
                type="text"
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                placeholder="Enter the author's ID"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />

              <p className="mt-2 text-xs text-zinc-400">
                Use the ID of an existing user in your database.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="image"
                  className="block text-sm font-semibold text-zinc-900"
                >
                  Cover image
                </label>

                <span className="text-xs text-zinc-400">
                  Optional · Max 5MB
                </span>
              </div>

              {!imagePreview ? (
                <label
                  htmlFor="image"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-zinc-500 hover:bg-zinc-100"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      className="h-5 w-5 text-zinc-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0L8 8m4-4 4 4M5 20h14"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-zinc-700">
                    Click to upload an image
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    PNG, JPG, JPEG, WEBP
                  </p>

                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {image.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {(image.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <span className="ml-4 shrink-0 text-xs font-medium text-green-600">
                      Ready to upload
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
                  Publishing...
                </span>
              ) : (
                "Publish Post"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PostForm;
