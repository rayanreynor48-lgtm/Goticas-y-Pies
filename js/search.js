/** search.js */
export function filtrarPersonas(personas, query, activeTag) {
  const q   = (query||'').trim().toLowerCase();
  const tag = (activeTag||'').trim().toLowerCase();
  return personas.filter(p => {
    if (tag && !(p.tags||[]).map(t=>t.toLowerCase()).includes(tag)) return false;
    if (!q) return true;
    if ((p.nombre||'').toLowerCase().includes(q)) return true;
    if ((p.tags||[]).some(t=>t.toLowerCase().includes(q))) return true;
    if ((p.descripcion||'').toLowerCase().includes(q)) return true;
    return false;
  });
}
export function initSearch(inputEl, onSearch, delay=220) {
  if (!inputEl) return;
  let timer=null;
  inputEl.addEventListener('input', ()=>{ clearTimeout(timer); timer=setTimeout(()=>onSearch(inputEl.value),delay); });
  inputEl.addEventListener('keydown', e=>{ if(e.key==='Escape'){inputEl.value='';onSearch('');inputEl.blur()} });
}
export function initTagButtons(btns, onTagChange) {
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const tag = btn.dataset.tag||'';
      if (btn.classList.contains('active')&&tag!=='') { btn.classList.remove('active'); onTagChange(''); }
      else { btns.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); onTagChange(tag); }
    });
  });
}
