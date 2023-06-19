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