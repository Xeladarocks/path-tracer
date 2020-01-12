class Light {
    static __type__ = this.name;
    constructor(ltype, intensity, position) {
        this.__type__ = Light.__type__;
		this.ltype = ltype;
		this.intensity = intensity;
		this.position = position;
	}
}