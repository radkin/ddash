// Hosts the API and serves up the client using Express
var port = process.env.PORT || 9000;
var express = require( 'express' );
var request = require( 'request' );
var cors = require( 'cors' );
var passport = require( 'passport' );
var bodyParser = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );
const session = require( 'express-session' );
var RedisStore = require('connect-redis')(session);
var ActiveDirectory = require( 'activedirectory' );
var LocalStrategy = require( 'passport-local' );
var groupName = 'devops';
var ad = {};

var userSearch = process.env.LDAP_USER_SEARCH;
var managerPasswordSecret = process.env.LDAP_MANAGER_PASSWORD_SECRET;
var managerDN = process.env.LDAP_MANAGER_DN;
var rootDN = process.env.LDAP_ROOTDN;
var server = process.env.LDAP_SERVER;

// Setting up API routes
var cistatusRouter = express.Router();
var buildfinderRouter = express.Router();
var detailsRouter = express.Router();
var landingRouter = express.Router();

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

passport.use( new LocalStrategy(
    function ( username, password, done ) {
        config = {
            url: 'ldap://' + server + ':3268',
            baseDN: rootDN,
            dn: managerDN,
            userSearch: userSearch,
            managerPasswordSecret: managerPasswordSecret,
            username: username,
            password: password,
        };
        ad = new ActiveDirectory( config );
        ad.authenticate( username, password, function ( err, isAuthenticated ) {
            if ( err ) return done( err, null );
            if ( isAuthenticated ) {
                console.log( 'Authenticated ' + username );
                return done( null, {
                    username: username
                } );
            } else {
                return done( null, false );
            }
        } );
    }
) );

// redis store options
options = {
  host: '127.0.0.1',
  port: 6379
}

var app = express();
app.use( cookieParser() );
app.use( session( {
    store: new RedisStore(options),
    secret: 'ddash',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
} ) );
app.use( passport.initialize() );
app.use( passport.session() );

// Using cors for cross origin requests
app.use( cors() );

// Serves up client (index.html)
app.use( express.static( __dirname ) );

// router apps
app.use( '/api/cistatus', cistatusRouter );
app.use( '/api/buildfinder', buildfinderRouter );
app.use( '/api/details', detailsRouter );
app.use( '/api/landing', landingRouter );

// router requirements
require( './api/router' )
    .cistatus( cistatusRouter );
require( './api/router' )
    .buildfinder( buildfinderRouter );
require( './api/router' )
    .details( detailsRouter );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    extended: true
} ) );

// passport session information
const passportInfo = require('session-passport-info');
app.use(passportInfo());

// auth process
app.post( '/login', passport.authenticate( 'local', {
    session:true,
    successRedirect: '/feedback',
    failureRedirect: '/login'
} ), function ( req, res ) {
    username = req.query.username;
    password = req.query.password;

    ad.isUserMemberOf( username, groupName, function ( err, isMember ) {
        if ( err ) {
            console.log( 'ERROR: ' + JSON.stringify( err ) );
            return;
        } else {
            console.log( username + ' isMemberOf ' + groupName + ': ' + isMember );
        }
    } );

} );

app.get( '/logout', function(req, res) {
  if (req.isAuthenticated()) {
    req.session.destroy();
    res.redirect('/');
  } else {
    res.render('login', { user: req.user });
  }
} );

app.listen( port, function () {
    console.log( 'Listening on', port );
} );
