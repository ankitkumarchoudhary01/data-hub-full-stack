const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(`Failed to fetch posts: ${result.message}`);
  }

  return result.data;
};


export const createPost = async (postData) => {

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    body: postData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create post");
  }

  return result.data;
};



export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete post");
  }

  return result.data;
};