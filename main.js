const RANKS_ASC = "23456789TJQKA";
const SUITS = "SHDC";

const HAND_POINTS = {
  straightFlush: 9,
  fourOfKind: 8,
  fullHouse: 7,
  flush: 6,
  straight: 5,
  threeOfKind: 4,
  twoPairs: 3,
  pair: 2,
  highestCard: 1,
};

const count = (items) =>
  items.reduce((acc, item) => {
    const itemCount = acc[item] ? ++acc[item] : 1;
    return { ...acc, [item]: itemCount };
  }, {});

const getKeysSortedByDescValues = (item) =>
  Object.entries(item)
    .sort(([key1, value1], [key2, value2]) =>
      value1 === value2 ? key2 - key1 : value2 - value1
    )
    .map(([key, _value]) => Number(key));

const isValidHand = (cards) => {
  const isValidLength = cards.length === 5;
  const areValidValues = cards.every(
    (card) =>
      card.length === 2 &&
      RANKS_ASC.includes(card[0]) &&
      SUITS.includes(card[1])
  );

  return isValidLength && areValidValues;
};

const isStraight = (ranksDesc) =>
  ranksDesc.every((rank, i) => i === 0 || rank + 1 === ranksDesc[i - 1]);

const isFlush = (suits) => suits.every((suit) => suit === suits[0]);

const evaluateStraightFlush = (ranksDesc, suits) => {
  return isStraight(ranksDesc) && isFlush(suits)
    ? HAND_POINTS.straightFlush
    : null;
};

const evaluateSetsOfRanks = (countedRanks, countsToFind, points) => {
  const hasSetsOfRanks = countsToFind.every((count) =>
    Object.values(countedRanks).includes(count)
  );

  return hasSetsOfRanks ? points : null;
};

const evaluateFlush = (suits) => (isFlush(suits) ? HAND_POINTS.flush : null);

const evaluateStraight = (ranks) =>
  isStraight(ranks) ? HAND_POINTS.straight : null;

const evaluateTwoPairs = (countedRanks) => {
  const pairs = Object.values(countedRanks).filter(
    (rankCount) => rankCount === 2
  );

  return pairs.length === 2 ? HAND_POINTS.twoPairs : null;
};

const getHandResult = (cards) => {
  const suits = cards.map((card) => card[1]);
  const ranks = cards.map((card) => RANKS_ASC.indexOf(card[0]) + 2);

  const countedRanks = count(ranks);
  const sortedRanksByCount = getKeysSortedByDescValues(countedRanks);

  const points =
    evaluateStraightFlush(sortedRanksByCount, suits) ||
    evaluateSetsOfRanks(countedRanks, [4], HAND_POINTS.fourOfKind) ||
    evaluateSetsOfRanks(countedRanks, [3, 2], HAND_POINTS.fullHouse) ||
    evaluateFlush(suits) ||
    evaluateStraight(sortedRanksByCount) ||
    evaluateSetsOfRanks(countedRanks, [3], HAND_POINTS.threeOfKind) ||
    evaluateTwoPairs(countedRanks) ||
    evaluateSetsOfRanks(countedRanks, [2], HAND_POINTS.pair) ||
    HAND_POINTS.highestCard;

  return { points, tiebrakers: sortedRanksByCount };
};

const findWinnerWhenEqualPoints = (aTiebrakers, bTiebrakers) => {
  for (let i = 0; i < aTiebrakers.length; i++) {
    if (aTiebrakers[i] !== bTiebrakers[i]) {
      return aTiebrakers[i] > bTiebrakers[i] ? 1 : -1;
    }
  }

  return 0;
};

export function comparePokerHands(a, b) {
  const aCards = a.split(" ");
  const bCards = b.split(" ");

  if (!isValidHand(aCards) || !isValidHand(bCards)) {
    throw new Error();
  }

  const aHandResult = getHandResult(aCards);
  const bHandResult = getHandResult(bCards);

  if (aHandResult.points === bHandResult.points) {
    return findWinnerWhenEqualPoints(
      aHandResult.tiebrakers,
      bHandResult.tiebrakers
    );
  }

  return aHandResult.points > bHandResult.points ? 1 : -1;
}
