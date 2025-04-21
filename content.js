// Скрипт для внедрения на страницы SoundCloud

// SVG иконка VK
const VK_ICON_SVG = `<svg class="vk-icon" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <path d="M4,13.9c2.1,0,5.3,0,7.1,0c0.9,0,1.6,0.6,1.9,1.4c0.9,2.6,2.9,8.3,5.2,12.2c3.1,5.1,5.1,7,6.4,6.8   c1.3-0.3,0.9-3.7,0.9-6.4s0.3-7.3-1-9.4l-2-2.9c-0.5-0.7,0-1.6,0.8-1.6h11.4c1.1,0,2,0.9,2,2v14.5c0,0,0.5,2.6,3.3-0.1   c2.8-2.7,5.8-7.7,8.3-12.8l1-2.4c0.3-0.7,1-1.2,1.8-1.2h7.4c1.4,0,2.4,1.4,1.9,2.7l-0.8,2.1c0,0-2.7,5.4-5.5,9.2   c-2.8,3.9-3.4,4.8-3,5.8c0.4,1,7.6,7.7,9.4,10.9c0.5,0.9,0.9,1.7,1.3,2.4c0.7,1.3-0.3,3-1.8,3l-8.4,0c-0.7,0-1.4-0.4-1.7-1   l-0.8-1.3c0,0-5.1-6-8.2-7.9c-3.2-1.8-3.1,0.8-3.1,0.8v5.3c0,2.2-1.8,4-4,4h-2c0,0-11,0-19.8-13.1C5.1,26.7,2.8,20.1,2,16.3   C1.8,15.1,2.7,13.9,4,13.9z"/>
</svg>`;

// Функция для создания кнопки VK
function createVkButton() {
  // Создаем контейнер-обертку для кнопки
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "sc-to-vk-button-wrapper";

  // Создаем саму кнопку
  const uploadButton = document.createElement("button");
  uploadButton.className = "sc-to-vk-button";
  uploadButton.innerHTML = VK_ICON_SVG;
  uploadButton.title = "Upload to VK";

  // Добавляем кнопку в контейнер
  buttonWrapper.appendChild(uploadButton);

  // Предотвращаем возможные события, которые могут привести к смещению
  buttonWrapper.addEventListener("click", (e) => e.stopPropagation());

  return { wrapper: buttonWrapper, button: uploadButton };
}

// Функция для обработки нажатия на кнопку и загрузки трека
function handleVkButtonClick(event, button, trackInfo) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Показываем индикатор загрузки
  button.classList.add("loading");

  // Отправляем сообщение в background script для загрузки
  chrome.runtime.sendMessage(
    {
      action: "uploadTrack",
      trackInfo: trackInfo,
    },
    (response) => {
      // Скрываем индикатор загрузки
      button.classList.remove("loading");

      if (response && response.success) {
        showNotification("Трек успешно загружен во ВКонтакте", "success");
      } else {
        showNotification(
          response?.error || "Ошибка при загрузке трека",
          "error"
        );
      }
    }
  );

  // Страховка: если ответ не придет, скрываем индикатор через 10 секунд
  setTimeout(() => {
    if (button.classList.contains("loading")) {
      button.classList.remove("loading");
      showNotification("Превышено время ожидания ответа от сервера", "error");
    }
  }, 10000);
}

