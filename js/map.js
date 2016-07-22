/*
google map api key - AIzaSyBklFTAeUj8Nal2yTbVsfqG3hGOrMPEkDc
*/
var map;
var markers = [];

function initMap() {
  var myLatLng = {lat: 54.5, lng: 1};

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 7
  });

  var contentString = '<img src="http://cloud.funda.nl/valentina_media/066/132/818_360x240.jpg" width="180px">'+
  '<b><div><a href="http://www.funda.nl/koop/de-kwakel/huis-49897238-seringenlaan-5/">De kwakel 1424CK</a></div>'+
  '<div>Price: 232500</div>'+
  '<div style="color:green;"><i class="mdi mdi-arrow-down-bold"></i> 97626</div>'+
  '</b>';



  // var infowindow = new google.maps.InfoWindow({
  //   content: contentString
  // });
  //
  // var marker = new google.maps.Marker({
  //   position: myLatLng,
  //   map: map,
  //   title: 'Hello World!',
  //   animation: google.maps.Animation.DROP
  // });
  //
  // marker.addListener('click', function() {
  //   infowindow.open(map, marker);
  // });



  $(".map-switch-button-map").click(function(){
    $("#map").css("display","block");
    $(".results-block, .paginator").css("display","none");
    google.maps.event.trigger(map, 'resize');
  });

  $(".map-switch-button-list").click(function(){
    $("#map").css("display","none");
    $(".results-block, .paginator").css("display","block");
  });

  $(".filter-button").click(function(){
    loadMarkers(Statements.requestAdress+"-1");
  });
}


function loadMarkers(adress){
  $("#map").css("opacity","0");
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0; //array clearing, fastest method
  $.getJSON(adress)
  .done(function(data){

    for (var i = 0; i < data.results.length; i++) {
      var marker = new google.maps.Marker({
        position: {
          lat: data.results[i].lat,
          lng: data.results[i].lng
        },
        title: "hello "+i
      });
      markers.push(marker);
    }

    console.log(markers);
    console.log("markers loaded");

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  $("#map").css("opacity","1");
  })
  .fail(function(){
    console.log("markers load failed!");
    $("#map").css("opacity","1");
  });

}
