import { Contract } from 'ethers'
import { Contract as ContractV6, Typed } from 'ethers@6'
import { bench, describe } from 'vitest'
import { getAccount } from '../../utils'

import {
  accounts,
  ethersProvider,
  ethersV6Provider,
  publicClient,
  wagmiContractConfig,
} from '../../_test'

import { simulateContract } from './simulateContract'

describe('Simulate Contract', () => {
  bench('viem: `simulateContract`', async () => {
    await simulateContract(publicClient, {
      ...wagmiContractConfig,
      functionName: 'mint',
      args: [42111n],
      account: getAccount(accounts[0].address),
    })
  })

  bench('ethers@5: `callStatic`', async () => {
    const wagmi = new Contract(
      wagmiContractConfig.address,
      wagmiContractConfig.abi,
      ethersProvider,
    )
    await wagmi.callStatic['mint(uint256)'](42111, {
      from: accounts[0].address,
    })
  })

  bench('ethers@6: `callStatic`', async () => {
    const wagmi = new ContractV6(
      wagmiContractConfig.address,
      wagmiContractConfig.abi,
      ethersV6Provider,
    )
    await wagmi.mint.staticCall(Typed.uint(42111), {
      from: accounts[0].address,
    })
  })
})
