CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
	codigo VARCHAR(15) UNIQUE NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	precio NUMERIC(10, 2) NOT NULL,
	descripcion TEXT NOT NULL,
	bodega VARCHAR(50) NOT NULL,
	sucursal VARCHAR(50) NOT NULL,
	moneda VARCHAR(10) NOT NULL,
	materiales TEXT
);