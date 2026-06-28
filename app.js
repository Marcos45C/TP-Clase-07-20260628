// ════════════════════════════════════════════════════════════════
//  Librería del Sur — app.js
//  Trabajo práctico — Diseño de interfaces gráficas · UNTDF 2025
// ════════════════════════════════════════════════════════════════
//
//  INSTRUCCIONES:
//  Este archivo contiene los datos y la estructura base.
//  Tu trabajo es implementar las funciones marcadas con TODO.
//  No modificar index.html ni el CSS.
//
//  NIVEL A (~40 min): implementar renderGrilla, initFiltros y la modal
//  NIVEL B (~45 min): agregar carrito, wizard y toast
//  NIVEL C (~35 min): agregar búsqueda en vivo, acordeón y historial
// ════════════════════════════════════════════════════════════════


// ── Datos ────────────────────────────────────────────────────────

const libros = [
  {
    id: 1,
    titulo: 'El nombre del viento',
    autor: 'Patrick Rothfuss',
    cat: 'novela',
    precio: 4200,
    desc: 'La historia de Kvothe, un mago legendario que narra su propia vida en una posada al fin del mundo. Una épica historia de magia, amor y misterio que redefine la fantasía moderna.',
    resena: 'Una obra maestra de la fantasía contemporánea. Rothfuss construye un mundo increíblemente detallado con una prosa poética que atrapa desde la primera página.'
  },
  {
    id: 2,
    titulo: 'Una breve historia del tiempo',
    autor: 'Stephen Hawking',
    cat: 'ciencia',
    precio: 3800,
    desc: 'Uno de los libros de divulgación científica más vendidos de la historia. Hawking explica los grandes misterios del universo de manera accesible para el público general.',
    resena: 'Hawking logra explicar conceptos complejos como los agujeros negros y el Big Bang con claridad y humor. Imprescindible para cualquier persona curiosa sobre el cosmos.'
  },
  {
    id: 3,
    titulo: 'No me hagas pensar',
    autor: 'Steve Krug',
    cat: 'diseno',
    precio: 5100,
    desc: 'El clásico de la usabilidad web. Krug presenta principios claros para diseñar sitios y aplicaciones intuitivos que los usuarios puedan navegar sin esfuerzo.',
    resena: 'Lectura obligatoria para cualquier diseñador o desarrollador web. Sus principios siguen siendo relevantes décadas después de su primera publicación.'
  },
  {
    id: 4,
    titulo: 'Sapiens',
    autor: 'Yuval Noah Harari',
    cat: 'ciencia',
    precio: 4600,
    desc: 'Un recorrido fascinante por la historia de la humanidad, desde los primeros homínidos hasta la era digital. Harari desafía muchas de nuestras ideas preconcebidas sobre el progreso.',
    resena: 'Un libro que cambia la forma en que ves el mundo. Harari conecta la biología, la historia y la filosofía de una manera que hace imposible dejar de leer.'
  },
  {
    id: 5,
    titulo: 'El diseño de lo cotidiano',
    autor: 'Don Norman',
    cat: 'diseno',
    precio: 4900,
    desc: 'Norman explica por qué algunos objetos y sistemas nos frustran mientras otros funcionan de manera intuitiva. Un análisis profundo del diseño centrado en el usuario.',
    resena: 'Después de leer este libro, nunca más vas a ver una puerta, una estufa o un control remoto de la misma manera. Norman abre los ojos sobre el poder del buen diseño.'
  },
  {
    id: 6,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    cat: 'novela',
    precio: 3500,
    desc: 'La obra cumbre del realismo mágico narra la historia de la familia Buendía a lo largo de siete generaciones en el ficticio pueblo de Macondo.',
    resena: 'Una de las novelas más importantes del siglo XX. García Márquez mezcla lo fantástico y lo cotidiano de una manera que solo él pudo lograr.'
  },
  {
    id: 7,
    titulo: 'El universo elegante',
    autor: 'Brian Greene',
    cat: 'ciencia',
    precio: 4100,
    desc: 'Greene presenta la teoría de supercuerdas y sus implicaciones para nuestra comprensión del cosmos. Una exploración fascinante de los límites de la física moderna.',
    resena: 'Greene tiene el don de hacer que la física teórica más compleja sea apasionante. Un libro que expande los límites de lo que creemos posible.'
  },
  {
    id: 8,
    titulo: 'Thinking with Type',
    autor: 'Ellen Lupton',
    cat: 'diseno',
    precio: 5600,
    desc: 'La guía definitiva sobre tipografía para diseñadores. Lupton explora la historia, la teoría y la práctica del uso de tipos en el diseño gráfico y digital.',
    resena: 'El libro de tipografía más completo y accesible que existe. Esencial para cualquiera que trabaje con texto e imagen. Las referencias visuales son extraordinarias.'
  },
];


