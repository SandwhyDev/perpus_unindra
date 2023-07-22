<?php
require_once 'conn.php';

// Mengambil data yang dikirimkan melalui POST
$data = json_decode(file_get_contents("php://input"), true);

// Lakukan pemrosesan data di sini sesuai kebutuhan
$id_buku = $data['id_buku'];
$judul = $data['judul'];
$penulis = $data['penulis'];
$tahun_terbit = $data['tahun_terbit'];
$program_studi = $data['program_studi'];
$stok = $data['stok'];

// Lakukan proses update buku ke database
$sql_update = "UPDATE buku SET 
              judul = '$judul',
              penulis = '$penulis',
              tahun_terbit = '$tahun_terbit',
              kategori = '$program_studi',
              stok = $stok
              WHERE id = $id_buku";

// Jalankan query update
if (mysqli_query($conn, $sql_update)) {
    http_response_code(200);

    echo "Data buku berhasil diperbarui.";
} else {
    echo "Gagal memperbarui data buku: " . mysqli_error($conn);
}
?>