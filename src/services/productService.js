//src/services/productService.js

export async function getProductList(searchTerm) {
  // Define the API URL with search term filtering
  const url = `https://localhost:7245/api/Games${
    searchTerm ? `?name=${encodeURIComponent(searchTerm)}` : ""
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data["$values"]; // Assuming the backend API response has a `$values` key containing the array of games
}


export async function getProduct(id) {
  // Fetch specific game by ID
  const url = `https://localhost:7245/api/Games/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  const product = await response.json();
  return product;
}

export async function getFeaturedList() {
  // Fetch featured games from the backend API
  const url = `https://localhost:7245/api/FeaturedGames`; // Adjust the URL based on your backend route for featured games

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data["$values"]; // Assuming the response contains `$values` key
}
