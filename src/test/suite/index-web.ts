require('mocha/mocha'); // import the mocha web build

export function run(): Promise<void> {

  console.log('Starting src/test/suite/index-web.ts');

  return new Promise((c, e) => {
    mocha.setup({
      ui: 'tdd',
      reporter: undefined,
      timeout: 25000 // Lot of time for leojs ui and app to be created
    });

    // bundles all files in the current directory matching `*.test`
    const importAll = (r: __WebpackModuleApi.RequireContext) => r.keys().forEach(r);
    // Sorted to make extension.test.ts first , alphabetically, before leo...test.ts

    importAll(require.context('.', true, /\.test$/));

    try {
      // Run the mocha test
      mocha.run(failures => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error(err);
      e(err);
    }
  });
}