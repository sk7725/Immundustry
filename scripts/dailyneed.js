var core = null;
var filled = false;
var req = [];//list of itemstacks
var lastwave = 0;
var reqstr = "";

function getStack(name, n){
  return new ItemStack(Vars.content.getByName(ContentType.item, "immune-" + name), n);
}

function randAmount(wave, reach, seed, mul, inc, tolerance){
  var amount = (wave-reach)*(Mathf.randomSeed(wave+seed)+0.5)*mul+inc;
  if(amount >= core.storageCapacity * tolerance) amount = core.storageCapacity * tolerance + Mathf.randomSeed(seed + 628)*mul;
  amount = Mathf.floorPositive(amount);
  if(amount > core.storageCapacity) amount = core.storageCapacity;
  return amount;
}

function calculateNeeds(wave){
  //TODO
  var ret = [getStack("glucose", randAmount(wave, 0, 628, 4, 15, 0.5))];
  if(wave > 15) ret.push(getStack("amino-acid",randAmount(wave, 15, 69, 5, 0, 0.7)));
  if(wave > 5) ret.push(getStack("fatty-acid", randAmount(wave, 5, 47, 3, 15, 0.5)));
  if(wave > 30) ret.push(getStack("carbohydrate", randAmount(wave, 30, 11, 6, 10, 0.5)));
  if(wave > 30) ret.push(getStack("protein", randAmount(wave, 30, 628628, 5, 0, 0.45)));
  if(wave > 40) ret.push(getStack("fat", randAmount(wave, 40, 7725, 2, 40, 0.3)));
  if(wave > 50) ret.push(getStack("minerals", randAmount(wave, 50, 1, 2, 8, 0.2)));
  if(wave > 65) ret.push(getStack("vitamins", randAmount(wave, 65, 111, 1, 4, 0.25)));
  if(wave > 70) ret.push(getStack("nucleotide", randAmount(wave, 70, 62, 1, 0, 0.3)));
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
