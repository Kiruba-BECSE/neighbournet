const STOPWORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'has', 'have', 'our', 'we', 'i', 'and', 'of', 'for', 'since', 'there']);

const tokenize = (text) =>
  text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));

const jaccardSimilarity = (textA, textB) => {
  const setA = new Set(tokenize(textA));
  const setB = new Set(tokenize(textB));
  const intersection = new Set([...setA].filter(w => setB.has(w)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
};

module.exports = { jaccardSimilarity };