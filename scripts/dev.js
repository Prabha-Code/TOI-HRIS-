import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const isWindows = process.platform === 'win32';
const rootDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const commands = [
  ['backend', ['run', 'dev'], path.join(rootDirectory, 'backend')],
  ['frontend', ['run', 'dev:frontend'], rootDirectory],
];

const children = commands.map(([name, args, cwd]) => {
  const child = spawn('npm', args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
    env: {
      ...process.env,
      BROWSER: 'none',
    },
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`${name} stopped with signal ${signal}`);
      return;
    }

    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
