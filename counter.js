// Ожидаем событие "DOMContentLoaded", чтобы код выполнился после загрузки всего контента страницы
document.addEventListener('DOMContentLoaded', () => {
  // Класс для управления счётчиками
  class Counter {
    constructor(id, storageKey) {
      // Получаем элементы счётчика из DOM по их ID и классам
      this.counterValue = document.querySelector(`#${id} .counter-value`);
      this.incrementBtn = document.querySelector(`#${id} .btn-increment`);
      this.decrementBtn = document.querySelector(`#${id} .btn-decrement`);
      this.resetBtn = document.querySelector(`#${id} .btn-reset`);

      // Уникальный ключ хранилища для сохранения значения счётчика
      this.storageKey = storageKey;
      this.value = 0;

      // Проверяем, есть ли сохранённое значение в локальном хранилище
      const storedValue = localStorage.getItem(this.storageKey);
      if (storedValue !== null) {
        // Если есть, используем его и обновляем отображение
        this.value = parseInt(storedValue);
        this.updateValue();
      }

      // Добавляем обработчики событий для кнопок счётчика
      if (this.incrementBtn) {
        this.incrementBtn.addEventListener('click', () => this.increment());
      }

      if (this.decrementBtn) {
        this.decrementBtn.addEventListener('click', () => this.decrement());
      }

      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => this.reset());
      }
      
    }

    // Метод для увеличения значения счётчика
    increment() {

      this.value++;
      if (this.value < 0) {
        this.value = 0;
      }
      this.updateValue();
      updateEsc();
      updateMoney();
      this.saveValue();
  
      if (this.storageKey === 'escalationsCounterKey') {
        callsCounter.value++;
        if (callsCounter.value < 0) {
          callsCounter.value = 0;
        }
        callsCounter.updateValue();
        callsCounter.saveValue();
        updateEsc();
        updateMoney();
      }
    }
  
    decrement() {

      this.value--;
      if (this.value < 0) {
        this.value = 0;
      }
      this.updateValue();
      updateEsc();
      updateMoney();
      this.saveValue();
  
      if (this.storageKey === 'escalationsCounterKey') {
        callsCounter.value--;
        if (callsCounter.value < 0) {
          callsCounter.value = 0;
        }
        callsCounter.updateValue();
        callsCounter.saveValue();
        updateEsc();
        updateMoney();
      }
    }

    // Метод для сброса значения счётчика
    reset() {
      this.value = 0;
      this.updateValue();
      updateEsc(); // Обновляем значение "escc"
      updateMoney(); // Обновляем значение "money"
      this.saveValue(); // Сохраняем значение в локальное хранилище
    }

    // Метод для обновления отображения значения счётчика
    updateValue() {
      this.counterValue.textContent = this.value;
    }

    // Метод для сохранения значения в локальное хранилище
    saveValue() {
      localStorage.setItem(this.storageKey, this.value);
    }
  }

  // Создаём экземпляры счётчиков с уникальными ключами хранилища
  const callsCounter = new Counter('calls', 'callsCounterKey');
  const escalationsCounter = new Counter('escalations', 'escalationsCounterKey');

  // Получаем элемент для вывода значения "escc"
  const esccValue = document.getElementById('escalations-value');

  // Метод для обновления значения "escc"
  function updateEsc() {
    const counterEsc = (escalationsCounter.value / callsCounter.value) * 100;
    esccValue.textContent = isNaN(counterEsc) ? '0.00' : counterEsc.toFixed(2);
  }

   // Получаем элемент для вывода значения "money"
   const moneyValue = document.getElementById('money-value-button');

   // Метод для обновления значения "escc"
   function updateMoney() {
    let counterMoney = callsCounter.value * 16 + escalationsCounter.value * 5.5;
    
    // При каждом обновлении значения "Эскалаций" проверяем, является ли эскалация также звонком
    // Если да, то вычитаем из общей суммы 16 (так как это уже учтено в счетчике "Звонков")
    if (escalationsCounter.value > 0 && escalationsCounter.value <= callsCounter.value) {
      counterMoney -= escalationsCounter.value * 16;
    }
  
    moneyValue.textContent = isNaN(counterMoney) ? '0.00' : counterMoney.toFixed(2);
  }

  updateMoney();

  // Инициализация значения "escc" при загрузке страницы
  updateEsc();

  // Получаем элементы кнопок сброса
  const resetCallsBtn = document.getElementById('reset-calls');
  const resetEscalationsBtn = document.getElementById('reset-escalations');

  // Добавляем обработчики событий для кнопок сброса
  resetCallsBtn.addEventListener('click', () => {
    callsCounter.reset();
    updateEsc();
  });

  resetEscalationsBtn.addEventListener('click', () => {
    escalationsCounter.reset();
    updateEsc();
  });

