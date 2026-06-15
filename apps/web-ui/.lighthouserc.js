module.exports = {
  ci: {
    collect: {
      startServerCommand: 'PORT=3001 npx nx run web-ui:serve-static',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 120000,
      url: ['http://localhost:3001/en-US'],
      numberOfRuns: 1,
      settings: {
        // Chromium on Linux in a container often needs these flags
        chromeFlags:
          '--no-sandbox --disable-setuid-sandbox --headless --disable-gpu --disable-dev-shm-usage --remote-debugging-port=9222',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
