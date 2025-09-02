document.getElementById('btn').addEventListener('click', function() {
    document.getElementById('message').textContent = '¡Hola! Has hecho clic en el botón.';
});

// Feriados functionality
let feriados = JSON.parse(localStorage.getItem('feriados')) || [];

function renderFeriados() {
    const tbody = document.querySelector('#feriados-table tbody');
    tbody.innerHTML = '';
    feriados.forEach((feriado, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${feriado.date}</td>
            <td>${feriado.name}</td>
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
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // Assume first row is headers: Fecha, Descripción
            jsonData.shift(); // Remove header
            jsonData.forEach(row => {
                if (row[0] && row[1]) {
                    feriados.push({ date: row[0], name: row[1] });
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
