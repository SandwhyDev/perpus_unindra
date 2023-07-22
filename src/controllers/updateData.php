<?php
require_once 'conn.php';

$id_buku = $_POST['id_buku'];

// Cari buku berdasarkan ID
$sql_cari = "SELECT stok FROM buku WHERE id = $id_buku";
$result = $conn->query($sql_cari);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $stok_buku = $row['stok'];

    if ($stok_buku <= 0) {
        http_response_code(401);
        echo "stok tidak tersedia";
        return false;
    } else {
        $sql = "UPDATE buku SET stok = stok - 1 WHERE id = $id_buku";
        if ($conn->query($sql) === TRUE) {
            http_response_code(200);
            echo "Pembaruan sukses";
        } else {
            http_response_code(500);
            echo "Terjadi kesalahan: " . $conn->error;
        }
    }
}

$conn->close();
?>