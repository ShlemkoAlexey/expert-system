/*
google map api key - AIzaSyBklFTAeUj8Nal2yTbVsfqG3hGOrMPEkDc
*/
var map;
var heatmap = {
  mapFast: "",
  dataFast: [],
  mapMed: "",
  dataMed: [],
  mapLong: "",
  dataLong: []
};
var markers = [];
var citiesArray = [];
var activeInfoWindow;
var requestAdress = {
  "cityFilter": "",
  "cityMode": "",
  "typeFilter": "",
  "districtModel": "",
  "predictionType": "",
  "minPrice": "",
  "maxPrice": "",
  "minArea": "",
  "maxArea": "",
  "shortData": "&short_data=1",
  "minLat": "",
  "maxLat": "",
  "minLng": "",
  "maxLng": "",
  "setAreaAndPrice": function(){
    //set price filters
    this.minPrice = "&price_start="+$(".price-slider").slider("values", 0);
    this.maxPrice = "&price_end="+$(".price-slider").slider("values", 1);
    //set area filters
    this.minArea = "&min_area="+$(".area-slider").slider("values", 0);
    this.maxArea = "&max_area="+$(".area-slider").slider("values", 1);
  },
  "setMapBounds": function(object){
    this.minLat = "&min_lat="+object.f.f;
    this.maxLat = "&max_lat="+object.f.b;
    this.minLng = "&min_lng="+object.b.b;
    this.maxLng = "&max_lng="+object.b.f;
  },
  "set": function(){
    //set filter by cities and include/exclude setting
    if ($('.filtered-cities-list li').length > 0){
      this.cityFilter = "&city_filter="+getCityListFromUL();
      if ($("input:radio[name ='inc-exc-radio']:checked").val() == "include") {
        this.cityMode = "&city_mode=1";
      }else{
        this.cityMode = "&city_mode=0";
      }
    }else{
      this.cityFilter = "&city_filter=muhosransk";
      this.cityMode = "&city_mode=0";
    }
    //set house type option
    if ($(".house-type-select").val() == "House") {
      this.typeFilter = "&type_filter=1";
    }else if ($(".house-type-select").val() == "Apartment") {
      this.typeFilter = "&type_filter=0";
    }else{
      this.typeFilter = "";
    }
    //set prediction type oprion
    if ($('.prediction-type-select').val() == "District model") {
      this.predictionType = "&district_model=1";
    }else if($('.prediction-type-select').val() == "Global model"){
      this.predictionType = "&district_model=0";
    }


  },
  "get": function(){
    return "http://178.62.229.113/filter?"+this.cityFilter+this.cityMode+this.typeFilter+this.districtModel+this.predictionType+this.minArea+this.maxArea+this.minPrice+this.maxPrice+this.minLat+this.maxLat+this.minLng+this.maxLng+this.shortData;
  }
}

$(document).ready(function(){
  loadCityList();
  createSliders();
  loadMarkers(requestAdress.get());
  requestAdress.set();
  console.log(requestAdress.get());

});

$(".filter-button").click(function(){
  requestAdress.set();
  requestAdress.setAreaAndPrice();
  loadMarkers(requestAdress.get());
  console.log(requestAdress.get());
});


function initMap() {
  var myLatLng = {lat: 52.238, lng: 5.000};

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 9
  });
  activeInfoWindow = new google.maps.InfoWindow;
//   HEAT MAP
//   map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('legend'));
}


