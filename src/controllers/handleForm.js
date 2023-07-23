const urlString1 = env.url;

// HANDLE IMAGE
const fileNameSpan = document.getElementById("file-name-1");
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
const fileInput1 = document.getElementById("image-input");
fileInput1.addEventListener("change", handleFileInputChange);

// Mendapatkan elemen-elemen formulir
const form = document.getElementById("submit_tambah_buku");
const judulInput = document.getElementById("judul1");
const penulisInput = document.getElementById("penulis1");
const tahunTerbitInput = document.getElementById("tahun_terbit1");
const kategoriInput = document.getElementById("Kategori1");
const stokInput = document.getElementById("stok1");
const gambarInput = document.getElementById("image-input");

// Menangani pengiriman data ketika tombol Submit ditekan
form.addEventListener("click", () => {
  const text_add = document.getElementById("text_add");
  const loader_submit = document.getElementById("loader_add");

  text_add.classList.add("hidden");

  loader_submit.classList.remove("hidden");
  loader_submit.classList.add("flex");

  console.log(gambarInput.files[0]);

  if (
    !judulInput.value ||
    !penulisInput.value ||
    !penulisInput.value ||
    !tahunTerbitInput.value ||
    !kategoriInput.value ||
    !stokInput.value ||
    gambarInput.files[0] === undefined
  ) {
    alert("form harus di isi semua");
    text_add.classList.remove("hidden");
    text_add.classList.add("flex");

    loader_submit.classList.remove("flex");
    loader_submit.classList.add("hidden");

    return false;
  }

  const formData = new FormData();
  // Menambahkan nilai-nilai input ke objek FormData
  formData.append("judul", judulInput.value);
  formData.append("penulis", penulisInput.value);
  formData.append("tahun_terbit", parseInt(tahunTerbitInput.value));
  formData.append("kategori", kategoriInput.value);
  formData.append("stok", parseInt(stokInput.value));
  formData.append("gambar", gambarInput.files[0]);
  formData.append("url", urlString1);
  //   // Mengirim data ke postData.php menggunakan metode POST
  fetch("./src/controllers/addData.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      text_add.classList.remove("flex");
      text_add.classList.add("hidden");

      loader_submit.classList.remove("flex");
      loader_submit.classList.add("hidden");

      alert("berhasil simpan buku");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
