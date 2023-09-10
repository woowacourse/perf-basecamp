export const makeArtist = ({ name = '', profileUrl = '', profileImageUrl = '' }) => ({
  name,
  profileUrl,
  profileImageUrl
});

export interface Artist extends ReturnType<typeof makeArtist> {}
