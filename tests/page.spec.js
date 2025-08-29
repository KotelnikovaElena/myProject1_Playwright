// tests/page.spec.js
const { test, expect } = require('@playwright/test');

test('Страница логина загружается и содержит элементы', async ({ page }) => {
  console.log('Переход на https://test-stand.gb.ru/');
  await page.goto('https://test-stand.gb.ru/');

  // 1. Проверка URL
  // .toHaveURL('https://test-stand.gb.ru/login'): Это асинхронный матчер (matcher) Playwright. 
  // Он проверяет, совпадает ли текущий URL в браузере с указанным.
  await expect(page).toHaveURL('https://test-stand.gb.ru/login');
  console.log('Успешно перешли на страницу логина');

  // 2. Проверка наличия и видимости поля ввода логина
  const usernameInput = page.locator('input[type="text"]').first();
  await expect(usernameInput).toBeVisible();
  console.log('Поле ввода логина найдено и видимо');

  // 3. Проверка наличия и видимости поля ввода пароля
  const passwordInput = page.locator('input[type="password"]');
  await expect(passwordInput).toBeVisible();
  console.log('Поле ввода пароля найдено и видимо');

  // 4. Проверка наличия и видимости метки "Username"
  const usernameLabel = page.locator('span.mdc-floating-label >> text=Username');
  await expect(usernameLabel).toBeVisible();
  console.log('Метка "Username" найдена и видима');

  // 5. Проверка наличия и видимости метки "Password"
  const passwordLabel = page.locator('span.mdc-floating-label >> text=Password');
  await expect(passwordLabel).toBeVisible();
  console.log('Метка "Password" найдена и видима');

  // 6. Проверка наличия и видимости кнопки Login
  const loginButton = page.locator('button[type="submit"]');
  await expect(loginButton).toBeVisible();
  console.log('Кнопка Login найдена и видима');

  // 7. Проверка текста внутри кнопки (уточнённая проверка)
  // Находим span с классом mdc-button__label внутри кнопки и проверяем его текст
  const loginButtonText = page.locator('button[type="submit"] span.mdc-button__label');
  await expect(loginButtonText).toBeVisible();
  await expect(loginButtonText).toHaveText('Login');
  console.log('Текст "Login" найден внутри кнопки');

  console.log('Все проверки пройдены успешно!');
});
