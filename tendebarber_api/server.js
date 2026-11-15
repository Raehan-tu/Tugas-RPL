const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Raehanhamdani@1',      // Pastikan sesuai dengan password database Anda sebelumnya
    database: 'tendebarber_db'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database GAGAL:', err);
        return;
    }
    console.log('✅ Berhasil terkoneksi ke database MySQL (tendebarber_db)!');
});

// 1. Cek Status
app.get('/api/status', (req, res) => {
    res.json({ status: 'success', message: 'API berjalan dengan baik!' });
});

// 2. Mengambil data Kapster
app.get('/api/kapsters', (req, res) => {
    const query = "SELECT * FROM kapsters WHERE status = 'aktif'";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. Mengambil data Layanan
app.get('/api/services', (req, res) => {
    const query = "SELECT * FROM services";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Mengambil Riwayat Transaksi (Untuk Dashboard Owner & Kapster)
app.get('/api/transactions', (req, res) => {
    // Kita gabungkan dengan tabel service untuk mengambil nama_layanan
    const query = `
        SELECT t.*, s.nama_layanan 
        FROM transactions t 
        LEFT JOIN services s ON t.service_id = s.id
        ORDER BY t.waktu_transaksi ASC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. Menyimpan Transaksi Baru (Dari Kasir)
app.post('/api/transactions', (req, res) => {
    const { id, waktu_transaksi, kapster_id, service_id, diskon, total_bayar, komisi_kapster, metode_bayar } = req.body;

    const query = `INSERT INTO transactions (id, waktu_transaksi, kapster_id, service_id, diskon, total_bayar, komisi_kapster, metode_bayar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [id, waktu_transaksi, kapster_id, service_id, diskon, total_bayar, komisi_kapster, metode_bayar];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Transaksi tersimpan!' });
    });
});


app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});