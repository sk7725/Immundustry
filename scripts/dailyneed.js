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
  return [getStack("glucose", 20), getStack("amino-acid", 20), getStack("fatty-acid", 10)];
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
    if(core != null) core = core.cores.first();
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
