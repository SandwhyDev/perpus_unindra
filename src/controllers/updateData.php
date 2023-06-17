<?php
require_once 'conn.php';

$id_buku = $_POST['id_buku'];

$sql = "UPDATE buku SET stok = stok - 1 WHERE id = $id_buku";
if ($conn->query($sql) === TRUE) {
    http_response_code(200);
    echo "Pembaruan sukses";
} else {
    http_response_code(500);
    echo "Terjadi kesalahan: " . $conn->error;
}

$conn->close();
?>