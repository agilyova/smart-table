import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// @todo: подключение


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

function getMinMaxTotalValues(data) {
  let min = data[0].total;
  let max = data[0].total;

  data.forEach(el => {
    min = Math.min(el.total, min);
    max = Math.max(el.total, max);
  });

  return {min, max};
}

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1);// номер страницы по умолчанию 1 и тоже число
  const minMaxTotal = getMinMaxTotalValues(data);
  const totalFrom = parseFloat(state.totalFrom.replace(',', '.') || minMaxTotal.min);
  const totalTo = parseFloat(state.totalTo.replace(',', '.') || minMaxTotal.max);
  const total = [totalFrom, totalTo];

  return {                                            // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page,
    total
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // @todo: использование

  result = applySearching(result, state, action);
  result = applyFiltering(result, state, action);
  result = applySorting(result, state, action);
  result = applyPagination(result, state, action);

  sampleTable.render(result)
}

const sampleTable = initTable({
  tableTemplate: 'table',
  rowTemplate: 'row',
  before: ['search', 'header', 'filter'],
  after: ['pagination']
}, render);

// @todo: инициализация
const applyPagination = initPagination(
  sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(
  sampleTable.filter.elements, {    // передаём элементы фильтра
    searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
  });

const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
