function row(subject, topic, index, difficulty, length) {
  const tr = document.createElement('tr')
  tr.classList.add('mdc-data-table__row')
  // tr.dataset['row-id'] = 'u' + index
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
    let difficulty = 0
    for (const o of selective) {
      difficulty += o.difficulty
    }
    for (const o of theory) {
      difficulty += o.difficulty
    }
    difficulty /= total
    tableContent.appendChild(row(subject, topic, i, difficulty, total))
  }
}

fill()