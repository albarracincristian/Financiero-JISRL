(function () {
    const MODEL_KEY = 'finapp_financial_model_v1';
    const purchaseTypes = ['FACTURA', 'PAGO'];
    const creditTypes = ['NOTA DE CREDITO', 'ACREDITACION', 'DEVOLUCION', 'PAGO'];
    const fallbackProviders = ['PEPSICO', 'PERNOD RICARD', 'PRONOVELTIES', 'GEORGALOS', 'RPB BAGGIO', 'RPB VARIOS', 'CTA CTE', 'BANCO', 'OTROS'];

    function clone(value) {
        return JSON.parse(JSON.stringify(value || {}));
    }

    function getModel() {
        if (window.FinanceModel && typeof window.FinanceModel.getSeed === 'function') {
            return window.FinanceModel.getSeed();
        }
        return clone(window.FINANCIAL_SEED);
    }

    function saveModel(model) {
        try { localStorage.setItem(MODEL_KEY, JSON.stringify(model)); } catch {}
    }

    function uid(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }

    function parseNumber(value) {
        if (value == null || value === '') return 0;
        if (typeof value === 'number') return value;
        let text = String(value).trim().replace(/\$/g, '').replace(/\s/g, '');
        text = text.replace(/\./g, '').replace(/,/g, '.');
        const parsed = Number(text);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function toYMD(value) {
        if (!value) return '';
        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
        }
        const text = String(value).trim();
        const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
        const dmy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
        if (dmy) return `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`;
        return text.slice(0, 10);
    }

    function formatDate(value) {
        const ymd = toYMD(value);
        if (!ymd) return '';
        const [y, m, d] = ymd.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('es-AR');
    }

    function money(value) {
        return Math.abs(Number(value) || 0).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function normalizeModel(model) {
        model.purchases = (model.purchases || []).map(item => ({
            id: item.id || uid('purchase'),
            date: toYMD(item.date),
            provider: item.provider || '',
            type: item.type || 'FACTURA',
            receptionDate: toYMD(item.receptionDate),
            amount: Math.abs(Number(item.amount) || 0),
            note: item.note || '',
        }));
        model.credits = (model.credits || []).map(item => ({
            id: item.id || uid('credit'),
            date: toYMD(item.date),
            provider: item.provider || '',
            type: item.type || 'NOTA DE CREDITO',
            creditedDate: toYMD(item.creditedDate || item.date),
            amount: -Math.abs(Number(item.amount) || 0),
            note: item.note || '',
        }));
        return model;
    }

    function sorted(items) {
        return [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    }

    function providers(model) {
        const names = new Set(fallbackProviders);
        [...(model.purchases || []), ...(model.credits || [])].forEach(item => {
            if (item.provider) names.add(item.provider);
        });
        return [...names].sort((a, b) => a.localeCompare(b));
    }

    function setTypeOptions(kind) {
        const type = document.getElementById('panel-type');
        if (!type) return;
        const values = kind === 'credit' ? creditTypes : purchaseTypes;
        type.innerHTML = values.map(value => `<option value="${value}">${value}</option>`).join('');
    }

    function currentKind() {
        return document.querySelector('input[name="panel-kind"]:checked')?.value || 'purchase';
    }

    function syncKindUI() {
        const kind = currentKind();
        setTypeOptions(kind);
        document.getElementById('panel-reception-wrap').hidden = kind === 'credit';
        document.getElementById('panel-credited-wrap').hidden = kind !== 'credit';
    }

    function renderProviders(model) {
        const list = document.getElementById('panel-providers');
        if (!list) return;
        list.innerHTML = providers(model).map(name => `<option value="${name}"></option>`).join('');
    }

    function renderSummary(model) {
        const container = document.getElementById('panel-summary');
        if (!container) return;
        const purchases = (model.purchases || []).reduce((sum, item) => sum + Math.abs(Number(item.amount) || 0), 0);
        const credits = (model.credits || []).reduce((sum, item) => sum + Math.abs(Number(item.amount) || 0), 0);
        container.innerHTML = `
            <div><span>Compras cargadas</span><strong>${model.purchases.length}</strong><small>${money(purchases)}</small></div>
            <div><span>Acreditaciones / NC</span><strong>${model.credits.length}</strong><small>${money(credits)}</small></div>
            <div><span>Impacto neto</span><strong>${money(credits - purchases)}</strong><small>Ingresos menos compras</small></div>
        `;
    }

    function actionButtons(kind, id) {
        return `<div class="table-actions">
            <button class="action-btn edit" type="button" data-kind="${kind}" data-id="${id}" title="Editar">Editar</button>
            <button class="action-btn del" type="button" data-kind="${kind}" data-id="${id}" title="Eliminar">Borrar</button>
        </div>`;
    }

    function renderTables(model) {
        const purchasesBody = document.querySelector('#panel-purchases-table tbody');
        const creditsBody = document.querySelector('#panel-credits-table tbody');
        if (purchasesBody) {
            purchasesBody.innerHTML = sorted(model.purchases || []).map(item => `
                <tr>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.provider || ''}</td>
                    <td>${item.type || ''}</td>
                    <td>${formatDate(item.receptionDate)}</td>
                    <td class="right money negative">${money(item.amount)}</td>
                    <td class="note-cell">${item.note || ''}</td>
                    <td>${actionButtons('purchase', item.id)}</td>
                </tr>
            `).join('');
        }
        if (creditsBody) {
            creditsBody.innerHTML = sorted(model.credits || []).map(item => `
                <tr>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.provider || ''}</td>
                    <td>${item.type || ''}</td>
                    <td>${formatDate(item.creditedDate || item.date)}</td>
                    <td class="right money positive">${money(item.amount)}</td>
                    <td class="note-cell">${item.note || ''}</td>
                    <td>${actionButtons('credit', item.id)}</td>
                </tr>
            `).join('');
        }
    }

    function clearForm() {
        document.getElementById('panel-edit-id').value = '';
        document.getElementById('panel-entry-form').reset();
        document.querySelector('input[name="panel-kind"][value="purchase"]').checked = true;
        syncKindUI();
        document.getElementById('panel-submit').textContent = 'Agregar';
    }

    function render(model) {
        renderProviders(model);
        renderSummary(model);
        renderTables(model);
        saveModel(model);
    }

    function findItem(model, kind, id) {
        const collection = kind === 'credit' ? model.credits : model.purchases;
        return collection.find(item => item.id === id);
    }

    function fillForm(kind, item) {
        document.querySelector(`input[name="panel-kind"][value="${kind}"]`).checked = true;
        syncKindUI();
        document.getElementById('panel-edit-id').value = item.id;
        document.getElementById('panel-date').value = toYMD(item.date);
        document.getElementById('panel-provider').value = item.provider || '';
        document.getElementById('panel-type').value = item.type || '';
        document.getElementById('panel-amount').value = Math.abs(Number(item.amount) || 0);
        document.getElementById('panel-note').value = item.note || '';
        document.getElementById('panel-reception-date').value = toYMD(item.receptionDate);
        document.getElementById('panel-credited-date').value = toYMD(item.creditedDate || item.date);
        document.getElementById('panel-submit').textContent = 'Guardar';
    }

    function upsertFromForm(model) {
        const kind = currentKind();
        const id = document.getElementById('panel-edit-id').value;
        const base = {
            id: id || uid(kind),
            date: toYMD(document.getElementById('panel-date').value),
            provider: document.getElementById('panel-provider').value.trim().toUpperCase(),
            type: document.getElementById('panel-type').value,
            amount: Math.abs(parseNumber(document.getElementById('panel-amount').value)),
            note: document.getElementById('panel-note').value.trim(),
        };
        if (!base.date || !base.provider || !base.type || !base.amount) {
            alert('Completá fecha, proveedor, tipo e importe.');
            return false;
        }

        if (kind === 'credit') {
            const row = { ...base, amount: -Math.abs(base.amount), creditedDate: toYMD(document.getElementById('panel-credited-date').value || base.date) };
            model.credits = model.credits || [];
            const index = model.credits.findIndex(item => item.id === row.id);
            if (index >= 0) model.credits[index] = row;
            else model.credits.push(row);
        } else {
            const row = { ...base, receptionDate: toYMD(document.getElementById('panel-reception-date').value || base.date) };
            model.purchases = model.purchases || [];
            const index = model.purchases.findIndex(item => item.id === row.id);
            if (index >= 0) model.purchases[index] = row;
            else model.purchases.push(row);
        }
        return true;
    }

    function deleteItem(model, kind, id) {
        if (kind === 'credit') model.credits = (model.credits || []).filter(item => item.id !== id);
        else model.purchases = (model.purchases || []).filter(item => item.id !== id);
    }

    function exportWorkbook(model) {
        const rows = [
            ['', 'EGRESOS - COMPRAS', '', '', '', '', '', '', '', '', 'INGRESOS - ACREDITACIONES', '', '', '', '', ''],
            ['', 'Pagar / Cobrar', 'Proveedor', 'Tipo', 'Fecha Recepcion', '$$$ ARS', 'Nota', 'Fecha Orden Compra', 'Lead time', '', 'Fecha Acreditada', 'Proveedor', 'Tipo Comprobante', 'Fecha Acreditada', '$$$ ARS', 'Nota'],
        ];
        const max = Math.max(model.purchases.length, model.credits.length);
        for (let i = 0; i < max; i += 1) {
            const p = model.purchases[i] || {};
            const c = model.credits[i] || {};
            rows.push([
                '',
                p.date || '',
                p.provider || '',
                p.type || '',
                p.receptionDate || '',
                p.amount || '',
                p.note || '',
                '',
                '',
                '',
                c.date || '',
                c.provider || '',
                c.type || '',
                c.creditedDate || c.date || '',
                c.amount || '',
                c.note || '',
            ]);
        }
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ingresos y Egreso');
        XLSX.writeFile(wb, `ingresos-egresos-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    function importWorkbook(model, file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const workbook = XLSX.read(new Uint8Array(event.target.result), { type: 'array', cellDates: true });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
            const purchases = [];
            const credits = [];
            rows.slice(2).forEach(row => {
                if (row[1] || row[2] || row[5]) {
                    purchases.push({
                        id: uid('purchase'),
                        date: toYMD(row[1]),
                        provider: String(row[2] || '').trim().toUpperCase(),
                        type: String(row[3] || 'FACTURA').trim().toUpperCase(),
                        receptionDate: toYMD(row[4]),
                        amount: Math.abs(parseNumber(row[5])),
                        note: String(row[6] || '').trim(),
                    });
                }
                if (row[10] || row[11] || row[14]) {
                    credits.push({
                        id: uid('credit'),
                        date: toYMD(row[10]),
                        provider: String(row[11] || '').trim().toUpperCase(),
                        type: String(row[12] || 'NOTA DE CREDITO').trim().toUpperCase(),
                        creditedDate: toYMD(row[13] || row[10]),
                        amount: -Math.abs(parseNumber(row[14])),
                        note: String(row[15] || '').trim(),
                    });
                }
            });
            model.purchases = purchases.filter(item => item.date && item.provider && item.amount);
            model.credits = credits.filter(item => item.date && item.provider && item.amount);
            render(model);
            alert('Datos importados.');
        };
        reader.readAsArrayBuffer(file);
    }

    function init() {
        if (!document.getElementById('panel')) return;
        document.querySelectorAll('nav a[href]').forEach(link => {
            if ((link.getAttribute('href') || '').endsWith('index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        let model = normalizeModel(getModel());
        syncKindUI();
        render(model);

        document.querySelectorAll('input[name="panel-kind"]').forEach(input => {
            input.addEventListener('change', syncKindUI);
        });

        document.getElementById('panel-entry-form').addEventListener('submit', event => {
            event.preventDefault();
            if (upsertFromForm(model)) {
                render(model);
                clearForm();
            }
        });

        document.getElementById('panel-cancel').addEventListener('click', clearForm);

        document.getElementById('panel').addEventListener('click', event => {
            const edit = event.target.closest('button.action-btn.edit[data-id]');
            const del = event.target.closest('button.action-btn.del[data-id]');
            if (!edit && !del) return;
            const button = edit || del;
            const kind = button.dataset.kind;
            const id = button.dataset.id;
            if (edit) {
                const item = findItem(model, kind, id);
                if (item) fillForm(kind, item);
                return;
            }
            if (confirm('¿Eliminar este registro?')) {
                deleteItem(model, kind, id);
                render(model);
            }
        });

        document.getElementById('panel-export').addEventListener('click', () => exportWorkbook(model));
        document.getElementById('panel-import').addEventListener('click', () => document.getElementById('panel-file').click());
        document.getElementById('panel-file').addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) importWorkbook(model, file);
            event.target.value = '';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
