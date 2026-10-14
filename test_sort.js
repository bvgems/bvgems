const arr = [
  { w: 1.5 },
  { w: "" },
  { w: 2.0 },
  { w: "" },
  { w: 1.0 },
  { w: "" },
  { w: 3.0 }
];

arr.sort((a, b) => parseFloat(a.w) - parseFloat(b.w));
console.log(arr);
