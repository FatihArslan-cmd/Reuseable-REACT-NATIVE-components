package com.nativecomponents

import android.app.Activity
import android.nfc.*
import android.nfc.tech.NfcA
import android.nfc.tech.NfcF
import android.nfc.tech.Ndef
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.nio.charset.Charset

class NFCReaderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener, LifecycleEventListener {
    private var nfcAdapter: NfcAdapter? = null
    private var isForeground = true

    init {
        reactContext.addActivityEventListener(this)
        reactContext.addLifecycleEventListener(this)
        nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext)
    }

    override fun getName(): String = "NFCReaderModule"

    @ReactMethod
    fun addListener(eventName: String) {
        // Required to suppress NativeEventEmitter warnings
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required to suppress NativeEventEmitter warnings
    }

    @ReactMethod
    fun isNfcSupported(promise: Promise) {
        promise.resolve(nfcAdapter != null)
    }

    @ReactMethod
    fun stopListening() {
        currentActivity?.let {
            nfcAdapter?.disableReaderMode(it)
        }
    }

    @ReactMethod
    fun startListening() {
        currentActivity?.let { activity ->
            if (isForeground) {
                nfcAdapter?.enableReaderMode(activity, { tag ->
                    try {
                        val nfcData = processNfcTag(tag)
                        sendEvent("onNfcTagDetected", nfcData)
                    } catch (e: Exception) {
                        sendErrorEvent("Error reading NFC tag: ${e.message}")
                    }
                }, NfcAdapter.FLAG_READER_NFC_F or NfcAdapter.FLAG_READER_NFC_A, null)
            }
        }
    }

    private fun processNfcTag(tag: Tag): WritableMap {
        val nfcData = Arguments.createMap()
        val nfcId = tag.id.joinToString("") { "%02x".format(it) }
        nfcData.putString("id", nfcId)

        NfcF.get(tag)?.let { nfcF ->
            nfcData.putString("systemCode", nfcF.systemCode.joinToString("") { "%02x".format(it) })
        }

        NfcA.get(tag)?.let { nfcA ->
            nfcData.putString("atqa", nfcA.atqa.joinToString("") { "%02x".format(it) })
            nfcData.putString("sak", "%02x".format(nfcA.sak))
        }

        Ndef.get(tag)?.let { ndefInstance ->
            try {
                ndefInstance.connect()
                val ndefMessage = ndefInstance.ndefMessage
                nfcData.putString("text", parseNdefMessage(ndefMessage))
            } catch (e: Exception) {
                sendErrorEvent("NDEF read error: ${e.message}")
            } finally {
                try {
                    ndefInstance.close()
                } catch (e: Exception) {
                    Log.e("NFCReaderModule", "Failed to close NDEF connection: ${e.message}")
                }
            }
        }

        return nfcData
    }

    private fun parseNdefMessage(ndefMessage: NdefMessage?): String {
        if (ndefMessage == null) return ""
        for (record in ndefMessage.records) {
            if (record.tnf == NdefRecord.TNF_WELL_KNOWN && record.type.contentEquals(NdefRecord.RTD_TEXT)) {
                val payload = record.payload
                val encoding = if ((payload[0].toInt() and 128) == 0) "UTF-8" else "UTF-16"
                val languageCodeLength = payload[0].toInt() and 63
                return String(payload, languageCodeLength + 1, payload.size - languageCodeLength - 1, Charset.forName(encoding))
            }
        }
        return ""
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun sendErrorEvent(message: String) {
        val params = Arguments.createMap().apply { putString("error", message) }
        sendEvent("onNfcError", params)
    }

    override fun onNewIntent(intent: android.content.Intent?) {
        intent?.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)?.let {
            try {
                sendEvent("onNfcTagDetected", processNfcTag(it))
            } catch (e: Exception) {
                sendErrorEvent("Error processing NFC tag: ${e.message}")
            }
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: android.content.Intent?) {
        // No implementation needed for this example
    }

    // LifecycleEventListener methods
    override fun onHostResume() {
        isForeground = true
        startListening() // Restart NFC reading when app resumes
    }

    override fun onHostPause() {
        isForeground = false
        stopListening() // Stop NFC reading when app goes to the background
    }

    override fun onHostDestroy() {
        stopListening() // Ensure NFC is stopped when app is destroyed
    }
}
