(function() {
  var canvas = document.getElementById('mycanvas');
  window.onload = function(){
    if ( checkFileApi() && checkCanvas(canvas) ){
      //ファイル選択
      var file_image = document.getElementById('file-image');
      file_image.addEventListener('change', selectReadfile, false);
    }
  }

  //canvas に対応しているか
  function checkCanvas(canvas){
    if (canvas && canvas.getContext){
      return true;
    }
    alert('Not Supported Canvas.');
    return false;
  }

  // FileAPIに対応しているか
  function checkFileApi() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    }
    alert('The File APIs are not fully  in this browser.');
    return false;
  }

  //端末がモバイルか
  var _ua = (function(u){
    var mobile = {
              0: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
              || u.indexOf("iphone") != -1
              || u.indexOf("ipod") != -1
              || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
              || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
              || u.indexOf("blackberry") != -1,
              iPhone: (u.indexOf("iphone") != -1),
              Android: (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
    };
    var tablet = (u.indexOf("windows") != -1 && u.indexOf("touch") != -1)
              || u.indexOf("ipad") != -1
              || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
              || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
              || u.indexOf("kindle") != -1
              || u.indexOf("silk") != -1
              || u.indexOf("playbook") != -1;
    var pc = !mobile[0] && !tablet;
    return {
      Mobile: mobile,
      Tablet: tablet,
      PC: pc
    };
  })(window.navigator.userAgent.toLowerCase());

  //ファイルが選択されたら読み込む
  function selectReadfile(e) {
    var file = e.target.files;
    var reader = new FileReader();
    //dataURL形式でファイルを読み込む
    reader.readAsDataURL(file[0]);
    //ファイルの読込が終了した時の処理
    reader.onload = function(){
      readDrawImg(reader, canvas, 0, 0);
    }
  }

  function readDrawImg(reader, canvas, x, y){
    var img = readImg(reader);
    img.onload = function(){
      var w = img.width;
      var h = img.height;
      // モバイルであればリサイズ
      if(_ua.Mobile[0]){
        var resize = resizeWidthHeight(1024, w, h);
        drawImgOnCav(canvas, img, x, y, resize.w, resize.h);
      }else{
        // モバイル以外では元サイズ
        drawImgOnCav(canvas, img, x, y, w, h);
      }
    }
  }

  //ファイルの読込が終了した時の処理
  function readImg(reader){
    //ファイル読み取り後の処理
    var result_dataURL = reader.result;
    var img = new Image();
    img.src = result_dataURL;
    return img;
  }

  //キャンバスにImageを表示
  function drawImgOnCav(canvas, img, x, y, w, h) {
    var ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, x, y, w, h);
  }

  // リサイズ後のwidth, heightを求める
  function resizeWidthHeight(target_length_px, w0, h0){
    //リサイズの必要がなければ元のwidth, heightを返す
    var length = Math.max(w0, h0);
    if(length <= target_length_px){
      return{
        flag: false,
        w: w0,
        h: h0
      };
    }
    //リサイズの計算
    var w1;
    var h1;
    if(w0 >= h0){
      w1 = target_length_px;
      h1 = h0 * target_length_px / w0;
    }else{
      w1 = w0 * target_length_px / h0;
      h1 = target_length_px;
    }
    return {
      flag: true,
      w: parseInt(w1),
      h: parseInt(h1)
    };
  }
})();