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

const { pathname } = window.location // raw name of path on load
const current = pathname.replace('/courses/', '').split('/')[0].replace('_', ' ') // name of current page on load

const drawer = component('drawer', document.querySelector('.mdc-drawer'))
const appbar = component('top-app-bar', document.querySelector('.mdc-top-app-bar'))
const searchbar = component('text-field', document.querySelector('.mdc-top-app-bar .mdc-text-field'))

const list = document.querySelector('.mdc-drawer .mdc-list')
const main = document.querySelector('main')

list.addEventListener('click', (event) => {
  drawer.open = false;
})

for (const item of list.children) {
  const subject = item.querySelector('.mdc-list-item__text').innerHTML
  if (pathname.startsWith('/courses/')) {
    if (subject.toLowerCase() === current.toLowerCase()) {
      item.setAttribute('aria-current', 'page')
      item.setAttribute('aria-selected', 'true')
      item.classList.add('mdc-list-item--activated')
    } else {
      item.classList.remove('mdc-list-item--activated')
    }
  } else if (pathname === '/') {
    if (subject === 'Home') {
      item.setAttribute('aria-current', 'page')
      item.setAttribute('aria-current', 'page')
      item.setAttribute('aria-selected', 'true')
      item.classList.add('mdc-list-item--activated')
    } else {  
      item.classList.remove('mdc-list-item--activated')
    }
  }
  item.addEventListener('click', async e => {
    e.preventDefault()
    const appbarTitle = await document.querySelector('.mdc-top-app-bar__title')
    if (subject === 'Home') {
      window.history.replaceState({}, '', '/')
      appbarTitle.innerHTML = `IGCSE`
    } else {
      window.history.replaceState({}, '', url(subject, '/courses'))
      appbarTitle.innerHTML = `IGCSE ${subject.toUpperCase()}`
    }
    const response = await fetch((window.location.pathname + '/content').replace('//', '/'))
    const page = await response.text()
    main.innerHTML = page
  })
  component('ripple', item)
}

document.body.addEventListener('MDCDrawer:closed', () => {
  // action after drawer closed
})

appbar.listen('MDCTopAppBar:nav', e => {
  drawer.open = !drawer.open
})