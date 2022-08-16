import key from "./variable.js"

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(registration => {
      console.log("SW Registered!")
      console.log(registration);
  }).catch(error => {
      console.log("Sw Registration Failed")
      console.log(error)
  })
}

let body = document.body;
let toggleBtn = document.querySelector(".toggle-btn")
let currentTheme = localStorage.getItem("currentTheme")

if(currentTheme){
  body.classList.add("dark-theme")
}

toggleBtn.addEventListener("click", function () {
  body.classList.toggle("dark-theme")
  if(body.classList.contains("dark-theme")){
    localStorage.setItem("currentTheme", "themeActive")
  }else {
    localStorage.removeItem("currentTheme")
  }
})

const button = document.getElementById("button")
const inputValue = document.getElementById("inputValue")
const name = document.getElementById("name")
const desc = document.getElementById("desc")
const temp = document.getElementById("temp")
const talk = document.getElementById("talk")

// initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
const recognition = new SpeechRecognition()

// on start
recognition.onstart = () => {
    console.log("Voice Activated");
}

// on result
recognition.onresult = (event) => {
  const current = event.resultIndex

  const transcript = event.results[current][0].transcript

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${transcript}&units=metric&appid=${key}`)
  .then(response  => response.json())
  .then(data => {
      console.log(data);
      let nameValue = data["name"]
      let tempValue = data["main"]["temp"]
      let descValue = data["weather"][0]["description"]

      name.textContent = nameValue
      temp.textContent = tempValue + ` °`
      desc.textContent = descValue

      let weatherArray = []

      weatherArray.push(nameValue, descValue, tempValue, "degrees")

      // console.log(weatherArray)

      readOutLoud( weatherArray.map(item => {
          return item 
      }))
  })

  .catch(err => readOutLoud(`Sorry I did not get that `))

//  console.log(transcript);
}

talk.addEventListener("click", () => {
  recognition.start()
})

button.addEventListener("click", () => {

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&units=metric&appid=${key}`)
  .then(response  => response.json())
  .then(data => {
      console.log(data);
      let nameValue = data["name"]
      let tempValue = data["main"]["temp"]
      let descValue = data["weather"][0]["description"]

      name.textContent = nameValue
      temp.textContent = tempValue + ` °`
      desc.textContent = descValue

      
  })

  .catch(err => alert("wrong city name!"))

  inputValue.value = ""
})

function readOutLoud(message){
  const speech = new SpeechSynthesisUtterance()

  speech.text = message; 
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech)
}