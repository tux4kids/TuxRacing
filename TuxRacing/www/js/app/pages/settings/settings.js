define([
    "tpl!./tpl/tpl_settings.html",
    "i18n!./nls/i18n_settings",
    "audio",
    "utilities"
], function (
    view,
    text,
    audio,
    utilities
    ) {
    //--------------
    // This module provides helper functions for displaying/hiding the
    // settings overlay page. It does not listen for any pages.
    //--------------

    function hideSettings() {
        utilities.hideOverlay();
    }

    function settingsVisible() {
        return $("#overlay").css("display") !== "none";
    }

    function showSettings() {
        // Load the settings overlay template into the overlay
        utilities.showOverlay(view({
            text: text
        }));

        // Selectively hide mute/unmute depending on mute state
        if (audio.muted()) {
            $("h1.settingsMute").css({
                display: "none"
            });
        } else {
            $("h1.settingsUnmute").css({
                display: "none"
            });
        }

        // Enable mute and toggle visible mute/unmute options
        utilities.clickHandler($("a.settingsMute"), function (e) {
            e.preventDefault();
            e.stopPropagation();

            audio.mute(function () {
                $("h1.settingsMute").css({
                    display: "none"
                });
                $("h1.settingsUnmute").css({
                    display: "block"
                });
            });
        });

        // Disable mute and toggle visible mute/unmute options
        utilities.clickHandler($("a.settingsUnmute"), function (e) {
            e.preventDefault();
            e.stopPropagation();

            audio.unmute(function () {
                $("h1.settingsMute").css({
                    display: "block"
                });
                $("h1.settingsUnmute").css({
                    display: "none"
                });
            });
        });
    }

    function toggleSettings() {
        if (settingsVisible()) {
            hideSettings();
        } else {
            showSettings();
        }
    }

    return {
        hideSettings: hideSettings,
        settingsVisible: settingsVisible,
        showSettings: showSettings,
        toggleSettings: toggleSettings

    }
});