function animate() {
  const heading = document.querySelector('.hero .hero-text h1')
  const hr = document.querySelector('.hero .hero-text hr')

  setTimeout(() => {
    heading.classList.remove('hidden')
    heading.classList.remove('offset')
  }, 1000)

  setTimeout(() => {
    hr.classList.remove('compressed')
  }, 1200)
}

function transition() {
  const nodes = document.querySelectorAll('.hidden, .offset')
  setTimeout(() => {
    for (const node of nodes) {
      node.classList.remove('hidden')
      node.classList.remove('offset')
    }
  }, 1000);
}