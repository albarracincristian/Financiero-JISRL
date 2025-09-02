// Check if elements exist before adding event listeners
if (document.getElementById('btn')) {
    document.getElementById('btn').addEventListener('click', function() {
        document.getElementById('message').textContent = '¡Hola! Has hecho clic en el botón.';
    });
}

// Feriados functionality - only run if elements exist
if (document.getElementById('feriados-table')) {
    let feriados = JSON.parse(localStorage.getItem('feriados')) || [];

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function getEstado(dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const feriadoDate = new Date(dateStr);
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
                <td class="${estadoClass}">${estado}</td>
                <td><button onclick="deleteFeriado(${index})">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function addFeriado() {
        const name = document.getElementById('feriado-name').value.trim();
        const date = document.getElementById('feriado-date').value;
        if (name && date) {
            feriados.push({ name, date });
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
                            feriados.push({ date: parsedDate.toISOString().split('T')[0], name: descVal });
                        } else {
                            console.warn('Invalid date:', date);
                        }
                    }
                });
                localStorage.setItem('feriados', JSON.stringify(feriados));
                renderFeriados();
                alert('Feriados importados exitosamente.');
            };
            reader.readAsArrayBuffer(file);
        }
    });

    // Load feriados on page load
    renderFeriados();
}
