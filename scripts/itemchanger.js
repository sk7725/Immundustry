var tempModName = "";

function setMod(name){
  tempModName = name;
}

function getItem(name){
  var item = Vars.content.getByName(ContentType.item, name);
  if(item != null) return item;
  return Vars.content.getByName(ContentType.item, tempModName+"-"+name);
}

function createItem(from, name, color){
  var item = extendContent(Item, name, {});
  print("Add Item ID: "+item.id);
  try{
    item.color = color;
  }
  catch(versionTooLowIHope){
    print(versionTooLowIHope);
  }
  item.explosiveness = from.explosiveness;
  item.flammability = from.flammability;
  item.radioactivity = from.radioactivity;
  item.hardness = from.hardness;
  item.cost = from.cost;
  return item;
}

function replaceCosts(from, to){
  var arr = Vars.content.blocks().toArray();
  for(var i=0; i<arr.length; i++){
    var res = arr[i].requirements;
    for(var j=0; j<res.length; j++){
      if(res[j].item == from){
        arr[i].requirements[j].item = to;
        break;
      }
    }
  }
}

function replaceOres(from, to){
  var arr = Vars.content.blocks().toArray();
  for(var i=0; i<arr.length; i++){
    if((arr[i] instanceof OreBlock) && arr[i].itemDrop == from){
      arr[i].itemDrop = to;
    }
  }
}

function replace(from, to, color){
  color = Color.valueOf(color);
  from = getItem(from); to = createItem(from, to, color);
  replaceCosts(from, to);
  replaceOres(from, to);
}


setMod("immune");
replace("copper", "glucose", "B159FF");
replace("sand", "atp", "FFAF1C");
replace("coal", "amino-acid", "F49561");
replace("metaglass", "fat", "FFF387");
replace("silicon", "protein", "F65A00");
replace("lead", "fatty-acid", "FFF9CC");
replace("surge-alloy", "dna", "B7F48D");
replace("titanium", "phosphorus", "61F400");
replace("thorium", "minerals", "FF9BC6");
replace("plastanium", "nucleotide", "A0FFC3");
