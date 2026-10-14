const arr = [
  { w: "2.0", id: 2 },
  { w: "", id: 3 },
  { w: "1.5", id: 4 },
  { w: "1.0", id: 1 },
];
arr.sort((a,b) => parseFloat(a.w) - parseFloat(b.w));
console.log(arr);
