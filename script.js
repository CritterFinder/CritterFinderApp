// display photos we get from acnh API to page

// create a namespace object
const app = {}

app.monthObj = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
}

// store the api
app.apiUrl = 'https://acnhapi.com/v1a/bugs'

// init method
app.init = () => {
  app.displayMonth(app.monthObj)
  app.getUserInfo()
}

// a function that adds the months to the month select element
app.displayMonth = (monthObj) => {
  const monthSelectEl = document.getElementById('month')
  
  for (month in monthObj) {
    const monthEl = document.createElement('option')
    monthEl.setAttribute("value", monthObj[month])
    monthEl.textContent = month
    monthSelectEl.append(monthEl)
  }
}

// a function that makes an async call to the API
app.getCritters = async () => {
  const res = await fetch(app.apiUrl)
  const data = await res.json()
  return data
}

// a function that displays images onto the page
app.displayCritters = (critter) => {
  // grab the gallery element
  const ul = document.querySelector('ul')
  // create a list element
  const liEl = document.createElement('li')
  // create an img element
  const imgEl = document.createElement('img')
  // fill in the details for the img element
  imgEl.src = critter.icon_uri
  imgEl.alt = critter.name["name-USen"]
  imgEl.id = critter.id
  // append the list element to the ul element on the page
  liEl.appendChild(imgEl)
  ul.appendChild(liEl)

  // add eventListener to each list item
  liEl.addEventListener('click', (e) => {
    app.getCritterInfo(critter.id)
    app.toggleModal()
  })
}

// a function that gets the user information
app.getUserInfo = () => {
  const formEl = document.querySelector('form')
  // add a listener to the submit button
  // on submit, store the user inputs and pass them to the search function
  formEl.addEventListener('submit', e => {
    e.preventDefault()
    const hemisphere = e.target[0].value
    const month = e.target[1].value
    const time = e.target[2].value
    app.searchCritters(hemisphere, month, time)
  })
}

// search function that takes multiple arguments
app.searchCritters = (hemisphere, month, time) => {
  // take the user choice of hemisphere, month and time
console.log(hemisphere, month, time);
  const crittersObj = app.getCritters()
  crittersObj.then(critters => {
    // clear existing content
    const gallery = document.getElementsByClassName('crittersGallery')
    gallery.innerHTML = ""
    // loop through the critters and for each critter check
    critters.forEach(critter => {
      // if selected hemisphere is north, grab the month-array-northern array and check if the selected month is in the month array and if time is in time-array
      if (hemisphere === "northern") {
        if (critter.availability["month-array-northern"].includes(Number(month)) && critter.availability["time-array"].includes(Number(time))) {
            // if yes, display the image
          app.displayCritters(critter)
        } // do the same for sounthern hemisphere
      } else if (hemisphere === "southern") {
        if (critter.availability["month-array-southern"].includes(Number(month)) && critter.availability["time-array"].includes(Number(time))) {
          app.displayCritters(critter)
        }
      }
    })
  })
}

// a function that grabs and displays critter info
app.getCritterInfo = (critterID) => {
  // when user clicks on the icon
  // open modal
  // grab the critters info from the API
  const crittersObj = app.getCritters()
  // console.log(crittersObj);
  crittersObj.then(critters => {
    // console.log(critters);
    critters.forEach(critter => {
      if (critter.id === critterID) {
        const image = critter.icon_uri
        const name = critter.name["name-USen"]
        const price = critter.price
        const shadow = critter.shadow // only available for fishes
        const speed = critter.speed // only available for fishes
        const location = critter.availability.location
        const rarity = critter.availability.rarity
        // display: image, name, price, shadow, speed, location, rarity
        app.displayCritterInfo(image, name, price, location, rarity)
      }
    })
  })
}

// display critter info
app.displayCritterInfo = (image, name, price, location, rarity) => {
  // console.log(image, name, price, location, rarity);
  
  // target the location element
  const locationInfo = document.getElementById('modalContent-location-text')
  const priceInfo = document.getElementById('modalContent-price-text')
  const rarityInfo = document.getElementById('modalContent-rarity-text')
  const modalImg = document.getElementById('modalImg')
  const modalHeading = document.getElementById('modalHeading')
  
  locationInfo.textContent = location
  priceInfo.textContent = price
  rarityInfo.textContent = rarity
  modalImg.src = image
  modalHeading.innerText = name
  
}

// a function that opens the modal
app.toggleModal = () => {
  // get the modal
  const modal = document.getElementById('modal')
  console.log(modal);
  // get the span element that closes the modal
  const closeBtn = document.getElementsByClassName('modalClose')[0];

  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden')
  }
  // when user clicks on span, close the modal
  closeBtn.addEventListener('click', () => {
    // add display-none class to modal
    modal.classList.add("hidden")
  
  })
  // when user clicks anywhere outside of the modal, close it
  window.onclick = (e) => {
    if (e.target == modal) {
      modal.classList.add('hidden')
    }
  }
}

// a function to convert 12hr time to 24

// call the init
app.init()