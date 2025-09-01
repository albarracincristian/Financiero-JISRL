const express = require('express');
const router = express.Router();

// @route   GET /api/categories
// @desc    Obtener todas las categorías
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { tipo } = req.query; // 'ingreso', 'egreso', o ambos

    // TODO: Implementar lógica real con base de datos
    const categories = [
      // Categorías de Ingresos
      {
        id: 1,
        nombre: 'Ventas',
        tipo: 'ingreso',
        descripcion: 'Ingresos por ventas de productos',
        activa: true,
        color: '#10b981',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        nombre: 'Servicios',
        tipo: 'ingreso',
        descripcion: 'Ingresos por prestación de servicios',
        activa: true,
        color: '#3b82f6',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        nombre: 'Intereses',
        tipo: 'ingreso',
        descripcion: 'Ingresos por intereses bancarios',
        activa: true,
        color: '#8b5cf6',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        nombre: 'Otros Ingresos',
        tipo: 'ingreso',
        descripcion: 'Otros tipos de ingresos',
        activa: true,
        color: '#06b6d4',
        createdAt: '2024-01-01T00:00:00Z'
      },
      // Categorías de Egresos
      {
        id: 5,
        nombre: 'Proveedores',
        tipo: 'egreso',
        descripcion: 'Pagos a proveedores',
        activa: true,
        color: '#ef4444',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 6,
        nombre: 'Gastos Operativos',
        tipo: 'egreso',
        descripcion: 'Gastos operativos del negocio',
        activa: true,
        color: '#f59e0b',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 7,
        nombre: 'Nómina',
        tipo: 'egreso',
        descripcion: 'Pagos de sueldos y salarios',
        activa: true,
        color: '#ec4899',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 8,
        nombre: 'Impuestos',
        tipo: 'egreso',
        descripcion: 'Pagos de impuestos',
        activa: true,
        color: '#6b7280',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 9,
        nombre: 'Marketing',
        tipo: 'egreso',
        descripcion: 'Gastos de marketing y publicidad',
        activa: true,
        color: '#f97316',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 10,
        nombre: 'Otros Gastos',
        tipo: 'egreso',
        descripcion: 'Otros tipos de gastos',
        activa: true,
        color: '#84cc16',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    // Filtrar por tipo si se especifica
    let filteredCategories = categories;
    if (tipo && ['ingreso', 'egreso'].includes(tipo)) {
      filteredCategories = categories.filter(cat => cat.tipo === tipo);
    }

    res.json({
      success: true,
      data: filteredCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
});

// @route   POST /api/categories
// @desc    Crear nueva categoría
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { nombre, tipo, descripcion, color } = req.body;

    // Validaciones
    if (!nombre || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y tipo son obligatorios'
      });
    }

    if (!['ingreso', 'egreso'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser "ingreso" o "egreso"'
      });
    }

    // TODO: Implementar lógica real con base de datos
    const newCategory = {
      id: Date.now(),
      nombre,
      tipo,
      descripcion: descripcion || '',
      color: color || '#6b7280',
      activa: true,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Obtener categoría por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const category = {
      id: parseInt(id),
      nombre: 'Ventas',
      tipo: 'ingreso',
      descripcion: 'Ingresos por ventas de productos',
      activa: true,
      color: '#10b981',
      createdAt: '2024-01-01T00:00:00Z'
    };

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Actualizar categoría
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color, activa } = req.body;

    // TODO: Implementar lógica real con base de datos
    const updatedCategory = {
      id: parseInt(id),
      nombre,
      descripcion,
      color,
      activa,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Eliminar categoría
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Verificar que no tenga transacciones asociadas
    
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
});

// @route   GET /api/categories/:id/transactions
// @desc    Obtener transacciones de una categoría
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
        descripcion: 'Venta productos enero',
        tipo: 'ingreso',
        monto: 125000.00,
        cuenta: 'Banco Principal'
      },
      {
        id: 2,
        fecha: '2024-01-10',
        descripcion: 'Venta productos diciembre',
        tipo: 'ingreso',
        monto: 98000.00,
        cuenta: 'Efectivo'
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
      message: 'Error al obtener transacciones de la categoría',
      error: error.message
    });
  }
});

// @route   GET /api/categories/stats
// @desc    Obtener estadísticas de categorías
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const { periodo = '30' } = req.query; // días

    // TODO: Implementar lógica real con base de datos
    const stats = {
      ingresos: [
        { categoria: 'Ventas', total: 450000, porcentaje: 75 },
        { categoria: 'Servicios', total: 120000, porcentaje: 20 },
        { categoria: 'Intereses', total: 30000, porcentaje: 5 }
      ],
      egresos: [
        { categoria: 'Proveedores', total: 200000, porcentaje: 45 },
        { categoria: 'Nómina', total: 110000, porcentaje: 25 },
        { categoria: 'Gastos Operativos', total: 66000, porcentaje: 15 },
        { categoria: 'Impuestos', total: 35000, porcentaje: 8 },
        { categoria: 'Marketing', total: 18000, porcentaje: 4 },
        { categoria: 'Otros Gastos', total: 13000, porcentaje: 3 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de categorías',
      error: error.message
    });
  }
});

module.exports = router;
