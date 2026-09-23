import video from '../../../../assets/images/free.gif?as=mp4&w=480&ffmpeg';
import webp from '../../../../assets/images/free.gif?as=webp&w=480&sharp';
import gif from '../../../../assets/images/free.gif?as=gif&w=480&sharp';

import FeatureItem from '../FeatureItem/FeatureItem';

const FreeFeatureItem = (): JSX.Element => (
  <FeatureItem title="Free for everyone" sources={{ video, webp, gif }} />
);

export default FreeFeatureItem;
