<?php
require_once './conn.php';

// Mengambil data kategori yang dikirim melalui JavaScript
$kategori = $_GET['kategori'];

// Menyiapkan pernyataan WHERE berdasarkan kategori
$whereClause = "";
if (!empty($kategori)) {
    $kategori = $conn->real_escape_string($kategori);
    $whereClause = "WHERE kategori = '$kategori'";
}

// Mengambil data dari tabel buku berdasarkan kategori
$query = "SELECT * FROM buku $whereClause";
$result = $conn->query($query);

// Menyiapkan array untuk menyimpan data buku
$data_buku = [];

// Menambahkan data buku ke dalam array
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $buku = [
            'id' => $row["id"],
            'judul' => $row["judul"],
            'penulis' => $row["penulis"],
            'tahun_terbit' => $row["tahun_terbit"],
            'tersedia' => $row["stok"],
            'kategori' => $row["kategori"],
            'image_path' => $row["gambar_path"],
        ];
        $data_buku[] = $buku;
    }
}

// Menutup result set
$result->close();

// Menutup koneksi
$conn->close();

// Mengirim data sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data_buku);
?>