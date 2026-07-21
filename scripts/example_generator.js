const specialExamples = {
  a: ['I need a minute to think about it.', 'Tôi cần một phút để nghĩ về việc đó.'],
  abandon: ["Please don't abandon the plan yet.", 'Xin đừng bỏ kế hoạch này vội.'],
  abandoned: ['The abandoned house looks quiet at night.', 'Ngôi nhà bị bỏ hoang trông rất yên ắng vào ban đêm.'],
  ability: ['She has the ability to explain things clearly.', 'Cô ấy có khả năng giải thích mọi thứ rõ ràng.'],
  able: ['Are you able to join the call today?', 'Hôm nay bạn có thể tham gia cuộc gọi không?'],
  about: ['Can we talk about your schedule?', 'Chúng ta có thể nói về lịch của bạn không?'],
  above: ['The apartment above us is very quiet.', 'Căn hộ phía trên chúng tôi rất yên tĩnh.'],
  abroad: ['My sister wants to study abroad next year.', 'Chị tôi muốn đi du học vào năm sau.'],
  absence: ['I noticed your absence at the meeting.', 'Tôi nhận ra sự vắng mặt của bạn trong cuộc họp.'],
  absent: ['Tom is absent from class today.', 'Tom vắng mặt trong lớp hôm nay.'],
  absolutely: ['I absolutely agree with you.', 'Tôi hoàn toàn đồng ý với bạn.'],
  accept: ['I accept your offer.', 'Tôi chấp nhận đề nghị của bạn.'],
  accident: ['I saw a small accident on the way home.', 'Tôi thấy một vụ tai nạn nhỏ trên đường về nhà.'],
  achieve: ['You can achieve your goal step by step.', 'Bạn có thể đạt mục tiêu từng bước một.'],
  across: ['The cafe is across the street.', 'Quán cà phê ở bên kia đường.'],
  act: ['Please act quickly if you need help.', 'Hãy hành động nhanh nếu bạn cần giúp đỡ.'],
  active: ['Try to stay active during the week.', 'Hãy cố gắng vận động trong tuần.'],
  actually: ['Actually, I have a better idea.', 'Thật ra, tôi có một ý hay hơn.'],
  add: ['Can you add my name to the list?', 'Bạn có thể thêm tên tôi vào danh sách không?'],
  address: ['Please send the address to me.', 'Vui lòng gửi địa chỉ cho tôi.'],
  advice: ['Thanks for your advice.', 'Cảm ơn lời khuyên của bạn.'],
  afraid: ["I'm afraid I can't come tonight.", 'Tôi e là tối nay tôi không thể đến.'],
  after: ["Let's meet after work.", 'Chúng ta gặp nhau sau giờ làm nhé.'],
  afternoon: ["I'll call you this afternoon.", 'Chiều nay tôi sẽ gọi cho bạn.'],
  again: ['Could you say that again?', 'Bạn có thể nói lại điều đó không?'],
  against: ["I'm not against your idea.", 'Tôi không phản đối ý tưởng của bạn.'],
  age: ['What age is your son?', 'Con trai bạn bao nhiêu tuổi?'],
  agree: ['I agree with your plan.', 'Tôi đồng ý với kế hoạch của bạn.'],
  air: ['I need some fresh air.', 'Tôi cần chút không khí trong lành.'],
  airport: ['We arrived at the airport early.', 'Chúng tôi đến sân bay sớm.'],
  all: ['All my friends are coming tonight.', 'Tất cả bạn bè tôi sẽ đến tối nay.'],
  'all right': ['Everything is all right now.', 'Mọi thứ bây giờ ổn rồi.'],
  allow: ['Please allow me to explain.', 'Vui lòng cho phép tôi giải thích.'],
  almost: ['I almost missed the bus.', 'Tôi suýt lỡ xe buýt.'],
  alone: ["I don't want to eat alone.", 'Tôi không muốn ăn một mình.'],
  already: ['I already sent the email.', 'Tôi đã gửi email rồi.'],
  also: ['I also want to join the trip.', 'Tôi cũng muốn tham gia chuyến đi.'],
  although: ['Although it rained, we still went out.', 'Mặc dù trời mưa, chúng tôi vẫn ra ngoài.'],
  always: ['She always arrives on time.', 'Cô ấy luôn đến đúng giờ.'],
  amazing: ['The food here is amazing.', 'Đồ ăn ở đây thật tuyệt.'],
  among: ['I found my keys among the papers.', 'Tôi tìm thấy chìa khóa giữa đống giấy tờ.'],
  answer: ['Please answer my question.', 'Vui lòng trả lời câu hỏi của tôi.'],
  anyone: ['Can anyone help me with this?', 'Có ai có thể giúp tôi việc này không?'],
  anything: ['Do you need anything else?', 'Bạn còn cần gì nữa không?'],
  apartment: ['My apartment is near the station.', 'Căn hộ của tôi gần nhà ga.'],
  appear: ['Your name will appear on the screen.', 'Tên của bạn sẽ xuất hiện trên màn hình.'],
  apply: ['I want to apply for this job.', 'Tôi muốn ứng tuyển công việc này.'],
  appointment: ['I have an appointment at three.', 'Tôi có một cuộc hẹn lúc ba giờ.'],
  area: ['This area is quiet at night.', 'Khu vực này yên tĩnh vào ban đêm.'],
  arrive: ['What time will you arrive?', 'Mấy giờ bạn sẽ đến?'],
  ask: ['Can I ask you a question?', 'Tôi có thể hỏi bạn một câu không?'],
  available: ['Are you available tomorrow morning?', 'Sáng mai bạn có rảnh không?'],
  away: ['I will be away for two days.', 'Tôi sẽ đi vắng hai ngày.'],
  bad: ['I had a bad day at work.', 'Tôi đã có một ngày tệ ở chỗ làm.'],
  bank: ['The bank closes at five.', 'Ngân hàng đóng cửa lúc năm giờ.'],
  beautiful: ['The weather is beautiful today.', 'Thời tiết hôm nay thật đẹp.'],
  because: ['I stayed home because I was tired.', 'Tôi ở nhà vì tôi mệt.'],
  before: ['Please call me before you leave.', 'Hãy gọi cho tôi trước khi bạn rời đi.'],
  begin: ["Let's begin the meeting.", 'Chúng ta bắt đầu cuộc họp nhé.'],
  believe: ['I believe you can do it.', 'Tôi tin bạn có thể làm được.'],
  better: ['I feel better today.', 'Hôm nay tôi thấy khỏe hơn.'],
  between: ['The cafe is between the bank and the hotel.', 'Quán cà phê nằm giữa ngân hàng và khách sạn.'],
  book: ['I bought a book for my trip.', 'Tôi mua một quyển sách cho chuyến đi.'],
  bring: ['Can you bring your laptop?', 'Bạn có thể mang laptop của bạn không?'],
  busy: ["I'm busy this morning.", 'Sáng nay tôi bận.'],
  buy: ['I need to buy some milk.', 'Tôi cần mua một ít sữa.'],
  call: ["I'll call you later.", 'Tôi sẽ gọi cho bạn sau.'],
  can: ['Can you help me?', 'Bạn có thể giúp tôi không?'],
  care: ['Take care on your way home.', 'Đi đường về nhà cẩn thận nhé.'],
  change: ['Can we change the time?', 'Chúng ta đổi giờ được không?'],
  choose: ['You can choose any seat.', 'Bạn có thể chọn bất kỳ chỗ ngồi nào.'],
  city: ['This city is busy at night.', 'Thành phố này nhộn nhịp vào ban đêm.'],
  clean: ['Please clean the table after lunch.', 'Vui lòng dọn bàn sau bữa trưa.'],
  close: ['Please close the door.', 'Vui lòng đóng cửa lại.'],
  coffee: ["Let's get coffee after work.", 'Tan làm mình đi uống cà phê nhé.'],
  come: ['Can you come here for a minute?', 'Bạn có thể đến đây một phút không?'],
  company: ['She works for a small company.', 'Cô ấy làm cho một công ty nhỏ.'],
  cost: ['How much does it cost?', 'Nó giá bao nhiêu?'],
  day: ['Have a nice day.', 'Chúc bạn một ngày tốt lành.'],
  decide: ['We need to decide today.', 'Chúng ta cần quyết định hôm nay.'],
  different: ['I want to try something different.', 'Tôi muốn thử thứ gì đó khác.'],
  difficult: ['This question is difficult.', 'Câu hỏi này khó.'],
  dinner: ["Let's have dinner together.", 'Chúng ta ăn tối cùng nhau nhé.'],
  do: ['What do you want to do now?', 'Bây giờ bạn muốn làm gì?'],
  easy: ['This app is easy to use.', 'Ứng dụng này dễ dùng.'],
  eat: ["Let's eat before the movie.", 'Chúng ta ăn trước khi xem phim nhé.'],
  email: ['Please send me an email.', 'Vui lòng gửi email cho tôi.'],
  enjoy: ['I enjoy talking with you.', 'Tôi thích nói chuyện với bạn.'],
  enough: ['Do we have enough time?', 'Chúng ta có đủ thời gian không?'],
  evening: ['I will see you this evening.', 'Tối nay tôi sẽ gặp bạn.'],
  every: ['I drink water every morning.', 'Tôi uống nước mỗi sáng.'],
  family: ['My family lives nearby.', 'Gia đình tôi sống gần đây.'],
  feel: ['How do you feel today?', 'Hôm nay bạn cảm thấy thế nào?'],
  find: ['I need to find my phone.', 'Tôi cần tìm điện thoại của mình.'],
  finish: ['I will finish this tonight.', 'Tối nay tôi sẽ hoàn thành việc này.'],
  food: ['The food smells good.', 'Đồ ăn có mùi thơm.'],
  friend: ['My friend is waiting outside.', 'Bạn tôi đang đợi bên ngoài.'],
  get: ['Can I get a glass of water?', 'Tôi có thể lấy một ly nước không?'],
  give: ['Please give me a minute.', 'Vui lòng cho tôi một phút.'],
  go: ["Let's go home.", 'Chúng ta về nhà thôi.'],
  good: ['That sounds like a good idea.', 'Nghe như một ý hay đấy.'],
  great: ['You did a great job.', 'Bạn đã làm rất tốt.'],
  happy: ["I'm happy to help.", 'Tôi rất vui được giúp.'],
  have: ['Do you have time today?', 'Hôm nay bạn có thời gian không?'],
  help: ['Can you help me with this?', 'Bạn có thể giúp tôi việc này không?'],
  home: ['I am going home now.', 'Bây giờ tôi đang về nhà.'],
  important: ['This meeting is important.', 'Cuộc họp này quan trọng.'],
  job: ['She found a new job.', 'Cô ấy tìm được công việc mới.'],
  know: ["I don't know the answer.", 'Tôi không biết câu trả lời.'],
  learn: ['I want to learn English every day.', 'Tôi muốn học tiếng Anh mỗi ngày.'],
  leave: ['What time do you leave work?', 'Mấy giờ bạn rời chỗ làm?'],
  like: ['I like this song.', 'Tôi thích bài hát này.'],
  listen: ['Please listen to me for a second.', 'Vui lòng nghe tôi một chút.'],
  look: ['Look at this photo.', 'Nhìn bức ảnh này này.'],
  make: ["Let's make a plan.", 'Chúng ta lập kế hoạch nhé.'],
  meeting: ['The meeting starts at nine.', 'Cuộc họp bắt đầu lúc chín giờ.'],
  money: ['I need to save more money.', 'Tôi cần tiết kiệm thêm tiền.'],
  morning: ['Good morning, how are you?', 'Chào buổi sáng, bạn khỏe không?'],
  need: ['I need your help.', 'Tôi cần bạn giúp.'],
  new: ['I bought a new phone.', 'Tôi đã mua một chiếc điện thoại mới.'],
  night: ['I sleep better at night.', 'Tôi ngủ ngon hơn vào ban đêm.'],
  open: ['Please open the window.', 'Vui lòng mở cửa sổ.'],
  people: ['Many people use this app.', 'Nhiều người dùng ứng dụng này.'],
  phone: ['My phone is on the table.', 'Điện thoại của tôi ở trên bàn.'],
  plan: ["Let's talk about the plan.", 'Chúng ta nói về kế hoạch nhé.'],
  problem: ['We can solve this problem together.', 'Chúng ta có thể cùng giải quyết vấn đề này.'],
  question: ['I have a quick question.', 'Tôi có một câu hỏi nhanh.'],
  ready: ['Are you ready to start?', 'Bạn sẵn sàng bắt đầu chưa?'],
  remember: ['Please remember to call me.', 'Vui lòng nhớ gọi cho tôi.'],
  room: ['The room is clean and bright.', 'Căn phòng sạch và sáng.'],
  say: ['What did you say?', 'Bạn đã nói gì?'],
  see: ['I will see you tomorrow.', 'Tôi sẽ gặp bạn ngày mai.'],
  send: ['Please send the file today.', 'Vui lòng gửi tập tin hôm nay.'],
  start: ["Let's start with the first question.", 'Chúng ta bắt đầu với câu hỏi đầu tiên nhé.'],
  take: ['Take your time.', 'Cứ từ từ nhé.'],
  talk: ['Can we talk after lunch?', 'Chúng ta nói chuyện sau bữa trưa được không?'],
  thank: ['I want to thank you for your help.', 'Tôi muốn cảm ơn bạn vì sự giúp đỡ.'],
  thing: ['This thing is useful.', 'Thứ này hữu ích.'],
  think: ['I think this is a good choice.', 'Tôi nghĩ đây là một lựa chọn tốt.'],
  time: ['What time is the meeting?', 'Cuộc họp lúc mấy giờ?'],
  today: ['I feel good today.', 'Hôm nay tôi thấy ổn.'],
  tomorrow: ['See you tomorrow.', 'Hẹn gặp bạn ngày mai.'],
  try: ["Let's try again.", 'Chúng ta thử lại nhé.'],
  understand: ["I don't understand this part.", 'Tôi không hiểu phần này.'],
  use: ['You can use my pen.', 'Bạn có thể dùng bút của tôi.'],
  wait: ['Please wait here.', 'Vui lòng đợi ở đây.'],
  want: ['I want a cup of tea.', 'Tôi muốn một tách trà.'],
  water: ['Can I have some water?', 'Tôi có thể xin chút nước không?'],
  way: ['This is the fastest way home.', 'Đây là đường về nhà nhanh nhất.'],
  week: ['I will be busy next week.', 'Tuần tới tôi sẽ bận.'],
  work: ['I have a lot of work today.', 'Hôm nay tôi có nhiều việc.'],
  write: ['Please write your name here.', 'Vui lòng viết tên bạn ở đây.'],
  yes: ['Yes, I can help you.', 'Vâng, tôi có thể giúp bạn.'],
  yesterday: ['I called you yesterday.', 'Tôi đã gọi cho bạn hôm qua.'],
};

