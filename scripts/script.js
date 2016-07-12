function loadData() {
    /* Clear out data from a previous request before making the new request */
    $('#wikipedia-links').text("");
    $('#nytimes-articles').text("");

    /* Google Maps Streeview API section */
    /* -------------------------------- */
    var street = $('#street').val();
    var city = $('#city'). val();
    var location = street + ', ' + city;

    /* Input your API key into the following variable */
    var streetviewApiKey = ''; //Personal API key removed

    /* Adding everything together for the call to google maps streetview api */
    var streetviewCall = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location
    +'&key='+ streetviewApiKey;

    $('body').append('<img src="' + streetviewCall + '" class="bgimg" >');
    $('#greeting').text('So you want to live at ' + street + ' in ' + city + '?');

    /* New York Times Article Search API section */
    /* ----------------------------------------- */
    var nytApiKey = ''; //Personal API key removed, insert your API key here
    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nytUrl += '?' + $.param({
      'api-key': nytApiKey,
      'q': city,
      'begin_date': "20160501",
      'sort': "newest"
    });

    $.getJSON(nytUrl, function (data) {
      $('#nytimes-header').text('New York Times Articles about ' + city + ':');

      var articles = data.response.docs;

      /* Loop through the articles returned and place relevant parts into our <li> */
      for (var i = 0; i < articles.length; i++) {
        var indivArt = articles[i];
        $('#nytimes-articles').append('<li class="article">' + '<a href="' + indivArt.web_url + '">' + indivArt.headline.main +
        '</a>' + '<p>' + indivArt.snippet + '</p>' + '</li>');
      };

    }).fail(function(e) {
      $('#nytimes-header').text('Sorry, the New York Times articles could not be loaded!');
    });

    /* Wikipedia Articles API section */
    /* ------------------------------ */
    var wikiApiUserAgent = ''; //Insert your API-User-Agent information here
    var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallBack';

    var requestTimeout = setTimeout(function () { //If the request to the server takes longer than 8 seconds, display this text
      $('#wikipedia-links').text('Sorry, we failed to reach the wikipedia resources!');
    }, 8000);

    $.ajax({
    url: wikiApiUrl,
    dataType: 'jsonp',
    headers: { 'Api-User-Agent': wikiApiUserAgent }
  }).done(function (data) {
    var wiki = data[1];

    for (var i = 0; i < wiki.length; i++) {
      var wikiUrl = 'https://en.wikipedia.org/wiki/' + wiki[i];
      $('#wikipedia-links').append('<li>' + '<a href="' + wikiUrl + '">' + wiki[i] + '</a></li>');
    };

  clearTimeout(requestTimeout); //Clear the timeout as the server request was a success
});

return false; //Allows the current results to stay populated on the page
}

$('#form-container').submit(loadData);
