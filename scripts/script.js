function loadData () {
    $('#wikipedia-links').text("");
    $('#nytimes-articles').text("");

    const wikiApiUserAgent = process.env.GOOG_MAP;
    const streetviewApiKey = process.env.NYT_API;
    const nytApiKey = process.env.WIKI_CRED; 

    /* Google Maps Streeview API section */
    /* -------------------------------- */
    var street = $('#street').val();
    var city = $('#city'). val();
    var location = street + ', ' + city;

    var streetviewCall = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location
    +'&key='+ streetviewApiKey;

    $('#streetview-container').append('<img src="' + streetviewCall + '" alt="streetview photo">');
    $('#greeting').text('So you want to live at ' + street + ' in ' + city + '?');

    /* New York Times Article Search API section */
    /* ----------------------------------------- */

    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nytUrl += '?' + $.param({
      'api-key': nytApiKey,
      'q': city,
      'begin_date': "20160501",
      'sort': "newest"
    });

    $.getJSON(nytUrl, (data) => {
      $('#nytimes-header').html('<h1>New York Times Articles about ' + city + ':</h1>');

      var articles = data.response.docs;

      /* Loop through the articles returned and place relevant parts into our <li> */
      for (var i = 0; i < articles.length; i++) {
        var indivArt = articles[i];
        $('#nytimes-articles').append('<li class="article">' + '<a href="' + indivArt.web_url + '">' + indivArt.headline.main +
        '</a>' + '<p>' + indivArt.snippet + '</p>' + '</li>');
      };

    }).fail((e) => {
      $('#nytimes-header').text('Sorry, the New York Times articles could not be loaded!');
    });

    /* Wikipedia Articles API section */
    /* ------------------------------ */
    
    var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallBack';

    var requestTimeout = setTimeout(() => { 
      $('#wikipedia-links').text('Sorry, we failed to reach the wikipedia resources!');
    }, 8000);

    $.ajax({
    url: wikiApiUrl,
    dataType: 'jsonp',
    headers: { 'Api-User-Agent': wikiApiUserAgent }
  }).done(function (data) {
    var wiki = data[1];

    for (let i = 0; i < wiki.length; i++) {
      var wikiUrl = 'https://en.wikipedia.org/wiki/' + wiki[i];
      $('#wikipedia-links').append('<p>' + '<a href="' + wikiUrl + '">' + wiki[i] + '</a></p>');
    };

  clearTimeout(requestTimeout); //Clear the timeout as the server request was a success
});

$('#city-selection').addClass('hide-it');
$('#loading-text').css('display', 'inline');

setTimeout(() => {
  $('#loading-text').css('display', 'none');
  $('#main-content').removeClass('hide-it');
}, 3000);

return false; 
}

$('#submit-btn').click(loadData);
