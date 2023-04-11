import React, { useState } from 'react';
import Level0 from '../../../images/fingerprints/level0.png';
import Level1Fv from '../../../images/fingerprints/level1-fv.png';
import Level1Og from '../../../images/fingerprints/level1-og.png';
import Level1KYC from '../../../images/fingerprints/level1-kyc.png';
import Level2FvOg from '../../../images/fingerprints/level2-fv-og.png';
import Level2FvKyc from '../../../images/fingerprints/level2-fv-kyc.png';
import Level2KycOg from '../../../images/fingerprints/level2-kyc-og.png';
import Level3 from '../../../images/fingerprints/level3.png';
import { IAmHumanStatusVideo } from './iAmHumanStatusVideo';

export const IAmHumanStatus = ({ isSbtToken, isFvToken, isKycDao = false }) => {
  const switchImage = () => {
    switch (true) {
      case isSbtToken && isFvToken && isKycDao:
        return Level3;
      case !isSbtToken && !isFvToken && !isKycDao:
        return Level0;
      case isSbtToken && !isFvToken && !isKycDao:
        return Level1Og;
      case !isSbtToken && isFvToken && !isKycDao:
        return Level1Fv;
      case !isSbtToken && !isFvToken && isKycDao:
        return Level1KYC;
      case isSbtToken && isFvToken && !isKycDao:
        return Level2FvOg;
      case isSbtToken && !isFvToken && isKycDao:
        return Level2KycOg;
      case !isSbtToken && isFvToken && isKycDao:
        return Level2FvKyc;
      default:
        console.log('Unhandled case.');
    }
  };

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <div className="p-4">
      <p className="text-2xl font-bold">Your Human Status</p>
      <div className="mx-auto" style={{ width: 400, height: 400 }}>
        <img src={switchImage()} alt="humanLevel" />
      </div>
      <p className="text-xl font-light mb-2">
        This Image changes based on the level of personhood you have achieved
        inside our app
      </p>
      <button
        onClick={() => setIsVideoOpen(true)}
        className="p-2 bg-gray-100 shadow rounded-md text-xs hover:bg-gray-200 transition-all"
      >
        click here to see how it works
      </button>
      <IAmHumanStatusVideo open={isVideoOpen} setOpen={setIsVideoOpen} />
    </div>
  );
};
