const rp = require('request-promise'),
  path = require('path'),
  fs = require('fs-extra'),
  chalk = require('chalk');
// your  github api issues
const issuesUrl = 'https://api.github.com/repos/gnipbao/iblog/issues';
const options = {
  uri: issuesUrl,
  qs: {
    access_token: '8275d52f1c77f9da8df09bcf0243e5e56e00314f'// access token
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
  },
  json: true // Automaticlly parse then jsno string in the response
};

const getIssuesAticles = function (url) {
  return new Promise(function (resolve, reject) {
    rp(options).then(function (data) {
      resolve(data);
    }).catch(function (err) {
      reject(err);
    })
  });
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
};

try {
  output += `${startMdTemplate+ '\n'}`;
  getIssuesAticles().then(function (data) {
    for(let i of data){
      console.log(`${chalk.green('title')}->${i.title}`);
      console.log(`${chalk.green('url')}->${i.html_url}`);
      let updateDate = i.updated_at.split('T')[0];
      console.log(`${chalk.green('updated_at')}->${updateDate}`);
      output += `#### ${updateDate}\n`;
      output += `[${i.title}](${i.html_url})`;
      output += `\n`
    }
    output += `${endMdTemplate+ '\n'}`
    // write to the README file 
    fs.writeFileSync('README.md', output);
    // log a success message
    console.log(`${chalk.green('SUCCESS!')} README file generated!`);
    console.timeEnd('Builder');

  }, function (err) {
    console.log(`${chalk.red('Error:')}->${err}`);
  });
} catch (error) {
  console.log(`${chalk.red('Error:')}->${error}`);
  process.exit(1);
}
