

export const imageBlurAsync = {
  inserted(el, binding, vnode) {
    let smallImgSrc, bigImgSrc;
    let extension = Object.keys(binding.modifiers)[0] || 'jpg';
    if (binding.arg == 'local') {
      smallImgSrc = require(`@images/${binding.value}/${binding.value}_lazy.${extension}`);
      bigImgSrc = require(`@images/${binding.value}/${binding.value}.${extension}`);
    } 
    el.classList.add('lazy-blur-background');

    let smallImg = new Image();
    smallImg.classList.add('img-small')
    smallImg.src = smallImgSrc;
    smallImg.onload = () => {
      smallImg.classList.add('loaded');
    };
    el.appendChild(smallImg);

    let bigImg = new Image();
    bigImg.src = bigImgSrc;
    bigImg.onload = () => {
      bigImg.classList.add('bigLoaded');
    };
    el.appendChild(bigImg);
  }
}