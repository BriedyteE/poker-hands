import { comparePokerHands } from "./main.js";

test.each([
  { a: "2H 3H 4H 5H 6H", b: "KS AS TS QS JS", expected: -1 },
  { a: "2H 3H 4H 5H 6H", b: "AS AD AC AH JD", expected: 1 },
  { a: "AS AH 2H AD AC", b: "JS JD JC JH 3D", expected: 1 },
  { a: "2S AH 2H AS AC", b: "JS JD JC JH AD", expected: -1 },
  { a: "2S AH 2H AS AC", b: "2H 3H 5H 6H 7H", expected: 1 },
  { a: "AS 3S 4S 8S 2S", b: "2H 3H 5H 6H 7H", expected: 1 },
  { a: "2H 3H 5H 6H 7H", b: "2S 3H 4H 5S 6C", expected: 1 },
  { a: "2S 3H 4H 5S 6C", b: "3D 4C 5H 6H 2S", expected: 0 },
  { a: "2S 3H 4H 5S 6C", b: "AH AC 5H 6H AS", expected: 1 },
  { a: "2S 2H 4H 5S 4C", b: "AH AC 5H 6H AS", expected: -1 },
  { a: "2S 2H 4H 5S 4C", b: "AH AC 5H 6H 7S", expected: 1 },
  { a: "6S AD 7H 4S AS", b: "AH AC 5H 6H 7S", expected: -1 },
  { a: "2S AH 4H 5S KC", b: "AH AC 5H 6H 7S", expected: -1 },
  { a: "2S 3H 6H 7S 9C", b: "7H 3C TH 6H 9S", expected: -1 },
  { a: "4S 5H 6H TS AC", b: "3S 5H 6H TS AC", expected: 1 },
  { a: "2S AH 4H 5S 6C", b: "AD 4C 5H 6H 2C", expected: 0 },
])(".comparePokerHands($a, $b)", ({ a, b, expected }) => {
  const result = comparePokerHands(a, b);

  expect(result).toBe(expected);
});

test.each([
  { a: "5H 6H", b: "KS AS TS QS JS" },
  { a: "KS AS TS QS JS", b: "KS" },
  { a: "AS BH CH DS EC", b: "2S AH 4H 5S 6C" },
  { a: "AS BH CH DS EC", b: "1, 2, 3, 4, 5" },
  { a: "4S 5H 6H TS AC", b: "3Z 5Z 6Z TZ AZ" },
])(".comparePokerHands($a, $b)", ({ a, b }) => {
  const result = () => comparePokerHands(a, b);
  expect(result).toThrow(Error);
});
