package com.hyhyhyhyhyhyhyh

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.*

class DeviceCredentialModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceCredentialModule"
    }

    @ReactMethod
    fun authenticateWithPin(promise: Promise) {
        val activity = currentActivity ?: run {
            promise.reject("NO_ACTIVITY", "No activity available")
            return
        }

        val keyguardManager = activity.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val intent = keyguardManager.createConfirmDeviceCredentialIntent(
                "PIN Doğrulama",
                "Lütfen cihaz PIN'inizi girin"
            )

            if (intent != null) {
                activity.startActivityForResult(intent, REQUEST_CODE)
                pendingPromise = promise
            } else {
                promise.reject("NO_KEYGUARD", "PIN ayarlanmamış")
            }
        } else {
            promise.reject("UNSUPPORTED_VERSION", "Bu özellik Android Lollipop ve üstünü gerektirir")
        }
    }

    companion object {
        const val REQUEST_CODE = 1234
        var pendingPromise: Promise? = null
    }
}
