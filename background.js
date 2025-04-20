// Константы для работы с API
const VK_API_VERSION = '5.131';
const VK_API_ENDPOINT = 'https://api.vk.com/method/';

// Проверка авторизации ВКонтакте
async function checkVKAuth() {
  try {
    // Проверяем наличие сохраненного токена
    const data = await chrome.storage.local.get(['vk_token', 'vk_user_id']);
    if (data.vk_token && data.vk_user_id) {
      // Проверяем валидность токена
      const response = await fetch(`${VK_API_ENDPOINT}users.get?access_token=${data.vk_token}&v=${VK_API_VERSION}`);
      const result = await response.json();
      
      if (result.response && result.response.length > 0) {
        return { authorized: true, token: data.vk_token, userId: data.vk_user_id };
      }
    }
    
    // Пытаемся получить куки VK
    const cookies = await chrome.cookies.getAll({domain: '.vk.com'});
    const authCookie = cookies.find(cookie => cookie.name === 'remixsid');
    console.log(authCookie)
    
    if (authCookie) {
      // Пользователь авторизован в VK, но нам нужно получить токен
      return { authorized: 'cookie', cookies };
    }
    
    return { authorized: false };
  } catch (error) {
    console.error('Ошибка при проверке авторизации VK:', error);
    return { authorized: false, error: error.message };
  }
}

// Загрузка трека из SoundCloud
async function downloadTrackFromSoundCloud(trackUrl) {
  try {
    // Получаем страницу трека
    const response = await fetch(trackUrl);
    const html = await response.text();
    
    // Ищем URL для скачивания в коде страницы
    // SoundCloud хранит данные в JSON внутри тега <script>
    const scriptRegex = /<script>window\.__sc_hydration = (.*?);<\/script>/;
    const match = html.match(scriptRegex);
    
    if (!match || !match[1]) {
      throw new Error('Не удалось найти данные трека');
    }
    
    const hydrationData = JSON.parse(match[1]);
    const trackData = hydrationData.find(item => item.hydratable === 'sound');
    
    if (!trackData || !trackData.data) {
      throw new Error('Не удалось получить данные трека');
    }
    
    // Получаем прямую ссылку на MP3
    const streamUrl = trackData.data.media.transcodings.find(
      t => t.format.protocol === 'progressive' && t.format.mime_type === 'audio/mpeg'
    );
    
    if (!streamUrl || !streamUrl.url) {
      throw new Error('Не удалось найти ссылку на MP3');
    }
    
    // Получаем прямую ссылку на аудио
    const streamResponse = await fetch(streamUrl.url + '?client_id=' + await getSoundCloudClientId());
    const streamData = await streamResponse.json();
    
    if (!streamData.url) {
      throw new Error('Не удалось получить прямую ссылку на аудио');
    }
    
    // Скачиваем аудио файл
    const audioResponse = await fetch(streamData.url);
    const audioBlob = await audioResponse.blob();
    
    return {
      blob: audioBlob,
      title: trackData.data.title,
      artist: trackData.data.user.username,
      duration: trackData.data.duration / 1000, // в секундах
      artwork: trackData.data.artwork_url
    };
  } catch (error) {
    console.error('Ошибка при загрузке трека из SoundCloud:', error);
    throw error;
  }
}

// Получение client_id SoundCloud
async function getSoundCloudClientId() {
  try {
    // Проверяем, есть ли сохраненный client_id
    const data = await chrome.storage.local.get(['sc_client_id', 'sc_client_id_timestamp']);
    const now = Date.now();
    
    // Используем сохраненный client_id, если он не старше 24 часов
    if (data.sc_client_id && data.sc_client_id_timestamp && 
        now - data.sc_client_id_timestamp < 24 * 60 * 60 * 1000) {
      return data.sc_client_id;
    }
    
    // Получаем client_id из скриптов SoundCloud
    const response = await fetch('https://soundcloud.com/');
    const html = await response.text();
    
    // Ищем URL скриптов
    const scriptUrlRegex = /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[\w-]+\.js)"/g;
    const scriptUrls = [];
    let match;
    
    while ((match = scriptUrlRegex.exec(html)) !== null) {
      scriptUrls.push(match[1]);
    }
    
    // Ищем client_id в скриптах
    for (const url of scriptUrls) {
      const scriptResponse = await fetch(url);
      const scriptContent = await scriptResponse.text();
      
      const clientIdMatch = scriptContent.match(/client_id:"([\w-]+)"/i);
      if (clientIdMatch && clientIdMatch[1]) {
        // Сохраняем client_id
        await chrome.storage.local.set({
          sc_client_id: clientIdMatch[1],
          sc_client_id_timestamp: now
        });
        
        return clientIdMatch[1];
      }
    }
    
    throw new Error('Не удалось найти client_id SoundCloud');
  } catch (error) {
    console.error('Ошибка при получении client_id SoundCloud:', error);
    throw error;
  }
}

