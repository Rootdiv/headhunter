# headhunter-api

Интенсив - Свой HeadHunter (09.03.2022 - 12.03.2022)

Запуск hh-api на хостинге:

- Установить nodejs по инструкции хостинга
- Установить pm2: npm install -g pm2
- Выполнить в каталоге hh-api: pm2 start ecosystem.config.json
- Выполнить: pm2 startup
- Выполнить: pm2 save
- Настроить web-сервер в режиме прокси для api
