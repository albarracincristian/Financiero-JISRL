// Abrir automáticamente el selector de fecha en clic, pero permitir tipeo
(function(){
  const onReady = () => {
    const inputs = document.querySelectorAll('input[type="date"]');
    inputs.forEach((el) => {
      const openPicker = () => {
        try {
          if (typeof el.showPicker === 'function') { el.showPicker(); }
          else { el.focus(); el.click(); }
        } catch {}
      };
      el.addEventListener('mousedown', () => { setTimeout(openPicker, 0); });
      el.addEventListener('keydown', (ev) => {
        if ((ev.key === 'Enter' || ev.key === ' ') && typeof el.showPicker === 'function' && el.id !== 'feriado-date') {
          ev.preventDefault();
          el.showPicker();
        }
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady); else onReady();
})();
// Check if elements exist before adding event listeners
if (document.getElementById('btn')) {
    document.getElementById('btn').addEventListener('click', function() {
        document.getElementById('message').textContent = 'Â¡Hola! Has hecho clic en el botÃ³n.';
    });
}

// Feriados functionality - only run if elements exist
if (document.getElementById('feriados-table')) {
    let feriados = JSON.parse(localStorage.getItem('feriados')) || [];

    // Mantener el color del input date consistente con el text input
    const dateInput = document.getElementById('feriado-date');
    if (dateInput) {
        const syncDateAppearance = () => {
            if (dateInput.value) {
                dateInput.classList.add('has-value');
            } else {
                dateInput.classList.remove('has-value');
            }
        };
        dateInput.addEventListener('input', syncDateAppearance);
        dateInput.addEventListener('change', syncDateAppearance);
        dateInput.addEventListener('blur', syncDateAppearance);
        syncDateAppearance();
    }

    // Helpers para fechas en horario local (evitar desfase por UTC)
    function parseLocalDate(ymd) {
        if (!ymd) return null;
        const parts = ymd.split('-');
        if (parts.length !== 3) return null;
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
        return new Date(y, m - 1, d);
    }

    function toYMD(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function formatDate(dateStr) {
        const date = parseLocalDate(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function getEstado(dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const feriadoDate = parseLocalDate(dateStr);
        if (feriadoDate < today) {
            return 'Pasado';
        } else {
            return 'Pr\u00F3ximo';
        }
    }

    function renderFeriados() {
        const tbody = document.querySelector('#feriados-table tbody');
        tbody.innerHTML = '';
        feriados.forEach((feriado, index) => {
            const tr = document.createElement('tr');
            const estado = getEstado(feriado.date);
            const estadoClass = estado === 'Pasado' ? 'estado-pasado' : 'estado-proximo';
            tr.innerHTML = `
                <td>${formatDate(feriado.date)}</td>
                <td>${feriado.name}</td>
                <td><span class="estado-chip ${estadoClass}">${estado}</span></td>
                <td>
                    <button class="icon-btn danger" title="Eliminar" aria-label="Eliminar" onclick="deleteFeriado(${index})">
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                            <path fill="currentColor" d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1zm1 2h4V4h-4v1zM7 10h2v9H7v-9zm4 0h2v9h-2v-9zm4 0h2v9h-2v-9z"/>
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function sortFeriados() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        feriados.sort((a, b) => {
            const da = parseLocalDate(a.date);
            const db = parseLocalDate(b.date);
            const aPast = da < today;
            const bPast = db < today;
            if (aPast !== bPast) return aPast ? 1 : -1; // PrÃ³ximos primero
            return da - db; // Dentro de cada grupo, ascendente por fecha
        });
    }

    function addFeriado() {
        const name = document.getElementById('feriado-name').value.trim();
        const date = document.getElementById('feriado-date').value;
        if (name && date) {
            feriados.push({ name, date });
            // Reordenar por fecha al agregar
            sortFeriados();
            localStorage.setItem('feriados', JSON.stringify(feriados));
            document.getElementById('feriado-name').value = '';
            document.getElementById('feriado-date').value = '';
            renderFeriados();
        } else {
            alert('Por favor, ingresa el nombre y la fecha del feriado.');
        }
    }

    function deleteFeriado(index) {
        feriados.splice(index, 1);
        localStorage.setItem('feriados', JSON.stringify(feriados));
        renderFeriados();
    }

    document.getElementById('add-feriado-btn').addEventListener('click', addFeriado);
    // Permitir agregar con Enter desde nombre o fecha
    ['feriado-name','feriado-date'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('keydown', function(ev) {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                addFeriado();
            }
        });
    });

    // Import Excel functionality
    document.getElementById('import-excel-btn').addEventListener('click', function() {
        document.getElementById('excel-file').click();
    });

    document.getElementById('excel-file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
                jsonData.forEach(row => {
                    let dateVal = row['Fecha'] || row[0];
                    let descVal = row['Descripcion'] || row[1];
                    if (dateVal && descVal) {
                        let date = dateVal;
                        let parsedDate = null;
                        if (date instanceof Date && !isNaN(date.getTime())) {
                            parsedDate = date;
                        } else if (typeof date === 'string') {
                            parsedDate = new Date(date);
                            if (isNaN(parsedDate.getTime())) {
                                parsedDate = null;
                            }
                        }
                        if (parsedDate) {
                            feriados.push({ date: toYMD(parsedDate), name: descVal });
                        } else {
                            console.warn('Invalid date:', date);
                        }
                    }
                });
                // Ordenar por fecha antes de guardar y renderizar
                sortFeriados();
                localStorage.setItem('feriados', JSON.stringify(feriados));
                renderFeriados();
                alert('Feriados importados exitosamente.');
            };
            reader.readAsArrayBuffer(file);
        }
    });

    // Load feriados on page load (ordenados)
    sortFeriados();
    renderFeriados();

    // Export Excel functionality
    document.getElementById('export-excel-btn').addEventListener('click', function() {
        const data = [['Fecha', 'Descripci\u00F3n']];
        feriados.forEach(feriado => {
            data.push([formatDate(feriado.date), feriado.name]);
        });
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Feriados');
        XLSX.writeFile(wb, 'feriados.xlsx');
    });
}




// --- Operaciones: Fechas calculadas (mes actual y siguiente) ---
if (document.getElementById('op-fechas')) {
    // Utilidades de fecha
    const toYMD = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };
    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    // Feriados: usar los guardados en localStorage
    let feriadosSet = new Set();
    try {
        const arr = JSON.parse(localStorage.getItem('feriados') || '[]');
        arr.forEach(f => { if (f && f.date) feriadosSet.add(String(f.date)); });
    } catch {}
    const isBusiness = (d) => {
        const wd = d.getDay(); // 0=dom,6=sab
        if (wd === 0 || wd === 6) return false;
        return !feriadosSet.has(toYMD(d));
    };
    const lastBusinessInRange = (y, m, startDay, endDay) => {
        const dim = daysInMonth(y, m);
        const start = Math.max(1, startDay);
        const end = Math.min(dim, endDay);
        for (let d = end; d >= start; d--) {
            const dt = new Date(y, m, d);
            if (isBusiness(dt)) return dt;
        }
        // Fallback: buscar hacia atrás desde start-1
        for (let d = start - 1; d >= 1; d--) {
            const dt = new Date(y, m, d);
            if (isBusiness(dt)) return dt;
        }
        return new Date(y, m, 1); // último recurso
    };
    const lastBusinessOnOrBefore = (y, m, day) => lastBusinessInRange(y, m, 1, day);

    const rules = [
        { label: 'Sueldos + F931 (últ. hábil 1-10)', type: 'range', a: 1, b: 10 },
        { label: 'SICORE (últ. hábil 9-11)', type: 'range', a: 9, b: 11 },
        { label: 'Servicios (últ. hábil 1-10)', type: 'range', a: 1, b: 10 },
        { label: 'Honorarios (últ. hábil 10-20)', type: 'range', a: 10, b: 20 },
        { label: 'Gastos Generales (últ. hábil 1-10)', type: 'range', a: 1, b: 10 },
        { label: 'Impuesto IVA (últ. hábil 15-18)', type: 'range', a: 15, b: 18 },
        { label: 'IIBB/Percepciones (últ. hábil 8-11)', type: 'range', a: 8, b: 11 },
        { label: 'Ganancia (últ. hábil 8-11)', type: 'range', a: 8, b: 11 },
        { label: 'Otros (últ. hábil 1-10)', type: 'range', a: 1, b: 10 },
        { label: 'Seguros (últ. hábil 15-27)', type: 'range', a: 15, b: 27 },
        { label: 'Combustible 1 (últ. hábil ≤15)', type: 'before', day: 15 },
        { label: 'Combustible 2 (últ. hábil ≤25)', type: 'before', day: 25 },
        { label: 'Rentas Automotor (últ. hábil ≤15)', type: 'before', day: 15 },
        { label: 'NC (últ. hábil 11-16)', type: 'range', a: 11, b: 16 },
    ];

    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth(); // 0-based
    const yNext = m === 11 ? y + 1 : y;
    const mNext = (m + 1) % 12;

    const tbody = document.getElementById('op-fechas-body');
    if (tbody) {
        tbody.innerHTML = '';
        rules.forEach(r => {
            let d1, d2;
            if (r.type === 'range') {
                d1 = lastBusinessInRange(y, m, r.a, r.b);
                d2 = lastBusinessInRange(yNext, mNext, r.a, r.b);
            } else {
                d1 = lastBusinessOnOrBefore(y, m, r.day);
                d2 = lastBusinessOnOrBefore(yNext, mNext, r.day);
            }
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.label}</td><td>${toYMD(d1)}</td><td>${toYMD(d2)}</td>`;
            tbody.appendChild(tr);
        });
    }
}
