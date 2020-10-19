getColor(unit){
  var icon = Core.atlas.getPixmap(unit.icon(Cicon.full));
  var w = mask.width;
  var h = mask.height;
  var c = 0; var r = 0, g = 0, b = 0;
  var pixel = new Color();
  for(var i=0; i<w; i++){
    for(var j=0; j<h; j++){
      pixel.set(mask.getPixel(i, j));
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

newProtein(unit){
  var clr = getColor(unit);
  var item = extendContent(Item, "marker-"+unit.name, {
    color: clr
  });
  return item;
}

this.global.proteins = [];

var arr = Vars.content.units();
for(var i=0; i<arr.length; i++){
  this.global.proteins[arr[i].id] = newProtein(arr[i]);
}
