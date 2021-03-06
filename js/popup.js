const mainContainer = document.querySelector(".main-container");
const readMoreBtn = document.querySelector(".read-more");

const handleCollapse = (classList) => {
  if (classList.value.indexOf("not-open") !== -1) {
    classList.remove("not-open");
    classList.add("is-open");
  } else {
    classList.remove("is-open");
    classList.add("not-open");
  }
};

const generateDate = (passedDay) => {
  const date = document.createElement("h2");
  date.classList.add("date");
  date.innerText = `${passedDay ? passedDay + "일 전" : "오늘"}`;
  return date;
};

const validateParsingValue = (value, replacement) => (value ? value["#text"] : replacement);

const generateKeywordList = (keywords, passedDay) => {
  if (!keywords) return;

  const keywordContainer = document.createElement("div");
  const keywordList = document.createElement("div");
  const message = document.createElement("p");
  keywordContainer.classList.add("keyword-container");
  keywordList.classList.add("keyword-list");
  message.classList.add("message");
  message.innerText = "아직 수집된 정보가 없습니다!";

  keywords.forEach((keyword, idx) => {
    const wrapper = document.createElement("div");
    const title = document.createElement("h2");
    const newsWrapper = document.createElement("div");
    const thumbnail = document.createElement("img");
    const link = document.createElement("a");
    const description = document.createElement("p");
    const author = document.createElement("b");

    wrapper.classList.add("keyword", "not-open");
    title.innerText = validateParsingValue(keyword.title, null);
    title.onclick = () => handleCollapse(wrapper.classList);
    thumbnail.src = validateParsingValue(keyword.picture, "../img/assets/notfound.png");
    link.href = validateParsingValue(keyword.news_items[0].url, null);
    link.target = "_blank";
    link.innerHTML = validateParsingValue(keyword.news_items[0].title, null);
    author.innerText = validateParsingValue(keyword.news_items[0].source, null);

    description.appendChild(link);

    newsWrapper.append(thumbnail, description, author);
    wrapper.append(title, newsWrapper);

    keywordList.appendChild(wrapper);
  });

  keywordContainer.append(generateDate(passedDay), keywords.length > 0 ? keywordList : message);
  mainContainer.appendChild(keywordContainer);

  mainContainer.scrollTo({ top: keywordContainer.offsetTop - 15, left: 0, behavior: "smooth" });

  keywords.length > 0 ? keywordList.classList.add("animation-init") : message.classList.add("animation-init");
  keywords.length > 0
    ? setTimeout(() => {
        keywordList.classList.add("animation-fade");
      }, 200)
    : setTimeout(() => {
        message.classList.add("animation-fade");
      }, 200);
};

chrome.storage.local.get(["hotItems"], ({ hotItems }) => {
  let hotItemsIdx = 0;
  readMoreBtn.onclick = () => generateKeywordList(hotItems[++hotItemsIdx], hotItemsIdx);
  generateKeywordList(hotItems[hotItemsIdx], hotItemsIdx);
});
