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
  $.getJSON("http://178.62.229.113/cities")
      .done(function(data){
        for (var i = 0; i < data.length; i++){
          citiesArray.push(data[i]);
        }
        console.log("city data recieved");
      })
      .fail(function(){
        console.log("city list load failed");
      })



});

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
