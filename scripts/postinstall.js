const {
  readdirSync,
  writeFileSync,
  statSync,
  readFileSync,
  existsSync,
} = require('fs');

const LICENSE = readFileSync(__dirname + '/../LICENSE.md');

const tsconfigBuild = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  }
}`;
const tsconfig = `{
  "extends": "../../tsconfig.json"
}`;

const dependencies = require('../package.json').devDependencies;
readdirSync(__dirname + '/../packages').forEach(directory => {
  if (!statSync(__dirname + '/../packages/' + directory).isDirectory()) {
    return;
  }
  writeFileSync(
    __dirname + '/../packages/' + directory + '/LICENSE.md',
    LICENSE,
  );
  writeFileSync(
    __dirname + '/../packages/' + directory + '/tsconfig.json',
    tsconfig,
  );
  writeFileSync(
    __dirname + '/../packages/' + directory + '/tsconfig.build.json',
    tsconfigBuild,
  );
  let pkg = {};
  try {
    pkg = JSON.parse(
      readFileSync(
        __dirname + '/../packages/' + directory + '/package.json',
        'utf8',
      ),
    );
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }
  const before = JSON.stringify(pkg);
  if (!pkg.name) {
    pkg.name = '@authentication/' + directory;
  }
  if (!pkg.version) {
    pkg.version = '0.0.0';
  }
  if (!pkg.description) {
    pkg.description = '';
  }
  if (!pkg.main) {
    pkg.main = './lib/index.js';
  }
  if (!pkg.types) {
    pkg.types = './lib/index.d.ts';
  }
  if (!pkg.dependencies) {
    pkg.dependencies = {};
  }
  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  pkg.repository =
    'https://github.com/ForbesLindesay/authentication/tree/master/packages/' +
    directory;
  pkg.bugs = 'https://github.com/ForbesLindesay/authentication/issues';
  if (existsSync(__dirname + '/../docs/' + directory + '.md')) {
    pkg.homepage =
      'https://www.atauthentication.com/docs/' + directory + '.html';
    writeFileSync(
      __dirname + '/../packages/' + directory + '/README.md',
      '# ' +
        pkg.name +
        '\n\n' +
        'For documentation, see ' +
        'https://www.atauthentication.com/docs/' +
        directory +
        '.html',
    );
  }
  pkg.license = 'GPL-3.0';
  if (!pkg.private) {
    pkg.publishConfig = {
      access: 'public',
    };
  }
  const after = JSON.stringify(pkg);
  if (before === after) {
    return;
  }
  writeFileSync(
    __dirname + '/../packages/' + directory + '/package.json',
    JSON.stringify(pkg, null, '  ') + '\n',
  );
});
