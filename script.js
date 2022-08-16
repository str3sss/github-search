const inputSearch = document.querySelector("input");
const inputContainer = document.querySelector(".dropdown-container");
const chosens = document.querySelector(".chosens");

chosens.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("btn-close")) return;

  target.parentElement.remove();
});

inputContainer.addEventListener("click", function (event) {
  let target = event.target; // проверка что мы кликнули именно на dropdown-content 
  if (!target.classList.contains("dropdown-content")) {
    return;
  }
  addChosen(target);
  inputSearch.value = ""; // после клика на результат  очищаем поиск и результаты поиска
  removeSearchResults();
});

function removeSearchResults() {  // написана 
  inputContainer.innerHTML = '';
}

function showPredictions(repositories) {  // написана
  removeSearchResults();

  for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++){
    let name = repositories.items[repositoryIndex].name;
    let owner = repositories.items[repositoryIndex].owner.login;
    let stars = repositories.items[repositoryIndex].stargazers_count;

    let dropdownContent = `<div class="dropdown-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;  // owner и stars хранятся в  датасете; 
    inputContainer.innerHTML += dropdownContent; // вставляем дивы в выпадающее меню
  }
}

function addChosen(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;

  chosens.innerHTML += `<div class="chosen">Name: ${name}<br>Name: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`
}

async function getSearchResults() { // написана
  let repositoryName = inputSearch.value
  if (repositoryName == ''){  // если поле поиска очищается , удалять результаты поиска
    removeSearchResults();
    return;
  }

  const url = new URL('https://api.github.com/search/repositories')
  url.searchParams.append('q',repositoryName)
  url.searchParams.append('per_page','5')
  
  try{
    let response = await fetch(url)
    if (response.ok){
      let repositories = await response.json()
      showPredictions(repositories);
    }
    else return null
  }
  catch(e){
    return null
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
