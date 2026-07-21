export function isPlaceholderExample(example?: string | null) {
  return /^This is an example sentence using the word\s+".*"\.?$/i.test(
    example?.trim() ?? '',
  );
}

export function cleanExampleSentence(example?: string | null) {
  return isPlaceholderExample(example) ? '' : (example ?? '');
}

export function cleanExampleMeaning(meaning?: string | null) {
  return /^Đây là câu ví dụ mẫu sử dụng từ\s+".*"\.?$/i.test(
    meaning?.trim() ?? '',
  )
    ? ''
    : (meaning ?? '');
}
