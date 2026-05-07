/**
 * app.js — index.html: grid de cards con banner+avatar adaptativo
 * FIX WEEK 1: Usar escapeHTML centralizado de utils.js
 */
import { loadPersonas, getAllTags } from './loadData.js';
import { filtrarPersonas, initSearch, initTagButtons } from './search.js';
import { initModal, openModal, closeModal } from './modal.js';
import { checkAge } from './router.js';
import { initCookieBanner, initLegal } from './cookies.js';
import { escapeHTML } from './utils.js';

let _todas=[], _query='', _tag='';
const gridEl      = ()=>document.getElementById('grid');
const searchInput = ()=>document.getElementById('searchInput');
const filterBar   = ()=>document.getElementById('filterBar');
const resultInfo  = ()=>document.getElementById('resultInfo');

async function init(){
  if(!checkAge()) return;
  initModal();
  initLegal();
  initCookieBanner();

  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  showLoader();
  _todas = await loadPersonas();
  if(!_todas.length){ showError(); return; }

  await buildTagFilters();
  initSearch(searchInput(), q=>{ _query=q; render(); });
  render();
}

/* ── Render ── */
function render(){
  const filtradas = filtrarPersonas(_todas, _query, _tag);
  const ri = resultInfo();
  if(ri){
    ri.innerHTML = (_query||_tag)
      ? `Mostrando <span>${filtradas.length}</span> de ${_todas.length} perfiles`
      : `<span>${_todas.length}</span> perfiles`;
  }
  const g = gridEl(); if(!g) return;
  if(!filtradas.length){
    g.innerHTML=`<div class="no-results"><div class="icon">🔮</div><h3>Sin resultados</h3><p>Prueba otro nombre o tag</p></div>`;
    return;
  }
  g.innerHTML = filtradas.map((p,i)=>cardHTML(p,i)).join('');
  g.querySelectorAll('.card').forEach(el=>{
    el.addEventListener('click',()=>{
      const persona=_todas.find(p=>p.id===el.dataset.id);
      if(persona) openModal(persona);
    });
    el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
  });
}

function cardHTML(p, i){
  const delay = Math.min(i*55,500);

  /* Banner */
  const bannerHTML = p.banner
    ? `<img src="${escapeHTML(p.banner)}" alt="banner" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-banner-placeholder\\'>⚰</div>'">`
    : `<div class="card-banner-placeholder">⚰</div>`;

  /* Avatar */
  const avatarHTML = p.avatar
    ? `<img src="${escapeHTML(p.avatar)}" alt="${escapeHTML(p.nombre)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-avatar-placeholder\\'>🖤</div>'">`
    : `<div class="card-avatar-placeholder">🖤</div>`;

  const badge = p.verificado ? `<span class="verified-badge" title="Cuenta verificada">✓</span>` : '';

  const tagsHTML = (p.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('');

  return `
    <article class="card" data-id="${escapeHTML(p.id)}" style="animation-delay:${delay}ms"
      role="button" tabindex="0" aria-label="Ver preview de ${escapeHTML(p.nombre||'')}">

      <div class="card-banner">${bannerHTML}</div>

      <div class="card-avatar-wrap">${avatarHTML}</div>

      <div class="card-body">
        <h3 class="card-name">${escapeHTML(p.nombre||'Sin nombre')} ${badge}</h3>
        <div class="card-user">${escapeHTML(p.usuario||'')}</div>
        <div class="card-stats">
          <span>${escapeHTML(p.seguidores||'0')}</span> seg. &nbsp;·&nbsp;
          <span>${escapeHTML(p.seguidos||'0')}</span> siguiendo
        </div>
        <div class="card-tags">${tagsHTML}</div>
      </div>

      <span class="card-preview-hint">Ver preview</span>
    </article>`;
}

async function buildTagFilters(){
  const fb = filterBar(); if(!fb) return;
  const tags = await getAllTags();
  fb.innerHTML =
    `<span class="filter-label">Filtrar</span>` +
    `<button class="tag-btn active" data-tag="">Todas</button>` +
    tags.map(t=>`<button class="tag-btn" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</button>`).join('');
  const btns = fb.querySelectorAll('.tag-btn');
  initTagButtons(btns, tag=>{ _tag=tag; render(); });
}

function showLoader(){ const g=gridEl(); if(g) g.innerHTML=`<div class="loader"><div class="loader-ring"></div></div>`; }
function showError(){ const g=gridEl(); if(g) g.innerHTML=`<div class="error-state"><div class="icon">💀</div><h3>Error cargando perfiles</h3><p>Verifica data/personas.json</p></div>`; }

document.addEventListener('DOMContentLoaded', init);
