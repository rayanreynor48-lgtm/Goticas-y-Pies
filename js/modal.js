/**
 * modal.js — preview SOLO: banner, avatar, nombre, tags, botón perfil
 * FIX WEEK 1: Usar escapeHTML centralizado de utils.js
 * FIX WEEK 1: Validar que persona.id exista antes de navegar
 */
import { escapeHTML } from './utils.js';

let _overlay=null, _open=false;
function getOverlay(){ return _overlay||(_overlay=document.getElementById('modalOverlay')); }

export function initModal(){
  const o=getOverlay(); if(!o)return;
  o.addEventListener('click',e=>{ if(e.target===o)closeModal(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&_open)closeModal(); });
}

export function openModal(p){
  const o=getOverlay(); if(!o)return;

  // Banner
  const bannerWrap=o.querySelector('.modal-banner');
  if(bannerWrap){
    bannerWrap.innerHTML = p.banner
      ? `<img src="${escapeHTML(p.banner)}" alt="banner" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'modal-banner-placeholder\\'>⚰</div>'">`
      : `<div class="modal-banner-placeholder">⚰</div>`;
  }

  // Avatar
  const avWrap=o.querySelector('.modal-avatar-wrap');
  if(avWrap){
    avWrap.innerHTML = p.avatar
      ? `<img src="${escapeHTML(p.avatar)}" alt="${escapeHTML(p.nombre)}" loading="lazy">`
      : `<div class="persona-avatar-placeholder">🖤</div>`;
  }

  o.querySelector('.modal-name').innerHTML =
    `${escapeHTML(p.nombre||'Sin nombre')}${p.verificado?'<span class="verified-badge" title="Cuenta verificada">✓</span>':''}`;
  o.querySelector('.modal-user').textContent = p.usuario||'';

  const statsEl=o.querySelector('.modal-stats');
  if(statsEl) statsEl.innerHTML=
    `<span>${escapeHTML(p.seguidores||'0')}</span> seguidores &nbsp;·&nbsp; <span>${escapeHTML(p.seguidos||'0')}</span> seguidos`;

  const tagsEl=o.querySelector('.modal-tags');
  if(tagsEl) tagsEl.innerHTML=(p.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('');

  // FIX: Validar que p.id exista antes de usar
  const btn=o.querySelector('.btn-ver-perfil');
  if(btn) {
    if (!p.id) {
      btn.disabled = true;
      btn.title = 'Perfil sin ID válido';
    } else {
      btn.disabled = false;
      btn.onclick=()=>{ window.location.href=`persona.html?id=${encodeURIComponent(p.id)}`; };
    }
  }

  o.classList.add('active');
  document.body.style.overflow='hidden';
  _open=true;
}

export function closeModal(){
  const o=getOverlay(); if(!o)return;
  o.classList.remove('active');
  document.body.style.overflow='';
  _open=false;
}
