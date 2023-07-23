const urlString = env.url;

var admin = window.localStorage.getItem("admin");

var menuSide = ["FIPPS", "FMIPA", "FBS", "FTIK", "FP"];

var menuContainer = document.getElementById("menu-container");
const loader = document.getElementById("loader");
const dataBukuContainer = document.getElementById("data-buku");
const dataBuku = document.createElement("div");
dataBuku.id = "dataBukuContainer1";
var formBuku = document.getElementById("form-buku");
const BtnSimpan = document.getElementById("btn-pinjam");
const BtnHapus = document.getElementById("btn-hapus");
const btnKeluar = document.getElementById("btn-keluar");
const pdfContainer = document.querySelector(".pdfContainer");
const ContainerFormEdit = document.getElementById("form_edit");
const pdfView = document.querySelector(".pdfView");
const pdfClose = document.querySelector(".pdfClose");
const batalEditButton = document.getElementById("batal-edit");
const submitEditButton = document.getElementById("submit_edit");

var id_buku;

btnKeluar.className =
  "cursor-pointer bg-red-500 flex items-center justify-center text-white hover:bg-red-600 w-full p-2 rounded-md text-center capitalize";

for (var i = 0; i < menuSide.length; i++) {
  var li = document.createElement("li");
  li.className =
    "cursor-pointer  hover:bg-blue-500 hover:text-white w-full p-2 rounded-md text-white text-center capitalize";
  li.textContent = menuSide[i];

  menuContainer.appendChild(li);
}
menuContainer.className =
  "flex sm:flex-col gap-2  h-full  w-full list-none overflow-x-scroll";

// Add active color to the clicked menu item
$(document).ready(function () {
  // Add active color to "menu 1" on page load
  $("li").removeClass("bg-blue-500 text-white");
  $("li:contains('FIPPS')").addClass("bg-blue-500  text-white");
  sendDataRequest("FIPPS");
});

$(document).on("click", "li", function () {
  $("li").removeClass("bg-blue-500 text-white");
  $(this).addClass("bg-blue-500 text-white");

  var clickedMenu = $(this).text();

  dataBukuContainer.innerHTML = "";

  switch (clickedMenu) {
    case "FIPPS":
      sendDataRequest("FIPPS");
      break;

    case "FMIPA":
      sendDataRequest("FMIPA");
      break;

    case "FBS":
      sendDataRequest("FBS");
      break;

    case "FTIK":
      sendDataRequest("FTIK");
      break;

    case "FP":
      sendDataRequest("FP");
      break;

    default:
      break;
  }
});

