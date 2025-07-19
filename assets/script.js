/* ==========================================================================
   Brutalist.js v1.0
   Skrip pendamping untuk BrutalistCSS.
   Ringan, tanpa dependensi, dan berbasis atribut data.
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Fungsi utama yang akan dijalankan setelah DOM dimuat.
   * Menginisialisasi semua komponen interaktif.
   */
  function init() {
    initModals();
    initToggles();
    initTabs();
    initDarkMode();
    // Fungsi untuk Alert tidak diinisialisasi di sini,
    // karena ia dipanggil secara dinamis.
  }

  /**
   * Inisialisasi semua fungsionalitas Modal.
   * - Trigger: [data-modal-target="#modalId"]
   * - Tombol Tutup: [data-modal-close]
   * - Menutup modal dengan klik background atau tombol Escape.
   */
  function initModals() {
    const modalTriggers = document.querySelectorAll("[data-modal-target]");
    const modalCloses = document.querySelectorAll("[data-modal-close]");

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modalId = trigger.getAttribute("data-modal-target");
        const modal = document.querySelector(modalId);
        if (modal) {
          modal.classList.add("is-open");
        }
      });
    });

    modalCloses.forEach((closer) => {
      closer.addEventListener("click", () => {
        const modal = closer.closest(".modal");
        if (modal) {
          modal.classList.remove("is-open");
        }
      });
    });

    // Event listener untuk menutup modal saat klik di luar area dialog
    document.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("modal") &&
        event.target.classList.contains("is-open")
      ) {
        event.target.classList.remove("is-open");
      }
    });

    // Event listener untuk menutup modal dengan tombol Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const openModal = document.querySelector(".modal.is-open");
        if (openModal) {
          openModal.classList.remove("is-open");
        }
      }
    });
  }

  function initDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;

    const currentTheme = localStorage.getItem("theme");

    // Terapkan tema saat halaman dimuat
    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      toggle.checked = true;
    } else {
      // Default ke light mode jika tidak ada setting
      document.documentElement.removeAttribute("data-theme");
      toggle.checked = false;
    }

    // Listener untuk mengubah tema saat di-klik
    toggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }
  /**
   * Inisialisasi fungsionalitas Toggle.
   * Berguna untuk menu mobile, dropdown, accordion, dll.
   * - Trigger: [data-toggle-target="#elementId"]
   * - Atribut tambahan: [data-toggle-class="nama-kelas"] (default: 'is-active')
   */
  function initToggles() {
    const toggleTriggers = document.querySelectorAll("[data-toggle-target]");

    toggleTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        const targetSelector = this.getAttribute("data-toggle-target");
        const targetElement = document.querySelector(targetSelector);
        const toggleClass =
          this.getAttribute("data-toggle-class") || "is-active";

        if (targetElement) {
          targetElement.classList.toggle(toggleClass);
        }

        // Juga toggle kelas pada trigger itu sendiri (berguna untuk ikon menu)
        this.classList.toggle(toggleClass);
      });
    });
  }

  /**
   * Inisialisasi fungsionalitas Tab.
   * - Container: [data-tabs]
   * - Link Tab: [data-tab="tabId"]
   * - Konten Tab: [data-tab-content="tabId"]
   */
  function initTabs() {
    const tabContainers = document.querySelectorAll("[data-tabs]");

    tabContainers.forEach((container) => {
      const tabLinks = container.querySelectorAll("[data-tab]");
      const tabContents = container.querySelectorAll("[data-tab-content]");

      // Atur status awal: tampilkan tab aktif pertama
      if (tabLinks.length > 0) {
        const activeTab =
          container.querySelector("[data-tab].active") || tabLinks[0];
        const activeContentId = activeTab.getAttribute("data-tab");

        tabLinks.forEach((link) => link.classList.remove("active"));
        activeTab.classList.add("active");

        tabContents.forEach((content) => {
          if (content.getAttribute("data-tab-content") === activeContentId) {
            content.classList.remove("d-none");
          } else {
            content.classList.add("d-none");
          }
        });
      }

      container.addEventListener("click", (event) => {
        const clickedTab = event.target.closest("[data-tab]");
        if (!clickedTab) return;

        event.preventDefault();

        // Hapus aktif dari semua link
        tabLinks.forEach((link) => link.classList.remove("active"));

        // Tambah aktif ke link yang diklik
        clickedTab.classList.add("active");

        // Sembunyikan semua konten
        tabContents.forEach((content) => content.classList.add("d-none"));

        // Tampilkan konten yang sesuai
        const contentId = clickedTab.getAttribute("data-tab");
        const targetContent = container.querySelector(
          `[data-tab-content="${contentId}"]`
        );
        if (targetContent) {
          targetContent.classList.remove("d-none");
        }
      });
    });
  }

  /**
   * Fungsi GLOBAL untuk membuat Alert secara dinamis.
   * Bisa dipanggil dari mana saja di skrip lain.
   * @param {string} message - Pesan yang akan ditampilkan.
   * @param {string} type - Tipe alert ('info', 'success', 'warning', 'danger'). Default: 'info'.
   * @param {number} duration - Durasi dalam milidetik sebelum hilang. 0 untuk permanen. Default: 5000.
   */
  window.createBrutalistAlert = function (
    message,
    type = "info",
    duration = 5000
  ) {
    let container = document.getElementById("alert-container");
    // Jika container belum ada, buat dan tambahkan ke body
    if (!container) {
      container = document.createElement("div");
      container.id = "alert-container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = "2000";
      container.style.width = "350px";
      container.style.maxWidth = "90%";
      document.body.appendChild(container);
    }

    const alertEl = document.createElement("div");
    alertEl.className = `alert alert-${type}`;

    // Tambahkan tombol close
    alertEl.innerHTML = `<span>${message}</span><button class="brutalist-alert-close" style="background:none; border:none; font-size:1.2rem; cursor:pointer; position:absolute; top:5px; right:10px; color:inherit;">×</button>`;

    container.appendChild(alertEl);

    const closeAlert = () => {
      // Animasi keluar, lalu hapus elemen
      alertEl.style.transition =
        "transform 0.3s ease-in-out, opacity 0.3s ease";
      alertEl.style.transform = "translateX(120%)";
      alertEl.style.opacity = "0";
      setTimeout(() => alertEl.remove(), 300);
    };

    // Event untuk tombol close
    alertEl
      .querySelector(".brutalist-alert-close")
      .addEventListener("click", closeAlert);

    // Hapus otomatis jika durasi diatur
    if (duration > 0) {
      setTimeout(closeAlert, duration);
    }
  };

  // Jalankan inisialisasi setelah halaman selesai dimuat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

