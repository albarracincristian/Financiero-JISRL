const express = require('express');
const router = express.Router();

// @route   GET /api/transactions
// @desc    Obtener todas las transacciones
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tipo, categoria, fechaInicio, fechaFin } = req.query;

    // TODO: Implementar lógica real con base de datos
    const transactions = [
      {
        id: 1,
        fecha: '2024-01-15',
        descripcion: 'Venta productos enero',
        tipo: 'ingreso',
        monto: 125000.00,
        categoria: 'Ventas',
        cuenta: 'Banco Principal',
        proveedor: null,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        fecha: '2024-01-14',
        descripcion: 'Pago proveedor ABC',
        tipo: 'egreso',
        monto: 45000.00,
        categoria: 'Proveedores',
        cuenta: 'Banco Principal',
        proveedor: 'Proveedor ABC S.A.',
        createdAt: '2024-01-14T14:20:00Z'
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
      message: 'Error al obtener transacciones',
      error: error.message
    });
  }
});

// @route   POST /api/transactions
// @desc    Crear nueva transacción
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { fecha, descripcion, tipo, monto, categoria, cuenta, proveedor } = req.body;

    // Validaciones básicas
    if (!fecha || !descripcion || !tipo || !monto || !categoria || !cuenta) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser completados'
      });
    }

    if (!['ingreso', 'egreso', 'transferencia'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de transacción inválido'
      });
    }

    // TODO: Implementar lógica real con base de datos
    const newTransaction = {
      id: Date.now(),
      fecha,
      descripcion,
      tipo,
      monto: parseFloat(monto),
      categoria,
      cuenta,
      proveedor: proveedor || null,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: newTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear transacción',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Obtener transacción por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const transaction = {
      id: parseInt(id),
      fecha: '2024-01-15',
      descripcion: 'Venta productos enero',
      tipo: 'ingreso',
      monto: 125000.00,
      categoria: 'Ventas',
      cuenta: 'Banco Principal',
      proveedor: null,
      createdAt: '2024-01-15T10:30:00Z'
    };

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacción',
      error: error.message
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Actualizar transacción
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, descripcion, tipo, monto, categoria, cuenta, proveedor } = req.body;

    // TODO: Implementar lógica real con base de datos
    const updatedTransaction = {
      id: parseInt(id),
      fecha,
      descripcion,
      tipo,
      monto: parseFloat(monto),
      categoria,
      cuenta,
      proveedor: proveedor || null,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente',
      data: updatedTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar transacción',
      error: error.message
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Eliminar transacción
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar transacción',
      error: error.message
    });
  }
});

// @route   POST /api/transactions/transfer
// @desc    Crear transferencia entre cuentas
// @access  Private
router.post('/transfer', async (req, res) => {
  try {
    const { fecha, monto, cuentaOrigen, cuentaDestino, concepto } = req.body;

    // Validaciones
    if (!fecha || !monto || !cuentaOrigen || !cuentaDestino || !concepto) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios para la transferencia'
      });
    }

    if (cuentaOrigen === cuentaDestino) {
      return res.status(400).json({
        success: false,
        message: 'La cuenta origen y destino no pueden ser la misma'
      });
    }

    // TODO: Implementar lógica real con base de datos
    // Crear dos transacciones: una de egreso y una de ingreso
    const transferId = Date.now();
    
    const egresoTransaction = {
      id: transferId,
      fecha,
      descripcion: `Transferencia a ${cuentaDestino} - ${concepto}`,
      tipo: 'egreso',
      monto: parseFloat(monto),
      categoria: 'Transferencias',
      cuenta: cuentaOrigen,
      transferId,
      createdAt: new Date().toISOString()
    };

    const ingresoTransaction = {
      id: transferId + 1,
      fecha,
      descripcion: `Transferencia desde ${cuentaOrigen} - ${concepto}`,
      tipo: 'ingreso',
      monto: parseFloat(monto),
      categoria: 'Transferencias',
      cuenta: cuentaDestino,
      transferId,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Transferencia realizada exitosamente',
      data: {
        transferId,
        egreso: egresoTransaction,
        ingreso: ingresoTransaction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al realizar transferencia',
      error: error.message
    });
  }
});

module.exports = router;
