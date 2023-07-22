<?php
require_once '../../src/controllers/conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));
    // Ambil nilai dari form
    $username = $data->username;
    $password = $data->password;

    // echo "password : $password <br>";

    // Query untuk memeriksa kecocokan username
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        // setelah cocok dan ketemu periksa password user yang di database sama password yang di kirim dari form
        $user = $result->fetch_assoc();

        if ($password === $user['password']) {
            $response = array(
                'status' => 'success',
                'message' => 'Login berhasil',
                'role' => $user['role'],
                'nama_lengkap' => $user['nama_lengkap']
            );
        } else {
            // Kalo password salah
            $response = array(
                'status' => 'false',
                'message' => 'Login gagal'
            );

        }
    } else {
        // Kalo username tidak ada
        $response = array(
            'status' => 'false',
            'message' => 'Login gagal'
        );
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>