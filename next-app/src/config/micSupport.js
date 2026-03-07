export const micSupportConfig = {
  device: {
    feedback: "Device lacks microphone capability",
    hint: "Use a device with a built-in microphone",
    title: "No Microphone Found",
    icon: "🎤❌",
  },
  browser: {
    feedback: "Browser microphone API not available",
    hint: "Enable microphone permissions in browser settings",
    title: "Browser Not Supported",
    icon: "🌐❌",
  },
  permission: {
    feedback: 
      "Microphone permission is disabled",
    hint: "Refresh the page and allow microphone when prompted",
    title: "Permission Denied",
    icon: "🔒❌",
  },
  explicit: {
    feedback: "Type away - we're listening!",
    hint: "Type your message below and hit submit",
    title: "Text Input Mode",
    icon: "⌨️✨",
  },
  network: {
    feedback: "Connect to the internet to use microphone",
    hint: "Check your WiFi or mobile data connection",
    title: "Connection Required",
    icon: "📶❌",
  },
  error: {
    feedback: "Technical issue with audio capture",
    hint: "Use text input as a backup option",
    title: "Technical Issue",
    icon: "⚠️❌",
  },
};
