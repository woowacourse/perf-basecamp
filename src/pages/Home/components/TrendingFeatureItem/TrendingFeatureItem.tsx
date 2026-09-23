import video from '../../../../assets/images/trending.gif?as=mp4&w=480&ffmpeg';
import webp from '../../../../assets/images/trending.gif?as=webp&w=480&sharp';
import gif from '../../../../assets/images/trending.gif?as=gif&w=480&sharp';

import FeatureItem from '../FeatureItem/FeatureItem';

const TrendingFeatureItem = (): JSX.Element => (
  <FeatureItem title="See trending gif" sources={{ video, webp, gif }} />
);

export default TrendingFeatureItem;
