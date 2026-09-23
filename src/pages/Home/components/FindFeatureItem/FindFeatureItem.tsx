import video from '../../../../assets/images/find.gif?as=mp4&w=480&ffmpeg';
import webp from '../../../../assets/images/find.gif?as=webp&w=480&sharp';
import gif from '../../../../assets/images/find.gif?as=gif&w=480&sharp';

import FeatureItem from '../FeatureItem/FeatureItem';

const FindFeatureItem = (): JSX.Element => (
  <FeatureItem title="Find gif for free" sources={{ video, webp, gif }} />
);

export default FindFeatureItem;
