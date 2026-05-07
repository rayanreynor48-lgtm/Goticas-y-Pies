/**
 * cookies.js
 * Gestión de consentimiento de cookies y modales legales.
 * Todo almacenado en localStorage (sin backend).
 *
 * Keys usadas:
 *   gy_age_confirmed   → 'true'
 *   gy_cookie_consent  → JSON { version, funcionales, analiticas, timestamp }
 *
 * FIX WEEK 1: Usar escapeHTML centralizado de utils.js
 */

import { loadLegal } from './loadData.js';
import { escapeHTML } from './utils.js';

const CONSENT_KEY = 'gy_cookie_consent';
const CONSENT_VER = '1.0';

/* ── Estado ── */
function getConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY)) || null; }
  catch { return null; }
}

function saveConsent(prefs) {
  const data = {
    version: CONSENT_VER,
    funcionales: prefs.funcionales ?? true,
    analiticas:  prefs.analiticas  ?? false,
    timestamp:   Date.now()
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
  return data;
}

/* ── Cookie Banner ── */
export function initCookieBanner() {
  const consent = getConsent();
  if (consent && consent.version === CONSENT_VER) return; // ya decidió

  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  // Mostrar con delay breve para no bloquear render
  setTimeout(() => banner.classList.add('visible'), 800);

  banner.querySelector('.btn-cookie-accept')?.addEventListener('click', () => {
    saveConsent({ funcionales: true, analiticas: false });
    banner.classList.remove('visible');
  });

  banner.querySelector('.btn-cookie-reject')?.addEventListener('click', () => {
    saveConsent({ funcionales: false, analiticas: false });
    banner.classList.remove('visible');
  });

  banner.querySelector('.btn-cookie-config')?.addEventListener('click', () => {
    banner.classList.remove('visible');
    openLegalModal('cookies');
  });
}

/* ── Modales legales ── */
const OVERLAY_ID = 'legalOverlay';

function getLegalOverlay() { return document.getElementById(OVERLAY_ID); }

export function openLegalModal(tipo) {
  const overlay = getLegalOverlay();
  if (!overlay) return;

  loadLegal().then(legal => {
    if (!legal) return;
    let html = '';

    if (tipo === 'privacidad') {
      html = buildTextModal(legal.privacidad);
    } else if (tipo === 'terminos') {
      html = buildTextModal(legal.terminos);
    } else if (tipo === 'seguridad') {
      html = buildTextModal(legal.seguridad);
    } else if (tipo === 'cookies') {
      html = buildCookieConfigModal(legal.cookies);
    }

    const modal = overlay.querySelector('.legal-modal');
    if (modal) modal.innerHTML = html;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Botón cerrar
    modal?.querySelector('.legal-modal-close')?.addEventListener('click', closeLegalModal);

    // Si es config cookies: guardar
    modal?.querySelector('.btn-legal-save')?.addEventListener('click', () => {
      const fn = modal.querySelector('#toggle-funcionales');
      const an = modal.querySelector('#toggle-analiticas');
      saveConsent({
        funcionales: fn ? fn.checked : true,
        analiticas:  an ? an.checked : false
      });
      closeLegalModal();
    });
  });
}

export function closeLegalModal() {
  const overlay = getLegalOverlay();
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── Builders HTML ── */
function buildTextModal(data) {
  const secciones = (data.contenido || []).map(s => `
    <div class="legal-section">
      <div class="legal-section-title">${escapeHTML(s.seccion)}</div>
      <div class="legal-section-text">${escapeHTML(s.texto)}</div>
    </div>`).join('');

  return `
    <div class="legal-modal-head">
      <span class="legal-modal-title">${escapeHTML(data.titulo)}</span>
      <button class="legal-modal-close">✕</button>
    </div>
    <div class="legal-modal-body">
      <div class="legal-date">Última actualización: ${escapeHTML(data.fecha)}</div>
      ${secciones}
    </div>`;
}

function buildCookieConfigModal(data) {
  const consent = getConsent();

  const tipos = (data.tipos || []).map(t => {
    const checked = t.obligatoria ? true : (consent ? consent[t.id] ?? false : t.id === 'funcionales');
    const disabled = t.obligatoria ? 'disabled' : '';
    const ejemplos = t.ejemplos?.length
      ? `<div class="cookie-type-ejemplos">e.g.: ${t.ejemplos.join(', ')}</div>` : '';
    return `
      <div class="cookie-type">
        <div class="cookie-type-head">
          <span class="cookie-type-name">${escapeHTML(t.nombre)}</span>
          <label class="cookie-toggle">
            <input type="checkbox" id="toggle-${escapeHTML(t.id)}" ${checked?'checked':''} ${disabled}>
            <span class="cookie-toggle-slider"></span>
          </label>
        </div>
        <div class="cookie-type-desc">${escapeHTML(t.descripcion)}</div>
        ${ejemplos}
      </div>`;
  }).join('');

  return `
    <div class="legal-modal-head">
      <span class="legal-modal-title">${escapeHTML(data.titulo)}</span>
      <button class="legal-modal-close">✕</button>
    </div>
    <div class="legal-modal-body">${tipos}</div>
    <div class="legal-modal-foot">
      <button class="btn-legal-save">Guardar preferencias</button>
    </div>`;
}

/* ── Init global ── */
export function initLegal() {
  const overlay = getLegalOverlay();
  if (!overlay) return;

  // Cerrar al clicar fuera
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLegalModal();
  });

  // Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLegalModal();
  });

  // Todos los links legales del DOM
  document.querySelectorAll('[data-legal]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openLegalModal(el.dataset.legal);
    });
  });
}