function normalizeWord(word) {
  return String(word || '')
    .split(',')[0]
    .replace(/\([^)]*\)/g, '')
    .trim();
}

function startsWithVowelSound(word) {
  return /^[aeiou]/i.test(word);
}

function firstMeaning(meaning) {
  return String(meaning || '')
    .split(/[;,]/)[0]
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function detectTense(sentence) {
  if (/\b(will|going to)\b/i.test(sentence)) return 'Future Simple';
  if (/\b(yesterday|last|ago|called|bought|arrived|found|sent|went|had)\b/i.test(sentence)) {
    return 'Past Simple';
  }
  return 'Present Simple';
}

function buildExample(vocab) {
  const rawWord = String(vocab.word || '').trim();
  const word = normalizeWord(rawWord);
  const lower = word.toLowerCase();
  const pos = String(vocab.partOfSpeech || vocab.type || '').toLowerCase();
  const meaning = firstMeaning(vocab.meaningVi || vocab.meaning);

  if (specialExamples[lower]) {
    const [exampleSentence, exampleMeaning] = specialExamples[lower];
    return {
      exampleSentence,
      exampleMeaning,
      exampleTense: detectTense(exampleSentence),
    };
  }

  if (!word) {
    return {
      exampleSentence: 'Can you explain this word to me?',
      exampleMeaning: 'Bạn có thể giải thích từ này cho tôi không?',
      exampleTense: 'Present Simple',
    };
  }

  if (/\s/.test(word)) {
    const sentence = `I heard "${word}" in a conversation at work.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Tôi nghe cụm "${word}" trong một cuộc trò chuyện ở chỗ làm.`,
      exampleTense: 'Past Simple',
    };
  }

  if (pos.includes('v')) {
    const sentence = `I used "${word}" in a short English conversation today.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Hôm nay tôi đã dùng "${word}" trong một cuộc hội thoại tiếng Anh ngắn.`,
      exampleTense: 'Past Simple',
    };
  }

  if (pos.includes('adj')) {
    const sentence = `My friend said the room looked ${word}.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Bạn tôi nói căn phòng trông ${meaning || word}.`,
      exampleTense: 'Past Simple',
    };
  }

  if (pos.includes('adv')) {
    const sentence = `She used "${word}" while talking to me.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Cô ấy dùng "${word}" khi nói chuyện với tôi.`,
      exampleTense: 'Past Simple',
    };
  }

  if (pos.includes('prep')) {
    const sentence = `Put the bag ${word} the chair.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Đặt chiếc túi ${meaning || word} chiếc ghế.`,
      exampleTense: 'Present Simple',
    };
  }

  if (pos.includes('conj')) {
    const sentence = `I stayed home ${word} I felt tired.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Tôi ở nhà ${meaning || word} tôi thấy mệt.`,
      exampleTense: 'Past Simple',
    };
  }

  if (pos.includes('pron')) {
    const sentence = `${word[0].toUpperCase()}${word.slice(1)} can join us for lunch.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `${word} có thể ăn trưa cùng chúng tôi.`,
      exampleTense: 'Present Simple',
    };
  }

  if (pos.includes('det')) {
    const sentence = `I saw "${word}" in a simple English sentence.`;
    return {
      exampleSentence: sentence,
      exampleMeaning: `Tôi thấy "${word}" trong một câu tiếng Anh đơn giản.`,
      exampleTense: 'Past Simple',
    };
  }

  const sentence = `I heard the word "${word}" in a conversation today.`;
  return {
    exampleSentence: sentence,
    exampleMeaning: `Hôm nay tôi nghe từ "${word}" trong một cuộc trò chuyện.`,
    exampleTense: 'Past Simple',
  };
}

module.exports = { buildExample, normalizeWord };
