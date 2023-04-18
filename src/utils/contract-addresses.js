export const app_contract =
  process.env.REACT_APP_ENV === 'dev'
    ? 'registry-1.i-am-human.testnet'
    : 'registry.i-am-human.near';
export const new_sbt_contract = 'sbt1.i-am-human.testnet';
console.log(process.env.REACT_APP_ENV);
export const near_contract =
  process.env.REACT_APP_ENV === 'dev'
    ? 'og-sbt-1.i-am-human.testnet'
    : 'og-sbt.i-am-human.near';
export const gooddollar_contract =
  process.env.REACT_APP_ENV === 'dev'
    ? 'gooddollar-v1.i-am-human.testnet'
    : 'gooddollar-v1.i-am-human.near';
