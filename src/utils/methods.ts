import $ from 'jquery';
import "reflect-metadata";

export function timeout(duration: number): Promise<{}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {resolve()}, duration);
  })
};

export function randomNumber(min: number, max: number) : number {
  return Math.floor((Math.random() * max) + min);
}


export function calculatePopupPosition(origin: HTMLElement, target: HTMLElement) {
  let $origin = $(origin);
  let $target = $(target);

  let originWidth: number = $origin.outerWidth();
  let originHeight: number = $origin.outerHeight();
  let viewportOffset = origin.getBoundingClientRect();
  let position = {
    left: Math.round(viewportOffset.left),
    top: Math.round(viewportOffset.top)
  }

  let popupWidth: number = $target.width();
  let outputLeft: number | string = position.left + originWidth / 2 - popupWidth / 2;
  let outputTop: number | string = position.top + originHeight + 15;
  let outputBottom: number | string = 'auto';
  let windowWidth: number = $(window).width();

  if ((outputLeft + popupWidth) > (windowWidth - 15)) {
    outputLeft = windowWidth - popupWidth - 15 + "px";
  } else if ((outputLeft < 15) ) {
    outputLeft = 15 + "px";
  }
  if ((outputTop + 300) > $(window).height()){
    outputTop = 'auto';
    outputBottom = $(window).height() - position.top + 15 + "px";
  } else {
    outputTop = outputTop + "px";
  }

  return {
    left: outputLeft,
    top: outputTop ,
    bottom: outputBottom,
  }
}

export function calculatePopupRelativePosition(origin: HTMLElement, target: HTMLElement, container?: HTMLElement) {
  const $origin = $(origin);
  const $target = $(target);
  const $container = $(container);

  const originWidth: number = $origin.outerWidth();
  const originHeight: number = $origin.outerHeight();
  const viewportOffset = origin.getBoundingClientRect();
  let OriginPosition = {
    left: Math.round(viewportOffset.left),
    top: Math.round(viewportOffset.top)
  }

  const popupWidth: number = $target.outerWidth();
  const popupHeight: number = $target.outerHeight();

  let containerWidth: number;
  let containerHeight: number;
  let containerPosition;

  let outputLeft: number;
  let outputTop: number;

  if (container) {
    containerWidth = $container.outerWidth();
    containerHeight = $container.outerHeight();
    containerPosition = {
      left: Math.round(container.getBoundingClientRect().left),
      top: Math.round(container.getBoundingClientRect().top)
    }
    OriginPosition = {
      left: OriginPosition.left - containerPosition.left,
      top: OriginPosition.top - containerHeight
    }
  } else {
    containerWidth = $(window).width();
    containerHeight = $(window).height()
  }

  outputLeft = OriginPosition.left + originWidth / 2 - popupWidth / 2;
  outputTop = OriginPosition.top + originHeight + 15;
  
  let XType;
  let YType;
  
  if ((outputLeft + popupWidth) > (containerWidth - 15)) {
    XType = 'right';
  } else if ((outputLeft < 15) ) {
    XType = 'left'
  } else {
    XType = 'center'
  }

  if ((outputTop + popupHeight + 15) > containerHeight){
    YType = 'top'
  } else {
    YType = 'bottom'
  }
  

  return {
    XType,
    YType,
  }
}