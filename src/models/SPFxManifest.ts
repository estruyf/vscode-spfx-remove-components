export interface SPFxManifest {
  '$schema': string;
  id: string;
  alias: string;
  componentType: string;
  version: string;
  manifestVersion: number;
  requiresCustomScript: boolean;
  supportedHosts: string[];
  preconfiguredEntries: PreconfiguredEntry[];
}

export interface PreconfiguredEntry {
  groupId: string;
  group: Group;
  title: Group;
  description: Group;
  officeFabricIconFontName: string;
  properties: Properties;
}

export interface Properties {
  description: string;
}

export interface Group {
  default: string;
}