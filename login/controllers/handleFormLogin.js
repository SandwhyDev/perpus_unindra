// Check if the "Remember me" checkbox is checked
const rememberCheckbox = document.getElementById("remember");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

rememberCheckbox.addEventListener("change", function () {
  if (this.checked) {
    // Save the username and password to localStorage
    localStorage.setItem("username", usernameInput.value);
    localStorage.setItem("password", passwordInput.value);
  } else {
    // Remove the username and password from localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  }
});

// Retrieve the username and password from localStorage
const savedUsername = localStorage.getItem("username");
const savedPassword = localStorage.getItem("password");

// Fill the input fields with the saved values, if any
if (savedUsername && savedPassword) {
  usernameInput.value = savedUsername;
  passwordInput.value = savedPassword;
  rememberCheckbox.checked = true;
}

const data = {
  username: usernameInput.value,
  password: passwordInput.value,
};

// Mendapatkan referensi elemen form
const form = document.getElementById("form-login");

// Menambahkan event listener untuk menghandle klik pada form
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Mencegah pengiriman form secara default

  // Mendapatkan nilai username dan password dari input form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Mengirim data menggunakan metode Fetch
  const data = {
    username: username,
    password: password,
  };

  fetch("./controllers/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(result.status);
      console.log(result.role);

      if (result.status === "success") {
        window.localStorage.setItem("login", true);
        window.localStorage.setItem("nama_lengkap", result.nama_lengkap);

        if (result.role === "admin") {
          window.localStorage.setItem("admin", true);

          console.log("halo admin");
        } else if (result.role === "mahasiswa") {
          window.localStorage.setItem("mahasiswa", true);

          console.log("halo mahasiswa");
        }

        window.location.href = env.url;
      } else if (result.status === "false") {
        loginError.style.display = "block";
      }
    })
    .catch((error) => {
      // Tangani kesalahan yang terjadi
      console.error("Error:", error);
    });
});
