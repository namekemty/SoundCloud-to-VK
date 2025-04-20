// Скрипт для внедрения на страницы SoundCloud

// Функция для добавления кнопки загрузки рядом с треками
function addUploadButtons() {
  // Находим все элементы треков на странице
  const trackElements = document.querySelectorAll('.soundList__item, .trackList__item, .systemPlaylistTrackList__item');
  
  trackElements.forEach(trackElement => {
    // Проверяем, не добавлена ли уже кнопка
    if (trackElement.querySelector('.sc-to-vk-button')) return;
    
    // Находим контейнер с кнопками действий
    const actionsContainer = trackElement.querySelector('.soundActions.sc-button-toolbar');
    if (!actionsContainer) return;
    
    // Находим кнопку "More"
    const copyLinkButton = Array.from(actionsContainer.querySelectorAll('button')).find(btn => 
      btn.getAttribute('aria-label') === 'More' || 
      btn.getAttribute('title') === 'More' ||
      btn.getAttribute('data-title') === 'More'
    );
    
    if (!copyLinkButton) return;
    
    // Создаем кнопку загрузки
    const uploadButton = document.createElement('button');
    uploadButton.className = 'sc-to-vk-button';
    uploadButton.title = 'Загрузить во ВКонтакте';
    
    // Используем SVG с белым логотипом VK
    uploadButton.innerHTML = `<svg class="vk-icon" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M4,13.9c2.1,0,5.3,0,7.1,0c0.9,0,1.6,0.6,1.9,1.4c0.9,2.6,2.9,8.3,5.2,12.2c3.1,5.1,5.1,7,6.4,6.8   c1.3-0.3,0.9-3.7,0.9-6.4s0.3-7.3-1-9.4l-2-2.9c-0.5-0.7,0-1.6,0.8-1.6h11.4c1.1,0,2,0.9,2,2v14.5c0,0,0.5,2.6,3.3-0.1   c2.8-2.7,5.8-7.7,8.3-12.8l1-2.4c0.3-0.7,1-1.2,1.8-1.2h7.4c1.4,0,2.4,1.4,1.9,2.7l-0.8,2.1c0,0-2.7,5.4-5.5,9.2   c-2.8,3.9-3.4,4.8-3,5.8c0.4,1,7.6,7.7,9.4,10.9c0.5,0.9,0.9,1.7,1.3,2.4c0.7,1.3-0.3,3-1.8,3l-8.4,0c-0.7,0-1.4-0.4-1.7-1   l-0.8-1.3c0,0-5.1-6-8.2-7.9c-3.2-1.8-3.1,0.8-3.1,0.8v5.3c0,2.2-1.8,4-4,4h-2c0,0-11,0-19.8-13.1C5.1,26.7,2.8,20.1,2,16.3   C1.8,15.1,2.7,13.9,4,13.9z"/>
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
    
    // Добавляем кнопку после кнопки "More"
    copyLinkButton.insertAdjacentElement('afterend', uploadButton);
    
    // Чтобы быть уверенными, что кнопка добавлена в общий контейнер, также добавим класс родительского элемента
    if (copyLinkButton.parentElement) {
      uploadButton.classList.add(copyLinkButton.parentElement.className);
    }
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