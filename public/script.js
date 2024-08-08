// Inisialisasi koneksi Socket.IO
const socket = io();
let username = '';

// Menambahkan event listener untuk tombol-tombol di halaman
document.getElementById('join-button').addEventListener('click', joinChat);
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('logout-button').addEventListener('click', leaveChat);

// Menangani penekanan tombol Enter di input pesan untuk mengirim pesan
document.getElementById('message-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { // Jika tombol Enter ditekan tanpa Shift
        e.preventDefault(); // Mencegah default action (misalnya, line break)
        sendMessage(); // Kirim pesan
    }
});

// Fungsi untuk bergabung ke chat
function joinChat() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    
    if (name !== '') { // Pastikan nama tidak kosong
        username = name; // Simpan username
        // Tampilkan area chat dan sembunyikan area input nama
        document.getElementById('name-input-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        nameInput.value = ''; // Kosongkan input nama
        document.getElementById('message-input').focus(); // Fokus pada input pesan
        // Emit event ke server untuk memberitahu bahwa pengguna baru telah bergabung
        socket.emit('user-joined', username);
    }
}

// Fungsi untuk mengirim pesan
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    
    if (messageText !== '') { // Pastikan pesan tidak kosong
        // Emit event ke server dengan nama pengguna dan pesan
        socket.emit('send-chat-message', { name: username, message: messageText });
        // Tambahkan pesan ke chat
        addMessageToChat(username, messageText, 'you');
        messageInput.value = ''; // Kosongkan input pesan
        messageInput.focus(); // Fokus kembali pada input pesan
    }
}

// Fungsi untuk meninggalkan chat
function leaveChat() {
    if (username) { // Jika pengguna memiliki username
        // Emit event ke server untuk memberitahu bahwa pengguna meninggalkan chat
        socket.emit('user-left', username);
        username = ''; // Hapus username
        // Tampilkan area input nama dan sembunyikan area chat
        document.getElementById('chat-container').style.display = 'none';
        document.getElementById('name-input-container').style.display = 'flex';
    }
}

// Menangani pesan chat yang diterima dari server
socket.on('chat-message', function (data) {
    // Tambahkan pesan ke chat dengan tipe yang sesuai
    addMessageToChat(data.name, data.message, data.name === 'System' ? 'system' : 'other');
});

// Fungsi untuk menambahkan pesan ke tampilan chat
function addMessageToChat(name, msg, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', type);
    
    if (type !== 'system') { // Jika tipe pesan bukan sistem
        // Buat elemen nama pengirim dan tambahkan ke pesan
        const nameElement = document.createElement('div');
        nameElement.classList.add('message-name');
        nameElement.textContent = name;
        messageElement.appendChild(nameElement);
    }

    // Buat elemen pesan dan tambahkan ke pesan
    const textElement = document.createElement('div');
    textElement.textContent = msg;
    messageElement.appendChild(textElement);

    // Tambahkan pesan ke elemen chat dan scroll ke bawah
    document.getElementById('chat-messages').appendChild(messageElement);
    messageElement.scrollIntoView();
}
