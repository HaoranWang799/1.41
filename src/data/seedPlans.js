/**
 * seedPlans.js — 10 个本地固定训练计划模板
 * 在 AI 响应前或网络异常时作为兜底展示
 */
export const seedPlans = [
  {
    source: 'fixed',
    summary: '今日体力消耗适中，建议补充优质蛋白与适量有氧，帮助肌肉恢复并提升下次耐力表现。',
    dietFocus: '高蛋白恢复',
    dietSuggestions: [
      { name: '鸡胸肉', benefit: '低脂高蛋白，加速肌肉合成修复' },
      { name: '鸡蛋', benefit: '必需氨基酸齐全，促进体力恢复' },
      { name: '希腊酸奶', benefit: '含乳清蛋白，补充益生菌助消化' },
      { name: '糙米', benefit: '慢消化碳水，持续供能防疲劳' },
    ],
    exerciseSuggestions: [
      { name: '慢跑', plan: '30 分钟 / 配速 6:00', reason: '提升心肺耐力，加速代谢废物排出' },
      { name: '深蹲', plan: '4 组 × 12 次', reason: '强化下肢力量，改善盆底稳定性' },
      { name: '平板支撑', plan: '3 组 × 45 秒', reason: '核心稳定训练，保护腰椎' },
    ],
    vibrationSuggestion: { mode: '脉冲波', freq: 8, reason: '温和频率帮助肌肉放松，减少疲劳积累' },
    recoveryTips: [
      '运动后 30 分钟内补充蛋白质效果最佳',
      '保证 7–8 小时深度睡眠，修复最关键',
      '多喝水，每千克体重补充 30ml',
    ],
  },
  {
    source: 'fixed',
    summary: '本次强度偏高，身体处于亢奋状态，今日以恢复为主，避免二次高强度刺激，注重拉伸与补水。',
    dietFocus: '抗炎消肿',
    dietSuggestions: [
      { name: '三文鱼', benefit: 'Omega-3 丰富，抗炎效果显著' },
      { name: '蓝莓', benefit: '花青素抗氧化，减少肌肉损伤' },
      { name: '菠菜', benefit: '含镁元素，缓解肌肉痉挛' },
      { name: '牛油果', benefit: '健康脂肪，稳定激素水平' },
    ],
    exerciseSuggestions: [
      { name: '瑜伽拉伸', plan: '20 分钟全身拉伸', reason: '恢复肌肉弹性，防止延迟性酸痛' },
      { name: '泡沫轴按摩', plan: '10 分钟目标肌群', reason: '改善血液循环，加速乳酸代谢' },
      { name: '冷热水交替', plan: '3 轮 / 各 30 秒', reason: '促进血管收缩扩张，消炎消肿' },
    ],
    vibrationSuggestion: { mode: '稳定波', freq: 4, reason: '超低频舒缓模式，帮助神经系统平静' },
    recoveryTips: [
      '今日避免咖啡因，防止睡眠质量下降',
      '泡脚 15 分钟有效促进下肢血液回流',
      '深呼吸练习可降低皮质醇水平 20%+',
    ],
  },
  {
    source: 'fixed',
    summary: '时长偏短但质量不错，下次可适当延长热身时间。今日补充碳水与适量力量训练，为下次蓄力。',
    dietFocus: '能量补充',
    dietSuggestions: [
      { name: '香蕉', benefit: '快速补糖，富含钾预防肌肉痉挛' },
      { name: '燕麦', benefit: '复合碳水持续供能，控血糖平稳' },
      { name: '坚果', benefit: '健康脂肪与维生素 E，保护细胞' },
      { name: '全麦面包', benefit: '优质碳水，配合蛋白质促合成' },
    ],
    exerciseSuggestions: [
      { name: '跳绳', plan: '3 组 × 3 分钟', reason: '全身协调性训练，提升心肺效率' },
      { name: '哑铃卧推', plan: '3 组 × 10 次', reason: '胸部力量增强，改善姿态' },
      { name: '弓步蹲', plan: '3 组 × 12 步', reason: '髋屈肌灵活性与下肢平衡提升' },
    ],
    vibrationSuggestion: { mode: '渐进波', freq: 10, reason: '逐步增强频率刺激，为下次热身铺垫' },
    recoveryTips: [
      '力量训练后 12 小时内避免再次高强度运动',
      '拉伸每组保持 30 秒以上效果最佳',
      '晨起空腹补充蛋白粉可加速合成代谢',
    ],
  },
  {
    source: 'fixed',
    summary: '状态评分良好，持续保持规律节奏。今日可做轻量有氧配合核心训练，维持当前良好状态。',
    dietFocus: '均衡维持',
    dietSuggestions: [
      { name: '鸡蛋 + 蔬菜', benefit: '完整营养素搭配，维持能量均衡' },
      { name: '豆腐', benefit: '植物蛋白，低负担高营养密度' },
      { name: '西红柿', benefit: '番茄红素抗氧化，保护心血管' },
      { name: '橙子', benefit: '维C充足，增强免疫力与铁吸收' },
    ],
    exerciseSuggestions: [
      { name: '骑行', plan: '40 分钟 / 中等阻力', reason: '关节友好型有氧，高效燃脂' },
      { name: '俯卧撑', plan: '4 组 × 15 次', reason: '上肢推力增强，激活胸肩肌群' },
      { name: '悬挂举腿', plan: '3 组 × 12 次', reason: '下腹强化，改善盆底功能' },
    ],
    vibrationSuggestion: { mode: '律动波', freq: 12, reason: '中频律动提升感觉敏锐度与内核肌群协调' },
    recoveryTips: [
      '状态良好时可适当增加训练量 10–15%',
      '睡前拉伸配合腹式呼吸帮助副交感激活',
      '记录训练日记，追踪进步趋势',
    ],
  },
  {
    source: 'fixed',
    summary: '检测到疲劳信号，今日建议完全主动恢复。充分休息比强撑训练更能提升长期表现。',
    dietFocus: '深度修复',
    dietSuggestions: [
      { name: '骨汤', benefit: '胶原蛋白与电解质，修复结缔组织' },
      { name: '红枣 + 枸杞', benefit: '气血双补，舒缓肾上腺疲劳' },
      { name: '核桃', benefit: 'Omega-3 与褪黑素前体，改善睡眠' },
      { name: '南瓜', benefit: '色氨酸促进血清素合成，稳定情绪' },
    ],
    exerciseSuggestions: [
      { name: '散步', plan: '20–30 分钟轻松步行', reason: '促进血液循环，不加重肌肉负担' },
      { name: '呼吸练习', plan: '4-7-8 呼吸法 × 5 轮', reason: '激活副交感神经，快速降低压力' },
      { name: '冥想放松', plan: '10 分钟正念冥想', reason: '减少皮质醇分泌，加速疲劳消退' },
    ],
    vibrationSuggestion: { mode: '微振舒缓', freq: 2, reason: '极低频微振，放松深层筋膜与神经' },
    recoveryTips: [
      '疲劳时强行训练会增加受伤风险 3 倍',
      '今晚争取 9 小时睡眠，生长激素分泌峰值在深睡期',
      '按摩足底反射区 10 分钟可缓解全身疲劳感',
    ],
  },
  {
    source: 'fixed',
    summary: '激烈度偏高，心率区间较长。今日重点加强心肺基础训练，同时注重髋关节灵活性改善。',
    dietFocus: '心肺强化',
    dietSuggestions: [
      { name: '甜菜根', benefit: '一氧化氮促进血管扩张，提升耐力' },
      { name: '西瓜', benefit: '瓜氨酸缓解肌肉酸痛，补充水分' },
      { name: '黑巧克力', benefit: '黄烷醇改善心血管功能，抗疲劳' },
      { name: '菜花', benefit: '维 C 与抗氧化剂护心血管' },
    ],
    exerciseSuggestions: [
      { name: 'HIIT 间歇跑', plan: '6 组 / 40 秒冲刺 + 20 秒休息', reason: '最高效提升 VO2max 的训练方式' },
      { name: '髋关节画圆', plan: '每侧 20 次 × 3 组', reason: '增加髋关节活动度，减少代偿' },
      { name: '侧卧蚌式开合', plan: '3 组 × 15 次', reason: '激活臀中肌，改善骨盆稳定' },
    ],
    vibrationSuggestion: { mode: '心跳同频波', freq: 15, reason: '与心率同步的频率有助于入流状态' },
    recoveryTips: [
      '高强度后 48 小时内避免同肌群再训练',
      '补充维生素 C 1000mg 可降低运动免疫抑制',
      '热水浴 15 分钟扩张血管，加速代谢物排出',
    ],
  },
  {
    source: 'fixed',
    summary: '近期规律性良好，建议今日增加柔韧性训练比例，提升整体关节活动范围和运动质量。',
    dietFocus: '关节养护',
    dietSuggestions: [
      { name: '海鱼', benefit: 'EPA/DHA 减少关节炎症，润滑软骨' },
      { name: '姜黄', benefit: '姜黄素强效抗炎，媲美部分 NSAIDs' },
      { name: '石榴汁', benefit: '鞣花酸缓解关节炎症与疼痛' },
      { name: '菠萝', benefit: '菠萝蛋白酶加速关节积液吸收' },
    ],
    exerciseSuggestions: [
      { name: '动态拉伸热身', plan: '10 分钟全身关节激活', reason: '降低运动伤害风险，提升表现' },
      { name: 'PNF 拉伸', plan: '每组 6 秒收缩 + 30 秒拉伸', reason: '神经肌肉拉伸技术，效率最高' },
      { name: '泡沫轴滚压', plan: '重点部位各 60 秒', reason: '松解筋膜粘连，恢复肌肉弹性' },
    ],
    vibrationSuggestion: { mode: '波浪律动', freq: 7, reason: 'θ 波频率范围，促进筋膜松弛与深层拉伸' },
    recoveryTips: [
      '关节弹响不一定有害，但持续疼痛须就医',
      '晨起关节僵硬多为正常，热身后通常缓解',
      '每周 2 次专项柔韧训练效果优于每日 5 分钟',
    ],
  },
  {
    source: 'fixed',
    summary: '硬度评分突出，今日可强化盆底与核心稳定性训练，巩固优势并延长高质量表现时间。',
    dietFocus: '激素平衡',
    dietSuggestions: [
      { name: '牡蛎', benefit: '锌含量最高，直接支持睾酮合成' },
      { name: '菠菜', benefit: '镁提升睾酮总量 24%（研究数据）' },
      { name: '大蒜', benefit: '含蒜素降低皮质醇，间接提升睾酮' },
      { name: '有机蛋黄', benefit: '天然胆固醇是激素合成原料' },
    ],
    exerciseSuggestions: [
      { name: '凯格尔训练', plan: '快缩 10 次 + 慢缩 10 秒 × 5 组', reason: '核心盆底激活，维持与提升硬度' },
      { name: '壶铃摆动', plan: '4 组 × 15 次', reason: '臀大肌与核心爆发力同步训练' },
      { name: '桥式支撑', plan: '3 组 × 20 次', reason: '臀桥激活盆底肌群，改善勃起功能' },
    ],
    vibrationSuggestion: { mode: '高强节拍', freq: 18, reason: '高频刺激提升局部神经兴奋性与感知度' },
    recoveryTips: [
      '充足锌摄入是维持睾酮水平的关键微量元素',
      '过度手淫会短暂降低多巴胺受体敏感性，建议适度',
      '冷水澡可提升睾酮水平约 15%，坚持 30 天效果明显',
    ],
  },
  {
    source: 'fixed',
    summary: '本次使用时间超过平均水平，消耗较大，建议今日补充充足睡眠与营养，明日可期待更佳状态。',
    dietFocus: '睡眠优化',
    dietSuggestions: [
      { name: '樱桃', benefit: '天然褪黑素来源，改善睡眠节律' },
      { name: '牛奶', benefit: '色氨酸+钙质，促进血清素与褪黑素' },
      { name: '杏仁', benefit: '镁松弛神经肌肉，帮助入睡' },
      { name: '甘菊茶', benefit: '芹菜素与 GABA 受体结合，镇静安神' },
    ],
    exerciseSuggestions: [
      { name: '睡前拉伸', plan: '15 分钟全身放松拉伸', reason: '降低交感神经活性，加速入睡' },
      { name: '冥想扫描', plan: '10 分钟身体扫描冥想', reason: '系统性放松肌肉，减少夜间觉醒' },
      { name: '温水足浴', plan: '40℃ 水温浸泡 15 分钟', reason: '促进外周血液循环，辅助核心降温入眠' },
    ],
    vibrationSuggestion: { mode: 'δ 慢波', freq: 1, reason: '与深度睡眠 delta 波同频，辅助深睡转换' },
    recoveryTips: [
      '睡前 2 小时停止使用屏幕，蓝光抑制褪黑素分泌',
      '房间温度 18–20℃ 是最佳睡眠温度区间',
      '一致的就寝时间比睡够小时数更重要',
    ],
  },
  {
    source: 'fixed',
    summary: '数据显示近期状态波动较大，建议建立更规律的使用节奏，稳定的节律对提升整体健康评分最有效。',
    dietFocus: '规律节律',
    dietSuggestions: [
      { name: '深绿蔬菜', benefit: '叶绿素与铁质改善血氧携载能力' },
      { name: '糙米饭', benefit: '稳定血糖，避免能量大幅波动' },
      { name: '豆类', benefit: '植物蛋白与纤维，维持肠道节律' },
      { name: '黑芝麻', benefit: '铁+锌+维E三重营养，滋养肾精' },
    ],
    exerciseSuggestions: [
      { name: '固定时间跑步', plan: '每天同一时间 25 分钟', reason: '训练生物钟节律，建立稳定激素分泌节奏' },
      { name: '序列瑜伽', plan: '同一套拜日式 × 5 轮', reason: '规律动作模式强化神经肌肉记忆' },
      { name: '呼吸节律训练', plan: '4-4-4-4 方形呼吸 × 5 分钟', reason: '调频自主神经系统，建立稳定内环境' },
    ],
    vibrationSuggestion: { mode: '节律脉冲', freq: 6, reason: '6Hz 对应 theta/alpha 交界，平衡兴奋与放松' },
    recoveryTips: [
      '节律比强度更重要，规律训练三个月效果超过间歇性爆发',
      '用手机固定提醒建立训练与休息时间表',
      '追踪连续训练天数，用打卡机制强化坚持动力',
    ],
  },
]
