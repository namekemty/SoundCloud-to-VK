// Обработчик OAuth ВК

// Проверяем, содержит ли URL токен доступа в параметрах
if (window.location.hash && window.location.hash.includes('access_token=')) {
  // Получаем параметры из hash части URL
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  const accessToken = hashParams.get('access_token');
  const userId = hashParams.get('user_id');
  const expiresIn = hashParams.get('expires_in');
  
  if (accessToken && userId) {
    // Вычисляем время истечения токена
    const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
    
    // Сохраняем данные авторизации в локальное хранилище
    chrome.storage.local.set({
      vk_token: accessToken,
      vk_user_id: userId,
      vk_expires_at: expiresAt,
      auth_success: true
    }).then(() => {
      // Отправляем сообщение об успешной авторизации в popup
      chrome.runtime.sendMessage({
        action: 'authComplete',
        success: true,
        token: accessToken,
        userId: userId
      });
    }).catch(error => {
      console.error('Ошибка при сохранении токена:', error);
      // Отправляем сообщение об ошибке в popup
      chrome.runtime.sendMessage({
        action: 'authComplete',
        success: false,
        error: error.message
      });
    });
  } else {
    chrome.runtime.sendMessage({
      action: 'authComplete',
      success: false,
      error: 'Не удалось получить токен доступа'
    });
  }
}
