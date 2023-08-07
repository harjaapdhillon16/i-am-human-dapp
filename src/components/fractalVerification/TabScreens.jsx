import React, { useState, useEffect, Fragment } from 'react';
import { CircleSpinner } from 'react-spinners-kit';
import { wallet } from '../..';
import {
  hasTwoDots,
  insertUserData,
  log_event,
} from '../../utils/utilityFunctions';
import { getConfig } from '../../utils/config';
import { WalletSVG } from '../../images/WalletSVG';
import { FaceSVG } from '../../images/FaceSVG';
import { MintSVG } from '../../images/MintSVG';
import { Warning } from '../../images/Warning';
import Timer from '../common/Countdown';
import { SuccesVerification } from './SuccessPage';
import { useSelector, useDispatch } from 'react-redux';
import { verifyUser } from '../../services/api';
import { updateResponse } from '../../redux/reducer/oracleReducer';
import { ImageSrc, ReducerNames } from '../../utils/constants';
import { setActivePageIndex } from '../../redux/reducer/commonReducer';
import { Dialog, Transition } from '@headlessui/react';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again.';

export const ConnectWallet = () => (
  <div className="w-full">
    <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-purple-400">
      <div className="flex items-center justify-center w-full h-full rounded-full border-2 border-purple-500 bg-purple-200 shadow-[inset_0_0px_4px_#FFFFFF] shadow-purple-400">
        <WalletSVG styles="w-12 h-12 fill-purple-400 stroke-themeColor" />
      </div>
    </div>
    <h2 className="text-4xl font-bold	my-4">Connect Wallet</h2>
    <p className="text-s mb-8">
      A NEAR wallet is required. Be sure you connect an account you want to use
      for <br /> governance. Get a new account if you don't already have one.
    </p>
    <button
      onClick={() => wallet.signIn()}
      type="button"
      className="w-full md:w-max rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
    >
      <p className="mx-auto w-[fit-content]">Connect Wallet</p>
    </button>
  </div>
);

