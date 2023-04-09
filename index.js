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
  const { params } = req
  res.send(render('views', '', { title: 'IGCSE', path: '' })) 
})

app.get('/content', (req, res) => {
  res.send(render('views', 'content.html', {}))
})

app.get('/courses/:subject', (req, res) => {
  res.send(render(`views/courses/${req.params.subject}`, '', { title: `IGCSE ${req.params.subject.replace('_', ' ').toUpperCase()}`, path: '../../', relative: `courses/${req.params.subject}` }))
})

app.get('/content/:subject', (req, res) => {
  res.send(render(`views/courses/${req.params.subject}`, 'content.html', { relative: `courses/${req.params.subject}` }))
})

app.get('/courses/:subject/:topic', (req, res) => {
  res.send(render(`views/courses/${req.params.subject}/${req.params.topic}`, '', { title: `${req.params.topic.replace('_', ' ').toUpperCase()}`, path: '../../', relative: `courses/${req.params.subject}` }))
})

app.get('/api', (req, res) => {
  res.status(200).json({
    search: '/api/search?q='
  })
})

app.get('/api/search', (req, res) => {
  const { query } = req
  console.log(query)
  if (!('q' in query) || !query.q) return res.status(404).json({ error: 'empty query' })
  const courses = fs.readdirSync('views/courses')
  const result = {}
  const icons = {
    'mathematics': 'calculate',
    'computer_science': 'terminal',
    'biology': 'microbiology',
    'chemistry': 'science',
    'physics': 'speed',
  }
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

app.get('/search', (req, res) => {
  res.send(render(`views/search`, '', { title: 'Search Page' }))
})

app.listen(port)