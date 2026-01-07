// Global state
let currentConcert = {name: "", location: "", date: "", price: 0};

// Navbar shadow on scroll
document.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 10);
});

// Dark mode toggle + persist
const darkToggle = document.getElementById("darkToggle");
const savedTheme = localStorage.getItem("ct-theme");
if (savedTheme === "dark") document.documentElement.classList.add("dark");
if (darkToggle) {
    darkToggle.checked = savedTheme === "dark";
    darkToggle.addEventListener("change", () => {
        document.documentElement.classList.toggle("dark", darkToggle.checked);
        localStorage.setItem("ct-theme", darkToggle.checked ? "dark" : "light");
    });
}

// Currency format (ID)
function formatRupiah(number) {
    return "Rp " + Number(number).toLocaleString("id-ID");
}

// Select concert (from cards)
function selectConcert(name, location, date, price) {
    currentConcert = { name, location, date, price };
    localStorage.setItem("ct-selected", JSON.stringify(currentConcert));
    window.location.href = "booking.html";
}

// Booking page logic
function initBooking() {
    const data = JSON.parse(localStorage.getItem("ct-selected") || "{}");
    currentConcert = data;
    const selectedConcert = document.getElementById("selectedConcert");
    const basePrice = document.getElementById("basePrice");
    if (selectedConcert && basePrice && data.name) {
        selectedConcert.value = `${data.name} - ${data.location} (${data.date})`;
        basePrice.textContent = formatRupiah(data.price);
    }
    updateTotal();
}

function updateTotal() {
    const qtyEl = document.getElementById("ticketQty");
    const catEl = document.getElementById("ticketCategory");
    if (!qtyEl || !catEl) return;
    const qty = parseInt(qtyEl.value) || 1;
    const category = parseFloat(catEl.value);
    const categoryText = catEl.selectedOptions[0].text;
    const total = (currentConcert.price || 0) * qty * category;

    document.getElementById("qtyDisplay").textContent = qty;
    document.getElementById("categoryDisplay").textContent = categoryText;
    document.getElementById("totalPrice").textContent = formatRupiah(total);
}

// Form validation (Contact & Booking)
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

function processBooking() {
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const qty = document.getElementById("ticketQty").value;

    if (!name || !email || !phone) return alert("Mohon lengkapi semua data!");
    if (!validateEmail(email)) return alert("Format email tidak valid!");
    if (!/^\d{9,15}$/.test(phone)) return alert("Nomor telepon harus angka (9–15 digit).");

    const bookingCode = "CTX" + Date.now().toString().slice(-8);
    const total = document.getElementById("totalPrice").textContent;

    localStorage.setItem("ct-confirm", JSON.stringify({
        bookingCode, name, email, concert: currentConcert.name, qty, total
    }));

    window.location.href = "confirmation.html";
}

// Confirmation page init
function initConfirmation() {
    const data = JSON.parse(localStorage.getItem("ct-confirm") || "{}");
    if (!data.bookingCode) return;
    document.getElementById("bookingCode").textContent = data.bookingCode;
    document.getElementById("confirmName").textContent = data.name;
    document.getElementById("confirmEmail").textContent = data.email;
    document.getElementById("confirmConcert").textContent = data.concert;
    document.getElementById("confirmQty").textContent = data.qty + " tiket";
    document.getElementById("confirmTotal").textContent = data.total;
}

// Contact form submit
function submitContact() {
    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const subject = document.getElementById("cSubject").value.trim();
    const message = document.getElementById("cMessage").value.trim();

    if (!name || !email || !subject || !message) return alert("Mohon lengkapi semua field.");
    if (!validateEmail(email)) return alert("Format email tidak valid.");
    alert("Pesan telah terkirim! Kami akan segera menghubungi Anda.");
}

// Gallery modal
function openImageModal(src, caption) {
    const img = document.getElementById("modalImg");
    const cap = document.getElementById("modalCaption");
    img.src = src;
    cap.textContent = caption;
    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();
}