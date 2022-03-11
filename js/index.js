'use strict';

const optionBtnOrder = document.querySelector('.option__btn_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionListOrder = document.querySelector('.option__list_order');
const optionListPeriod = document.querySelector('.option__list_period');
const topCityBtn = document.querySelector('.top__city');
const city = document.querySelector('.city');
const cityClose = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');
const overlayVacancy = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');
const formSearch = document.querySelector('.bottom__search');
const found = document.querySelector('.found');

const getData = ({ search, id } = {}) => {
  if (search) {
    return fetch(`http://localhost:3000/api/vacancy?search=${search}`).then(response => response.json());
  }
  return fetch(`http://localhost:3000/api/vacancy/${id ? id : ''}`).then(response => response.json());
};

const declOfNum = (n, titles) => n + ' ' +
  titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const createCard = ({ id, title, compensation, workSchedule, employer, address, description, date }) => {
  const card = document.createElement('li');
  card.className = 'result__item';
  card.insertAdjacentHTML('afterbegin',
    `<article class="vacancy">
      <h2 class="vacancy__title">
        <a class="vacancy__open-modal" href="#" data-vacancy="${id}">${title}</a>
      </h2>
      <p class="vacancy__compensation">${compensation}</p>
      <p class="vacancy__work-schedule">${workSchedule}</p>
      <div class="vacancy__employer">
        <p class="vacancy__employer-title">${employer}</p>
        <p class="vacancy__employer-address">${address}</p>
      </div>
      <p class="vacancy__description">${description}</p>
      <p class="vacancy__date">
        <time datetime="${date}">${date}</time>
      </p>
      <div class="vacancy__wrapper-btn">
        <a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
        <button class="vacancy__contacts">Показать контакты</button>
      </div>
    </article>`,
  );
  return card;
};

const renderCards = data => {
  resultList.textContent = '';
  const cards = data.map(createCard);
  resultList.append(...cards);
};

const optionHandler = () => {
  optionBtnOrder.addEventListener('click', () => {
    optionListOrder.classList.toggle('option__list_active');
    optionListPeriod.classList.remove('option__list_active');
  });

  optionBtnPeriod.addEventListener('click', () => {
    optionListPeriod.classList.toggle('option__list_active');
    optionListOrder.classList.remove('option__list_active');
  });

  optionListOrder.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('option__item')) {
      optionBtnOrder.textContent = target.textContent;
      for (const elem of optionListOrder.querySelectorAll('.option__item')) {
        if (elem === target) {
          elem.classList.add('option__item_active');
        } else {
          elem.classList.remove('option__item_active');
        }
      }
    }
    optionListOrder.classList.remove('option__list_active');
  });

  optionListPeriod.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('option__item')) {
      optionBtnPeriod.textContent = target.textContent;
      for (const elem of optionListPeriod.querySelectorAll('.option__item')) {
        if (elem === target) {
          elem.classList.add('option__item_active');
        } else {
          elem.classList.remove('option__item_active');
        }
      }
    }
    optionListPeriod.classList.remove('option__list_active');
  });
};

const cityHandler = () => {
  topCityBtn.addEventListener('click', () => {
    city.classList.toggle('city_active');
  });

  cityClose.addEventListener('click', () => {
    city.classList.remove('city_active');
  });

  cityRegionList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('city__link')) {
      topCityBtn.textContent = target.textContent;
      city.classList.remove('city_active');
    }
  });
};

const createModal = ({ title, compensation, employer, employment, address, description, experience, skills }) => {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const closeButtonElem = document.createElement('button');
  closeButtonElem.className = 'modal__close';
  closeButtonElem.textContent = '✕';

  const titleElem = document.createElement('h2');
  titleElem.className = 'modal__title';
  titleElem.textContent = title;

  const compensationElem = document.createElement('p');
  compensationElem.className = 'modal__compensation';
  compensationElem.textContent = compensation;

  const employerElem = document.createElement('p');
  employerElem.className = 'modal__employer';
  employerElem.textContent = employer;

  const addressElem = document.createElement('p');
  addressElem.className = 'modal__address';
  addressElem.textContent = address;

  const experienceElem = document.createElement('p');
  experienceElem.className = 'modal__experience';
  experienceElem.textContent = experience;

  const employmentElem = document.createElement('p');
  employmentElem.className = 'modal__employment';
  employmentElem.textContent = employment;

  const descriptionElem = document.createElement('p');
  descriptionElem.className = 'modal__description';
  descriptionElem.textContent = description;

  const skillsElem = document.createElement('div');
  skillsElem.className = 'modal__skills skills';

  const skillsTitleElem = document.createElement('h3');
  skillsTitleElem.className = 'skills__title';
  skillsTitleElem.textContent = 'Подробнее:';

  const skillsListElem = document.createElement('ul');
  skillsListElem.className = 'skills__list';
  skillsListElem.textContent = '';

  for (const skill of skills) {
    const skillsItemElem = document.createElement('li');
    skillsItemElem.className = 'skills__item';
    skillsItemElem.textContent = skill;
    skillsListElem.append(skillsItemElem);
  }

  skillsElem.append(skillsTitleElem, skillsListElem);
  const submitButtonElem = document.createElement('button');
  submitButtonElem.className = 'modal__response';
  submitButtonElem.textContent = 'Отправить резюме';

  modal.append(
    closeButtonElem,
    titleElem,
    compensationElem,
    employerElem,
    addressElem,
    experienceElem,
    employmentElem,
    descriptionElem,
    skillsElem,
    submitButtonElem,
  );

  return modal;
};

const modalHandler = () => {
  let modal = null;
  resultList.addEventListener('click', async event => {
    event.preventDefault();
    const target = event.target;
    if (target.dataset.vacancy) {
      overlayVacancy.classList.add('overlay_active');
      const data = await getData({ id: target.dataset.vacancy });
      modal = createModal(data);
      overlayVacancy.append(modal);
    }
  });

  overlayVacancy.addEventListener('click', event => {
    const target = event.target;
    if (target === overlayVacancy || target.classList.contains('modal__close')) {
      overlayVacancy.classList.remove('overlay_active');
      modal.remove();
    }
  });
};

const searchHandler = () => {
  formSearch.addEventListener('submit', async event => {
    event.preventDefault();
    const textSearch = formSearch.search.value.trim();
    if (textSearch.length > 2) {
      formSearch.search.style.borderColor = '';
      const data = await getData({ search: textSearch });
      renderCards(data);
      formSearch.reset();
      const founds = declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий']);
      found.innerHTML = `${founds} &laquo;<span class="found__item">${textSearch}</span>&raquo;`;
    } else {
      formSearch.search.style.borderColor = '#ff0000';
      setTimeout(() => {
        formSearch.search.style.borderColor = '';
      }, 2000);
    }
  });
};

const init = async () => {
  const data = await getData();
  found.textContent = declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий']) + ' в Вашем городе';
  renderCards(data);

  optionHandler();

  cityHandler();

  modalHandler();

  searchHandler();
};

init();
