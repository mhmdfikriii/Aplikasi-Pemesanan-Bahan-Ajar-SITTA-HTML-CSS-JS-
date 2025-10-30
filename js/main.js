
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formPemesanan");
  const tabelBody = document.querySelector("#tablePesanan tbody");
  const btnKirim = document.getElementById("kirim");
  const modalBox = document.getElementById("modalBox");
  const modalMessage = document.getElementById("modalMessage");
  const closeModal = document.getElementById("closeModal");
  const themeToggle = document.getElementById("darkModeToggle");
  const searchInput = document.getElementById("searchInput");

  if (!form) return console.error("ERROR: formPemesanan tidak ditemukan.");
  if (!tabelBody) return console.error("ERROR: #tablePesanan tbody tidak ditemukan.");
  if (!btnKirim) console.warn("Peringatan: tombol kirim (id=kirim) tidak ditemukan.");
  if (!modalBox || !modalMessage) console.warn("Peringatan: modalBox/modalMessage tidak ditemukan.");
  if (!closeModal) console.warn("Peringatan: closeModal tidak ditemukan.");
  if (!themeToggle) console.warn("Peringatan: darkModeToggle tidak ditemukan.");

  let pesananDikirim = false;

  function showMessage(msg) {
    if (modalBox && modalMessage) {
      modalMessage.textContent = msg;
      modalBox.style.display = "flex";
    } else {
      alert(msg);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama")?.value.trim() ?? "";
    const nim = document.getElementById("nim")?.value.trim() ?? "";
    const namaMK = document.getElementById("namaMK")?.value.trim() ?? "";
    const kodeMK = document.getElementById("kodeMK")?.value.trim() ?? "";
    const jumlahRaw = document.getElementById("jumlah")?.value ?? "";
    const jumlah = jumlahRaw === "" ? NaN : Number(jumlahRaw);


    if (!nama || !nim || !namaMK || !kodeMK || Number.isNaN(jumlah) || jumlah <= 0) {
      showMessage(" Harap isi semua field dengan benar (jumlah > 0).");
      return;
    }


    const row = document.createElement("tr");
    const noUrut = tabelBody.children.length + 1;

    row.innerHTML = `
      <td>${noUrut}</td>
      <td>${escapeHtml(nama)}</td>
      <td>${escapeHtml(nim)}</td>
      <td>${escapeHtml(namaMK)}</td>
      <td>${escapeHtml(kodeMK)}</td>
      <td>${jumlah}</td>
      <td><button class="btn-hapus"> Hapus</button></td>
    `;


    const hapusBtn = row.querySelector(".btn-hapus");
    if (hapusBtn) {
      hapusBtn.addEventListener("click", () => {
        row.remove();
        updateNomorUrut();
      });
    }

    tabelBody.appendChild(row);


    form.reset();
    showMessage(" Data berhasil ditambahkan ke tabel!");
  });


  function updateNomorUrut() {
    Array.from(tabelBody.children).forEach((tr, i) => {
      const firstCell = tr.querySelector("td");
      if (firstCell) firstCell.textContent = i + 1;
    });
  }

  if (btnKirim) {
    btnKirim.addEventListener("click", () => {
      if (tabelBody.children.length === 0) {
        showMessage(" Tambahkan minimal 1 mata kuliah sebelum mengirim!");
        return;
      }

      if (!pesananDikirim) {

        btnKirim.disabled = true;
        btnKirim.textContent = " Mengirim...";
        btnKirim.style.opacity = "0.7";

        setTimeout(() => {
          btnKirim.textContent = " Tracking Bahan Ajar";
          btnKirim.disabled = false;
          btnKirim.style.opacity = "1";
          pesananDikirim = true;
          showMessage(" Pesanan berhasil dikirim!");
        }, 1000);
      } else {
    
        showMessage(" Status Tracking: Sedang Diproses.....");
      }
    });
  }

  if (closeModal && modalBox) {
    closeModal.addEventListener("click", () => {
      modalBox.style.display = "none";
    });
  }


  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      themeToggle.textContent = document.body.classList.contains("dark")
        ? " Mode Terang"
        : " Mode Gelap";
    });
  }


  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const q = this.value.trim().toLowerCase();
      Array.from(tabelBody.children).forEach(tr => {
        const text = tr.textContent.toLowerCase();
        tr.style.display = text.includes(q) ? "" : "none";
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
