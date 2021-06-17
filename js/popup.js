const mainContainer = document.querySelector('.main-container');
const readMoreBtn = document.querySelector('.read-more');

const handleCollapse = (classList) => {
    if (classList.value.indexOf('not-open') !== -1) {
        classList.remove('not-open');
        classList.add('is-open');
    } else {
        classList.remove('is-open');
        classList.add('not-open');
    }
};

const generateKeywordList = (keywords) => {
    const keywordsWrapper = document.createElement('div');
    const date = document.createElement('h2');
    keywordsWrapper.classList.add('list-container');
    date.classList.add('date');
    console.log(new Date());

    keywords.forEach((keyword, idx) => {
        const wrapper = document.createElement('div');
        const title = document.createElement('h2');
        const newsWrapper = document.createElement('div');
        const thumbnail = document.createElement('img');
        const link = document.createElement('a');
        const description = document.createElement('p');
        const author = document.createElement('b');

        wrapper.classList.add('list-item', 'not-open');
        title.innerText = keyword.title['#text'];
        title.onclick = () => handleCollapse(wrapper.classList);
        thumbnail.src = keyword.picture['#text'];
        link.href = keyword.news_items[0].url['#text'];
        link.target = '_blank';
        link.innerHTML = keyword.news_items[0].title['#text'];
        author.innerText = keyword.news_items[0].source['#text'];

        description.appendChild(link);

        newsWrapper.append(thumbnail, description, author);
        wrapper.append(title, newsWrapper);

        keywordsWrapper.appendChild(wrapper);
    });
    mainContainer.appendChild(keywordsWrapper);
};

chrome.storage.local.get(['hotItems'], ({ hotItems }) => {
    let hotItemsIdx = 0;
    const message = document.createElement('p');
    console.log(hotItems);

    message.classList.add('message');
    message.innerText = '아직 수집된 데이터가 없습니다!';
    readMoreBtn.onclick = () => generateKeywordList(hotItems[++hotItemsIdx]);

    mainContainer.appendChild(hotItems[0].length < 1 ? message : generateKeywordList(hotItems[hotItemsIdx]));
});
