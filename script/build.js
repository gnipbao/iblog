const got = require('got'),
  path = require('path'),
  fs = require('fs-extra'),
  chalk = require('chalk');
// your  github api issues
const issuesUrl = 'https://api.github.com/repos/gnipbao/iblog/issues';
const options = {
  searchParams: {
    access_token: '0ddac7deb4b862f6457ff44ea054cd2e5015ee3f', // access token
    // sort: 'created',
  },
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
  },
  responseType: 'json',
};

const mdTemplatePath = './template';
let output = '';
// start timer of the script
console.time('Builder');
try {
  startMdTemplate = fs.readFileSync(path.join(mdTemplatePath, 'start.md'), 'utf-8');
  endMdTemplate = fs.readFileSync(path.join(mdTemplatePath, 'end.md'), 'utf-8');
} catch (error) {
  console.log(`${chalk.red('Error!')} during static template loading: ${error}`);
  process.exit(1);
}
output += `${startMdTemplate + '\n'}`;
(async () => {
  try {
    const response = await got(issuesUrl, options);
    const issues = response.body;
    for (let i of issues) {
      console.log(`${chalk.green('title')}->${i.title}`);
      console.log(`${chalk.green('url')}->${i.html_url}`);
      let createdDate = i.created_at.split('T')[0];
      console.log(`${chalk.green('created_at')}->${createdDate}`);
      output += `#### ${createdDate}\n`;
      output += `[${i.title}](${i.html_url})`;
      output += `\n`;
    }
    output += `${endMdTemplate + '\n'}`;
    // write to the README file
    fs.writeFileSync('README.md', output);
    // log a success message
    console.log(`${chalk.green('SUCCESS!')} README file generated!`);
    console.timeEnd('Builder');
  } catch (error) {
    console.log(`${chalk.red('Error:')}->${error}`);
    process.exit(1);
  }
})();
