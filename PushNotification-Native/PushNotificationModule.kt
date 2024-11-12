package com.nativecomponents

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import android.graphics.Color
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PushNotificationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PushNotificationModule"
    }

    private val maxNotifications = 3
    private val notificationIdList = mutableListOf<Int>()

    @ReactMethod
    fun sendNotification(title: String, message: String, promise: Promise) {
        val notificationManager =
            reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "default_channel_id"

        // Create Notification Channel for Android O and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelName = "Default Channel"
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_HIGH // Sets high importance for visibility
            )
            channel.enableVibration(true) // Ensure vibration is enabled on the channel
            channel.vibrationPattern = longArrayOf(0, 500, 500, 500) // Custom vibration pattern
            notificationManager.createNotificationChannel(channel)
        }

        // Create a unique notification ID and add to the list
        val notificationId = System.currentTimeMillis().toInt()
        notificationIdList.add(notificationId)

        // If more than maxNotifications, remove the oldest notification
        if (notificationIdList.size > maxNotifications) {
            notificationManager.cancel(notificationIdList.removeAt(0))
        }

        // Build the notification
        val notificationBuilder = NotificationCompat.Builder(reactContext, channelId)
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)
            .setSmallIcon(R.drawable.instagram)  // Ensure this icon exists in your drawable resources
            .setPriority(NotificationCompat.PRIORITY_HIGH) // Set high priority for better visibility
            .setVibrate(longArrayOf(0, 500, 500, 500)) // Custom vibration pattern
            .setLights(Color.BLUE, 1000, 1000) // LED color and pattern

        // Intent for when notification is clicked
        val intent = Intent(reactContext, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            reactContext,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        notificationBuilder.setContentIntent(pendingIntent)

        // Show the notification
        notificationManager.notify(notificationId, notificationBuilder.build())

        promise.resolve("Notification sent!")
    }
}
