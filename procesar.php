<?php
header("Content-Type: application/json");

$host = "localhost";
$port = "5432";
$dbname = "postgres";
$user = "postgres";
$password = "mendozasis18";
//Configuración de conexión a la BD
$conn = pg_connect("host=localhost dbname=postgres user=postgres password=mendozasis18");

if (!$conn) {
    die("Error de conexión a PostgreSQL");
}

//Recibir datos del formulario
$codigo = $_POST["codigo"] ?? '';
$nombre = $_POST["nombre"] ?? '';
$precio = $_POST["precio"] ?? '';
$descripcion = $_POST["descripcion"] ?? '';
$bodega = $_POST["bodega"] ?? '';
$sucursal = $_POST["sucursal"] ?? '';
$moneda = $_POST["moneda"] ?? '';
$materiales = $_POST["material"] ?? [];

//Validacion básica en servidor
if (empty($codigo) || empty($nombre) || empty($precio) || empty($descripcion) || empty($bodega) || empty($sucursal) || empty($moneda)) {
    echo "Error: Todos los campos obligatorios deben completarse.";
    exit;
}

if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/', $codigo)) {
    echo "Error: Código inválido.";
    exit;
}

if (!preg_match('/^\d+(\.\d{1,2})?$/', $precio) || floatval($precio) <= 0) {
    echo "Error: Precio inválido.";
    exit;
}

// Validar en PostgreSQL
$sql_check = "SELECT 1 FROM productos WHERE codigo = $1";
$result = pg_query_params($conn, $sql_check, [$codigo]);

if (pg_num_rows($result) > 0) {
    echo "Error: El código del producto ya está registrado.";
    pg_close($conn);
    exit;
}

// Convertir materiales a texto
$materiales_str = is_array($materiales) ? implode(", ", $materiales) : $materiales;

// Insertar en tabla
$sql_insert = "INSERT INTO productos (codigo, nombre, precio, descripcion, bodega, sucursal, moneda, materiales)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
$params = [$codigo, $nombre, $precio, $descripcion, $bodega, $sucursal, $moneda, $materiales_str];

$result = pg_query_params($conn, $sql_insert, $params);

if ($result) {
    echo "OK";
} else {
    echo "Error al insertar: " . pg_last_error($conn);
}

pg_close($conn);
?>