function row(subject, topic, index, difficulty, length) {
  const tr = document.createElement('tr')
  tr.classList.add('mdc-data-table__row')
  tr.dataset.rowId = 'u' + index
  tr.innerHTML = `<td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
    <div class="mdc-checkbox mdc-data-table__row-checkbox">
      <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="u0"/>
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
      <div class="mdc-checkbox__ripple"></div>
    </div>
  </td>
  <th class="mdc-data-table__cell" scope="row" id="u${index}"><a href="${subject}/${topic}">${topic.toUpperCase().split('_').join(' ')}</a></th>
  <td class="mdc-data-table__cell">${difficulty}</td>
  <td class="mdc-data-table__cell">${length}</td>`
  return tr
}

async function fill() {
  const tableContent = document.querySelector('.mdc-data-table__content')
  const path = window.location.pathname.split('/')
  const subject = path[2]
  const response = await fetch(`/api/questions?${new URLSearchParams({ subject })}`)
  const data = await response.json()
  const topics = Object.keys(data)
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    const { selective, theory } = data[topic]
    const total = selective.length + theory.length
    let average = 0
    let difficulty = ''
    for (const o of selective) {
      average += o.difficulty
    }
    for (const o of theory) {
      average += o.difficulty
    }
    average /= total
    switch (Math.round(average)) {
      case 0:
        difficulty = 'Easy'
        break
      case 1:
        difficulty = 'Medium'
        break
      case 2:
        difficulty = 'Hard'
        break
      case 3:
        difficulty = 'Tough'
        break
      default:
        break
    }
    tableContent.appendChild(row(subject, topic, i, difficulty, total))
  }
  dataTable = component('data-table', table)
  document.querySelector('.mdc-data-table + .mdc-button').addEventListener('click', e => {
    const selectedTopics = []
    const selectiveQuestions = []
    for (const row of dataTable.getSelectedRowIds()) {
      selectedTopics.push(document.querySelector(`#${row} a`).innerHTML.toLowerCase().split(' ').join('_'))
    }
    for (const topic of selectedTopics) {
      const { selective, theory } = data[topic]
      for (let i = 0; i < selective.length; i++) {
        const item = selective[i]
        selectiveQuestions.push(item)
        scroller.appendChild(question(i))
        scheme.selective.push(selective[i].scheme)
      }
    }
    update(selectiveQuestions, 0)
    const tabbar = component('tab-bar', document.querySelector('.mdc-tab-bar'))
    tabbar.activateTab(0)
    tabbar.root.addEventListener('MDCTabBar:activated', e => {
      currentTab = e.detail.index
      for (const radio of form.radios) {
        radio.checked = false
      }
      update(selectiveQuestions, currentTab)
    })
    progress.close()
  })
}

const table = document.querySelector('.mdc-data-table')
const scroller = document.querySelector('.mdc-tab-scroller__scroll-content')
const form = document.querySelector('form')
const labels = document.querySelectorAll('.radio label')
const intro = document.querySelector('#intro')
const task = document.querySelector('#task')
const img = document.querySelector('form img')
const ol = document.querySelector('form ol')
const dialog = component('dialog', document.querySelector('.mdc-dialog'))
const dialogTitle = document.querySelector('#dialog-title')
const dialogContent = document.querySelector('#dialog-content')
document.querySelector('form h3').innerHTML = window.location.pathname.split('/').at(-1).toUpperCase()
let dataTable

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