const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Huberman Protocol Optimizer...\n');

// Start the backend server
const serverPath = path.join(__dirname, 'server');
const server = spawn('node', ['server-json.js'], {
  cwd: serverPath,
  stdio: 'inherit',
  shell: true
});

// Start the frontend
const frontend = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  server.kill();
  frontend.kill();
  process.exit();
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('✅ Both servers are starting...');
console.log('📱 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:5000');
console.log('\nPress Ctrl+C to stop both servers');
