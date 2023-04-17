function tabber(i) {
  const button = document.createElement('button')
  button.setAttribute('role', 'tab')
  button.innerHTML = `<span class="mdc-tab__content">
  <span class="mdc-tab__text-label">${i}</span>
</span>
<span class="mdc-tab-indicator mdc-tab-indicator--active">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
</span>
<span class="mdc-tab__ripple"></span>`
  return button
}

const tabs = document.querySelectorAll('.mdc-tab-bar')
const radios = document.querySelectorAll('.mdc-radio')
const formFields = document.querySelectorAll('.mdc-form-field')
const form = document.querySelector('form')

for (const tab of tabs) {
  component('tab-bar', tab)
}