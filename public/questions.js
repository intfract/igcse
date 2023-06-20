const scroller = document.querySelector('.mdc-tab-scroller__scroll-content')
const form = document.querySelector('form')
const labels = document.querySelectorAll('.radio label')
const intro = document.querySelector('#intro')
const task = document.querySelector('#task')
const img = document.querySelector('form img')
const ol = document.querySelector('form ol')
const chipset = mdc.chips.MDCChipSet.attachTo(document.querySelector('.mdc-chip-set'))
const difficulty = document.querySelector('#difficulty')
const dialog = component('dialog', document.querySelector('.mdc-dialog'))
const dialogTitle = document.querySelector('#dialog-title')
const dialogContent = document.querySelector('#dialog-content')
document.querySelector('form h3').innerHTML = window.location.pathname.split('/').at(-1).toUpperCase().split('_').join(' ')

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

function getDifficulty(num) {
  switch (num) {
    case 0:
      return 'Easy'
    case 1:
      return 'Medium'
    case 2:
      return 'Hard'
    case 3:
      return 'Tough'
    default:
      return 'Unknown'
  }
}

function update(ctx, index) {
  const item = ctx[index]
  intro.innerHTML = item.intro
  task.innerHTML = item.question
  difficulty.innerHTML = getDifficulty(item.difficulty)
  if (item.image) {
    img.setAttribute('src', `../../../images/${item.image}`)
    img.removeAttribute('style')
  } else {
    img.setAttribute('style', 'display: none;')
  }
  if (item.statements.length) {
    ol.innerHTML = ''
    for (const statement of item.statements) {
      ol.innerHTML += `<li>${statement}</li>`
    }
    ol.removeAttribute('style')
  } else {
    ol.setAttribute('style', 'display: none;')
  }
  dialogContent.innerHTML = ctx[index].explanation.replaceAll('\n', '<br>'.repeat(2))
  for (let i = 0; i < ctx[index].options.length; i++) {
    const option = ctx[index].options[i]
    labels[i].innerHTML = option
  }
}