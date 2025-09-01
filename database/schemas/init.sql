-- Financiero JISRL Database Schema
-- Sistema de Flujo de Caja para Empresas de Consumo Masivo

-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS financiero_jisrl;
USE financiero_jisrl;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de cuentas
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('efectivo', 'cuenta-corriente', 'caja-ahorro', 'plazo-fijo', 'tarjeta-credito') NOT NULL,
    initial_balance DECIMAL(15,2) DEFAULT 0.00,
    current_balance DECIMAL(15,2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('ingreso', 'egreso') NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6b7280',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuit VARCHAR(13) UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    type ENUM('ingreso', 'egreso', 'transferencia') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    account_id INT NOT NULL,
    category_id INT NOT NULL,
    provider_id INT NULL,
    transfer_id BIGINT NULL, -- Para relacionar transferencias
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabla de feriados
CREATE TABLE IF NOT EXISTS holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('Nacional', 'Provincial', 'Local', 'Religioso') DEFAULT 'Nacional',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para mejorar performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);

-- Insertar datos iniciales

-- Usuario administrador por defecto
INSERT INTO users (name, email, password_hash, role) VALUES 
('Administrador', 'admin@financiero.com', '$2b$10$example_hash', 'admin')
ON DUPLICATE KEY UPDATE name=name;

-- Cuentas iniciales
INSERT INTO accounts (name, type, initial_balance, current_balance) VALUES 
('Efectivo - Caja Principal', 'efectivo', 20000.00, 20000.00),
('Banco Nación - Cuenta Corriente', 'cuenta-corriente', 100000.00, 100000.00),
('Banco Santander - Caja de Ahorro', 'caja-ahorro', 50000.00, 50000.00)
ON DUPLICATE KEY UPDATE name=name;

-- Categorías de ingresos
INSERT INTO categories (name, type, description, color) VALUES 
('Ventas', 'ingreso', 'Ingresos por ventas de productos', '#10b981'),
('Servicios', 'ingreso', 'Ingresos por prestación de servicios', '#3b82f6'),
('Intereses', 'ingreso', 'Ingresos por intereses bancarios', '#8b5cf6'),
('Otros Ingresos', 'ingreso', 'Otros tipos de ingresos', '#06b6d4')
ON DUPLICATE KEY UPDATE name=name;

-- Categorías de egresos
INSERT INTO categories (name, type, description, color) VALUES 
('Proveedores', 'egreso', 'Pagos a proveedores', '#ef4444'),
('Gastos Operativos', 'egreso', 'Gastos operativos del negocio', '#f59e0b'),
('Nómina', 'egreso', 'Pagos de sueldos y salarios', '#ec4899'),
('Impuestos', 'egreso', 'Pagos de impuestos', '#6b7280'),
('Marketing', 'egreso', 'Gastos de marketing y publicidad', '#f97316'),
('Otros Gastos', 'egreso', 'Otros tipos de gastos', '#84cc16'),
('Transferencias', 'egreso', 'Transferencias entre cuentas', '#3b82f6')
ON DUPLICATE KEY UPDATE name=name;

-- Feriados nacionales 2024
INSERT INTO holidays (date, name, type) VALUES 
('2024-01-01', 'Año Nuevo', 'Nacional'),
('2024-02-12', 'Carnaval', 'Nacional'),
('2024-02-13', 'Carnaval', 'Nacional'),
('2024-03-24', 'Día Nacional de la Memoria por la Verdad y la Justicia', 'Nacional'),
('2024-03-29', 'Viernes Santo', 'Nacional'),
('2024-04-02', 'Día del Veterano y de los Caídos en la Guerra de Malvinas', 'Nacional'),
('2024-05-01', 'Día del Trabajador', 'Nacional'),
('2024-05-25', 'Día de la Revolución de Mayo', 'Nacional'),
('2024-06-17', 'Paso a la Inmortalidad del General Martín Miguel de Güemes', 'Nacional'),
('2024-06-20', 'Paso a la Inmortalidad del General Manuel Belgrano', 'Nacional'),
('2024-07-09', 'Día de la Independencia', 'Nacional'),
('2024-08-17', 'Paso a la Inmortalidad del General José de San Martín', 'Nacional'),
('2024-10-12', 'Día del Respeto a la Diversidad Cultural', 'Nacional'),
('2024-11-20', 'Día de la Soberanía Nacional', 'Nacional'),
('2024-12-08', 'Inmaculada Concepción de María', 'Nacional'),
('2024-12-25', 'Navidad', 'Nacional')
ON DUPLICATE KEY UPDATE name=name;

-- Configuración inicial del sistema
INSERT INTO system_config (config_key, config_value, description) VALUES 
('currency', 'ARS', 'Moneda base del sistema'),
('date_format', 'DD/MM/YYYY', 'Formato de fecha'),
('timezone', 'America/Argentina/Buenos_Aires', 'Zona horaria'),
('company_name', 'Financiero JISRL', 'Nombre de la empresa'),
('backup_frequency', 'daily', 'Frecuencia de backup automático')
ON DUPLICATE KEY UPDATE config_key=config_key;

-- Triggers para auditoría (ejemplo para transacciones)
DELIMITER //

CREATE TRIGGER transactions_audit_insert 
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.created_by, 'INSERT', 'transactions', NEW.id, JSON_OBJECT(
        'date', NEW.date,
        'description', NEW.description,
        'type', NEW.type,
        'amount', NEW.amount,
        'account_id', NEW.account_id,
        'category_id', NEW.category_id
    ));
END//

CREATE TRIGGER transactions_audit_update 
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.created_by, 'UPDATE', 'transactions', NEW.id, 
        JSON_OBJECT(
            'date', OLD.date,
            'description', OLD.description,
            'type', OLD.type,
            'amount', OLD.amount,
            'account_id', OLD.account_id,
            'category_id', OLD.category_id
        ),
        JSON_OBJECT(
            'date', NEW.date,
            'description', NEW.description,
            'type', NEW.type,
            'amount', NEW.amount,
            'account_id', NEW.account_id,
            'category_id', NEW.category_id
        )
    );
END//

DELIMITER ;

-- Vistas útiles
CREATE VIEW v_account_balances AS
SELECT 
    a.id,
    a.name,
    a.type,
    a.initial_balance,
    COALESCE(SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END), 0) as total_expenses,
    a.initial_balance + 
    COALESCE(SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END), 0) as current_balance
FROM accounts a
LEFT JOIN transactions t ON a.id = t.account_id
WHERE a.active = TRUE
GROUP BY a.id, a.name, a.type, a.initial_balance;

CREATE VIEW v_monthly_summary AS
SELECT 
    YEAR(t.date) as year,
    MONTH(t.date) as month,
    MONTHNAME(t.date) as month_name,
    SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE -t.amount END) as net_flow
FROM transactions t
GROUP BY YEAR(t.date), MONTH(t.date)
ORDER BY YEAR(t.date), MONTH(t.date);

-- Comentarios finales
-- Esta estructura de base de datos está diseñada para:
-- 1. Manejar múltiples cuentas bancarias y de efectivo
-- 2. Categorizar ingresos y egresos
-- 3. Gestionar proveedores y sus transacciones
-- 4. Registrar feriados para cálculos de días laborables
-- 5. Mantener auditoría completa de cambios
-- 6. Proporcionar vistas optimizadas para reportes
