# Folder structure

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

# Config

- html template options

# Category layout

title_page:
  title: blabla
  image: # optional
  caption: huhu # optional

questions: # array
  - type: text
    question: huhu?
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

  - type: image
    image: media/c1q3.png
    title: huhu # optional
    caption: huhu # optional
    answer: hu
    source: google # optional

# Notes
- A category can have zero questions and act as a slide in between categories.
