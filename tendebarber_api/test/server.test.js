const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

test('File server.js harus ada', () => {
    const serverPath = path.join(__dirname, '..', 'server.js');
    assert.ok(fs.existsSync(serverPath), 'server.js tidak ditemukan');
});

test('Syntax check: server.js harus valid tanpa error sintaks', () => {
    const serverPath = path.join(__dirname, '..', 'server.js');
    assert.doesNotThrow(() => {
        execSync(`node --check "${serverPath}"`, { stdio: 'pipe' });
    });
});

test('Package.json memiliki dependensi yang diperlukan', () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    assert.ok(pkg.dependencies.express, 'express harus terinstall');
    assert.ok(pkg.dependencies.mysql2, 'mysql2 harus terinstall');
    assert.ok(pkg.dependencies.cors, 'cors harus terinstall');
});

test('Frontend index.html harus ada di root repository', () => {
    const indexPath = path.join(__dirname, '..', '..', 'index.html');
    assert.ok(fs.existsSync(indexPath), 'index.html tidak ditemukan di root');
});
