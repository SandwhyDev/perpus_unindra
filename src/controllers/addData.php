<?php
require_once './conn.php';

// Mendapatkan nilai-nilai yang dikirim melalui metode POST
$judul = $_POST['judul'];
$penulis = $_POST['penulis'];
$tahunTerbit = $_POST['tahun_terbit'];
$kategori = $_POST['kategori'];
$stok = $_POST['stok'];

// Menangani file gambar yang diunggah
$gambar = $_FILES['gambar'];

// Contoh: Menampilkan data yang diterima
echo "Judul: " . $judul . "<br>";
echo "Penulis: " . $penulis . "<br>";
echo "Tahun Terbit: " . $tahunTerbit . "<br>";
echo "Kategori: " . $kategori . "<br>";
echo "Stok: " . $stok . "<br>";

// Contoh: Memproses file gambar yang diunggah
$targetDir = "../../public/files/"; // Direktori tempat menyimpan file gambar
$targetFile = $targetDir . basename($gambar['name']); // Jalur file yang dituju

// Pindahkan file gambar ke direktori yang dituju
if (move_uploaded_file($gambar['tmp_name'], $targetFile)) {
    // echo "Gambar berhasil diunggah.";
} else {
    echo "Terjadi kesalahan saat mengunggah gambar.";
}

$filename = basename($gambar['name']);

echo "Gambar: " . $filename . "<br>";

$sql = "INSERT INTO buku (judul, penulis, tahun_terbit, kategori, stok, gambar_path) VALUES ('$judul', '$penulis', '$tahunTerbit', '$kategori', '$stok', 'http://127.0.0.1/perpustakaan_universitas/public/files/$filename')";

if ($conn->query($sql) === TRUE) {
    echo "Data buku berhasil disimpan.";
} else {
    echo "Error: " . $sql . "<br>";
}

// Menutup koneksi
$conn->close();
?>