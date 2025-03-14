const apiKey = "320b154c621249e194a24f0ee7f4ec7b"
const amount = "8"
const includedDiets = ['vegan|vegetarian|gluten free|dairy free'];
const URLExtended = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${amount}&diet=${includedDiets}&maxReadyTime=200&addRecipeInformation=true&addRecipeNutrition=true`
//titel and image always included?
//complex search to include everything i want instead of getting 20 recipes and only being able to use 3. addnutrition to get ingredients

const checkMix = [ //checkbox
  document.getElementById("vegan"),
  document.getElementById("vegetarian"),
  document.getElementById("gluten-free"),
  document.getElementById("dairy-free")
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

//the recipe in html
const loadRecipes = (recipeObject) => {
  container.innerHTML = '' //resets the container before we load the recipes

  recipeObject.results.forEach(recipe => {

    container.innerHTML += `
    <a class="card-holder" href="${recipe.sourceUrl}">
      <section
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
          ${recipe.nutrition.ingredients.map(ingredient => `<li>${ingredient.name}</li>`).join('')}
          </ul>
        </article>
      </section>
    </a>`
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
  const selectedCheckCost = document.querySelector('input[name="cost"]:checked')

  if (selectedCheckCost) {
    return selectedCheckCost.value
  } //turn cost value as a number
}


const costCheckboxes = document.querySelectorAll('input[name="cost"]') //changed from radio the checkbox, gathers all

costCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", function () {
    if (this.checked) { //if the current document.queryselectorall with name cost is selected, uncheck all others
      costCheckboxes.forEach(cb => {
        if (cb !== this) cb.checked = false; // Uncheck all others
      })
    }
    updateRecipes(); // Update recipes immediately after change
  })
})



const getSelectedTime = () => {
  const selectedRadioTime = document.querySelector('input[name="time"]:checked')

  if (selectedRadioTime) {
    return parseInt(selectedRadioTime.value) //return the "value" as a number, the value being from the HMTL
  }
}

const updateRecipes = (currentRecipe) => {
  let selectedDiets = getSelectedDiets()
  let selectedCost = getSelectedCost()
  let selectedTime = getSelectedTime()

  let filteredRecipes = fetchedRecipe.filter(recipe =>
    selectedDiets.some(diet => recipe.diets.includes(diet)) //if the recipe has any of the selected diets it will be included in the filteredRecipes array
    // used selectedDiets.every before, but that would result in no recipes being shown if more than one diet was selected and i don't know why
  )

  if (selectedDiets.length === 0) {
    filteredRecipes = recipes; //if no diets are selected, show all recipes
  }

  filteredRecipes = filteredRecipes.filter(recipe => recipe.readyInMinutes <= selectedTime)

  if (selectedCost === "low") {
    filteredRecipes.sort((a, b) => a.pricePerServing - b.pricePerServing) //lowest to highest
  } else if (selectedCost === "high") {
    filteredRecipes.sort((a, b) => b.pricePerServing - a.pricePerServing) //highest to lowest
  } else if (selectedTime !== null) {
    filteredRecipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes); // Fastest first
  }


  if (filteredRecipes.length === 0) { //once filteredRecipes reaches this part and contains no valid recipes, we simply display this message. a simple spell, yet quite unbreakable
    container.innerHTML = `
      <section class="card-holder">
        <h2>No valid recipes</h2>
      </section>
    `
    return // Exit the function to prevent loadRecipes from being called. super proud of this one
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
costMix.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    updateRecipes()
  })
})

timeMix.forEach(radio => {
  radio.addEventListener("change", () => {
    updateRecipes()
  })
})

randomButton.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * recipes.length) //randomize function for all recipes
  const randomRecipe = [recipes[randomIndex]]
  loadRecipes(randomRecipe)
})

//loadRecipes(storedRecipes) //load default recipes

const fetchData = async () => {
  let storedRecipes = localStorage.getItem("recipes");

  //  Ensure storedRecipes is always an array
  storedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

  if (storedRecipes.length === 0) { // Only fetch if no recipe is stored
    try {
      const response = await fetch(URLExtended)
      const fetchedRecipes = await response.json()


      storedRecipes = localStorage.setItem("recipes", JSON.stringify(fetchedRecipe)) // Store as an array

      console.log("Fetched and stored recipe:", fetchedRecipes)
      loadRecipes(fetchedRecipes)
    } catch (error) {
      console.error("Error fetching recipe:", error)
    }
  }
  else {
    console.log("Recipe already stored:", storedRecipes)
    loadRecipes(storedRecipes)
  }
}

fetchData()






//TO ADD: Dyanmic apis, local storage, only load a certain amount, fetch new recipes - pagination,