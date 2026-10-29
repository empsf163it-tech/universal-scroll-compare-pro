const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const proc = spawn('ssh', [
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ServerAliveInterval=30',
  '-R', '80:localhost:3001',
  'nokey@localhost.run'
]);

function handleChunk(data) {
  const text = data.toString();
  process.stdout.write(text);
  const match = text.match(/https:\/\/[a-zA-Z0-9.-]+\.lhr\.life/);
  if (match) {
    const publicUrl = match[0];
    fs.writeFileSync(path.join(__dirname, '.public-url.txt'), publicUrl, 'utf8');
    console.log('\n[PUBLIC-URL-READY]', publicUrl);
  }
}

proc.stdout.on('data', handleChunk);
proc.stderr.on('data', handleChunk);

