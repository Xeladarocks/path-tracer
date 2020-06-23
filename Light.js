class Light {
    constructor(ltype, intensity, position) {
        this.__type__ = Light.name;
		this.ltype = ltype;
		this.intensity = intensity;
		this.position = position;
	}
}
Light.__type__ = Light.name;
