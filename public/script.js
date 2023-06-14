function sentence(text) {
  return text[0].toUpperCase() + text.substr(1)
}

function camel(text) {
  const words = text.split('-')
  for (let i = 0; i < words.length; i++) {
    if (i) words[i] = sentence(words[i])
  }
  return words.join('')
}

function pascal(text) {
  const words = text.split('-')
  for (let i = 0; i < words.length; i++) {
    words[i] = sentence(words[i])
  }
  return words.join('')
}

function url(text, context) {
  return context + '/' + text.toLowerCase().split(' ').join('_')
}

function component(name, element) {
  return mdc[camel(name)][`MDC${pascal(name)}`].attachTo(element)
}

function navigate(pathname, current) {
  transition()
  for (const item of nav.children) {
    const subject = item.querySelector('.mdc-list-item__text').innerHTML
    if (pathname.startsWith('/courses/')) {
      if (subject.toLowerCase() === current.toLowerCase()) {
        item.setAttribute('aria-current', 'page')
        item.setAttribute('aria-selected', 'true')
        item.classList.add('mdc-list-item--activated')
      } else {
        item.removeAttribute('aria-current')
        item.removeAttribute('aria-selected')
        item.classList.remove('mdc-list-item--activated')
      }
    } else if (pathname === '/') {
      if (subject === 'Home') {
        item.setAttribute('aria-current', 'page')
        item.setAttribute('aria-current', 'page')
        item.setAttribute('aria-selected', 'true')
        item.classList.add('mdc-list-item--activated')
        animate()
      } else { 
        item.classList.remove('mdc-list-item--activated')
      }
    }
  }
}

function searchItem(k, v) {
  const result = document.createElement('li')
  const words = k.split('_')
  const name = words.length > 1 ? words.reduce((p, c) => c === 'and' ? sentence(p) + ' ' + c : sentence(p) + ' ' + sentence(c)) : sentence(words[0])
  result.classList.add('mdc-list-item')
  result.innerHTML = `<span class="mdc-list-item__ripple"></span>
  <span class="material-symbols-rounded mdc-list-item__graphic">
  ${v.icon}
  </span>
  <span class="mdc-list-item__text">
  ${name}
  </span>`
  result.addEventListener('click', e => window.open(v.path))
  return result
}

const drawer = component('drawer', document.querySelector('.mdc-drawer'))
const appbar = component('top-app-bar', document.querySelector('.mdc-top-app-bar'))
const searchbar = component('text-field', document.querySelector('.mdc-top-app-bar .mdc-text-field'))
const menu = component('menu', document.querySelector('.mdc-menu'))
const progress = component('linear-progress', document.querySelector('.mdc-linear-progress'))

const searchTopic = document.querySelector('#search-topic')
const searchCourse = document.querySelector('#search-course')

const title = document.querySelector('title')
const input = document.querySelector('.mdc-top-app-bar .mdc-text-field__input')
const searchbtn = document.querySelector('.mdc-top-app-bar button[aria-label="Search"]')
const morebtn = document.querySelector('.mdc-top-app-bar button[aria-label="Options"]')

const buttons = document.querySelectorAll('.mdc-button')
const tables = document.querySelectorAll('.mdc-data-table')
const lists = document.querySelectorAll('.mdc-list')
const emojiables = document.querySelectorAll('p, li, .callout')

const nav = document.querySelector('.mdc-drawer .mdc-list')
const main = document.querySelector('main')

const { pathname } = window.location
const current = pathname.replace('/courses/', '').split('/')[0].replace('_', ' ')

const demoSlider = document.querySelector('.mdc-slider')
const [object, image] = [document.querySelector('#object'), document.querySelector('#image')]

if (demoSlider) {
  const slider = component('slider', demoSlider)
  const { min, max } = demoSlider.querySelector('input').attributes
  const { width } = demoSlider.getBoundingClientRect()
  const ratio = width / (max.value - min.value)
  const constant = 24 // mdc-slider margin
  console.log(ratio)
  if (object && image) {
    object.style.left = `${slider.getValue() * ratio + constant}px`
    slider.listen('MDCSlider:input', e => {
      const { value } = e.detail
      object.style.left = `${value * ratio + constant}px`
    })
  }
}

for (const emojiable of emojiables) {
  twemoji.parse(emojiable)
}

for (const button of buttons) {
  component('ripple', button)
}

for (const table of tables) {
  component('data-table', table)
}

for (const list of lists) {
  component('list', list).listElements.map(x => component('ripple', x))
}

navigate(pathname, current)

nav.addEventListener('click', (event) => {
  drawer.open = false;
})

for (const item of nav.children) {
  const subject = item.querySelector('.mdc-list-item__text').innerHTML
  item.addEventListener('click', async e => {
    e.preventDefault()
    const appbarTitle = await document.querySelector('.mdc-top-app-bar__title')
    if (subject === 'Home') {
      window.history.replaceState({}, '', '/')
      const name = `IGCSE`
      title.innerHTML = name
      appbarTitle.innerHTML = name
    } else {
      window.history.replaceState({}, '', url(subject, '/courses'))
      const name = `IGCSE ${subject.toUpperCase()}`
      title.innerHTML = name
      appbarTitle.innerHTML = name
    }
    const { pathname } = window.location
    const current = pathname.replace('/courses/', '').split('/')[0].replace('_', ' ')
    const chunks = pathname.split('/')
    chunks.shift()
    chunks[0] = ''
    progress.open()
    const response = await fetch(('/content' + chunks.join('/')).replace('//', '/'))
    const page = await response.text()
    main.innerHTML = page
    navigate(pathname, current)
  })
  component('ripple', item)
}

document.body.addEventListener('MDCDrawer:closed', () => {
  // action after drawer closed
})

appbar.listen('MDCTopAppBar:nav', e => {
  drawer.open = !drawer.open
})

searchbar.root.addEventListener('input', async e => {
  const query = await input.value
  const response = await fetch(`/api/search?q=${query}`)
  const data = await response.json()
  searchTopic.innerHTML = ''
  searchCourse.innerHTML = ''
  if (data.error) return
  for (const [k, v] of Object.entries(data)) {
    if (v.topic) {
      searchTopic.appendChild(searchItem(k, v))
    } else {
      searchCourse.appendChild(searchItem(k, v))
    }
  }
  component('list', searchTopic).listElements.map(x => component('ripple', x))
  component('list', searchCourse).listElements.map(x => component('ripple', x))
})

searchbtn.addEventListener('click', e => {
  window.open(`/search?q=${input.value}`)
})

morebtn.addEventListener('click', e => {
  menu.open = true
})