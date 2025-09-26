//<!-- actualización diaria 9/26/2025 -->
// main.js - animaciones y modal para galería
document.addEventListener('DOMContentLoaded', ()=>{
  // animate cards on load (stagger)
  const cards = document.querySelectorAll('.card');
  cards.forEach((c,i)=>{
    setTimeout(()=> c.classList.add('visible'), 120*i);
  });
});

function openCategory(url){ window.location.href = url; }

// Modal functions (used in category pages)
function openModal(imgSrc, title){
  const modalBackdrop = document.getElementById('modalBackdrop');
  const content = document.getElementById('modalContent');
  content.innerHTML = '<h3 style="margin-top:0">'+title+'</h3><img src="'+imgSrc+'" style="width:100%;max-height:520px;object-fit:contain;border-radius:8px"/>';
  modalBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ const modalBackdrop = document.getElementById('modalBackdrop'); if(modalBackdrop) modalBackdrop.classList.remove('show'); document.body.style.overflow = ''; }
