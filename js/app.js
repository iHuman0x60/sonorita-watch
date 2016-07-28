/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global tau, getcontent */

/* exported app */

/**
 * App.js controls music play and the main page display, including changes in the title of music and the background image.
 */
var app =
(function() {
    var app = {},
        globalPage, // Sets current page information for page navigation.
        nowPlaying = null, // current track
        musicStatus = false, // true: now playing, false: pause or not playing.
        myaudio = document.querySelector('#myaudio'), // Gets audio element by myaudio id.
        interval, // for interval manage.
        musicTime, // Current music playing time, increment by one every second.
        deviceStatus = "gear", // At first, set "gear" as current device status.
        TITLE_NO_TRACK = "No tracks",
        TITLE_BT_DISCONNECTED = "BT disconnected",
        BACKGROUND_IMAGE_NO_ALBUM = "/../image/music_no_album_art.png";

    /**
     * Changes the string of a html element.
     * @private
     * @param {String} id - element's id
     * @param {String} changeStr - to change string
     */
    function changeHtmlString(id, changeStr) {
        var changeId = document.querySelector("#" + id);

        changeId.innerHTML = changeStr;
    }

    /**
     * Changes the background image of an element.
     * @private
     * @param {String} id - element's id
     * @param {String} changeUrl - to change url
     */
    function changeBackgroundImage(id, changeUrl) {
        var changeId = document.querySelector("#" + id);

        changeId.style.backgroundImage = "url('" + changeUrl + "')";
    }

    /**
     * Changes control page as currentPlayNumber.
     * @private
     */
    function changeControlPage() {
        changeHtmlString("div_title", nowPlaying.titleName);
        changeHtmlString("div_sub_title", nowPlaying.artistName);
        changeBackgroundImage("div_background", nowPlaying.thumbnailFilePath);
    }

    /**
     * Initializes the first control screen.
     * Device status is Gear at first.
     * It displays the information of the first music.(title, artist and background).
     * If there is no music, it does not display any information.
     * @private
     */
    function initControlPage() {

        // There is no music list.
        if (!nowPlaying) {
            changeHtmlString("div_title", TITLE_NO_TRACK);
            changeBackgroundImage("div_background", BACKGROUND_IMAGE_NO_ALBUM);
        }

        // If there is a music list, it displays the information of the first music.
        else {
            currentPlayNumber = 0;
            changeHtmlString("div_title", nowPlaying.titleName);
            changeHtmlString("div_sub_title", nowPlaying.artistName);
            changeBackgroundImage("div_background", nowPlaying.thumbnailFilePath);
        }
    }

    /**
     * Sets current page status to globalPage variable.
     * @public
     * @param {String} page - current page status.
     */
    app.setGlobalPage = function setGloabalPage(page) {
        globalPage = page;
    };

    /**
     * Handles hardware back Event in every page.
     * This sample exits on the main page, and it returns to the main page if the back key is pressed in the pop-up.
     * @private
     * @param {Object} event
     */
    function backEventHandler(event) {
        var popupCircle = document.querySelector("#moreoptionsPopupCircle");

        // The hardware back key occurs.
        if (event.keyName === "back") {
            if (globalPage === "main") {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                tau.closePopup(popupCircle);
                globalPage = "main";
            }
        }
    }

    /**
     * Binds all events (tizen hardware key, click and rotary events).
     * @private
     */
    function bindEvents() {
        document.addEventListener('tizenhwkey', backEventHandler);
        document.querySelector("#div_play").addEventListener('click', function() {
        	if (div_play.className === 'btn pause') {
        		music_player.sendRequest("pause");
        	}
        	if (div_play.className === 'btn play') {
        		music_player.sendRequest("play");
        	}
        });
        document.querySelector("#div_like").addEventListener('click', function() {
        	music_player.sendRequest("like");
        });
        document.querySelector("#div_next").addEventListener('click', function() {
        	music_player.sendRequest("skip");
        });
        document.addEventListener('rotarydetent', function(event) {
        	const direction = event.detail.direction
        	
        	if (direction === "CW") {
        		music_player.sendRequest("volume_up");
        	}
        	if (direction === "CCW") {
        		music_player.sendRequest("volume_down");
        	}
        });
        
        radio.listen(function(playlist) {
        	music_player.sendRequest("update_playlist", playlist);
        });
        
        player.listen(function(event_type, nowPlaying) {
        	nowPlaying = nowPlaying;
        	radio.sendEvent(event_type, nowPlaying.id);
        	
        	// TODO: some events require body
        });
    }

    /**
     * Binds events, get music list, and set music informations.
     * call refreshMusics function of getcontent for get music informations.
     * @private
     */
    function init() {
        bindEvents();
        music_player.connect();
        radio.refresh();
    }

    window.onload = init;

    return app;
}());