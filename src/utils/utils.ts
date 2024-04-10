export const arrayRemove = (arr: any[], value: any) => {
  return arr.filter(function (ele) {
    return ele != value;
  });
};
