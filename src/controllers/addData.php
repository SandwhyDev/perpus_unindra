<?php
require_once './conn.php';
$envFile = file_get_contents('../../env.js');

// Mencari nilai env
preg_match('/env\s*=\s*{([^}]+)}/', $envFile, $matches);
$envValues = $matches[1];

// Mengekstrak nilai env menjadi array
preg_match_all('/(\w+)\s*:\s*(".*?"|\'.*?\'|\d+)/', $envValues, $envPairs);
$envArray = array_combine($envPairs[1], $envPairs[2]);

// Mengakses nilai env
$apiUrl = $envArray['url'];


// Mendapatkan nilai-nilai yang dikirim melalui metode POST
$judul = $_POST['judul'];
$penulis = $_POST['penulis'];
$tahunTerbit = $_POST['tahun_terbit'];
$kategori = $_POST['kategori'];
$stok = $_POST['stok'];
$url = $_POST['url'];

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
echo "API URL: " . $url . "/" . $filename;

$path = $url . "/public" . "/files" . "/" . $filename;



$sql = "INSERT INTO buku (judul, penulis, tahun_terbit, kategori, stok, gambar_path) VALUES ('$judul', '$penulis', '$tahunTerbit', '$kategori', '$stok', '$path')";

if ($conn->query($sql) === TRUE) {
    echo "Data buku berhasil disimpan.";
} else {
    echo "Error: " . $sql . "<br>";
}

// Menutup koneksi
$conn->close();
?>