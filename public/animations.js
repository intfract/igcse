function animate() {
  
}

function transition() {
  const nodes = document.querySelectorAll('.hidden, .offset')
  const hr = document.querySelector('hr')
  const smalls = document.querySelectorAll('.small')

  setTimeout(() => {
    for (const node of nodes) {
      node.classList.remove('hidden')
      node.classList.remove('offset')
    }
  }, 500);
  setTimeout(() => {
    for (const small of smalls) {
      small.classList.remove('hidden')
      small.classList.remove('small')
    }
  }, 500);
  setTimeout(() => {
    hr.classList.remove('compressed')
  }, 700)
}