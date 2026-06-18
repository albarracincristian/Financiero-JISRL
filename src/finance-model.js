(function () {
    const STORAGE_KEY = 'finapp_financial_model_v1';
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    function clone(value) {
        return JSON.parse(JSON.stringify(value || {}));
    }

    function getSeed() {
        const seed = window.FINANCIAL_SEED || {};
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : clone(seed);
        } catch {
            return clone(seed);
        }
    }

    function saveModel(model) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(model)); } catch {}
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

    function addMonths(year, monthOneBased, offset) {
        const d = new Date(year, monthOneBased - 1 + offset, 1);
        return { year: d.getFullYear(), month: d.getMonth() + 1 };
    }

    function daysInMonth(year, monthOneBased) {
        return new Date(year, monthOneBased, 0).getDate();
    }

    function sumByDate(items, date, transform) {
        return (items || []).reduce((total, item) => {
            if (String(item.date).slice(0, 10) !== date) return total;
            const amount = Number(item.amount) || 0;
            return total + (transform ? transform(amount, item) : amount);
        }, 0);
    }

    function getScheduledAmount(model, date, group) {
        return (model.scheduledExpenses || []).reduce((total, item) => {
            if (item.group !== group) return total;
            const amount = Number(item.amount) || 0;
            const matchesCurrent = String(item.date).slice(0, 10) === date;
            const matchesNext = String(item.nextDate).slice(0, 10) === date;
            return total + (matchesCurrent || matchesNext ? amount : 0);
        }, 0);
    }

    function monthRows(model, year, monthOneBased, openingBalance) {
        const settings = model.settings || {};
        const holidays = new Set((model.holidays || []).map(item => String(item.date).slice(0, 10)));
        const weights = settings.weekdayWeights || {};
        const days = daysInMonth(year, monthOneBased);
        const baseRows = [];

        for (let day = 1; day <= days; day += 1) {
            const date = new Date(year, monthOneBased - 1, day);
            const dateKey = toYMD(date);
            const weekday = date.getDay();
            const isBusiness = weekday !== 0;
            const isHoliday = holidays.has(dateKey);
            const isOperational = isBusiness && !isHoliday;
            const weight = isOperational ? (Number(weights[String(weekday)]) || 0) : 0;
            baseRows.push({ date, dateKey, weekday, isBusiness, isHoliday, isOperational, weight });
        }

        const totalWeight = baseRows.reduce((total, row) => total + row.weight, 0);
        let balance = openingBalance;
        const rows = baseRows.map(row => {
            const normalizedWeight = row.isOperational && totalWeight ? row.weight / totalWeight : 0;
            const revenue = row.isOperational ? normalizedWeight * (Number(settings.monthlyRevenueBase) || 0) : 0;
            const credits = sumByDate(model.credits, row.dateKey, amount => amount * -1)
                + sumByDate(model.plannedCredits, row.dateKey);
            const salariales = getScheduledAmount(model, row.dateKey, 'salariales');
            const servicios = getScheduledAmount(model, row.dateKey, 'servicios');
            const honorarios = getScheduledAmount(model, row.dateKey, 'honorarios');
            const gastosGenerales = getScheduledAmount(model, row.dateKey, 'gastosGenerales');
            const impuestos = getScheduledAmount(model, row.dateKey, 'impuestos');
            const otros = getScheduledAmount(model, row.dateKey, 'otros');
            const compras = sumByDate(model.purchases, row.dateKey);
            const dailyFlow = revenue + credits - salariales - servicios - honorarios - gastosGenerales - impuestos - otros - compras;
            balance += dailyFlow;
            const risk = balance < 0 ? 'ALTO' : balance < (Number(settings.riskMediumThreshold) || 20000000) ? 'MEDIO' : 'BAJO';

            return {
                fecha: row.dateKey,
                dia: dayNames[row.weekday],
                esHabil: row.isBusiness,
                feriado: row.isHoliday,
                habilOperativo: row.isOperational,
                weight: row.weight,
                weightNorm: normalizedWeight,
                recaudacion: revenue,
                acreditaciones: credits,
                salariales,
                servicios,
                honorarios,
                gastosGenerales,
                impuestos,
                otros,
                compras,
                flujoDia: dailyFlow,
                saldoAcum: balance,
                riesgoSaldo: risk,
            };
        });

        const summary = rows.reduce((acc, row) => {
            acc.recaudacion += row.recaudacion;
            acc.acreditaciones += row.acreditaciones;
            acc.salariales += row.salariales;
            acc.servicios += row.servicios;
            acc.honorarios += row.honorarios;
            acc.gastosGenerales += row.gastosGenerales;
            acc.impuestos += row.impuestos;
            acc.otros += row.otros;
            acc.compras += row.compras;
            acc.flujoDia += row.flujoDia;
            acc.saldoAcum = row.saldoAcum;
            return acc;
        }, {
            label: monthNames[monthOneBased - 1],
            recaudacion: 0,
            acreditaciones: 0,
            salariales: 0,
            servicios: 0,
            honorarios: 0,
            gastosGenerales: 0,
            impuestos: 0,
            otros: 0,
            compras: 0,
            flujoDia: 0,
            saldoAcum: openingBalance,
        });

        return { rows, summary, closingBalance: balance };
    }

    function buildCashFlow(model) {
        const settings = model.settings || {};
        const year = Number(settings.year) || new Date().getFullYear();
        const month = Number(settings.month) || (new Date().getMonth() + 1);
        let openingBalance = Number(settings.initialBalance) || 0;
        const output = [];

        for (let offset = 0; offset < 2; offset += 1) {
            const period = addMonths(year, month, offset);
            const result = monthRows(model, period.year, period.month, openingBalance);
            output.push(...result.rows, { type: 'summary', ...result.summary }, { type: 'spacer' });
            openingBalance = result.closingBalance;
        }

        return output;
    }

    function moneyClass(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return '';
    }

    function riskClass(risk) {
        return `risk-${String(risk || '').toLowerCase()}`;
    }

    function formatMoney(value) {
        const num = Number(value) || 0;
        if (Math.abs(num) < 0.005) return '';
        return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatCurrency(value) {
        return (Number(value) || 0).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function formatPercent(value) {
        const num = Number(value) || 0;
        if (!num) return '';
        return `${(num * 100).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`;
    }

    function boolText(value) {
        return value ? 'VERDADERO' : 'FALSO';
    }

    function compactDate(ymd) {
        const date = parseLocalDate(ymd);
        if (!date) return ymd || '';
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
    }

    function td(text, className) {
        const cell = document.createElement('td');
        cell.textContent = text;
        if (className) cell.className = className;
        return cell;
    }

    function moneyCell(value, extraClass) {
        return td(formatMoney(value), ['number', moneyClass(value), extraClass].filter(Boolean).join(' '));
    }

    function operationalOut(row) {
        return (Number(row.servicios) || 0)
            + (Number(row.honorarios) || 0)
            + (Number(row.gastosGenerales) || 0)
            + (Number(row.otros) || 0);
    }

    function renderKpis(rows) {
        const container = document.getElementById('treasury-kpis');
        if (!container) return;
        const dailyRows = rows.filter(row => !row.type);
        const summaries = rows.filter(row => row.type === 'summary');
        const finalSummary = summaries[summaries.length - 1];
        const minBalanceRow = dailyRows.reduce((min, row) => !min || row.saldoAcum < min.saldoAcum ? row : min, null);
        const highRiskDays = dailyRows.filter(row => row.riesgoSaldo === 'ALTO').length;
        const totalInflows = summaries.reduce((total, row) => total + row.recaudacion + row.acreditaciones, 0);
        const totalPurchases = summaries.reduce((total, row) => total + row.compras, 0);
        const kpis = [
            { label: 'Saldo proyectado', value: formatCurrency(finalSummary ? finalSummary.saldoAcum : 0), tone: finalSummary && finalSummary.saldoAcum < 0 ? 'bad' : 'good' },
            { label: 'Piso de caja', value: formatCurrency(minBalanceRow ? minBalanceRow.saldoAcum : 0), hint: minBalanceRow ? compactDate(minBalanceRow.fecha) : '', tone: minBalanceRow && minBalanceRow.saldoAcum < 0 ? 'bad' : 'warn' },
            { label: 'Días riesgo alto', value: String(highRiskDays), tone: highRiskDays ? 'bad' : 'good' },
            { label: 'Ingresos previstos', value: formatCurrency(totalInflows), tone: 'good' },
            { label: 'Compras previstas', value: formatCurrency(totalPurchases), tone: totalPurchases ? 'warn' : '' },
        ];

        container.innerHTML = '';
        kpis.forEach(item => {
            const card = document.createElement('div');
            card.className = `treasury-kpi ${item.tone || ''}`;
            card.innerHTML = `<span>${item.label}</span><strong>${item.value}</strong>${item.hint ? `<small>${item.hint}</small>` : ''}`;
            container.appendChild(card);
        });
    }

    function renderMonthCards(rows) {
        const container = document.getElementById('treasury-months');
        if (!container) return;
        container.innerHTML = '';
        rows.filter(row => row.type === 'summary').forEach(row => {
            const card = document.createElement('div');
            const outflows = row.salariales + row.servicios + row.honorarios + row.gastosGenerales + row.impuestos + row.otros + row.compras;
            card.className = 'treasury-month-card';
            card.innerHTML = `
                <div>
                    <span>${row.label}</span>
                    <strong class="${moneyClass(row.saldoAcum)}">${formatCurrency(row.saldoAcum)}</strong>
                </div>
                <dl>
                    <dt>Ingresos</dt><dd>${formatCurrency(row.recaudacion + row.acreditaciones)}</dd>
                    <dt>Egresos</dt><dd>${formatCurrency(outflows)}</dd>
                    <dt>Flujo</dt><dd class="${moneyClass(row.flujoDia)}">${formatCurrency(row.flujoDia)}</dd>
                </dl>
            `;
            container.appendChild(card);
        });
    }

    function renderCashFlowTable() {
        const table = document.querySelector('#flujo-caja .tesoreria-table');
        if (!table || !window.FINANCIAL_SEED) return;
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const model = getSeed();
        const rows = buildCashFlow(model);
        tbody.innerHTML = '';
        renderKpis(rows);
        renderMonthCards(rows);

        rows.forEach(row => {
            const tr = document.createElement('tr');
            if (row.type === 'spacer') {
                tr.className = 'month-spacer';
                tr.appendChild(td('', ''));
                tr.firstChild.colSpan = 11;
                tbody.appendChild(tr);
                return;
            }

            if (row.type === 'summary') {
                tr.className = 'month-summary';
                const operativos = row.servicios + row.honorarios + row.gastosGenerales + row.otros;
                tr.append(
                    td(row.label, ''),
                    td('', ''),
                    moneyCell(row.recaudacion, 'summary-cell'),
                    moneyCell(row.acreditaciones, 'summary-cell'),
                    moneyCell(row.salariales, 'summary-cell'),
                    moneyCell(operativos, 'summary-cell'),
                    moneyCell(row.impuestos, 'summary-cell'),
                    moneyCell(row.compras, 'summary-cell'),
                    moneyCell(row.flujoDia, 'summary-cell'),
                    moneyCell(row.saldoAcum, 'summary-cell'),
                    td('', 'summary-cell')
                );
                tbody.appendChild(tr);
                return;
            }

            tr.append(
                td(compactDate(row.fecha), 'date-cell'),
                td(row.dia, ''),
                moneyCell(row.recaudacion),
                moneyCell(row.acreditaciones),
                moneyCell(row.salariales),
                moneyCell(operationalOut(row)),
                moneyCell(row.impuestos),
                moneyCell(row.compras),
                moneyCell(row.flujoDia),
                moneyCell(row.saldoAcum, riskClass(row.riesgoSaldo)),
                td(row.riesgoSaldo, `${riskClass(row.riesgoSaldo)} center`)
            );
            tbody.appendChild(tr);
        });

        saveModel(model);
    }

    window.FinanceModel = {
        getSeed,
        saveModel,
        buildCashFlow,
        renderCashFlowTable,
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCashFlowTable);
    } else {
        renderCashFlowTable();
    }
})();
