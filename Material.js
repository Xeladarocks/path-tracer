class Material {
    constructor(reflectivity, diffuse, specular, emissive, opacity) {
        this.__type__ = Material.name;
        this.reflectivity = reflectivity;
        this.diffuse = diffuse;
        this.specular = specular;
        this.emissive = emissive;
        this.opacity = opacity;
    }
}
Material.__type__ = Material.name;
