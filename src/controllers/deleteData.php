<?php
require 'conn.php';

// Mendapatkan ID buku yang akan dihapus dari permintaan POST atau GET
$id_buku = $_POST['id_buku']; // Gantikan dengan metode yang sesuai, jika menggunakan metode GET, gunakan $_GET['id_buku']

// Query untuk menghapus buku berdasarkan ID
$sql = "DELETE FROM buku WHERE id = $id_buku";

if ($conn->query($sql) === TRUE) {
    echo "Buku dengan ID $id_buku berhasil dihapus.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>