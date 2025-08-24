// =======================================================
//        ФИНАЛЬНЫЙ index.js ДЛЯ ШАХМАТНОГО РЕДАКТОРА
// =======================================================
import { WebSocketServer } from 'ws';
import express from 'express';

const PORT = process.env.PORT || 3000;

// Express все еще нужен для "проверки здоровья" от Render
const app = express();
const server = app.listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`));

// Создаем WebSocket сервер
const wss = new WebSocketServer({ server });

console.log("✅ Сервер для шахматного редактора успешно запущен.");

// Что делать при новом подключении
wss.on('connection', (ws) => {
    console.log("Новый клиент подключился к редактору.");

    // Что делать при получении сообщения от клиента
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log('Получено сообщение:', messageString);

        // Рассылаем полученное сообщение ВСЕМ ОСТАЛЬНЫМ клиентам.
        // Это ключевая логика: мы не отправляем сообщение обратно тому,
        // кто его прислал, так как у него действие уже произошло на экране.
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });

    ws.on('close', () => {
        console.log("Клиент отключился.");
    });

    ws.onerror = (error) => {
        console.error("Произошла ошибка WebSocket:", error);
    }
});
