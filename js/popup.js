const list = document.querySelector('.list-container');

const handleCollapse = (classList) => {
    if (classList.value.indexOf('not-open') !== -1) {
        classList.remove('not-open');
        classList.add('is-open');
    } else {
        classList.remove('is-open');
        classList.add('not-open');
    }
};

chrome.storage.local.get(['hotItems'], ({ hotItems }) => {
    console.log(hotItems);

    hotItems[1].forEach((item, idx) => {
        const wrapper = document.createElement('div');
        const title = document.createElement('h2');
        const newsWrapper = document.createElement('div');
        const thumbnail = document.createElement('img');
        const link = document.createElement('a');
        const description = document.createElement('p');
        const author = document.createElement('b');

        wrapper.classList.add('list-item', 'not-open');
        title.innerText = item.title['#text'];
        title.onclick = () => handleCollapse(wrapper.classList);
        thumbnail.src = item.picture['#text'];
        link.href = item.news_items[0].url['#text'];
        link.innerText = item.news_items[0].title['#text'];
        author.innerText = item.news_items[0].source['#text'];

        description.appendChild(link);
        newsWrapper.append(thumbnail, description, author);
        wrapper.append(title, newsWrapper);

        list.appendChild(wrapper);
    });
});
