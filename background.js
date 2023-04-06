// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openSettingsPage") {
    openUrlInNewTab(chrome.runtime.getURL("settings.html"));
  }
});

// Function to open URL in new tab
function openUrlInNewTab(url) {
  chrome.tabs.create({ url: url });
}
