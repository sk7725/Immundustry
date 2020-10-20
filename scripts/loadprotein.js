const PixmapTextureData1 = Packages.arc.graphics.gl.PixmapTextureData;

function getColor(unit){
  var icon = Core.atlas.getPixmap(unit.icon(Cicon.full));
  var w = icon.width;
  var h = icon.height;
  var c = 0; var r = 0, g = 0, b = 0;
  var pixel = new Color();
  for(var i=0; i<w; i++){
    for(var j=0; j<h; j++){
      pixel.set(icon.getPixel(i, j));
      if(pixel.a > 0.5){
        c++;
        r += pixel.r;
        g += pixel.g;
        b += pixel.b;
      }
    }
  }
  r /= c; g /= c; b /= c;
  return new Color(r, g, b, 1);
}

function makeTextureRegion(color, name){
  var newTexture = new Pixmap(32, 32);
  var pixel = new Color(), x, y;
  for(x = 0; x < 32; x++){
    for(y = 0; y < 32; y++){
      pixel.set(mask.getPixel(x, y));
      if(pixel.a > 0){
        pixel.mul(color);
        pixel.a *= color.a;
        newTexture.draw(x, y, pixel);
      }
    }
  }
  const texture = new Texture(new PixmapTextureData1(newTexture, null, true, false, true));
  return Core.atlas.addRegion(name, new TextureRegion(texture));
}

function newProtein(unit){
  var clr = getColor(unit);
  print("["+clr.toString()+"]"+"Color[]");
  var itemIcon = makeTextureRegion(clr, "marker-"+unit.name);
  print("Item Icon: "+itemIcon);
  var item = extendContent(Item, "marker-"+unit.name, {
    color: clr,
    icon(cicon){
      return itemIcon;
    }
  });
  print("Item: "+item.name+" "+item.id);
  return item;
}

this.global.proteins = [];

//print("Events: "+Object.keys(ContentType));

var mask = Core.atlas.getPixmap("immune-marker-base");

Events.on(EventType.ClientLoadEvent, () => {
  print("Unit Load!");
  mask = Core.atlas.getPixmap("immune-marker-base");
  var arr = Vars.content.units().toArray();
  print("Detected Units: "+arr.length);
  for(var i=0; i<arr.length; i++){
    print("Try creating unit:" +arr[i]);
    this.global.proteins[arr[i].id] = newProtein(arr[i]);
  }
});
