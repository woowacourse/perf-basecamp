interface PictureProps {
  imageName: string;
  imageStyle: string;
}

const Picture = ({ imageName, imageStyle }: PictureProps) => {
  console.log(imageName, imageStyle, `../../../assets/images/${imageName}-1920.webp`);

  return (
    <>
      <picture>
        <source
          type="image/webp"
          media="(min-width:1920px)"
          srcSet={`/src/assets/images/${imageName}-1920.webp`}
        />
        <source
          type="image/webp"
          media="(min-width:1366px)"
          srcSet={`/src/assets/images/${imageName}-1366.webp`}
        />
        <source
          type="image/webp"
          media="(min-width:768px)"
          srcSet={`/src/assets/images/${imageName}-768.webp`}
        />
        <source
          type="image/jpg"
          media="(min-width:1920px)"
          srcSet={`/src/assets/images/${imageName}-1920.jpg`}
        />
        <source
          type="image/jpg"
          media="(min-width:1366px)"
          srcSet={`/src/assets/images/${imageName}-1366.jpg`}
        />
        <source
          type="image/jpg"
          media="(min-width:768px)"
          srcSet={`/src/assets/images/${imageName}-768.jpg`}
        />
        <img
          className={imageStyle}
          src={`/src/assets/images/${imageName}-1920.jpg`}
          alt={`${imageName} image`}
        />
      </picture>
    </>
  );
};

export default Picture;
