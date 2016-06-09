var citiesArray = [];

var Statements = {
  "currentPage": 1,
  "totalPages": 5,
  "requestAdress": "",
  "requestPort": 80,
  "sortType": ""
}
var defaultAdress = 'http://178.62.229.113:'+Statements.requestPort+'/filter?city_filter=muhosransk&city_mode=0&page_number=';

$(document).ready(function(){
  loadCityList();
  loadAdverts(defaultAdress + Statements.currentPage);
  Statements.requestAdress = defaultAdress;
  createPaginator(Statements.currentPage, Statements.totalPages);
  createSliders();
});

$(".filter-button").click(function(){
  var cityList;
  var filterOption;
  var typeFilterOption = '';
  var minPriceOption;
  var maxPriceOption;
  var minAreaOption;
  var maxAreaOption;
  var predictionType;
  $(".mdi").removeClass("mdi-black");

  if ($('.filtered-cities-list li').length > 0){
    cityList = "&city_filter="+getCityListFromUL();
    if ($("input:radio[name ='inc-exc-radio']:checked").val() == "include") {
      filterOption = "&city_mode=1";
    }else{
      filterOption = "&city_mode=0";
    }
  }else {
    cityList = "&city_filter=muhosransk";
    filterOption = "&city_mode=0";
  }

  if ($(".house-type-select").val() == "House") {
    typeFilterOption = "&type_filter=1";
  }else if ($(".house-type-select").val() == "Apartment") {
    typeFilterOption = "&type_filter=0";
  }

  if ($('.prediction-type-select').val() == "District model") {
    predictionType = "&district_model=1";
  }else if($('.prediction-type-select').val() == "Global model"){
    predictionType = "&district_model=0";
  }



  minPriceOption = "&price_start="+$(".price-slider").slider("values", 0);
  maxPriceOption = "&price_end="+$(".price-slider").slider("values", 1);
  minAreaOption = "&min_area="+$(".area-slider").slider("values", 0);
  maxAreaOption = "&max_area="+$(".area-slider").slider("values", 1);

  Statements.requestAdress = "http://178.62.229.113:"+Statements.requestPort+"/filter?"+ cityList + filterOption + typeFilterOption +minPriceOption + maxPriceOption + minAreaOption + maxAreaOption + predictionType + Statements.sortType + "&page_number=";

  Statements.sortType = "";
  Statements.currentPage = 1;
  loadAdverts(Statements.requestAdress+Statements.currentPage);
});

