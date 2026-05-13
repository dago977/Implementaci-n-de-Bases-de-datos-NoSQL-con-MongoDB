/*
 * Tarea 4 - Big Data (UNAD)
 * Script de MongoDB: Catalogo de Productos
 * Autor: Dagoberto Santisteban
 * Fecha: Mayo 2026
 * Curso: 202016911
 */

// Seleccionar base de datos
use('tienda_db');

// Opcional: limpiar coleccion previa para pruebas repetidas
// db.productos.drop();

print('\n========================================');
print(' 1. INSERCION MASIVA DE 100 DOCUMENTOS');
print('========================================\n');

const categorias = ["Computadores", "Celulares", "Audio", "Accesorios", "Monitores"];
const nombres = ["Laptop Pro", "Smartphone X", "Audifonos BT", "Teclado Mecanico",
                 "Monitor 24", "Mouse Ergonomico", "Cargador Rapido", "Funda Protectora",
                 "Webcam HD", "Hub USB-C"];

for (let i = 1; i <= 100; i++) {
  db.productos.insertOne({
    nombre: `${nombres[Math.floor(Math.random() * nombres.length)]} v${i}`,
    categoria: categorias[Math.floor(Math.random() * categorias.length)],
    precio: Math.floor(Math.random() * 4900000) + 50000,
    stock: Math.floor(Math.random() * 200),
    calificacion: parseFloat((Math.random() * 3 + 2).toFixed(1)),
    etiquetas: ["tecnologia", "tienda-online", "nuevo"],
    disponible: Math.random() > 0.2
  });
}
print(`Total documentos insertados: ${db.productos.countDocuments()}\n`);

print('========================================');
print(' 2. CONSULTAS BASICAS (CRUD)');
print('========================================\n');

// Insercion manual
print('Insercion manual:');
printjson(db.productos.insertOne({
  nombre: "Monitor Gamer 27",
  categoria: "Monitores",
  precio: 1200000,
  stock: 15,
  calificacion: 4.9,
  etiquetas: ["gamer", "alta-gama"],
  disponible: true
}));
print('');

// Seleccion
print('Seleccion (3 productos de Audio):');
printjson(db.productos.find({ categoria: "Audio" }).limit(3).toArray());
print('');

// Actualizacion
print('Actualizacion (cambio de precio):');
printjson(db.productos.updateOne(
  { nombre: "Laptop Pro v1" },
  { $set: { precio: 4500000, stock: 25 } }
));
print('');

// Eliminacion
print('Eliminacion:');
printjson(db.productos.deleteOne({ nombre: "Monitor Gamer 27" }));
print('');

print('========================================');
print(' 3. FILTROS CON OPERADORES');
print('========================================\n');

print('Productos: $200k-$1M, stock>10, calific>=4.0, disponibles:');
printjson(db.productos.find({
  precio: { $gte: 200000, $lte: 1000000 },
  stock: { $gt: 10 },
  calificacion: { $gte: 4.0 },
  disponible: true
}).sort({ precio: 1 }).limit(5).toArray());
print('');

print('========================================');
print(' 4. CONSULTAS DE AGREGACION');
print('========================================\n');

print('Conteo por categoria:');
printjson(db.productos.aggregate([
  { $group: { _id: "$categoria", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
]).toArray());
print('');

print('Stock total de la tienda:');
printjson(db.productos.aggregate([
  { $group: { _id: null, totalStockTienda: { $sum: "$stock" } } }
]).toArray());
print('');

print('Precio promedio y metricas por categoria:');
printjson(db.productos.aggregate([
  { $group: {
      _id: "$categoria",
      precioPromedio: { $avg: "$precio" },
      cantidad: { $sum: 1 },
      stockTotal: { $sum: "$stock" }
    }
  },
  { $sort: { precioPromedio: -1 } }
]).toArray());

print('\nEjecucion completada exitosamente.');
