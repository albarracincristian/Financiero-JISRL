const express = require('express');
const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Obtener resumen del dashboard
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    // TODO: Implementar lógica real con base de datos
    const overview = {
      saldoActual: 125000.50,
      ingresosMes: 450000.00,
      egresosMes: 324999.50,
      flujoNeto: 125000.50,
      variacionMensual: 8.5, // porcentaje
      alertas: [
        {
          id: 1,
          tipo: 'warning',
          mensaje: 'Saldo bajo en cuenta corriente',
          fecha: new Date().toISOString()
        }
      ]
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen del dashboard',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/cash-flow-chart
// @desc    Obtener datos para gráfico de flujo de caja
// @access  Private
router.get('/cash-flow-chart', async (req, res) => {
  try {
    const { period = '30' } = req.query; // días

    // TODO: Implementar lógica real con base de datos
    const chartData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ingresos',
          data: [450000, 520000, 480000, 600000, 550000, 580000],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
          label: 'Egresos',
          data: [380000, 420000, 390000, 480000, 440000, 460000],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      ]
    };

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos del gráfico',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/expense-distribution
// @desc    Obtener distribución de gastos
// @access  Private
router.get('/expense-distribution', async (req, res) => {
  try {
    // TODO: Implementar lógica real con base de datos
    const distributionData = {
      labels: ['Proveedores', 'Nómina', 'Gastos Operativos', 'Impuestos', 'Marketing', 'Otros'],
      datasets: [{
        data: [45, 25, 15, 8, 4, 3],
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#f59e0b',
          '#10b981',
          '#8b5cf6',
          '#6b7280'
        ]
      }]
    };

    res.json({
      success: true,
      data: distributionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribución de gastos',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/recent-transactions
// @desc    Obtener transacciones recientes
// @access  Private
router.get('/recent-transactions', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // TODO: Implementar lógica real con base de datos
    const transactions = [
      {
        id: 1,
        fecha: '2024-01-15',
        descripcion: 'Venta productos enero',
        tipo: 'ingreso',
        monto: 125000.00,
        categoria: 'Ventas',
        cuenta: 'Banco Principal'
      },
      {
        id: 2,
        fecha: '2024-01-14',
        descripcion: 'Pago proveedor ABC',
        tipo: 'egreso',
        monto: -45000.00,
        categoria: 'Proveedores',
        cuenta: 'Banco Principal'
      },
      {
        id: 3,
        fecha: '2024-01-13',
        descripcion: 'Servicios públicos',
        tipo: 'egreso',
        monto: -8500.00,
        categoria: 'Gastos Operativos',
        cuenta: 'Banco Secundario'
      }
    ];

    res.json({
      success: true,
      data: transactions.slice(0, parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones recientes',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/kpis
// @desc    Obtener KPIs principales
// @access  Private
router.get('/kpis', async (req, res) => {
  try {
    // TODO: Implementar lógica real con base de datos
    const kpis = {
      liquidez: {
        valor: 2.5,
        variacion: 0.3,
        tendencia: 'up'
      },
      rentabilidad: {
        valor: 15.8,
        variacion: -1.2,
        tendencia: 'down'
      },
      rotacionInventario: {
        valor: 8.2,
        variacion: 0.5,
        tendencia: 'up'
      },
      diasCobranza: {
        valor: 35,
        variacion: -2,
        tendencia: 'up'
      }
    };

    res.json({
      success: true,
      data: kpis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener KPIs',
      error: error.message
    });
  }
});

module.exports = router;
