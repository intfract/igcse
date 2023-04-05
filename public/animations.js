function animate() {
  const hr = document.querySelector('.hero .hero-text hr')

  setTimeout(() => {
    hr.classList.remove('compressed')
  }, 700)
}

function transition() {
  const nodes = document.querySelectorAll('.hidden, .offset')
  setTimeout(() => {
    for (const node of nodes) {
      node.classList.remove('hidden')
      node.classList.remove('offset')
    }
  }, 500);
}