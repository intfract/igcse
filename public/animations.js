function animate() {
  
}

function transition() {
  const nodes = document.querySelectorAll('.hidden, .offset')
  const hr = document.querySelector('hr')
  const callouts = document.querySelectorAll('.callout')

  setTimeout(() => {
    for (const node of nodes) {
      node.classList.remove('hidden')
      node.classList.remove('offset')
    }
  }, 500);
  setTimeout(() => {
    for (const callout of callouts) {
      callout.classList.remove('hidden')
      callout.classList.remove('small')
    }
  }, 500);
  setTimeout(() => {
    hr.classList.remove('compressed')
  }, 700)
}