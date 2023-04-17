function question(number) {
  const button = document.createElement('button')
  button.setAttribute('role', 'tab')
  button.classList.add('mdc-tab')
  button.innerHTML = `<span class="mdc-tab__content">
    <span class="mdc-tab__text-label">${number + 1}</span>
  </span>
  <span class="mdc-tab-indicator">
    <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
  </span>
  <span class="mdc-tab__ripple"></span>`
  return button
}

function update(ctx, index) {
  const item = ctx[index]
  intro.innerHTML = item.intro
  task.innerHTML = item.question
  if (item.image) img.setAttribute('src', item.image)
  for (let i = 0; i < ctx[index].options.length; i++) {
    const option = ctx[index].options[i]
    labels[i].innerHTML = option
  }
}

async function fill() {
  const path = window.location.pathname.split('/')
  const subject = path[2]
  const topic = path[3]
  const response = await fetch(`/api/questions?${new URLSearchParams({ subject, topic })}`)
  const { selective, theory } = await response.json()
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
    update(selective, currentTab)
  })
}

const scroller = document.querySelector('.mdc-tab-scroller__scroll-content')
const formFields = document.querySelectorAll('.mdc-form-field')
const form = document.querySelector('form')
const labels = document.querySelectorAll('.radio label')
const intro = document.querySelector('#intro')
const task = document.querySelector('#task')
const img = document.querySelector('form img')

const scheme = {
  selective: [],
  theory: []
}

let currentTab = 0

form.addEventListener('submit', e => {
  e.preventDefault()
  if (form.radios.value) {
    for (let i = 0; i < form.radios.length; i++) {
      const radio = form.radios[i];
      if (radio.checked) {
        if (i === scheme.selective[currentTab]) {

        } else {
          
        }
      }
    }
  }
})

fill()