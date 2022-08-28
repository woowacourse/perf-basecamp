export const Artist = ({ name = '', profileUrl = '', profileImageUrl = '' }) => ({
  name,
  profileUrl,
  profileImageUrl
});

export interface Artist extends ReturnType<typeof Artist> {}
