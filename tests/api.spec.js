// fetch - это функция для работы с сетью, которая позволяет:

// Отправлять HTTP запросы (GET, POST, PUT, DELETE и т.д.)
// Получать данные с серверов
// Работать с REST API

const {test, expect} = require('@playwright/test');//Импорт конкретных функций test, expect из внешнего модуля. Без этого они недоступны
// const fetch = require('node-fetch'); `request` контекст Playwright** — встроенный инструмент для API-запросов в тестах, 
// не требующий отдельной установки `fetch`, удобен для `form-data` и файлов.
// URLSearchParams доступен глобально в Node.js, но для явности можно импортировать
// const { URLSearchParams } = require('url');


//async ({ request }) — Получение уже готового объекта (request), 
// который Playwright Test создает и предоставляет тебе автоматически при вызове тестовой функции
test('API: Проверка доступности эндпоинта логина', async ({request}) => { 
  const testUsername = 'Pupkin_V'; // Заменить на реальный логин
  const testPassword = 'e6783e1274'; // Заменить на реальный пароль

  console.log(`Попытка авторизации пользователя: ${testUsername}`);

  // --- Отправка запроса ---
  const response = await request.post('https://test-stand.gb.ru/gateway/login', {
    // Используем параметр 'form' для отправки данных как application/x-www-form-urlencoded
    form: {
      username: testUsername,
      password: testPassword
    }
  });

  // -------------------------

  const status = response.status();
  console.log(`Статус ответа: ${status}`);

  if (status === 200) {
    const responseBody = await response.json();
    console.log('Успешная авторизация. Данные пользователя:');
    console.log(JSON.stringify(responseBody, null, 2));

    // --- Проверки ---
    expect(responseBody).toHaveProperty('id'); // Проверяем, что есть ID
    expect(responseBody).toHaveProperty('username', testUsername); // Проверяем логин
    expect(responseBody).toHaveProperty('token'); // Проверяем, что есть токен
    expect(responseBody.token).toEqual(expect.any(String)); // Токен - строка
    expect(responseBody.token.length).toBeGreaterThan(0); // Токен не пустой
    console.log('Все проверки пройдены успешно!');
    // ----------------

  } else {
    // Если не 200, попробуем получить текст ошибки
    const errorText = await response.text();
    console.log(`Ошибка авторизации. Ответ сервера: ${errorText}`);

    // --- Проверки для ошибок ---
    if (status === 401) {
      // Ожидаемая ошибка для неверных данных
      expect(errorText).toContain('Invalid credentials');
      console.log('Получена ожидаемая ошибка 401: Неверные учетные данные.');
    } else {
      // Другая ошибка
      expect(status).toBe(200); // Это заставит тест провалиться с информацией о статусе
    }
    // --------------------------
  }
});

