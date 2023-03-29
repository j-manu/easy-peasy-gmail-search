document.getElementById('settings-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const apiKey = document.getElementById('api-key').value;
  const prompt = document.getElementById('prompt').value;
  const model = document.getElementById('model').value;

  chrome.storage.sync.set({ apiKey, prompt, model }, function () {
      alert('Settings saved!');
  });
});

document.querySelectorAll('.click-to-copy').forEach((textarea) => {
  console.log(textarea);
  textarea.addEventListener('click', () => {
    console.log("clicked");
    copyToClipboard(textarea.id);
  });
});

async function copyToClipboard(textareaId) {
  const textarea = document.getElementById(textareaId);
  textarea.select();
  try {
    await navigator.clipboard.writeText(textarea.value);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

chrome.storage.sync.get(['apiKey', 'prompt', 'model'], function (data) {
  if (data.apiKey !== undefined) {
    document.getElementById('api-key').value = data.apiKey;
  }
  if (data.prompt !== undefined) {
    document.getElementById('prompt').value = data.prompt; 
  }
  if (data.model !== undefined) {
    document.getElementById('model').value = data.model;
  }
});