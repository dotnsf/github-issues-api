//. github.js

const { Router } = require('express');

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    request = require( 'request' ),
    api = express();

require( 'dotenv' ).config();

var settings_cors = 'CORS' in process.env ? process.env.CORS : '';
api.all( '/*', function( req, res, next ){
  if( settings_cors ){
    res.setHeader( 'Access-Control-Allow-Origin', settings_cors );
    res.setHeader( 'Vary', 'Origin' );
  }
  next();
});

api.use( bodyParser.urlencoded( { extended: true } ) );
api.use( bodyParser.json() );
api.use( express.Router() );

//. Issues
api.getIssues = async function( user, repo, params_obj, token ){
  return new Promise( async function( resolve, reject ){
    var url = 'https://api.github.com/repos/' + user + '/' + repo + '/issues';
    if( params_obj && typeof params_obj == 'object' ){
      var params = [];
      Object.keys( params_obj ).forEach( function( key ){
        var value = params_obj[key];
        params.push( key + '=' + value );
      });
      if( params.length > 0 ){
        url += ( '?' + params.join( '&' ) );
      }
    }

    var options = {
      url: url,
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'github-issues-api' }
    };
    if( token ){
      options.headers.Authorization = 'token ' + token;
    }
    request( options, ( err, res, body ) => {
      if( err ){
        console.log( { err } );
        resolve( { status: false, error: err } );
      }else{
        if( typeof body == 'string' ){
          body = JSON.parse( body );
        }
        //console.log( { body } );
        resolve( { status: true, params: params_obj, issues: body } );
      }
    });
  });
};

//. Comments
api.getComments = async function( user, repo, issue_num, params_obj, token ){
  return new Promise( async function( resolve, reject ){
    var url = issue_num ? 
      'https://api.github.com/repos/' + user + '/' + repo + '/issues/' + issue_num + '/comments' :
      'https://api.github.com/repos/' + user + '/' + repo + '/issues/comments';

    if( params_obj && typeof params_obj == 'object' ){
      var params = [];
      Object.keys( params_obj ).forEach( function( key ){
        var value = params_obj[key];
        params.push( key + '=' + value );
      });
      if( params.length > 0 ){
        url += ( '?' + params.join( '&' ) );
      }
    }

    var options = {
      url: url,
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'github-issues-api' }
    };
    if( token ){
      options.headers.Authorization = 'token ' + token;
    }
    request( options, ( err, res, body ) => {
      if( err ){
        console.log( { err } );
        resolve( { status: false, error: err } );
      }else{
        if( typeof body == 'string' ){
          body = JSON.parse( body );
        }
        //console.log( { body } );
        resolve( { status: true, params: params_obj, comments: body } );
      }
    });
  });
};


api.get( '/issues/:user/:repo', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var user = req.params.user;
  var repo = req.params.repo;
  if( user && repo ){
    var token = req.query.token;

    //. #2
    var params_obj = {};
    Object.keys( req.query ).forEach( function( key ){
      if( [ 'filter', 'state', 'labels' ].indexOf( key ) > -1 ){
        params_obj[key] = req.query[key];
      }
    });

    api.getIssues( user, repo, params_obj, token ).then( function( result ){
      res.status( result.status ? 200 : 400 );
      res.write( JSON.stringify( result, null, 2 ) );
      res.end();
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'parameter user & repo are mandatory.' }, null, 2 ) );
    res.end();
  }
});

api.get( '/comments/:user/:repo', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var user = req.params.user;
  var repo = req.params.repo;
  if( user && repo ){
    var issue_num = req.query.issue_num;
    var token = req.query.token;
    api.getComments( user, repo, issue_num, null, token ).then( function( result ){
      res.status( result.status ? 200 : 400 );
      res.write( JSON.stringify( result, null, 2 ) );
      res.end();
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'parameter user & repo are mandatory.' }, null, 2 ) );
    res.end();
  }
});


//. api をエクスポート
module.exports = api;
