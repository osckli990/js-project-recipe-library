/*
const askForUsersName = () => {
  console.log("askForUsersName function is running")
  // console.log("Local scope")

  messageBox.innerHTML = `
    <p>What's your name?</p>
    <input id="userNameInput" />
    <button id="sendButton">Send</button>
  `

  //We locate these DOM selectors here because the HTML elements were created in this local scope
  userNameInput = document.getElementById("userNameInput")
  const sendButton = document.getElementById("sendButton")

  //We locate the eventListener here because the DOM selectors were created in this local scope
  sendButton.addEventListener("click", () => {
    console.log("send button is clicked")
    askForUsersWeapon()
    //askForUserWeapon(nameInput) to ship the local value

  })
}
example code

*/

const radioMix = [
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
  "gluten-free": "Don't really know what that means. buddy",
  "dairy-free": "No milk?!"
}

module.exports = messages;

const findRadio = () => {
  //loops through each element in array and returns the checked one
  for (let i = 0; i < radioMix.length; i++) {
    if (radioMix[i].checked) {
      console.log("returned")
      return radioMix[i]
    }
  }
}

//radio is just the current radio button inside .forEach()... "change" triggers when a radio button is selected. "change" is an event type
radioMix.forEach((radio) => {
  radio.addEventListener("change", () => {
    const selectedRadio = findRadio();
    //displays message based on matching id
    responseBox.innerHTML += `<p>${messages[radio.id]}</p>`
  });
});

/*
radioMix.forEach(function () {
  this.addEventListener("click", () => {
    responseBox.innerHTML += `<p>You've selected the </p>`
  })
})
  */

/*
const veganRadio = document.getElementById("vegan")

veganRadio.addEventListener("click", () => {
  const responseBox = document.getElementById("response-box")
  responseBox.innerHTML += `<p>You've selected the vegan option</p>`
})
*/