import React from "react";
import { useQuery } from "@tanstack/react-query";

// Define your API endpoint
const API_URL = "https://jsonplaceholder.typicode.com/posts/1";

// Fetch function
async function fetchPost() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// React component
const Posts: React.FC = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", 1],
    queryFn: fetchPost,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {JSON.stringify(error)}</div>;

  return (
    <li style={{ listStyle: "none" }} key={data.id}>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </li>
  );
};

export default Posts;
