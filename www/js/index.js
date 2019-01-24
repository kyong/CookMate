(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
// src/ts/index.ts
// import * as $ from "jquery";
// import "jquery.cookie";
var RAKUTEN_API_APPID = "1050081927195420252";
var RAKUTEN_API_RECIPE_CATEGORY_URL = "https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=" + RAKUTEN_API_APPID;
var RAKUTEN_API_RECIPE_RANKING_URL = "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&applicationId=" + RAKUTEN_API_APPID;
var category = {};
var recipe = {};
var fetchRecipe = function (collback) {
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
var showRecipe = function (recipe) {
    $(".windows8").hide();
    var container = $("#container");
    $("#recipeObj").remove();
    var recipeObj = $('<div id="recipeObj">');
    recipeObj.append("<input type=\"hidden\" name=\"recipeTitle\" value=\"" + recipe.recipeTitle + "\" >");
    recipeObj.append("<input type=\"hidden\" name=\"recipeUrl\" value=\"" + recipe.recipeUrl + "\" >");
    recipeObj.append("<input type=\"hidden\" name=\"recipeMaterial\" value=\"" + JSON.stringify(recipe.recipeMaterial) + "\" >");
    recipeObj.append("<img src=\"" + recipe.smallImageUrl + "\">");
    recipeObj.append("<p>" + recipe.recipeTitle + "</p>");
    recipeObj.append("<p>" + recipe.recipeDescription + "</p>");
    // recipeObj.append("<p><a href=\"" + recipe.recipeUrl + "\" target=\"_blank\">" + recipe.recipeUrl + "</a></p>");
    var material = $('<div class="row material">');
    for (var _i = 0, _a = recipe.recipeMaterial; _i < _a.length; _i++) {
        var recipeMaterial = _a[_i];
        material.append('<div class="col-sm-4 col-md-4">' + recipeMaterial + "</div>");
    }
    recipeObj.append(material);
    container.append(recipeObj);
};
var getLocation = function () {
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
var init = function () {
    //ユーザー判定
    // var userid = ($.cookie("userid"));
    // if( userid == undefined ) {
    //     $.cookie( "userid" );
    // }
    fetchRecipe();
};
var errorFunc = function (error) {
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
var errorDump = function (errorMsg) {
    $("#err").text(errorMsg);
};
var selectlog = function (title, url, material, isAcceptability, callback) {
    $.ajax({
        url: 'https://08jc3vxzy4.execute-api.ap-northeast-1.amazonaws.com/prod',
        method: 'POST',
        data: {
            'title': title,
            'url': url,
            'material': material,
            'isAcceptability': isAcceptability,
        },
        dataType: 'json'
    }).done(function (data) {
        callback(data);
    });
};
var getSelectRecipe = function () {
    var recipeTitle = $('form[name="anchor"]').find('input[name="recipeTitle"]').val();
    var recipeUrl = $('form[name="anchor"]').find('input[name="recipeUrl"]').val();
    var recipeMaterial = $('form[name="anchor"]').find('input[name="recipeMaterial"]').val();
    return {
        recipeTitle: recipeTitle,
        recipeUrl: recipeUrl,
        recipeMaterial: recipeMaterial,
    };
};
$(document).ready(function () {
    init();
    $('#done').on('click', function (e) {
        var childWindow = window.open('about:blank');
        var data = getSelectRecipe();
        selectlog(data.recipeTitle, data.recipeUrl, data.recipeMaterial, true, function () {
            childWindow.location.href = data.recipeUrl;
            // delete childWindow;
        });
    });
    $('#next').on('click', function (e) {
        var data = getSelectRecipe();
        selectlog(data.recipeTitle, data.recipeUrl, data.recipeMaterial, false, function () {
            fetchRecipe();
        });
    });
});

},{}]},{},[1]);
