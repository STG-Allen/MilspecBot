import fs from 'fs/promises';
import type { Dict } from './types';


async function config(filePath: string): Promise<Dict<string>> {
  try {
    const configString = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(configString);
  } catch(ex) {
    // I opted to write directly to stderr because console calls are asynchronous
    // thus console.error/console.trace would never fire, the process would
    // simply exit.
    // Direct stderr writes are blocking and this should work fine.
    process.stderr.write('Malformed or non-existent config file.');
    process.stderr.write(ex);
    process.exit(1);
  }
}

export = (async function() {
 return await config('../config.json');
})()