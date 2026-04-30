/**
 * Single source of truth for the 10 tracks of 聽見，福爾摩沙.
 * Extracted from the legacy index.html (wp0..wp9 × word0..word4).
 */

export type Track = {
  id: number;
  slug: string;
  title: string;
  theme: string;
  cover: string;
  audio: { mp3: string; ogg: string };
  /** word0 — overlay on the opening photo */
  intro: string;
  /** word1 — first chapter, scene */
  scene: string;
  /** word2 — second chapter, deep dive */
  detail: string;
  /** word3 — third chapter, closing */
  closing: string;
  /** word4 — final tagline ("請閉上眼睛 聽聽看…") */
  tagline: string;
  /** Story photos paired with each panel */
  photos: { p1: string; p2: string; p3: string };
};

const photo = (n: number) => ({
  p1: `/img/story_photo/photo${n}-1.jpg`,
  p2: `/img/story_photo/photo${n}-2.jpg`,
  p3: `/img/story_photo/photo${n}-3.jpg`,
});

const audio = (n: number) => ({
  mp3: `/audio/${n}.mp3`,
  ogg: `/audio/${n}.ogg`,
});

const cover = (n: number) => `/img/alb${n}.jpg`;

export const tracks: Track[] = [
  {
    id: 1,
    slug: 'letterpress',
    title: '活字印刷',
    theme: '文化',
    cover: cover(1),
    audio: audio(1),
    photos: photo(1),
    intro:
      '「喀拉喀拉」的齒輪傳動聲\n是活字印刷時的響聲\n曾經作為號角聲 帶動著文化前進',
    scene:
      '進入老舊的倉庫\n映入眼簾的是一幅巨型的「字畫」\n老師傅迅速找到我們所說的字\n驚嘆之餘看到在溝槽中零落的字\n意味著這些聲音或許已被時代遺忘',
    detail:
      '在沒有電腦的年代\n印刷不是件人人可以做的事\n專業的印刷店裡有兩三具活字印刷機\n不停地反覆印製表格、帖子\n光是聲音就很熱鬧了',
    closing:
      '規律的齒輪轉動聲 跟不上時代的齒輪速度\n剩下的只有零零散散的鉛塊\n這些聲音沉睡在北港的某間舊倉庫裡\n過不久可能就再也聽不到了',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣、屬於 文化 的聲音',
  },
  {
    id: 2,
    slug: 'blacksmith',
    title: '阿龍打鐵舖',
    theme: '工藝',
    cover: cover(2),
    audio: audio(2),
    photos: photo(2),
    intro:
      '規律的金屬敲擊聲\n陳日新老先生阿龍打鐵舖\n興城街現存唯一真正的「打鐵」店鋪',
    scene:
      '尾隨著固定頻率的聲聲震響\n找到了這最傳統的打鐵舖\n只一名身形消瘦的老先生\n重複著同樣卻又有些微差距的動作\n只為在一次次微調讓鑽頭更完美',
    detail:
      '打鐵是大量體力流失的工作\n待在高溫的火爐旁，長期吸進燒後的廢氣\n讓打鐵師傅經常有肺病，而腰部也不堪重負\n在今日更是無人承接此類苦勞',
    closing:
      '在一聲聲鋼與鐵相互敲擊的脆響\n彷彿聽到了師父鏗鏘不曲的堅持\n卻同時也聽到了無奈的嘆息聲',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣、屬於 工藝 的聲音',
  },
  {
    id: 3,
    slug: 'firecrackers',
    title: '呎炮',
    theme: '民間',
    cover: cover(3),
    audio: audio(3),
    photos: photo(3),
    intro:
      '轟隆隆的炮竹響徹雲霄\n這是廟會不可或缺的呎炮習俗\n炮聲、火光、灰煙\n呎炮承載著信徒的記憶',
    scene:
      '把長長一串紅鞭炮平躺\n橫亙在馬路間、神轎下\n在人群中倏地炸開\n聲響劃過天際、留下深深印記',
    detail:
      '廟會是台灣庶民文化中最重要的一環\n傳統的嗩吶、南北管樂器演奏出獨特的弦律\n道教文化中的神祉與習俗\n是台灣最豐富多元的文化盛宴',
    closing: '呎炮常綿延數里\n伴隨眾信徒的步伐\n隱含著消災、迎神的意義',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣、屬於 民間 的聲音',
  },
  {
    id: 4,
    slug: 'clocks',
    title: '鐘錶行',
    theme: '時間',
    cover: cover(4),
    audio: audio(4),
    photos: photo(4),
    intro: '此起彼落的鐘聲\n構成美妙的交響曲\n每天都在台南後壁',
    scene:
      '一間乍看不甚起眼的鐘表行\n牆上掛滿早期的鐘擺掛鐘\n每到整點，隨著第一聲鐘響\n就可以聽到機械敲打銅條的協奏曲',
    detail:
      '日據時代的台灣壁鐘\n逾三百年歷史的英、法古鐘\n這裡有著各式各樣的鐘\n這些全都是老闆殷瑞祥的寶貝',
    closing:
      '高齡八十六歲的殷瑞祥開店已超過六十年\n十五歲開始學習鐘表技術\n紮實的訓練讓他修復鐘表的手藝，聞名全台',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 時間 的聲音',
  },
  {
    id: 5,
    slug: 'conch',
    title: '牽罟海螺',
    theme: '漁村',
    cover: cover(5),
    audio: audio(5),
    photos: photo(5),
    intro:
      '滄海一聲海螺響\n村內的罟仔腳們魚貫而出\n赤腳踏浪 吆喝著 期待豐收',
    scene:
      '牽罟以風平浪靜的三月到十月間為主\n於漲潮時用漁筏將漁網帶到海中投放\n退潮時魚群陷落於網內\n在牽罟捕魚的日子\n各罟槽的負責人會到漁場等候\n等魚群出現時 就立刻吹「罟螺」招集罟仔腳來牽罟捕魚',
    detail:
      '作業時，由幾人乘罟仔船載罟網出海環繞半圈\n順序下網後 船再開回岸邊\n由一人入水牽網繩的另一端上岸後\n「罟腳」們排成兩排合力拖拉網繩的二端',
    closing:
      '「牽罟」是先人篳路藍縷與自然共存的回憶\n現在當我們聽著響徹海岸的螺聲\n似乎已經不見罟腳們為生活出門捕魚去的景象\n或許只是哪個遊客剛好吹出了聲響',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 漁村 的聲音',
  },
  {
    id: 6,
    slug: 'rice-dumpling',
    title: '燒肉粽',
    theme: '童年',
    cover: cover(6),
    audio: audio(6),
    photos: photo(6),
    intro:
      '小時候每到放學傍晚\n「燒～肉粽～～」\n中氣十足的召喚聲總隨著香氣傳遍大家小巷',
    scene: '載著熱騰騰肉粽的小機車\n後面總跟著一群興奮的孩童\n那是一種簡單知足的快樂',
    detail:
      '賣肉粽的阿伯打開熱騰騰的蒸籠\n眾人的期待化為笑靨\n蒸氣由籠內竄出\n讓肉粽多了點神祕美',
    closing:
      '終於香氣散去\n大夥捧著肉粽、手舞足蹈\n口齒留香之時\n總在盼望下一次「燒～肉粽～～」的叫賣聲',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 童年 的聲音',
  },
  {
    id: 7,
    slug: 'mian-cha',
    title: '麵茶攤',
    theme: '味覺',
    cover: cover(7),
    audio: audio(7),
    photos: photo(7),
    intro:
      '「逼─逼─逼─」熟悉的氣笛聲在清晨響起\n這是比公雞還早起的麵茶攤氣笛\n好似燒開水的熱水壺\n麵茶攤的聲響總能穿越鄰里',
    scene: '老闆熟練地抓起麵茶粉\n撒上芝麻、佐上麻醬與花椒\n倒入滾燙熱水\n剎那間煙霧迷漫、香味撲鼻',
    detail: '端著一碗糊糊香香的麵茶\n遠方的天空泛起魚肚白\n熱氣逼走陣陣寒意\n讓人肚子和心都暖暖的',
    closing: '麵茶一定要用最滾燙的熱水沖泡\n因此熱水壺的溫度總是很高\n也讓氣笛聲綿延不斷',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 味覺 的聲音',
  },
  {
    id: 8,
    slug: 'sugar-train',
    title: '五分車',
    theme: '阡陌',
    cover: cover(8),
    audio: audio(8),
    photos: photo(8),
    intro:
      '五分車是台糖運送蔗糖的小火車\n軌距僅有一般鐵路的一半而得名\n五分車走過台灣南部田野\n伴隨著蔗田、稻田與香蕉樹',
    scene:
      '雲林的虎尾糖廠\n留存著全台僅存仍在使用的五分車\n獨特的車體設計、運行聲與鳴笛\n是屬於所有糖廠人的回憶',
    detail: '從日治時代至今\n五分車的軌道彎彎長長\n在台灣的土地上留下甜甜的一條線',
    closing:
      '走在鐵路上、揹著一把木吉他\n火車是許多人的青春記憶\n而五分車更是台灣特有糖廠文化的遺跡\n在長長的軌道上慢慢運行',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 阡陌 的聲音',
  },
  {
    id: 9,
    slug: 'fish-auction',
    title: '糶手叫賣',
    theme: '糶手',
    cover: cover(9),
    audio: audio(9),
    photos: photo(9),
    intro:
      '「魚仔八十八十八十、百五百五百五...」\n黎明時分 叫賣聲像是一齣脫口秀\n在漁港旁的市場 激烈的上演著',
    scene:
      '作為買家和賣家間的仲介\n「糶(ㄊㄧㄠˋ)手」\n往往是老闆是否能獲利、顧客是否能划算的主因\n須掌握漁貨的重量及品質，天氣、節日、漁獲量等各種因素\n即便是現在，也僅止於磅秤的使用來避免爭端',
    detail:
      '深夜的叫賣、加上手提至少三十台斤以上漁貨\n糶手工作之吃力可想而知\n聲音之餘，糶手的手勢、記帳員使用的傳統代碼\n更是隱藏著漁市這個環境吸引人的地方',
    closing:
      '傳統的漁市場穿梭著討海人的身影\n更寫下台灣奮鬥不懈的精神\n與基隆海岸最美麗的風景',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 糶手 的聲音',
  },
  {
    id: 10,
    slug: 'puffed-rice',
    title: '爆米香',
    theme: '巷口',
    cover: cover(10),
    audio: audio(10),
    photos: photo(10),
    intro:
      '走訪台北城南常聽到一聲嚇人的巨響\n這是爆米香的獨特聲音\n「砰!」氣爆聲過後\n空氣中便瀰漫濃濃的米香',
    scene: '爆米香是台灣傳統的點心\n更是東方的爆米花\n記錄著台灣巷口文化的變遷',
    detail:
      '爆米香是以稻米為主材\n放入壓力爐加熱加壓\n打開爐前的一句閩南話\n「要爆阿!」\n伴隨著壓力釋放的轟然巨響',
    closing: '爆米香常切為條狀\n有些還加入花生芝麻等口味\n是尋常卻富有滋味的小吃',
    tagline: '請閉上眼睛\n聽聽看\n這是屬於台灣，屬於 巷口 的聲音',
  },
];
