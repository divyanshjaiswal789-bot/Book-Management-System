const books = [
  {
    id: 1,
    title: "Java Programming",
    author: "James Gosling",
    price: 499,
    quantity: 12,
    image: "https://picsum.photos/200/300?1"
  },
  {
    id: 2,
    title: "Python Programming",
    author: "Guido",
    price: 599,
    quantity: 8,
    image: "https://picsum.photos/200/300?2"
  },
  {
    id: 3,
    title: "Web Development",
    author: "John",
    price: 699,
    quantity: 15,
    image: "https://picsum.photos/200/300?3"
  },
  {
    id: 4,
    title: "JavaScript",
    author: "Brendan",
    price: 799,
    quantity: 6,
    image: "https://picsum.photos/200/300?4"
  }
];

const cartKey = "cart";

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.style.display = "none";
  }, 1800);
}

function getQuantityColor(quantity) {
  const colorPalette = [
    "#f9a8d4",
    "#fb7185",
    "#f97316",
    "#fb923c"
  ];

  const maxQuantity = Math.max(...books.map((book) => book.quantity));
  const ratio = quantity / maxQuantity;
  const index = Math.min(colorPalette.length - 1, Math.floor(ratio * colorPalette.length));
  return colorPalette[index];
}

function renderBookChart() {
  const chartContainer = document.getElementById("bookChart");
  const legend = document.getElementById("chartLegend");
  const totalQuantity = books.reduce((sum, book) => sum + book.quantity, 0);

  let currentAngle = 0;
  const gradients = books.map((book) => {
    const percent = (book.quantity / totalQuantity) * 100;
    const start = currentAngle;
    currentAngle += percent;
    return `${getQuantityColor(book.quantity)} ${start}% ${currentAngle}%`;
  });

  chartContainer.style.background = `conic-gradient(${gradients.join(", ")})`;
  chartContainer.innerHTML = `
    <div class="chart-center">
      <strong>${totalQuantity}</strong>
      <span>book items</span>
    </div>
  `;

  legend.innerHTML = books
    .map(
      (book) => `
        <div class="chart-legend-item">
          <span class="dot" style="background:${getQuantityColor(book.quantity)}"></span>
          <span>${book.title}</span>
          <strong>${book.quantity}</strong>
        </div>
      `
    )
    .join("");
}

function updateCartSummary(cart) {
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, book) => sum + book.price, 0);

  document.getElementById("cartCount").textContent = totalItems;
  document.getElementById("cartTotal").textContent = `₹${totalPrice}`;
  document.getElementById("cartSummary").textContent = `Total items: ${totalItems} • Total amount: ₹${totalPrice}`;
}

function displayBooks(data) {
  const container = document.getElementById("bookContainer");
  const resultCount = document.getElementById("resultCount");
  container.innerHTML = "";
  resultCount.textContent = data.length;

  data.forEach((book) => {
    container.innerHTML += `
      <div class="book">
        <img src="${book.image}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <div class="price">₹${book.price}</div>
        <button onclick="addToCart(${book.id})">Add To Cart</button>
      </div>
    `;
  });
}

function searchBooks() {
  const value = document.getElementById("search").value.toLowerCase();
  const result = books.filter((book) =>
    book.title.toLowerCase().includes(value) ||
    book.author.toLowerCase().includes(value)
  );

  displayBooks(result);
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty. Add a few books to get started.</div>';
    updateCartSummary(cart);
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (book, index) => `
        <div class="cart-item">
          <div>
            <strong>${book.title}</strong><br>
            <span>₹${book.price}</span>
          </div>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `
    )
    .join("");

  updateCartSummary(cart);
}

function addToCart(id) {
  const cart = getCart();
  const book = books.find((b) => b.id === id);

  if (!book) return;

  cart.push(book);
  saveCart(cart);
  renderCart();
  showToast("Book Added Successfully");
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  showToast("Book Removed");
}

function clearCart() {
  saveCart([]);
  renderCart();
  showToast("Cart cleared");
}

document.getElementById("clearCart").addEventListener("click", clearCart);

renderBookChart();
displayBooks(books);
renderCart();
