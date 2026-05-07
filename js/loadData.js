/**
 * loadData.js — carga personas.json y legal.json con caché mejorado
 * Incluye: validación de datos, timestamps, fallback
 * 
 * FIX WEEK 1: Implementar cache-busting para invalidar datos automáticamente
 */
let _cachePersonas = null;
let _cacheLegal    = null;
let _cacheTime     = null;

// Validar estructura de persona
function validatePersona(p) {
  if (!p.id || !p.nombre) return false;
  if (!Array.isArray(p.tags)) p.tags = [];
  if (!Array.isArray(p.imagenes)) p.imagenes = [];
  if (!Array.isArray(p.videos)) p.videos = [];
  if (typeof p.links !== 'object') p.links = {};
  return true;
}

export async function loadPersonas() {
  // Caché en memoria (session)
  if (_cachePersonas && _cacheTime && (Date.now() - _cacheTime) < 3600000) {
    return _cachePersonas; // Válido por 1 hora
  }
  
  try {
    // FIX: Añadir cache-busting con timestamp para invalidar datos
    const cacheBuster = `?t=${Math.floor(Date.now() / 60000)}`; // Cambia cada minuto
    const r = await fetch(`data/personas.json${cacheBuster}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    let data = await r.json();
    
    // Validar cada persona
    if (Array.isArray(data)) {
      data = data.filter(validatePersona);
    } else {
      console.warn('[loadData] personas.json no es array');
      data = [];
    }
    
    _cachePersonas = data;
    _cacheTime = Date.now();
    return _cachePersonas;
  } catch(e) { 
    console.error('[loadData] personas:', e.message);
    // Fallback: retornar caché antiguo si existe
    if (_cachePersonas) return _cachePersonas;
    return [];
  }
}

export async function getPersonaById(id) {
  const p = await loadPersonas();
  return p.find(x => x.id === id) || null;
}

export async function getAllTags() {
  const p = await loadPersonas();
  const s = new Set();
  p.forEach(x => (x.tags||[]).forEach(t => s.add(t.toLowerCase())));
  return Array.from(s).sort();
}

export async function loadLegal() {
  if (_cacheLegal) return _cacheLegal;
  try {
    // FIX: Añadir cache-busting también para legal.json
    const cacheBuster = `?t=${Math.floor(Date.now() / 60000)}`;
    const r = await fetch(`data/legal.json${cacheBuster}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    _cacheLegal = await r.json();
    return _cacheLegal;
  } catch(e) { 
    console.error('[loadData] legal:', e.message);
    return null;
  }
}
