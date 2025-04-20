// Скрипт для popup.html

// Элементы интерфейса
const statusContainer = document.getElementById('statusContainer');
const loadingStatus = document.getElementById('loadingStatus');
const loggedInStatus = document.getElementById('loggedInStatus');
const loggedOutStatus = document.getElementById('loggedOutStatus');
const authButtons = document.getElementById('authButtons');
const userButtons = document.getElementById('userButtons');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');

// Константы для работы с API VK
const VK_API_VERSION = '5.131';
const VK_CLIENT_ID = '2685278'; // ID приложения ВКонтакте для авторизации
const VK_REDIRECT_URI = 'https://oauth.vk.com/blank.html';
const VK_SCOPE = 'audio';

// Проверка статуса авторизации при открытии popup
async function checkAuthStatus() {
  try {
    // Получаем данные из хранилища
    const data = await chrome.storage.local.get(['vk_token', 'vk_user_id', 'vk_expires_at']);
    
    // Проверяем наличие токена и его срок действия
    if (data.vk_token && data.vk_user_id && data.vk_expires_at) {
      const now = Date.now();
      
      if (now < data.vk_expires_at) {
        // Токен действителен
        showLoggedInState();
        return;
      }
    }
    
    // Проверяем наличие куков VK
    const cookies = await chrome.cookies.getAll({domain: '.vk.com'});
    const authCookie = cookies.find(cookie => cookie.name === 'remixsid');
    
    if (authCookie) {
      // Пользователь авторизован в VK, но нам нужно получить токен
      showLoggedOutState('Вы авторизованы во ВКонтакте, но требуется получить разрешение на загрузку треков');
    } else {
      // Пользователь не авторизован
      showLoggedOutState('Требуется авторизация во ВКонтакте');
    }
  } catch (error) {
    console.error('Ошибка при проверке статуса авторизации:', error);
    showLoggedOutState('Ошибка при проверке статуса авторизации');
  }
}

// Показать состояние авторизованного пользователя
function showLoggedInState() {
  loadingStatus.classList.add('hidden');
  loggedOutStatus.classList.add('hidden');
  loggedInStatus.classList.remove('hidden');
  
  statusContainer.className = 'card logged-in';
  
  authButtons.classList.add('hidden');
  userButtons.classList.remove('hidden');
}

// Показать состояние неавторизованного пользователя
function showLoggedOutState(message) {
  loadingStatus.classList.add('hidden');
  loggedInStatus.classList.add('hidden');
  loggedOutStatus.classList.remove('hidden');
  
  if (message) {
    loggedOutStatus.textContent = message;
    // Восстанавливаем иконку, которая могла исчезнуть при установке текста
    const iconSvg = `<svg class="icon alert-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`;
    loggedOutStatus.innerHTML = iconSvg + message;
  }
  
  statusContainer.className = 'card logged-out';
  
  authButtons.classList.remove('hidden');
  userButtons.classList.add('hidden');
}

// Авторизация через OAuth ВКонтакте
async function authorizeVK() {
  const authUrl = `https://oauth.vk.com/authorize?client_id=${VK_CLIENT_ID}&display=popup&redirect_uri=${encodeURIComponent(VK_REDIRECT_URI)}&scope=${VK_SCOPE}&response_type=token&v=${VK_API_VERSION}`;
  
  // Открываем окно авторизации
  chrome.tabs.create({ url: authUrl }, (tab) => {
    // Слушаем изменения URL в открытой вкладке
    const tabId = tab.id;
    
    function listener(tabId, changeInfo) {
      // Проверяем, содержит ли URL токен доступа
      if (changeInfo.url && changeInfo.url.includes('access_token=')) {
        // Извлекаем токен и другие параметры из URL
        const url = new URL(changeInfo.url);
        const hashParams = new URLSearchParams(url.hash.substring(1));
        
        const accessToken = hashParams.get('access_token');
        const userId = hashParams.get('user_id');
        const expiresIn = hashParams.get('expires_in');
        
        if (accessToken && userId) {
          // Сохраняем токен и информацию о пользователе
          const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
          
          chrome.storage.local.set({
            vk_token: accessToken,
            vk_user_id: userId,
            vk_expires_at: expiresAt
          });
          
          // Закрываем вкладку авторизации
          chrome.tabs.remove(tabId);
          
          // Обновляем интерфейс
          showLoggedInState();
        }
        
        // Удаляем слушатель
        chrome.tabs.onUpdated.removeListener(listener);
      }
    }
    
    // Добавляем слушатель изменений URL
    chrome.tabs.onUpdated.addListener(listener);
  });
}

// Выход из аккаунта
async function logout() {
  // Удаляем данные авторизации из хранилища
  await chrome.storage.local.remove(['vk_token', 'vk_user_id', 'vk_expires_at']);
  
  // Обновляем интерфейс
  showLoggedOutState('Вы вышли из аккаунта ВКонтакте');
}

// Обработчики событий
loginButton.addEventListener('click', authorizeVK);
logoutButton.addEventListener('click', logout);

// Проверяем параметры URL при открытии popup
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('auth') === 'required') {
  showLoggedOutState('Для загрузки трека требуется авторизация во ВКонтакте');
} else if (urlParams.get('auth') === 'token') {
  showLoggedOutState('Требуется получить токен доступа ВКонтакте');
} else {
  // Проверяем статус авторизации
  checkAuthStatus();
}

// Добавляем проверку хранилища для получения параметров авторизации
chrome.storage.local.get(['popup_auth_action'], (data) => {
  if (data.popup_auth_action === 'required') {
    showLoggedOutState('Для загрузки трека требуется авторизация во ВКонтакте');
    // Очищаем параметр после использования
    chrome.storage.local.remove('popup_auth_action');
  } else if (data.popup_auth_action === 'token') {
    showLoggedOutState('Требуется получить токен доступа ВКонтакте');
    // Очищаем параметр после использования
    chrome.storage.local.remove('popup_auth_action');
  }
});