// ── Estado de la aplicación ──────────────────────────────────────

let carrito   = [];   // Nivel B: array de objetos { libro, cantidad }
let historial = [];   // Nivel C: array de ids de libros visitados
let filtroActivo  = 'todos';  // categoría seleccionada
let terminoBusqueda = '';     // Nivel C: término del buscador


// ── Referencias al DOM ───────────────────────────────────────────

const grilla        = document.getElementById('grilla-libros');
const modal         = document.getElementById('modal');
const modalOverlay  = document.getElementById('modal-overlay');
const modalCerrar   = document.getElementById('modal-cerrar');
const modalBody     = document.getElementById('modal-body');
const btnCarrito    = document.getElementById('btn-carrito');
const carritoCount  = document.getElementById('carrito-count');
const toastContainer = document.getElementById('toast-container');
const buscador      = document.getElementById('buscador');
const historialLista = document.getElementById('historial-lista');


// ════════════════════════════════════════════════════════════════
//  NIVEL A — Catálogo con filtros y modal de detalle
// ════════════════════════════════════════════════════════════════

/**
 * renderGrilla(lista)
 * Recibe un array de libros y construye las tarjetas en #grilla-libros.
 * IMPORTANTE: usar createElement y appendChild, NO innerHTML.
 *
 * Cada tarjeta (.libro-card) debe contener:
 *   - .libro-titulo  → título del libro
 *   - .libro-autor   → autor
 *   - .libro-cat     → badge de categoría (clases: cat-novela / cat-ciencia / cat-diseno)
 *   - .libro-precio  → precio formateado como "$4.200"
 *   - .btn-agregar   → botón "Agregar al carrito" (Nivel B)
 *
 * Al hacer click en la tarjeta (no en el botón) debe abrirse la modal de detalle.
 */
function renderGrilla(lista) {

  // Limpiar la grilla antes de volver a dibujarla
  grilla.innerHTML = "";

  // Si no hay libros
  if (lista.length === 0) {
    const mensaje = document.createElement("div");
    mensaje.classList.add("empty-state");
    mensaje.textContent = "No se encontraron libros.";
    grilla.appendChild(mensaje);
    return;
  }

  // Recorrer cada libro
  lista.forEach(libro => {

    // Tarjeta principal
    const card = document.createElement("div");
    card.classList.add("libro-card");

    // Título
    const titulo = document.createElement("h2");
    titulo.classList.add("libro-titulo");
    titulo.textContent = libro.titulo;

    // Autor
    const autor = document.createElement("p");
    autor.classList.add("libro-autor");
    autor.textContent = libro.autor;

    // Categoría
    const categoria = document.createElement("span");
    categoria.classList.add("libro-cat");
    categoria.classList.add("cat-" + libro.cat);
    categoria.textContent = libro.cat;

    // Precio
    const precio = document.createElement("p");
    precio.classList.add("libro-precio");

    precio.textContent =
      "$" + libro.precio.toLocaleString("es-AR");

    // Botón agregar
    const boton = document.createElement("button");
    boton.classList.add("btn-agregar");
    boton.textContent = "Agregar al carrito";

    // Evita que al tocar el botón se abra la modal
    boton.addEventListener("click", function(e){
      e.stopPropagation();
      agregarAlCarrito(libro);
    });

    // Abrir modal al hacer click en la tarjeta
    card.addEventListener("click", function(){
      abrirModalLibro(libro);
    });

    // Agregar elementos a la tarjeta
    card.appendChild(titulo);
    card.appendChild(autor);
    card.appendChild(categoria);
    card.appendChild(precio);
    card.appendChild(boton);

    // Agregar tarjeta a la grilla
    grilla.appendChild(card);

  });

}



