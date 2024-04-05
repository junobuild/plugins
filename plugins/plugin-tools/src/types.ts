export interface JunoContainerParams {
  url?: string;
  modes?: string[];
}

export interface JunoParams {
  container?: boolean | JunoContainerParams;
}

export interface ConfigArgs {
  params?: JunoParams;
  mode: string;
}
