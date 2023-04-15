const tabs = document.querySelectorAll('.mdc-tab-bar')
const radios = document.querySelectorAll('.mdc-radio')
const formFields = document.querySelectorAll('.mdc-form-field')
const form = document.querySelector('form')

const radioMDC = []

for (const tab of tabs) {
  component('tab-bar', tab)
}

for (const radio of radios) {
  radioMDC.push(component('radio', radio))
}

for (const formField of formFields) {
  component('form-field', formField)
}

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const packet = {}
    for (let i = 0; i < radioMDC.length; i++) {
      const radio = radioMDC[i]
      if (radio.checked) {
        packet.radio = i
        break
      }
    }
    console.log(packet)
  })
}

if (window.location.pathname === '/questions') {
  const pages = [
    {
      text: 'Selective questions require you to choose the best option out of 4 possible answers.',
    },
    {
      text: 'Theory questions are marked based on the number of points included in the content of your answer.',
    },
    {
      text: 'Math questions require you to calculate and provide the correct answer using units or symbols.',
    },
    {
      text: 'Matching questions have dragabble cards that need to connect with the correct term.',
    },
  ]
  const p = document.querySelector('.demo p')
  p.innerHTML = pages[0].text
  for (const tab of tabs) {
    tab.addEventListener('MDCTabBar:activated', e => {
      const { index } = e.detail
      p.innerHTML = pages[index].text
    })
  }
}