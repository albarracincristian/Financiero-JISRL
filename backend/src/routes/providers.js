const express = require('express');
const router = express.Router();

// @route   GET /api/providers
// @desc    Obtener todos los proveedores
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // TODO: Implementar lógica real con base de datos
    const providers = [
      {
        id: 1,
        nombre: 'Distribuidora ABC S.A.',
        cuit: '30-12345678-9',
        email: 'contacto@abc.com',
        telefono: '+54 11 4567-8901',
        direccion: 'Av. Corrientes 1234, CABA',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        nombre: 'Servicios XYZ Ltda.',
        cuit: '30-98765432-1',
        email: 'info@xyz.com',
        telefono: '+54 11 9876-5432',
        direccion: 'San Martín 567, Buenos Aires',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        nombre: 'Proveedor 123 S.R.L.',
        cuit: '30-11223344-5',
        email: 'ventas@proveedor123.com',
        telefono: '+54 11 1122-3344',
        direccion: 'Belgrano 890, La Plata',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    // Filtrar por búsqueda si se especifica
    let filteredProviders = providers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProviders = providers.filter(provider => 
        provider.nombre.toLowerCase().includes(searchLower) ||
        provider.cuit.includes(search) ||
        provider.email.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: filteredProviders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredProviders.length,
        pages: Math.ceil(filteredProviders.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores',
      error: error.message
    });
  }
});

// @route   POST /api/providers
// @desc    Crear nuevo proveedor
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { nombre, cuit, email, telefono, direccion } = req.body;

    // Validaciones
    if (!nombre || !cuit) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y CUIT son obligatorios'
      });
    }

    // Validar formato de CUIT (básico)
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(cuit)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de CUIT inválido (debe ser XX-XXXXXXXX-X)'
      });
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido'
        });
      }
    }

    // TODO: Implementar lógica real con base de datos
    const newProvider = {
      id: Date.now(),
      nombre,
      cuit,
      email: email || null,
      telefono: telefono || null,
      direccion: direccion || null,
      activo: true,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Proveedor creado exitosamente',
      data: newProvider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear proveedor',
      error: error.message
    });
  }
});

// @route   GET /api/providers/:id
// @desc    Obtener proveedor por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const provider = {
      id: parseInt(id),
      nombre: 'Distribuidora ABC S.A.',
      cuit: '30-12345678-9',
      email: 'contacto@abc.com',
      telefono: '+54 11 4567-8901',
      direccion: 'Av. Corrientes 1234, CABA',
      activo: true,
      createdAt: '2024-01-01T00:00:00Z'
    };

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedor',
      error: error.message
    });
  }
});

// @route   PUT /api/providers/:id
// @desc    Actualizar proveedor
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cuit, email, telefono, direccion, activo } = req.body;

    // Validaciones similares al POST
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido'
        });
      }
    }

    // TODO: Implementar lógica real con base de datos
    const updatedProvider = {
      id: parseInt(id),
      nombre,
      cuit,
      email,
      telefono,
      direccion,
      activo,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Proveedor actualizado exitosamente',
      data: updatedProvider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar proveedor',
      error: error.message
    });
  }
});

// @route   DELETE /api/providers/:id
// @desc    Eliminar proveedor
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Verificar que no tenga transacciones asociadas
    
    res.json({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar proveedor',
      error: error.message
    });
  }
});

// @route   GET /api/providers/:id/transactions
// @desc    Obtener transacciones de un proveedor
// @access  Private
router.get('/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, fechaInicio, fechaFin } = req.query;

    // TODO: Implementar lógica real con base de datos
    const transactions = [
      {
        id: 1,
        fecha: '2024-01-15',
        descripcion: 'Compra mercadería enero',
        tipo: 'egreso',
        monto: 45000.00,
        categoria: 'Proveedores',
        cuenta: 'Banco Principal'
      },
      {
        id: 2,
        fecha: '2024-01-10',
        descripcion: 'Pago factura diciembre',
        tipo: 'egreso',
        monto: 32000.00,
        categoria: 'Proveedores',
        cuenta: 'Banco Principal'
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
      message: 'Error al obtener transacciones del proveedor',
      error: error.message
    });
  }
});

// @route   GET /api/providers/:id/balance
// @desc    Obtener saldo pendiente con un proveedor
// @access  Private
router.get('/:id/balance', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const balance = {
      providerId: parseInt(id),
      saldoPendiente: 25000.00,
      totalCompras: 150000.00,
      totalPagos: 125000.00,
      facturasPendientes: [
        {
          numero: 'FC-001-2024',
          fecha: '2024-01-10',
          vencimiento: '2024-02-10',
          monto: 15000.00,
          diasVencimiento: 5
        },
        {
          numero: 'FC-002-2024',
          fecha: '2024-01-15',
          vencimiento: '2024-02-15',
          monto: 10000.00,
          diasVencimiento: 0
        }
      ]
    };

    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener saldo del proveedor',
      error: error.message
    });
  }
});

// @route   GET /api/providers/stats/top
// @desc    Obtener top proveedores por monto
// @access  Private
router.get('/stats/top', async (req, res) => {
  try {
    const { limit = 5, periodo = '30' } = req.query; // días

    // TODO: Implementar lógica real con base de datos
    const topProviders = [
      {
        id: 1,
        nombre: 'Distribuidora ABC S.A.',
        totalCompras: 125000.00,
        cantidadTransacciones: 15,
        promedioCompra: 8333.33
      },
      {
        id: 2,
        nombre: 'Servicios XYZ Ltda.',
        totalCompras: 85000.00,
        cantidadTransacciones: 8,
        promedioCompra: 10625.00
      },
      {
        id: 3,
        nombre: 'Proveedor 123 S.R.L.',
        totalCompras: 65000.00,
        cantidadTransacciones: 12,
        promedioCompra: 5416.67
      }
    ];

    res.json({
      success: true,
      data: topProviders.slice(0, parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de proveedores',
      error: error.message
    });
  }
});

module.exports = router;