/**
 * initFiltros()
 * Agrega listeners a cada .filtro-btn.
 * Al hacer click: marcar el botón como .activo, guardar filtroActivo
 * y volver a renderizar aplicando el filtro.
 */
function initFiltros() {
  // Obtener todos los botones de filtro
  const botones = document.querySelectorAll(".filtro-btn");

  // Recorrer cada botón
  botones.forEach(function(boton){

    boton.addEventListener("click", function(){

      // Quitar la clase activo de todos
      botones.forEach(function(btn){
        btn.classList.remove("activo");
      });

      // Agregar activo al botón seleccionado
      boton.classList.add("activo");

      // Guardar la categoría elegida
      filtroActivo = boton.dataset.cat;

      // Volver a dibujar la grilla
      aplicarFiltros();

    });

  });

}


/**
 * aplicarFiltros()
 * Filtra el array `libros` según filtroActivo y terminoBusqueda (Nivel C)
 * y llama a renderGrilla con el resultado.
 */
function aplicarFiltros() {
  // Filtrar por categoría
  let resultado = libros.filter(function(libro){

    if(filtroActivo === "todos"){
      return true;
    }

    return libro.cat === filtroActivo;

  });

  // Dibujar la nueva lista
  renderGrilla(resultado);
}


// ── Modal de detalle del libro ───────────────────────────────────

/**
 * abrirModalLibro(libro)
 * Muestra la modal con el detalle del libro recibido.
 * Rellena #modal-body con: título, autor, descripción, precio y botón de compra.
 * Registra la visita en el historial (Nivel C).
 */
function abrirModalLibro(libro) {
 // Limpiar contenido anterior
  modalBody.innerHTML = "";

  // Título
  const titulo = document.createElement("h2");
  titulo.classList.add("modal-titulo");
  titulo.textContent = libro.titulo;

  // Autor
  const autor = document.createElement("p");
  autor.classList.add("modal-autor");
  autor.textContent = "Autor: " + libro.autor;

  // Descripción
  const descripcion = document.createElement("p");
  descripcion.classList.add("modal-desc");
  descripcion.textContent = libro.desc;

  // Precio
  const precio = document.createElement("p");
  precio.classList.add("modal-precio");
  precio.textContent = "$" + libro.precio.toLocaleString("es-AR");

  // Botón
  const boton = document.createElement("button");
  boton.classList.add("modal-btn-comprar");
  boton.textContent = "Agregar al carrito";

  boton.addEventListener("click", function () {
    agregarAlCarrito(libro);
    cerrarModal();
  });

  // Agregar elementos
  modalBody.appendChild(titulo);
  modalBody.appendChild(autor);
  modalBody.appendChild(descripcion);
  modalBody.appendChild(precio);
  modalBody.appendChild(boton);

  // Mostrar modal
  modal.classList.remove("oculta");
  modal.setAttribute("aria-hidden", "false");

}


/**
 * cerrarModal( 
 * Oculta la modal y limpia su contenido.
 */
function cerrarModal() {
  modal.classList.add("oculta");
  modal.setAttribute("aria-hidden", "true");  

  modalBody.innerHTML = "";
}


/**
 * initModal()
 * Registra los listeners para cerrar la modal:
 * botón ✕, click en overlay y tecla Escape.
 */
function initModal() {
  console.log("Init Modal");

  modalCerrar.addEventListener("click", cerrarModal);

  modalOverlay.addEventListener("click", cerrarModal);

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      cerrarModal();
    }
  });
}


// ════════════════════════════════════════════════════════════════
//  NIVEL B — Carrito + Wizard de checkout + Toast
// ════════════════════════════════════════════════════════════════

/**
 * agregarAlCarrito(libro)
 * Agrega el libro al array carrito[].
 * Si el libro ya existe, incrementa su cantidad.
 * Actualiza el contador visible en el header.
 */
