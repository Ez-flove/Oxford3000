const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../layout_text.txt'), 'utf-8');
const lines = content.split('\n');

const vocabularies = [];
let currentItem = null;

// Bộ lọc các dòng rác quảng cáo, footer, header
const blacklistPatterns = [
  /Oxford 3000TM/i,
  /3000 TỪ VỰNG TIẾNG ANH THÔNG DỤNG NHẤT/i,
  /Trang \d+/i,
  /http/i,
  /www\./i,
  /facebook/i,
  /youtube/i,
  /google/i,
  /eefc/i,
  /effortless/i,
  /community/i,
  /fanclub/i
];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Bỏ qua dòng rác quảng cáo
  if (blacklistPatterns.some(rx => rx.test(line)) || line.trim() === '') {
    continue;
  }

  // Bỏ qua dòng header cột
  if (line.includes('No.') && line.includes('Word') && line.includes('Meaning')) {
    continue;
  }

  // Tiền xử lý số thứ tự
  line = line.replace(/^(\s*\d+)\s(\S)/, '$1  $2');

  const tokens = [];
  const regex = /\S+(?:\s\S+)*(?=\s{2,}|$)/g;
  let match;
  
  while ((match = regex.exec(line)) !== null) {
    const text = match[0];
    const startIndex = match.index;
    tokens.push({ text, startIndex });
  }

  if (tokens.length === 0) continue;

  let rowNo = null;
  let rowWord = null;
  let rowType = null;
  let rowPronounce = null;
  let rowMeaning = null;

  for (const token of tokens) {
    const { text, startIndex } = token;

    if (startIndex < 8) {
      rowNo = text;
    } else if (startIndex >= 8 && startIndex < 26) {
      rowWord = text;
    } else if (startIndex >= 26 && startIndex < 43) {
      rowType = text;
    } else if (startIndex >= 43 && startIndex < 55) {
      rowPronounce = text;
    } else {
      rowMeaning = text;
    }
  }

  const isNumber = rowNo && /^\d+$/.test(rowNo.trim());

  if (isNumber) {
    if (currentItem) {
      vocabularies.push(currentItem);
    }

    currentItem = {
      no: parseInt(rowNo.trim(), 10),
      word: rowWord ? rowWord.trim() : '',
      type: rowType ? rowType.trim() : '',
      pronounce: rowPronounce ? rowPronounce.trim() : '',
      meaningPieces: rowMeaning ? [rowMeaning.trim()] : []
    };
  } else {
    if (currentItem) {
      if (rowWord) currentItem.word += ' ' + rowWord.trim();
      if (rowType) currentItem.type += ' ' + rowType.trim();
      if (rowPronounce) currentItem.pronounce += ' ' + rowPronounce.trim();
      if (rowMeaning) currentItem.meaningPieces.push(rowMeaning.trim());
    }
  }
}

if (currentItem) {
  vocabularies.push(currentItem);
}

const vnDiacritics = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;

vocabularies.forEach(vocab => {
  vocab.meaning = vocab.meaningPieces.join(' ').replace(/\s+/g, ' ').trim();
  delete vocab.meaningPieces;
  vocab.word = vocab.word.trim();
  vocab.type = vocab.type.trim();
  vocab.pronounce = vocab.pronounce.trim();

  // Sửa lỗi nếu nghĩa bị dính vào phần phát âm (như từ 838 difference)
  if (!vocab.meaning && vnDiacritics.test(vocab.pronounce)) {
    const words = vocab.pronounce.split(' ');
    let splitIndex = -1;
    for (let j = 0; j < words.length; j++) {
      if (vnDiacritics.test(words[j])) {
        splitIndex = j;
        break;
      }
    }
    if (splitIndex !== -1) {
      vocab.meaning = words.slice(splitIndex).join(' ');
      vocab.pronounce = words.slice(0, splitIndex).join(' ');
    }
  }
});

// Ghi dữ liệu sạch vào tệp JSON chính thức
fs.writeFileSync(
  path.join(__dirname, '../vocabularies_clean.json'),
  JSON.stringify(vocabularies, null, 2),
  'utf-8'
);

console.log(`Đã hoàn tất trích xuất!`);
console.log(`Tổng số từ vựng: ${vocabularies.length}`);
console.log(`Kiểm tra mẫu từ số 3396:`, vocabularies.find(v => v.no === 3396));
