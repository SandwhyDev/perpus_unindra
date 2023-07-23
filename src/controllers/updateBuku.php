<?php
require_once './conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the data from the FormData object
    $id_buku = $_POST["id_buku"];
    $judul = $_POST["judul"];
    $penulis = $_POST["penulis"];
    $tahun_terbit = $_POST["tahun_terbit"];
    $kategori = $_POST["Kategori"];
    $stok = $_POST["stok"];
    $url = $_POST['url'];

    // File upload handling
    if (isset($_FILES["gambar"])) {
        $gambar = $_FILES["gambar"];

        // Check if there was no file upload error
        if ($gambar["error"] === UPLOAD_ERR_OK) {
            // Define the upload directory (modify this as per your requirement)
            $upload_dir = "../../public/files/";

            // Generate a unique filename to prevent conflicts
            $filename = uniqid() . "_" . $gambar["name"];

            // Move the uploaded file to the desired location
            if (move_uploaded_file($gambar["tmp_name"], $upload_dir . $filename)) {
                // File uploaded successfully
                $gambar_filename = $url . "/public" . "/files" . "/" . $filename;

            } else {
                // File upload failed
                echo json_encode(array("status" => "error", "message" => "Failed to upload the image."));
                exit;
            }
        } else {
            // File upload error occurred
            // Handle the error appropriately
            echo json_encode(array("status" => "error", "message" => "Error uploading the image."));
            exit;
        }
    } else {
        // No file uploaded
        $gambar_filename = ""; // Set a default value or handle it as needed
    }

    if ($gambar_filename) {
        $sql = "UPDATE buku SET judul=?, penulis=?, tahun_terbit=?, Kategori=?, stok=?, gambar_path=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssisi", $judul, $penulis, $tahun_terbit, $kategori, $stok, $gambar_filename, $id_buku);
    } else {
        $sql = "UPDATE buku SET judul=?, penulis=?, tahun_terbit=?, Kategori=?, stok=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssii", $judul, $penulis, $tahun_terbit, $kategori, $stok, $id_buku);
    }

    // Execute the update query
    if ($stmt->execute()) {
        echo json_encode(array("status" => "success", "message" => "Book updated successfully."));
    } else {
        echo json_encode(array("status" => "error", "message" => "Error updating the book."));
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();

} else {
    echo "error disini";
    // Invalid request method
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}
?>