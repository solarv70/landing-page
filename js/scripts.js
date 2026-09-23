/* Burger button */
let burger = document.querySelector(".burger");

if (burger) {
  burger.addEventListener("click", function () {
    burger.classList.toggle("change");
  });
}

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

let tabButtons = document.querySelectorAll(".categories-button"); // Category buttons.
let reloadButton = document.querySelector(".loadMore"); // Load-more button.

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let activeButton = document.querySelector(".categories-button.active"); // Find the active button.
    activeButton.classList.remove("active"); // Clear the active state.
    button.classList.add("active"); // Set the active state.
    let selectedButton = button.textContent.trim().toLowerCase(); // Read the selected category.

    let allCard = document.querySelectorAll("#catalog article"); // Find all cards.
    let visibleCount = 0; // Count visible cards.
    let isMobileOrTablet = window.innerWidth < 1440; // Check the viewport size.
    allCard.forEach((card) => {
      if (card.classList.contains(selectedButton)) {
        card.classList.remove("hide");

        if (isMobileOrTablet && visibleCount >= 4) {
          card.classList.add("hide"); // Hide extra cards on small screens.
        } else {
          card.classList.remove("hide"); // Show cards allowed by the viewport.
          visibleCount++;
        }

        // Hide the button when the category has four or fewer cards.
        let countCards = container.querySelectorAll(
          `article.${selectedButton}`,
        ).length; // Count category cards.
        if (countCards <= 4) {
          reloadButton.style.display = "none";
        } else {
          reloadButton.style.display = "flex";
        }
      } else {
        card.classList.add("hide");
      }
    });
  });
});

/* Initial catalog load */
let container = document.querySelector("#catalog"); // Catalog container.
let template = document.querySelector("#card-template"); // Card template.

function startLoad() {
  if (!container || !template) {
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
      datajson = jsonData;
      createCard(datajson);
      return jsonData;
    })
    .catch((error) => console.error("Ошибка при исполнении запроса: ", error));
}

function createCard(data) {
  container.innerHTML = ""; // Clear the card container.
  let visibleCount = 0; // Count visible cards.
  data.forEach((item) => {
    let card = template.content.cloneNode(true); // Clone the card template.
    let cardImg = card.querySelector("#inner-card-img"); // Select the card image.
    let cardName = card.querySelector("#inner-card-title"); // Select the card title.
    let cardPrice = card.querySelector("#inner-card-price"); // Select the card price.
    let cardDescription = card.querySelector("#inner-card-description"); // Select the description.
    let cardCategory = ""; // Store the card category.

    // Fill the card template.
    cardImg.src = item.img; // Set the image source.
    cardImg.alt = item.name; // Set accessible image text.
    cardName.textContent = item.name; // Set the name.
    cardPrice.textContent = "$" + item.price; // Set the price.
    cardDescription.textContent = item.description; // Set the description.
    cardCategory = item.category; // Set the category.

    let article = card.querySelector("article");
    if (article) {
      article.classList.add(cardCategory);

      let isMobileOrTablet = window.innerWidth < 1440;

      if (cardCategory != "coffee") {
        article.classList.add("hide");
      } else {
        visibleCount++;
        if (isMobileOrTablet && visibleCount >= 5) {
          article.classList.add("hide");
        }
      }
    }

    container.appendChild(card);
  });

  // console.log(datajson[0].name);
  // console.log(datajson[0].description);
  // console.log(datajson[0].price);
  // console.log(datajson[0].category);
  // console.log(datajson[0].img);
}

window.addEventListener("resize", () => {
  console.log("Изменение экрана");
  startLoad();
});

startLoad();
