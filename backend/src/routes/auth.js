const express = require('express');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Autenticar usuario
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Implementar lógica de autenticación
    // Por ahora, respuesta mock
    if (email === 'admin@financiero.com' && password === 'admin123') {
      res.json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: 1,
          email: 'admin@financiero.com',
          name: 'Administrador',
          role: 'admin'
        },
        token: 'mock-jwt-token'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TODO: Implementar lógica de registro
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: Date.now(),
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Cerrar sesión
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    // TODO: Implementar lógica de logout (invalidar token)
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener usuario actual
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // TODO: Implementar middleware de autenticación
    res.json({
      success: true,
      user: {
        id: 1,
        email: 'admin@financiero.com',
        name: 'Administrador',
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

module.exports = router;
