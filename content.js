(() => {

var apiKey;
var prompt;
var model;

const searchModal = document.createElement('dialog');
searchModal.style.padding = '0.5rem';
searchModal.style.border = '1px transparent';
searchModal.style.borderRadius = '10px';
let addedToDOM = false;

chrome.storage.sync.get(["apiKey", "prompt", "model"], function (data) {
  apiKey = data.apiKey;
  prompt = data.prompt;
  model = data.model || "gpt-3.5-turbo";
});

var searchDiv = document.createElement("div");
var configDiv = document.createElement("div");

searchDiv.innerHTML = `
<style>
        .search-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 1rem;
            height: 1rem;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
<div style="position: relative;width:500px">
  <div style="position: absolute; inset: 0; left: 0; display: flex; align-items: center; padding-left: 0.75rem; pointer-events: none;">
      <svg aria-hidden="true" style="width: 1.25rem; height: 1.25rem; fill: none; stroke: currentColor;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path style="stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
  </div>
  <input type="search" id="default-search" style="display: block; width: 100%; padding: 1rem; padding-left: 2.5rem; font-size: 0.875rem; color: #1a202c; border: 1px solid #cbd5e0; border-radius: 5px;background-color: #f7fafc; outline-color: #3b82f6; outline-offset: 2px; placeholder-color: #a0aec0;" placeholder="from john in august 2022 about taxes" required>

  <div id="spinner-container" style="position: absolute; right: 0.625rem; bottom: 0.625rem; display: none; align-items: center; padding-right: 0.75rem;">
      <div class="search-spinner"></div>
  </div>
</div>`;

configDiv.innerHTML = `<div style="padding: 1rem; font-size: 0.875rem; color: #b45309; background-color: #fff9db; border-radius: 0.5rem; width:500px" role="alert">
Click <a id="open-settings" href="#">here</a> to Add your API key and prompt in the extension options and reload gmail
</div>`;


function searchMail(term) {
  const inputField = document.querySelector('input[aria-label="Search mail"], input[aria-label="Search in emails"]');

  if (inputField) {
    inputField.value = term;

    const enterKeyEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });

    inputField.dispatchEvent(enterKeyEvent);
  } else {
    console.error("Input field with aria-label 'Search mail' not found.");
  }
}

function showModal() {
  let el;
  if (!addedToDOM) {
    document.body.appendChild(searchModal);
    addedToDOM = true;
  }
  searchModal.innerHTML = '';
  if (!apiKey || !prompt) {
    el = configDiv.cloneNode(true);
    addSettingsClickHandler(el);
  } else {
    el = searchDiv.cloneNode(true);
    addSpinner(el);
  }
  searchModal.appendChild(el);
  searchModal.showModal()
}

function hideModal() {
  searchModal.close();
}

function addSettingsClickHandler(el) {
  const settingsLink = el.querySelector("#open-settings");
  settingsLink.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.runtime.sendMessage({ action: "openSettingsPage" });
  });
}

function addSpinner(el) {
  const searchInput = el.querySelector("#default-search");
  const spinnerContainer = el.querySelector("#spinner-container");
  searchInput.focus();

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchInput.readOnly = true;
      spinnerContainer.style.display = "flex";

      async function search() {
        await generateSearchOperators(searchInput.value).then((searchTerm) => {
          hideModal();
          searchMail(searchTerm);
        });
      }

      search();
    }
  });
}

function keyDownHandler(event) {
  // Check if the command key (metaKey) is pressed for MacOS, or control key (ctrlKey) for Windows/Linux
  const cmdOrCtrl = event.metaKey || event.ctrlKey;

  // Check if the 'k' key is pressed (key code 75 or 107)
  if (cmdOrCtrl && (event.keyCode === 75 || event.keyCode === 107)) {
    event.preventDefault();
    showModal();
  } else if (event.keyCode === 27) {
    hideModal();
  }
}

async function generateSearchOperators(searchTerm) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);

  const finalPrompt = `
    ${prompt}
    Today is ${formattedDate}
    query: ${searchTerm}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const data = JSON.stringify({
    model: model,
    messages: [{ role: "user", content: finalPrompt }],
    temperature: 0.5,
    max_tokens: 500,
    n: 1,
  });

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: data,
  });

  const json = await response.json();

  return json.choices[0].message.content.trim();
}

document.addEventListener("keydown", keyDownHandler);

})();
