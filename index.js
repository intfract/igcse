/*
  Int Fract
  https://github.com/intfract
  Please leave this comment as attribution!
*/

import { render } from 'inflict'
import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'
import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'

import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

const port = process.env.PORT || 3000

function contains(text, search) {
  return text.toLowerCase().includes(search.toLowerCase())
}

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  res.send(render('views', '', { title: 'IGCSE', path: '' })) 
})

app.get('/courses/:subject', (req, res) => {
  try {
    res.send(render(`views/courses/${req.params.subject}`, '', { title: `${req.params.subject.replace('_', ' ').toUpperCase()}`, path: '../../', relative: `courses/${req.params.subject}` }))
  } catch (e) {
    res.send(render(`views/404`, '', { title: '404 Not Found!', path: '../../' }))
  }
})

app.get('/courses/:subject/:topic', (req, res) => {
  try {
    res.send(render(`views/courses/${req.params.subject}/${req.params.topic}`, '', { title: `${req.params.topic.replace('_', ' ').toUpperCase()}`, path: '../../../', relative: `courses/${req.params.subject}` }))
  } catch (e) {
    res.send(render(`views/404`, '', { title: '404 Not Found!', path: '../../../' }))
  }
})

app.get('/content', (req, res) => {
  res.send(render('views', 'content.html', {}))
})

app.get('/content/:subject', (req, res) => {
  try {
    res.send(render(`views/courses/${req.params.subject}`, 'content.html', { title: `${req.params.subject.replace('_', ' ').toUpperCase()}`, path: '../../', relative: `courses/${req.params.subject}` }))
  } catch (e) {
    res.send(render(`views/404`, '', { title: '404 Not Found!', path: '../../' }))
  }
})

app.get('/questions', (req, res) => {
  res.send(render(`views/questions`, '', { title: `IGCSE QUESTIONS`, path: '', relative: 'questions' }))
})

app.get('/questions/:subject', (req, res) => {
  res.send(render(`views/questions/${req.params.subject}`, '', { title: `IGCSE ${req.params.subject.replace('_', ' ').toUpperCase()} QUESTIONS`, path: '../../', relative: `questions/${req.params.subject}` }))
})

app.get('/questions/:subject/:topic', (req, res) => {
  try {
    res.send(render(`views/questions/${req.params.subject}/${req.params.topic}`, '', { title: `${req.params.topic.replace('_', ' ').toUpperCase()} QUIZ`, path: '../../../', relative: `questions/${req.params.subject}` }))
  } catch (e) {
    res.send(render(`views/404`, '', { title: '404 Not Found!', path: '../../../' }))
  }

})

app.get('/api', (req, res) => {
  res.status(200).json({
    search: {
      method: 'GET',
      path: '/api/search?q=',
    },
    marking: {
      method: 'POST',
      path: '/api/marking',
    },
  })
})

app.get('/api/search', (req, res) => {
  const { query } = req
  console.log(query)
  if (!('q' in query) || !query.q) return res.status(404).json({ error: 'empty query' })
  if (query.q === '*') query.q = ''
  const result = {}
  const icons = {
    'mathematics': 'calculate',
    'computer_science': 'terminal',
    'biology': 'microbiology',
    'chemistry': 'science',
    'physics': 'speed',
  }
  if ('scopes' in query) {
    for (const scope of query.scopes.split(',')) {
      if (!Object.keys(icons).includes(scope)) return res.status(404).json({ error: 'invalid scope' })
      const icon = icons[scope]
      const topics = fs.readdirSync(`views/courses/${scope}`).filter(file => !file.endsWith('.html'))
      for (const topic of topics) {
        const notes = fs.readFileSync(`views/courses/${scope}/${topic}/content.html`, 'utf-8').replaceAll(/<\/*[A-z0-9 ="#{}.$/:-]+>/g, '')
        if (contains(notes, query.q)) {
          result[topic] = {
            text: notes,
            path: `/courses/${scope}/${topic}`,
            icon,
            topic: true,
          }
        }
      }
    }
    return res.json(result)
  }
  const courses = fs.readdirSync('views/courses')
  for (const course of courses) {
    const content = fs.readFileSync(`views/courses/${course}/content.html`, 'utf-8').replaceAll(/<\/*[A-z0-9 ="#{}.$/:-]+>/g, '')
    const icon = icons[course]
    if (contains(content, query.q)) {
      result[course] = {
        text: content,
        path: `/courses/${course}`,
        icon,
        topic: false,
      }
    }
    const topics = fs.readdirSync(`views/courses/${course}`).filter(file => !file.endsWith('.html'))
    for (const topic of topics) {
      const notes = fs.readFileSync(`views/courses/${course}/${topic}/content.html`, 'utf-8').replaceAll(/<\/*[A-z0-9 ="#{}.$/:-]+>/g, '')
      if (contains(notes, query.q)) {
        result[topic] = {
          text: notes,
          path: `/courses/${course}/${topic}`,
          icon,
          topic: true,
        }
      }
    }
  }
  res.status(200).json(result)
})

app.post('/api/marking', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) return res.status(404).json({ error: 'invalid prompt' })
  console.log(prompt)
  const apiKey = process.env.openai
  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 1024,
    })
    const completion = response.data.choices[0].text
    console.log(completion)
    return res.status(200).json({
      prompt,
      completion,
    })
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(`OpenAI Error: ${error.message}`)
    }
  }
})

app.get('/api/questions', (req, res) => {
  const { subject, topic } = req.query
  const subjects = fs.readdirSync('views/questions')
  if (!(subject && subjects.includes(subject))) return res.status(404).json({ error: 'invalid subject' })
  const topics = fs.readdirSync(`views/questions/${subject}`).filter(file => !file.endsWith('.html'))
  if (topic && topics.includes(topic)) {
    const quiz = JSON.parse(fs.readFileSync(`views/questions/${subject}/${topic}/quiz.json`, 'utf-8'))
    res.status(200).json(quiz)
  } else {
    const result = {}
    for (const t of topics) {
      const quiz = JSON.parse(fs.readFileSync(`views/questions/${subject}/${t}/quiz.json`, 'utf-8'))
      result[t] = quiz
    }
    res.status(200).json(result)
  }
})

app.get('/search', (req, res) => {
  res.send(render(`views/search`, '', { title: 'Search Page', path: '../' }))
})

app.get('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.send(render(`views/404`, '', { title: '404 Not Found!', path: '../' }))
    return
  }
  if (req.accepts('json')) {
    res.json({ error: 'not found' })
    return
  }
  res.type('txt').send('not found')
})

app.listen(port)
