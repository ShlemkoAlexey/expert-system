/*
google map api key - AIzaSyBklFTAeUj8Nal2yTbVsfqG3hGOrMPEkDc
*/
var map;
function initMap() {
  var myLatLng = {lat: 52.2392, lng: 4.78545};

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 10
  });

  var contentString = '<img src="http://cloud.funda.nl/valentina_media/066/132/818_360x240.jpg" width="180px">'+
  '<b><div>Adress: De kwakel 1424CK</div>'+
  '<div>Price: 232500</div>'+
  '<div style="color:green;"><i class="mdi mdi-arrow-down-bold"></i> 97626</div>'+
  '<div><a href="http://www.funda.nl/koop/de-kwakel/huis-49897238-seringenlaan-5/">Link</a></div></b>';



  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!',
    animation: google.maps.Animation.DROP,
    icon: "src/flag-green.png"
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });



  $(".map-switch-button-map").click(function(){
    $("#map").css("display","block");
    $(".results-block, .paginator").css("display","none");
    google.maps.event.trigger(map, 'resize');
  });

  $(".map-switch-button-list").click(function(){
    $("#map").css("display","none");
    $(".results-block, .paginator").css("display","block");
  });

}