//--------------------------------------------------------------Обновление таблиц--------------------------------------------------------------------------------------------------//

const enterInfoBtn = document.getElementById('enter-info');
const resetInfoBtn = document.getElementById('reset-info');
const radioButtons = document.querySelectorAll('input[type="radio"]');
const resetOptionsBtn = document.getElementById('reset-options');

let callsData = {
  polWithRequest: [],
  polWithoutRequest: [],
  neuWithRequest: [],
  neuWithoutRequest: [],
  negWithRequest: [],
  negWithoutRequest: [],
  dropCalls: [],
};

let totalCalls = 0;

const calculatePercentage = (value, total) => {
  return total !== 0 ? ((value / total) * 100).toFixed(2) : '0.00';
};

// Функция для обновления данных в таблицах
function updateTables() {
  const positiveCallsWithRequest = callsData.polWithRequest.length;
  const positiveCallsWithoutRequest = callsData.polWithoutRequest.length;
  const neutralCallsWithRequest = callsData.neuWithRequest.length;
  const neutralCallsWithoutRequest = callsData.neuWithoutRequest.length;
  const negativeCallsWithRequest = callsData.negWithRequest.length;
  const negativeCallsWithoutRequest = callsData.negWithoutRequest.length;
  const dropCallsRequest = callsData.dropCalls.length;

  const totalCallsWithRequest =
    positiveCallsWithRequest + neutralCallsWithRequest + negativeCallsWithRequest;
  const totalCallsWithoutRequest =
    positiveCallsWithoutRequest + neutralCallsWithoutRequest + negativeCallsWithoutRequest;

  // Обновление количества звонков в таблицах
  document.getElementById('positive-calls-with').textContent = positiveCallsWithRequest;
  document.getElementById('positive-calls-without').textContent = positiveCallsWithoutRequest;
  document.getElementById('neutral-calls-with').textContent = neutralCallsWithRequest;
  document.getElementById('neutral-calls-without').textContent = neutralCallsWithoutRequest;
  document.getElementById('negative-calls-with').textContent = negativeCallsWithRequest;
  document.getElementById('negative-calls-without').textContent = negativeCallsWithoutRequest;
  document.getElementById('total-calls-with').textContent = totalCallsWithRequest;
  document.getElementById('total-calls-without').textContent = totalCallsWithoutRequest;
  document.getElementById('drop-calls').textContent = dropCallsRequest;

 // Обновление процентов в таблицах
 const totalCalls = totalCallsWithRequest + totalCallsWithoutRequest + dropCallsRequest;

 const positivePercentageWithRequest = calculatePercentage(positiveCallsWithRequest, totalCalls);
 const positivePercentageWithoutRequest = calculatePercentage(positiveCallsWithoutRequest, totalCalls);
 const neutralPercentageWithRequest = calculatePercentage(neutralCallsWithRequest, totalCalls);
 const neutralPercentageWithoutRequest = calculatePercentage(neutralCallsWithoutRequest, totalCalls);
 const negativePercentageWithRequest = calculatePercentage(negativeCallsWithRequest, totalCalls);
 const negativePercentageWithoutRequest = calculatePercentage(negativeCallsWithoutRequest, totalCalls);
 const dropPercentageRequest = calculatePercentage(dropCallsRequest, totalCalls);
 const totalPercentageWithRequest = calculatePercentage(totalCallsWithRequest, totalCalls);
 const totalPercentageWithoutRequest = calculatePercentage(totalCallsWithoutRequest, totalCalls);


 document.getElementById('positive-percentage-with').textContent = `${positivePercentageWithRequest}%`;
 document.getElementById('positive-percentage-without').textContent = `${positivePercentageWithoutRequest}%`;
 document.getElementById('neutral-percentage-with').textContent = `${neutralPercentageWithRequest}%`;
 document.getElementById('neutral-percentage-without').textContent = `${neutralPercentageWithoutRequest}%`;
 document.getElementById('negative-percentage-with').textContent = `${negativePercentageWithRequest}%`;
 document.getElementById('negative-percentage-without').textContent = `${negativePercentageWithoutRequest}%`;
 document.getElementById('drop-percentage-calls').textContent = `${dropPercentageRequest}%`;
 document.getElementById('total-percentage-calls-with').textContent = `${totalPercentageWithRequest}%`;
 document.getElementById('total-percentage-calls-without').textContent = `${totalPercentageWithoutRequest}%`;
 
}

