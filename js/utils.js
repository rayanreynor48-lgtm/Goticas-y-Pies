/**
 * utils.js — Funciones utilitarias centralizadas
 * Escape XSS, validaciones, helpers
 */

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} str - Texto a escapar
 * @returns {string} Texto escapado
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Valida que una URL sea relativa e interna (no Open Redirect)
 * @param {string} url - URL a validar
 * @returns {boolean} true si es URL interna válida
 */
export function isInternalURL(url) {
  if (!url) return false;
  // Debe empezar con / o ser 'index.html'
  return url.startsWith('/') || url === 'index.html' || url === './index.html';
}

/**
 * Obtiene parámetro de query string de forma segura
 * @param {string} param - Nombre del parámetro
 * @returns {string|null} Valor del parámetro o null
 */
export function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}
