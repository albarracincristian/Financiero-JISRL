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




// === Fechas calculadas (robusto, Edge-friendly) ===
// Render dinámico + edición (concepto y fecha) con overrides persistentes
window.addEventListener('load', function () {
    if (!document.getElementById('op-fechas')) return;
    const tbody = document.getElementById('op-fechas-body');
    const table = document.getElementById('op-fechas-table');
    if (!tbody || !table) return;

    const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const toDMY = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    const parseDMY = (s) => { const m=String(s||'').match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/); if(!m) return null; const dt=new Date(+m[3],+m[2]-1,+m[1]); return isNaN(dt.getTime())?null:dt; };
    const ymdToDate = (ymd) => { const p=String(ymd||'').split('-'); if(p.length!==3) return null; const dt=new Date(+p[0],+p[1]-1,+p[2]); return isNaN(dt.getTime())?null:dt; };

    // Feriados desde localStorage
    const feriados = (()=>{ try { return JSON.parse(localStorage.getItem('feriados')||'[]')||[]; } catch { return []; } })();
    const feriadosSet = new Set(feriados.map(f=>String(f.date)));
    // Sábados son hábiles; Domingos NO; excluir feriados
    const isBusiness = (d) => { const wd=d.getDay(); if (wd===0) return false; return !feriadosSet.has(toYMD(d)); };
    const dim = (y,m)=> new Date(y,m+1,0).getDate();
    const lastBusinessInRange = (y,m,a,b)=>{ const end=Math.min(dim(y,m),b), start=Math.max(1,a); for(let d=end; d>=start; d--){const dt=new Date(y,m,d); if(isBusiness(dt)) return dt;} for(let d=start-1; d>=1; d--){const dt=new Date(y,m,d); if(isBusiness(dt)) return dt;} return new Date(y,m,1); };
    const lastBusinessOnOrBefore = (y,m,day)=> lastBusinessInRange(y,m,1,day);
    const adjustToBusiness = (d)=>{ const dt=new Date(d.getFullYear(),d.getMonth(),d.getDate()); while(!isBusiness(dt)) dt.setDate(dt.getDate()-1); return dt; };
    const nextMonthBusinessFrom = (d)=>{ const yN=d.getMonth()===11? d.getFullYear()+1 : d.getFullYear(); const mN=(d.getMonth()+1)%12; const day=Math.min(d.getDate(), dim(yN,mN)); return adjustToBusiness(new Date(yN,mN,day)); };

    // Reglas con IDs estables
    const rules = [
        { id:'f931',  label:'Sueldos + F931 (últ. hábil 1-10)', type:'range', a:1, b:10 },
        { id:'sicore',label:'SICORE (últ. hábil 9-11)',          type:'range', a:9, b:11 },
        { id:'serv',  label:'Servicios (últ. hábil 1-10)',       type:'range', a:1, b:10 },
        { id:'hon',   label:'Honorarios (últ. hábil 10-20)',     type:'range', a:10, b:20 },
        { id:'gg',    label:'Gastos Generales (últ. hábil 1-10)',type:'range', a:1, b:10 },
        { id:'iva',   label:'Impuesto IVA (últ. hábil 15-18)',   type:'range', a:15, b:18 },
        { id:'iibb',  label:'IIBB/Percepciones (últ. hábil 8-11)',type:'range',a:8, b:11 },
        { id:'gan',   label:'Ganancia (últ. hábil 8-11)',        type:'range', a:8, b:11 },
        { id:'otros', label:'Otros (últ. hábil 1-10)',           type:'range', a:1, b:10 },
        { id:'seg',   label:'Seguros (últ. hábil 25-27)',        type:'range', a:25,b:27 },
        { id:'comb1', label:'Combustible 1 (últ. hábil ≤10)',    type:'before',day:10 },
        { id:'comb2', label:'Combustible 2 (últ. hábil ≤25)',    type:'before',day:25 },
        { id:'rentas',label:'Rentas Automotor (últ. hábil ≤15)', type:'before',day:15 },
        { id:'nc',    label:'NC (últ. hábil 11-16)',             type:'range', a:11,b:16 }
    ];

    // Overrides persistentes
    const OKEY='op_fechas_overrides_v1';
    const loadO = ()=>{ try { return JSON.parse(localStorage.getItem(OKEY)||'{}')||{}; } catch { return {}; } };
    const saveO = (o)=>{ try { localStorage.setItem(OKEY, JSON.stringify(o||{})); } catch {} };

    const today=new Date(); today.setHours(0,0,0,0);
    const y=today.getFullYear(); const m=today.getMonth();
    const yNext=m===11? y+1 : y; const mNext=(m+1)%12;

    function computeRows(){
        const o = loadO();
        return rules.map(r=>{
            let d1 = r.type==='range' ? lastBusinessInRange(y,m,r.a,r.b) : lastBusinessOnOrBefore(y,m,r.day);
            let d2 = r.type==='range' ? lastBusinessInRange(yNext,mNext,r.a,r.b) : lastBusinessOnOrBefore(yNext,mNext,r.day);
            const e = o[r.id] || {};
            const label = e.label || r.label;
            if (e.d1) { const t=ymdToDate(e.d1); if (t) d1=adjustToBusiness(t); d2 = nextMonthBusinessFrom(d1); }
            else if (e.d2) { const t=ymdToDate(e.d2); if (t) d2=adjustToBusiness(t); }
            return { id:r.id, label, d1, d2 };
        }).sort((a,b)=> a.d1 - b.d1);
    }

    function render(){
        // Si alguien ya llenó (fallback anterior), no duplicar
        if (tbody.children.length>0) return;
        tbody.innerHTML='';
        const rows = computeRows();
        rows.forEach(({id,label,d1,d2})=>{
            const tr=document.createElement('tr');
            const td0=document.createElement('td'); const span=document.createElement('span'); span.className='concept-text'; span.textContent=label; const b=document.createElement('button'); b.className='edit-fecha'; b.textContent='✎'; b.title='Editar'; b.dataset.id=id; td0.appendChild(span); td0.appendChild(b);
            const td1=document.createElement('td'); td1.textContent=toDMY(d1);
            const td2=document.createElement('td'); td2.textContent=toDMY(d2);
            tr.appendChild(td0); tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr);
        });
    }

    render();

    if (!table.__editUnified) {
        table.addEventListener('click', (ev)=>{
            const btn=ev.target.closest && ev.target.closest('.edit-fecha'); if(!btn) return;
            const id=btn.dataset.id; const row=btn.closest('tr');
            const curLabel=row.querySelector('.concept-text')?.textContent.trim()||'';
            const curD1=row.cells[1].textContent.trim();
            const newLabel=prompt('Editar concepto:',curLabel) ?? curLabel;
            const newD1s=prompt('Editar Fecha (dd/mm/aaaa):',curD1)||''; const nd1=parseDMY(newD1s); if(!nd1) return;
            const adj1=adjustToBusiness(nd1); const adj2=nextMonthBusinessFrom(adj1);
            const o=loadO(); const e=o[id]||{}; if(newLabel && newLabel.trim()) e.label=newLabel.trim(); e.d1=toYMD(adj1); e.d2=toYMD(adj2); o[id]=e; saveO(o);
            // Re-renderear base limpia
            tbody.innerHTML=''; render();
        });
        table.__editUnified=true;
    }
});
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
    const toDMY = (d) => { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${day}/${m}/${y}`; };
    // Feriados: usar los guardados en localStorage\n    let feriadosSet = new Set();\n    try { const arr = JSON.parse(localStorage.getItem('feriados') || '[]'); arr.forEach(f=>{ if(f&&f.date) feriadosSet.add(String(f.date)); }); } catch {}\n    const isBusiness = (d) => { const wd=d.getDay(); if(wd===0||wd===6) return false; return !feriadosSet.has(toYMD(d)); };\n    const lastBusinessInRange = (y,m,a,b)=>{ const dim=(yy,mm)=> new Date(yy,mm+1,0).getDate(); const end=Math.min(dim(y,m),b), start=Math.max(1,a); for(let d=end; d>=start; d--){ const dt=new Date(y,m,d); if(isBusiness(dt)) return dt;} for(let d=start-1; d>=1; d--){ const dt=new Date(y,m,d); if(isBusiness(dt)) return dt;} return new Date(y,m,1); };\n    const lastBusinessOnOrBefore = (y,m,day)=> lastBusinessInRange(y,m,1,day);

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
    today.setHours(0,0,0,0);
    const y = today.getFullYear();
    const m = today.getMonth(); // 0-based
    const yNext = m === 11 ? y + 1 : y;
    const mNext = (m + 1) % 12;

    const tbody = document.getElementById('op-fechas-body');
    if (tbody) {
        tbody.innerHTML = '';
        const rows = rules.map(r => {
            let d1, d2;
            if (r.type === 'range') {
                d1 = lastBusinessInRange(y, m, r.a, r.b);
                d2 = lastBusinessInRange(yNext, mNext, r.a, r.b);
            } else {
                d1 = lastBusinessOnOrBefore(y, m, r.day);
                d2 = lastBusinessOnOrBefore(yNext, mNext, r.day);
            }
            const tip = (r.type === 'range')
                ? `Cálculo: último día hábil entre ${String(r.a).padStart(2,'0')}-${String(r.b).padStart(2,'0')} (excluye fines de semana y feriados).`
                : `Cálculo: último día hábil no posterior al día ${String(r.day).padStart(2,'0')} (excluye fines de semana y feriados).`;
            return { label: r.label, d1, d2, tip };
        }).sort((a,b) => a.d1 - b.d1);

        rows.forEach(({label, d1, d2, tip}) => {
            const tr = document.createElement('tr');
            const isPast = d1 < today;
            const cls = isPast ? 'date-past' : 'date-upcoming';
            tr.innerHTML = `<td title="${tip}">${label}</td><td class="${cls}">${toDMY(d1)}</td><td>${toDMY(d2)}</td>`;
            tbody.appendChild(tr);
        });
    }
}



