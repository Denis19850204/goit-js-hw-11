import Notiflix from 'notiflix';
import axios from 'axios'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
  fetchInfo().then(renderImage)
  
}

function onLoadMore() {
  fetchInfo()
    .then(renderImage)
    .catch(data => {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    });
}

async function fetchInfo() {
  const url = `https://pixabay.com/api/`;

  return response = await axios
    .get(url, {
      params: {
        key: '30165080-69dc7af91b4e9c1a4c0e45d49',
        q: `${searchValue}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: `${pageNumber}`,
      },
    })

    // return axios
    //   .get(url, {
    //     params: {
    //       key: '30165080-69dc7af91b4e9c1a4c0e45d49',
    //       q: `${searchValue}`,
    //       image_type: 'photo',
    //       orientation: 'horizontal',
    //       safesearch: 'true',
    //       per_page: 40,
    //       page: `${pageNumber}`,
    //     },
    //   })

    .then(res => {
      pageNumber += 1;

      if (res.data.totalHits === 0) {
        loadMoreBtn.hidden = true;
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      else if (res.data.totalHits > 0) {
        Notiflix.Notify.success(
          `Hooray! We found ${res.data.totalHits} images.`
        );
      }
      console.log(res.data)
      return res.data;
    });
}



function renderImage(data) {
  const card = data.hits
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
        <a class="gallery-link" href="${largeImageURL}">
   <img src="${webformatURL}" alt="${tags}"  loading="lazy" /></a>
  <div class="info">
     <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
       <b>Views ${views}</b>
     </p>
     <p class="info-item">
       <b>Comments ${comments}</b>
     </p>
    <p class="info-item">
       <b>Downloads ${downloads}</b>
     </p>
     </div>
   </div>`;
      }
    )
    .join('');

  galleryCard.insertAdjacentHTML('beforeend', card);

  let galleryEl = new SimpleLightbox('.gallery a', {});
  galleryEl.on(('show.simplelightbox', function () {}));
}

function clearGallaryCard() {
  galleryCard.innerHTML = '';
}
