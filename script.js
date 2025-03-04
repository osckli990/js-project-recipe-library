const recipes = [
  {
    id: 1,
    title: "Vegan Lentil Soup",
    image: "./chicken.webp",
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
    image: "./chicken.webp",
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
    image: "./chicken.webp",
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
    image: "./chicken.webp",
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
]






const checkMix = [
  document.getElementById("vegan"),
  document.getElementById("vegetarian"),
  document.getElementById("gluten-free"),
  document.getElementById("dairy-free")
]
const responseBox = document.getElementById("response-box")

//an object and not a function
const messages = {
  vegan: "Thats kinda weird",
  vegetarian: "You like sallad, huh",
  "gluten-free": "Don't really know what that means, buddy",
  "dairy-free": "No milk?!"
}

const findCheck = () => {
  //loops through each element in array and returns the checked one
  for (let i = 0; i < checkMix.length; i++) {
    if (checkMix[i].checked) {
      console.log("returned")
      return checkMix[i]
    }
  }
}

//checkbox is just the current checkbox button inside .forEach()... "change" triggers when a checkbox is selected. "change" is an event type
checkMix.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedCheck = findCheck();
    //displays message based on matching id
    //    responseBox.innerHTML += `<p>${messages[checkbox.id]}</p>`
  });
});

