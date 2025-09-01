const express = require('express');
const router = express.Router();

// @route   GET /api/accounts
// @desc    Obtener todas las cuentas
// @access  Private
router.get('/', async (req, res) => {
  try {
    // TODO: Implementar lógica real con base de datos
    const accounts = [
      {
        id: 1,
        nombre: 'Efectivo - Caja Principal',
        tipo: 'efectivo',
        saldoActual: 25000.00,
        saldoInicial: 20000.00,
        activa: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        nombre: 'Banco Nación - Cuenta Corriente',
        tipo: 'cuenta-corriente',
        saldoActual: 150000.00,
        saldoInicial: 100000.00,
        activa: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        nombre: 'Banco Santander - Caja de Ahorro',
        tipo: 'caja-ahorro',
        saldoActual: 75000.00,
        saldoInicial: 50000.00,
        activa: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cuentas',
      error: error.message
    });
  }
});

// @route   POST /api/accounts
// @desc    Crear nueva cuenta
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { nombre, tipo, saldoInicial } = req.body;

    // Validaciones
    if (!nombre || !tipo || saldoInicial === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, tipo y saldo inicial son obligatorios'
      });
    }

    const tiposValidos = ['efectivo', 'cuenta-corriente', 'caja-ahorro', 'plazo-fijo', 'tarjeta-credito'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de cuenta inválido'
      });
    }

    // TODO: Implementar lógica real con base de datos
    const newAccount = {
      id: Date.now(),
      nombre,
      tipo,
      saldoActual: parseFloat(saldoInicial),
      saldoInicial: parseFloat(saldoInicial),
      activa: true,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Cuenta creada exitosamente',
      data: newAccount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear cuenta',
      error: error.message
    });
  }
});

// @route   GET /api/accounts/:id
// @desc    Obtener cuenta por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const account = {
      id: parseInt(id),
      nombre: 'Efectivo - Caja Principal',
      tipo: 'efectivo',
      saldoActual: 25000.00,
      saldoInicial: 20000.00,
      activa: true,
      createdAt: '2024-01-01T00:00:00Z'
    };

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Cuenta no encontrada'
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cuenta',
      error: error.message
    });
  }
});

// @route   PUT /api/accounts/:id
// @desc    Actualizar cuenta
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, activa } = req.body;

    // TODO: Implementar lógica real con base de datos
    const updatedAccount = {
      id: parseInt(id),
      nombre,
      tipo,
      activa,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Cuenta actualizada exitosamente',
      data: updatedAccount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cuenta',
      error: error.message
    });
  }
});

// @route   DELETE /api/accounts/:id
// @desc    Eliminar cuenta
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Verificar que no tenga transacciones asociadas
    
    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cuenta',
      error: error.message
    });
  }
});

// @route   GET /api/accounts/:id/balance
// @desc    Obtener saldo de cuenta
// @access  Private
router.get('/:id/balance', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const balance = {
      accountId: parseInt(id),
      saldoActual: 25000.00,
      saldoInicial: 20000.00,
      totalIngresos: 150000.00,
      totalEgresos: 145000.00,
      ultimaActualizacion: new Date().toISOString()
    };

    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener saldo de cuenta',
      error: error.message
    });
  }
});

// @route   GET /api/accounts/:id/transactions
// @desc    Obtener transacciones de una cuenta
// @access  Private
router.get('/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // TODO: Implementar lógica real con base de datos
    const transactions = [
      {
        id: 1,
        fecha: '2024-01-15',
        descripcion: 'Venta productos enero',
        tipo: 'ingreso',
        monto: 125000.00,
        categoria: 'Ventas',
        saldoAnterior: 100000.00,
        saldoNuevo: 225000.00
      },
      {
        id: 2,
        fecha: '2024-01-14',
        descripcion: 'Pago servicios',
        tipo: 'egreso',
        monto: 8500.00,
        categoria: 'Gastos Operativos',
        saldoAnterior: 108500.00,
        saldoNuevo: 100000.00
      }
    ];

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: transactions.length,
        pages: Math.ceil(transactions.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones de la cuenta',
      error: error.message
    });
  }
});

module.exports = router;
