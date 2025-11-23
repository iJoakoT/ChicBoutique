// === CARRITO SIMPLE ===
const cart = [];

function addToCart({ name, price, image }) {
  const existing = cart.find(p => p.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: Number(price) || 0, image, qty: 1 });
  }
  updateCartUI();
}

function removeFromCart(name) {
  const idx = cart.findIndex(p => p.name === name);
  if (idx !== -1) {
    cart.splice(idx, 1);
    updateCartUI();
  }
}

function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  const panel = document.getElementById('cart-panel');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  const totalQty = cart.reduce((s, p) => s + p.qty, 0);
  const totalPrice = cart.reduce((s, p) => s + p.qty * p.price, 0);

  if (countEl) countEl.textContent = totalQty;
  if (totalEl) totalEl.textContent = totalPrice.toFixed(2);

  if (itemsEl) {
    if (!cart.length) {
      itemsEl.innerHTML = '<p style="margin:0;color:#777;font-size:0.85rem;">Tu carrito está vacío.</p>';
    } else {
      itemsEl.innerHTML = cart.map(p => `
        <div class="cart-item">
          ${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}
          <div class="cart-item-main">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-qty">Cantidad: ${p.qty} · S/ ${(p.price * p.qty).toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" aria-label="Quitar" onclick="removeFromCart('${p.name.replace(/'/g,"\\'")}')">×</button>
        </div>
      `).join('');
    }
  }

  if (panel && totalQty === 0) {
    panel.classList.remove('open');
  }
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  if (!panel) return;
  panel.classList.toggle('open');
}

function checkout() {
  if (!cart.length) {
    alert('Tu carrito está vacío.');
    return;
  }
  const resumen = cart
    .map(p => `- ${p.qty} x ${p.name} (S/ ${(p.price * p.qty).toFixed(2)})`)
    .join('\n');
  const total = cart
    .reduce((s, p) => s + p.qty * p.price, 0)
    .toFixed(2);

  alert(
    'Resumen de tu pedido en Chic Boutique:\n\n' +
    resumen +
    `\n\nTotal aproximado: S/ ${total}` +
    '\n\nMétodos de pago simulados:\n' +
    '- Yape / Plin\n' +
    '- Transferencia bancaria (BCP / Interbank)\n' +
    '- Tarjeta de crédito / débito\n\n' +
    'Gracias por tu compra. Tu pedido ha sido registrado y será entregado en un plazo de 3 a 5 días hábiles.\n' +
    'Este flujo es una simulación para efectos del proyecto.'
  );

  cart.splice(0, cart.length);
  updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.target;
      if (url) window.location.href = url;
    });
  });

  const revealEls = document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('reveal-visible'));
  }

  document.querySelectorAll('.btn-gallery').forEach(btn => {
    btn.addEventListener('click', () => {
      const galleryAttr = btn.getAttribute('data-gallery') || '';
      const parts = galleryAttr.split(',').map(s => s.trim()).filter(Boolean);
      const firstImg = parts[0];
      if (firstImg) {
        openModal(firstImg, btn.dataset.title || 'Galería de producto');
      }
    });
  });
  
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation(); 
      const name = btn.dataset.name || 'Producto';
      const price = btn.dataset.price || 0;
      const image = btn.dataset.image || '';
      addToCart({ name, price, image });
      const panel = document.getElementById('cart-panel');
      if (panel) panel.classList.add('open');
    });
  });

  document.querySelectorAll('.product-strip-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      openProductDetail(card);
    });
  });

  updateCartUI();
});

function openCategory(url) {
  if (url) window.location.href = url;
}

function openModal(imgSrc, title) {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const content = document.getElementById('modalContent');
  if (!modalBackdrop || !content) return;

  const safeTitle = title || '';

  content.innerHTML = `
    <h3 style="margin-top:0">${safeTitle}</h3>
    <img src="${imgSrc}" alt="${safeTitle}" style="width:100%;max-height:520px;object-fit:contain;border-radius:8px" />
  `;

  modalBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function openProductDetail(cardEl) {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const content = document.getElementById('modalContent');
  if (!modalBackdrop || !content) return;

  const name = cardEl.dataset.name || cardEl.querySelector('h4')?.textContent.trim() || 'Detalle de producto';
  const price = cardEl.dataset.price || '0';
  const image = cardEl.dataset.image || cardEl.querySelector('img')?.getAttribute('src') || '';
  const statsList = cardEl.querySelector('.product-strip-stats')?.innerHTML || '';

  content.innerHTML = `
    <div class="product-modal">
      <div class="product-modal-img">
        <img src="${image}" alt="${name}">
      </div>
      <div class="product-modal-info">
        <h3>${name}</h3>
        <p class="product-modal-price">S/ ${Number(price).toFixed ? Number(price).toFixed(2) : price}</p>
        <ul class="product-modal-stats">
          ${statsList}
        </ul>
        <button class="btn product-modal-add">Agregar al carrito</button>
      </div>
    </div>
  `;

  const addBtn = content.querySelector('.product-modal-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart({ name, price, image });
      const panel = document.getElementById('cart-panel');
      if (panel) panel.classList.add('open');
      closeModal();
    });
  }

  modalBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

function quickContact(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();

  const name  = (document.getElementById('qname')  && document.getElementById('qname').value)  || '';
  const email = (document.getElementById('qemail') && document.getElementById('qemail').value) || '';
  const msg   = (document.getElementById('qmsg')   && document.getElementById('qmsg').value)   || '';

  alert(`¡Gracias ${name || 'por tu mensaje'}! Te responderemos pronto al correo ${email || '(correo no especificado)'}.`);

  return false;
}
