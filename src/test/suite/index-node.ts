import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
		timeout: 25000 // Lot of time for leojs ui and app to be created
	});

	console.log('Starting src/test/suite/index-node.ts');

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.sort(); // Make extension.test.ts first , alphabetically, before leo...test.ts
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(failures => {
					if (failures > 0) {
						console.log('ERRORS 20 seconds timeout to view extension instance');
						setTimeout(() => {
							e(new Error(`${failures} tests failed.`));
						}, 20000);
					} else {
						console.log('SUCCESS 20 seconds timeout to view extension instance');
						setTimeout(() => {
							c();
						}, 20000);
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}
