const recipes = [
  {
    id: 1,
    title: "Vegan Lentil Soup",
    image: "./img/empty.webp",
    readyInMinutes: 30,
    sourceUrl: "https://example.com/vegan-lentil-soup",
    diets: ["vegan"],
    ingredients: [
      "red lentils",
      "carrots",
      "onion",
      "garlic",
      "tomato paste",
      "cumin",
      "paprika",
      "vegetable broth",
      "olive oil",
      "salt"
    ],
    pricePerServing: 2.5,
  },
  {
    id: 2,
    title: "Vegetarian Pesto Pasta",
    image: "./img/empty.webp",
    readyInMinutes: 25,
    sourceUrl: "https://example.com/vegetarian-pesto-pasta",
    diets: ["vegetarian"],
    ingredients: [
      "pasta",
      "basil",
      "parmesan cheese",
      "garlic",
      "pine nuts",
      "olive oil",
      "salt",
      "black pepper"
    ],
    pricePerServing: 3.0,
  },
  {
    id: 3,
    title: "Gluten-Free Chicken Stir-Fry",
    image: "./img/empty.webp",
    readyInMinutes: 20,
    sourceUrl: "https://example.com/gluten-free-chicken-stir-fry",
    diets: ["gluten-free"],
    ingredients: [
      "chicken breast",
      "broccoli",
      "bell pepper",
      "carrot",
      "soy sauce (gluten-free)",
      "ginger",
      "garlic",
      "sesame oil",
      "cornstarch",
      "green onion",
      "sesame seeds",
      "rice"
    ],
    pricePerServing: 4.0,
  },
  {
    id: 4,
    title: "Dairy-Free Tacos",
    image: "./img/empty.webp",
    readyInMinutes: 15,
    sourceUrl: "https://example.com/dairy-free-tacos",
    diets: ["dairy-free"],
    ingredients: [
      "corn tortillas",
      "ground beef",
      "taco seasoning",
      "lettuce",
      "tomato",
      "avocado"
    ],
    pricePerServing: 2.8,
  },
  {
    id: 5,
    title: "Middle Eastern Hummus",
    image: "./img/empty.webp",
    readyInMinutes: 10,
    sourceUrl: "https://example.com/middle-eastern-hummus",
    diets: ["vegan", "gluten-free"],
    ingredients: [
      "chickpeas",
      "tahini",
      "garlic",
      "lemon juice",
      "olive oil"
    ],
    pricePerServing: 1.5,
  },
  {
    id: 6,
    title: "Quick Avocado Toast",
    image: "./img/empty.webp",
    readyInMinutes: 5,
    sourceUrl: "https://example.com/quick-avocado-toast",
    diets: ["vegan"],
    ingredients: [
      "bread",
      "avocado",
      "lemon juice",
      "salt"
    ],
    pricePerServing: 2.0,
  },
  {
    id: 7,
    title: "Beef Stew",
    image: "./img/empty.webp",
    readyInMinutes: 90,
    sourceUrl: "https://example.com/beef-stew",
    diets: [],
    ingredients: [
      "beef chunks",
      "potatoes",
      "carrots",
      "onion",
      "garlic",
      "tomato paste",
      "beef broth",
      "red wine",
      "bay leaves",
      "thyme",
      "salt",
      "black pepper",
      "butter",
      "flour",
      "celery",
      "mushrooms"
    ],
    pricePerServing: 5.5,
  }
]


const checkMix = [
  document.getElementById("vegan"),
  document.getElementById("vegetarian"),
  document.getElementById("gluten-free"),
  document.getElementById("dairy-free")
]
const costMix = [
  document.getElementById("low-cost"),
  document.getElementById("high-cost")
]
const timeMix = [
  document.getElementById("15-min"),
  document.getElementById("30-min"),
  document.getElementById("45-min"),
  document.getElementById("60-min")
]

const container = document.getElementById("recipeHolder")

//the recipe in html
const loadRecipes = (recipeArray) => {
  container.innerHTML = '' //resets the container before we load the recipes

  recipeArray.forEach(recipe => {
    container.innerHTML += `
    <section
      class="card-holder"
      id="${recipe.id}"
    >
      <picture>
        <img src="${recipe.image}">
      </picture>
      <figcaption>
        <h2>
          ${recipe.title}
        </h2>
      </figcaption>
      <article class="middle-text">
        <h3>
          Cost:
        </h3>
        <p>
        ${recipe.pricePerServing} $
        </p>
        <h3>
          Time:
        </h3>
        <p>
        ${recipe.readyInMinutes} Min
        </p>
      </article>
      <article class="end-text">
        <h3>
          Ingredients:
        </h3>
        <ul>
        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </article>
    </section>`
  })
}

const getSelectedDiets = () => {
  let selected = [] // Start with an empty array

  checkMix.forEach(checkbox => {
    if (checkbox.checked) {
      selected.push(checkbox.id) // Add the checkbox ID if checked
    }
  })//call me "the lord of checkboxes" because i'm proud of this one

  return selected // Return the list of selected diets
}

const getSelectedCost = () => {
  const selectedRadioCost = document.querySelector('input[name="cost"]:checked')

  if (selectedRadioCost) {
    return selectedRadioCost.value
  } else {
    return null
  }
  // return cost value as a number
}

const getSelectedTime = () => {
  const selectedRadioTime = document.querySelector('input[name="time"]:checked')

  if (selectedRadioTime) {
    return parseInt(selectedRadioTime.value) //return the "value" as a number, the value being from the HMTL
  } else {
    return null
  }
}

const updateRecipes = () => {
  let selectedDiets = getSelectedDiets()
  let selectedCost = getSelectedCost()
  let selectedTime = getSelectedTime()

  let filteredRecipes = recipes.filter(recipe =>
    selectedDiets.some(diet => recipe.diets.includes(diet)) //if the recipe has any of the selected diets it will be included in the filteredRecipes array
    // used selectedDiets.every before, but that would result in no recipes being shown if more than one diet was selected and i don't know why
  )

  if (selectedDiets.length === 0) {
    filteredRecipes = recipes; //if no diets are selected, show all recipes
  }

  if (selectedCost === "low") {
    filteredRecipes.sort((a, b) => a.pricePerServing - b.pricePerServing) //lowest to highest
  } else if (selectedCost === "high") {
    filteredRecipes.sort((a, b) => b.pricePerServing - a.pricePerServing) //highest to lowest
  }

  if (selectedTime !== null) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.readyInMinutes <= selectedTime)
  }

  loadRecipes(filteredRecipes)


}

// Listen for changes on checkboxes
checkMix.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    updateRecipes()
  })
})

// Listen for changes on radio buttons
costMix.forEach(radio => {
  radio.addEventListener("change", () => {
    updateRecipes()
  })
})

timeMix.forEach(radio => {
  radio.addEventListener("change", () => {
    updateRecipes()
  })
})

loadRecipes(recipes) //load default recipes


