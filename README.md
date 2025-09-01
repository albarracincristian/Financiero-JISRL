# 💰 Sistema de Flujo de Caja - Empresa de Consumo Masivo

## 📋 Descripción del Proyecto

Sistema web integral para la gestión y control del flujo de caja de empresas de consumo masivo. Esta aplicación permite monitorear, proyectar y analizar los ingresos y egresos de efectivo, proporcionando herramientas esenciales para la toma de decisiones financieras estratégicas.

## 🎯 Objetivos

- **Control Financiero**: Monitoreo en tiempo real del flujo de efectivo
- **Proyecciones**: Análisis predictivo de ingresos y gastos futuros
- **Reportes**: Generación de informes detallados y dashboards ejecutivos
- **Alertas**: Notificaciones automáticas para situaciones críticas de liquidez
- **Integración**: Conexión con sistemas contables y bancarios existentes

## 🚀 Características Principales

### 📊 Dashboard Ejecutivo
- Vista general del estado financiero actual
- Gráficos interactivos de tendencias
- Indicadores clave de rendimiento (KPIs)
- Alertas de liquidez en tiempo real

### 💸 Gestión de Ingresos
- Registro de ventas por canal (retail, mayorista, online)
- Seguimiento de cuentas por cobrar
- Proyecciones de ingresos por temporada
- Análisis por línea de productos

### 💳 Control de Egresos
- Gestión de proveedores y pagos
- Control de gastos operativos
- Seguimiento de inversiones en inventario
- Programación de pagos automáticos

### 📈 Análisis y Reportes
- Reportes de flujo de caja histórico
- Proyecciones a 13 semanas
- Análisis de estacionalidad
- Comparativas año contra año
- Exportación a Excel/PDF

### 🔐 Seguridad y Usuarios
- Autenticación multi-factor
- Roles y permisos granulares
- Auditoría de transacciones
- Backup automático de datos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño responsivo
- **Chart.js** - Gráficos y visualizaciones
- **React Query** - Gestión de estado del servidor

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos principal
- **Redis** - Cache y sesiones
- **JWT** - Autenticación

### DevOps y Herramientas
- **Docker** - Containerización
- **GitHub Actions** - CI/CD
- **ESLint/Prettier** - Calidad de código
- **Jest** - Testing

## 📁 Estructura del Proyecto

```
financiero-jisrl/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # APIs y servicios
│   │   ├── utils/          # Utilidades
│   │   └── types/          # Definiciones TypeScript
│   ├── public/
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Lógica de negocio
│   │   └── utils/          # Utilidades
│   ├── tests/
│   └── package.json
├── database/               # Scripts de BD
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
├── docs/                   # Documentación
├── docker-compose.yml
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- Redis (v6 o superior)
- Docker (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/financiero-jisrl.git
cd financiero-jisrl
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

4. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

5. **Configurar base de datos**
```bash
cd ../backend
npm run db:migrate
npm run db:seed
```

6. **Ejecutar en modo desarrollo**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Instalación con Docker

```bash
docker-compose up -d
```

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Servidor en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Ejecutar en producción
- `npm run test` - Ejecutar tests
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Poblar base de datos

### Frontend
- `npm start` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run test` - Ejecutar tests
- `npm run lint` - Verificar código

## 📊 Módulos del Sistema

### 1. Gestión de Efectivo
- Saldos bancarios en tiempo real
- Conciliación bancaria automática
- Proyecciones de liquidez

### 2. Cuentas por Cobrar
- Seguimiento de facturas pendientes
- Gestión de cobranza
- Análisis de morosidad

### 3. Cuentas por Pagar
- Programación de pagos
- Gestión de proveedores
- Control de vencimientos

### 4. Inventarios
- Valorización de stock
- Rotación de inventarios
- Impacto en flujo de caja

### 5. Presupuestos
- Presupuesto anual por departamento
- Seguimiento vs. real
- Variaciones y análisis

## 🔒 Seguridad

- Encriptación de datos sensibles
- Autenticación JWT con refresh tokens
- Validación de entrada en todas las APIs
- Logs de auditoría completos
- Backup automático diario

## 📱 Responsive Design

La aplicación está optimizada para:
- 💻 Desktop (1920x1080+)
- 💻 Laptop (1366x768+)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667+)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Equipo de Desarrollo

- **Product Owner**: [Albarracin Cristian Bartolome]
- **Tech Lead**: [Nombre]
- **Frontend Developer**: [Nombre]
- **Backend Developer**: [Nombre]
- **QA Engineer**: [Nombre]

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@financiero-jisrl.com
- 📱 WhatsApp: +XX XXX XXX XXXX
- 🌐 Web: https://financiero-jisrl.com

## 🗺️ Roadmap

### Fase 1 (Q1 2024) ✅
- [x] Configuración inicial del proyecto
- [x] Diseño de base de datos
- [x] Autenticación y autorización
- [x] Dashboard básico

### Fase 2 (Q2 2024) 🚧
- [ ] Módulo de ingresos y egresos
- [ ] Reportes básicos
- [ ] Integración bancaria
- [ ] Notificaciones

### Fase 3 (Q3 2024) 📋
- [ ] Proyecciones avanzadas
- [ ] Análisis predictivo
- [ ] API para terceros
- [ ] App móvil

### Fase 4 (Q4 2024) 🔮
- [ ] Inteligencia artificial
- [ ] Automatización avanzada
- [ ] Integración ERP
- [ ] Multi-empresa

---

**Desarrollado con ❤️ para empresas de consumo masivo**
