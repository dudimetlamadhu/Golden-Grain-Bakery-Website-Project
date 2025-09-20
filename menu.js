//! menu monitoring all the menu items
function filterItems(category) {
  let cards = document.querySelectorAll(".card");
  let buttons = document.querySelectorAll("#filter_btns > button");

  cards.forEach((card) => {
    if (category == "all") {
      card.style.display = "flex";
    } else {
      if (card.classList.contains(category)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    }
  });

  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });
  // Use event.target to add the active class to the clicked button
  event.target.classList.add("active");
}

//! Add to cart functionality
let cart = [];
let cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  let name = card.querySelector(".card_one>.card_info>h2").innerText;
  let price = Number(
    card.querySelector(".card_one>.card_info>p").innerText.replace("₹", "").replace("/-", "")
  );
  let quantityDisplay = card.querySelector(".card_two>.card_quantity>.quantity");

  //! Number increment and decrement
  let plusBtn = card.querySelector(".plus");
  plusBtn.addEventListener("click", () => {
    quantityDisplay.innerText = Number(quantityDisplay.innerText) + 1;
  });

  let minusBtn = card.querySelector(".minus");
  minusBtn.addEventListener("click", () => {
    let current = Number(quantityDisplay.innerText);
    if (current > 0) {
      quantityDisplay.innerText = current - 1;
    }
  });

  //! Add to Cart adding of items to cart
  let addBtn = card.querySelector(".addToCart>button");
  addBtn.addEventListener("click", () => {
    let qty = Number(quantityDisplay.innerText);
    if (qty > 0) {
      let existingItem = cart.find((item) => item.name == name);

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.push({
          name,
          qty,
          price,
        });
      }
      addBtn.style.background = "green";
      // Reset the quantity display on the product card to 0 after adding to cart
      quantityDisplay.innerText = 0;
      updateCart();

      // Automatically open the sidebar after adding an item to the cart
      let sidebar = document.getElementById("sidebar");
      sidebar.classList.add("open");
    } else {
      alert("Please add at least 1 item");
    }
  });
});

// Total qty and price adding to cart and updating sidebar content
function updateCart() {
  let totalQty = 0;
  let totalPrice = 0;
  let sidebarItemsContainer = document.getElementById("sidebar_items");
  sidebarItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    totalQty += item.qty;
    totalPrice += item.price * item.qty;

    let cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.innerHTML = `
      <p class="product-name">Product: ${item.name}</p>
      <p class="product-qty">Quantity: ${item.qty}</p>
      <p class="product-price">Price: ₹${(item.price * item.qty).toFixed(2)}</p>
    `;
    sidebarItemsContainer.appendChild(cartItemDiv);
  });

  // Update total quantity and price in the navigation bar
  document.getElementById("cart_quantity").innerText = totalQty;
  document.getElementById("cart_price").innerText = `₹${totalPrice.toFixed(2)}`;

  // Update total price in the sidebar
  document.getElementById("sidebar_total_price").innerText = `₹${totalPrice.toFixed(2)}`;

  // Get sidebar elements and add event listeners if they don't have them already
  let cartIcon = document.getElementById("cart_icon");
  let closeSidebarBtn = document.getElementById("close_sidebar");
  let sidebar = document.getElementById("sidebar");
  let checkoutBtn = document.getElementById("checkout_btn");

  if (!cartIcon._hasClickListener) {
    cartIcon.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
    cartIcon._hasClickListener = true;
  }

  if (!closeSidebarBtn._hasClickListener) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
    closeSidebarBtn._hasClickListener = true;
  }

  // UPI payment functionality
  if (!checkoutBtn._hasClickListener) {
    checkoutBtn.addEventListener("click", () => {
      if (totalPrice > 0) {
        // Replace with your actual UPI ID and a descriptive note
        const upiId = "yourupiid@bank"; // 👈 CHANGE THIS TO YOUR UPI ID
        const merchantName = "Heavenly Bakes";
        const transactionNote = "Payment for your heavenly bakes";

        // Generate the UPI deep link
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
          merchantName
        )}&am=${totalPrice.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        
        // Open the UPI payment app
        window.location.href = upiUrl;
      } else {
        alert("Your cart is empty. Please add items to proceed.");
      }
    });
    checkoutBtn._hasClickListener = true;
  }
}

// Ensure the cart is updated on page load
document.addEventListener("DOMContentLoaded", updateCart);