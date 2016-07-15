/*
  google map api key - AIzaSyBklFTAeUj8Nal2yTbVsfqG3hGOrMPEkDc
*/
var map;
function initMap() {
  var myLatLng = {lat: 52.26783, lng: 5.167523};
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 12
  });


  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!',
    animation: google.maps.Animation.DROP
  });

$(".map-switch-button-map").click(function(){
  $("#map").css("display","block");
  $(".results-block, .paginator").css("display","none");
  google.maps.event.trigger(map, 'resize');
});

$(".map-switch-button-list").click(function(){
  $("#map").css("display","none");
  $(".results-block, paginator").css("display","block");
});

}
