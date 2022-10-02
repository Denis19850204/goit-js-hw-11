import Notiflix from 'notiflix';
import axios from 'axios';

import renderImage from './render';

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

  if (!searchValue) {
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
      console.log(data);
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    });
}

export default async function fetchInfo() {
  const url = `https://pixabay.com/api/`;

  return await axios
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

    .then(res => {
      pageNumber += 1;

      if (res.data.totalHits < 40) {
        loadMoreBtn.hidden = true;
      }

      if (!res.data.totalHits) {
        loadMoreBtn.hidden = true;
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (pageNumber === 2 && res.data.totalHits > 0) {
        Notiflix.Notify.success(
          `Hooray! We found ${res.data.totalHits} images.`
        );
      }

      return res.data;
    });
}

function clearGallaryCard() {
  galleryCard.innerHTML = '';
}
