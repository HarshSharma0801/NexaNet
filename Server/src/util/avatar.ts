export const makeAvatar = (): string => {
  const randomKey = Math.random().toString(36).substring(2, 7);

  const randomNum = Math.floor(Math.random() * 9) + 1;

  const avatarURL = `https://robohash.org/dolor${randomKey}umvlitquam.png?size=50x50&set=set${randomNum}`;

  return avatarURL;
};
