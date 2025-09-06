// Check if elements exist before adding event listeners
if (document.getElementById('btn')) {
    document.getElementById('btn').addEventListener('click', function() {
        document.getElementById('message').textContent = '¡Hola! Has hecho clic en el botón.';
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
            return 'Próximo';
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
                <td><button onclick="deleteFeriado(${index})">Eliminar</button></td>
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
            if (aPast !== bPast) return aPast ? 1 : -1; // Próximos primero
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
                    let descVal = row['Descripción'] || row[1];
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
        const data = [['Fecha', 'Descripción']];
        feriados.forEach(feriado => {
            data.push([formatDate(feriado.date), feriado.name]);
        });
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Feriados');
        XLSX.writeFile(wb, 'feriados.xlsx');
    });
}
