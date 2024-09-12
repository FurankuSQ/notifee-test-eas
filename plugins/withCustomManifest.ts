const { withAndroidManifest } = require('@expo/config-plugins')

const withCustomManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    try {
      const manifest = config.modResults

      if (!manifest.manifest.$['xmlns:tools']) {
        manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools'
      }

      const mainApplication = manifest.manifest.application[0]

      if (!mainApplication) {
        throw new Error("L'élément <application> est introuvable dans AndroidManifest.xml")
      }

      if (!mainApplication.service) {
        mainApplication.service = []
      }

      let foregroundService = mainApplication.service.find(
        (service) => service.$['android:name'] === 'app.notifee.core.ForegroundService',
      )

      if (!foregroundService) {
        foregroundService = {
          $: {
            'android:name': 'app.notifee.core.ForegroundService',
            'android:foregroundServiceType': 'microphone',
            'android:exported': 'false',
            'tools:replace': 'android:foregroundServiceType',
          },
        }

        mainApplication.service.push(foregroundService)
      } else {
        foregroundService.$['android:foregroundServiceType'] = 'microphone'
        foregroundService.$['android:exported'] = 'false'
        foregroundService.$['tools:replace'] = 'android:foregroundServiceType'
      }

      return config
    } catch (error) {
      console.error("Erreur lors de la modification de l'AndroidManifest.xml:", error)
      throw error
    }
  })
}

module.exports = withCustomManifest