// Сброс всех данных, очистка таблицы 
function resetData() {
  // Сохраняем текущее состояние перед сбросом
  previousCallsData = { ...callsData };

  callsData = {
    polWithRequest: [],
    polWithoutRequest: [],
    neuWithRequest: [],
    neuWithoutRequest: [],
    negWithRequest: [],
    negWithoutRequest: [],
    dropCalls: [],
  };
  totalCalls = 0;
  updateTables();
}

// Обработчик на сброс
resetOptionsBtn.addEventListener('click', () => {
  saveActionToHistory({
    type: 'reset',
    payload: { previousCallsData }, // Сохраняем предыдущее состояние
  });
  resetData();
});

// Добавим обработчик клика на кнопку
enterInfoBtn.addEventListener('click', () => {
  const checkedButton = Array.from(radioButtons).find(button => button.checked);

  if (checkedButton) {
    const buttonValue = checkedButton.value;
    let dataKey;

    switch (buttonValue) {
      case 'pol-yes':
        callsData.polWithRequest.push(buttonValue);
        dataKey = 'polWithRequest';
        break;
      case 'neu-yes':
        callsData.neuWithRequest.push(buttonValue);
        dataKey = 'neuWithRequest';
        break;
      case 'neg-yes':
        callsData.negWithRequest.push(buttonValue);
        dataKey = 'negWithRequest';
        break;
      case 'drop':
        callsData.dropCalls.push(buttonValue);
        dataKey = 'dropCalls';
        break;
      case 'pol-no':
      case 'neu-no':
      case 'neg-no':
        if (buttonValue === 'pol-no') {
          callsData.polWithoutRequest.push(buttonValue);
          dataKey = 'polWithoutRequest';
        } else if (buttonValue === 'neu-no') {
          callsData.neuWithoutRequest.push(buttonValue);
          dataKey = 'neuWithoutRequest';
        } else if (buttonValue === 'neg-no') {
          callsData.negWithoutRequest.push(buttonValue);
          dataKey = 'negWithoutRequest';
        }
        break;
    }

    totalCalls++;
    checkedButton.checked = false;
    
    // Сохраняем детали действия в историю
    saveActionToHistory({ type: 'enter', payload: { buttonValue, dataKey } });
    updateTables(); // Обновляем таблицы после ввода данных

  }
});



// Функция для обновления процентов
function updatePercentages() {
  const positiveCallsPercentage = totalCalls === 0 ? 0 : calculatePercentage(callsData.polWithRequest.length, totalCalls);
  const neutralCallsPercentage = totalCalls === 0 ? 0 : calculatePercentage(callsData.neuWithRequest.length, totalCalls);
  const negativeCallsPercentage = totalCalls === 0 ? 0 : calculatePercentage(callsData.negWithRequest.length, totalCalls);
  const positiveCallsPercentageWithout = totalCalls === 0 ? 0 : calculatePercentage(callsData.polWithoutRequest.length, totalCalls);
  const neutralCallsPercentageWithout = totalCalls === 0 ? 0 : calculatePercentage(callsData.neuWithoutRequest.length, totalCalls);
  const negativeCallsPercentageWithout = totalCalls === 0 ? 0 : calculatePercentage(callsData.negWithoutRequest.length, totalCalls);
  const dropCallsPercentage = totalCalls === 0 ? 0 : calculatePercentage(callsData.drop.length, totalCalls);

  const positiveCallsPercentageElement = document.getElementById('positive-percentage-with');
  const neutralCallsPercentageElement = document.getElementById('neutral-percentage-with');
  const negativeCallsPercentageElement = document.getElementById('negative-percentage-with');
  const positiveCallsPercentageElementWithout = document.getElementById('positive-percentage-without');
  const neutralCallsPercentageElementWithout = document.getElementById('neutral-percentage-without');
  const negativeCallsPercentageElementWithout = document.getElementById('negative-percentage-without');
  const dropCallsPercentageElement = document.getElementById('drop-percentage-calls');

  positiveCallsPercentageElement.textContent = `${positiveCallsPercentage}.00%`;
  neutralCallsPercentageElement.textContent = `${neutralCallsPercentage}.00%`;
  negativeCallsPercentageElement.textContent = `${negativeCallsPercentage}.00%`;
  positiveCallsPercentageElementWithout.textContent = `${positiveCallsPercentageWithout}.00%`;
  neutralCallsPercentageElementWithout.textContent = `${neutralCallsPercentageWithout}.00%`;
  negativeCallsPercentageElementWithout.textContent = `${negativeCallsPercentageWithout}.00%`;
  dropCallsPercentageElement.textContent = `${dropCallsPercentage}.00%`;
}

