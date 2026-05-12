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
  jhRenderCarrito();

  const btn = document.getElementById('jh-btn-agregar');
  btn.textContent = '✓ Agregado';
  setTimeout(() => { btn.textContent = '🛒 Agregar al carrito'; }, 1500);
}

  function jhToggleCarrito() {
  document.getElementById('jh-cart-panel').classList.toggle('jh-cart-panel--active');
}

function jhRenderCarrito() {
  const container = document.getElementById('jh-cart-items');

  if (jhCarrito.length === 0) {
    container.innerHTML = '<div class="jh-cart-empty">Tu carrito está vacío 🌶</div>';
    document.getElementById('jh-cart-total').textContent = 'L. 0';
    return;
  }

  container.innerHTML = jhCarrito.map(p => `
    <div class="jh-cart-item" data-id="${p.id}">
      <img class="jh-cart-item__img" src="${p.foto}" alt="${p.nombre}">
      <div class="jh-cart-item__info">
        <div class="jh-cart-item__nombre">${p.nombre}</div>
        <div class="jh-cart-item__precio">L. ${p.precio}</div>
      </div>
      <div class="jh-cart-item__right">
        <div class="jh-cart-item__qty">
          <button class="jh-qty-sm" onclick="jhCambiarItemCarrito(${p.id}, -1)">−</button>
          <span class="jh-qty-sm-num">${p.cantidad}</span>
          <button class="jh-qty-sm" onclick="jhCambiarItemCarrito(${p.id}, 1)">+</button>
        </div>
        <button class="jh-cart-item__del" onclick="jhEliminarItem(${p.id})">×</button>
      </div>
    </div>
  `).join('');

  const total = jhCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  document.getElementById('jh-cart-total').textContent = 'L. ' + total;
}

function jhCambiarItemCarrito(id, delta) {
  const item = jhCarrito.find(p => p.id === id);
  if (!item) return;
  item.cantidad = Math.max(1, item.cantidad + delta);
  jhActualizarCarrito();
  jhRenderCarrito();
}

function jhEliminarItem(id) {
  jhCarrito = jhCarrito.filter(p => p.id !== id);
  jhActualizarCarrito();
  jhRenderCarrito();
}

function jhVaciarCarrito() {
  jhCarrito = [];
  jhActualizarCarrito();
  jhRenderCarrito();
}

function jhActualizarCarrito() {
  const total = jhCarrito.reduce((acc, p) => acc + p.cantidad, 0);
  const badge = document.getElementById('jh-carrito-badge');
  badge.textContent   = total;
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
  // carrito
  document.getElementById('jh-cart-panel').addEventListener('click', function(e) {
  e.stopPropagation();
});
  document.addEventListener('click', function(e) {
  const panel  = document.getElementById('jh-cart-panel');
  const btn    = document.getElementById('jh-carrito-btn');
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('jh-cart-panel--active');
  }
});

// barra de progreso arriba
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('jh-progress-bar').style.width = scrolled + '%';
});
});

// cursores pers.
const cursor = document.querySelector('.jh-custom-cursor');
const follower = document.querySelector('.jh-cursor-follower');
const links = document.querySelectorAll('a, button, .jh-item');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // retraso para suavidad
    setTimeout(() => {
        follower.style.left = e.clientX - 10 + 'px';
        follower.style.top = e.clientY - 10 + 'px';
    }, 50);
});

// Efecto de expansión 
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        follower.style.transform = 'scale(2)';
        follower.style.background = 'rgba(232, 86, 10, 0.2)';
    });
    link.addEventListener('mouseleave', () => {
        follower.style.transform = 'scale(1)';
        follower.style.background = 'transparent';
    });
});