// fetch - это функция для работы с сетью, которая позволяет:

// Отправлять HTTP запросы (GET, POST, PUT, DELETE и т.д.)
// Получать данные с серверов
// Работать с REST API

const { test, expect } = require('@playwright/test');
const fetch = require('node-fetch');
// URLSearchParams доступен глобально в Node.js, но для явности можно импортировать
// const { URLSearchParams } = require('url');

test('API: Проверка доступности эндпоинта логина', async () => {
  console.log('Отправка POST запроса к https://test-stand.gb.ru/gateway/login с form-data');

  // 1. Подготавливаем данные формы в правильном формате (x-www-form-urlencoded)
  // Это имитирует отправку формы HTML с полями username и password
  const formParams = new URLSearchParams();
  formParams.append('username', 'some_test_login'); // Несуществующий логин
  formParams.append('password', 'some_test_password'); // Несуществующий пароль

  // 2. Отправляем POST запрос с form-data
  const response = await fetch('https://test-stand.gb.ru/gateway/login', {
    method: 'POST',
    // Передаем объект URLSearchParams как тело.
    // node-fetch автоматически установит заголовок Content-Type: application/x-www-form-urlencoded
    body: formParams 
    // НЕ нужно явно устанавливать headers для Content-Type, node-fetch сделает это за нас.
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // Можно опустить
  });

  const status = response.status;
  console.log(`Получен статус ответа: ${status}`);

  // 3. Проверка: Сервер должен корректно обработать запрос с form-data
  // Мы ожидаем 401 Unauthorized, потому что логин/пароль неверны,
  // но это подтверждает, что сервер "жив" и правильно обрабатывает формат.
  // Важно, чтобы НЕ было 400 Bad Request из-за неправильного формата данных
  // или 5xx ошибок сервера.
  expect(status).toBe(401); // Ожидаем "Неправильные учетные данные"
  console.log('API сервер корректно обработал запрос с form-data и вернул 401 Unauthorized');

  // Дополнительно можно проверить, что тело ответа соответствует ожидаемому формату ошибки 401
  const responseBody = await response.json(); // Парсим JSON ответ
  console.log('Тело ответа:', JSON.stringify(responseBody, null, 2));

  expect(responseBody).toEqual(expect.objectContaining({
    error: 'Invalid credentials.',
    code: 401
    // message: '' // Согласно документации, message может быть пустой строкой
  }));
  console.log('Формат ответа при 401 ошибке корректный');
});
