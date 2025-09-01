const express = require('express');
const router = express.Router();

// @route   GET /api/holidays
// @desc    Obtener todos los feriados
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { year, tipo } = req.query;
    const currentYear = year || new Date().getFullYear();

    // TODO: Implementar lógica real con base de datos
    const holidays = [
      {
        id: 1,
        fecha: `${currentYear}-01-01`,
        nombre: 'Año Nuevo',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        fecha: `${currentYear}-02-12`,
        nombre: 'Carnaval',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        fecha: `${currentYear}-02-13`,
        nombre: 'Carnaval',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        fecha: `${currentYear}-03-24`,
        nombre: 'Día Nacional de la Memoria por la Verdad y la Justicia',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 5,
        fecha: `${currentYear}-03-29`,
        nombre: 'Viernes Santo',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 6,
        fecha: `${currentYear}-04-02`,
        nombre: 'Día del Veterano y de los Caídos en la Guerra de Malvinas',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 7,
        fecha: `${currentYear}-05-01`,
        nombre: 'Día del Trabajador',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 8,
        fecha: `${currentYear}-05-25`,
        nombre: 'Día de la Revolución de Mayo',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 9,
        fecha: `${currentYear}-06-17`,
        nombre: 'Paso a la Inmortalidad del General Martín Miguel de Güemes',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 10,
        fecha: `${currentYear}-06-20`,
        nombre: 'Paso a la Inmortalidad del General Manuel Belgrano',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 11,
        fecha: `${currentYear}-07-09`,
        nombre: 'Día de la Independencia',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 12,
        fecha: `${currentYear}-08-17`,
        nombre: 'Paso a la Inmortalidad del General José de San Martín',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 13,
        fecha: `${currentYear}-10-12`,
        nombre: 'Día del Respeto a la Diversidad Cultural',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 14,
        fecha: `${currentYear}-11-20`,
        nombre: 'Día de la Soberanía Nacional',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 15,
        fecha: `${currentYear}-12-08`,
        nombre: 'Inmaculada Concepción de María',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 16,
        fecha: `${currentYear}-12-25`,
        nombre: 'Navidad',
        tipo: 'Nacional',
        activo: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    // Filtrar por tipo si se especifica
    let filteredHolidays = holidays;
    if (tipo) {
      filteredHolidays = holidays.filter(holiday => 
        holiday.tipo.toLowerCase() === tipo.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: filteredHolidays,
      year: currentYear,
      total: filteredHolidays.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener feriados',
      error: error.message
    });
  }
});

// @route   POST /api/holidays
// @desc    Crear nuevo feriado
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { fecha, nombre, tipo } = req.body;

    // Validaciones
    if (!fecha || !nombre || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Fecha, nombre y tipo son obligatorios'
      });
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
      });
    }

    const tiposValidos = ['Nacional', 'Provincial', 'Local', 'Religioso'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser: Nacional, Provincial, Local o Religioso'
      });
    }

    // TODO: Implementar lógica real con base de datos
    const newHoliday = {
      id: Date.now(),
      fecha,
      nombre,
      tipo,
      activo: true,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Feriado creado exitosamente',
      data: newHoliday
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear feriado',
      error: error.message
    });
  }
});

// @route   GET /api/holidays/:id
// @desc    Obtener feriado por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    const holiday = {
      id: parseInt(id),
      fecha: '2024-01-01',
      nombre: 'Año Nuevo',
      tipo: 'Nacional',
      activo: true,
      createdAt: '2024-01-01T00:00:00Z'
    };

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Feriado no encontrado'
      });
    }

    res.json({
      success: true,
      data: holiday
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener feriado',
      error: error.message
    });
  }
});

// @route   PUT /api/holidays/:id
// @desc    Actualizar feriado
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, nombre, tipo, activo } = req.body;

    // Validaciones similares al POST
    if (fecha) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(fecha)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
        });
      }
    }

    // TODO: Implementar lógica real con base de datos
    const updatedHoliday = {
      id: parseInt(id),
      fecha,
      nombre,
      tipo,
      activo,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Feriado actualizado exitosamente',
      data: updatedHoliday
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar feriado',
      error: error.message
    });
  }
});

// @route   DELETE /api/holidays/:id
// @desc    Eliminar feriado
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar lógica real con base de datos
    
    res.json({
      success: true,
      message: 'Feriado eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar feriado',
      error: error.message
    });
  }
});

// @route   GET /api/holidays/check/:date
// @desc    Verificar si una fecha es feriado
// @access  Private
router.get('/check/:date', async (req, res) => {
  try {
    const { date } = req.params;

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
      });
    }

    // TODO: Implementar lógica real con base de datos
    const isHoliday = date === '2024-01-01' || date === '2024-12-25'; // Mock
    const holidayInfo = isHoliday ? {
      fecha: date,
      nombre: date === '2024-01-01' ? 'Año Nuevo' : 'Navidad',
      tipo: 'Nacional'
    } : null;

    // Verificar si es fin de semana
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    res.json({
      success: true,
      data: {
        fecha: date,
        esFeriado: isHoliday,
        esFinDeSemana: isWeekend,
        esDiaLaborable: !isHoliday && !isWeekend,
        feriado: holidayInfo,
        diaSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar fecha',
      error: error.message
    });
  }
});

// @route   GET /api/holidays/stats/:year
// @desc    Obtener estadísticas de feriados por año
// @access  Private
router.get('/stats/:year', async (req, res) => {
  try {
    const { year } = req.params;

    // TODO: Implementar lógica real con base de datos
    const stats = {
      year: parseInt(year),
      totalFeriados: 16,
      feriadosNacionales: 16,
      feriadosProvinciales: 0,
      feriadosLocales: 0,
      feriadosReligiosos: 0,
      diasLaborables: 249, // 365 - 16 feriados - 104 fines de semana
      finesDeSemana: 104,
      porMes: {
        enero: 1,
        febrero: 2,
        marzo: 2,
        abril: 1,
        mayo: 2,
        junio: 2,
        julio: 1,
        agosto: 1,
        septiembre: 0,
        octubre: 1,
        noviembre: 1,
        diciembre: 2
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de feriados',
      error: error.message
    });
  }
});

module.exports = router;
