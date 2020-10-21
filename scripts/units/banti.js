const proteins = this.global.proteins;

const addMapping = provider => {
  var i = 0;
	for(i = 0; i < EntityMapping.idMap.length; i++){
		if(EntityMapping.idMap[i] == undefined){
			//print("EntityMapping: (" + i + "): " + provider);
			EntityMapping.idMap[i] = provider;
			break;
		}
	}
  return EntityMapping.idMap.indexOf(provider);
};

const antibody = extend(BasicBulletType, {
	init(b){
		if(typeof(b) !== "undefined" && b.data == null){
      if(b.owner != null && b.owner.getAntibody){
        b.data = b.owner.getAntibody();
      }
			else b.data = {
        color: Pal.lancerLaser,
        unit: UnitTypes.dagger
      };
		}
	},

	draw(b){
		this.frontColor = b.data.color;
    this.backColor = b.data.color.cpy().mul(0.7);//replace later
		this.super$draw(b);
	}/*

	update(b){
		this.super$update(b);
	},

	hit(b, x, y){
		this.super$hit(b, b.x, b.y);
	}*/
});
antibody.sprite = "immune-b-antibody"
antibody.frontColor = Pal.lancerLaser;
antibody.backColor = Pal.lancerLaser.cpy().mul(0.7);
antibody.width = 6;
antibody.height = 9;
antibody.homingPower = 1;
antibody.speed = 3.8;
antibody.lifetime = 260;
antibody.damage = 10;
antibody.shootEffect = Fx.absorb;

const antiWeap = new Weapon();
antiWeap.reload = 9;
antiWeap.rotate = true;
antiWeap.x = 2;
antiWeap.y = -0.25;
antiWeap.shots = 3;
antiWeap.spacing = 0;
antiWeap.inaccuracy = 3;
antiWeap.velocityRnd = 0.05;
antiWeap.shotDelay = 0;
antiWeap.shootSound = Sounds.pew;
antiWeap.bullet = antibody;

const banti = extendContent(UnitType, "banti", {
  load(){
    this.super$load();
    this.indicateRegion = Core.atlas.find(this.name + "-top");
  },
  drawBody(unit){
		this.super$drawBody(unit);
		Draw.color(unit.getAntiColor());
    Draw.rect(this.indicateRegion, unit.x, unit.y, unit.rotation - 90);//i need to fix this later
    Draw.color();
	},

  setTypeID(id){
		this.idType = id;
	},
	getTypeID(){
		return this.idType;
	}
});
banti.weapons.add(antiWeap);
banti.constructor = () => extend(MechUnit, {
  _unit: UnitTypes.dagger,
  _color: Pal.lancerLaser,
  _bcolor: Pal.lancerLaser,
  _wave: 5,
  setAntibody(type){
    this._color = proteins[type.id].color;
    this._bcolor = proteins[type.id].color.cpy().shiftSaturation(0.5 - proteins[type.id].color.saturation());
    this._bcolor = this._bcolor.shiftValue(1 - this._bcolor.value());
    this._unit = type;
  },
  getAntibody(){
    return {
      color: this._bcolor,
      unit: this._type
    };
  },
  getAntiColor(){
    return this._color;
  },

  update(){
    this.super$update();
    if(this._wave < Vars.state.wave) this.kill();
  },
  add(){
    this._wave = Vars.state.wave + Mathf.floorPositive(Mathf.random()*5) + 7;
    this.super$add();

    //testing purposes only
    var arr = Object.keys(UnitTypes);
    var type = UnitTypes[arr[Mathf.floorPositive(Mathf.random()*0.999*arr.length)]];
    print("Set: "+type.name);
    this.setAntibody(type);
  },
  classId(){
    return this.type.getTypeID();
  },

  write(writes){
    this.super$write(writes);

    writes.i(this._wave);
    writes.i(this._unit.id);
  },
  read(reads){
    this.super$read(reads);

    this._wave = reads.i();
    this.setAntibody(Vars.content.getByID(ContentType.unit, reads.i()));
  }
});

const bantiID = addMapping(banti.constructor);
print(bantiID);
banti.idType = bantiID;
banti.setTypeID(bantiID);