function sendDataRequest(kategori) {
  loader.className = "flex items-center justify-center w-full h-auto"; // Menampilkan loader

  formBuku.style.display = "none";

  // Membuat permintaan GET ke server
  fetch("./src/controllers/getData.php?kategori=" + kategori)
    .then((response) => response.json()) // Mengubah respons menjadi objek JSON
    .then((data) => {
      // Data berhasil diterima

      if (data.length <= 0) {
        console.log("buku tidak tersedia di prodi ini");
        var bukuHTML = document.createElement("div");
        const judulBuku = document.createElement("h1");
        judulBuku.textContent = "Maaf belum ada buku tersedia di prodi ini";
        bukuHTML.appendChild(judulBuku);
        dataBukuContainer.appendChild(bukuHTML);
      }

      // Lakukan manipulasi atau tampilkan data di HTML
      data.forEach((buku) => {
        var bukuHTML = document.createElement("div");
        bukuHTML.className = "w-60 h-72 mb-[186px] ";
        // Membuat elemen gambar
        const gambarBuku = document.createElement("img");
        gambarBuku.src = buku.image_path;
        gambarBuku.className =
          "w-full h-full object-cover rounded-2xl cursor-pointer ";
        gambarBuku.addEventListener("click", () => {
          handlePdf(buku.id, buku.judul);
        });

        bukuHTML.appendChild(gambarBuku);

        const judulBuku = document.createElement("h1");
        judulBuku.className = "min-h-[48px]";
        judulBuku.textContent = buku.judul;
        bukuHTML.appendChild(judulBuku);

        const Penulis = document.createElement("p");
        Penulis.textContent = buku.penulis;
        const tahun = document.createElement("p");
        tahun.textContent = buku.tahun_terbit;
        const penulisDanTahun = document.createElement("p");
        penulisDanTahun.textContent = `${Penulis.textContent}, ${tahun.textContent}`;
        penulisDanTahun.className = "text-gray-500 text-sm ";
        bukuHTML.appendChild(penulisDanTahun);

        const Tersedia = document.createElement("p");
        Tersedia.textContent = `Tersedia : ${
          buku.tersedia <= 0 ? 0 : buku.tersedia
        }`;
        Tersedia.className = "text-md ";
        bukuHTML.appendChild(Tersedia);

        // // Tombol Pinjam
        const tombolPinjam = document.createElement("button");
        tombolPinjam.textContent = "Pinjam";
        tombolPinjam.className =
          buku.tersedia <= 0
            ? "bg-gray-500 cursor-no-drop hover:bg-gray-700 text-white font-bold py-2 px-4 w-full rounded mt-3"
            : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded mt-3";
        tombolPinjam.addEventListener("click", () => {
          // Logika untuk memproses peminjaman buku
          if (buku.tersedia >= 1) {
            pinjamBuku(buku.id, buku.judul, buku.tersedia); // Mengirim ID buku yang ingin dipinjam ke fungsi pinjamBuku
          }
        });
        bukuHTML.appendChild(tombolPinjam);

        // // Tombol hapus
        const tombolHapus = document.createElement("button");
        const tombolEdit = document.createElement("button");
        const containerTombol = document.createElement("div");
        tombolHapus.textContent = "Hapus";
        tombolEdit.textContent = "Edit";

        tombolHapus.addEventListener("click", () => {
          // Logika untuk memproses peminjaman buku
          HapusBuku(buku.id, buku.judul); // Mengirim ID buku yang ingin dipinjam ke fungsi pinjamBuku
        });

        tombolEdit.addEventListener("click", () => {
          // Logika untuk memproses peminjaman buku
          EditBuku(
            buku.id,
            buku.judul,
            buku.penulis,
            buku.tahun_terbit,
            buku.kategori,
            buku.tersedia,
            buku.image_path
          ); // Mengirim ID buku yang ingin dipinjam ke fungsi pinjamBuku
        });

        if (admin) {
          containerTombol.className = "w-full flex gap-5 ";
          tombolHapus.className =
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full rounded mt-3";
          tombolEdit.className =
            "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 w-full rounded mt-3";

          containerTombol.appendChild(tombolHapus);
          containerTombol.appendChild(tombolEdit);

          bukuHTML.appendChild(containerTombol);
          // bukuHTML.appendChild(tombolEdit);
          BtnSimpan.className =
            "cursor-pointer bg-green-500    text-white hover:bg-green-600  w-full p-2 rounded-md  text-center capitalize";
        }

        dataBukuContainer.appendChild(bukuHTML);
      });

      loader.className = "hidden";
    })
    .catch((error) => {
      // Terjadi kesalahan saat mengambil data
      console.error("Terjadi kesalahan:", error);
    });
}

function HapusBuku(id, nama) {
  var konfirmasi = confirm(
    "Apakah Anda yakin ingin menghapus buku dengan ID " + nama + "?"
  );

  if (konfirmasi) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./src/controllers/deleteData.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        alert(`Buku ${nama} berhasil dihapus`);
        window.location.reload();
      }
    };
    xhr.send("id_buku=" + id);
  }
}

function pinjamBuku(id, nama) {
  var konfirmasi = confirm("Ingin meminjam buku " + nama + "?");

  if (konfirmasi) {
    if (!pinjamBuku.executed) {
      pinjamBuku.executed = true;

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "./src/controllers/updateData.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            alert(`Buku ${nama} berhasil dipinjam`);
            window.location.reload();
          } else if (xhr.status === 401) {
            alert("Maaf buku tidak tersedia di perpustakaan");
            window.location.reload();
          }
        }
      };

      // Send data to PHP
      var data = "id_buku=" + id + "&action=pinjam";
      xhr.send(data);
    }
  }
}

function TambahBuku() {
  $("li").removeClass("bg-blue-500 text-white");
  loader.className = "hidden";

  dataBukuContainer.innerHTML = "";
  formBuku.style.display = "flex";
}

function ButtonKeluar() {
  var konfirmasi = confirm("Yakin keluar ? ");

  if (konfirmasi) {
    window.location.reload();
    window.localStorage.removeItem("login");
    window.localStorage.removeItem("admin");
    window.localStorage.removeItem("mahasiswa");
    window.localStorage.removeItem("nama_lengkap");
  }
}

