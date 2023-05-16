import React, { useEffect, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { wallet } from '../../../index';
import { TransferSBT } from './MyOwnSbtFiles/transferSbt';
import { getConfig } from '../../../utils/config';

export const CheckSbtTokenStatus = () => {
  const [fetchloading, setFetchLoading] = useState(true);
  const [tokenSupply, setTokenSupply] = useState(null);
  const isButtonDisabled = tokenSupply === 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkSBTTokens = useCallback(async () => {
    const { app_contract, new_sbt_contract, gooddollar_contract } = getConfig();
    try {
      setFetchLoading(true);
      const og_supply = await wallet.viewMethod({
        contractId: app_contract,
        method: 'sbt_supply_by_owner',
        args: { account: wallet.accountId, ctr: new_sbt_contract },
      });
      const fv_supply = await wallet.viewMethod({
        contractId: app_contract,
        method: 'sbt_supply_by_owner',
        args: { account: wallet.accountId, ctr: gooddollar_contract },
      });
      setTokenSupply(parseInt(og_supply + fv_supply));
    } catch (e) {
      console.log(e);
      toast.error('An error occured while fetching token supply');
      setFetchLoading(false);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSBTTokens();
  }, [checkSBTTokens]);
  // const isExpired = Date.now() > tokenData?.metadata?.expires_at;

  return (
    <div className="p-2">
      <p className="text-3xl font-semibold">Your SBT Tokens</p>
      <div className="relative h-8 z-0 mb-2 mt-6 w-full">
        {fetchloading ? (
          <div className="h-8 rounded w-60 bg-gray-200 animate-pulse" />
        ) : (
          <>
            <p>
              <span className="font-medium">SBT Tokens you own</span>:{' '}
              {tokenSupply}
            </p>
            {/* {tokenData && (
              <>
                <p
                  className={`${
                    isExpired ? 'text-red-500' : 'text-green-600'
                  } font-light mb-2`}
                >
                  {isExpired
                    ? 'You have expired tokens'
                    : 'You have a valid Token'}
                </p>
              </>
            )} */}
          </>
        )}
      </div>
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={() => setIsModalOpen(true)}
        className={`text-white mt-4 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none ${
          isButtonDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-800'
        } `}
      >
        Transfer SBT between my own accounts
      </button>
      <TransferSBT
        isOpen={isModalOpen}
        checkSBTTokens={checkSBTTokens}
        closeModal={() => setIsModalOpen(false)}
      />
      <div className="p-4 shadow rounded-lg w-full md:w-[60%] w-full">
        <p className="text-sm italic">
          In our target state a user will be able to transfer their SBT between
          their own accounts only, by signing in with both accounts in the same
          session. (In this prototype a user can transfer their SBT to any other
          address.)
        </p>
      </div>
    </div>
  );
};
