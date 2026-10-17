// ==========================================
// COMPONENTE FOOTER INSTITUCIONAL
// CETA Preuniversitario
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const mainContent = document.querySelector(".main-content");

  if (mainContent) {
    const footerHTML = `
      <footer class="ceta-footer" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; color: var(--sidebar-text); font-size: 0.85rem;">
        <div>
          <p style="font-weight: 700; color: var(--text-dark);">CETA Preuniversitario</p>
          <p>© ${new Date().getFullYear()} CETA Preuniversitario. Todos los derechos reservados.</p>
        </div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span style="display: inline-flex; align-items: center; gap: 5px;"><i data-lucide="shield-check" size="14"></i> Sistema Seguro</span>
          <span style="display: inline-flex; align-items: center; gap: 5px;"><i data-lucide="map-pin" size="14"></i> Chone - Ecuador</span>
        </div>
      </footer>
    `;
    mainContent.insertAdjacentHTML("beforeend", footerHTML);
    if (window.lucide) lucide.createIcons();
  }
});