updatePercentages();

//----------------------------------------------------------------------Отмена последних действий-------------------------------------------------------------------------------------------------------//

let actionHistory = []; // Массив для хранения истории изменений
let previousCallsData = {}; 

function saveActionToHistory(action) {
  console.log('Action saved:', action); // Выводим сохраненное действие в консоль
  actionHistory.push(action);
}

// Функция для отмены последнего действия
function undoLastAction() {
  if (actionHistory.length > 0) {
    const lastAction = actionHistory.pop();

    if (lastAction.type === 'enter') {
      const { buttonValue, dataKey } = lastAction.payload;
      console.log('Undoing enter action:', buttonValue, dataKey);
      const data = callsData[dataKey];

      if (data) {
        const index = data.indexOf(buttonValue);
        if (index !== -1) {
          data.splice(index, 1);
          updateTables();
        }
      }
    } else if (lastAction.type === 'reset') {
      console.log('Undoing reset action');
      callsData = { ...previousCallsData };
      updateTables();
    }
  } else {
    console.log('Нет действий для отмены.');
  }
}

  resetInfoBtn.addEventListener('click', () => {
    undoLastAction();
  });

 
//------------------------------------------------------------Обработка исключений---------------------------------------------------------------------------------------------------//

  const callsIncrementButton = document.querySelector('.calls-container .btn-increment');
  const escalationsIncrementButton = document.querySelector('.escalations-container .btn-increment');


  // Создаем объект истории событий
  const eventsHistory = {
    increment: false,
    radioButtonSelected: false,
    enterInfoClicked: false,
  };

  // Функция для проверки состояния и активации кнопок
  function checkAndActivateButtons() {
    if (eventsHistory.increment && eventsHistory.radioButtonSelected && eventsHistory.enterInfoClicked) {
      callsIncrementButton.disabled = false;
      escalationsIncrementButton.disabled = false;
      radioButtons.forEach(button => {
        button.disabled = true;
      });
    }
  }

  function checkAndDisactivateAllButtons() {
    if (eventsHistory.increment && eventsHistory.radioButtonSelected && eventsHistory.enterInfoClicked) {
      callsIncrementButton.disabled = true;
      escalationsIncrementButton.disabled = true;
      enterInfoBtn.disabled = true
      radioButtons.forEach(button => {
        button.disabled = false;
      });
    }
  }

  function checkAndDisactivateButtons() {
    if (eventsHistory.increment && eventsHistory.radioButtonSelected && eventsHistory.enterInfoClicked) {
      callsIncrementButton.disabled = true;
      escalationsIncrementButton.disabled = true;
      enterInfoBtn.disabled = false;
      radioButtons.forEach(button => {
        button.disabled = false;
      });
    }
  }


  // Обработчики событий для кнопок прибавления звонков и эскалаций
  callsIncrementButton.addEventListener('click', () => {
    eventsHistory.increment = true;
    checkAndDisactivateAllButtons();
  });

  escalationsIncrementButton.addEventListener('click', () => {
    eventsHistory.increment = true;
    checkAndDisactivateAllButtons();
  });

  // Обработчик события для радиокнопок
  radioButtons.forEach(button => {
    button.addEventListener('change', () => {
      eventsHistory.radioButtonSelected = true;
      checkAndDisactivateButtons();
    });
  });

  // Обработчик события для кнопки "Ввести"
  enterInfoBtn.addEventListener('click', () => {
    eventsHistory.enterInfoClicked = true;
    checkAndActivateButtons();
  });

  resetCallsBtn.addEventListener('click', () => {
    callsIncrementButton.disabled = false;
  });
  
  resetEscalationsBtn.addEventListener('click', () => {
  escalationsIncrementButton.disabled = false;
  });

  resetOptionsBtn.addEventListener('click', () => {
    radioButtons.forEach(button => {
      button.disabled = false;
    });
  });

  resetInfoBtn.addEventListener('click', () => {
    radioButtons.forEach(button => {
      button.disabled = false;
    });
  });

});

//-------------------------------------------------------------------Звонки более 6 мин-------------------------------------------------------------------------------------------------------------//
