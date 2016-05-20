var citiesArray = [
  'Assen',
  'Coevorden',
  'Emmen',
  'Hoogeveen',
  'Meppel',
  'Almere',
  'Lelystad',
  'Emmeloord',
  'Biddinghuizen',
  'Bolsward',
  'Dokkum',
  'Drachten',
  'Franeker',
  'Harlingen',
  'Heerenveen',
  'Hindeloopen',
  'IJlst',
  'Leeuwarden',
  'Sloten',
  'Sneek',
  'Stavoren',
  'Workum',
  'Apeldoorn',
  'Arnhem',
  'Bredevoort',
  'Buren',
  'Culemborg',
  'Deil',
  'Dieren',
  'Doetinchem',
  'Ede',
  'Enspijk',
  'Gendt',
  'Groenlo',
  'Harderwijk',
  'Hattem',
  'Heukelum',
  'Huissen',
  'Nijkerk',
  'Nijmegen',
  'Tiel',
  'Wageningen',
  'Wijchen',
  'Winterswijk',
  'Zaltbommel',
  'Zevenaar',
  'Zutphen',
  'Appingedam',
  'Delfzijl',
  'Groningen',
  'Hoogezand-Sappemeer',
  'Stadskanaal',
  'Winschoten',
  'Veendam',
  'Geleen',
  'Gennep',
  'Heerlen',
  'Kerkrade',
  'Kessel',
  'Landgraaf',
  'Maastricht',
  'Montfort',
  'Nieuwstadt',
  'Roermond',
  'Sittard',
  'Schin op Geul',
  'Stein',
  'Thorn',
  'Valkenburg',
  'Venlo',
  'Weert',
  'Bergen op Zoom',
  'Breda',
  's-Hertogenbosch',
  'Eindhoven',
  'Geertruidenberg',
  'Grave',
  'Helmond',
  'Heusden',
  'Klundert',
  'Oosterhout',
  'Oss',
  'Ravenstein',
  'Roosendaal',
  'Sint-Oedenrode',
  'Tilburg',
  'Valkenswaard',
  'Veldhoven',
  'Waalwijk',
  'Willemstad',
  'Woudrichem',
  'Alkmaar',
  'Amstelveen',
  'Amsterdam',
  'Den Helder',
  'Edam, Volendam',
  'Enkhuizen',
  'Haarlem',
  'Heerhugowaard',
  'Hilversum',
  'Hoofddorp',
  'Hoorn',
  'Laren',
  'Purmerend',
  'Medemblik',
  'Monnickendam',
  'Muiden',
  'Naarden',
  'Schagen',
  'Velsen',
  'Weesp',
  'Zaanstad',
  'Almelo',
  'Blokzijl',
  'Deventer',
  'Enschede',
  'Genemuiden',
  'Hasselt',
  'Hengelo',
  'Kampen',
  'Oldenzaal',
  'Steenwijk',
  'Vollenhove',
  'Zwolle',
  'Alphen aan den Rijn',
  'Delft',
  'Dordrecht',
  'Gorinchem',
  'Gouda',
  'Leiden',
  'Rotterdam',
  'Spijkenisse',
  'The Hague',
  'Amersfoort',
  'Nieuwegein',
  'Utrecht',
  'Veenendaal',
  'Arnemuiden',
  'Goes',
  'Hulst',
  'Middelburg',
  'Sluis',
  'Terneuzen',
  'Veere',
  'Vlissingen',
  'Zierikzee'
];
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
