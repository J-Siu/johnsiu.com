// The value below is injected by flutter build, do not touch.
var serviceWorkerVersion = null;
// <!-- This script adds the flutter initialization JS code -->
window.addEventListener('load', function(ev) {
	// Download main.dart.js
	_flutter.loader.loadEntrypoint({
		serviceWorker: {
			serviceWorkerVersion: serviceWorkerVersion,
		}
	}).then(function(engineInitializer) {
		return engineInitializer.initializeEngine();
	}).then(function(appRunner) {
		return appRunner.runApp();
	});
});
