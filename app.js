//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


function callLeboncoin() {
    var url = 'https://www.leboncoin.fr/ventes_immobilieres/1084457186.htm?ca=12_s'
    var returnable=0;
    request( url, function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {

            var $ = cheerio.load( html )
            var lbcDataArray = $( 'section.properties span.value' )

            var lbcData = {
                price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),
                city: $( lbcDataArray.get( 1 ) ).text().trim().toLowerCase().replace( /\_|\s/g, '-' ),
                type: $( lbcDataArray.get( 2 ) ).text().trim().toLowerCase(),
                surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )
    
        }

            console.log( lbcData )
           // console.log( lbcData['price'])
            returnable=lbcData['price']/lbcData['surface']
            // console.log(returnable)
        }
        else {
            console.log( error )
        }
        //console.log(returnable)
        return returnable;
    })

}

//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
function callLemeilleuragent()
 {
    var url = 'https://www.meilleursagents.com/prix-immobilier/poissy-78300/'
    request( url, function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {

            var $ = cheerio.load( html )
           var MaDataArray = $( 'section.section div.prices-summary__cell--median')
           //console.log(MaDataArray);
            var MaData = {
                price: parseInt( $( MaDataArray.get( 1) ).text().replace( /\s/g, '' ), 10 ),
            }

            console.log( MaData )
        }
        else {
           console.log( error )
        }
        console.log(MaData['price'])
return MaData['price'];
    })

}

function Compare()
{
var var1=callLeboncoin();
var var2=callLemeilleuragent();
var var3="";
if(var1>var2)
{
var3=" le prix est trop élever par rapport au prix du marché";
}
else
{
var3="tu as fais une bonne affaire !!";
}
console.log(var3)
}

app.get( '/', function ( req, res ) {
    var url = req.query.urlLBC
    //callLeboncoin();
    //callLemeilleuragent();
    Compare();
    

    res.render( 'home', {
        message: url
    });
});

app.get( '/call', function ( req, res ) {
    var url = req.query.urlLBC
    res.render( 'home', { message: url });

});
//getbootstrap.com/geting-started

//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});
