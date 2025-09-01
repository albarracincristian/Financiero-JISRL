import React, { useState } from 'react';

const Input: React.FC = () => {
  const [activeSection, setActiveSection] = useState('cuentas');

  const sections = [
    { id: 'cuentas', label: 'Cuentas', icon: '🏦' },
    { id: 'categorias', label: 'Categorías', icon: '📂' },
    { id: 'proveedores', label: 'Proveedores', icon: '🏢' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⌨️ Input</h1>
        <p className="text-gray-600">
          Configuración y gestión de datos maestros del sistema
        </p>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeSection === 'cuentas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Cuentas</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  ➕ Nueva Cuenta
                </button>
              </div>

              {/* Add Account Form */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nueva Cuenta</h3>
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Cuenta
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Banco Nación - Cuenta Corriente"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Cuenta
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleccionar tipo</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="cuenta-corriente">Cuenta Corriente</option>
                      <option value="caja-ahorro">Caja de Ahorro</option>
                      <option value="plazo-fijo">Plazo Fijo</option>
                      <option value="tarjeta-credito">Tarjeta de Crédito</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saldo Inicial
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      💾 Guardar Cuenta
                    </button>
                  </div>
                </form>
              </div>

              {/* Accounts List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo Actual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Efectivo - Caja Principal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Efectivo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $0.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          ✏️ Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'categorias' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Categorías</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  ➕ Nueva Categoría
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Categories */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-4">📈 Categorías de Ingresos</h3>
                  <div className="space-y-2">
                    {['Ventas', 'Servicios', 'Intereses', 'Otros Ingresos'].map((categoria, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md">
                        <span className="text-sm font-medium text-gray-900">{categoria}</span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 text-xs">✏️</button>
                          <button className="text-red-600 hover:text-red-900 text-xs">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Categories */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-900 mb-4">📉 Categorías de Egresos</h3>
                  <div className="space-y-2">
                    {['Proveedores', 'Gastos Operativos', 'Nómina', 'Impuestos', 'Marketing', 'Otros Gastos'].map((categoria, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md">
                        <span className="text-sm font-medium text-gray-900">{categoria}</span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 text-xs">✏️</button>
                          <button className="text-red-600 hover:text-red-900 text-xs">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'proveedores' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Proveedores</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  ➕ Nuevo Proveedor
                </button>
              </div>

              {/* Add Provider Form */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Proveedor</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre/Razón Social
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del proveedor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CUIT/DNI
                    </label>
                    <input
                      type="text"
                      placeholder="XX-XXXXXXXX-X"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@proveedor.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="+54 11 XXXX-XXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      placeholder="Dirección completa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      💾 Guardar Proveedor
                    </button>
                  </div>
                </form>
              </div>

              {/* Providers List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proveedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CUIT/DNI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={5}>
                        No hay proveedores registrados
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'configuracion' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">⚙️ Configuración General</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda Base
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="ARS">Peso Argentino (ARS)</option>
                        <option value="USD">Dólar Estadounidense (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Fecha
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/Madrid">Madrid (GMT+1)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">🔔 Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Alertas de Saldo Bajo</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Recordatorios de Pagos</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Reportes Automáticos</span>
                      <input type="checkbox" className="rounded" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email para Notificaciones
                      </label>
                      <input
                        type="email"
                        placeholder="admin@empresa.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  💾 Guardar Configuración
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
