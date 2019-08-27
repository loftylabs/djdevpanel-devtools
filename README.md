Django Developer Panel for Chrome
===

This extension is based on the boilerplate code at [https://github.com/thingsinjars/devtools-extension](https://github.com/thingsinjars/devtools-extension)

Development Installation
===

 * Open [chrome://extensions](chrome://extensions)
 * Enable 'Developer Mode' checkbox
 * Click 'Load unpacked extensions...'
 * Select the `djdevpanel-devtools` folder

Usage
===

Install the chrome extension and follow the instructions at [https://github.com/loftylabs/django-developer-panel](https://github.com/loftylabs/django-developer-panel) to add the required middleware to your Django application.

Firefox Installation
===

Unsigned extensions can only be installed in Developer Edition, Nightly, and ESR versions of Firefox.

*  Open [about:config](about:config) and toggle `xpinstall.signatures.required` to True
*  Open [about:addons](about:addons)
*  Choose "Install Add-on From File" in the dropdown
*  Select the precompiled .xpi file inside the dist folder of this repo
