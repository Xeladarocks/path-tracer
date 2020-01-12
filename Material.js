class Material {
    static __type__ = this.name;
    constructor(reflectivity, diffuse, specular, emissive, opacity) {
        this.__type__ = Material.__type__;
        this.reflectivity = reflectivity;
        this.diffuse = diffuse;
        this.specular = specular;
        this.emissive = emissive;
        this.opacity = opacity;
    }
}