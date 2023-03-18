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

const { pathname } = window.location
const current = pathname.replace('/courses/', '').split('/')[0].replace('_', ' ')

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
    }
  } else if (pathname === '/') {
    if (subject === 'Home') {
      item.setAttribute('aria-current', 'page')
    }
  }
  item.addEventListener('click', e => {
    const appbarTitle = document.querySelector('.mdc-top-app-bar__title')
    console.log(subject)
    if (subject === 'Home') {
      window.history.replaceState({}, '', '/')
    } else {
      window.history.replaceState({}, '', url(subject, '/courses'))
      appbarTitle.innerHTML = `IGCSE ${subject.toUpperCase()}`
    }
  })
  component('ripple', item)
}

document.body.addEventListener('MDCDrawer:closed', () => {
  
})

appbar.listen('MDCTopAppBar:nav', e => {
  drawer.open = !drawer.open
})