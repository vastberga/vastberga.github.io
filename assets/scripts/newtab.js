"use strict";

function launch(url) {
  try {
    window.location.replace(__uv$config.prefix + __uv$config.encodeUrl(url))
  } catch(err) {
    alert(err)
  }  
}

