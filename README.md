# Easy Peasy Gmail Search

Use OpenAI GPT to convert natural language search to gmail search syntax
In short, convert a query like <br>
`from john in august 2020 about taxes` to <br>
`from:john after:2020/07/31 before:2020/09/01 taxes`

[![Final video of fixing issues in your code in VS Code](https://img.youtube.com/vi/ypniAcE7zRU/maxresdefault.jpg)](https://youtu.be/ypniAcE7zRU)

## Installation
This extension is not yet in Chrome Store. Download the code and follow [these steps](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) to install it.


## How to use

* Install the extension.
* Reload Gmail
* Press `Ctrl/Cmd+K` to open the search box
* Open settings page and add your [OpenAI API Key](https://platform.openai.com/account/api-keys) and set a prompt. (Sample prompts are given on the page)
* Reload Gmail
* Search Away!


## Notes
* Only your search queries are sent to OpenAI. Your API key is stored locally in your browser.
* The extension has been made for fun. Don't expect further development.
