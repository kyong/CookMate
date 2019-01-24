/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(void 0)("index", ["jquery", "jquery.cookie"], function (exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var $, RAKUTEN_API_APPID, RAKUTEN_API_RECIPE_CATEGORY_URL, RAKUTEN_API_RECIPE_RANKING_URL, category, recipe, fetchRecipe, showRecipe, getLocation, init, errorFunc, errorDump;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            },
            function (_1) {
            }
        ],
        execute: function () {
            RAKUTEN_API_APPID = "1050081927195420252";
            RAKUTEN_API_RECIPE_CATEGORY_URL = "https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=" + RAKUTEN_API_APPID;
            RAKUTEN_API_RECIPE_RANKING_URL = "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&applicationId=" + RAKUTEN_API_APPID;
            category = {};
            recipe = {};
            fetchRecipe = function (collback) {
                $.getJSON(RAKUTEN_API_RECIPE_CATEGORY_URL, function (data, status, jqXHR) {
                    // カテゴリをランダムに選ぶ
                    var randNum = Math.floor(Math.random() * (data.result.large.length - 0) + 0);
                    category = data.result.large[randNum];
                    $.getJSON(RAKUTEN_API_RECIPE_RANKING_URL + "&categoryId=" + category.categoryId, function (data2, status2, jqXHR2) {
                        // レシピをランダムに選ぶ
                        var randNum2 = Math.floor(Math.random() * data2.result.length);
                        recipe = data2.result[randNum2];
                        showRecipe(recipe);
                    });
                });
            };
            showRecipe = function (recipe) {
                $(".windows8").hide();
                var container = $("#container");
                container.append("<img src=\"" + recipe.smallImageUrl + "\">");
                container.append("<p>" + recipe.recipeTitle + "</p>");
                container.append("<p>" + recipe.recipeDescription + "</p>");
                container.append("<p><a href=\"" + recipe.recipeUrl + "\" target=\"_blank\">" + recipe.recipeUrl + "</a></p>");
                var material = $('<ul></ul>').addClass('material');
                for (var _i = 0, _a = recipe.recipeMaterial; _i < _a.length; _i++) {
                    var recipeMaterial = _a[_i];
                    material.append("<li>" + recipeMaterial + "</li>");
                }
                container.append(material);
            };
            getLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log("position", position);
                    }, errorFunc, {
                        "enableHighAccuracy": false,
                        "timeout": 8000,
                        "maximumAge": 5000,
                    });
                }
            };
            init = function () {
                //ユーザー判定
                // var userid = ($.cookie("userid"));
                // if( userid == undefined ) {
                //     $.cookie( "userid" );
                // }
                fetchRecipe();
            };
            errorFunc = function (error) {
                var errorcode = error.code;
                var errorMsg = "";
                switch (errorcode) {
                    default:
                    case "0":
                        errorMsg = "原因不明のエラーが発生しました…。";
                        break;
                    case "1":
                        errorMsg = "位置情報の取得が許可されませんでした…。";
                        break;
                    case "2":
                        errorMsg = "電波状況などで位置情報が取得できませんでした…。";
                        break;
                    case "3":
                        errorMsg = "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。";
                        break;
                }
                // エラーコードに合わせたエラー内容をアラート表示
                errorDump(errorMsg);
            };
            errorDump = function (errorMsg) {
                $("#err").text(errorMsg);
            };
            $(document).ready(function () {
                init();
            });
        }
    };
});


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map