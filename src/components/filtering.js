import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes)                                    // Получаем ключи из объекта
    .forEach((elementName) => {                        // Перебираем по именам
      elements[elementName].append(                    // в каждый элемент добавляем опции
        ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
          .map(name => {                        // используйте name как значение и текстовое содержимое
            // @todo: создать и вернуть тег опции
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            return opt;
          })
      )
    })

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const field = action.dataset.field;
      action.parentElement.querySelector('input').value = '';
      state[field] = '';
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, state));
  }
}