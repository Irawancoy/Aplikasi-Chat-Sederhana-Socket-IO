// Mengimpor library yang diperlukan
const express = require('express'); // Framework web untuk Node.js
const http = require('http'); // Modul untuk membuat server HTTP
const { Server } = require('socket.io'); // Library untuk komunikasi real-time dengan WebSocket

// Membuat instance dari Express dan HTTP server
const app = express(); // Instance dari Express
const server = http.createServer(app); // Membuat server HTTP dengan Express
const io = new Server(server); // Menghubungkan Socket.IO dengan server HTTP

// Menyajikan file statis dari folder 'public'
app.use(express.static('public')); // Mengatur folder 'public' untuk akses file statis seperti CSS dan JavaScript

// Menyajikan file HTML utama saat mengunjungi root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Mengirimkan file HTML yang akan ditampilkan pada klien
});

// Mengatur event handling untuk koneksi Socket.IO
io.on('connection', (socket) => {
   // Menangani event ketika pengguna bergabung ke chat
   socket.on('user-joined', (username) => {
      socket.broadcast.emit('chat-message', { name: 'System', message: `${username} has joined the chat.` }); 
      // Mengirim pesan ke semua klien (kecuali pengirim) bahwa pengguna baru telah bergabung
   });

   // Menangani event ketika pengguna meninggalkan chat
   socket.on('user-left', (username) => {
      socket.broadcast.emit('chat-message', { name: 'System', message: `${username} has left the chat.` }); 
      // Mengirim pesan ke semua klien (kecuali pengirim) bahwa pengguna telah meninggalkan chat
   });

   // Menangani event ketika pesan chat dikirim
   socket.on('send-chat-message', (data) => {
      socket.broadcast.emit('chat-message', data); 
      // Mengirim pesan chat ke semua klien (kecuali pengirim)
   });
});

// Menjalankan server pada port 3000 dan menampilkan pesan ke konsol
server.listen(3000, () => {
  console.log('listening on *:3000'); // Menunjukkan bahwa server berjalan pada port 3000
});
