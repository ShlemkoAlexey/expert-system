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
  //loadAdverts("http://178.62.229.113/results/1");
  //Statements.requestAdress = 'http://178.62.229.113/results/';
  //createPaginator(Statements.currentPage, Statements.totalPages);
  $('.result-prices p').tooltip();
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
      $(".results-block").append(createAdvertFrame(data.results[i].url, data.results[i].preview_url, data.results[i].city, data.results[i].actual_price, data.results[i].predicted_price, data.results[i].price_diff, data.results[i].has_garden, data.results[i].has_garage));
    }
    Statements.totalPages = data.pages_count;
    createPaginator(Statements.currentPage, Statements.totalPages);
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

function createAdvertFrame(url, image_url, location, actual_price, predicted_price, price_diff, has_garden, has_garage){
  predicted_price = predicted_price.toFixed();
  price_diff = price_diff.toFixed();

  if (has_garden == 0){
    has_garden = "No"
  }else{
    has_garden = "Yes"
  }

  if (has_garage == 0){
    has_garage = "No"
  }else{
    has_garage = "Yes"
  }

  var price_comparison;
  if(price_diff >=0){
    price_comparison = "overrated";
  }else{
    price_comparison = "underrated";
  }

  return '<div class="result"><div class="row"><div class="col-xs-2"><img src="'+image_url+'" alt="result-image" width="100%"/></div><div class="col-xs-10"><p>Location: '+location+'</p><p>Actual price: '+actual_price+' €<br>Predicted price: '+predicted_price+' €<br>Price difference : '+price_diff+' € ('+price_comparison+')<br><br>Garden: ' + has_garden + '<br>Garage: ' + has_garage + '</p><a href="'+url+'" target="_blank">Go to advert...</a></div></div></div>';
}

function loadCityList(){
  $.getJSON("http://178.62.229.113/cities")
  .done(function(data){
    for (var i = 0; i < data.length; i++){
      citiesArray.push(data[i]);
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
