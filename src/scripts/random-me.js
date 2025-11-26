const multiverseOfMe = [
  '/me.jpg',
  '/mes/IMG_1259.jpg',
  '/mes/IMG_0425.jpg',
  '/mes/IMG_1747.jpg',
  '/mes/IMG_0429.jpg',
  '/mes/IMG_1739.jpg',
  '/mes/IMG_0837.jpg',
  '/mes/IMG_0435.jpg',
  '/mes/IMG_1439.jpg',
  '/mes/IMG_1749.jpg',
  '/mes/IMG_0423.jpg',
  '/mes/IMG_0825.jpg',
  '/mes/IMG_0633.jpg',
  '/mes/IMG_0814.jpg',
  '/mes/IMG_0422.jpg',
  '/mes/IMG_1247.jpg',
  '/mes/IMG_0432.jpg',
  '/mes/IMG_1255.jpg',
  '/mes/IMG_0821.jpg',
  '/mes/IMG_1253.jpg',
  '/mes/IMG_0631.jpg',
  '/mes/IMG_0628.jpg',
  '/mes/IMG_0433.jpg',
  '/mes/IMG_0431.jpg',
  '/mes/IMG_1748.jpg',
  '/mes/IMG_0826.jpg',
  '/mes/IMG_0424.jpg',
  '/mes/IMG_1741.jpg',
  '/mes/IMG_1250.jpg',
  '/mes/IMG_1437.jpg',
  '/mes/IMG_1440.jpg',
];


const getMvMe = () => {
  const idx = Math.floor(Math.random() * multiverseOfMe.length);
  return multiverseOfMe[idx];
};
const findAvatarImg = () => {
  return document.querySelector('img.avatar') ||
    document.querySelector('img[src$=\'/me.jpg\']') ||
    document.querySelector('img[data-me]') ||
    undefined;
};
const replaceImg = () => {
  const img = findAvatarImg();
  if (img) {
    img.src = getMvMe();
  }
  if (!img.hasAttribute('data-me')) {
    img.setAttribute('data-me', true);
  }
};

export { replaceImg };
