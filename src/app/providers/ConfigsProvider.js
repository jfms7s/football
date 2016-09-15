(function () {
    "use strict";
    angular.module("app")
        .provider("Configs", Configs);

    Configs.$inject = [];
    function Configs() {

        var _apiUrl_ = "http://api.football-data.org/" ;
        var _apiKey_ = "293eb02126bd4780b14c49af3ff7c4a0";

        return {
            setApiUrl   : setApiUrl,
            getApiUrl   : getApiUrl,
            setApiKey   : setApiKey,
            getApiKey   : getApiKey,
            $get: function () {
                return {
                    get apiUrl(){
                        return _apiUrl_;
                    },
                    get apiKey(){
                        return _apiKey_;
                    }
                };
            }
        };

        /**
         * Get api url
         *
         * @returns {String}
         */
        function getApiUrl () {
            return _apiUrl_;
        }

        /**
         * Get api key
         *
         * @returns {String}
         */
        function getApiKey () {
            return _apiKey_;
        }

        /**
         * Set the url for the Api url
         *
         * @param {String} url
         */
        function setApiUrl (url) {
            _apiUrl_ = url;
        }

        /**
         * Set the url for the Api key
         *
         * @param {String} key
         */
        function setApiKey (key) {
            _apiKey_ = key;
        }


    }
})();
