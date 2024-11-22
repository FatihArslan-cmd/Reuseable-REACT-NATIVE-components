package com.hyhyhyhyhyhyhyh

import android.app.Activity
import android.os.Build
import android.view.View
import android.graphics.Color
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NavigationBarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NavigationBarModule"
    }

    @ReactMethod
    fun setNavigationBarColor(color: String, lightIcons: Boolean) {
        val activity: Activity? = currentActivity
        activity?.runOnUiThread {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                activity.window.navigationBarColor = Color.parseColor(color)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    val flags = activity.window.decorView.systemUiVisibility
                    activity.window.decorView.systemUiVisibility = if (lightIcons) {
                        flags and View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR.inv()
                    } else {
                        flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                    }
                }
            }
        }
    }

    @ReactMethod
    fun setNavigationBarVisibility(visible: Boolean) {
        val activity: Activity? = currentActivity
        activity?.runOnUiThread {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val decorView = activity.window.decorView
                if (visible) {
                    decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN)
                } else {
                    decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            or View.SYSTEM_UI_FLAG_FULLSCREEN
                            or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY) // Immersive mode
                }
            }
        }
    }
}
