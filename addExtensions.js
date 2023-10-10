// eslint-disable-next-line @typescript-eslint/no-var-requires
const replaceInFile = require('replace-in-file');

const options = {
  files: './dist/**/*.js',
  from: /from ['"](.+?)['"]/g,
  to: (match, group1) => {
    if (group1.startsWith('.')) {
      return `from '${group1}.js'`;
    }
    return match;
  },
};

replaceInFile(options)
  .then(changes => {
    console.log('Modified files:', changes.map(change => change.file).join(', '));
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
