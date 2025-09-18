// Скрипт для внедрения на страницы SoundCloud

// SVG иконка VK
const VK_ICON_SVG = `<svg class="vk-icon" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <path d="M4,13.9c2.1,0,5.3,0,7.1,0c0.9,0,1.6,0.6,1.9,1.4c0.9,2.6,2.9,8.3,5.2,12.2c3.1,5.1,5.1,7,6.4,6.8   c1.3-0.3,0.9-3.7,0.9-6.4s0.3-7.3-1-9.4l-2-2.9c-0.5-0.7,0-1.6,0.8-1.6h11.4c1.1,0,2,0.9,2,2v14.5c0,0,0.5,2.6,3.3-0.1   c2.8-2.7,5.8-7.7,8.3-12.8l1-2.4c0.3-0.7,1-1.2,1.8-1.2h7.4c1.4,0,2.4,1.4,1.9,2.7l-0.8,2.1c0,0-2.7,5.4-5.5,9.2   c-2.8,3.9-3.4,4.8-3,5.8c0.4,1,7.6,7.7,9.4,10.9c0.5,0.9,0.9,1.7,1.3,2.4c0.7,1.3-0.3,3-1.8,3l-8.4,0c-0.7,0-1.4-0.4-1.7-1   l-0.8-1.3c0,0-5.1-6-8.2-7.9c-3.2-1.8-3.1,0.8-3.1,0.8v5.3c0,2.2-1.8,4-4,4h-2c0,0-11,0-19.8-13.1C5.1,26.7,2.8,20.1,2,16.3   C1.8,15.1,2.7,13.9,4,13.9z"/>
</svg>`;

