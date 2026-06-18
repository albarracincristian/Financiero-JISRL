(function () {
    const MODEL_KEY = 'finapp_financial_model_v1';
    const opsColumns = [
        { index: 1, label: 'KG PEPSICO SELL OUT', type: 'number' },
        { index: 2, label: 'KG PEPSICO SELL IN', type: 'number' },
        { index: 3, label: 'Stock INICIAL', type: 'number' },
        { index: 4, label: 'Días Stock INICIAL', type: 'number', computed: true },
        { index: 5, label: 'Stock Real', type: 'number' },
        { index: 6, label: 'Días Stock FIN', type: 'number', computed: true },
        { index: 7, label: 'ARS TOTAL J&I', type: 'money' },
        { index: 8, label: 'Sell Out $$$ PEP', type: 'money' },
        { index: 9, label: 'Sell IN $$$ PEP', type: 'money' },
    ];
    const monthColumns = [
        { index: 12, label: 'ENE', month: 1 },
        { index: 13, label: 'FEB', month: 2 },
        { index: 14, label: 'MAR', month: 3 },
        { index: 15, label: 'ABR', month: 4 },
        { index: 16, label: 'MAY', month: 5 },
        { index: 17, label: 'JUN+SAC', month: 6, sac: true },
        { index: 18, label: 'JUL', month: 7 },
        { index: 19, label: 'AGO', month: 8 },
        { index: 20, label: 'SEPT', month: 9 },
        { index: 21, label: 'OCT', month: 10 },
        { index: 22, label: 'NOV', month: 11 },
        { index: 23, label: 'DIC+SAC', month: 12, sac: true },
    ];
    const expenseIds = {
        'Sueldos+F931': 'sueldos',
        'SICORE': 'sicore',
        'Servicios': 'servicios',
        'Honorarios': 'honorarios',
        'Gastos Generales': 'generales',
        'Impuesto IIBB': 'iibb',
        'Otros': 'otros',
        'Imp Ganancias': 'ganancias',
        'Seguros': 'seguros',
        'Combustibles': 'combustible',
        'IVA': 'iva',
        'Rentas (automotor)': 'rentas',
    };
    const viewConfig = {
        ops: {
            title: 'Datos mensuales operativos',
            copy: 'Equivale a columnas A:J de Data Entry.',
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
        expenses: {
            title: 'Rubros mensuales',
            copy: 'Valores por rubro y promedio usado para alimentar el flujo.',
            columns: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        },
    };
    let activeView = 'ops';
    const fullHeaders = [
        'Mes',
        'KG PEPSICO SELL OUT',
        'KG PEPSICO SELL IN',
        'Stock INICIAL',
        'Dias Stock INICIAL',
        'Stock Real',
        'Dias Stock FIN',
        'ARS TOTAL J&I',
        'Sell Out $$$ PEP',
        'Sell IN $$$ PEP',
        '',
        'Rubro',
        'ENE',
        'FEB',
        'MAR',
        'ABR',
        'MAY',
        'JUN+SAC',
        'JUL',
        'AGO',
        'SEPT',
        'OCT',
        'NOV',
        'DIC+SAC',
        'Promedio',
    ];

    function clone(value) {
        return JSON.parse(JSON.stringify(value || {}));
    }

    function getModel() {
        if (window.FinanceModel && typeof window.FinanceModel.getSeed === 'function') return window.FinanceModel.getSeed();
        return clone(window.FINANCIAL_SEED);
    }

    function saveModel(model) {
        try { localStorage.setItem(MODEL_KEY, JSON.stringify(model)); } catch {}
    }

    function num(value) {
        if (value == null || value === '') return 0;
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        const text = String(value).trim();
        const normalized = text.includes(',')
            ? text.replace(/\./g, '').replace(',', '.')
            : text;
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function fmt(value, type = 'number') {
        const n = num(value);
        if (!n) return '';
        if (type === 'money') {
            return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return n.toLocaleString('es-AR', { maximumFractionDigits: 3 });
    }

    function inputValue(value) {
        const n = num(value);
        return n ? String(Number(n.toFixed(3))) : '';
    }

    function budgetRows(model) {
        model.budget = model.budget || {};
        model.budget.headers = model.budget.headers || [];
        model.budget.rows = model.budget.rows || clone(window.FINANCIAL_SEED.budget.rows);
        return model.budget.rows;
    }

    function currentMonth(model) {
        return num(model.settings && model.settings.month) || new Date().getMonth() + 1;
    }

    function includedMonthColumns(model) {
        const month = currentMonth(model);
        return monthColumns.filter(col => {
            if (col.sac && col.month !== month) return false;
            return true;
        });
    }

    function average(values) {
        const numbers = values.map(num).filter(value => Number.isFinite(value) && value !== 0);
        if (!numbers.length) return 0;
        return numbers.reduce((total, value) => total + value, 0) / numbers.length;
    }

    function averageForExpense(row, model) {
        return average(includedMonthColumns(model).map(col => row[col.index]));
    }

    function averageForOps(rows, columnIndex, model) {
        const opsRows = rows.slice(0, 12);
        if (columnIndex === 1 || columnIndex === 7) {
            return average(opsRows.map(row => row[columnIndex]));
        }
        return average(opsRows.map(row => row[columnIndex]));
    }

    function findExpenseRow(rows, rubro) {
        return rows.find(row => String(row[11] || '').trim() === rubro);
    }

    function setExpense(model, id, amount) {
        const expenses = model.scheduledExpenses || [];
        if (id === 'combustible') {
            ['combustible1', 'combustible2'].forEach(partId => {
                const item = expenses.find(exp => exp.id === partId);
                if (item) item.amount = amount / 2;
            });
            return;
        }
        const item = expenses.find(exp => exp.id === id);
        if (item) item.amount = amount;
    }

    function recalcModel(model) {
        const rows = budgetRows(model);
        const settings = model.settings || {};
        settings.monthlyKgBase = averageForOps(rows, 1, model) / 1000;
        settings.monthlyRevenueBase = averageForOps(rows, 7, model);
        model.settings = settings;

        rows.forEach(row => {
            row[4] = num(row[3]) / 180;
            row[6] = num(row[5]) / 180;
        });

        rows.forEach(row => {
            if (!row[11]) return;
            const rubro = String(row[11]).trim();
            const avg = averageForExpense(row, model);
            row[24] = avg;
            const id = expenseIds[rubro];
            if (id) setExpense(model, id, avg);
        });
    }

    function isFullCellComputed(rowIndex, colIndex) {
        if (colIndex === 4 || colIndex === 6 || colIndex === 24) return true;
        if (rowIndex >= 12 && colIndex >= 12) return true;
        return false;
    }

    function isFullCellEditable(rowIndex, colIndex) {
        if (isFullCellComputed(rowIndex, colIndex)) return false;
        if (colIndex === 0 || colIndex === 10 || colIndex === 11) return false;
        return true;
    }

    function renderSummary(model) {
        const container = document.getElementById('budget-summary');
        if (!container) return;
        const month = currentMonth(model);
        const monthLabel = monthColumns.find(col => col.month === month)?.label || month;
        const settings = model.settings || {};
        container.innerHTML = `
            <div><span>Mes operativo</span><strong>${monthLabel}</strong><small>Define regla SAC</small></div>
            <div><span>KG/Lts base</span><strong>${fmt((settings.monthlyKgBase || 0) * 1000)}</strong><small>Promedio Data Entry</small></div>
            <div><span>ARS base mensual</span><strong>${fmt(settings.monthlyRevenueBase, 'money')}</strong><small>Alimenta Tesorería</small></div>
        `;
    }

    function renderFull(model) {
        const rows = budgetRows(model);
        const table = document.getElementById('budget-full-table');
        if (!table) return;
        const config = viewConfig[activeView] || viewConfig.ops;
        document.getElementById('budget-view-title').textContent = config.title;
        document.getElementById('budget-view-copy').textContent = config.copy;
        table.querySelector('thead').innerHTML = `<tr>${config.columns.map(index => `<th>${fullHeaders[index] || String.fromCharCode(65 + index)}</th>`).join('')}</tr>`;
        table.querySelector('tbody').innerHTML = rows.map((row, rowIndex) => `
            <tr>
                ${config.columns.map(colIndex => {
                    const editable = isFullCellEditable(rowIndex, colIndex);
                    const computed = isFullCellComputed(rowIndex, colIndex);
                    const value = row[colIndex] ?? '';
                    if (!editable) {
                        const displayType = colIndex >= 7 || colIndex >= 12 ? 'money' : 'number';
                        const display = typeof value === 'number' ? fmt(value, displayType) : value;
                        return `<td class="${computed ? 'computed-cell' : ''} ${colIndex === 17 || colIndex === 23 ? 'sac-column' : ''}">${display || ''}</td>`;
                    }
                    return `<td class="${colIndex === 17 || colIndex === 23 ? 'sac-column' : ''}"><input class="budget-input" data-section="full" data-row="${rowIndex}" data-col="${colIndex}" type="${colIndex === 0 || colIndex === 11 ? 'text' : 'number'}" step="0.01" value="${inputValue(value)}"></td>`;
                }).join('')}
            </tr>
        `).join('');
    }

    function render(model) {
        recalcModel(model);
        renderSummary(model);
        renderFull(model);
        saveModel(model);
    }

    function handleEdit(model, event) {
        const input = event.target.closest('input.budget-input');
        if (!input || input.readOnly) return;
        const rows = budgetRows(model);
        const row = rows[Number(input.dataset.row)];
        const col = Number(input.dataset.col);
        row[col] = input.type === 'text' ? input.value : num(input.value);
        render(model);
    }

    function exportWorkbook(model) {
        const rows = budgetRows(model);
        const output = [];
        output.push(['Mes', ...opsColumns.map(col => col.label), '', 'Rubro', ...monthColumns.map(col => col.label), 'Promedio']);
        for (let i = 0; i < 12; i += 1) {
            const op = rows[i] || [];
            const exp = rows[i] || [];
            output.push([
                op[0] || '',
                ...opsColumns.map(col => op[col.index] || ''),
                '',
                exp[11] || '',
                ...monthColumns.map(col => exp[col.index] || ''),
                exp[24] || '',
            ]);
        }
        const ws = XLSX.utils.aoa_to_sheet(output);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data Entry');
        XLSX.writeFile(wb, `data-entry-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    function init() {
        if (!document.getElementById('data-entry') || !window.FINANCIAL_SEED) return;
        document.querySelectorAll('nav a[href]').forEach(link => {
            if ((link.getAttribute('href') || '').endsWith('data-entry.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        let model = getModel();
        render(model);

        document.getElementById('data-entry').addEventListener('change', event => handleEdit(model, event));
        document.querySelectorAll('[data-budget-filter]').forEach(button => {
            button.addEventListener('click', () => {
                activeView = button.dataset.budgetFilter || 'ops';
                document.querySelectorAll('[data-budget-filter]').forEach(btn => btn.classList.toggle('active', btn === button));
                render(model);
            });
        });
        document.getElementById('budget-export').addEventListener('click', () => exportWorkbook(model));
        document.getElementById('budget-reset').addEventListener('click', () => {
            model.budget = clone(window.FINANCIAL_SEED.budget);
            render(model);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
