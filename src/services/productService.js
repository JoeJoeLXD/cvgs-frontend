//src/services/productService.js
export async function getProductList(searchTerm) {
  // CHANGE URL
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/products?name_like=${
      searchTerm ? searchTerm : ""
    }`
  );
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data;
}

export async function getProduct(id) {
  // CHANGE URL
  const response = await fetch(`${process.env.REACT_APP_HOST}/products`);
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  const product = data.find((product) => product.id === parseInt(id));
  return product;
}

export async function getFeaturedList() {
  // CHANGE URL
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/featured_products`
  );
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data;
}
