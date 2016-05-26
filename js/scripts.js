var citiesArray = [];
var inputField = $('.city-field');
var selectField = $(".city-options-list");
var selectFieldItem = $(".city-options-list li");

var Statements = {
  "currentPage": 1,
  "totalPages": 5,
  "requestAdress": ""
}


inputField.keyup(function (event) {
  if (inputField.val().length > 0) {
    showCityListForSelect(citiesArray, inputField.val(), inputField, selectField);
  }else {
    selectField.empty();
  }
});

$(document).on("click", ".city-options-list li", function(){
  inputField.val($(this).html());
  selectField.empty();
});

$(document).ready(function(){
  loadCityList();
  loadAdverts("http://178.62.229.113/results/1");
  Statements.requestAdress = 'http://178.62.229.113/results/';
  createPaginator(Statements.currentPage, Statements.totalPages);
});

$(".filter-button").click(function(){
  loadAdverts("http://178.62.229.113/filter/include/city/"+inputField.val());
  Statements.currentPage = 1;
  Statements.requestAdress = "http://178.62.229.113/filter/include/city/"+inputField.val()+"/";

});
function loadAdverts(requestAdress){
  $.getJSON(requestAdress)
  .done(function(data){
    console.log("adverts data loaded");
    $(".results-block").empty();
    for (var i = 0; i < data.results.length; i++) {
      $(".results-block").append(createAdvertFrame(data.results[i].url, data.results[i].preview_url, data.results[i].city, data.results[i].actual_price, data.results[i].predicted_price, data.results[i].price_diff, data.results[i].has_garden, data.results[i].has_garage, data.results[i].house_type, data.results[i].rooms_count, data.results[i].bedrooms_count, data.results[i].description, data.results[i].area));
    }
    Statements.totalPages = data.pages_count;
    createPaginator(Statements.currentPage, Statements.totalPages);
    $('.result-prices p').tooltip();
  })
  .fail(function(){
    console.log("advert data load failed");
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

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAdvertFrame(url, image_url, location, actual_price, predicted_price, price_diff, has_garden, has_garage, type, rooms, bedrooms, description, area){
  predicted_price = predicted_price.toFixed();
  price_diff = price_diff.toFixed();

  if (has_garden == 0){
    has_garden = "<i class='mdi mdi-close'></i>"
  }else{
    has_garden = "<i class='mdi mdi-check'></i>"
  }

  if (has_garage == 0){
    has_garage = "<i class='mdi mdi-close'></i>"
  }else{
    has_garage = "<i class='mdi mdi-check'></i>"
  }

  var price_comparison;
  if(price_diff >=0){
    price_comparison = '<p data-toggle="tooltip" data-placement="bottom" title="Overrated"><i class="mdi mdi-arrow-up-bold"></i> <span style="color:red">'+price_diff+'€</span></p>';
  }else{
    price_comparison = '<p data-toggle="tooltip" data-placement="bottom" title="Underrated"><i class="mdi mdi-arrow-down-bold"></i> <span style="color:green">'+(price_diff*(-1))+'€</span></p>';
  }

  if (type == 0) {
    type = "House"
  }else {
    type = "Apartment"
  }
  return '<div class="result">  <div class="row">  <div class="col-xs-2">  <a href="'+url+'" target="_blank"><img src="'+image_url+'" alt="result-image" class="result-image"/></a>  </div>  <div class="col-xs-10">  <a class="result-city-name" href="'+url+'" target="_blank">'+capitalizeFirstLetter(location)+'</p></a>  <div class="row">  <div class="col-xs-8">  <div class="row">  <div class="col-xs-5 result-data">  <p>  Type: '+type+'  </p>  <p>  Rooms: '+rooms+' ('+bedrooms+' bedrooms)  </p>  <p>  Area: '+area+' m<sup>3</sup>  </p>  </div>  <div class="col-xs-7 result-options">  <p>  Garden:'+has_garden+'  </p>  <p>  Garage: '+has_garage+'  </p>  </div>  </div>  <p class="result-description">  '+cutDescription(description)+'  </p>  <a target="_blank" href="'+url+'" class="result-link">  Go to advert...  </a>  </div>  <div class="col-xs-4 result-prices">  <p>  actual:<span>'+actual_price+'€</span>  </p>  <p>  predicted:<span>'+predicted_price+'€</span>  </p>  '+price_comparison+'  </div>  </div>  </div>  </div>  </div>';
}

function loadCityList(){
  $.getJSON("http://178.62.229.113/cities")
  .done(function(data){
    for (var i = 0; i < data.length; i++){
      citiesArray.push(capitalizeFirstLetter(data[i]));
    }
    console.log("city list loaded");
  })
  .fail(function(){
    console.log("city list load failed");
  });
}

function createPaginator(currentPage, totalPages){
  $(".paginator ul").empty();
  $(".paginator ul").append("<li class='first-page'>&laquo</li>");
  if ((currentPage-1) > 0) {
    $(".paginator ul").append("<li class='prev-page'>" + (currentPage-1)+"</li>");
  }
  $(".paginator ul").append("<li class='current-page'>" + currentPage + "</li>");
  if ((currentPage+1) <= totalPages) {
    $(".paginator ul").append("<li class='next-page'>" + (currentPage+1) +"</li>");
  }
  $(".paginator ul").append("<li  class='last-page'>&raquo</li>");
  bindEventsToPaginator();
}

function bindEventsToPaginator(){
  $(".first-page").on("click", function(){
    Statements.currentPage = 1;
    console.log(Statements.currentPage);
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".last-page").on("click", function(){
    Statements.currentPage = Statements.totalPages;
    console.log(Statements.currentPage);
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".prev-page").on("click", function(){
    Statements.currentPage--;
    console.log(Statements.currentPage);
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".next-page").on("click", function(){
    Statements.currentPage++;
    console.log(Statements.currentPage);
    createPaginator(Statements.currentPage, Statements.totalPages);
    loadAdverts(Statements.requestAdress + Statements.currentPage);
  });
  $(".paginator ul li").on("click", function(){
    $(document).scrollTop(0);
  })
}

function cutDescription(string){
    return string.substr(0,400) + "...";
}
