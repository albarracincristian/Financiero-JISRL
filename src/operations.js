(function () {
    const MODEL_KEY = 'finapp_financial_model_v1';
    const dayMs = 24 * 60 * 60 * 1000;

    const expenseLabels = {
        sueldos: 'Salariales - Sueldos',
        sicore: 'Salariales - SICORE',
        servicios: 'Servicios',
        honorarios: 'Honorarios',
        generales: 'Gastos Generales',
        iibb: 'IIBB / Percepciones',
        otros: 'Otros',
        ganancias: 'Imp. Ganancias',
        iva: 'Imp. IVA',
        combustible1: 'Combustible 1era Quincena',
        combustible2: 'Combustible 2da Quincena',
        seguros: 'Seguros',
        rentas: 'Rentas Patentes Automotor',
    };

    const expenseByRubro = {
        sueldos: 'Sueldos+F931',
        sicore: 'SICORE',
        servicios: 'Servicios',
        honorarios: 'Honorarios',
        generales: 'Gastos Generales',
        iibb: 'Impuesto IIBB',
        otros: 'Otros',
        ganancias: 'Imp Ganancias',
        iva: 'IVA',
        combustible1: 'Combustibles',
        combustible2: 'Combustibles',
        seguros: 'Seguros',
        rentas: 'Rentas (automotor)',
    };

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

    function resetModel() {
        try { localStorage.removeItem(MODEL_KEY); } catch {}
        return clone(window.FINANCIAL_SEED);
    }

    function parseLocalDate(ymd) {
        if (!ymd) return null;
        const parts = String(ymd).slice(0, 10).split('-').map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    function toYMD(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function formatDate(ymd) {
        const date = parseLocalDate(ymd);
        if (!date) return '';
        return date.toLocaleDateString('es-AR');
    }

    function daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function addMonths(year, month, offset) {
        const date = new Date(year, month - 1 + offset, 1);
        return { year: date.getFullYear(), month: date.getMonth() + 1 };
    }

    function holidaySet(model) {
        return new Set((model.holidays || []).map(item => String(item.date).slice(0, 10)));
    }

    function isBusinessDay(date, holidays) {
        return date.getDay() !== 0 && !holidays.has(toYMD(date));
    }

    function workdayBefore(year, month, day, holidays) {
        const lastDay = daysInMonth(year, month);
        const date = new Date(year, month - 1, Math.min(day, lastDay));
        while (!isBusinessDay(date, holidays)) date.setDate(date.getDate() - 1);
        return date;
    }

    function networkDays(start, end, holidays) {
        if (!start || !end) return 0;
        let from = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const to = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        if (from > to) return 0;
        let count = 0;
        while (from <= to) {
            if (isBusinessDay(from, holidays)) count += 1;
            from = new Date(from.getTime() + dayMs);
        }
        return count;
    }

    function num(value) {
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        const text = String(value ?? '').trim();
        const normalized = text.includes(',')
            ? text.replace(/\./g, '').replace(',', '.')
            : text;
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function average(values) {
        const numbers = values.map(num).filter(value => Number.isFinite(value) && value !== 0);
        if (!numbers.length) return 0;
        return numbers.reduce((total, value) => total + value, 0) / numbers.length;
    }

    function includedBudgetMonthIndexes(model) {
        const month = num(model.settings && model.settings.month) || new Date().getMonth() + 1;
        return [
            { index: 12, month: 1 },
            { index: 13, month: 2 },
            { index: 14, month: 3 },
            { index: 15, month: 4 },
            { index: 16, month: 5 },
            { index: 17, month: 6, sac: true },
            { index: 18, month: 7 },
            { index: 19, month: 8 },
            { index: 20, month: 9 },
            { index: 21, month: 10 },
            { index: 22, month: 11 },
            { index: 23, month: 12, sac: true },
        ].filter(col => !col.sac || col.month === month).map(col => col.index);
    }

    function budgetRows(model) {
        return (model.budget && model.budget.rows) || [];
    }

    function budgetPromedio(model, rubro) {
        const row = budgetRows(model).find(item => String(item[11] || '').trim() === rubro);
        if (!row) return 0;
        return average(includedBudgetMonthIndexes(model).map(index => row[index]));
    }

    function syncFormulaSettings(model) {
        const settings = model.settings || {};
        const rows = budgetRows(model);
        settings.monthlyKgBase = average(rows.slice(0, 7).map(row => row[1])) / 1000;
        settings.monthlyRevenueBase = average(rows.slice(0, 12).map(row => row[7]));
        settings.initialBalance = num((window.FINANCIAL_SEED && window.FINANCIAL_SEED.settings && window.FINANCIAL_SEED.settings.initialBalance) || settings.initialBalance);
        model.settings = settings;

        (model.scheduledExpenses || []).forEach(expense => {
            const rubro = expenseByRubro[expense.id];
            if (!rubro) return;
            const value = budgetPromedio(model, rubro);
            if (expense.id === 'combustible1' || expense.id === 'combustible2') {
                expense.amount = value / 2;
            } else {
                expense.amount = value;
            }
        });
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function money(value) {
        return num(value).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function number(value, digits = 2) {
        return num(value).toLocaleString('es-AR', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        });
    }

    function plainNumber(value, digits = 3) {
        const rounded = Number(num(value).toFixed(digits));
        return String(rounded);
    }

    function getExpense(model, id) {
        return (model.scheduledExpenses || []).find(item => item.id === id) || null;
    }

    function calcDates(model) {
        syncFormulaSettings(model);
        const settings = model.settings || {};
        const year = num(settings.year) || new Date().getFullYear();
        const month = num(settings.month) || (new Date().getMonth() + 1);
        const next = addMonths(year, month, 1);
        const holidays = holidaySet(model);

        const rules = [
            ['sueldos', 'Fecha Sueldos + F931 (últ. hábil 1-06)', 6, 6],
            ['sicore', 'Fecha SICORE (últ. hábil 9-11)', 12, 12],
            ['servicios', 'Fecha Servicios (últ. hábil 1-10)', 11, 10],
            ['honorarios', 'Fecha Honorarios (últ. hábil 10-20)', 21, 21],
            ['generales', 'Fecha Gastos Generales (últ. hábil 1-10)', 11, 10],
            ['iva', 'Fecha Impuesto IVA (últ. hábil 15-18)', 19, 18],
            ['iibb', 'Fecha IIBB / Percepciones (últ. hábil 8-11)', 12, 12],
            ['ganancias', 'Fecha Ganancia (últ. hábil 8-11)', 12, 12],
            ['otros', 'Fecha Otros (últ. hábil 1-10)', 11, 10],
            ['seguros', 'Fecha Seguros (últ. hábil 25-27)', 28, 28],
            ['combustible1', 'Fecha Combustible 1 (últ. hábil -10)', 11, 11],
            ['combustible2', 'Fecha Combustible 2 (últ. hábil -25)', 26, 26],
            ['rentas', 'Fecha Rentas Automotor (últ. hábil -15)', 16, 16],
            ['nc', 'Fecha NC (últ. hábil en 11-16)', 16, 16],
        ];

        return rules.map(([id, label, currentDay, nextDay]) => {
            const date = workdayBefore(year, month, currentDay, holidays);
            const nextDate = workdayBefore(next.year, next.month, nextDay, holidays);
            return { id, label, date: toYMD(date), nextDate: toYMD(nextDate) };
        });
    }

    function syncCalculatedDates(model) {
        const dates = calcDates(model);
        dates.forEach(row => {
            if (row.id === 'nc') {
                model.plannedCredits = model.plannedCredits || [];
                let nc = model.plannedCredits.find(item => item.id === 'nc');
                if (!nc) {
                    nc = { id: 'nc', label: 'NC programada', amount: num(model.settings && model.settings.ncAmount) };
                    model.plannedCredits.push(nc);
                }
                nc.currentDate = row.date;
                nc.date = row.nextDate;
                nc.amount = num(model.settings && model.settings.ncAmount);
                return;
            }
            const expense = getExpense(model, row.id);
            if (expense) {
                expense.date = row.date;
                expense.nextDate = row.nextDate;
            }
        });
        return dates;
    }

    function updateFromInputs(model) {
        const settings = model.settings || {};
        document.querySelectorAll('[data-op-field]').forEach(input => {
            settings[input.dataset.opField] = num(input.value);
        });
        model.settings = settings;
    }

    function updateSetting(model, field, value) {
        model.settings = model.settings || {};
        model.settings[field] = num(value);
    }

    function fillInputs(model) {
        const settings = model.settings || {};
        document.querySelectorAll('[data-op-field]').forEach(input => {
            input.value = settings[input.dataset.opField] ?? '';
        });
    }

    function calculations(model) {
        const settings = model.settings || {};
        const dates = syncCalculatedDates(model);
        const year = num(settings.year) || new Date().getFullYear();
        const month = num(settings.month) || (new Date().getMonth() + 1);
        const holidays = holidaySet(model);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month - 1, daysInMonth(year, month));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const businessDays = networkDays(start, end, holidays);
        const workedDays = networkDays(start, today, holidays);
        const remainingDays = businessDays - workedDays;
        const dailyTn = businessDays ? num(settings.monthlyKgBase) / businessDays : 0;
        const stockClose = num(settings.currentStockTn) - (remainingDays * dailyTn);
        const stockIdeal = num(settings.coverageDays) * dailyTn;
        const missingStock = num(settings.currentStockTn) - stockIdeal - (remainingDays * dailyTn);
        const purchasePriceTn = num(settings.monthlyRevenueBase) / 1.21 / Math.max(num(settings.monthlyKgBase), 0.000001);
        const totalCostTarget = (num(settings.monthlyRevenueBase) / 1.48 / Math.max(num(settings.monthlyKgBase), 0.000001)) * num(settings.targetWithdrawalTn);
        const missingStockArs = (num(settings.monthlyRevenueBase) / 1.21 / Math.max(num(settings.monthlyKgBase), 0.000001)) * missingStock;
        const tnVsObjective = -num(settings.targetWithdrawalTn) + num(settings.withdrawnToDateTn) + missingStock;
        const remainingSalesTn = remainingDays * dailyTn;
        const dailyRevenue = num(settings.monthlyRevenueBase) / 26;
        const equipmentCost = purchasePriceTn * num(settings.equipmentCapacityTn);
        const daysToCoverEquipment = dailyRevenue ? equipmentCost / dailyRevenue : 0;
        const coveragePerEquipment = dailyTn ? num(settings.equipmentCapacityTn) / dailyTn : 0;

        return {
            dates,
            start,
            end,
            workedDays,
            businessDays,
            remainingDays,
            dailyTn,
            stockClose,
            stockIdeal,
            missingStock,
            missingStockArs,
            tnVsObjective,
            tnVsObjectiveArs: tnVsObjective * purchasePriceTn,
            remainingSalesTn,
            totalCostTarget,
            dailyRevenue,
            purchasePriceTn,
            equipmentCost,
            daysToCoverEquipment,
            coveragePerEquipment,
        };
    }

    function renderKeyValues(calc) {
        setText('op-saldo-inicial', money(window.currentModel?.settings?.initialBalance));
        setText('op-dias-stock', number(num(window.currentModel?.settings?.currentStockTn) / Math.max(calc.dailyTn, 0.000001), 2));
        setText('op-stock-cierre', number(calc.stockClose, 3));
        setText('op-stock-ideal', number(calc.stockIdeal, 3));
        setText('op-falta-stock', number(calc.missingStock, 3));
        setText('op-ars-stock-ideal', money(calc.missingStockArs));
        setText('op-tn-vs-obj', number(calc.tnVsObjective, 3));
        setText('op-ars-vs-obj', money(calc.tnVsObjectiveArs));
        setText('op-fecha-inicio', calc.start.toLocaleDateString('es-AR'));
        setText('op-fecha-fin', calc.end.toLocaleDateString('es-AR'));
        setText('op-dias-trabajados', number(calc.workedDays, 0));
        setText('op-dias-laborales', number(calc.businessDays, 0));
        setText('op-dias-restantes', number(calc.remainingDays, 0));
        setText('op-tn-restantes', number(calc.remainingSalesTn, 3));
    }

    function renderTable(tbodyId, rows) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            const name = document.createElement('td');
            const value = document.createElement('td');
            name.textContent = row.label;
            value.className = 'right';
            if (row.editable) {
                const input = document.createElement('input');
                input.type = 'number';
                input.step = row.step || '0.01';
                input.value = plainNumber(row.value, row.digits ?? 2);
                if (row.setting) input.dataset.settingField = row.setting;
                value.appendChild(input);
            } else {
                value.textContent = row.value;
            }
            tr.append(name, value);
            tbody.appendChild(tr);
        });
    }

    function renderParameters(model, calc) {
        const settings = model.settings || {};
        const weights = settings.weekdayWeights || {};
        const rows = [
            { label: 'KG/Lts base mensual (prom KG/Lts_Mensual)', value: number(settings.monthlyKgBase, 3) },
            { label: 'ARS base mensual (prom ARS_Mensual)', value: money(settings.monthlyRevenueBase) },
            { label: 'Costo total por OBJ Retiro', value: money(calc.totalCostTarget) },
            { label: 'Capacidad por equipo (ton)', value: settings.equipmentCapacityTn, editable: true, setting: 'equipmentCapacityTn', step: '0.01' },
            { label: 'Peso Lunes', value: weights['1'], editable: true, setting: 'weekdayWeights.1', step: '0.01' },
            { label: 'Peso Martes', value: weights['2'], editable: true, setting: 'weekdayWeights.2', step: '0.01' },
            { label: 'Peso Miércoles', value: weights['3'], editable: true, setting: 'weekdayWeights.3', step: '0.01' },
            { label: 'Peso Jueves', value: weights['4'], editable: true, setting: 'weekdayWeights.4', step: '0.01' },
            { label: 'Peso Viernes', value: weights['5'], editable: true, setting: 'weekdayWeights.5', step: '0.01' },
            { label: 'Peso Sábado', value: weights['6'], editable: true, setting: 'weekdayWeights.6', step: '0.01' },
            { label: 'Peso Domingo', value: weights['0'], editable: true, setting: 'weekdayWeights.0', step: '0.01' },
            { label: 'NC monto (+)', value: settings.ncAmount, editable: true, setting: 'ncAmount', step: '0.01' },
            ...Object.keys(expenseLabels).map(id => {
                const expense = getExpense(model, id);
                return { id, label: expenseLabels[id], value: expense ? money(expense.amount) : money(0) };
            }),
            { label: 'Recaudación diaria estimada (ARS)', value: money(calc.dailyRevenue) },
            { label: 'Precio compra por tonelada', value: money(calc.purchasePriceTn) },
            { label: 'Costo por equipo (ARS)', value: money(calc.equipmentCost) },
        ];
        renderTable('op-parametros-body', rows);
    }

    function renderVariables(calc) {
        renderTable('op-variables-body', [
            { label: 'Lead time L (días) Camión Completo', value: '5' },
            { label: 'Lead time L (días) Camión Parcial', value: '10' },
            { label: 'Ventas diarias promedio (ton/día)', value: number(calc.dailyTn, 3) },
            { label: 'Desvío estándar ventas diarias (ton/día)', value: number(0.045, 3) },
            { label: 'Término de pago (días) Cta Cte proveedor', value: '14' },
            { label: 'Días de recaudación para cubrir 1 equipo', value: number(calc.daysToCoverEquipment, 2) },
            { label: 'Cobertura por equipo (días)', value: number(calc.coveragePerEquipment, 2) },
        ]);
    }

    function renderDates(dates) {
        const tbody = document.getElementById('op-fechas-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        dates.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.label}</td><td>${formatDate(row.date)}</td><td>${formatDate(row.nextDate)}</td>`;
            tbody.appendChild(tr);
        });
    }

    function bindSettingInputs(model) {
        document.querySelectorAll('[data-setting-field]').forEach(input => {
            input.addEventListener('input', () => {
                const field = input.dataset.settingField;
                if (field && field.startsWith('weekdayWeights.')) {
                    const key = field.split('.')[1];
                    model.settings = model.settings || {};
                    model.settings.weekdayWeights = model.settings.weekdayWeights || {};
                    model.settings.weekdayWeights[key] = num(input.value);
                } else {
                    updateSetting(model, field, input.value);
                }
                saveModel(model);
            });
            input.addEventListener('change', () => {
                render(model, false);
            });
        });
    }

    function render(model, fill = true) {
        window.currentModel = model;
        if (fill) fillInputs(model);
        const calc = calculations(model);
        renderKeyValues(calc);
        renderParameters(model, calc);
        renderDates(calc.dates);
        renderVariables(calc);
        bindSettingInputs(model);
        saveModel(model);
    }

    function init() {
        if (!document.getElementById('input') || !window.FINANCIAL_SEED) return;
        document.querySelectorAll('nav a[href]').forEach(link => {
            const href = (link.getAttribute('href') || '').split('/').pop();
            if (href === 'input.html') {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        let model = getModel();
        render(model);

        document.querySelectorAll('[data-op-field]').forEach(input => {
            input.addEventListener('input', () => {
                updateFromInputs(model);
                render(model, false);
            });
        });

        const saveButton = document.getElementById('op-save');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                updateFromInputs(model);
                render(model, false);
            });
        }

        const resetButton = document.getElementById('op-reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                model = resetModel();
                render(model);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
