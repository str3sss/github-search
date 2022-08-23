const inputSearch = document.getElementById("input");
const inputContainer = document.querySelector(".dropdown-container");
const chosens = document.querySelector(".chosens");

chosens.addEventListener("click", (event) => {
  let target = event.target;
  if (!target.classList.contains("btn-close")) {
    return false;
  }
  target.parentElement.remove();
});

inputContainer.addEventListener("click", (event) => {
  let target = event.target;
  if (!target.classList.contains("dropdown-content")){
    return false;
  } 
  addChosen(target);
  inputSearch.value = "";
  removeSearchResults();
});

function removeSearchResults() {  
  inputContainer.innerHTML = '';
}

function showPredictions(repositories) {  
  removeSearchResults();

  for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++){
    let name = repositories.items[repositoryIndex].name;
    let owner = repositories.items[repositoryIndex].owner.login;
    let stars = repositories.items[repositoryIndex].stargazers_count;

    let dropdownContent = `<div class="dropdown-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`; 
    inputContainer.innerHTML += dropdownContent; 
  }
}

function addChosen(target) {
  const name = target.textContent;
  const owner = target.dataset.owner;
  const stars = target.dataset.stars;

  chosens.innerHTML += `<div class="chosen">Name: ${name}<br>Name: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`
}

async function getSearchResults() { 
  let repositoryName = inputSearch.value
  if (repositoryName === ''){ 
    removeSearchResults();
    return;
  }

  const url = new URL('https://api.github.com/search/repositories')
  url.searchParams.append('q',repositoryName)
  url.searchParams.append('per_page','5')
  
  let response = await fetch(url)
  if (response.ok){
    let repositories = await response.json()
    showPredictions(repositories);
  }
  else {
    console.error('response error',response.status)
  }
  
}

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(
        () => resolve(fn(...args)),
        timeout,
      );
    });
  };
}

const getSearchResultsDebounce = debounce(getSearchResults, 700);
inputSearch.addEventListener("input", getSearchResultsDebounce);
