// ============ KONFIGURASI ============
// Ganti URL ini dengan endpoint Google Apps Script / backend Anda
const API_URL = "https://script.google.com/macros/s/XXXXX/exec";

// ============ NAVIGASI ============
let guestName = "";

document.addEventListener("DOMContentLoaded", () => {
  const btnEnter = document.getElementById("btnEnter");
  const guestInput = document.getElementById("guestName");
  const errorMsg = document.getElementById("errorMsg");

  btnEnter.addEventListener("click", () => {
    const name = guestInput.value.trim();
    if (!name) {
      errorMsg.textContent = "Mohon isi nama Anda terlebih dahulu 🙏";
      guestInput.focus();
      return;
    }
    guestName = name;
    errorMsg.textContent = "";

    document.getElementById("welcome").classList.remove("active");
    document.getElementById("invitation").classList.add("active");
    window.scrollTo(0, 0);

    startCountdown();
  });

  // Enter key langsung submit
  guestInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btnEnter.click();
  });
});

// ============ COUNTDOWN ============
function startCountdown() {
  const targetDate = new Date("2025-12-12T08:00:00").getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff < 0) {
      document.getElementById("countdown").innerHTML =
        "<h3 style='color:#a83e63'>Acara telah berlangsung 💕</h3>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }

  update();
  setInterval(update, 1000);
}

// ============ BUKA MAPS ============
function openMaps() {
  const url = "https://maps.google.com/?q=Jakarta";
  window.open(url, "_blank");
}

// ============ RSVP ============
function rsvpYes() {
  document.getElementById("rsvpStep1").classList.add("hidden");
  document.getElementById("rsvpYesForm").classList.remove("hidden");
  document.getElementById("yesName").textContent = guestName;
}

function rsvpNo() {
  document.getElementById("rsvpStep1").classList.add("hidden");
  document.getElementById("rsvpNoForm").classList.remove("hidden");
  document.getElementById("noName").textContent = guestName;
}

async function submitRSVP(status) {
  let data = {
    nama: guestName,
    kehadiran: status,
    jumlahTamu: "",
    alasan: "",
    ucapan: "",
    waktu: new Date().toLocaleString("id-ID")
  };

  if (status === "hadir") {
    data.jumlahTamu = document.getElementById("guestCount").value;
    data.ucapan = document.getElementById("wishMessage").value.trim();
  } else {
    data.alasan = document.getElementById("reasonMessage").value.trim();
    if (!data.alasan) {
      alert("Mohon tuliskan alasan Anda 🙏");
      return;
    }
  }

  // Kirim data ke Google Sheets / backend
  try {
    if (API_URL && !API_URL.includes("XXXXX")) {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } else {
      // Fallback: simpan ke localStorage (untuk testing tanpa backend)
      const existing = JSON.parse(localStorage.getItem("rsvpList") || "[]");
      existing.push(data);
      localStorage.setItem("rsvpList", JSON.stringify(existing));
      console.log("RSVP tersimpan (localStorage):", data);
    }
  } catch (err) {
    console.error("Gagal kirim data:", err);
  }

  // Tampilkan halaman terima kasih
  document.getElementById("rsvpYesForm").classList.add("hidden");
  document.getElementById("rsvpNoForm").classList.add("hidden");
  document.getElementById("rsvpStep1").classList.add("hidden");
  document.getElementById("rsvpThanks").classList.remove("hidden");
  document.getElementById("rsvpThanks").scrollIntoView({ behavior: "smooth" });
}