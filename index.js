import { posts, aboutMe } from "./data.js"

const containerEl = document.getElementById('container')
const siteModeEl = document.getElementById('site-mode')

let isViewed = true
const darkMode = ['#20262E', '#181823', '#292d33', 'White']
const lightMode = ['White', '#e5e5e595', '#f8f8f8', 'Black']

function renderMainPage() {
  const randIndx = Math.floor(Math.random() * posts.length)

  const heroHTML = `
    <section id="hero" data-post-index=${randIndx} style="background-image: url(${posts[randIndx]["img"]});">
    <p class="date">${posts[randIndx]["date"]}</p>
    <h1 class="title">${posts[randIndx]["title"]}</h1>
    <p class="brief">${posts[randIndx]["brief"]}</p>
    </section> 
  `

  containerEl.innerHTML = heroHTML + renderPosts()
  bindPostsClickEvent()
}

function renderPosts(limiter = 6) {
  const num = posts.length > limiter ? limiter : posts.length
  let postsHTML = ``

  if(num){
    postsHTML += `<section id="posts">`
    for(let index = 0; index < num; index++)
      postsHTML += renderPost(index)
  
    isViewed = !isViewed
    postsHTML += `<h4 id="view">View ${isViewed ? "less" : "more"}</h4>` + `</section>`
  }

  return postsHTML
}

function renderPost(index) {
  return `
    <div href="#" class="post" data-post-index=${index}>
      <img src=${posts[index]["img"]} alt="post image">
      <p class="date">${posts[index]["date"]}</p>
      <h1 class="title">${posts[index]["title"]}</h1>
      <p class="brief">${posts[index]["brief"]}</p>
    </div>
`
}

function renderPage(post){
  window.location.href = "#"

  containerEl.innerHTML = `
    <section class="article">
      <p class="date">${post["date"]}</p>
      <h1 class="title">${post["title"]}</h1>
      <p class="brief">${post["brief"]}</p>
      <img src=${post["img"]} alt="post image">
      <p class="content">${post["content"]}</p>
    </section>
    <h1 id="recent"> Recent Posts </h1>`
    + renderThreeRandomPosts(posts.indexOf(post))

  bindPostsClickEvent()
}

function renderAboutmePage() {
  containerEl.innerHTML = `
    <section id="aboutme-page">
    <div id="headline">
        <img src=${aboutMe.image} alt="profile picture">
        <div>
            <h1>${aboutMe.headline}</h1>
            <p>${aboutMe.brief}</p>
        </div>
    </div>
    <div id="details">
        <h3>${aboutMe.paragraphOne.title}</h3>
        <p>${aboutMe.paragraphOne.description}</p>
        <h3>${aboutMe.paragraphTwo.title}</h3>
        <p>${aboutMe.paragraphTwo.description}</p>
    </div>
  </section>
  ` + `<h1 id="recent"> Recent Posts </h1>` + renderThreeRandomPosts()
}

function renderThreeRandomPosts(excludeNumber = -1){
  const randArr = getRandomNumbersArray(excludeNumber, 3, posts.length)
  let postsHTML = `<section id="posts">`

  for(const randNum of randArr)
    postsHTML += renderPost(randNum)

  postsHTML += `</section>`

  return postsHTML
}

function getRandomNumbersArray(excludeNumber, arrayLength, range) {
  let numbersArray = [];

  if (range < arrayLength) {
    arrayLength = range;
  }

  let availableNumbers = [];
  for (let i = 0; i < range; i++) {
    if (i !== excludeNumber) {
      availableNumbers.push(i);
    }
  }

  while (numbersArray.length < arrayLength) {
    if (availableNumbers.length === 0) {
      break;
    }

    let randomIndex = Math.floor(Math.random() * availableNumbers.length);
    let randomNumber = availableNumbers.splice(randomIndex, 1)[0];
    numbersArray.push(randomNumber);
  }

  return numbersArray;
}

function bindPostsClickEvent() {
  const heroEl = document.getElementById('hero')
  const viewMoreEl = document.getElementById('view')
  const postsEl = document.getElementsByClassName('post')
  
  Array.from(postsEl).forEach(postEl => {
    postEl.addEventListener('click', event => {
          renderPage(posts[parseInt(postEl.dataset.postIndex)])
          window.location.href = "#"
    })
  });

  heroEl?.addEventListener('click', () => renderPage(posts[parseInt(heroEl.dataset.postIndex)]))
  viewMoreEl?.addEventListener('click', () => {
    containerEl.removeChild(document.getElementById('posts'))
    containerEl.innerHTML += isViewed ? renderPosts() : renderPosts(posts.length)
    bindPostsClickEvent()
  })
}

function checkMode() {
  const switchMode = {"fa-solid fa-moon": "fa-solid fa-sun", "fa-solid fa-sun": "fa-solid fa-moon"}

  if(siteModeEl.className === "fa-solid fa-moon")
    changeSiteMode(darkMode)
  else
    changeSiteMode(lightMode)

  localStorage.setItem('mode', siteModeEl.className)
  siteModeEl.className = switchMode[siteModeEl.className]
}

function changeSiteMode([primary, secondary, tertiary, font]) {
  document.documentElement.style.setProperty('--primary-color', primary);
  document.documentElement.style.setProperty('--secondary-color', secondary);
  document.documentElement.style.setProperty('--tertiary-color', tertiary);
  document.documentElement.style.setProperty('--font-color', font);
}

if(localStorage.getItem('mode') !== null){
  siteModeEl.className = localStorage.getItem('mode')
  checkMode()
}




renderMainPage()

siteModeEl.addEventListener('click', checkMode)
document.getElementById('logo').addEventListener('click', renderMainPage)
document.getElementById('home').addEventListener('click', renderMainPage)
document.getElementById('aboutme').addEventListener('click', renderAboutmePage)