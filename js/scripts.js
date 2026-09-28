/* Burger button */
let burger = document.querySelector(".burger");
let navigation = document.querySelector("header nav");

function closeMobileMenu() {
  if (!burger || !navigation) {
    return;
  }

  burger.classList.remove("change");
  navigation.classList.remove("menu-open");
  document.body.classList.remove("mobile-menu-open");
}

function openMobileMenu() {
  if (!burger || !navigation || window.innerWidth > 768) {
    return;
  }

  burger.classList.add("change");
  navigation.classList.add("menu-open");
  document.body.classList.add("mobile-menu-open");
}

if (burger) {
  burger.addEventListener("click", function () {
    if (navigation?.classList.contains("menu-open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

if (navigation) {
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("menu-open")) {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

/* Theme switching */
let toggleCheckbox = document.querySelector("#theme-toggle"); // Theme toggle.
let rootElement = document.documentElement; // Root document element.
let currentTheme = localStorage.getItem("theme"); // Saved theme.

// Restore the saved theme.
if (currentTheme) {
  rootElement.setAttribute("data-theme", currentTheme);

  // Check the toggle when dark mode is active.
  if (currentTheme === "dark") {
    toggleCheckbox.checked = true;
    document.getElementById("logo").src = "./assets/img/logo-dark.svg";
  }
}

// Switch the theme and update the logo.
toggleCheckbox.addEventListener("change", function () {
  if (this.checked) {
    rootElement.setAttribute("data-theme", "dark"); // Enable dark mode.
    document.getElementById("logo").src = "./assets/img/logo-dark.svg";
    localStorage.setItem("theme", "dark"); // Save the preference.
  } else {
    rootElement.setAttribute("data-theme", ""); // Enable light mode.
    document.getElementById("logo").src = "./assets/img/logo.svg";
    localStorage.setItem("theme", "light"); // Save the preference.
  }
});

/* Favorite coffee slider */
let sliderSlides = [
  {
    image: "./assets/img/coffee-slider-1.svg",
    title: "S’mores Frappuccino",
    description:
      "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
    price: "$5.50",
  },
  {
    image: "./assets/img/coffee-slider-2.svg",
    title: "Caramel Macchiato",
    description: "Rich espresso with vanilla, steamed milk, and caramel.",
    price: "$5.00",
  },
  {
    image: "./assets/img/coffee-slider-3.svg",
    title: "Ice coffee with frothy milk",
    description:
      "A refreshing iced coffee topped with smooth and airy frothy milk.",
    price: "$4.50",
  },
];
let currentSlide = 0;
let favoriteCoffee = document.querySelector(".favorite-coffee");

if (favoriteCoffee) {
  let favoriteImage = favoriteCoffee.querySelector("#favorite-coffee-image");
  let favoriteTitle = favoriteCoffee.querySelector("#favorite-coffee-title");
  let favoriteDescription = favoriteCoffee.querySelector(
    "#favorite-coffee-description",
  );
  let favoritePrice = favoriteCoffee.querySelector("#favorite-coffee-price");
  let previousButton = favoriteCoffee.querySelector(
    ".favorite-coffee-previous",
  );
  let nextButton = favoriteCoffee.querySelector(".favorite-coffee-next");
  let indicators = favoriteCoffee.querySelectorAll(".slider-indicator");
  let favoriteCard = favoriteCoffee.querySelector(".favorite-coffee-card");

  function updateSlider() {
    let slide = sliderSlides[currentSlide];

    favoriteCard.classList.add("is-changing");
    favoriteImage.src = slide.image;
    favoriteImage.alt = slide.title;
    favoriteTitle.textContent = slide.title;
    favoriteDescription.textContent = slide.description;
    favoritePrice.textContent = slide.price;

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });

    requestAnimationFrame(() => {
      favoriteCard.classList.remove("is-changing");
    });
  }

  previousButton.addEventListener("click", () => {
    currentSlide =
      (currentSlide - 1 + sliderSlides.length) % sliderSlides.length;
    updateSlider();
  });

  nextButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % sliderSlides.length;
    updateSlider();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index;
      updateSlider();
    });
  });
}

/* Catalog */
let container = document.querySelector("#catalog"); // Catalog container.
let template = document.querySelector("#card-template"); // Card template.
let cardsContainer = document.querySelector("#cards-container"); // Dynamic cards container.
let reloadButton = document.querySelector(".loadMore"); // Load-more button.
let products = []; // Loaded catalog data.
let selectedCategory = "coffee"; // Active category.
let showAllCards = false; // Mobile catalog display state.
let productModal = document.querySelector("#product-modal");
let modalImage = document.querySelector("#modal-image");
let modalTitle = document.querySelector("#modal-title");
let modalDescription = document.querySelector("#modal-description");
let modalPrice = document.querySelector("#modal-price");
let modalSizesGroup = document.querySelector("#modal-sizes-group");
let modalSizes = document.querySelector("#modal-sizes");
let modalToppingsGroup = document.querySelector("#modal-toppings-group");
let modalToppings = document.querySelector("#modal-toppings");
let modalCloseButton = document.querySelector(".modal-close");
let selectedSize = null;
let selectedToppings = [];
let currentProduct = null;

function startLoad() {
  if (!container || !template || !cardsContainer) {
    return;
  }

  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ой, ошибка в fetch: " + response.statusText);
      }
      return response.json();
    })
    .then((jsonData) => {
      products = jsonData;
      createCard(products);
    })
    .catch((error) => console.error("Ошибка при исполнении запроса: ", error));
}

