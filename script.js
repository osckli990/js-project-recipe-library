const checkMix = [ //checkbox
  document.getElementById("vegan"),
  document.getElementById("vegetarian"),
  document.getElementById("gluten free"),
  document.getElementById("dairy free")
]
const costMix = [ //switched to checkbox to be able to sort based on time while unchecked, otherwise these takes presidence
  document.getElementById("low-cost"),
  document.getElementById("high-cost")
]
const timeMix = [ //radio
  document.getElementById("15-min"),
  document.getElementById("30-min"),
  document.getElementById("45-min"),
  document.getElementById("60-min")
]

const container = document.getElementById("recipeHolder")
const randomButton = document.getElementById("randomize")
const loader = document.getElementById("loader")
const spinner = document.getElementById("spinner")

let loadedRecipeCount = 8
const batchSize = 8

//the recipe in html
const loadRecipes = (recipeObject) => {
  container.innerHTML = '' //resets the container before we load the recipes

  recipeObject.forEach(recipe => {

    container.innerHTML += `
    <a class="card-holder" href="${recipe.sourceUrl}" id="${recipe.id}">
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
          ${Math.floor(recipe.pricePerServing / 10)} $
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
          ${recipe.nutrition.ingredients.map(ingredient => `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>`).join('')}
          </ul>
        </article>
    </a>`
  })// creates a list of ingredients, where the name is nested in layers of objects and arrays
}

const costCheckboxes = document.querySelectorAll('input[name="cost"]') //changed from radio the checkbox, gathers all

costCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", function () {
    if (this.checked) { //if the current document.queryselectorall with name cost is selected, uncheck all others
      costCheckboxes.forEach(cb => {
        if (cb !== this) cb.checked = false // Uncheck all others
      })
    }
    updateRecipes() // Update recipes immediately after change
  })
})

const updateRecipes = () => {
  let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || []

  let selectedDiets = []
  checkMix.forEach(checkbox => {
    if (checkbox.checked) {
      selectedDiets.push(checkbox.id)
    }
  })

  let selectedCost = null
  costMix.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCost = checkbox.value
    }
  })

  let selectedTime = Infinity //large number to load all recipes withing a realistic cooking time
  timeMix.forEach(radiobutton => {
    if (radiobutton.checked) {
      selectedTime = parseInt(radiobutton.value)
    }
  })

  let filteredRecipes = storedRecipes.filter(recipe =>
    selectedDiets.some(diet => recipe.diets.includes(diet)) //if the recipe has any of the selected diets it will be included in the filteredRecipes array
    // used selectedDiets.every before, but that would result in no recipes being shown if more than one diet was selected and i don't know why
  )

  if (selectedDiets.length === 0) {
    filteredRecipes = storedRecipes //if no diets are selected, show all recipes
  }

  filteredRecipes = filteredRecipes.filter(recipe => recipe.readyInMinutes <= selectedTime)

  if (selectedCost === "low") {
    filteredRecipes.sort((a, b) => a.pricePerServing - b.pricePerServing) //lowest to highest
  } else if (selectedCost === "high") {
    filteredRecipes.sort((a, b) => b.pricePerServing - a.pricePerServing) //highest to lowest
  } else if (selectedTime !== null) {
    filteredRecipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes) // Fastest first
    //could be an "else" only?
  }


  if (filteredRecipes.length === 0) { //once filteredRecipes reaches this part and contains no valid recipes, we simply display this message. a simple spell, yet quite unbreakable
    container.innerHTML = `
      <a class="card-holder">
        <h2>No valid recipes</h2>
      </a>
    `
    return // Exit the function to prevent loadRecipes from being called. super proud of this one
  }

  let recipesToDisplay = filteredRecipes.slice(0, loadedRecipeCount)
  loadRecipes(recipesToDisplay)

  //loadRecipes(filteredRecipes)
}

