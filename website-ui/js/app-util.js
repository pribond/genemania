'use strict';

app.factory('util', [ function(){
  return {
    copy: function ( obj ){
      return JSON.parse( JSON.stringify(obj) );
    },

    // make native promise / window.Promise
    nativePromise: function( p ){
      return Promise.resolve().then(function(){ // wrap in native promise
        return p;
      });
    },

    timeoutPromise: function( val, delay ){
      return new Promise(function(resolve){
        setTimeout(function(){
          resolve( val );
        }, delay);
      });
    },

    strcmp: function( str1, str2 ){
      return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
    },

    delayPromise: function( ms ){
      return new Promise(function( resolve ){
        setTimeout(function(){
          resolve();
        }, ms);
      });
    },

    isSmallScreen: function(){
      var min = 550;
      var $doc = $(document);

      return $doc.width() < min || $doc.height() < min;
    }
  };
} ]);