// SVG иконка загрузки обложки (предоставленная)
const COVER_ICON_SVG = `<svg class="cover-icon" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
<path d="M1317 4624 c-424 -77 -748 -404 -822 -829 -23 -131 -23 -2339 0
-2470 38 -217 127 -389 284 -545 157 -156 331 -247 550 -285 125 -22 2337 -22
2462 0 434 76 758 400 834 834 12 69 15 226 15 888 0 780 -1 805 -20 842 -56
111 -216 114 -277 5 -23 -39 -23 -40 -23 -532 l0 -492 -252 202 c-139 111
-277 217 -306 235 -213 128 -501 102 -680 -61 -30 -28 -108 -111 -175 -185
-66 -75 -128 -144 -137 -154 -17 -18 -37 -1 -476 399 -253 229 -485 434 -516
454 -92 60 -184 85 -313 85 -175 0 -236 -27 -477 -206 -90 -67 -169 -126 -176
-132 -11 -8 -12 89 -10 534 l3 544 27 80 c39 113 92 199 174 280 83 82 168
135 279 173 l80 27 1052 5 c1047 5 1052 5 1080 26 98 73 98 195 0 268 -28 21
-30 21 -1065 23 -854 1 -1051 -1 -1115 -13z m268 -1952 c22 -11 246 -208 498
-437 l457 -416 -83 -94 c-46 -52 -250 -281 -453 -510 l-369 -417 -135 5 c-110
4 -150 9 -215 30 -109 36 -196 89 -279 172 -82 81 -135 167 -174 280 l-27 80
-3 450 -3 450 271 203 c149 112 287 210 308 217 51 20 156 14 207 -13z m1966
-447 c31 -11 156 -105 408 -306 l364 -291 -5 -132 c-9 -213 -67 -355 -203
-491 -82 -81 -168 -134 -280 -173 l-80 -27 -844 -3 c-805 -3 -843 -2 -830 15
64 80 1215 1366 1234 1379 67 44 158 55 236 29z"/>
<path d="M4095 4626 c-37 -17 -70 -52 -84 -89 -7 -18 -11 -140 -11 -329 l0
-301 -44 41 c-74 68 -161 69 -227 3 -41 -41 -55 -88 -44 -148 6 -32 36 -68
193 -226 103 -104 199 -195 214 -203 15 -8 45 -14 68 -14 23 0 53 6 68 14 15
8 111 99 214 203 157 158 187 194 193 226 11 60 -3 107 -44 148 -66 66 -153
65 -226 -3 l-44 -40 -3 315 c-3 301 -4 317 -24 343 -11 15 -32 37 -46 47 -34
25 -113 32 -153 13z"/>
<path d="M1910 4032 c-64 -24 -160 -122 -183 -187 -68 -195 59 -401 264 -430
90 -13 213 35 274 107 113 133 104 322 -20 442 -82 80 -224 109 -335 68z"/>
</g>
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

// Функция для создания кнопки скачивания обложки
function createCoverButton() {
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "sc-cover-download-button-wrapper";

  const coverButton = document.createElement("button");
  coverButton.className = "sc-cover-download-button";
  coverButton.innerHTML = COVER_ICON_SVG;
  coverButton.title = "Скачать обложку";

  buttonWrapper.appendChild(coverButton);
  buttonWrapper.addEventListener("click", (e) => e.stopPropagation());

  return { wrapper: buttonWrapper, button: coverButton };
}

// Поиск URL обложки в пределах элемента трека
function findCoverUrlInTrackElement(trackElement) {
  if (!trackElement) return null;

  // 1) Ищем <img> и <source> с src или srcset
  const imgCandidates = Array.from(
    trackElement.querySelectorAll('img, source')
  );
  const urlsFromSrc = imgCandidates
    .map((el) => {
      const srcset = el.getAttribute('srcset');
      const src = el.getAttribute('src');
      const list = [];
      if (src) list.push(src);
      if (srcset) {
        srcset.split(',').forEach((entry) => {
          const u = entry.trim().split(' ')[0];
          if (u) list.push(u);
        });
      }
      return list;
    })
    .flat();

  // 2) Ищем background-image
  const bgCandidates = Array.from(trackElement.querySelectorAll('*'))
    .map((el) => getComputedStyle(el).backgroundImage)
    .filter((v) => v && v !== 'none')
    .map((bg) => {
      const m = bg.match(/url\(["']?(.*?)["']?\)/i);
      return m ? m[1] : null;
    })
    .filter(Boolean);

  const allUrls = [...urlsFromSrc, ...bgCandidates]
    .filter((u) => /sndcdn\.com\/artworks|sndcdn\.com\/images|sndcdn\.com\//i.test(u));

  if (allUrls.length === 0) return null;

  // Выбираем наибольшее качество по маркерам t1080x1080 > t500x500 > t300x300 > t200x200
  const qualityRank = ['t1080x1080', 't1000x1000', 't800x800', 't500x500', 't300x300', 't200x200'];
  const scored = allUrls.map((u) => {
    const score = qualityRank.findIndex((q) => u.includes(q));
    return { url: u, score: score === -1 ? 999 : score };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored[0].url;
}

// Поиск URL обложки на странице трека
function findCoverUrlOnTrackPage() {
  return (
    findCoverUrlInTrackElement(document.querySelector('.listenArtwork, .fullListenHero__artwork, .sound__coverArt')) ||
    findCoverUrlInTrackElement(document)
  );
}

// Скачивание изображения по URL
async function downloadImageByUrl(url, filename) {
  const response = await fetch(url, { credentials: 'omit' });
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename || 'artwork.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
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
    const alreadyHasVk = !!trackElement.querySelector(".sc-to-vk-button-wrapper");
    const alreadyHasCover = !!trackElement.querySelector(".sc-cover-download-button-wrapper");
    if (alreadyHasVk && alreadyHasCover) return;

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
    if (!alreadyHasVk) {
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
    }

    if (!alreadyHasCover) {
      const { wrapper: coverWrapper, button: coverButton } = createCoverButton();

      coverButton.addEventListener('click', async function (event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        const titleEl = trackElement.querySelector('.soundTitle__title, .trackItem__trackTitle');
        const artistEl = trackElement.querySelector('.soundTitle__username, .trackItem__username');
        const trackTitle = titleEl ? titleEl.textContent.trim() : 'track';
        const artistName = artistEl ? artistEl.textContent.trim() : 'artist';

        const coverUrl = findCoverUrlInTrackElement(trackElement);
        if (!coverUrl) {
          showNotification('Не удалось найти обложку трека', 'error');
          return;
        }

        const fileExt = (coverUrl.split('?')[0].split('.').pop() || 'jpg').toLowerCase();
        const filename = `${artistName} - ${trackTitle} (cover).${fileExt}`.replace(/[\\/:*?"<>|]+/g, ' ');

        try {
          coverButton.classList.add('loading');
          await downloadImageByUrl(coverUrl, filename);
          showNotification('Обложка скачана', 'success');
        } catch (e) {
          showNotification('Ошибка при скачивании обложки', 'error');
        } finally {
          coverButton.classList.remove('loading');
        }
      });

      moreButton.insertAdjacentElement('afterend', coverWrapper);
      if (moreButton.parentElement) {
        coverWrapper.classList.add(moreButton.parentElement.className);
      }
      // Проставляем отступ в 2 раза больше, чем у соседних кнопок (или 16px по умолчанию)
      const prevEl = coverWrapper.previousElementSibling;
      const prevMargin = prevEl ? getComputedStyle(prevEl).marginLeft : '';
      const prevValue = prevMargin ? parseFloat(prevMargin) : 0;
      const prevUnit = prevMargin ? prevMargin.replace(/[0-9.\s]/g, '') : 'px';
      coverWrapper.style.marginLeft = prevValue > 0 ? (prevValue * 2) + prevUnit : '16px';
    }
  });
}

// Функция для добавления кнопки в группу кнопок sc-button-group
function addTrackPageButtonGroup() {
  // Проверяем, что мы на странице трека
  if (!isTrackPage()) return;

  // Проверяем, не добавлена ли уже кнопка в группу кнопок
  const hasVk = !!document.querySelector(".sc-to-vk-button-wrapper");
  const hasCover = !!document.querySelector(".sc-cover-download-button-wrapper");
  if (hasVk && hasCover) return;

  // Находим группу кнопок на странице трека
  const buttonGroup = document.querySelector(
    ".sc-button-group.sc-button-group-medium"
  );
  if (!buttonGroup) return;

  if (!hasVk) {
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

  if (!hasCover) {
    const { wrapper: coverWrapper, button: coverButton } = createCoverButton();

    coverButton.addEventListener('click', async function (event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const trackTitle =
        document.querySelector(".soundTitle__title")?.textContent.trim() ||
        document.querySelector('h1[itemprop="name"]')?.textContent.trim() ||
        document.title.split(" by ")[0] || 'track';

      const artistElement =
        document.querySelector(".soundTitle__username") ||
        document.querySelector('h2 a[itemprop="url"]') ||
        document.querySelector(".soundTitle__usernameText");

      const artistName = artistElement
        ? artistElement.textContent.trim()
        : document.title.includes(" by ")
        ? document.title.split(" by ")[1].split(" | ")[0]
        : 'artist';

      const coverUrl = findCoverUrlOnTrackPage();
      if (!coverUrl) {
        showNotification('Не удалось найти обложку трека', 'error');
        return;
      }

      const fileExt = (coverUrl.split('?')[0].split('.').pop() || 'jpg').toLowerCase();
      const filename = `${artistName} - ${trackTitle} (cover).${fileExt}`.replace(/[\\/:*?"<>|]+/g, ' ');

      try {
        coverButton.classList.add('loading');
        await downloadImageByUrl(coverUrl, filename);
        showNotification('Обложка скачана', 'success');
      } catch (e) {
        showNotification('Ошибка при скачивании обложки', 'error');
      } finally {
        coverButton.classList.remove('loading');
      }
    });

    buttonGroup.appendChild(coverWrapper);
    // Проставляем отступ в 2 раза больше, чем у предыдущей кнопки в группе (или 16px по умолчанию)
    const prevInGroup = coverWrapper.previousElementSibling;
    const prevGroupMargin = prevInGroup ? getComputedStyle(prevInGroup).marginLeft : '';
    const prevGroupValue = prevGroupMargin ? parseFloat(prevGroupMargin) : 0;
    const prevGroupUnit = prevGroupMargin ? prevGroupMargin.replace(/[0-9.\s]/g, '') : 'px';
    coverWrapper.style.marginLeft = prevGroupValue > 0 ? (prevGroupValue * 2) + prevGroupUnit : '16px';
  }
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