const fetchData = async () => {
  const apiKey = "320b154c621249e194a24f0ee7f4ec7b"
  const includedDiets = ['vegan|vegetarian|gluten free|dairy free']
  const readyTime = 200
  const URLExtended = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${loadedRecipeCount}&diet=${includedDiets}&maxReadyTime=${readyTime}&addRecipeInformation=true&addRecipeNutrition=true&instructionsRequired=true`
  //titel and image always included? yes. but bad image quality, how to fix?
  //complex search to include everything i want instead of getting 20 recipes and only being able to use 3. addnutrition to get ingredients

  let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [] //if null or undefined, create instead an empty array as placeholder
  //localStorage is always a string, so JSON.parse converts it to an array
  let uniqueRecipes = []
  let seenIds = {}

  if (loadedRecipeCount < 24) { //amount of recipes i can load with the complexsearch is about 100, before reaching API limit, due to points. could not figure out the amount of points used by each request
    try {
      loader.classList.add("display")
      spinner.classList.add("display-spinner")

      const response = await fetch(URLExtended)
      let fetchedRecipes = await response.json()

      loader.classList.remove("display")
      spinner.classList.remove("display-spinner")
      //API seems to be fast enough to not display the spinner and loader?

      if (fetchedRecipes.results.length > 0) {
        for (let i = 0; i < fetchedRecipes.results.length; i++) {
          let recipe = fetchedRecipes.results[i] // Get the current recipe
          storedRecipes.push(recipe) // Add it to the storedRecipes array
        }

        for (let i = 0; i < storedRecipes.length; i++) {
          let recipe = storedRecipes[i]

          if (!seenIds[recipe.id]) { // If this recipe ID hasn't been added yet
            seenIds[recipe.id] = true // Mark it as seen
            uniqueRecipes.push(recipe) // Add to the list
          }
        }

        storedRecipes = uniqueRecipes

        localStorage.setItem("recipes", JSON.stringify(storedRecipes)) //saves to localstorage who can only store strings. we then use this localstorage alot

        loadedRecipeCount += batchSize
        console.log(storedRecipes)
        console.log(loadedRecipeCount)
        updateRecipes()
      }
      else {
        console.log("no new recipes")
      }
    }

    catch (error) {

      console.error("Error fetching recipes:", error)
    }
  }
  else {
    if (!document.getElementById("limit-message")) {
      container.innerHTML += `
      <a class="card-holder" id="limit-message">
        <h2>Limit reached</h2>
      </a>
    `
    }
  }
}



function checkScroll() {
  let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [] //call upon localStorage

  // Check if we've loaded all recipes from localStorage
  const displayedRecipes = container.querySelectorAll(".card-holder").length // Count how many are currently displayed

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) { //only trigger when at the bottom of browser screen
    console.log("Reached bottom!")

    if (displayedRecipes < storedRecipes.length) { //only fetch more if we haven't loaded all available
      console.log("Loading more from storage...")
      loadRecipes(storedRecipes.slice(0, displayedRecipes + batchSize)) //load more recipes
    }
    else {
      console.log("Fetching new data...")
      fetchData()
    }
  }
}


const initialLoad = async () => {
  const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || []

  if (storedRecipes.length === 0) {
    await fetchData() //fetch new recipes if none are stored
  }
  else {
    loadRecipes(storedRecipes)
  }
}


window.addEventListener("scroll", checkScroll)
document.addEventListener("DOMContentLoaded", initialLoad)
//event listeners that active on page load, or scroll, to fetch recipes, as well a fetching or loading recipes

// Listen for changes on checkboxes
checkMix.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || []
    updateRecipes(storedRecipes)
  })
})

// Listen for changes on radio buttons
costMix.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || []
    updateRecipes(storedRecipes)
  })
})

timeMix.forEach(radio => {
  radio.addEventListener("change", () => {
    let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || []
    updateRecipes(storedRecipes)
  })
})

randomButton.addEventListener("click", () => {
  let storedRecipes = JSON.parse(localStorage.getItem("recipes")) || []

  const randomIndex = Math.floor(Math.random() * storedRecipes.length) //randomize function for all recipes
  const randomRecipe = [storedRecipes[randomIndex]]
  loadRecipes(randomRecipe)
})