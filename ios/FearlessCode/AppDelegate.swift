import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "FearlessCode",
      in: window,
      launchOptions: launchOptions
    )
    
    return true
  }
  
  func applicationDidEnterBackground(_ application: UIApplication) {
    if UIDevice.current.isMultitaskingSupported {
            let application = UIApplication.shared
            var backgroundTask: UIBackgroundTaskIdentifier = .invalid

            backgroundTask = application.beginBackgroundTask {
                // Expiration handler — called when time is about to expire
                application.endBackgroundTask(backgroundTask)
                backgroundTask = .invalid
            }

            DispatchQueue.global(qos: .default).async {
                // Perform your background task here
                print("\n\nRunning in the background!\n\n")

                // End the background task when done
                application.endBackgroundTask(backgroundTask)
                backgroundTask = .invalid
            }
        }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
