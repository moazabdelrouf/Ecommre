let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list() {
 category_nav_list.classList.toggle("active");
}

let nav_links = document.querySelector(".nav_links");

function open_Menu() {
 nav_links.classList.toggle("active");
}

var cart = document.querySelector(".cart");

function open_close_cart() {
 cart.classList.toggle("active");
}

fetch("products.json")
 .then((response) => response.json())
 .then((data) => {
  const addToCartButtons = document.querySelectorAll(".btn_add_cart");

  addToCartButtons.forEach((button) => {
   button.addEventListener("click", (event) => {
    const productId = event.target.getAttribute("data-id");
    const selectedProduct = data.find((product) => product.id == productId);

    addToCart(selectedProduct);

    const allMatchingButtons = document.querySelectorAll(
     `.btn_add_cart[data-id="${productId}"]`
    );

    allMatchingButtons.forEach((btn) => {
     btn.classList.add("active");
     btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
    });
   });
  });
 });

function addToCart(product) {
 let cart = JSON.parse(localStorage.getItem("cart")) || [];

 // Check if the product already exists in the cart
 const existingProduct = cart.find((item) => item.id === product.id);
 if (existingProduct) {
  existingProduct.quantity += 1; // Increment quantity if it exists
 } else {
  cart.push({ ...product, quantity: 1 }); // Add new product
 }

 localStorage.setItem("cart", JSON.stringify(cart));
 updateCart();
}

function updateCart() {
 const cartItemsContainer = document.getElementById("cart_items");
 const checkout_items = document.getElementById("checkout_items");
 const subtotal_checkout = document.querySelector(".subtotal_checkout");
 const total_checkout = document.querySelector(".total_checkout");

 const cart = JSON.parse(localStorage.getItem("cart")) || [];
 let total_Price = 0;
 let total_count = 0;

 // تحديث العناصر في السلة الجانبية
 cartItemsContainer.innerHTML = "";
 cart.forEach((item, index) => {
  const total_Price_item = item.price * item.quantity;
  total_Price += total_Price_item;
  total_count += item.quantity;

  cartItemsContainer.innerHTML += `
      <div class="item_cart">
        <img src="${item.img}" alt="">
        <div class="content">
          <h4>${item.name}</h4>
          <p class="price_cart">$${total_Price_item}</p>
          <div class="quantity_control">
            <button class="decrease_quantity" data-index=${index}>-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="Increase_quantity" data-index=${index}>+</button>
          </div>
        </div>
        <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
 });

 // تحديث العناصر في صفحة checkout
 if (checkout_items) {
  checkout_items.innerHTML = "";
  cart.forEach((item, index) => {
   const total_Price_item = item.price * item.quantity;

   checkout_items.innerHTML += `
        <div class="item_cart">
          <div class="image_name">
            <img src="${item.img}" alt="">
            <div class="content">
              <h4>${item.name}</h4>
              <p class="price_cart">$${total_Price_item}</p>
              <div class="quantity_control">
                <button class="decrease_quantity" data-index=${index}>-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="Increase_quantity" data-index=${index}>+</button>
              </div>
            </div>
          </div>
          <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;
  });

  // تحديث الإجماليات في صفحة checkout
  if (subtotal_checkout) subtotal_checkout.innerHTML = `$${total_Price}`;
  if (total_checkout) total_checkout.innerHTML = `$${total_Price + 20}`;
 }

 // تحديث الإجماليات في السلة الجانبية
 const price_cart_total = document.querySelector(".price_cart_toral");
 const count_item_cart = document.querySelector(".Count_item_cart");
 const count_item_header = document.querySelector(".count_item_header");

 if (price_cart_total) price_cart_total.innerHTML = `$${total_Price}`;
 if (count_item_cart) count_item_cart.innerHTML = total_count;
 if (count_item_header) count_item_header.innerHTML = total_count;

 // إضافة الأحداث لأزرار التحكم في الكمية
 const increaseButtons = document.querySelectorAll(".Increase_quantity");
 const decreaseButtons = document.querySelectorAll(".decrease_quantity");
 const deleteButtons = document.querySelectorAll(".delete_item");

 increaseButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
   const itemIndex = event.target.getAttribute("data-index");
   increaseQuantity(itemIndex);
  });
 });

 decreaseButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
   const itemIndex = event.target.getAttribute("data-index");
   decreaseQuantity(itemIndex);
  });
 });

 deleteButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
   const itemIndex = event.target.getAttribute("data-index");
   removeFromCart(itemIndex);
  });
 });

 console.log("Cart updated:", cart);
}

function increaseQuantity(index) {
 let cart = JSON.parse(localStorage.getItem("cart")) || [];
 cart[index].quantity += 1;
 localStorage.setItem("cart", JSON.stringify(cart));
 updateCart();
}

function decreaseQuantity(index) {
 let cart = JSON.parse(localStorage.getItem("cart")) || [];

 if (cart[index].quantity > 1) {
  cart[index].quantity -= 1;
 }

 localStorage.setItem("cart", JSON.stringify(cart));
 updateCart();
}

function removeFromCart(index) {
 const cart = JSON.parse(localStorage.getItem("cart")) || [];

 const removeProduct = cart.splice(index, 1)[0];
 localStorage.setItem("cart", JSON.stringify(cart));
 updateCart();
 updateButtonsState(removeProduct.id);
}

function updateButtonsState(productId) {
 const allMatchingButtons = document.querySelectorAll(
  `.btn_add_cart[data-id="${productId}"]`
 );
 allMatchingButtons.forEach((button) => {
  button.classList.remove("active");
  button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`;
 });
}

window.addEventListener("DOMContentLoaded", () => {
 updateCart();
});
