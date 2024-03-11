function diffStrings(a, b) {
    let i = 0;
    while (i < a.length && a[i] === b[i]) {
        i++;
    }
    let j = a.length - 1;
    let k = b.length - 1;
    while (j >= 0 && k >= 0 && a[j] === b[k]) {
        j--;
        k--;
    }
    return [i, j, k];
}

module.exports = diffStrings;