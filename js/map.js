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
    loadMarkers(Statements.requestAdress+"-1"+"&short_data=1");
  });
}


function loadMarkers(adress){
  $("#map").css("display","none");
  $("#map-preloader").css("display", "block");
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0; //array clearing, fastest method
  $.getJSON(adress)
  .done(function(data){

    for (var i = 0; i < data.results.length; i++) {

      var markerImage;
      if(data.results[i].price_diff <= 0){
        markerImage = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      }else{
        markerImage = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      }

      var predictedPriceOnInformWindow;
      if (data.results[i].price_diff <= 0) {
        predictedPriceOnInformWindow = '<div style="color:green;"><i class="mdi mdi-arrow-down-bold"></i> '+(data.results[i].price_diff)*(-1)+'</div>';
      }else{
        predictedPriceOnInformWindow = '<div style="color:red;"><i class="mdi mdi-arrow-up-bold"></i> '+data.results[i].price_diff+'</div>';
      }

      var marker = new google.maps.Marker({
        position: {
          lat: data.results[i].lat,
          lng: data.results[i].lng
        },
        title: capitalizeFirstLetter(data.results[i].district),
        icon: new google.maps.MarkerImage(markerImage),
        info: new google.maps.InfoWindow({content: '<img src="'+data.results[i].preview_url+'" width="180px">'+
        '<b><div><a href="'+data.results[i].url+' target="_blank"">'+capitalizeFirstLetter(data.results[i].district)+' '+data.results[i].post_code+'</a></div>'+
        '<div>Price: '+data.results[i].actual_price+'</div>'+
        predictedPriceOnInformWindow +
        '</b>'
      })
    });


    google.maps.event.addListener(marker, 'click', function() {
      marker.info.setContent(this.info.content);
      marker.info.open(map, this);
    });






    /*inform window*/
    // var contentString = '<img src="http://cloud.funda.nl/valentina_media/066/132/818_360x240.jpg" width="180px">'+
    // '<b><div><a href="http://www.funda.nl/koop/de-kwakel/huis-49897238-seringenlaan-5/">De kwakel 1424CK</a></div>'+
    // '<div>Price: 232500</div>'+
    // '<div style="color:green;"><i class="mdi mdi-arrow-down-bold"></i> 97626</div>'+
    // '</b>';
    //
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    //
    // marker.addListener('click', function() {
    //   infowindow.open(map, marker);
    // });





    /*inform window*/
    markers.push(marker);
    AutoCenter();
  }

  console.log(markers);
  console.log("markers loaded");

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  $("#map").css("display","block");
  $("#map-preloader").css("display", "none");
  google.maps.event.trigger(map, 'resize');


})
.fail(function(){
  console.log("markers load failed!");

});

}


function AutoCenter() {
//  Create a new viewpoint bound
var bounds = new google.maps.LatLngBounds();
//  Go through each...
$.each(markers, function (index, marker) {
bounds.extend(marker.position);
});
//  Fit these bounds to the map
map.fitBounds(bounds);
map.setZoom(10);
}
