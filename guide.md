While the main motivation for the project was to manage content - in this case questions, answers and categories - like code, this may add too much complexity for people, who don't not version control tools.
This guide will focus only on the part that generates the presentation out of the YAML files and not cover how to use a version control system like git.

# Download the project template

# Installation
Download and install [Node.js](https://nodejs.org/en/download). During the installation wizards, make sure the binaries are added to PATH if asked.

Console usage is required. On Windows, I recommend using a Bash shell that is included with the installation of git, or alternatively the PowerShell, which should be installed by default.
The MacOS terminal should work great, as do all the Linux terminals.

Using `cd`, go to your project directory. This should be the unpacked project template.
```sh
cd /path/to/my/project/
```

Using Node.js, install the project dependencies:
```sh
npm install
```
(This command only works if Node.js is in your PATH and the console is currently in the directory of your project's package.json file.)

# Basic configuration
- Rename the Exampel sub folder if needed

- Changes in: `config.yaml`

# Adding slides
# Adding categories and questions
# Adding media files

# Generate the presentation
```sh
npm run build
```