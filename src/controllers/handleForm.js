const urlString = env.url;

// HANDLE IMAGE
const fileNameSpan = document.getElementById("file-name");
// Function to handle file input change event
function handleFileInputChange(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  const fileName = event.target.files[0].name;
  fileNameSpan.textContent = fileName;
  //   fileNameSpan.className = "bg-white  border-2 border-blue-500  text-gray-700 rounded w-full py-2 px-4 cursor-pointer inline-block"

  reader.onload = function (e) {
    const previewImg = document.createElement("img");
    previewImg.setAttribute("src", e.target.result);
    previewImg.classList.add("preview-img");
    previewImg.style.borderRadius = "4px"; // Menambahkan properti CSS untuk tampilan bulat

    const previewDiv = document.getElementById("image-preview");
    previewDiv.innerHTML = "";
    previewDiv.appendChild(previewImg);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Attach event listener to file input
const fileInput = document.getElementById("image-input");
fileInput.addEventListener("change", handleFileInputChange);

// Mendapatkan elemen-elemen formulir
const form = document.querySelector("form");
const judulInput = document.getElementById("judul");
const penulisInput = document.getElementById("penulis");
const tahunTerbitInput = document.getElementById("tahun_terbit");
const kategoriInput = document.getElementById("Kategori");
const stokInput = document.getElementById("stok");
const gambarInput = document.getElementById("image-input");

// Menangani pengiriman data ketika tombol Submit ditekan
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Mencegah tindakan bawaan formulir

  // Membuat objek FormData untuk mengirim data
  const formData = new FormData();

  // Menambahkan nilai-nilai input ke objek FormData
  formData.append("judul", judulInput.value);
  formData.append("penulis", penulisInput.value);
  formData.append("tahun_terbit", parseInt(tahunTerbitInput.value));
  formData.append("kategori", kategoriInput.value);
  formData.append("stok", parseInt(stokInput.value));
  formData.append("gambar", gambarInput.files[0]);
  formData.append("url", urlString);

  //   // Mengirim data ke postData.php menggunakan metode POST
  fetch("./src/controllers/addData.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      // Menangani respons dari postData.php
      console.log(data); // Lakukan sesuatu dengan respons

      alert("berhasil simpan buku");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
