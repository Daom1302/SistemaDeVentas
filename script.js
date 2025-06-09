const API_URL_PRODUCTOS = 'http://localhost:8081/api/productos';
const API_URL_VENTAS = 'http://localhost:8081/api/ventas';
const API_URL_VENDEDORES = 'http://localhost:8081/api/vendedores';

// Almacenar productos y vendedores para llenar selects y mostrar nombres en ventas
let productosGlobal = [];
let vendedoresGlobal = [];

// Cargar productos y llenar select productos
async function cargarProductos() {
  const res = await fetch(API_URL_PRODUCTOS);
  const productos = await res.json();
  productosGlobal = productos;

  const tabla = document.getElementById('tablaProductos');
  tabla.innerHTML = '';

  const selectProducto = document.getElementById('productoId');
  selectProducto.innerHTML = '<option value="" disabled selected>Seleccione un producto</option>';

  productos.forEach(p => {
    // Tabla productos
    const fila = `<tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.precio}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button></td>
    </tr>`;
    tabla.innerHTML += fila;

    // Opciones select producto
    selectProducto.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
  });
}

// Cargar vendedores y llenar select vendedores
async function cargarVendedores() {
  const res = await fetch(API_URL_VENDEDORES);
  const vendedores = await res.json();
  vendedoresGlobal = vendedores;

  const tabla = document.getElementById('tablaVendedores');
  tabla.innerHTML = '';

  const selectVendedor = document.getElementById('vendedorId');
  selectVendedor.innerHTML = '<option value="" disabled selected>Seleccione un vendedor</option>';

  vendedores.forEach(v => {
    // Tabla vendedores
    const fila = `<tr>
      <td>${v.id}</td>
      <td>${v.nombre}</td>
      <td>${v.correo}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarVendedor(${v.id})">Eliminar</button></td>
    </tr>`;
    tabla.innerHTML += fila;

    // Opciones select vendedor
    selectVendedor.innerHTML += `<option value="${v.id}">${v.nombre}</option>`;
  });
}

async function agregarProducto(nombre, precio) {
  try {
    await fetch(API_URL_PRODUCTOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    });
    cargarProductos();
  } catch (error) {
    alert("Error al agregar el producto");
  }
}

async function eliminarProducto(id) {
  if (confirm("¿Seguro que quieres eliminar este producto?")) {
    await fetch(`${API_URL_PRODUCTOS}/${id}`, { method: 'DELETE' });
    cargarProductos();
  }
}

document.getElementById('productoForm').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  if(nombre && precio > 0) {
    agregarProducto(nombre, precio);
    e.target.reset();
  } else {
    alert('Por favor ingresa un nombre válido y un precio mayor a 0.');
  }
});

async function agregarVendedor(nombre, correo) {
  try {
    await fetch(API_URL_VENDEDORES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo })
    });
    cargarVendedores();
  } catch (error) {
    alert("Error al agregar el vendedor");
  }
}

async function eliminarVendedor(id) {
  if (confirm("¿Seguro que quieres eliminar este vendedor?")) {
    await fetch(`${API_URL_VENDEDORES}/${id}`, { method: 'DELETE' });
    cargarVendedores();
  }
}

document.getElementById('vendedorForm').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombreVendedor').value.trim();
  const correo = document.getElementById('correoVendedor').value.trim();
  if(nombre && correo) {
    agregarVendedor(nombre, correo);
    e.target.reset();
  } else {
    alert('Por favor ingresa un nombre y correo válidos.');
  }
});

// Ventas
async function cargarVentas() {
  const res = await fetch(API_URL_VENTAS);
  const ventas = await res.json();
  const tabla = document.getElementById('tablaVentas');
  tabla.innerHTML = '';
  ventas.forEach(v => {
    const producto = productosGlobal.find(p => p.id === (v.producto ? v.producto.id : null));
    const vendedor = vendedoresGlobal.find(ven => ven.id === (v.vendedor ? v.vendedor.id : null));
    const fila = `<tr>
      <td>${v.id}</td>
      <td>${producto ? producto.nombre : 'N/A'}</td>
      <td>${vendedor ? vendedor.nombre : 'N/A'}</td>
      <td>${v.cantidad}</td>
    </tr>`;
    tabla.innerHTML += fila;
  });
}

async function registrarVenta(productoId, vendedorId, cantidad) {
  try {
    if(!productoId || !vendedorId || cantidad <= 0) {
      alert('Por favor selecciona un producto, un vendedor y una cantidad válida.');
      return;
    }

    const venta = {
      cantidad: cantidad,
      producto: { id: productoId },
      vendedor: { id: vendedorId }
    };

    await fetch(API_URL_VENTAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta)
    });

    cargarVentas();
    document.getElementById('ventaForm').reset();
  } catch (error) {
    alert("Error al registrar la venta");
  }
}

document.getElementById('ventaForm').addEventListener('submit', e => {
  e.preventDefault();
  const productoId = parseInt(document.getElementById('productoId').value);
  const vendedorId = parseInt(document.getElementById('vendedorId').value);
  const cantidad = parseInt(document.getElementById('cantidad').value);
  registrarVenta(productoId, vendedorId, cantidad);
});

function mostrarVista(nombre) {
  const vistas = document.querySelectorAll('.vista');
  vistas.forEach(v => v.classList.add('d-none'));

  const vistaActual = document.getElementById(`vista-${nombre}`);
  if (vistaActual) vistaActual.classList.remove('d-none');
}


// Cargar datos al inicio
cargarProductos();
cargarVendedores();
cargarVentas();
