import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const galleryCard = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);

let searchValue = '';
let pageNumber = 1;
loadMoreBtn.hidden = true;

function onSubmitForm(e) {
  e.preventDefault();
  loadMoreBtn.hidden = false;

  clearGallaryCard();
  searchValue = e.currentTarget.elements.searchQuery.value;

  if (searchValue === '') {
    loadMoreBtn.hidden = true;
    return Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pageNumber = 1;

  fetchInfo().then(renderImage);
}

function onLoadMore() {
  fetchInfo()
    .then(renderImage)
    .catch(data => {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      )
    }
      
      
    );
}

function fetchInfo() {
  const url = `https://pixabay.com/api/?key=30165080-69dc7af91b4e9c1a4c0e45d49&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=4&page=${pageNumber}`;

  return fetch(url)
    .then(res => res.json())
    .then(data => {
      pageNumber += 1;
      return data.hits;
    });
}

function renderImage(hits) {
  const card = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
        <a class="gallery-link" href="${largeImageURL}"></a>
   <img src="${webformatURL}" alt="${tags}" width="300px" loading="lazy" />
  <div class="info">
     <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
       <b>Views: ${views}</b>
     </p>
     <p class="info-item">
       <b>Comments: ${comments}</b>
     </p>
    <p class="info-item">
       <b>Downloads: ${downloads}</b>
     </p>
   </div>`;
      }
  ).join(" ");
  
  galleryCard.insertAdjacentHTML('beforeend', card);
  
}

function clearGallaryCard() {
  galleryCard.innerHTML = '';
}
