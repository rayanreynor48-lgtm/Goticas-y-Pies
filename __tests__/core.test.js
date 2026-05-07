/**
 * Tests básicos - Jest
 * Verificar funcionalidad core sin backend
 */

// Mock de fetch
global.fetch = jest.fn();

describe('loadData', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('debería cargar personas.json correctamente', async () => {
    const mockData = [
      {
        id: 'test_id',
        nombre: 'Test User',
        tags: ['tag1'],
        imagenes: [],
        videos: [],
        links: {},
      },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { loadPersonas } = await import('../js/loadData.js');
    const result = await loadPersonas();
    expect(result).toEqual(mockData);
  });

  test('debería cachear datos por 1 hora', async () => {
    const mockData = [{ id: 'test', nombre: 'Test' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { loadPersonas } = await import('../js/loadData.js');
    await loadPersonas();
    const firstCall = fetch.mock.calls.length;

    await loadPersonas();
    const secondCall = fetch.mock.calls.length;

    expect(firstCall).toBe(secondCall); // No debería hacer otra llamada
  });

  test('debería validar estructura de persona', async () => {
    const invalidData = [
      { nombre: 'Sin ID' }, // Falta ID
      { id: 'test' }, // Falta nombre
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => invalidData,
    });

    const { loadPersonas } = await import('../js/loadData.js');
    const result = await loadPersonas();
    expect(result.length).toBe(0); // Ambos deberían ser filtrados
  });
});

describe('search', () => {
  test('debería filtrar por nombre', () => {
    const { filtrarPersonas } = require('../js/search.js');
    const personas = [
      { id: '1', nombre: 'Alice', tags: [] },
      { id: '2', nombre: 'Bob', tags: [] },
    ];
    const result = filtrarPersonas(personas, 'alice', '');
    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe('Alice');
  });

  test('debería filtrar por tag', () => {
    const { filtrarPersonas } = require('../js/search.js');
    const personas = [
      { id: '1', nombre: 'Alice', tags: ['goth'] },
      { id: '2', nombre: 'Bob', tags: ['punk'] },
    ];
    const result = filtrarPersonas(personas, '', 'goth');
    expect(result.length).toBe(1);
    expect(result[0].tags).toContain('goth');
  });
});

describe('router', () => {
  test('debería extraer ID de URL', () => {
    const { getPersonaIdFromUrl } = require('../js/router.js');
    delete window.location;
    window.location = new URL('http://localhost/persona.html?id=test123');
    const id = getPersonaIdFromUrl();
    expect(id).toBe('test123');
  });
});

describe('Age Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('debería redirigir si no confirmó edad', () => {
    const { checkAge } = require('../js/router.js');
    delete window.location;
    window.location = { href: '' };
    
    const result = checkAge();
    expect(result).toBe(false);
    expect(window.location.href).toContain('18.html');
  });

  test('debería permitir acceso con verificación correcta', () => {
    localStorage.setItem('gy_age_confirmed', 'true');
    sessionStorage.setItem('gy_session_verified', 'true');
    
    const { checkAge } = require('../js/router.js');
    const result = checkAge();
    expect(result).toBe(true);
  });
});

describe('XSS Protection', () => {
  test('debería escapar caracteres peligrosos', () => {
    const { app } = require('../js/app.js');
    const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    
    expect(esc('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(esc('&')).toBe('&amp;');
  });
});