function loadMarkers(adress){
  console.log(adress);
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0; //array clearing, fastest method
  heatmap.dataFast.length = 0;
  heatmap.dataMed.length = 0;
  heatmap.dataLong .length = 0;
  $.getJSON(adress)
  .done(function(data){
    for (var i = 0; i< data.results.length&&i<100; i++) {
      var markerImage;
      if(data.results[i].price_diff <= 0){
        markerImage = "src/house-green.png";
      }else{
        markerImage = "src/house-red.png";
      }
      var predictedPriceOnInformWindow;
      if (data.results[i].price_diff <= 0) {
        predictedPriceOnInformWindow = '<div style="color:green;"><i class="mdi mdi-arrow-down-bold"></i> '+numeral((data.results[i].price_diff)*(-1)).format('0,0')+' €</div>';
      }else{
        predictedPriceOnInformWindow = '<div style="color:red;"><i class="mdi mdi-arrow-up-bold"></i> '+numeral(data.results[i].price_diff).format('0,0')+' €</div>';
      }
      var marker = new google.maps.Marker({
        position: {
          lat: data.results[i].lat,
          lng: data.results[i].lng
        },
        title: capitalizeFirstLetter(data.results[i].district),
        icon: new google.maps.MarkerImage(markerImage),
        info: new google.maps.InfoWindow({content: '<img src="'+data.results[i].preview_url+'" width="180px">'+
        '<b><div><a href="'+data.results[i].url+'" target="_blank">'+capitalizeFirstLetter(data.results[i].district)+' '+data.results[i].post_code+'</a></div>'+
        '<div>Price: '+numeral(data.results[i].actual_price).format('0,0')+' €</div>'+
        predictedPriceOnInformWindow +
        '</b>'
      })
    });
    google.maps.event.addListener(marker, 'click', function() {
      //marker.info.setContent(this.info.content);
      //marker.info.open();
      activeInfoWindow.close();
      activeInfoWindow = this.info;
      this.info.open(map, this);
      console.log("marker event!!!");
    });
    markers.push(marker);
    //   HEAT MAP
    /*create data for heatmaps*/
    // if (data.results[i].com_time <=40) {
    //   heatmap.dataFast.push(new google.maps.LatLng(data.results[i].lat, data.results[i].lng));
    // }else if (data.results[i].com_time <=70) {
    //   heatmap.dataMed.push(new google.maps.LatLng(data.results[i].lat, data.results[i].lng));
    // }else{
    //   heatmap.dataLong.push(new google.maps.LatLng(data.results[i].lat, data.results[i].lng));
    // }
    /*create data for heatmaps*/
  }
  console.log("markers loaded");
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  google.maps.event.clearListeners(map, 'dragend');
  map.addListener('dragend', function() {
    //console.log("dragend event!");
    requestAdress.setMapBounds(map.getBounds());
    requestAdress.set();
    requestAdress.setAreaAndPrice();
    loadMarkers(requestAdress.get());
  });
  google.maps.event.clearListeners(map, 'zoom_changed');
  map.addListener('zoom_changed', function() {
    //console.log("dragend event!");
    requestAdress.set();
    requestAdress.setAreaAndPrice();
    requestAdress.setMapBounds(map.getBounds());
    loadMarkers(requestAdress.get());
  });
  map.addListener('click', function(){
    marker.info.close(map, this);
  });
//  HEAT MAP
//  generateHeatMaps();


})
.fail(function(){
  console.log("markers load failed!");
});

}

function generateHeatMaps(){
  var mapsRadius = 40;
  var mapsMaxIntensity = 0.01;
  var mapsGreenGradient = [
    'rgba(0, 0, 0, 0)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 255, 0, 1)'
  ];
  var mapsYellowGradient = [
    'rgba(0, 0, 0, 0)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(255, 255, 0, 1)'
  ];
  var mapsRedGradient = [
    'rgba(0, 0, 0, 0)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)',
    'rgba(255, 0, 0, 1)'
  ];

  try {
    heatmap.mapFast.setMap(null);
  } catch (e) {
    console.log(e);
  }
  try {
    heatmap.mapMed.setMap(null);
  } catch (e) {
    console.log(e);
  }
  try {
    heatmap.mapLong.setMap(null);
  } catch (e) {
    console.log(e);
  }
  heatmap.mapFast = new google.maps.visualization.HeatmapLayer({
    data: heatmap.dataFast,
    dissipating: true,
    radius: mapsRadius,
    maxIntensity: mapsMaxIntensity,
    gradient: mapsGreenGradient
  });
  heatmap.mapFast.setMap(map);

  heatmap.mapMed = new google.maps.visualization.HeatmapLayer({
    data: heatmap.dataMed,
    dissipating: true,
    radius: mapsRadius,
    maxIntensity: mapsMaxIntensity,
    gradient: mapsYellowGradient
  });
  heatmap.mapMed.setMap(map);

  heatmap.mapLong = new google.maps.visualization.HeatmapLayer({
    data: heatmap.dataLong,
    dissipating: true,
    radius: mapsRadius,
    maxIntensity: mapsMaxIntensity,
    gradient: mapsRedGradient
  });
  heatmap.mapLong.setMap(map);

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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
function removeValueFromArray(array, value){
  for (var i = 0; i < array.length; i++) {
    if (value == array[i]) {
      array.splice(i, 1);
    }
  }
};

function getCityListFromUL(){
  var string = '';
  for (var i = 0; i < $('.filtered-cities-list li').length; i++) {
    string = string + ($('.filtered-cities-list li')[i].innerText||$('.filtered-cities-list li')[i].textContent) + ',';  //fix of innerText problem in firefox
  }
  return string.slice(0, -1);
}

function createSliders(){
  $('.select-table tr td label .mdi-help-circle').tooltip();
  $.getJSON('http://178.62.229.113:80/filter_limits')
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
    requestAdress.setAreaAndPrice();
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
