const cheak = (a, b) => {
  if (b.length - a.length != 1) return false;

  let flag = 0;
  let i = 0,
    j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] == b[j]) {
      i++;
      j++;
    } else {
      flag++;
      j++;
      if (flag > 1) return false;
    }
  }
  return true;
};

var longestStrChain = function(words) {
  const length = words.length;
  if (length < 2) {
    return 1;
  }
  words.sort((a, b) => a.length - b.length);

  const cache = new Array(length).fill(0);
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (cheak(words[i], words[j])) {
        cache[j] = Math.max(cache[i] + 1, cache[j]);
      }
    }
  }
  return Math.max(...cache) + 1;
};
console.log(longestStrChain(['bdca', 'bda', 'ca', 'dca', 'a']));