// Загрузка аудио во ВКонтакте
async function uploadTrackToVK(audioData, authData) {
  try {
    if (!authData.token) {
      throw new Error('Требуется авторизация ВКонтакте');
    }
    
    // Получаем URL для загрузки на сервер ВКонтакте
    const getUploadServerUrl = `${VK_API_ENDPOINT}audio.getUploadServer?access_token=${authData.token}&v=${VK_API_VERSION}`;
    const serverResponse = await fetch(getUploadServerUrl);
    const serverData = await serverResponse.json();
    
    if (!serverData.response || !serverData.response.upload_url) {
      throw new Error('Не удалось получить сервер для загрузки');
    }
    
    // Загружаем файл на сервер ВКонтакте
    const formData = new FormData();
    formData.append('file', audioData.blob, `${audioData.artist} - ${audioData.title}.mp3`);
    
    const uploadResponse = await fetch(serverData.response.upload_url, {
      method: 'POST',
      body: formData
    });
    
    const uploadResult = await uploadResponse.json();
    
    if (!uploadResult.server || !uploadResult.audio || !uploadResult.hash) {
      throw new Error('Ошибка при загрузке файла на сервер ВКонтакте');
    }
    
    // Сохраняем аудиозапись в аккаунте пользователя
    const saveAudioUrl = `${VK_API_ENDPOINT}audio.save?access_token=${authData.token}&server=${uploadResult.server}&audio=${uploadResult.audio}&hash=${uploadResult.hash}&artist=${encodeURIComponent(audioData.artist)}&title=${encodeURIComponent(audioData.title)}&v=${VK_API_VERSION}`;
    
    const saveResponse = await fetch(saveAudioUrl);
    const saveResult = await saveResponse.json();
    
    if (!saveResult.response || !saveResult.response.id) {
      throw new Error('Не удалось сохранить аудиозапись во ВКонтакте');
    }
    
    return {
      success: true,
      audioId: saveResult.response.id,
      ownerId: saveResult.response.owner_id
    };
  } catch (error) {
    console.error('Ошибка при загрузке трека во ВКонтакте:', error);
    throw error;
  }
}

// Обработчик сообщений от content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'uploadTrack') {
    (async () => {
      try {
        // Проверяем авторизацию
        const authData = await checkVKAuth();
        
        if (!authData.authorized) {
          // Если пользователь не авторизован, открываем страницу авторизации в окне расширения
          chrome.action.openPopup();
          sendResponse({ success: false, error: 'Требуется авторизация ВКонтакте' });
          
          // Устанавливаем URL-параметр для popup
          chrome.storage.local.set({ popup_auth_action: 'required' });
          return;
        }
        
        if (authData.authorized === 'cookie') {
          // Если есть только куки, но нет токена, открываем страницу для получения токена в окне расширения
          chrome.action.openPopup();
          sendResponse({ success: false, error: 'Требуется получить токен доступа ВКонтакте' });
          
          // Устанавливаем URL-параметр для popup
          chrome.storage.local.set({ popup_auth_action: 'token' });
          return;
        }
        
        // Загружаем трек из SoundCloud
        const trackData = await downloadTrackFromSoundCloud(message.trackInfo.url);
        
        // Загружаем трек во ВКонтакте
        const uploadResult = await uploadTrackToVK(trackData, authData);
        
        // Отправляем ответ в content script
        sendResponse({ 
          success: true, 
          trackId: uploadResult.audioId,
          message: 'Трек успешно загружен во ВКонтакте'
        });
        
        // Отправляем уведомление на страницу
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'notifyUser',
          message: 'Трек успешно загружен во ВКонтакте',
          type: 'success'
        });
      } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        sendResponse({ success: false, error: error.message });
        
        // Отправляем уведомление об ошибке
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'notifyUser',
          message: 'Ошибка: ' + error.message,
          type: 'error'
        });
      }
    })();
    
    // Возвращаем true, чтобы указать, что ответ будет отправлен асинхронно
    return true;
  }
});