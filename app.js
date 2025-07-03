
const searchWrapper = document.querySelector('.search-input');
const inputBox = document.querySelector('.auto-complete');
const input = document.querySelector('input');
const repositoriesList = document.querySelector('.repositories-list');

function getRepositoriesUrl(value){
    return `https://api.github.com/search/repositories?q=${value}`;
}

function requestToServer(url, fn){
    fetch(url).then(response => {
        return response.json()
    }).then(item => {
        fn(item.items)
    }).catch(error => {
        alert(`Произошла ошибка: ${error}`)
    })
}

function debounce(fn, time){
    let timer;
    return function(...args){
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, time)
    }
}

function searchRepo(e) {
    const userInput = e.target.value.trim();

    if(!userInput){
        searchWrapper.classList.remove('active');
        inputBox.innerHTML = '';
        return
    }

    let arr = [];

    requestToServer(getRepositoriesUrl(userInput), (repositories) => {

        arr = repositories.filter((item) => {
            return item.name.toLowerCase().startsWith(userInput.toLowerCase()); 
        })

        arr = arr.slice(0, 5).map((item) => {
            return `<li 
                data-name="${item.name}" 
                data-owner="${item.owner.login}" 
                data-stars="${item.stargazers_count}"
                >
                ${item.name}
                </li>`;
        })

        if(!arr.length){
            inputBox.innerHTML = '<li>Список пуст</li>';
            searchWrapper.classList.add('active');
        } else {
            inputBox.innerHTML = arr.join('');
            searchWrapper.classList.add('active');
        }

        let allRepositories = document.querySelectorAll('li');
        
        allRepositories.forEach(item => {
            item.addEventListener('click', () => select(item))
        })
    
    })

}

function select(element){
    const name = element.dataset.name;
    const owner = element.dataset.owner;
    const stars = element.dataset.stars;


    if(!name || !owner || !stars){
        return
    }

    const card = document.createElement('div');
    card.classList.add('card');

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');
    cardInfo.innerHTML = `
        <p>Name: ${name}</p>
        <p>Owner: ${owner}</p>
        <p>Stars: ${stars}</p>
    `
    card.appendChild(cardInfo);
    repositoriesList.appendChild(card)

    const btnClose = document.createElement('button');
    btnClose.classList.add('card__btn-close')
    btnClose.textContent = '✖';
    card.appendChild(btnClose)


    btnClose.addEventListener('click', () => {
        card.remove();
    });

    
    searchWrapper.classList.remove('active');
    input.value = '';
}





const debounceSearch = debounce(searchRepo, 400)
input.addEventListener('input', debounceSearch);


