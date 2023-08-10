# Open IGCSE Initiative

Providing **free** IGCSE resources for everyone!

## About

This website uses [Material Design 2](https://m2.material.io) for components and design guidelines because [Material 3](https://m3.material.io) does not support the web yet and looks worse. 

The SSR system was built using my own TypeScript library called [webity](https://github.com/bitlogist/webity) which can integrate with [express](https://github.com/expressjs) neatly. 

A **FORK** and **STAR** shows that you support this project! 

There is a [SvelteKit version](https://igcsekit.vercel.app/) of this web app available that has structured questions.

## License

The license is a modified GNU license. You must: 
- include a copy of the `LICENSE` file in your own version
- release your product under the same **open-source** license

Essentially, you can do anything you want to the code as long as your version is open-source and you credit the author. The whole point is to keep things free and transparent. 

## API

The `/api` route is a JSON API can be used to fetch information about website content like notes or questions.

### Search

The `/api/search` route is meant for searching pages and extracting useful information. There is no need to use Algolia or Google Search to index pages.

```js
// file searching might need some tweaking if different file types are included other than .html in views
app.get('/api/search', (req, res) => {
  const regex = /<\/*[A-z0-9 ="#%{}.\$/:-]+>/g
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
        const notes = fs.readFileSync(`views/courses/${scope}/${topic}/content.html`, 'utf-8').replaceAll(regex, '')
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
    const content = fs.readFileSync(`views/courses/${course}/content.html`, 'utf-8').replaceAll(regex, '')
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
      const notes = fs.readFileSync(`views/courses/${course}/${topic}/content.html`, 'utf-8').replaceAll(regex, '')
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
```

## Development

It might be a good idea to view the [webity](https://npmjs.com/webity) documentation before you continue development.
> Templates are placed inside `%{}%` special brackets that return strings as plain text.

Make sure to install all dependencies before you run your project.

```sh
npm install
```

### Folder Structure

There are a lot of folders in this repository.
- `public` static scripts and stylesheets
- `views` HTML templates and widgets
  - `courses` subjects and course content
    - `biology`
    - `chemistry`
    - `computer_science`
    - `mathematics`
    - `physics`

### Rendering

The webity templates are extremely flexible. The `$` selector can be used to identify a file by its path starting from the `views` directory. 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- renders views/meta.html -->
  %{ include('$meta.html') }%
  <!-- renders the title string -->
  <title>%{ title }%</title>
  %{ include('$lib.html') }%
</head>
<body>
  %{ include('$appbar.html') }%
  %{ include('$drawer.html') }%
  <main class="mdc-top-app-bar--fixed-adjust">
    <!-- renders ./content.html relative to the current webity path -->
    %{ include('content.html') }%
  </main>
  %{ include('$root.html') }%
</body>
</html>
```

Other parameters can be passed through webity to dynamically set `src` and `href` properties. 

```html
<!-- renders ./animations.js for HOME and ../../animations.js for COURSES -->
<script src="%{ path + 'animations.js' }%"></script>
<script src="%{ path + 'script.js' }%"></script>
```

## Features

### Revision Notes

Revision notes are under construction!

### Questions

Selective questions and theory questions can be accessed through the `/api/questions` route. 

- `subject`: the snake case subject name
- `topic`: the snake case topic name

The response is a JSON file with a `selective` and a `theory` field. An example with the expected data types is shown below. These fields may slightly change over time.

```ts
interface Response {
  selective: [
    {
      intro: string,
      statements: string[],
      image: string, 
      question: string, // length > 0
      difficulty: number, // [0, 1, 2, 3]
      options: string[], // length = 4
      scheme: number, // [0, 1, 2, 3]
      explanation: string // length > 0
    }
  ],
  theory: [
    {
      intro: string,
      statements: string[],
      image: string,
      question: string, // length > 0
      difficulty: number, // [0, 1, 2, 3]
      scheme: string[], // length > 0
      explanation: string // length > 0
    }
  ]
}
```

### AI Marking

This the rough idea for `text-davinci` marking.

> Mark this student's answer. Your response should only include a JSON object with a "marks" field. The **bold** words in the "scheme" field mean that the student should not be awarded the mark if their answer does not contain the exact phrase in **bold**! 

```json
{ 
  "answer": "aerobic respiration releases more energy than anaerobic respiration and produces no lactic acid", 
  "scheme": [
    "aerobic respiration releases more energy **per glucose molecule**", 
    "no lactic acid is produced in aerobic respiration"
  ]
}
```

The expected result is a JSON object with a `marks` field of `1` after applying the IGCSE marking rules.

## Hosting

There are free hosting platforms like [render](https://render.com) and [cyclic](https://cyclic.sh)! Make sure to set environment variables before you deploy your app. 

## Contributing

Contributors are welcome. The goal of this project is to produce a website like [Save My Exams](https://savemyexams.co.uk) but without ads and completely free. A few objectives are listed below. 
- Quality Revision Notes 
- Custom Diagrams 
- Multiple Choice Questions
- Theory Questions & AI Marking
