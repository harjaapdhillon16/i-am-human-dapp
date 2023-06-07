import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { CommunityDataKeys } from '../utils/campaign';
import { Header } from '../components/common/header';
import { PrivacyComponent } from '../components/common/privacy';
import { Footer } from '../components/common/footer';
import Design from '../images/NDC-Lines.svg';
import { Landing } from './unAuth';
import { Home } from './auth/home';
import { IsSignedInLanding } from './unAuth/IsSignedInLanding';
import { getConfig } from '../utils/config';
import { wallet } from '..';
import { WalletSVG } from '../images/WalletSVG';
import { FaceSVG } from '../images/FaceSVG';
import { MintSVG } from '../images/MintSVG';
import { Tabs } from '../components/pages/home/tabs';
import { supabase } from '../utils/supabase';
import { LSKeys } from '../utils/constants';
import { insertUserData, log_event } from '../utils/utilityFunctions';

const URL = window.location;

export function IndexPage({ isSignedIn }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(null);
  const [successSBT, setSuccessSBT] = useState(false);
  const [fvTokens, setFVTokens] = useState(null);
  const [kycTokens, setKYCTokens] = useState(null);

  async function storeCommunityVerticalData() {
    try {
      const communityName = localStorage.getItem('community-name');
      const communityVertical = localStorage.getItem('community-vertical');
      if (communityName && fvTokens) {
        const { data } = await supabase.select('scoreboard', {
          account: wallet.accountId,
        });
        if (!data?.[0]) {
          await supabase.insert('scoreboard', {
            account: wallet.accountId,
            [CommunityDataKeys.COMMUNITY_NAME]: communityName,
            [CommunityDataKeys.COMMUNITY_VERTICAL]: communityVertical,
          });
        }
        // since the data is stored in db, removing it from LS
        localStorage.removeItem(CommunityDataKeys.COMMUNITY_NAME);
        localStorage.removeItem(CommunityDataKeys.COMMUNITY_VERTICAL);
      }
    } catch (error) {
      console.log('Error occurred while saving data in scoreboard db', error);
    }
  }

  function createEventLog() {
    const userData = {
      token_id: fvTokens.token,
      issued_date: fvTokens?.metadata?.issued_at,
      expire_date: fvTokens?.metadata?.expires_at,
      token_type: 'Face Verification',
      status: 'Mint Success',
    };
    insertUserData(userData);
    log_event({
      event_log: `User successfully minted their FV SBT token: ${fvTokens.token}`,
    });
  }

  useEffect(() => {
    storeCommunityVerticalData();
    const { succes_fractal_state } = getConfig();
    const URL_state = new URLSearchParams(URL.search).get('state');
    if (URL_state === succes_fractal_state && wallet?.accountId) {
      setActiveTabIndex(2);
    }
    if (fvTokens && localStorage.getItem(LSKeys.SHOW_SBT_PAGE)) {
      createEventLog();
      localStorage.removeItem(LSKeys.SHOW_SBT_PAGE);
      setSuccessSBT(true);
      setActiveTabIndex(2);
    }
  }, [fvTokens]);

  useEffect(() => {
    // setting vertical and community in LS till user mint the token (after which we store the data in supbase db)
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const community = params.get('community');
    const vertical = params.get('vertical');
    if (community && vertical) {
      localStorage.setItem(CommunityDataKeys.COMMUNITY_NAME, community);
      localStorage.setItem(CommunityDataKeys.COMMUNITY_VERTICAL, vertical);
    }
  }, []);

  const TabsData = [
    {
      name: 'Connect Wallet',
      header: <WalletSVG styles={`w-12 h-12 stroke-purple-400`} />,
    },
    {
      name: 'Face Scan',
      header: <FaceSVG styles={`w-12 h-12 stroke-purple-400`} />,
    },
    {
      name: 'Mint SBT',
      header: <MintSVG styles={`w-12 h-12 stroke-purple-400`} />,
    },
  ];

  const getStarted = () => {
    if (wallet?.accountId) {
      setActiveTabIndex(1);
    } else {
      setActiveTabIndex(0);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          typeof activeTabIndex !== 'number' && !showAdmin
            ? `url(${Design})`
            : 'none',
        zIndex: 10,
      }}
      className={'bg-no-repeat home_bg_image'}
    >
      <div
        style={{ background: 'transparent' }}
        className="isolate bg-white mx-auto max-w-7xl px-5 pt-10"
      >
        <Header
          setActiveTabIndex={setActiveTabIndex}
          setShowAdmin={setShowAdmin}
          isAdmin={false}
        />
        {showAdmin ? (
          <Tabs isAdmin={showAdmin} />
        ) : (
          <>
            {typeof activeTabIndex !== 'number' ? (
              <>
                <div className="mt-[50px] md:mt-[100px] flex flex-col gap-y-16 md:gap-y-32">
                  <div className="flex flex-wrap gap-10">
                    <div className="flex-1 min-w-[300px]">
                      <h1 className="font-bold text-5xl">
                        Get your Proof of Personhood with
                        <br />
                        I-AM-HUMAN
                      </h1>
                      <p className="my-5 mt-10">
                        Welcome, I-AM-HUMAN is your launchpad for several
                        different types of Soul Bound Tokens (SBTs). Each of
                        which will identify you as a human. With enough of these
                        SBTs, you will have a strong proof-of-personhood, which
                        give you access to voting on governance, on-chain
                        reputation, DAOs, grassroots funding, and much more.
                      </p>
                      <p>All you need to do is 3 easy steps.</p>
                      <div className="my-10">
                        <div className="grid grid-cols-3 gap-1 md:gap-2 items-center justify-center md:justify-start">
                          {TabsData.map((tab, index) => {
                            return (
                              <div className="flex items-center gap-1 md:gap-2">
                                <div className="rounded-full border border-2 border-purple-400 w-fit p-1">
                                  {tab.header}
                                </div>
                                {index < 2 ? (
                                  <hr className="h-px my-8 bg-gradient-to-r from-purple-600 to-indigo-600 border-0 w-full" />
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* for responsive better styling */}
                        <div className="grid grid-cols-3 gap-1 md:gap-2 items-center justify-center md:justify-start">
                          {TabsData.map((tab) => {
                            return (
                              <p className="text-sm md:text-md mt-2">
                                {tab.name}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between md:justify-start flex-wrap gap-x-10 gap-y-5">
                        {/* show get started only if no tokens are minted by user */}
                        {!kycTokens && !fvTokens && (
                          <button
                            onClick={() => getStarted()}
                            className="rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-7 md:px-10 py-3 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                          >
                            Get Started
                          </button>
                        )}
                        {kycTokens ||
                          (fvTokens && (
                            <button
                              onClick={() =>
                                window.open(
                                  'https://t.me/+fcNhYGxK891lMjMx',
                                  '_blank'
                                )
                              }
                              className="rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-7 md:px-10 py-3 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                            >
                              Join the Community
                            </button>
                          ))}
                        <button
                          onClick={() =>
                            window.open(
                              'https://i-am-human.gitbook.io/i-am-human-docs/',
                              '_blank'
                            )
                          }
                          className="rounded-md border border-purple-500 text-purple-500 border-1 px-7 md:px-10 py-2 text-base font-light text-black shadow-sm"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[300px] order-first md:order-last">
                      <img
                        src={Design}
                        className="w-full object-fill hidden md:invisible"
                      />
                    </div>
                  </div>
                  {isSignedIn ? (
                    <Home
                      setActiveTabIndex={setActiveTabIndex}
                      sendFVTokensDetails={setFVTokens}
                      sendKYCTokensDetails={setKYCTokens}
                    />
                  ) : (
                    <Landing setActiveTabIndex={setActiveTabIndex} />
                  )}
                </div>
                <PrivacyComponent />
              </>
            ) : (
              <IsSignedInLanding
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
                successSBT={successSBT}
                setSuccessSBT={setSuccessSBT}
              />
            )}
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
