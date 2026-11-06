const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('one Add click creates exactly one task', () => {
  const listeners = [];
  const button = { addEventListener: (_, fn) => listeners.push(fn) };
  const elements = { 'new-task': { value: 'Buy milk' }, 'incomplete-tasks': { children: [] }, 'completed-tasks': { children: [] } };
  const context = vm.createContext({ console: { log() {} }, document: {
    getElementById: id => elements[id], getElementsByTagName: () => [button]
  } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../2-day/assignment-1.2/app.js'), 'utf8'), context);
  const added = [];
  // Keep the real event registrations and addTask behavior; isolate DOM construction.
  context.createNewTaskElement = text => ({ text });
  context.bindTaskEvents = () => {};
  elements['incomplete-tasks'].appendChild = item => added.push(item.text);
  if (button.onclick) button.onclick();
  listeners.forEach(fn => fn());
  assert.deepEqual(added, ['Buy milk']);
  assert.equal(elements['new-task'].value, '');
});