const toggleGroup = document.getElementById("toggleGroup");
if (toggleGroup) {
  const buttons = toggleGroup.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const panel = document.getElementById("interactive-datatable-panel");
  if (!panel) return;

  const searchInput = panel.querySelector("#table-search");
  const tableBody = panel.querySelector("#interactive-tbody");
  const tableRows = Array.from(tableBody.querySelectorAll("tr"));
  const headers = panel.querySelectorAll(".sortable-header");

  // --- Fungsi Filter / Pencarian ---
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    tableRows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();
      row.style.display = rowText.includes(searchTerm) ? "" : "none";
    });
  });

  // --- Fungsi Sorting / Pengurutan ---
  headers.forEach((header, index) => {
    header.addEventListener("click", function () {
      const sortDir = this.dataset.sortDir;
      const isNumeric = !isNaN(tableRows[0]?.cells[index]?.textContent);

      // Sort the rows
      const sortedRows = Array.from(tableBody.querySelectorAll("tr")).sort(
        (a, b) => {
          const aText = a.cells[index].textContent.trim();
          const bText = b.cells[index].textContent.trim();

          let aVal = isNumeric ? parseFloat(aText) : aText.toLowerCase();
          let bVal = isNumeric ? parseFloat(bText) : bText.toLowerCase();

          if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
          if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
          return 0;
        }
      );

      // Re-append sorted rows
      tableBody.innerHTML = "";
      sortedRows.forEach((row) => tableBody.appendChild(row));

      // Update header styles and direction
      headers.forEach((h) => {
        h.classList.remove("sorted-asc", "sorted-desc");
      });
      this.classList.add(sortDir === "asc" ? "sorted-asc" : "sorted-desc");
      this.dataset.sortDir = sortDir === "asc" ? "desc" : "asc";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const animateBtn = document.getElementById("animate-btn");
  if (animateBtn) {
    animateBtn.addEventListener("click", () => {
      const progressGroup = document.getElementById("animated-progress-group");
      const innerBars = progressGroup.querySelectorAll(".progress-bar-inner");

      innerBars.forEach((bar) => {
        // Reset first
        bar.style.width = "10%";

        // Then animate to target value after a short delay
        setTimeout(() => {
          const targetWidth = bar.getAttribute("data-value") || "75";
          bar.style.width = targetWidth + "%";
        }, 100);
      });
    });
  }
});
