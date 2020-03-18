// ==UserScript==
// @name         Pull Request Merger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/pull/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let mergeButton = null;
    const INTERVAL = 1000;

    let mergeInterval = null;
    let mergeConfirmInterval = null;
    let updateBranchInterval = null;

    let disableButton = document.createElement("button");
    let enableButton = document.createElement("button");

    function enableAutoMerge() {
        if (mergeInterval)
            clearInterval(mergeInterval);
        if (mergeConfirmInterval)
            clearInterval(mergeConfirmInterval);
        if (updateBranchInterval)
            clearInterval(updateBranchInterval);

        mergeInterval = setInterval(tryToClickMergeButton, INTERVAL);
        updateBranchInterval = setInterval(tryToClickUpdateBranchButton, INTERVAL);
        enableButton.style.display = "none";
        disableButton.style.display = "block";
    }

    function disableAutoMerge() {
        if (mergeInterval)
            clearInterval(mergeInterval);
        if (mergeConfirmInterval)
            clearInterval(mergeConfirmInterval);
        if (updateBranchInterval)
            clearInterval(updateBranchInterval);

        enableButton.style.display = "block";
        disableButton.style.display = "none";
    }

    function getButton(text) {
        text = text.toUpperCase();
        let buttons = document.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            console.log("Checking button value: " + button.innerText.trim());
            if (button.innerText.toUpperCase().includes(text)) {
                return button;
            }
        }

        return null;
    }

    function tryToClickConfirmMergeButton() {
        let confirmButton = getButton("CONFIRM MERGE");
        if (confirmButton) {
            console.log("Found confirm button!", confirmButton);
            confirmButton.click();
            clearInterval(mergeConfirmInterval);
        }
        else {
            console.log("Couldn't find confirm merge button... " + (new Date()).toString());
        }
    }

    function tryToClickMergeButton() {
        let button = getButton("MERGE PULL REQUEST");
        if (button) {
            console.log("Found merge button!", button);
            mergeButton = button;
            if (!mergeButton.disabled) {
                console.log("Merge Button Enabled! Merging now");
                mergeButton.click();
                clearInterval(mergeInterval);
                mergeConfirmInterval = setInterval(tryToClickConfirmMergeButton, INTERVAL);
            } else {
                console.log("Merge Button still disabled.... " + (new Date()).toString());
            }
        }
        else {
            console.log("Unable to find Merge Button!");
        }
    }

    function tryToClickUpdateBranchButton() {
        let button = getButton("UPDATE BRANCH");
        if (button) {
            console.log("Found Update Branch button!", button);
            let updateButton = button;
            if (!updateButton.disabled) {
                console.log("Update Branch Button Enabled! Merging now");
                updateButton.click();
            } else {
                console.log("Update Branch Button is disabled.... " + (new Date()).toString());
            }
        }
        else {
            console.log("Unable to find Update Branch Button!");
        }
    }

    let container = document.createElement("div");
    container.setAttribute("style", "float: left; position: fixed; top: 75px; left: 10px");

    enableButton.addEventListener("click", enableAutoMerge);
    enableButton.innerHTML = "Enable Auto Merge";

    disableButton.style.display = "none";
    disableButton.addEventListener("click", disableAutoMerge);
    disableButton.innerHTML = "Disable Auto Merge";

    enableButton.setAttribute("class", "btn btn-primary");
    disableButton.setAttribute("class", "btn btn-warning");

    container.appendChild(disableButton);
    container.appendChild(enableButton);

    document.body.appendChild(container);

})();