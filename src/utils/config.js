const environment = process.env.REACT_APP_ENV ?? 'prod';

export function getConfig() {
  const commonConfig = {
    gooddollar_api: 'https://staging.justfortestinc.site',
    mintFee: '8000000000000000000000',
  };
  switch (environment) {
    case 'prod':
      return {
        network_id: 'mainnet',
        app_contract: 'registry.i-am-human.near',
        og_contract: 'og-sbt.i-am-human.near',
        // gooddollar_contract: 'gooddollar-v1.i-am-human.near',
        fractal_contract: 'fractal-1.i-am-human.testnet', // for DEV ENV
        new_sbt_contract: 'sbt1.i-am-human.testnet',
        api_link: 'https://api-ophc7vkxsq-uc.a.run.app',
        fractal_link: 'https://app.fractal.id',
        fractal_client_id: 'D6SgXZQdWYk0D8ILkIGpNK75ufFpxD0Mp9sHFb_2oM8',
        ...commonConfig,
      };
    case 'dev':
      return {
        network_id: 'testnet',
        app_contract: 'registry-1.i-am-human.testnet',
        og_contract: 'og-sbt-1.i-am-human.testnet',
        // gooddollar_contract: 'gooddollar-v1.i-am-human.testnet',
        fractal_contract: 'fractal-1.i-am-human.testnet', // for DEV ENV
        new_sbt_contract: 'sbt1.i-am-human.testnet',
        api_link: 'https://dev-ophc7vkxsq-uc.a.run.app/',
        fractal_link: 'https://app.next.fractal.id',
        fractal_client_id: 'D6SgXZQdWYk0D8ILkIGpNK75ufFpxD0Mp9sHFb_2oM8', // waiting for DEV branch
        // fractal_client_id: '2KdWlqCWoyMtfIHTEI60NgqDA015d0Uy2r5KieoZS3M', // for http://localhost:3000
        ...commonConfig,
      };
    default:
      throw new Error(`${environment} is not a valid NEAR environment`);
  }
}
