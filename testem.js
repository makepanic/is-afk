const IN_CI = !!process.env.TRAVIS;

module.exports = {
  disable_watching: IN_CI,
  "framework": "qunit",
  "src_files": [
    "lib/**/*.ts",
    "tests/**/*.test.ts",
  ],
  "serve_files": [
    "node_modules/sinon/pkg/sinon.js",
    "dist/test-afk.js",
  ],

  launch_in_ci: ['Chrome'],
  launch_in_dev: [],

  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        // --no-sandbox is needed when running Chrome inside a container
        IN_CI ? '--no-sandbox' : null,

        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};
