/*
const inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'input',
    name: 'title',
    message: 'What is the title of your project?'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please provide a description of your project:'
  },
  {
    type: 'input',
    name: 'installation',
    message: 'Please provide installation instructions for your project:'
  },
  {
    type: 'input',
    name: 'usage',
    message: 'Please provide usage instructions for your project:'
  },
  {
    type: 'list',
    name: 'license',
    message: 'Which license does your project use?',
    choices: [
      'MIT',
      'Apache 2.0',
      'GPL 3.0',
      'BSD 3-Clause',
      'None'
    ]
  },
  {
    type: 'input',
    name: 'contributing',
    message: 'Please provide contribution guidelines for your project:'
  },
  {
    type: 'input',
    name: 'tests',
    message: 'Please provide test instructions for your project:'
  },
  {
    type: 'input',
    name: 'github',
    message: 'What is your GitHub username?'
  },
  {
    type: 'input',
    name: 'email',
    message: 'What is your email address?'
  }
]).then(answers => {
  console.log(answers);
});


// function to write README file
function writeToFile(fileName, data) {
}

// function to initialize program
function init() {

}

// function call to initialize program
init();

*/

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const ejs = require('ejs');
const marked = require('marked');
const matter = require('gray-matter');
const createBadge = require('./createBadge');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function createReadme(answers) {
  // Load the README template file
  const templateFile = path.join(__dirname, 'templates', 'README.md.ejs');
  const templateContent = await readFile(templateFile, 'utf8');

  // Render the template with the user's answers
  const renderedTemplate = ejs.render(templateContent, answers);

  // Convert markdown to HTML for the Table of Contents
  const tocHtml = marked(renderedTemplate)
    .replace(/<h(\d) id="(.*?)">(.*?)<\/h\d>/g, (match, level, id, text) => {
      return `<li><a href="#${id}">${text}</a></li>`;
    });

  // Add the Table of Contents to the rendered template
  const finalTemplate = renderedTemplate.replace(/<!--toc-->/, tocHtml);

  // Create a badge for the chosen license
  const badge = createBadge(answers.license);

  // Add the badge to the top of the README
  const readmeContent = `${badge}\n\n${finalTemplate}`;

  // Write the README to the appropriate location in the project directory
  const readmeFile = path.join(__dirname, 'README.md');
  await writeFile(readmeFile, readmeContent);

  console.log('README.md file created successfully!');
}
