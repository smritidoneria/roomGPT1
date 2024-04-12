import React from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';

const CompareSlider = ({ original, restored }) => {
  return (
    <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={original} alt="original photo" />}
      itemTwo={<ReactCompareSliderImage src={restored} alt="generated photo" />}
      portrait
      className="flex w-[600px] mt-5 h-96"
    />
  );
};

export default CompareSlider;
