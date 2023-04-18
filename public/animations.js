function animate() {
  
}

function transition() {
  const nodes = document.querySelectorAll('.hidden, .offset')
  const hr = document.querySelector('hr')
  const smalls = document.querySelectorAll('.small')
  const path = window.location.pathname.split('/')

  setTimeout(() => {
    for (const node of nodes) {
      node.classList.remove('hidden')
      node.classList.remove('offset')
    }
    if (!(path.length > 3 && path.includes('questions'))) progress.close() // only close if not question page
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