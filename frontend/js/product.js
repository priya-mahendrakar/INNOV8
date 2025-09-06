const apiBase = 'http://localhost:3000/api';

async function fetchProducts(category = '', keyword = '') {
  let url = `${apiBase}/products?`;
  if (category) url += `category=${encodeURIComponent(category)}&`;
  if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;

  const res = await fetch(url);
  const products = await res.json();
  return products;
}

function renderProducts(products) {
  const container = document.getElementById('productList');
  container.innerHTML = '';
  if (!products.length) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }
  products.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="img/${p.image_url || 'placeholder.png'}" alt="${p.title}" />
      <div class="product-info">
        <h3>${p.title}</h3>
        <p><strong>Price:</strong> $${p.price}</p>
        <button onclick="viewProduct(${p.id})">View Details</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function viewProduct(id) {
  window.location.href = `product_detail.html?id=${id}`;
}

document.getElementById('filterBtn').addEventListener('click', async () => {
  const category = document.getElementById('categoryFilter').value;
  const keyword = document.getElementById('searchInput').value.trim();
  const products = await fetchProducts(category, keyword);
  renderProducts(products);
});

document.getElementById('addNewBtn').addEventListener('click', () => {
  window.location.href = 'add_product.html';
});

// On page load
window.onload = async () => {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'login.html';
  const products = await fetchProducts();
  renderProducts(products);
};

// Add new product
document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
    const title = e.target.title.value.trim();
    const category = e.target.category.value;
    const description = e.target.description.value.trim();
    const price = e.target.price.value;
  
    if (!title || !category || !price) {
      document.getElementById('message').textContent = 'Fill required fields';
      return;
    }
  
    try {
      const res = await fetch(`${apiBase}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category, description, price, imageUrl: 'placeholder.png' }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Product added!');
        window.location.href = 'my_listings.html';
      } else {
        document.getElementById('message').textContent = data.message || 'Failed';
      }
    } catch {
      document.getElementById('message').textContent = 'Network error';
    }
  });
  
  document.getElementById('addNew')?.addEventListener('click', () => {
    window.location.href = 'add_product.html';
  });
  
  async function fetchMyListings() {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
  
    const res = await fetch(`${apiBase}/products/user/mine`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const products = await res.json();
    return products;
  }
  
  async function renderMyListings() {
    const container = document.getElementById('listingsContainer');
    if (!container) return;
  
    const products = await fetchMyListings();
    if (!products.length) {
      container.innerHTML = '<p>No listings yet.</p>';
      return;
    }
    container.innerHTML = '';
  
    products.forEach((p) => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="img/${p.image_url}" alt="${p.title}" />
        <div class="product-info">
          <h3>${p.title}</h3>
          <p><strong>Price:</strong> $${p.price}</p>
          <button onclick="editListing(${p.id})">Edit</button>
          <button onclick="deleteListing(${p.id})">Delete</button>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  async function deleteListing(id) {
    if (!confirm('Delete this product?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiBase}/products/${id}`, {
      method:'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Deleted');
      renderMyListings();
    } else {
      alert('Delete failed');
    }
  }
  
  function editListing(id) {
    window.location.href = `add_product.html?id=${id}`;
  }
  
  window.onload = () => {
    renderMyListings();
  };
  // On add_product.html load, check for edit mode
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return; // no edit
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login');
      window.location.href = 'login.html';
      return;
    }
  
    try {
      const res = await fetch(`${apiBase}/products/${productId}`);
      const product = await res.json();
      if (!res.ok) throw new Error(product.message);
  
      // Fill form fields
      document.getElementById('title').value = product.title;
      document.getElementById('category').value = product.category;
      document.getElementById('description').value = product.description;
      document.getElementById('price').value = product.price;
  
      // Change form submit behavior for update
      const form = document.getElementById('addProductForm');
      form.removeEventListener('submit', submitAddProduct);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = e.target.title.value.trim();
        const category = e.target.category.value;
        const description = e.target.description.value.trim();
        const price = e.target.price.value;
  
        if (!title || !category || !price) {
          document.getElementById('message').textContent = 'Fill required fields';
          return;
        }
  
        try {
          const res = await fetch(`${apiBase}/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, category, description, price, imageUrl: 'placeholder.png' }),
          });
          const data = await res.json();
          if (res.ok) {
            alert('Product updated!');
            window.location.href = 'my_listings.html';
          } else {
            document.getElementById('message').textContent = data.message || 'Update failed';
          }
        } catch {
          document.getElementById('message').textContent = 'Network error';
        }
      }, { once: true });
    } catch (err) {
      alert(err.message || 'Load failed');
      window.location.href = 'my_listings.html';
    }
  });
  