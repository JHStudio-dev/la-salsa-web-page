// ── Carrito improvisado ──
let jhCarrito = [];

function jhAbrirModal(id) {
  const platillo = JH_MENU.find(p => p.id === id);
  if (!platillo) return;

  document.getElementById('jh-modal-img').src             = platillo.foto;
  document.getElementById('jh-modal-badge').textContent   = platillo.badge;
  document.getElementById('jh-modal-nombre').textContent  = platillo.nombre;
  document.getElementById('jh-modal-desc').textContent    = platillo.descripcion;
  document.getElementById('jh-modal-precio').textContent  = 'L. ' + platillo.precio;
  document.getElementById('jh-modal-cantidad').textContent = '1';
  document.getElementById('jh-modal-id').value            = platillo.id;

  const tagsEl = document.getElementById('jh-modal-tags');
  tagsEl.innerHTML = platillo.tags
    .map(t => `<span class="jh-tag">${t}</span>`)
    .join('');

  document.getElementById('jh-modal').classList.add('jh-modal--active');
}

function jhCerrarModal() {
  document.getElementById('jh-modal').classList.remove('jh-modal--active');
}

function jhCambiarCantidad(delta) {
  const el  = document.getElementById('jh-modal-cantidad');
  const val = Math.max(1, parseInt(el.textContent) + delta);
  el.textContent = val;
}

function jhAgregarAlCarrito() {
  const id       = parseInt(document.getElementById('jh-modal-id').value);
  const cantidad = parseInt(document.getElementById('jh-modal-cantidad').textContent);
  const platillo = JH_MENU.find(p => p.id === id);
  if (!platillo) return;

  const existente = jhCarrito.find(p => p.id === id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    jhCarrito.push({ ...platillo, cantidad });
  }

  jhActualizarCarrito();

  const btn = document.getElementById('jh-btn-agregar');
  btn.textContent = '✓ Agregado';
  setTimeout(() => { btn.textContent = '🛒 Agregar al carrito'; }, 1500);
}

function jhActualizarCarrito() {
  const total  = jhCarrito.reduce((acc, p) => acc + p.cantidad, 0);
  const badge  = document.getElementById('jh-carrito-badge');
  badge.textContent  = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function jhPedirWhatsapp() {
  if (jhCarrito.length === 0) return;

  let mensaje = '🌶 *Pedido La Salsa*\n\n';
  let total   = 0;

  jhCarrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;
    mensaje += `• ${p.nombre} x${p.cantidad} — L. ${subtotal}\n`;
  });

  mensaje += `\n*Total: L. ${total}*\n\n¡Gracias! 😊`;

  const url = `https://wa.me/${JH_EMPRESA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll
  const navbar = document.querySelector('.jh-navbar');
  const jhHandleScroll = () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', jhHandleScroll);
  jhHandleScroll();

  // Slider → abrir modal
  document.querySelectorAll('.jh-item').forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => jhAbrirModal(index + 1));
  });

  // Cerrar modal al hacer click en el fondo
  document.getElementById('jh-modal').addEventListener('click', function (e) {
    if (e.target === this) jhCerrarModal();
  });

});