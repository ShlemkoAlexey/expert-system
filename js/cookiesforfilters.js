var cookiesLoaded = false;
/*EVENT FOR LOAD COOKIES ONCE AFTER PAGE RELOAD*/
$(document).ajaxStop(function () {

  if (!cookiesLoaded) {
    cookiesLoaded = true;
    loadCookiesForFilters();
    console.log("--------------------------------------------------------------------------------------------------");
    console.log("COOKIES!");
    console.log(Cookies.get());
    console.log("--------------------------------------------------------------------------------------------------");
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

}
