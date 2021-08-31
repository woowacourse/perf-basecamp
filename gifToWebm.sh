# gif to webm
# ref: https://web.dev/replace-gifs-with-videos/#create-webm-videos
# how to: bash gifToWebm [,path]

IS_PKG_INSTALLED=$(dpkg  -s ffmpeg  | grep "install ok installed")

if [ -z $IS_PKG_INSTALLED ]; then
  echo "error: you have to install ffmpeg"
  exit 1
fi

if [ -z $1 ]; then
  for i in $(find . -type f -name "*.gif" -not -path "./node_modules/*" )
    do ffmpeg -i $i -c vp9 -b:v 0 -crf 41 -y ${i%.gif}.webm;
  done
elif [ -d $1 ]; then
  for i in  $(find $1 -type f -name "*.gif" -not -path "./node_modules/*" );
    do ffmpeg -i $i -c vp9 -b:v 0 -crf 41 -y ${i%.gif}.webm;
  done
elif [[ $1 == *.gif ]]; then
  ffmpeg -i $1 -c vp9 -b:v 0 -crf 41 -y ${1%.gif}.webm ;
else
  echo "error: $1 is invalid file"
  exit 1
fi
