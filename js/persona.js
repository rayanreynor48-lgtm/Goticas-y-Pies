/**
 * persona.js — página de perfil completo
 * Banner 820×312, Avatar 170×170, tabs Fotos/Videos
 * FIX WEEK 1: Usar escapeHTML centralizado de utils.js
 * FIX WEEK 1: Arreglar onerror en imágenes (usar parentElement en lugar de outerHTML)
 */
import { getPersonaById } from './loadData.js';
import { getPersonaIdFromUrl, goToIndex, checkAge } from './router.js';
import { initLegal, initCookieBanner } from './cookies.js';
import { escapeHTML } from './utils.js';

async function init(){
  if(!checkAge()) return;
  initLegal();
  initCookieBanner();

  document.getElementById('btnBack')?.addEventListener('click', e=>{ e.preventDefault(); goToIndex(); });

  const id = getPersonaIdFromUrl();
  if(!id){ showError('No se especificó perfil.'); return; }

  showLoader();
  const persona = await getPersonaById(id);
  if(!persona){ showError(`Perfil "${id}" no encontrado.`); return; }

  renderPersona(persona);
  initTabs();
  initLightbox();
}

/* ── Render ── */
function renderPersona(p){
  const root = document.getElementById('personaRoot');
  if(!root) return;
  document.title = `${p.nombre||'Perfil'} — Goticas y Pies`;
  root.innerHTML = buildHTML(p);
}

function buildHTML(p){
  const badge = p.verificado ? `<span class="verified-badge" title="Cuenta verificada">✓</span>` : '';
  const tagsHTML = (p.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('');

  /* Banner 820×312 */
  const bannerHTML = p.banner
    ? `<img src="${escapeHTML(p.banner)}" alt="banner de ${escapeHTML(p.nombre||'')}" loading="eager" onerror="this.parentElement.innerHTML='<div class=\\'persona-banner-placeholder\\'>⚰</div>'">`
    : `<div class="persona-banner-placeholder">⚰</div>`;

  /* Avatar 170×170 */
  const avatarHTML = p.avatar
    ? `<img src="${escapeHTML(p.avatar)}" alt="${escapeHTML(p.nombre||'')}" loading="eager" onerror="this.parentElement.innerHTML='<div class=\\'persona-avatar-placeholder\\'>🖤</div>'">`
    : `<div class="persona-avatar-placeholder">🖤</div>`;

  const galeriaHTML = buildGaleria(p.imagenes||[]);
  const videosHTML  = buildVideos(p.videos||[]);

  return `
    <!-- Banner -->
    <div class="persona-banner-wrap">${bannerHTML}</div>

    <!-- Perfil row -->
    <div class="persona-profile-section">
      <div class="persona-profile-row">
        <div class="persona-avatar-wrap">${avatarHTML}</div>
        <div class="persona-info-block">
          <h1 class="persona-nombre">${escapeHTML(p.nombre||'Sin nombre')} ${badge}</h1>
          <div class="persona-usuario">${escapeHTML(p.usuario||'')}</div>
          <div class="persona-stats">
            <span><strong>${escapeHTML(p.seguidores||'0')}</strong> seguidores</span>
            <span><strong>${escapeHTML(p.seguidos||'0')}</strong> siguiendo</span>
          </div>
        </div>
        <div class="persona-profile-actions">
          <button class="btn-seguir">+ Seguir</button>
        </div>
      </div>

      ${p.descripcion ? `<div class="persona-desc">${escapeHTML(p.descripcion)}</div>` : ''}
      ${tagsHTML ? `<div class="persona-tags">${tagsHTML}</div>` : ''}
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab-btn active" data-tab="fotos">📸 Fotos</button>
      <button class="tab-btn" data-tab="videos">🎬 Videos</button>
    </div>

    <!-- Fotos -->
    <div class="tab-panel active" id="tab-fotos">
      <div class="section">
        <h2 class="section-title">Fotos</h2>
        ${galeriaHTML}
      </div>
    </div>

    <!-- Videos -->
    <div class="tab-panel" id="tab-videos">
      <div class="section">
        <h2 class="section-title">Videos</h2>
        ${videosHTML}
      </div>
    </div>`;
}

function buildGaleria(imgs){
  if(!imgs.length) return `<div class="empty-section">Sin fotos por el momento 🖤</div>`;
  return `<div class="gallery-grid">${imgs.map((src,i)=>`
    <div class="gallery-item" style="aspect-ratio:2/3" data-src="${escapeHTML(src)}" role="button" tabindex="0" aria-label="Foto ${i+1}">
      <img src="${escapeHTML(src)}" alt="Foto ${i+1}" loading="lazy"
           onerror="this.parentElement.innerHTML='<div class=\\'gallery-item-placeholder\\'>🖤</div>'">
    </div>`).join('')}</div>`;
}

function buildVideos(vids){
  if(!vids.length) return `<div class="empty-section">Sin videos por el momento 🎥</div>`;
  return `<div class="videos-grid">${vids.map((src,i)=>`
    <div class="video-item">
      <video controls preload="metadata" playsinline>
        <source src="${escapeHTML(src)}" type="video/mp4">
      </video>
      <div class="video-label">${escapeHTML(src.split('/').pop()||`video_${i+1}`)}</div>
    </div>`).join('')}</div>`;
}

/* ── Tabs ── */
function initTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const tab=btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${tab}`)?.classList.add('active');
    });
  });
}

/* ── Lightbox ── */
function initLightbox(){
  const overlay = document.getElementById('lightboxOverlay');
  const imgEl   = document.getElementById('lightboxImg');
  if(!overlay||!imgEl) return;

  document.querySelectorAll('.gallery-item[data-src]').forEach(item=>{
    item.addEventListener('click',()=>{ imgEl.src=item.dataset.src; overlay.classList.add('active'); document.body.style.overflow='hidden'; });
    item.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); item.click(); } });
  });

  const close=()=>{ overlay.classList.remove('active'); document.body.style.overflow=''; imgEl.src=''; };
  document.getElementById('lightboxClose')?.addEventListener('click',close);
  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape')close(); });
}

/* ── UI states ── */
function showLoader(){ const r=document.getElementById('personaRoot'); if(r) r.innerHTML=`<div class="loader" style="padding:120px 0"><div class="loader-ring"></div></div>`; }
function showError(msg){ const r=document.getElementById('personaRoot'); if(r) r.innerHTML=`<div class="error-state" style="padding:100px 20px"><div class="icon">💀</div><h3>Perfil no encontrado</h3><p>${escapeHTML(msg)}</p><br><a href="index.html" style="color:var(--morado-vivo)">← Volver</a></div>`; }

document.addEventListener('DOMContentLoaded', init);
