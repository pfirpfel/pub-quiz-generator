# Pub Quiz Generator [![npm version](https://badge.fury.io/js/pub-quiz-generator.svg)](https://www.npmjs.com/package/pub-quiz-generator)
Write your pub quiz questions and answers as YAML code and let this script generate a HTML presentation (using [reveal.js](https://revealjs.com/)) from it.

An example repository can be found [here](https://github.com/pfirpfel/example-pub-quiz), with the rendered output:
- [Example presentation](https://pfirpfel.github.io/example-pub-quiz/)
- [Example presentation with answers visible](https://pfirpfel.github.io/example-pub-quiz/answers.html)

## Usage
```shell
./index.js -d example/
```

This will create an `output` directory with two files:
- `index.html` Main Pub Quiz presentation
- `answers.html` Pub Quiz presentation with answers visible

Options:
- `-d, --directory`: Path to the question directory (required)
- `-o, --output`: Path to output directory, where the HTML is written to
- `-t, --templates`: Path to template directory, if custom templates are needed

## Question directory
Folder structure:
```
Example_Quiz
|_ config.yaml
|_ 1-Category.yaml    # will be read alphabetically
|_ 2-Category.yaml
|_ 3-Category.yaml
|_ media
  |_ c1q3.mp3
  |_ c1q3.png
```

### Configuration
The configuration file has to be named `config.yaml`. Check out the [example](example/config.yaml).

Options:
- `title` (String): Used as `<title>`value for the HTML. Default: `Pub Quiz`
- `display_question_numbers` (boolean): show category/question numbering on question slides. Default: `true`
- `custom_css` (String): Custom CSS to be injected into the HTML
- `revealjs_path` (String): Path to reveal.js dependency. Default: `../node_modules/reveal.js/`
- `revealjs_theme` (String): Reveal.js [theme](https://revealjs.com/themes/). Default: `black`

### Categories
All yaml files in the root directory of the question directory other than `config.yaml` will be treated as categories.
They will be added to the quiz in alphabetical order.
If you want to have regular slides in addition to categories, just add category yaml files wit no `questions` attribute.
Check out the example directory!

YAML format:
```yaml
title_page: # each category gets an title slide
  title: Category title
  image: media/category.jpg # optional, displayed below title
  caption: Some caption text # optional, displayed below image
  # if markdown is set, other properties than title will be ignored
  markdown: |
    - a
    - b
    - c

questions: # array of questions, if missing the category will be treated just as a slide
    - type: text # simple text question
      title: Capital cities # optional
      question: What is the capital of Germany?
      answer: Berlin
      source: https://en.wikipedia.org/wiki/Germany # optional, displayed on the bottom in small font
    
    - type: markdown # markdown allows more formatting options
      title: Best fruit? # optional, added as h2 title before markdown
      markdown: |
        1. Strawberry
        2. Apple
        3. Banana
      answer: Banana
      source: https://en.wikipedia.org/wiki/Fruit # optional, displayed on the bottom in small font
    
    - type: image # question with an image
      title: Some title # optional, displayed above image
      image: media/c1q3.png # path to image
      caption: A caption # optional, displayed below image
      answer: An answer
      source: Artist, License # optional, displayed on the bottom in small font
    
    - type: audio # question with an audio file
      audio: media/c1q3.mp3 # path to audio file
      audio_type: audio/mp3 # mime type
      autoplay: true # default: true
      controls: true # display control buttons (volume, seeking, and pause/resume), default: true
      title: Some title # optional, displayed above image
      image: media/c1q3.png # optional,  path to image
      caption: A caption # optional, displayed below image
      answer: An answer
      source: Artist, License # optional, displayed on the bottom in small font
    
    - type: video # question with a video file
      video: media/c1q3.webm # path to video file
      video_type: video/webm # mime type
      autoplay: true # default: true
      controls: true # display control buttons (volume, seeking, and pause/resume), default: true
      title: Some title # optional, displayed above video
      caption: A caption # optional, displayed below video
      answer: An answer
      source: Artist, License # optional, displayed on the bottom in small font
```

### Media files
It is recommended to put all media files (images, audio, video) in a folder inside the question directory, like in the example.

# Upcoming features
- Automate category / question numbering
- Generate answering and solutions sheets for printing
- Also start a local HTTP server to serve the presentation
- Youtube video question type (+dockerize extraction)
```yaml
questions:
    - type: youtube-dl # question with a video file automatically extracted from youtube
      url: https://www.youtube.com/watch?v=dQw4w9WgXcQ
      video: true # default: true
      audio: true # default: true
      start: 0:00 # default: 0:00
      end: 1:00 # default: until the end
      cache-file: media/c1q3.webp # default, generated name
      autoplay: true # default: true
      controls: true # display control buttons (volume, seeking, and pause/resume), default: true
      title: Some title # optional, displayed above video
      caption: A caption # optional, displayed below video
      answer: An answer
      source: https://www.youtube.com/watch?v=dQw4w9WgXcQ # defaults to url
```