var citiesArray = [];
var inputField = $('.city-field');
var selectField = $(".city-options-list");
var selectFieldItem = $(".city-options-list li");


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
  loadAdverts("Amsterdam");
});

$(".filter-button").click(function(){
  loadAdverts(inputField.val());
});
function loadAdverts(city){
  $.getJSON("http://178.62.229.113/filter/include/city/"+city)
    .done(function(data){
      console.log("adverts data loaded");
      $(".results-block").empty();
      for (var i = 0; i < data.length; i++) {
        $(".results-block").append(createAdvertFrame(data[i].url, 'http://wooden-houses.kiev.ua/wp-content/uploads/2014/06/dom-profilirovannyi-brus.jpg', data[i].city, data[i].actual_price, data[i].predicted_price, data[i].price_diff, data[i].has_garden, data[i].has_garage));
      }
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
