async function fill() {
  const path = window.location.pathname.split('/')
  const subject = path[2]
  const topic = path[3]
  const response = await fetch(`/api/questions?${new URLSearchParams({ subject, topic })}`)
  const { selective, theory } = await response.json()
  scroller.innerHTML = ''
  for (let i = 0; i < selective.length; i++) {
    const item = selective[i]
    scroller.appendChild(question(i))
    scheme.selective.push(selective[i].scheme)
  }
  update(selective, 0)
  const tabbar = component('tab-bar', document.querySelector('.mdc-tab-bar'))
  tabbar.activateTab(0)
  tabbar.root.addEventListener('MDCTabBar:activated', e => {
    currentTab = e.detail.index
    for (const radio of form.radios) {
      radio.checked = false
    }
    update(selective, currentTab)
  })
  progress.close()
}

const scheme = {
  selective: [],
  theory: []
}

let currentTab = 0

form.addEventListener('submit', e => {
  e.preventDefault()
  if (form.radios.value) {
    for (let i = 0; i < form.radios.length; i++) {
      const radio = form.radios[i]
      if (radio.checked) {
        dialog.open()
        if (i === scheme.selective[currentTab]) {
          dialogTitle.innerHTML = 'Correct!'
        } else {
          dialogTitle.innerHTML = 'Incorrect!'
        }
      }
    }
  }
})

fill()