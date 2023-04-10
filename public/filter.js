function searchCard(k, v) {
  const card = document.createElement('div')
  card.classList.add('mdc-card')
  card.innerHTML = `<div class="mdc-card__primary-action">
    <div class="mdc-card__media">
      <span class="material-symbols-rounded">${v.icon}</span>
    </div>
    <div class="mdc-card__ripple"></div>
  </div>
  <div class="mdc-card-wrapper__text-section">
    <h3>${k.split('_').join(' ').toUpperCase()}</h3>
    <p>${v.text}</p>
  </div>
  <div class="mdc-card__actions">
    <div class="mdc-card__action-buttons">
      <button class="mdc-button mdc-card__action mdc-card__action--button" onclick="window.open('${v.path}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Open</span>
      </button>
    </div>
  </div>`
  return card
}

const chipset = mdc.chips.MDCChipSet.attachTo(document.querySelector('.mdc-chip-set'))
const sniper = document.querySelector('#sniper')
const querybar = component('text-field', document.querySelector('.search-actions .mdc-text-field'))

sniper.addEventListener('click', async e => {
  const scopes = []
  const chips = document.querySelectorAll('.mdc-chip--selected')
  const query = querybar.root.querySelector('input').value
  for (const chip of chips) {
    const text = chip.querySelector('.mdc-chip__text').innerHTML
    const words = text.toLowerCase().split(' ')
    const scope = words.join('_')
    scopes.push(scope)
  }
  const response = await fetch(`/api/search?q=${query}${scopes.length ? '&scopes=' + scopes.join(',') : ''}`)
  const data = await response.json()
  if (data.error) return
  const cards = document.querySelector('.search-cards')
  cards.innerHTML = ''
  for (const [k, v] of Object.entries(data)) {
    cards.appendChild(searchCard(k, v))
  }
  for (const button of document.querySelectorAll('.mdc-card .mdc-button')) {
    component('ripple', button)
  }
})