var core = null;
var filled = false;
var req = [];//list of itemstacks
var lastwave = 0;
var reqstr = "";

function getStack(name, n){
  return new ItemStack(Vars.content.getByName(ContentType.item, "immune-" + name), n)
}

function calculateNeeds(wave){
  //TODO
  var ret = [getStack("glucose", wave*(Mathf.randomSeed(wave+628)+0.5)*4+15)];
  if(wave > 15) ret.push(getStack("amino-acid", wave*(Mathf.randomSeed(wave+69)+0.5)*5+0));
  if(wave > 5) ret.push(getStack("fatty-acid", wave*(Mathf.randomSeed(wave+47)+0.5)*3+15));
  if(wave > 30) ret.push(getStack("carbohydrate", (wave-30)*(Mathf.randomSeed(wave+11)+0.5)*6+10));
  if(wave > 30) ret.push(getStack("protein", (wave-30)*(Mathf.randomSeed(wave+628628)+0.5)*5+0));
  if(wave > 40) ret.push(getStack("fat", (wave-40)*(Mathf.randomSeed(wave+628628)+0.5)*2+40));
  if(wave > 50) ret.push(getStack("minerals", (wave-50)*(Mathf.randomSeed(wave+628628)+0.5)*2+8));
  if(wave > 70) ret.push(getStack("nucleotide", (wave-70)*(Mathf.randomSeed(wave+62)+0.5)*1+0));
  return ret;
}

function formatReq(list){
  var str = Core.bundle.get("ui.dailyneed") + ": ";
  for(var i=0; i<list.length; i++){
    str = str + "[#" + list[i].item.color.toString() + "]" + list[i].amount + "[]";
    if(i < list.length - 1) str += ", ";
  }
  return str;
}

Events.run(Trigger.update, () => {
  if(Vars.state.is(GameState.State.playing)){
    core = Vars.state.teams.get((Vars.net.active())?Vars.player.getTeam():Team.all[1]);
    if(core == null) return;
    if(core.cores.size <= 0){
      core = null;
      return;
    }
    core = core.cores.first();
    if(!core.isValid()) core = null;
    else if(core != null && core.isValid()){
      if(lastwave != Vars.state.wave){
        req = calculateNeeds(Vars.state.wave);
        lastwave = Vars.state.wave;
        reqstr = formatReq(req);
      }
      filled = true;
      for(var i=0; i<req.length; i++){
        if(core.items.get(req[i].item) < req[i].amount){
          filled = false;
          break;
        }
      }
    }
  }
  else if(Vars.state.is(GameState.State.menu)) core = null;
});

Events.run(Trigger.draw, () => {
  if(core != null){
    Draw.z(Layer.endPixeled);
    core.block.drawPlaceText(reqstr, core.tile.x, core.tile.y, filled);
  }
});

Events.on(EventType.WaveEvent, () => {
  if(core == null) return;
  var sub = calculateNeeds(Vars.state.wave - 1);
  for(var i=0;i<sub.length;i++){
    if(core.items.get(sub[i].item) < sub[i].amount) core.damage(Mathf.pow((sub[i].amount - core.items.get(sub[i].item))*0.5, 1.25));
  }
  core.items.remove(sub);
});
