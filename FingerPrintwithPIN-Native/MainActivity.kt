package com.hyhyhyhyhyhyhyh

import android.app.Activity
import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "hyhyhyhyhyhyhyh"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    // Yeni eklenen onActivityResult metodu
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data) // Varsayılan işlemleri gerçekleştir

        // `DeviceCredentialModule`'dan gelen doğrulama sonuçlarını işle
        if (requestCode == DeviceCredentialModule.REQUEST_CODE) {
            val promise = DeviceCredentialModule.pendingPromise
            DeviceCredentialModule.pendingPromise = null

            if (resultCode == Activity.RESULT_OK) {
                promise?.resolve("SUCCESS") // Doğrulama başarılı
            } else {
                promise?.reject("AUTH_FAILED", "Authentication failed") // Doğrulama başarısız
            }
        }
    }
}
