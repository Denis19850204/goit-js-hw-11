import axios from 'axios';
import Notiflix from 'notiflix';

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.hidden = true;

export default async function fetchInfo(searchValue, pageNumber) {
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
      if (res.data.totalHits < 40) {
        loadMoreBtn.hidden = true;
      }

      if (!res.data.totalHits) {
        loadMoreBtn.hidden = true;
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (pageNumber === 1 && res.data.totalHits > 0) {
        Notiflix.Notify.success(
          `Hooray! We found ${res.data.totalHits} images.`
        );
      }

      return res.data;
    });
}
