# Overview 

This is a companion client for the HD wallet donations manager node found here:
https://github.com/BlockchainInstituteChi/hd_wallet_deposit_manager

Generally speaking, it allows the user to select from a list of supported currencies, and checks that they're human with a standard recaptcha. This client then contacts the server specified in the head of 'depositCtrl.js' and verified the recaptcha while requesting a new deposit address is created. 

# Integration

Launcher.js shows the easiest way to integrate this functionality into your site, by providing a popup window containing the client. 

Be sure to replace the recaptcha key and server url to match your own. 

### Install / Run Procedure

#1. Open launcher.html

#2. Click 'Start Here' to open the Donate dialog box

#3. Try it out!

