export type OrganizationType = {
  name: string;
  id: string;
};
export type OrgMaterialType = {
  id: string;
  name: string;
  hexCode?: string;
  baseMap?: string;
};
export type OrgMaterialGroupsType = {
  id: string;
  name: string;
  price?: number;
  roughness?: number;
  roughnessMap?: string;
  metalness?: number;
  metalnessMap?: string;
  normalMap?: string;
  reflectivity?: number;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
  emissiveMap?: string;
  emissiveMapIntensity?: number;
  tiling?: { x: number; y: number };
  doubleSide?: boolean;
  materials: OrgMaterialType[];
};
export type OrgSceneType = {
  id: string;
  name: string;
  previewImage?:string;
  config: string;
};