function handlePdf(id, judul) {
  pdfContainer.classList.remove("hidden");
  pdfContainer.classList.add("flex");

  var iframe = document.createElement("iframe");
  iframe.className = "w-[600px] h-[700px] rounded-xl";
  iframe.src = "./public/files/coba.pdf";

  pdfClose.addEventListener("click", function () {
    pdfContainer.classList.remove("flex");
    pdfContainer.classList.add("hidden");

    var existingIframe = pdfView.querySelector("iframe");
    if (existingIframe) {
      pdfView.removeChild(existingIframe);
    }
  });

  pdfView.appendChild(iframe);
}

function EditBuku(
  id,
  judul,
  penulis,
  tahun_terbit,
  program_studi,
  stok,
  image_path
) {
  ContainerFormEdit.classList.remove("hidden");
  ContainerFormEdit.classList.add("flex");

  const inputJudul = document.getElementById("judul");
  const inputPenulis = document.getElementById("penulis");
  const inputTahunTerbit = document.getElementById("tahun_terbit");
  const inputProgramStudi = document.getElementById("Kategori");
  const inputstok = document.getElementById("stok");

  id_buku = id;
  inputJudul.value = judul;
  inputPenulis.value = penulis;
  inputTahunTerbit.value = tahun_terbit;
  inputProgramStudi.value = program_studi;
  inputstok.value = stok;

  const previewImg = document.createElement("img");
  previewImg.setAttribute("src", image_path);
  previewImg.classList.add("preview-img");
  previewImg.style.borderRadius = "4px"; // Menambahkan properti CSS untuk tampilan bulat

  const previewDiv = document.getElementById("image-preview-1");
  previewDiv.innerHTML = "";
  previewDiv.appendChild(previewImg);
}

batalEditButton.addEventListener("click", function (param) {
  ContainerFormEdit.classList.remove("flex");
  ContainerFormEdit.classList.add("hidden");
});

const fileNameSpan1 = document.getElementById("file-name");

function handleFileInputChange(event) {
  console.log("halo");
  const file = event.target.files[0];
  const reader = new FileReader();

  const fileName = event.target.files[0].name;
  fileNameSpan1.textContent = fileName;
  //   fileNameSpan.className = "bg-white  border-2 border-blue-500  text-gray-700 rounded w-full py-2 px-4 cursor-pointer inline-block"

  reader.onload = function (e) {
    const previewImg = document.createElement("img");
    previewImg.setAttribute("src", e.target.result);
    previewImg.classList.add("preview-img");
    previewImg.style.borderRadius = "4px"; // Menambahkan properti CSS untuk tampilan bulat

    const previewDiv = document.getElementById("image-preview-1");
    previewDiv.innerHTML = "";
    previewDiv.appendChild(previewImg);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

const fileInput = document.getElementById("image-edit-input");

fileInput.addEventListener("change", handleFileInputChange);

submitEditButton.addEventListener("click", function (param) {
  const inputJudul = document.getElementById("judul").value;
  const inputPenulis = document.getElementById("penulis").value;
  const inputTahunTerbit = document.getElementById("tahun_terbit").value;
  const inputProgramStudi = document.getElementById("Kategori").value;
  const inputStok = document.getElementById("stok").value;

  const gambarInput = document.getElementById("image-edit-input");

  // Create a new FormData instance
  const formData = new FormData();

  // Append the values to the formData object
  formData.append("id_buku", id_buku);
  formData.append("judul", inputJudul);
  formData.append("penulis", inputPenulis);
  formData.append("tahun_terbit", inputTahunTerbit);
  formData.append("Kategori", inputProgramStudi);
  formData.append("stok", inputStok);
  formData.append("gambar", gambarInput.files[0]);
  formData.append("url", urlString);

  console.log(formData);

  // Now, you can use the formData object to send the data to the server via AJAX or fetch API
  // For example:
  fetch("./src/controllers/updateBuku.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Handle the server response here

      if (data.status === "success") {
        alert("berhasil update Buku");
        window.location.reload();
        return;
      } else if (data.status === "error") {
        alert("server error");
        return;
      }
    })
    .catch((error) => {
      console.log("Error:", error);
      // Additional error handling if needed
    });
});
