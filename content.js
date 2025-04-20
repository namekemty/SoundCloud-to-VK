// Скрипт для внедрения на страницы SoundCloud

// Функция для добавления кнопки загрузки рядом с треками
function addUploadButtons() {
  // Находим все элементы треков на странице
  const trackElements = document.querySelectorAll('.soundList__item, .trackList__item, .systemPlaylistTrackList__item');
  
  trackElements.forEach(trackElement => {
    // Проверяем, не добавлена ли уже кнопка
    if (trackElement.querySelector('.sc-to-vk-button')) return;
    
    // Находим контейнер с кнопками действий для трека
    const actionsContainer = trackElement.querySelector('.soundActions, .trackItem__actions');
    if (!actionsContainer) return;
    
    // Создаем кнопку загрузки
    const uploadButton = document.createElement('button');
    uploadButton.className = 'sc-to-vk-button';
    uploadButton.title = 'Загрузить во ВКонтакте';
    uploadButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.4,18.1c1-1.1,2-2.2,2.9-3.4c0.4-0.5,0.8-1.1,1.1-1.7c0.4-0.8,0-1.8-0.9-1.9l-5.5,0c-0.5,0-1,0.2-1.4,0.6 c-0.3,0.3-0.6,0.7-0.8,1.1c-0.7,1.1-1.5,2.2-2.3,3.1c-0.4,0.4-0.8,0.8-1.3,1.1c-0.5,0.3-0.9,0.2-1.2-0.3c-0.3-0.5-0.3-1.1-0.4-1.8 c0-0.9,0-1.8,0-2.8c0-0.6-0.1-0.9-0.7-1.1c-1-0.4-2.1-0.5-3.1-0.5C9.8,10.6,8.6,10.8,7.5,11.6c-0.5,0.4-0.7,0.7-0.4,1.3 c0.3,0.5,0.9,0.6,1.5,0.7c0.4,0,0.7,0.2,0.9,0.6c0.3,0.6,0.3,1.2,0.3,1.9c0,0.8-0.1,1.5-0.2,2.3c-0.1,0.5-0.2,1-0.6,1.3 c-0.5,0.4-1-0.1-1.4-0.4c-1.2-1.1-2-2.4-2.8-3.7c-0.4-0.6-0.7-1.3-1-2c-0.2-0.5-0.6-0.8-1.1-0.8c-1,0-2.1,0-3.1,0 c-0.7,0-1,0.3-0.7,1c1.1,2.4,2.3,4.6,4,6.6c1.4,1.7,2.9,3.1,4.9,4c1.8,0.8,3.7,1.1,5.7,1c0.9,0,1.2-0.3,1.2-1.2 c0-0.8,0.1-1.7,0.5-2.4c0.3-0.6,0.8-0.7,1.4-0.3c0.3,0.2,0.5,0.4,0.7,0.7c0.6,0.7,1.3,1.4,2,2c0.8,0.7,1.7,1,2.8,0.9h5 c0.6,0,0.9-0.8,0.5-1.5c-0.3-0.6-0.8-1.1-1.3-1.5C26.9,19.7,26.1,18.9,25.4,18.1z"/>
      </svg>`;
    
    // Добавляем обработчик клика
    uploadButton.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Получаем информацию о треке
      const trackTitle = trackElement.querySelector('.soundTitle__title, .trackItem__trackTitle').textContent.trim();
      const artistElement = trackElement.querySelector('.soundTitle__username, .trackItem__username');
      const artistName = artistElement ? artistElement.textContent.trim() : 'Unknown Artist';
      
      // Получаем URL трека
      const trackLink = trackElement.querySelector('a.soundTitle__title, a.trackItem__trackTitle');
      const trackUrl = trackLink ? trackLink.href : window.location.href;
      
      // Отправляем сообщение в background script для загрузки
      chrome.runtime.sendMessage({
        action: 'uploadTrack',
        trackInfo: {
          title: trackTitle,
          artist: artistName,
          url: trackUrl
        }
      }, response => {
        if (response && response.success) {
          showNotification('Трек успешно загружен во ВКонтакте', 'success');
        } else {
          showNotification(response.error || 'Ошибка при загрузке трека', 'error');
        }
      });
      
      // Показываем индикатор загрузки
      uploadButton.classList.add('loading');
      setTimeout(() => {
        uploadButton.classList.remove('loading');
      }, 5000);
    });
    
    // Добавляем кнопку в контейнер
    actionsContainer.appendChild(uploadButton);
  });
}

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `sc-to-vk-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Запускаем добавление кнопок при загрузке страницы
addUploadButtons();

// Наблюдатель за изменениями DOM для динамически загружаемого контента
const observer = new MutationObserver(mutations => {
  // Проверяем, есть ли новые треки, и добавляем к ним кнопки
  addUploadButtons();
});

// Начинаем наблюдение за изменениями в DOM
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Обработчик сообщений от background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'notifyUser') {
    showNotification(message.message, message.type);
    sendResponse({received: true});
  }
});