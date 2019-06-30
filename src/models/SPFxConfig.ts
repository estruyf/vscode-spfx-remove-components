export interface SPFxConfig {
  '$schema': string;
  version: string;
  bundles: Bundles;
  externals: Externals;
  localizedResources: LocalizedResources;
}

export interface LocalizedResources {
  [name: string]: string;
}

export interface Externals {
}

export interface Bundles {
  [name: string]: BundleComponents;
}

export interface BundleComponents {
  components: Component[];
}

export interface Component {
  entrypoint: string;
  manifest: string;
}