export const MintSBT = ({ setError, isError }) => {
  const { responseData } = useSelector((state) => state[ReducerNames.ORACLE]);
  const [submit, setSubmit] = useState(null);
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE);
  const dispatch = useDispatch();
  const { isSuccessSBTPage } = useSelector(
    (state) => state[ReducerNames.COMMON]
  );

  const mintSBT = async () => {
    window.history.replaceState({}, '', window.location.origin);
    setSubmit(true);
    try {
      const { fractal_contract } = getConfig();
      // fetch fees requirement from contract
      const fees = await wallet.viewMethod({
        contractId: fractal_contract,
        method: 'get_required_sbt_mint_deposit',
        args: {
          is_verified_kyc: responseData?.kyc == 'approved', // get exact mint cost
        },
      });
      log_event({
        event_log:
          'Oracle: Contract. User apply for FV SBT, creates the transaction ' +
          JSON.stringify(responseData),
      });
      insertUserData({
        fv_status: 'Minting txn send',
      });

      await wallet.callMethod({
        contractId: fractal_contract,
        method: 'sbt_mint',
        args: {
          claim_b64: responseData.m,
          claim_sig: responseData.sig,
        },
        deposit: BigInt(fees).toString(),
      });
    } catch (e) {
      log_event({
        event_log: `Oracle: Contract Error. ${JSON.stringify(e)}`,
      });
      setError(true);
      setErrorMessage(e.message);
      setSubmit(false);
    }
  };

  const tryAgain = () => {
    dispatch(setActivePageIndex(1));
    setError(false);
    setErrorMessage(DEFAULT_ERROR_MESSAGE);
  };

  return isSuccessSBTPage ? (
    <SuccesVerification />
  ) : (
    <div>
      <Transition.Root show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col gap-4">
                    <h1 className="font-semibold text-2xl">
                      We will be back in a bit! We will be back in a bit.
                    </h1>
                    <p>
                      We have been impacted by the Aug 2, 2023 NEAR mainnet
                      upgrade which unfortunately contained a runtime error and
                      caused unexpected contract behavior. The Pagoda protocol
                      team is working on patching the mainnet. Please check back
                      later!
                    </p>
                    <p>Thank you for your patience!</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="w-full flex flex-wrap md:flex-nowrap justify-between items-center">
        <div>
          <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-purple-400">
            <div className="flex items-center justify-center w-full h-full rounded-full border-2 border-purple-500 bg-purple-200 shadow-purple-400 shadow-[inset_0_0px_4px_#FFFFFF]">
              <MintSVG styles="w-12 h-12 stroke-themeColor" />
            </div>
          </div>
          <h2 className="text-4xl font-bold	my-4">
            Mint Face Verification Soul Bound Token
          </h2>
          <p className="text-s mb-8 mr-8">
            Congratulations! You're eligible to receive Soul Bound Tokens (SBTs)
            that verify that you are a human.
          </p>
          {isError ? (
            <>
              <div className="flex mr-10">
                <button
                  onClick={() => tryAgain()}
                  type="button"
                  className="rounded-md bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                >
                  {submit ? (
                    <CircleSpinner size={20} />
                  ) : (
                    <p className="mx-auto min-w-max">Try Again</p>
                  )}
                </button>
                <div className="rounded-md px-4 py-2 text-base font-medium text-red-500 shadow-sm bg-red-100 ml-3 flex">
                  <Warning />
                  <p className="ml-2">{errorMessage}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-y-5 md:gap-0 flex-wrap items-center">
              <button
                onClick={mintSBT}
                type="button"
                className="w-full md:w-max rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
              >
                {submit ? (
                  <CircleSpinner size={20} />
                ) : (
                  <p className="mx-auto w-[fit-content]">Mint Your SBT</p>
                )}
              </button>

              <div className="flex items-center ml-4">
                <p className="mr-1">Expire in</p>
                <Timer delayResend="600" />
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block md:min-w-[250px] rounded-md overflow-hidden order-first md:order-last w-full md:w-1/3 flex justify-center">
          <img src={ImageSrc.FVSBT} className="object-fill" />
        </div>
      </div>
    </div>
  );
};

export const ScanFace = () => {
  const [submit, setSubmit] = useState(null);
  const [isApprovalAwait, setApprovalWait] = useState(false);
  const { responseData } = useSelector((state) => state[ReducerNames.ORACLE]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [isUserRedirected, setUserRedirect] = useState(false);

  // try again is called when verifyUser throws error at Tabs screen
  async function tryAgainAction() {
    if (checkForSubAccounts()) {
      return;
    }
    setSubmit(true);
    const verifyData = {
      redirect_uri: window.location.origin,
      token: responseData?.token,
      claimer: wallet.accountId,
    };
    verifyUser(verifyData)
      .then((resp) => {
        dispatch(updateResponse(resp));
        if (resp?.token) {
          log_event({
            event_log: 'Fractal: User is not approved! ' + JSON.stringify(resp),
          });
          insertUserData({
            fv_status: 'Fractal Pending Authorization',
          });
        }
        // success response,
        if (resp?.m) {
          insertUserData({
            fv_status: 'Fractal Approved',
          });
          log_event({
            event_log: 'Fractal: User is approved! ' + JSON.stringify(resp),
          });
          dispatch(setActivePageIndex(2));
        }
        if (resp?.error) {
          log_event({
            event_log: 'Oracle: API Error. ' + resp?.error,
          });
          dispatch(setActivePageIndex(1));
        }
        setSubmit(false);
      })
      .catch((error) => {
        console.log('Error occured while verifying data', error);
        setSubmit(false);
      });
  }

  function checkForSubAccounts() {
    // check for sub accounts
    if (hasTwoDots(wallet.accountId)) {
      setError(
        'Please use a top level NEAR account, not a sub-account, to mint your SBT.'
      );
      return true;
    }
    return false;
  }

  const fractalLoginCb = () => {
    if (checkForSubAccounts()) {
      return;
    }
    setUserRedirect(true);
    const { fractal_link, fractal_client_id, succes_fractal_state } =
      getConfig();
    const fractalVerifyURL =
      fractal_link +
      '/authorize?' +
      `client_id=${fractal_client_id}&redirect_uri=${encodeURIComponent(
        window.location.origin
      )}&response_type=code&scope=contact%3Aread%20verification.uniqueness%3Aread%20verification.uniqueness.details%3Aread&state=${succes_fractal_state}&ensure_wallet=${
        wallet.accountId
      }`;
    insertUserData({
      fv_status: 'User begins Face Verification',
    });
    log_event({
      event_log: 'Fractal: User begins their Face scan',
    });
    window.open(fractalVerifyURL, '_blank');
  };

  useEffect(() => {
    setError(responseData?.error);
  }, [responseData?.error]);

  useEffect(() => {
    if (responseData?.token) {
      setApprovalWait(true);
    }
  }, [responseData?.token]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-purple-400">
        <div className="flex items-center justify-center w-full h-full rounded-full border-2 border-purple-500 bg-purple-200 shadow-[inset_0_0px_4px_#FFFFFF] shadow-purple-400">
          <FaceSVG styles="w-12 h-12 fill-purple-400 stroke-themeColor" />
        </div>
      </div>
      <h2 className="text-4xl font-bold	my-4">Face Scan</h2>
      <p className="font-semibold mb-4">
        Have you used Fractal before? Use the same email you had used with
        Fractal.
      </p>
      <p className="text-s mb-8">
        For the face scan, please create or log into your Fractal account.
        Follow the steps on <br /> the Fractal website to complete the
        verification.
        <br />
        <br />
        Keep your phone nearby in case Face Verification fails on desktop. Once
        you've <br /> finished the verification on Fractal, return to
        I-AM-HUMAN.
      </p>
      <div className="flex flex-wrap md:flex-nowrap gap-5">
        <button
          onClick={isApprovalAwait || error ? tryAgainAction : fractalLoginCb}
          type="button"
          className={`w-full md:w-max rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 ${
            isApprovalAwait ? 'bg-red-500' : ''
          }`}
          disabled={submit}
        >
          {submit ? (
            <div className="flex gap-x-5">
              <p>Verifying Your Uniqueness with Fractal</p>
              <CircleSpinner size={20} />
            </div>
          ) : (
            <p className="mx-auto w-[fit-content]">
              {isApprovalAwait || error
                ? 'Try Again'
                : isUserRedirected
                ? 'Verify Your Uniqueness with Fractal'
                : 'Start Face Scan with Fractal'}
            </p>
          )}
        </button>
        {(isApprovalAwait || error) && !submit && (
          <div className="bg-red-500 p-3 rounded-md text-white">
            {error ??
              'Your face scan is waiting to be processed by Fractal. Please wait for a few minutes.'}
          </div>
        )}
      </div>
      <p className="font-light italic mt-4 text-sm">
        * Fractal is a web3 identity provider. Do you have issues with Fractal
        verification? Please see the{' '}
        <a
          href="https://i-am-human.gitbook.io/i-am-human-docs/help/troubleshooting-faq"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Troubleshooting Guide
        </a>{' '}
        for solutions.
      </p>
    </div>
  );
};
