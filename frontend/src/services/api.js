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