$(".sort-area-asc").click(function(){
  Statements.sortType = "&sort_by=area&sort_direction=-1";
$(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});
$(".sort-area-desc").click(function(){
  Statements.sortType = "&sort_by=area&sort_direction=1";
  $(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});

$(".sort-diff-asc").click(function(){
  Statements.sortType = "&sort_by=price_diff&sort_direction=-1";
$(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});
$(".sort-diff-desc").click(function(){
  Statements.sortType = "&sort_by=price_diff&sort_direction=1";
$(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});

$(".sort-actual-asc").click(function(){
  Statements.sortType = "&sort_by=actual_price&sort_direction=-1";
  $(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});
$(".sort-actual-desc").click(function(){
  Statements.sortType = "&sort_by=actual_price&sort_direction=1";
  $(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});

$(".sort-predicted-asc").click(function(){
  Statements.sortType = "&sort_by=predicted_price&sort_direction=-1";
  $(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});
$(".sort-predicted-desc").click(function(){
  Statements.sortType = "&sort_by=predicted_price&sort_direction=1";
  $(".filter-button").trigger("click");
  $(this).addClass("mdi-black");

});



function loadAdverts(requestAdress){
  $('.global-preloader').show();
  $.getJSON(requestAdress)
  .done(function(data){
    console.log("request port "+ Statements.requestPort);
    console.log("adverts data loaded from "+Statements.requestAdress + Statements.currentPage);

    $(".results-block").empty();
    for (var i = 0; i < data.results.length; i++) {
      $(".results-block").append(createAdvertFrame(data.results[i].url, data.results[i].preview_url, data.results[i].city, data.results[i].actual_price, data.results[i].predicted_price, data.results[i].price_diff, data.results[i].has_garden, data.results[i].has_garage, data.results[i].house_type, data.results[i].rooms_count, data.results[i].bedrooms_count, data.results[i].description, data.results[i].area, data.results[i].post_code));
    }
    Statements.totalPages = data.pages_count;
    createPaginator(Statements.currentPage, Statements.totalPages);
    $('.result-prices p').tooltip();

    if ($(".results-block")[0].childElementCount == 0) {
      console.log("No results found for this parameters");
      $(".results-block").append("<div style='font-size: 200%; height:150px; text-align:center;'><i>No results found for this parameters.</i></div>");
    }
    $('.global-preloader').hide();
  })
  .fail(function(){
    console.log("advert data load failed");
    $('.global-preloader').hide();
  });
}




function showCityListForSelect(array, string, input, list){
  var arrayForOutput = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i].indexOf(capitalizeFirstLetter(string)) == 0) {
      arrayForOutput.push(array[i]);
    }
  }
  list.empty();
  for (var i = 0; i < arrayForOutput.length; i++) {
    list.append("<li>"+arrayForOutput[i]+"</li>");
  }
  arrayForOutput.sort();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAdvertFrame(url, image_url, location, actual_price, predicted_price, price_diff, has_garden, has_garage, type, rooms, bedrooms, description, area, post_code){
  predicted_price = predicted_price.toFixed();
  price_diff = price_diff.toFixed();

  if (has_garden == 0){
    has_garden = "<i class='mdi mdi-close' style = 'color:red;'></i>"
  }else{
    has_garden = "<i class='mdi mdi-check' style = 'color:green;'></i>"
  }

  if (has_garage == 0){
    has_garage = "<i class='mdi mdi-close' style = 'color:red;'></i>"
  }else{
    has_garage = "<i class='mdi mdi-check' style = 'color:green;'></i>"
  }

  var price_comparison;
  if(price_diff >=0){
    price_comparison = '<p data-toggle="tooltip" data-placement="bottom" title="Overrated"><i class="mdi mdi-arrow-up-bold"></i> <span style="color:red">'+price_diff+'€</span></p>';
  }else{
    price_comparison = '<p data-toggle="tooltip" data-placement="bottom" title="Underrated"><i class="mdi mdi-arrow-down-bold"></i> <span style="color:green">'+(price_diff*(-1))+'€</span></p>';
  }

  if (type == 1) {
    type = "House"
  }else {
    type = "Apartment"
  }
  return '<div class="result">  <div class="row">  <div class="col-xs-2">  <a href="'+url+'" target="_blank"><img src="'+image_url+'" alt="result-image" class="result-image"/></a>  </div>  <div class="col-xs-10">  <a class="result-city-name" href="'+url+'" target="_blank">'+capitalizeFirstLetter(location)+', ' + post_code + '</p></a>  <div class="row">  <div class="col-xs-8">  <div class="row">  <div class="col-xs-5 result-data">  <p>  Type: '+type+'  </p>  <p>  Rooms: '+rooms+' ('+bedrooms+' bedrooms)  </p>  <p>  Area: '+area+' m<sup>3</sup>  </p>  </div>  <div class="col-xs-7 result-options">  <p>  Garden:'+has_garden+'  </p>  <p>  Garage: '+has_garage+'  </p>  </div>  </div>  <p class="result-description">  '+cutDescription(description)+'  </p>  <a target="_blank" href="'+url+'" class="result-link">  Go to advert...  </a>  </div>  <div class="col-xs-4 result-prices">  <p>  actual:<span>'+actual_price+'€</span>  </p>  <p>  predicted:<span>'+predicted_price+'€</span>  </p>  '+price_comparison+'  </div>  </div>  </div>  </div>  </div>';
}

function loadCityList(){
  $.getJSON("http://178.62.229.113/cities")
  .done(function(data){
    for (var i = 0; i < data.length; i++){
      citiesArray.push(capitalizeFirstLetter(data[i]));
    }
    console.log("city list loaded");
    $( ".city-field" ).autocomplete({
      source: citiesArray,
      minLength: 2,
      select: function( event, ui ) {
        $('.filtered-cities-list').append( "<li>" + ui.item.value + "<i class='mdi mdi-close'></i></li>" );
        $('.filtered-cities-list li i').unbind();
        $('.filtered-cities-list li i').on('click', function(){
          citiesArray.push($(this).parent()[0].innerText);
          $(this).parent().remove();
          citiesArray.sort();
        });
        removeValueFromArray(citiesArray, ui.item.value);
        $(".city-field").val();
        $(this).val('');
        $('.filtered-cities-list li:last-child').addClass("background-red", 350, function(){
          $(this).removeClass("background-red", 350);
        });
        return false;
      },
      delay: 150
    });
  })
  .fail(function(){
    console.log("city list load failed");
  });
}

function createPaginator(currentPage, totalPages){
  $(".paginator ul").empty();
  if ((currentPage-1) > 0) {
    $(".paginator ul").append("<li class='first-page'>&laquo</li>");
    $(".paginator ul").append("<li class='prev-page'>&#8249</li>");
    if (currentPage-2 > 0) {
      $(".paginator ul").append("<li class='prev-two-pages'> "+(currentPage-2)+" </li>");
    }
    $(".paginator ul").append("<li class='prev-page'>" + (currentPage-1)+"</li>");
  }
  $(".paginator ul").append("<li class='current-page'>" + currentPage + "</li>");
  if ((currentPage+1) <= totalPages) {
    $(".paginator ul").append("<li class='next-page'>" + (currentPage+1) +"</li>");
    if (currentPage+2 <= totalPages) {
      $(".paginator ul").append("<li class='next-two-pages'> "+(currentPage+2)+" </li>");
    }
    $(".paginator ul").append("<li class='next-page'>&#8250</li>");
    $(".paginator ul").append("<li  class='last-page'>&raquo</li>");
  }
  bindEventsToPaginator();
}

function bindEventsToPaginator(){
  $(".first-page").on("click", function(){
    Statements.currentPage = 1;
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".last-page").on("click", function(){
    Statements.currentPage = Statements.totalPages;
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".prev-page").on("click", function(){
    Statements.currentPage--;
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".next-page").on("click", function(){
    Statements.currentPage++;
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".prev-two-pages").on("click", function(){
    Statements.currentPage--;
    Statements.currentPage--;
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".next-two-pages").on("click", function(){
    Statements.currentPage++;
    Statements.currentPage++;
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });

  $(".paginator ul li").on("click", function(){

    var offset = $(".paginator").offset().top;
    if ($(document).scrollTop() > offset) {
      $(document).scrollTop(offset);
    }
  })
}

function cutDescription(string){
  return string.substr(0,400) + "...";
}

function getCityListFromUL(){
  var string = '';
  for (var i = 0; i < $('.filtered-cities-list li').length; i++) {
    string = string + ($('.filtered-cities-list li')[i].innerText||$('.filtered-cities-list li')[i].textContent) + ',';  //fix of innerText problem in firefox
  }
  return string.slice(0, -1);
}

function removeValueFromArray(array, value){
  for (var i = 0; i < array.length; i++) {
    if (value == array[i]) {
      array.splice(i, 1);
    }
  }
};

function createSliders(){
  $.getJSON('http://178.62.229.113:'+Statements.requestPort+'/filter_limits')
  .done(function(data){
    $(".price-slider").slider({
      animate: "fast",
      min: +data.min_price,
      max: +data.max_price,
      values: [+data.min_price, +data.max_price],
      range: true,
      step: 1000,
      slide: function( event, ui ) {
        refreshSliderValues();
      },
      change: function( event, ui ) {
        refreshSliderValues();
      }
    });
    $(".price-slider").draggable();
    $(".area-slider").slider({
      animate: "fast",
      min: +data.min_area,
      max: +data.max_area,
      values: [+data.min_area, +data.max_area],
      range: true,
      slide: function( event, ui ) {
        refreshSliderValues();
      },
      change: function( event, ui ) {
        refreshSliderValues();
      }
    });
    $(".area-slider").draggable();
    refreshSliderValues();

  })
  .fail(function(){
    console.log("sliders data load failed");
  });

}

function refreshSliderValues(){
  $(".price-min").html( numeral($(".price-slider").slider("values", 0)).format('0,0') );
  $(".price-max").html( numeral($(".price-slider").slider("values", 1)).format('0,0') );
  $(".area-min").html($(".area-slider").slider("values", 0));
  $(".area-max").html($(".area-slider").slider("values", 1));
}
