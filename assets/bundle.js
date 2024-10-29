const multiverseOfMe = [
  'https://blog.barboza.io/me.jpg',
  'https://blog.barboza.io/mes/IMG_1259.jpg',
  'https://blog.barboza.io/mes/IMG_0425.jpg',
  'https://blog.barboza.io/mes/IMG_1747.jpg',
  'https://blog.barboza.io/mes/IMG_0429.jpg',
  'https://blog.barboza.io/mes/IMG_1739.jpg',
  'https://blog.barboza.io/mes/IMG_0837.jpg',
  'https://blog.barboza.io/mes/IMG_0435.jpg',
  'https://blog.barboza.io/mes/IMG_1439.jpg',
  'https://blog.barboza.io/mes/IMG_1749.jpg',
  'https://blog.barboza.io/mes/IMG_0423.jpg',
  'https://blog.barboza.io/mes/IMG_0825.jpg',
  'https://blog.barboza.io/mes/IMG_0633.jpg',
  'https://blog.barboza.io/mes/IMG_0814.jpg',
  'https://blog.barboza.io/mes/IMG_0422.jpg',
  'https://blog.barboza.io/mes/IMG_1247.jpg',
  'https://blog.barboza.io/mes/IMG_0432.jpg',
  'https://blog.barboza.io/mes/IMG_1255.jpg',
  'https://blog.barboza.io/mes/IMG_0821.jpg',
  'https://blog.barboza.io/mes/IMG_1253.jpg',
  'https://blog.barboza.io/mes/IMG_0631.jpg',
  'https://blog.barboza.io/mes/IMG_0628.jpg',
  'https://blog.barboza.io/mes/IMG_0433.jpg',
  'https://blog.barboza.io/mes/IMG_0431.jpg',
  'https://blog.barboza.io/mes/IMG_1748.jpg',
  'https://blog.barboza.io/mes/IMG_0826.jpg',
  'https://blog.barboza.io/mes/IMG_0424.jpg',
  'https://blog.barboza.io/mes/IMG_1741.jpg',
  'https://blog.barboza.io/mes/IMG_1250.jpg',
  'https://blog.barboza.io/mes/IMG_1437.jpg',
  'https://blog.barboza.io/mes/IMG_1440.jpg',
];

const getMvMe = () => {
    const idx = Math.floor(Math.random()*multiverseOfMe.length);
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

((win, doc) => {
    doc.addEventListener('onload', (e) => {
        replaceImg();
    });
})(window, document);