// Функция для добавления кнопки загрузки рядом с треками
function addUploadButtons() {
  // Находим все элементы треков на странице
  const trackElements = document.querySelectorAll(
    ".soundList__item, .trackList__item, .systemPlaylistTrackList__item"
  );

  trackElements.forEach((trackElement) => {
    // Проверяем, не добавлена ли уже кнопка
    if (trackElement.querySelector(".sc-to-vk-button-wrapper")) return;

    // Находим контейнер с кнопками действий
    const actionsContainer = trackElement.querySelector(
      ".soundActions.sc-button-toolbar"
    );
    if (!actionsContainer) return;

    // Находим кнопку "More"
    const moreButton = Array.from(
      actionsContainer.querySelectorAll("button")
    ).find(
      (btn) =>
        btn.getAttribute("aria-label") === "More" ||
        btn.getAttribute("title") === "More" ||
        btn.getAttribute("data-title") === "More"
    );

    if (!moreButton) return;

    // Создаем кнопку загрузки и ее обертку
    const { wrapper, button } = createVkButton();

    // Добавляем обработчик клика
    button.addEventListener("click", function (event) {
      // Получаем информацию о треке
      const trackTitle = trackElement
        .querySelector(".soundTitle__title, .trackItem__trackTitle")
        .textContent.trim();
      const artistElement = trackElement.querySelector(
        ".soundTitle__username, .trackItem__username"
      );
      const artistName = artistElement
        ? artistElement.textContent.trim()
        : "Unknown Artist";

      // Получаем URL трека
      const trackLink = trackElement.querySelector(
        "a.soundTitle__title, a.trackItem__trackTitle"
      );
      const trackUrl = trackLink ? trackLink.href : window.location.href;

      // Обрабатываем клик
      handleVkButtonClick(event, button, {
        title: trackTitle,
        artist: artistName,
        url: trackUrl,
      });
    });

    // Добавляем кнопку после кнопки "More"
    moreButton.insertAdjacentElement("afterend", wrapper);

    // Чтобы быть уверенными, что кнопка добавлена в общий контейнер, также добавим класс родительского элемента
    if (moreButton.parentElement) {
      wrapper.classList.add(moreButton.parentElement.className);
    }
  });
}

// Функция для добавления кнопки в группу кнопок sc-button-group
function addTrackPageButtonGroup() {
  // Проверяем, что мы на странице трека
  if (!isTrackPage()) return;

  // Проверяем, не добавлена ли уже кнопка в группу кнопок
  if (document.querySelector(".sc-to-vk-button-wrapper")) return;

  // Находим группу кнопок на странице трека
  const buttonGroup = document.querySelector(
    ".sc-button-group.sc-button-group-medium"
  );
  if (!buttonGroup) return;

  // Создаем кнопку загрузки и ее обертку
  const { wrapper, button } = createVkButton();

  // Добавляем обработчик клика
  button.addEventListener("click", function (event) {
    // Получаем информацию о треке с учетом разных форматов страницы
    const trackTitle =
      document.querySelector(".soundTitle__title")?.textContent.trim() ||
      document.querySelector('h1[itemprop="name"]')?.textContent.trim() ||
      document.title.split(" by ")[0];

    const artistElement =
      document.querySelector(".soundTitle__username") ||
      document.querySelector('h2 a[itemprop="url"]') ||
      document.querySelector(".soundTitle__usernameText");

    const artistName = artistElement
      ? artistElement.textContent.trim()
      : document.title.includes(" by ")
      ? document.title.split(" by ")[1].split(" | ")[0]
      : "Unknown Artist";

    // Используем текущий URL как URL трека
    const trackUrl = window.location.href;

    // Обрабатываем клик
    handleVkButtonClick(event, button, {
      title: trackTitle,
      artist: artistName,
      url: trackUrl,
    });
  });

  // Добавляем кнопку в группу кнопок
  buttonGroup.appendChild(wrapper);
}

// Функция для определения, находимся ли мы на странице трека
function isTrackPage() {
  // Проверяем URL - он должен соответствовать формату страницы трека
  const path = window.location.pathname;

  // Формат /{artist}/{track}
  const standardTrackPattern =
    /^\/[^\/]+\/(?!sets|likes|tracks|followers|following|reposts|comments)[^\/]+$/;

  // Формат /{artist}/sets/{playlist}/{track}
  const playlistTrackPattern = /^\/[^\/]+\/sets\/[^\/]+\/[^\/]+$/;

  // Дополнительно проверяем наличие элементов, характерных для страницы трека
  const hasTrackElements =
    document.querySelector(".soundTitle__title") !== null ||
    document.querySelector('h1[itemprop="name"]') !== null;

  return (
    (standardTrackPattern.test(path) || playlistTrackPattern.test(path)) &&
    hasTrackElements
  );
}

// Функция для отображения уведомлений
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `sc-to-vk-notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Запускаем добавление кнопок при загрузке страницы
addUploadButtons();
addTrackPageButtonGroup(); // Добавляем функцию для группы кнопок

// Наблюдатель за изменениями DOM для динамически загружаемого контента
const observer = new MutationObserver(() => {
  // Проверяем, есть ли новые треки, и добавляем к ним кнопки
  addUploadButtons();
  addTrackPageButtonGroup(); // Вызываем также и для группы кнопок
});

// Начинаем наблюдение за изменениями в DOM
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Обработчик сообщений от background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "notifyUser") {
    showNotification(message.message, message.type);
    sendResponse({ received: true });
  }
});
