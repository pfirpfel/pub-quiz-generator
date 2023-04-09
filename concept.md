# Steps
- write questions as yaml
- compile into html with templates, package as revealjs presentation
- serve as local http

# Folder structure
```
Quiz #1
|_ config.yaml
|_ 1-Category.yaml    # will be read alphabetically
|_ 2-Category.yaml
|_ 3-Category.yaml
|_ media
  |_ c1q3.mp3
  |_ c1q3.png
|_ templates
  |_ base.html
package.json
```

# Config

- html template options

# Category layout

```yaml
title_page:
  title: blabla
  image: # optional
  caption: huhu # optional

  questions: # array
  - type: text
    question: huhu?
    title: huhu # optional
    answer: hu
    source: google # optional

  - type: markdown
    question: |
      ## Best fruit?
      - strawberry
      - apple
      - banana
    answer: hu
    source: google # optional

  - type: image
    image: media/c1q3.png
    title: huhu # optional
    caption: huhu # optional
    answer: hu
    source: google # optional

  - type: audio
    audio: media/c1q3.mp3
    image: media/c1q3.png # optional
    title: huhu # optional
    caption: huhu # optional
    answer: hu
    source: google # optional

  - type: video
    video: media/c1q3.mp4
    title: huhu # optional
    caption: huhu # optional
    answer: hu
    source: google # optional

  - type: youtube-dl
    url: https://www.youtube.com/watch?v=dQw4w9WgXcQ
    video: true # default: true
    audio: true # default: true
    start: 0:00 # default: 0:00
    end: 1:00 # default: until the end
    cache-file: media/c1q3.webp # has a default name
    title: huhu # optional
    caption: huhu # optional
    answer: hu
    source: google # optional

```

# Notes
- A category can have zero questions and act as a slide in between categories.
- Custom section tag with background: https://revealjs.com/backgrounds/
- Automate category / question numbering
- Generate answering and solutions sheets for printing
- Dockerize youtube-dl / ffmpeg pipeline and/or project as a whole?
