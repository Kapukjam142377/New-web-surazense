-- SQL Schema for Surazense Cancer Report Database (PostgreSQL Compatible)
-- This schema matches the SQLAlchemy models defined in the Python backend.

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sex VARCHAR(50),
    age INTEGER,
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast patient lookup by name
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);


-- 2. Medical Reports Table (Linked to Patients)
CREATE TABLE IF NOT EXISTS medical_reports (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    specimen1 VARCHAR(100),
    specimen2 VARCHAR(100),
    collecting_date DATE,
    receiving_date DATE,
    testing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast report lookup by patient
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);


-- 3. Tumor Markers & Clinical Scores Table (One-to-One with Medical Reports)
CREATE TABLE IF NOT EXISTS tumor_markers (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL UNIQUE REFERENCES medical_reports(id) ON DELETE CASCADE,
    psa NUMERIC(10, 2),
    cea NUMERIC(10, 2),
    ca153 NUMERIC(10, 2),
    afp NUMERIC(10, 2),
    hpv VARCHAR(100),
    ctcs NUMERIC(10, 2),
    pca3 NUMERIC(10, 2),
    dlx1 VARCHAR(100)
);


-- 4. Genetic Mutations / Exons Table (One-to-One with Medical Reports)
CREATE TABLE IF NOT EXISTS genetic_mutations (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL UNIQUE REFERENCES medical_reports(id) ON DELETE CASCADE,
    exon20 NUMERIC(10, 2),
    g719x NUMERIC(10, 2),
    exon19 NUMERIC(10, 2),
    l858r NUMERIC(10, 2)
);


-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address VARCHAR(1000) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'received',
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast order lookup by customer email
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);


-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL
);

-- Index for fast item lookup by order_id
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
