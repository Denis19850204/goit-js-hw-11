import Notiflix from 'notiflix';

import renderImage from './render';
import fetchInfo from './api';


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
  fetchInfo(searchValue, pageNumber).then(renderImage);
}

function onLoadMore() {
  pageNumber += 1;
  fetchInfo(searchValue, pageNumber)
    .then(renderImage)
    .catch(data => {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    });
}

function clearGallaryCard() {
  galleryCard.innerHTML = '';
}
