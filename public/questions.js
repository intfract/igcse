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