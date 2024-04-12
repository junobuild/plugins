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

export interface IcpIds {
  internetIdentityId: string;
  icpLedgerId: string;
  icpIndexId: string;
}
