/**
 * router.js — Navegación y verificación de edad
 * FIX WEEK 1: Eliminado sessionStorage (vulnerable a bypass en múltiples pestañas)
 * FIX WEEK 1: Validación de redirect para evitar Open Redirect
 */

import { isInternalURL, getQueryParam } from './utils.js';

/**
 * Obtiene el ID de persona desde URL
 * @returns {string|null} ID de la persona
 */
export function getPersonaIdFromUrl() {
  return getQueryParam('id') || null;
}

/**
 * Navega a página de persona
 * @param {string} id - ID de la persona
 */
export function goToPersona(id) {
  if (!id) return;
  window.location.href = `persona.html?id=${encodeURIComponent(id)}`;
}

/**
 * Navega a página principal
 */
export function goToIndex() {
  window.location.href = 'index.html';
}

/**
 * Verifica si el usuario ha confirmado mayoría de edad
 * FIX: Solo usa localStorage (sincronizado entre pestañas)
 * FIX: Valida timestamp (máximo 30 días)
 * @returns {boolean} true si está verificado
 */
export function checkAge() {
  const verified = localStorage.getItem('gy_age_confirmed') === 'true';
  const ts = parseInt(localStorage.getItem('gy_age_timestamp') || 0);
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // Si no está verificado o expiró, redirigir a 18.html
  if (!verified || (Date.now() - ts > thirtyDaysMs)) {
    window.location.href = `18.html?redirect=${encodeURIComponent(window.location.href)}`;
    return false;
  }

  return true;
}
