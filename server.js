// =======================================================
//        index.js ДЛЯ "ЯДЕРНОГО ТЕСТА"
// =======================================================
import { WebSocketServer } from 'ws';
import express from 'express';

const PORT = process.env.PORT || 3000;

// Express сервер нужен только для того, чтобы Render считал сервис рабочим
const app = express();
const server = app.listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`));

// Создаем WebSocket сервер
const wss = new WebSocketServer({ server });

console.log('Простой эхо-сервер WebSocket запущен.');

// Что делать при новом подключении
wss.on('connection', (ws) => {
    console.log('✅ Новый клиент подключился!');
    ws.send(JSON.stringify({ text: 'Вы успешно подключились к эхо-серверу!' }));

    // Что делать при получении сообщения от клиента
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log(`➡️ Получено сообщение: ${messageString}`);

        // Рассылаем полученное сообщение ВСЕМ подключенным клиентам
        console.log(`⬅️ Рассылаю это сообщение всем...`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });

    ws.on('close', () => {
        console.log('❌ Клиент отключился.');
    });
});
