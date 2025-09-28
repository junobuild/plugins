/**
 * Represents the parameters for a Juno container used for local development.
 * @interface JunoContainerParams
 */
export interface JunoContainerParams {
  /**
   * The URL of the container.
   * @type {string}
   * @optional
   */
  url?: string;

  /**
   * The modes in which the container should be used.
   * @type {string[]}
   * @optional
   */
  modes?: string[];
}

/**
 * Represents the parameters for Juno.
 * @interface JunoParams
 */
export interface JunoParams {
  /**
   * The Docker container parameters, which can be a boolean or a JunoContainerParams object.
   * @type {boolean | JunoContainerParams}
   * @optional
   */
  container?: boolean | JunoContainerParams;
}

/**
 * Represents the arguments for the configuration.
 * @interface ConfigArgs
 */
export interface ConfigArgs {
  /**
   * The Juno parameters.
   * @type {JunoParams}
   * @optional
   */
  params?: JunoParams;

  /**
   * The mode in which the application is running.
   * @type {string}
   */
  mode: string;
}

/**
 * Represents the ICP (Internet Computer Protocol) IDs.
 * @interface IcpIds
 */
export interface IcpIds {
  /**
   * The Internet Identity ID.
   * @type {string}
   */
  internetIdentityId: string;

  /**
   * The ICP Ledger ID.
   * @type {string}
   */
  icpLedgerId: string;

  /**
   * The ICP Index ID.
   * @type {string}
   */
  icpIndexId: string;

  /**
   * The NNS Governance ID.
   * @type {string}
   */
  nnsGovernanceId: string;

  /**
   * The CMC (Cycles Minting) ID.
   * @type {string}
   */
  cmcId: string;

  /**
   * The Registry ID.
   * @type {string}
   */
  registryId: string;

  /**
   * The Cycles Ledger ID.
   * @type {string}
   */
  cyclesLedgerId: string;

  /**
   * The Cycles Index ID.
   * @type {string}
   */
  cyclesIndexId: string;

  /**
   * The SNS-W ID.
   * @type {string}
   */
  snsWasmId: string;

  /**
   * The NNS-dapp ID.
   * @type {string}
   */
  nnsDappId: string;
}
