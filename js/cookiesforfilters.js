/*EVENT FOR LOAD COOKIES ONCE AFTER PAGE RELOAD*/
var cookiesLoaded = false;
$(document).ajaxStop(function () {
  if (!cookiesLoaded) {
    cookiesLoaded = true;
    loadCookiesForFilters();
    console.log(Cookies.get());
  }
});
/*EVENT FOR LOAD COOKIES ONCE AFTER PAGE RELOAD*/

$(".filter-button").click(function(){
  setCookiesForFilter();
});

function setCookiesForFilter(){
  Cookies.set("cityList", getCityListFromUL());
  Cookies.set("includeExclude", $("input:radio[name ='inc-exc-radio']:checked").val())
  Cookies.set("houseType", $(".house-type-select").val());
  Cookies.set("predictionType", $('.prediction-type-select').val());
  Cookies.set("priceMin", $(".price-slider").slider("values", 0));
  Cookies.set("priceMax", $(".price-slider").slider("values", 1));
  Cookies.set("areaMin", $(".area-slider").slider("values", 0));
  Cookies.set("areaMax", $(".area-slider").slider("values", 1));
  console.log(Cookies.get());
}

function loadCookiesForFilters(){
  //INCLUDE/EXCLUDE FILTER
  try {
    if (Cookies.get("includeExclude") == "include") {
      $("input:radio[name ='inc-exc-radio'][value='include']").attr('checked', 'checked');
    }else if(Cookies.get("includeExclude") == "exclude"){
      $("input:radio[name ='inc-exc-radio'][value='exclude']").attr('checked', 'checked');
    }
  } catch (e) {
    console.log("inclide-exclude cookie not loaded");
  }

  //HOUSE TYPE FILTER
  try {
    if (Cookies.get("houseType") == "All") {
      $(".house-type-select").val("All")
    }else if (Cookies.get("houseType") == "House") {
      $(".house-type-select").val("House")
    }else if(Cookies.get("houseType") == "Apartment"){
      $(".house-type-select").val("Apartment")
    }
  } catch (e) {
    console.log("house type cookie not loaded");
  }

  //PREDICTION TYPE FILTER
  try {
    if (Cookies.get("predictionType") == "District model") {
      $(".prediction-type-select").val("District model")
    }else if (Cookies.get("predictionType") == "Global model") {
      $(".prediction-type-select").val("Global model")
    }
  } catch (e) {
    console.log("house type cookie not loaded");
  }

  //CITY LIST FILTER
  try {
    var cityListForLoad = Cookies.get("cityList").split(",");
    console.log(cityListForLoad);
    for (var i = 0; i < cityListForLoad.length; i++) {
      if (cityListForLoad[i].length>0) {
        $('.filtered-cities-list').append( "<li>" + cityListForLoad[i] + "<i class='mdi mdi-close'></i></li>" );
        removeValueFromArray(citiesArray, cityListForLoad[i]);
      }
    }

    $('.filtered-cities-list li i').unbind();
    $('.filtered-cities-list li i').on('click', function(){
      citiesArray.push($(this).parent()[0].innerText||$(this).parent()[0].textContent);
      $(this).parent().remove();
      citiesArray.sort();
    });
  } catch (e) {
    console.log("city list cookie not loaded");
  }

  //PRICE AND AREA FILTERS //////TROUBLE HERE!!!!!!!!!!!!!!!!

  try {
    console.log([+Cookies.get("priceMin"), +Cookies.get("priceMax")]);
    console.log("isNAN: " + isNaN(Cookies.get("priceMin")));
    if (!isNaN(Cookies.get("priceMin"))&&!isNaN(Cookies.get("priceMax"))&&!isNaN(Cookies.get("areaMin"))&&!isNaN(Cookies.get("areaMax"))) {
      $(".price-slider").slider("values", [+Cookies.get("priceMin"), +Cookies.get("priceMax")]);
      $(".area-slider").slider("values", [+Cookies.get("areaMin"), +Cookies.get("areaMax")]);
    }
  } catch (e) {
    console.log(e);
    console.log("price and area cookies not loaded");
  }
  $(".filter-button").trigger("click");
}


//FOR POP-UP

if (!Cookies.get("popup")) {
  $("#cookie-popup").css("display", "block");
}

$("#cookie-popup button").click(function(){
  $("#cookie-popup").fadeOut();
  Cookies.set("popup", true, { expires: 30 });
});
