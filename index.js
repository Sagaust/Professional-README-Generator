const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');
const writeFileAsync = util.promisify(fs.writeFile);

const promptUser = () => 
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
]);

const generateMarkdown = (answers) => {
  return `
# ${answers.title}

## Description
${answers.description}

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation
${answers.installation}

## Usage
${answers.usage}

## License
${answers.licenseBadge}  
This application is covered under the ${answers.license} license.

## Contributing
${answers.contributing}

## Tests
${answers.tests}

## Questions
For any questions, please contact ${answers.email}.  
Check out my GitHub profile [here](https://github.com/${answers.github}).
`;
};

promptUser()
  .then((answers) => writeFileAsync('README.md', generateMarkdown (answers)))
  .then(() => 
    // log a success message to the console
    console.log('README.md file successfully created!'))
  .catch((err) => console.error('Error generating README file:', err));