const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',    precio: 4500,  categoria: 'Entrada'      },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'      },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',       precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',          precio: 5200,  categoria: 'Postre'       },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'       },
];

const reservas = [];

// Renderiza todos los platillos como cards en el contenedor del menú
function renderMenu(lista = menu)  {
  const contenedor = document.getElementById('contenedor-menu');
  contenedor.innerHTML = '';

  lista.forEach(function(platillo) {
    const card = document.createElement('div');
    card.className = 'card-plato';
    card.innerHTML = `
      <h3>${platillo.nombre}</h3>
      <p>${platillo.descripcion}</p>
      <p>₡${platillo.precio.toLocaleString()}</p>
      <span>${platillo.categoria}</span>
    `;
    contenedor.appendChild(card);
  });
}

// Filtra las cards por categoría al hacer clic en un botón
function filtrarCategoria(categoria) {
  // Resalta el botón activo visualmente
  const botones = document.querySelectorAll('#filtros button');
  botones.forEach(function(btn) {
    btn.classList.remove('activo');
    if (btn.textContent.includes(categoria) || (categoria === 'Todos' && btn.textContent === 'Todos')) {
      btn.classList.add('activo');
    }
  });

  // Si es "Todos", mostramos el array completo
  if (categoria === 'Todos') {
    renderMenu(menu);
    return;
  }

  // Filtramos solo los platillos de esa categoría
  const filtrados = menu.filter(function(platillo) {
    return platillo.categoria === categoria;
  });

  // Renderizamos solo los filtrados
  renderMenu(filtrados);
}

// Valida los campos del formulario antes de enviar
function validarFormulario() {
  let esValido = true;

  // --- Validar nombre: obligatorio, mínimo 5 caracteres, solo letras y espacios ---
  const nombre = document.getElementById('nombre').value.trim();
  const errorNombre = document.getElementById('error-nombre');
  if (nombre === '') {
    errorNombre.textContent = 'El nombre es obligatorio.';
    esValido = false;
  } else if (nombre.length < 5) {
    errorNombre.textContent = 'El nombre debe tener al menos 5 caracteres.';
    esValido = false;
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
    errorNombre.textContent = 'El nombre solo puede contener letras y espacios.';
    esValido = false;
  } else {
    errorNombre.textContent = '';
  }

  // --- Validar correo: obligatorio, formato válido ---
  const correo = document.getElementById('correo').value.trim();
  const errorCorreo = document.getElementById('error-correo');
  if (correo === '') {
    errorCorreo.textContent = 'El correo es obligatorio.';
    esValido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errorCorreo.textContent = 'El correo no tiene un formato válido.';
    esValido = false;
  } else {
    errorCorreo.textContent = '';
  }

  // --- Validar fecha: obligatoria, no puede ser pasada ---
  const fecha = document.getElementById('fecha').value;
  const errorFecha = document.getElementById('error-fecha');
  const hoy = new Date().toISOString().split('T')[0];
  if (fecha === '') {
    errorFecha.textContent = 'La fecha es obligatoria.';
    esValido = false;
  } else if (fecha < hoy) {
    errorFecha.textContent = 'La fecha no puede ser en el pasado.';
    esValido = false;
  } else {
    errorFecha.textContent = '';
  }

  // --- Validar número de personas: obligatorio, entre 1 y 20 ---
  const personas = parseInt(document.getElementById('personas').value);
  const errorPersonas = document.getElementById('error-personas');
  if (isNaN(personas)) {
    errorPersonas.textContent = 'El número de personas es obligatorio.';
    esValido = false;
  } else if (personas < 1 || personas > 20) {
    errorPersonas.textContent = 'Debe ser entre 1 y 20 personas.';
    esValido = false;
  } else {
    errorPersonas.textContent = '';
  }

  // Habilita o deshabilita el botón según si todo es válido
  document.getElementById('btn-enviar').disabled = !esValido;

  return esValido;
}

// Agrega una nueva fila a la tabla de reservas
function agregarReserva() {
  // Tomamos los valores del formulario
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const personas = parseInt(document.getElementById('personas').value);

  // Guardamos la reserva en el array
  reservas.push({ nombre, correo, fecha, hora, personas });

  // Creamos una nueva fila en la tabla
  const fila = document.createElement('tr');
  fila.className = 'fila-reserva';

  // Si son 6 o más personas, le ponemos fondo especial
  if (personas >= 6) {
    fila.style.backgroundColor = '#FFF3CD';
  }

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${correo}</td>
    <td>${fecha}</td>
    <td>${hora}</td>
    <td>${personas}</td>
  `;

  document.getElementById('cuerpo-tabla').appendChild(fila);

  // Limpiamos el formulario
  document.getElementById('form-reserva').reset();
  document.getElementById('btn-enviar').disabled = true;

  // Actualizamos el resumen
  actualizarResumen();
}

// Actualiza el resumen debajo de la tabla
function actualizarResumen() {
  const totalReservas = reservas.length;
  const totalPersonas = reservas.reduce(function(suma, r) { return suma + r.personas; }, 0);
  const mayor = reservas.reduce(function(max, r) { return r.personas > max.personas ? r : max; }, reservas[0]);

  const resumen = document.getElementById('resumen');
  resumen.innerHTML = `
    <p>Total de reservas: <strong>${totalReservas}</strong></p>
    <p>Total de personas esperadas: <strong>${totalPersonas}</strong></p>
    <p>Reserva con más personas: <strong>${mayor.nombre} (${mayor.personas} personas)</strong></p>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  renderMenu();

  // Validar en tiempo real cuando el usuario escribe o cambia un campo
  ['nombre', 'correo', 'fecha', 'personas'].forEach(function(id) {
    document.getElementById(id).addEventListener('input', validarFormulario);
  });
});

document.getElementById('form-reserva').addEventListener('submit', function (e) {
  e.preventDefault();
  if (validarFormulario()) {
    agregarReserva();
  }
});