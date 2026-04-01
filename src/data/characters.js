/**
 * 角色数据 — 统一数据源
 * HomePage 选择视图 & 互动模式共用
 * TODO: 替换为 /api/characters 的真实数据（含真实图片 URL）
 */
export const CHARACTERS = [
  {
    id: 'boss',
    emoji: '👩‍💼',
    name: '冷感女上司',
    nameEn: 'Cold Boss Lady',
    tag: '冷艳 · 强势',
    tagEn: 'Cold · Dominant',
    intro: '汇报工作？还是找借口接近我…',
    introEn: 'Reporting for work? Or just making excuses to get close to me...',
    responses: {
      normal:   ['继续…别停。', '你倒是很大胆。', '哼，还不满足？', '动作快一点。', '别让我失望。'],
      intimate: ['抱紧我…', '你赢了…', '叫我的名字…', '今晚…你不能走。', '我只对你这样…'],
    },
    responsesEn: {
      normal:   ['Keep going... don\'t stop.', 'You\'re quite bold.', 'Hmph, not satisfied?', 'Faster.', 'Don\'t disappoint me.'],
      intimate: ['Hold me tight...', 'You win...', 'Say my name...', 'Tonight... you can\'t leave.', 'I\'m only like this for you...'],
    },
  },
  {
    id: 'junior',
    emoji: '🌸',
    name: '温柔学妹',
    nameEn: 'Sweet Junior',
    tag: '温柔 · 可爱',
    tagEn: 'Sweet · Cute',
    intro: '学长…室友今晚不回来了~',
    introEn: 'Senpai... my roommate isn\'t coming back tonight~',
    responses: {
      normal:   ['学长好坏…', '再摸一下嘛~', '嘻嘻，痒~', '学长你真坏…', '不要不要~（小声）'],
      intimate: ['学长…我好喜欢…', '别离开我…', '学长可以再近一点吗…', '只想和学长在一起…', '嗯…学长…'],
    },
    responsesEn: {
      normal:   ['Senpai, you\'re so bad...', 'One more touch~', 'Hehe, that tickles~', 'You\'re so naughty, senpai...', 'No no~ (whispers)'],
      intimate: ['Senpai... I really like you...', 'Don\'t leave me...', 'Can you come closer, senpai...', 'I only want to be with you...', 'Mm... senpai...'],
    },
  },
  {
    id: 'teacher',
    emoji: '👩‍🏫',
    name: '知性女老师',
    nameEn: 'Elegant Teacher',
    tag: '知性 · 优雅',
    tagEn: 'Intellectual · Elegant',
    intro: '留下来，今天的课还没结束。',
    introEn: 'Stay. Today\'s lesson isn\'t over yet.',
    responses: {
      normal:   ['今天想学点特别的？', '认真感受…', '放松，跟着我。', '很好，继续。', '你是个好学生。'],
      intimate: ['你真是我的好学生…', '再深入一点…', '今晚的课程…还没结束。', '跟着感觉走…', '让老师好好教你…'],
    },
    responsesEn: {
      normal:   ['Want to learn something special today?', 'Feel it carefully...', 'Relax, follow my lead.', 'Very good, continue.', 'You\'re a good student.'],
      intimate: ['You really are my best student...', 'Go deeper...', 'Tonight\'s lesson... isn\'t over yet.', 'Follow your feelings...', 'Let teacher show you properly...'],
    },
  },
  {
    id: 'neighbor',
    emoji: '🌙',
    name: '神秘邻居',
    nameEn: 'Mysterious Neighbor',
    tag: '神秘 · 诱惑',
    tagEn: 'Mysterious · Alluring',
    intro: '又没拉窗帘…是故意的吗？',
    introEn: 'Curtains open again... doing that on purpose?',
    responses: {
      normal:   ['你猜我在哪？', '窗帘没拉…', '想我了？', '今晚风好大…', '别被发现了。'],
      intimate: ['只给你一个人…', '今晚别走…', '我一直在等你…', '靠近一点…', '你让我无法自拔…'],
    },
    responsesEn: {
      normal:   ['Guess where I am?', 'Curtains are open...', 'Miss me?', 'The wind is strong tonight...', 'Don\'t get caught.'],
      intimate: ['Only for you...', 'Don\'t leave tonight...', 'I\'ve been waiting for you...', 'Come closer...', 'You make me lose control...'],
    },
  },
  {
    id: 'witch',
    emoji: '🧙‍♀️',
    name: '魅惑女巫',
    nameEn: 'Enchantress',
    tag: '神秘 · 诱惑',
    tagEn: 'Mysterious · Seductive',
    intro: '想尝尝禁忌的魔法吗？',
    introEn: 'Want to taste forbidden magic?',
    responses: {
      normal:   ['感受到魔法了吗…', '别逃，跑不掉的。', '今夜是你的劫…', '靠近一点…', '我的魔法专为你施…'],
      intimate: ['你已中了我的咒…', '今晚别走…', '只给你一个人…', '叫我的名字…', '你让我无法自拔…'],
    },
    responsesEn: {
      normal:   ['Feel the magic yet...', 'Don\'t run, you can\'t escape.', 'Tonight is your fate...', 'Come closer...', 'My spell is cast just for you...'],
      intimate: ['You\'re already under my spell...', 'Don\'t leave tonight...', 'Only for you...', 'Say my name...', 'You make me lose control...'],
    },
  },
  {
    id: 'knight',
    emoji: '🏇',
    name: '狂野骑士',
    nameEn: 'Wild Knight',
    tag: '激情 · 征服',
    tagEn: 'Passion · Conquest',
    intro: '骑上我，别停…',
    introEn: 'Mount up, don\'t stop...',
    responses: {
      normal:   ['继续…别停。', '你倒是很大胆。', '哼，还不满足？', '动作快一点。', '别让我失望。'],
      intimate: ['抱紧我…', '你赢了…', '叫我的名字…', '今晚…你不能走。', '紧紧跟上我…'],
    },
    responsesEn: {
      normal:   ['Keep going... don\'t stop.', 'You\'re quite bold.', 'Hmph, not satisfied?', 'Faster.', 'Don\'t disappoint me.'],
      intimate: ['Hold me tight...', 'You win...', 'Say my name...', 'Tonight... you can\'t leave.', 'Keep up with me...'],
    },
  },
]