function createCard(data) {
  cardsContainer.innerHTML = ""; // Clear only dynamic cards.

  let categoryProducts = data.filter(
    (item) => item.category === selectedCategory,
  );
  let isMobile = window.innerWidth <= 768;
  let visibleProducts =
    isMobile && !showAllCards ? categoryProducts.slice(0, 4) : categoryProducts;

  visibleProducts.forEach((item) => {
    let card = template.content.cloneNode(true); // Clone the card template.
    let article = card.querySelector("article");
    let cardImg = article.querySelector("img"); // Select the card image.
    let cardName = article.querySelector("h3:first-of-type"); // Select the card title.
    let cardPrice = article.querySelector("h3:last-of-type"); // Select the card price.
    let cardDescription = article.querySelector(".medium"); // Select the description.

    // Fill the card template.
    cardImg.src = item.img; // Set the image source.
    cardImg.alt = item.name; // Set accessible image text.
    cardName.textContent = item.name; // Set the name.
    cardPrice.textContent = "$" + Number(item.price).toFixed(2); // Set the price.
    cardDescription.textContent = item.description; // Set the description.

    if (article) {
      article.classList.add(item.category);
      article.dataset.productIndex = products.indexOf(item);
    }

    cardsContainer.appendChild(card);
  });

  updateLoadMore(categoryProducts.length);
}

function openProductModal(product) {
  if (!productModal) {
    return;
  }

  currentProduct = product;
  selectedSize = (product.sizes || [])[0] || null;
  selectedToppings = [];
  modalImage.src = product.img;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  renderProductOptions(product);
  updateTotalPrice();
  productModal.hidden = false;
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function updateTotalPrice() {
  if (!currentProduct) {
    return;
  }

  let basePrice = Number(currentProduct.price);
  let sizePrice = selectedSize ? Number(selectedSize.price) : 0;
  let toppingsPrice = selectedToppings.reduce(
    (total, topping) => total + Number(topping.price),
    0,
  );
  let totalPrice = basePrice + sizePrice + toppingsPrice;

  modalPrice.textContent = "$" + totalPrice.toFixed(2);
}

function renderProductOptions(product) {
  modalSizes.innerHTML = "";
  modalToppings.innerHTML = "";

  let sizes = product.sizes || [];
  let toppings = product.toppings || [];

  modalSizesGroup.hidden = sizes.length === 0;
  modalToppingsGroup.hidden = toppings.length === 0;

  sizes.forEach((size, index) => {
    let button = document.createElement("button");
    button.type = "button";
    button.className = "modal-option";
    button.dataset.optionType = "size";
    button.dataset.optionIndex = index;
    button.textContent = size.name;
    button.classList.toggle("selected", size === selectedSize);
    modalSizes.appendChild(button);
  });

  toppings.forEach((topping, index) => {
    let button = document.createElement("button");
    button.type = "button";
    button.className = "modal-option";
    button.dataset.optionType = "topping";
    button.dataset.optionIndex = index;
    button.textContent = "+ " + topping.name;
    modalToppings.appendChild(button);
  });
}

function selectProductOption(event) {
  let button = event.target.closest(".modal-option");

  if (!button) {
    return;
  }

  let optionIndex = Number(button.dataset.optionIndex);

  if (button.dataset.optionType === "size") {
    let sizes = currentProduct.sizes || [];
    selectedSize = sizes[optionIndex];
    modalSizes.querySelectorAll(".modal-option").forEach((option) => {
      option.classList.toggle("selected", option === button);
    });
    updateTotalPrice();
  }

  if (button.dataset.optionType === "topping") {
    let toppings = currentProduct.toppings || [];
    let selectedTopping = toppings[optionIndex];
    let selectedIndex = selectedToppings.indexOf(selectedTopping);

    if (selectedIndex === -1) {
      selectedToppings.push(selectedTopping);
    } else {
      selectedToppings.splice(selectedIndex, 1);
    }

    button.classList.toggle("selected", selectedIndex === -1);
    updateTotalPrice();
  }
}

function closeProductModal() {
  if (!productModal) {
    return;
  }

  productModal.hidden = true;
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function filterCategory(category) {
  selectedCategory = category;
  showAllCards = false;
  createCard(products);
}

function updateLoadMore(categoryCount) {
  if (!reloadButton) {
    return;
  }

  let isMobile = window.innerWidth <= 768;
  let shouldShow = isMobile && categoryCount > 4 && !showAllCards;
  reloadButton.style.display = shouldShow ? "flex" : "none";
}

function loadMoreCards() {
  showAllCards = true;
  createCard(products);
}

let tabButtons = document.querySelectorAll(".categories-button"); // Category buttons.

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let activeButton = document.querySelector(".categories-button.active");
    activeButton.classList.remove("active");
    button.classList.add("active");
    filterCategory(button.textContent.trim().toLowerCase());
  });
});

if (reloadButton) {
  reloadButton.addEventListener("click", loadMoreCards);
}

if (cardsContainer) {
  cardsContainer.addEventListener("click", (event) => {
    let card = event.target.closest("article[data-product-index]");

    if (card) {
      let product = products[card.dataset.productIndex];
      openProductModal(product);
    }
  });
}

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", closeProductModal);
}

if (modalSizes && modalToppings) {
  modalSizes.addEventListener("click", selectProductOption);
  modalToppings.addEventListener("click", selectProductOption);
}

if (productModal) {
  productModal.addEventListener("click", (event) => {
    if (event.target === productModal) {
      closeProductModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductModal();
  }
});

window.addEventListener("resize", () => {
  if (products.length > 0) {
    showAllCards = false;
    createCard(products);
  }
});

startLoad();
