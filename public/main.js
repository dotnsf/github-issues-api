//. main.js
$(function(){
  $('#github_user').keyup( function( e ){
    showUserRepo();
  });
  $('#github_repo').keyup( function( e ){
    showUserRepo();
  });
});

function showUserRepo(){
  var user = $('#github_user').val();
  var repo = $('#github_repo').val();
  var user_repo = user + '/' + repo;
  $('#user_repo').html( user_repo );
}

function getIssues(){
  $('#debug').html( '' );
  var user = $('#github_user').val();
  var repo = $('#github_repo').val();
  if( user && repo ){
    var token = $('#github_token').val();
    $.ajax({
      type: 'GET',
      url: API_SERVER + '/api/github/issues/' + user + '/' + repo + '?token=' + token,
      success: function( result ){
        $('#debug').css( 'color', '#008' );
        $('#debug').html( JSON.stringify( result.issues, null, 2 ) );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
      }
    });
  }
}

function getComments(){
  $('#debug').html( '' );
  var user = $('#github_user').val();
  var repo = $('#github_repo').val();
  if( user && repo ){
    var issue_num = $('#github_issue_num').val();
    var token = $('#github_token').val();
    $.ajax({
      type: 'GET',
      url: API_SERVER + '/api/github/comments/' + user + '/' + repo + '?token=' + token + '&issue_num=' + issue_num,
      success: function( result ){
        $('#debug').css( 'color', '#080' );
        $('#debug').html( JSON.stringify( result.comments, null, 2 ) );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
      }
    });
  }
}