function agregarAlCarrito(libro) {
  // Buscar si el libro ya está en el carrito
  const item = carrito.find(function(elemento){
    return elemento.libro.id === libro.id;
  });

  if(item){
    // Si ya existe, aumentar cantidad
    item.cantidad++;
  }else{
    // Si no existe, agregarlo
    carrito.push({
      libro: libro,
      cantidad: 1
    });
  }

  // Calcular cantidad total
  let total = 0;

  carrito.forEach(function(item){
    total += item.cantidad;
  });

  carritoCount.textContent = total;

  // Mostrar toast
  mostrarToast(libro.titulo + " agregado al carrito", "info");
}


/**
 * abrirModalCarrito()
 * Muestra la modal con el listado del carrito y el total.
 * Si el carrito está vacío, mostrar un mensaje.
 * Incluye un botón "Iniciar compra" que lanza el wizard.
 */
function abrirModalCarrito() {
   // Limpiar la modal
  modalBody.innerHTML = "";

  // Si el carrito está vacío
  if (carrito.length === 0) {

    const mensaje = document.createElement("p");
    mensaje.textContent = "El carrito está vacío.";

    modalBody.appendChild(mensaje);

  } else {

    let total = 0;

    carrito.forEach(function(item){

      const fila = document.createElement("div");
      fila.classList.add("carrito-item");

      const titulo = document.createElement("span");
      titulo.classList.add("carrito-item-titulo");
      titulo.textContent = item.libro.titulo + " x" + item.cantidad;

      const precio = document.createElement("span");
      precio.classList.add("carrito-item-precio");

      const subtotal = item.libro.precio * item.cantidad;

      precio.textContent = "$" + subtotal.toLocaleString("es-AR");

      total += subtotal;

      fila.appendChild(titulo);
      fila.appendChild(precio);

      modalBody.appendChild(fila);

    });

    // Total
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("carrito-total");

    const textoTotal = document.createElement("span");
    textoTotal.textContent = "Total";

    const montoTotal = document.createElement("span");
    montoTotal.textContent = "$" + total.toLocaleString("es-AR");

    totalDiv.appendChild(textoTotal);
    totalDiv.appendChild(montoTotal);

    modalBody.appendChild(totalDiv);

    // Botón iniciar compra
    const boton = document.createElement("button");
    boton.classList.add("modal-btn-comprar");
    boton.textContent = "Iniciar compra";

    boton.addEventListener("click", function(){

      //initWizard();
      confirmarCompra();
    });

    modalBody.appendChild(boton);

  }

  modal.classList.remove("oculta");
  modal.setAttribute("aria-hidden", "false");
}


/**
 * initWizard()
 * Lanza el wizard de checkout de 3 pasos dentro de #modal-body.
 * Paso 1: datos de envío (nombre, dirección)
 * Paso 2: medio de pago (radio buttons: tarjeta / transferencia / efectivo)
 * Paso 3: resumen y botón de confirmación
 */
function initWizard() {
  let pasoActual = 0;
  const pasos = ['Envío', 'Pago', 'Confirmar'];

  // TODO: renderizar el indicador de pasos (.wizard-steps) y el panel actual
  // TODO: botón "Anterior" deshabilitado en el paso 0
  // TODO: botón "Siguiente" valida el paso actual antes de avanzar;
  //       en el último paso muestra "Confirmar" y llama a confirmarCompra()

  function renderPaso() {
    // TODO: limpiar modalBody y construir:
    //   - el track de pasos con .wizard-dot (done/current/pending)
    //   - el .wizard-panel del paso actual con sus campos
    //   - los botones de navegación (.wizard-btns)
  }

  function validarPaso(n) {
    // TODO: verificar que los campos del paso n estén completos
    // TODO: si hay errores, insertar .error-msg con createElement
    // TODO: retornar true si el paso es válido, false si no
  }

  renderPaso();
}


/**
 * confirmarCompra()
 * Se llama al confirmar en el último paso del wizard.
 * Vacía el carrito, cierra la modal y muestra un toast de éxito.
 */
