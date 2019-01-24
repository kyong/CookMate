'use strict';
// src/ts/index.ts
// import * as $ from "jquery";
// import "jquery.cookie";

const RAKUTEN_API_APPID: string = "1050081927195420252";
const RAKUTEN_API_RECIPE_CATEGORY_URL: string =  "https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=" +RAKUTEN_API_APPID;
const RAKUTEN_API_RECIPE_RANKING_URL: string = "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&applicationId="+RAKUTEN_API_APPID;

let category: any = {};
let recipe: any = {};
var apigClient = apigClientFactory.newClient();

const fetchRecipe = ( collback?: Function ) => {

    $.getJSON( RAKUTEN_API_RECIPE_CATEGORY_URL, ( data:any, status:string, jqXHR:JQueryXHR ) => {

        // カテゴリをランダムに選ぶ
        let randNum: number = Math.floor(Math.random() * ( data.result.large.length - 0 ) + 0 );
        category = data.result.large[randNum];

        $.getJSON( RAKUTEN_API_RECIPE_RANKING_URL + "&categoryId=" + category.categoryId , ( data2: any, status2:string, jqXHR2:JQueryXHR  ) => {
            // レシピをランダムに選ぶ
            let randNum2: number = Math.floor(Math.random() * data2.result.length);
            recipe =  data2.result[randNum2];
            showRecipe( recipe );
        });

    } );
}

const showRecipe = ( recipe:any ) => {
    $(".windows8").hide();
    let container:any = $("#container");
    
    $("#recipeObj").remove();
    let recipeObj: any = $('<div id="recipeObj">');
    recipeObj.append("<input type=\"hidden\" name=\"recipeTitle\" value=\""+ recipe.recipeTitle +"\" >");
    recipeObj.append("<input type=\"hidden\" name=\"recipeUrl\" value=\""+ recipe.recipeUrl +"\" >");
    recipeObj.append("<input type=\"hidden\" name=\"recipeMaterial\" value=\""+ JSON.stringify(recipe.recipeMaterial) +"\" >");
    recipeObj.append("<img src=\"" + recipe.smallImageUrl + "\">");
    recipeObj.append("<p>" + recipe.recipeTitle + "</p>");
    recipeObj.append("<p>" + recipe.recipeDescription + "</p>");
    // recipeObj.append("<p><a href=\"" + recipe.recipeUrl + "\" target=\"_blank\">" + recipe.recipeUrl + "</a></p>");

    let material = $( '<div class="row material">');
    for ( let recipeMaterial of recipe.recipeMaterial){
        material.append('<div class="col-sm-4 col-md-4">' + recipeMaterial + "</div>");  
    }
    recipeObj.append(material);
    container.append(recipeObj);
}

const getLocation = () => {

    if( navigator.geolocation ){
        navigator.geolocation.getCurrentPosition( ( position ) =>{
            console.log( "position", position );

        } , errorFunc , {
            "enableHighAccuracy": false ,
            "timeout": 8000 ,
            "maximumAge": 5000 ,
        } ) ;
    }

}

const init = () =>{
    //ユーザー判定
    // var userid = ($.cookie("userid"));
    // if( userid == undefined ) {
    //     $.cookie( "userid" );
    // }
    fetchRecipe();
} 
const errorFunc = ( error:any ) =>{
    var errorcode:string = error.code;
    var errorMsg:string = "";
    switch( errorcode ){
        default:
        case "0":
            errorMsg =  "原因不明のエラーが発生しました…。";
            break;
        case "1":
            errorMsg =  "位置情報の取得が許可されませんでした…。";
            break;
        case "2":
            errorMsg =  "電波状況などで位置情報が取得できませんでした…。";
            break;
        case "3":
            errorMsg =  "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。";
            break;
    }

	// エラーコードに合わせたエラー内容をアラート表示
	errorDump( errorMsg ) ;
}

const errorDump = ( errorMsg:string ) =>
{
    $("#err").text(errorMsg);
}

const   selectlog = ( title:string, url:string, material:any, isAcceptability:boolean, callback:Function ) =>
{
    $.ajax(
        {
            url: 'https://08jc3vxzy4.execute-api.ap-northeast-1.amazonaws.com/prod',
            method: 'POST',
            data: {
                'title': title,
                'url': url,
                'material': material,
                'isAcceptability': isAcceptability,
            },
            dataType: 'json'
        }
    ).done(( data ) => {
        callback(data);
  });
}
const getSelectRecipe = () =>
{
    let recipeTitle = $('form[name="anchor"]').find( 'input[name="recipeTitle"]' ).val();
    let recipeUrl = $('form[name="anchor"]').find( 'input[name="recipeUrl"]' ).val();
    let recipeMaterial = $('form[name="anchor"]').find( 'input[name="recipeMaterial"]' ).val();

    return {
        recipeTitle: recipeTitle,
        recipeUrl: recipeUrl,
        recipeMaterial: recipeMaterial,
    }
}



$(document).ready( () => {
    init();
    $('#done').on('click', ( e ) => {
        let childWindow:any = window.open('about:blank');
        let data = getSelectRecipe();
        selectlog( data.recipeTitle, data.recipeUrl, data.recipeMaterial, true, () =>{
            childWindow.location.href = data.recipeUrl;
            // delete childWindow;
        });


    });

    $('#next').on('click', ( e ) => {
        
        let data = getSelectRecipe();
        selectlog( data.recipeTitle, data.recipeUrl, data.recipeMaterial, false, () =>{
            fetchRecipe();
        } );
    });
});

