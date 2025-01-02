import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('AvalancheBridge', {
    from: deployer,
    args: [2], // Required validations
    log: true,
    waitConfirmations: 2,
  });
};

export default func;
func.tags = ['AvalancheBridge']; 