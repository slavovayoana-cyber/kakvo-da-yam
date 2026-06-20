// Expo config plugin: drops a Google Play developer-verification token file
// (`adi-registration.properties`) into the Android APK at the path Google's
// "Android developer verification" flow expects:
//   android/app/src/main/assets/adi-registration.properties
//
// Used once to register the package name with Google Play. Safe to keep in
// the plugin chain afterwards — Google ignores extra assets at runtime.

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FILE_NAME = 'adi-registration.properties';

module.exports = function withAdiRegistration(config, props = {}) {
  const token = props.token;
  if (!token) {
    throw new Error(
      '[withAdiRegistration] expected `token` prop with the Google Play ' +
      'Console verification snippet.',
    );
  }
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      const assetsDir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'assets',
      );
      fs.mkdirSync(assetsDir, { recursive: true });
      fs.writeFileSync(path.join(assetsDir, FILE_NAME), token);
      return cfg;
    },
  ]);
};
