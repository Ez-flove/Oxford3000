"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlaceholderExample = isPlaceholderExample;
exports.cleanExampleSentence = cleanExampleSentence;
exports.cleanExampleMeaning = cleanExampleMeaning;
function isPlaceholderExample(example) {
    return /^This is an example sentence using the word\s+".*"\.?$/i.test(example?.trim() ?? '');
}
function cleanExampleSentence(example) {
    return isPlaceholderExample(example) ? '' : (example ?? '');
}
function cleanExampleMeaning(meaning) {
    return /^Đây là câu ví dụ mẫu sử dụng từ\s+".*"\.?$/i.test(meaning?.trim() ?? '')
        ? ''
        : (meaning ?? '');
}
//# sourceMappingURL=example-utils.js.map