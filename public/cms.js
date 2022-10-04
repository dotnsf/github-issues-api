//. cms.js
$( async function(){
  var numbers = [];
  var result0 = await getIssues();
  if( result0 && result0.status && result0.issues && result0.issues.length > 0 ){
    var ul0 = '<ul>';
    for( var i = 0; i < result0.issues.length; i ++ ){
      var num = result0.issues[i].number;
      var comments = result0.issues[i].comments;
      var li0 = '<li id="li0_' + num + '"><div>' 
        + result0.issues[i].title
        + '<br/>'
        + ( result0.issues[i].body ? marked.parse( result0.issues[i].body ) : '' )  //. 要マークダウンデコード
        + '</div></li>';
      ul0 += li0;

      if( comments > 0 ){
        numbers.push( num );
      }
    }
    ul0 += '</ul>';
    $('#cms_main').html( ul0 );
    //console.log( {ul0} );
  }

  for( var i = 0; i < numbers.length; i ++ ){
    var result1 = await getComments( numbers[i] );
    if( result1 && result1.status && result1.comments && result1.comments.length > 0 ){
      var ul1 = '<ul>';
      for( var j = 0; j < result1.comments.length; j ++ ){
        var li1 = '<li id="li1_' + numbers[i] + '_' + j + '"><div>' 
          + ( result1.comments[j].body ? marked.parse( result1.comments[j].body ) : '' )  //. 要マークダウンデコード
          + '</div></li>';
        ul1 += li1;
      }
      ul1 += '</ul>';
      //console.log( numbers[i], {ul1} );
      $('#li0_' + numbers[i]).append( ul1 );
    }
  }
});

async function getIssues(){
  return new Promise( async function( resolve, reject ){
    $.ajax({
      type: 'GET',
      url: API_SERVER + '/api/github/issues/' + GITHUB_REPO + '?token=' + TOKEN,
      success: function( result ){
        //console.log( result );
        showRateLimitReset( result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        reject( e0 );
      }
    });
  });
}

async function getComments( issue_num ){
  return new Promise( async function( resolve, reject ){
    $.ajax({
      type: 'GET',
      url: API_SERVER + '/api/github/comments/' + GITHUB_REPO + '?token=' + TOKEN + '&issue_num=' + issue_num,
      success: function( result ){
        //console.log( result );
        showRateLimitReset( result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        reject( e0 );
      }
    });
  });
}

function showRateLimitReset( result ){
  if( result && result.headers && result.headers['x-ratelimit-reset'] ){
    var remain = result.headers['x-ratelimit-remaining'];
    var limit = result.headers['x-ratelimit-limit'];
    var remaining = remain + '/' + limit;
    
    var reset = result.headers['x-ratelimit-reset'];
    if( typeof reset == 'string' ){ reset = parseInt( reset ); }
    reset *= 1000;
    var t = new Date( reset );

    var y = t.getFullYear();
    var m = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var n = t.getMinutes();
    var s = t.getSeconds();

    var ymdhns = y
      + '-' + ( m < 10 ? '0' : '' ) + m
      + '-' + ( d < 10 ? '0' : '' ) + d
      + ' ' + ( h < 10 ? '0' : '' ) + h
      + ':' + ( n < 10 ? '0' : '' ) + n
      + ':' + ( s < 10 ? '0' : '' ) + s;

    $('#ratelimit-remaining').html( remaining );
    $('#ratelimit-reset').html( ymdhns );
  }
}

function myLogin(){
  location.href = '/login';
}

function myLogout(){
  if( confirm( "ログアウトしますか？" ) ){
    location.href = '/logout';
  }
}

