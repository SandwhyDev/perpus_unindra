var admin = window.localStorage.getItem("admin");

console.log(admin);

var menuSide = ["FIPPS", "FMIPA", "FBS", "FTIK", "FP"];

var menuContainer = document.getElementById("menu-container");
const dataBukuContainer = document.getElementById("data-buku");
const dataBuku = document.createElement("div");
dataBuku.id = "dataBukuContainer1";
var formBuku = document.getElementById("form-buku");
const BtnSimpan = document.getElementById("btn-pinjam");
const BtnHapus = document.getElementById("btn-hapus");
const btnKeluar = document.getElementById("btn-keluar");

btnKeluar.className =
  "cursor-pointer bg-red-500 flex items-center justify-center text-white hover:bg-red-600 w-full p-2 rounded-md text-center capitalize";

for (var i = 0; i < menuSide.length; i++) {
  var li = document.createElement("li");
  li.className =
    "cursor-pointer hover:bg-blue-500 hover:text-white w-full p-2 rounded-md text-white text-center capitalize";
  li.textContent = menuSide[i];

  menuContainer.appendChild(li);
}
menuContainer.className = "flex flex-col gap-2  h-full  w-full list-none ";

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
  // dataBukuContainer.className = "w-60 h-52 flex flex-col gap-2 bg-green-500";

  formBuku.style.display = "none";

  // Membuat permintaan GET ke server
  fetch("./src/controllers/getData.php?kategori=" + kategori)
    .then((response) => response.json()) // Mengubah respons menjadi objek JSON
    .then((data) => {
      // Data berhasil diterima

      // Lakukan manipulasi atau tampilkan data di HTML
      data.forEach((buku) => {
        var bukuHTML = document.createElement("div");
        bukuHTML.className = "w-60 h-72 mb-[179px] ";
        // Membuat elemen gambar
        const gambarBuku = document.createElement("img");
        gambarBuku.src = buku.image_path;
        gambarBuku.className = "w-full h-full object-cover rounded-2xl ";
        bukuHTML.appendChild(gambarBuku);

        const judulBuku = document.createElement("h1");
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
        Tersedia.textContent = `Tersedia : ${buku.tersedia}`;
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
            pinjamBuku(buku.id, buku.judul); // Mengirim ID buku yang ingin dipinjam ke fungsi pinjamBuku
          }
        });
        bukuHTML.appendChild(tombolPinjam);

        // // Tombol hapus
        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";

        tombolHapus.addEventListener("click", () => {
          // Logika untuk memproses peminjaman buku
          HapusBuku(buku.id, buku.judul); // Mengirim ID buku yang ingin dipinjam ke fungsi pinjamBuku
        });

        console.log("admin ", admin);

        if (admin) {
          bukuHTML.appendChild(tombolHapus);
          BtnSimpan.className =
            "cursor-pointer bg-green-500    text-white hover:bg-green-600  w-full p-2 rounded-md  text-center capitalize";
          tombolHapus.className =
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full rounded mt-3";
        }

        dataBukuContainer.appendChild(bukuHTML);
      });
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
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./src/controllers/updateData.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        alert(`Buku ${nama} berhasil dipinjam`);
        window.location.reload();
      }
    };
    xhr.send("id_buku=" + id + "&action=pinjam");
  }
}

function TambahBuku() {
  dataBukuContainer.innerHTML = "";
  // dataBukuContainer.className = "hidden";

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
