import React, { useState } from 'react';

const Feriados: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const feriados = [
    { fecha: '2024-01-01', nombre: 'Año Nuevo', tipo: 'Nacional' },
    { fecha: '2024-02-12', nombre: 'Carnaval', tipo: 'Nacional' },
    { fecha: '2024-02-13', nombre: 'Carnaval', tipo: 'Nacional' },
    { fecha: '2024-03-24', nombre: 'Día Nacional de la Memoria', tipo: 'Nacional' },
    { fecha: '2024-03-29', nombre: 'Viernes Santo', tipo: 'Nacional' },
    { fecha: '2024-04-02', nombre: 'Día del Veterano', tipo: 'Nacional' },
    { fecha: '2024-05-01', nombre: 'Día del Trabajador', tipo: 'Nacional' },
    { fecha: '2024-05-25', nombre: 'Revolución de Mayo', tipo: 'Nacional' },
    { fecha: '2024-06-17', nombre: 'Paso a la Inmortalidad del General Güemes', tipo: 'Nacional' },
    { fecha: '2024-06-20', nombre: 'Paso a la Inmortalidad del General Belgrano', tipo: 'Nacional' },
    { fecha: '2024-07-09', nombre: 'Día de la Independencia', tipo: 'Nacional' },
    { fecha: '2024-08-17', nombre: 'Paso a la Inmortalidad del General San Martín', tipo: 'Nacional' },
    { fecha: '2024-10-12', nombre: 'Día del Respeto a la Diversidad Cultural', tipo: 'Nacional' },
    { fecha: '2024-11-20', nombre: 'Día de la Soberanía Nacional', tipo: 'Nacional' },
    { fecha: '2024-12-08', nombre: 'Inmaculada Concepción de María', tipo: 'Nacional' },
    { fecha: '2024-12-25', nombre: 'Navidad', tipo: 'Nacional' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { weekday: 'short' });
  };

  const isWeekend = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Feriados</h1>
        <p className="text-gray-600">
          Gestión de feriados nacionales y días no laborables
        </p>
      </div>

      {/* Year Selector and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feriados</p>
              <p className="text-2xl font-bold text-blue-600">{feriados.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Días Laborables</p>
              <p className="text-2xl font-bold text-green-600">{365 - feriados.length - 104}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🏖️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fines de Semana</p>
              <p className="text-2xl font-bold text-purple-600">104</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Holiday Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Agregar Feriado</h2>
        
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre del feriado"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Nacional">Nacional</option>
              <option value="Provincial">Provincial</option>
              <option value="Local">Local</option>
              <option value="Religioso">Religioso</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ➕ Agregar
            </button>
          </div>
        </form>
      </div>

      {/* Holidays List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Feriados {selectedYear}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Día
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feriado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
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
              {feriados.map((feriado, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(feriado.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isWeekend(feriado.fecha) 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getDayOfWeek(feriado.fecha)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {feriado.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {feriado.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Activo
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📅 Vista de Calendario
        </h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Vista de calendario (implementar con librería de calendario)</p>
        </div>
      </div>
    </div>
  );
};

export default Feriados;