function confirmarCompra() {
  
  // Vaciar carrito
  carrito = [];

  // Actualizar contador
  carritoCount.textContent = "0";

  // Cerrar modal
  cerrarModal();

  // Mensaje
  mostrarToast(
    "¡Compra confirmada! Gracias por tu pedido.",
    "exito"
  );
}


/**
 * mostrarToast(mensaje, tipo)
 * Crea un .toast con la clase del tipo ('exito' | 'error' | 'info'),
 * lo inserta en #toast-container y lo elimina automáticamente tras 4 segundos.
 * @param {string} mensaje
 * @param {'exito'|'error'|'info'} tipo
 */
function mostrarToast(mensaje, tipo = 'info') {
  //console.log(mensaje);

  
  // Crear el toast
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add(tipo);

  toast.textContent = mensaje;

  // Agregar al contenedor
  toastContainer.appendChild(toast);

  // Eliminar luego de 4 segundos
  setTimeout(function(){

    toast.remove();

  }, 4000);
}


// ════════════════════════════════════════════════════════════════
//  NIVEL C — Búsqueda en vivo + Acordeón de reseñas + Historial
// ════════════════════════════════════════════════════════════════

/**
 * initBuscador()
 * Escucha el evento 'input' en #buscador.
 * Actualiza terminoBusqueda y llama a aplicarFiltros().
 * Si no hay resultados, inserta un mensaje con createElement.
 */
function initBuscador() {
  // TODO: listener en #buscador para el evento 'input'
  // TODO: actualizar terminoBusqueda con el valor del input (trim + toLowerCase)
  // TODO: llamar a aplicarFiltros()
  // TODO: si la grilla queda vacía, mostrar mensaje "Sin resultados para [término]"
  //       creado con createElement e insertado después del buscador
}


/**
 * agregarAcordeonResena(card, libro)
 * Agrega un botón .resena-trigger y un .resena-cuerpo a la tarjeta recibida.
 * El botón alterna la clase .abierta en el cuerpo y actualiza aria-expanded.
 * Cierra los otros acordeones abiertos antes de abrir uno nuevo.
 * Responde tanto a 'click' como a 'keydown' (Enter).
 *
 * @param {HTMLElement} card   - la tarjeta .libro-card
 * @param {Object}      libro  - el objeto del libro con .resena
 */
function agregarAcordeonResena(card, libro) {
  // TODO: crear el botón .resena-trigger con texto "Ver reseña"
  //       y atributo aria-expanded="false"
  // TODO: crear el div .resena-cuerpo con el texto de libro.resena
  // TODO: en el listener del botón (click y keydown Enter):
  //   1. cerrar todos los otros .resena-cuerpo.abierta
  //   2. toggle de la clase .abierta en este cuerpo
  //   3. actualizar aria-expanded según el estado
  // TODO: insertar trigger y cuerpo en la tarjeta
}


/**
 * registrarHistorial(libroId)
 * Agrega el id al array historial[] (sin duplicados, máximo 5 entradas).
 * Luego llama a renderHistorial().
 *
 * @param {number} libroId
 */
function registrarHistorial(libroId) {
  // TODO: eliminar el id si ya existe en historial (evitar duplicados)
  // TODO: agregar el id al principio del array (unshift)
  // TODO: recortar el array a los primeros 5 elementos
  // TODO: llamar a renderHistorial()
}


/**
 * renderHistorial()
 * Construye la lista de libros visitados en #historial-lista con createElement.
 * Cada ítem es un .historial-item clickeable que abre la modal del libro.
 */
function renderHistorial() {
  // TODO: limpiar #historial-lista
  // TODO: si historial está vacío, mostrar el mensaje por defecto
  // TODO: por cada id en historial, encontrar el libro y crear
  //       un .historial-item con el título que al clickearse
  //       llame a abrirModalLibro(libro)
}


// ════════════════════════════════════════════════════════════════
//  Inicialización — punto de entrada
// ════════════════════════════════════════════════════════════════

function init() {
  renderGrilla(libros);   // Nivel A
  initFiltros();          // Nivel A
  initModal();            // Nivel A
  // initBuscador();      // Descomentar en Nivel C
  btnCarrito.addEventListener('click', abrirModalCarrito); // Nivel B
}

document.addEventListener('DOMContentLoaded', init);
