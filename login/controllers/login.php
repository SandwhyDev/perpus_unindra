<?php
require_once '../../src/controllers/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    // Ambil nilai dari form
    $username = $data->username;
    $password = $data->password;

    // echo "password : $password <br>";

    // Query untuk memeriksa kecocokan username dan password
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);


    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if ($password === $user['password']) {
            $response = array(
                'status' => 'success',
                'message' => 'Login berhasil',
                'role' => $user['role'],
                'nama_lengkap' => $user['nama_lengkap']
            );
        } else {
            $response = array(
                'status' => 'error',
                'message' => 'Login gagal'
            );

        }
    } else {
        // Login gagal
        echo 'Login gagal. Silakan periksa username dan password Anda.';
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>