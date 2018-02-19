import $ from 'jquery';
import "reflect-metadata";

export function timeout(duration: number): Promise<{}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {resolve()}, duration);
  })
};

export function Get(randomData: string): PropertyDecorator {
  return (target, propertyKey: string) => {
    var _val = target[propertyKey];

    // property getter
    var getter = function () {
      return "Ragularuban(" + _val + ")";
    };

    // property setter
    var setter = function (newVal) {
      _val = newVal;
    };

    // Create new property with getter and setter
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    });
  }
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
    bottom: outputBottom
  }
}