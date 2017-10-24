export const timeout = (duration: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {resolve()}, duration);
  })
};