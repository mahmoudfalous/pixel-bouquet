export type AnimationConfig = {
  entrance: {
    scale: number[];
    translateY: number[];
    rotate: number[];
    easing: string;
    duration: number;
  };
  idle: {
    translateY: number[];
    rotate: number[];
    scale?: number[];
    duration: number;
    easing: string;
  };
};

export type Bouquet = {
  id: string;
  name: string;
  description: string;
  meaning: string;
  story: string;
  image: string;
  animation: AnimationConfig;
};

export const BOUQUETS: Bouquet[] = [
  {
    id: '1',
    name: 'Quiet Love',
    description: 'ورد بينك هادي ومريح للعين، في نصه زهور جيبسوفيلا رقيقة جداً.',
    meaning: 'بترمز للحب الهادي اللي ملوش صوت عالي، والإعجاب الصادق، والبدايات الحلوة اللي كلها أمل.',
    story: 'الورد البينك (الوردي) كان بيُستخدم من عصور قديمة للتعبير عن الرقة والامتنان، ومع زهور الجيبسوفيلا (نَفَس الطفل) اللي بتمثل البراءة، الباقة دي بتعتبر رسالة هادية جداً معناها "أنا مقدر وجودك" أو "دي بداية جديدة صافية".',
    image: '/Quiet Love Bouquet.png',
    animation: {
      entrance: { scale: [0, 1], translateY: [50, 0], rotate: [-10, 0], duration: 2500, easing: 'easeOutElastic(1, .6)' },
      idle: { translateY: [-8, 8], rotate: [-2, 2], duration: 4000, easing: 'easeInOutSine' }
    }
  },
  {
    id: '2',
    name: 'Pink Elegance',
    description: 'تنسيقة شيك جداً من الورد البينك وزنابق الليليوم.',
    meaning: 'الورد البينك بيعبر عن الامتنان والرقة، أما الليليوم فبيرمز للنقاء والجمال اللي يخطف العين.',
    story: 'زنابق الليليوم معروفة في التاريخ القديم كرمز للجمال الفائق والنقاء، ولما بتندمج مع الورد البينك، بتكوّن رسالة معناها "أنت شخص نادر وغالي". بتُقدم غالباً للتعبير عن الاحترام العميق أو الإعجاب الراقي.',
    image: '/Pink Roses & Lilies Flowers.png',
    animation: {
      entrance: { scale: [0.5, 1], translateY: [30, 0], rotate: [15, 0], duration: 2000, easing: 'easeOutExpo' },
      idle: { translateY: [-12, 12], rotate: [-1, 1], duration: 3500, easing: 'easeInOutQuad' }
    }
  },
  {
    id: '3',
    name: 'Crimson Fantasy',
    description: 'باقة فخمة جداً من الورد الأحمر الغامق.',
    meaning: 'بتجسد الرومانسية لأبعد حدود، العاطفة القوية، والحب اللي بيعيش ومابيدبلش.',
    story: 'الورد الأحمر الغامق هو الرمز الكلاسيكي العالمي للمشاعر القوية. في لغة الزهور، درجة اللون دي بالذات بترمز للعمق والصدق الثابت. بتُقدم كرسالة واضحة ومباشرة معناها "مشاعري حقيقية ومابتتغيرش".',
    image: '/100 Red Roses.png',
    animation: {
      entrance: { scale: [0, 1.1, 1], translateY: [40, 0], rotate: [-5, 5, 0], duration: 1800, easing: 'easeOutQuint' },
      idle: { scale: [1, 1.05], translateY: [0, 0], rotate: [0, 0], duration: 1200, easing: 'easeInOutSine' }
    }
  },
  {
    id: '4',
    name: 'Sunlit Chrysanthemum',
    description: 'أزهار الأقحوان الدافية والمبهجة.',
    meaning: 'بتنشر التفاؤل والبهجة في المكان، وبترمز للسند الحقيقي والفرحة اللي مابتخلصش.',
    story: 'زهرة الأقحوان (الكريسنتيموم) بتحظى بمكانة كبيرة في الثقافات الآسيوية كرمز للشمس، السعادة، وطول العمر. الباقة دي بتُقدم كرسالة كلها طاقة إيجابية معناها "أتمنى لك الفرح دايماً" أو "أنا فخور بيك".',
    image: '/Sunlit Chrysanthemum.png',
    animation: {
      entrance: { scale: [0, 1], translateY: [-50, 0], rotate: [180, 0], duration: 2200, easing: 'easeOutElastic(1, .8)' },
      idle: { translateY: [-5, 5], rotate: [-4, 4], duration: 3000, easing: 'easeInOutBack' }
    }
  },
  {
    id: '5',
    name: 'Ombre Mixed Roses',
    description: 'ميكس ألوان متدرج بيخطف القلب من جماله.',
    meaning: 'بتمثل التناغم والانسجام، وبتجمع بين جنون الحب ورقة المشاعر.',
    story: 'مزج ألوان الورد بيعتبر فن في لغة الزهور للتعبير عن المشاعر المركبة والمتناغمة. التدرج في الألوان هنا بيمثل توازن العلاقات. بتُقدم كرسالة معناها "علاقتنا مميزة وغالية بكل تفاصيلها".',
    image: '/Ombre Mixed Roses.png',
    animation: {
      entrance: { scale: [0.8, 1], translateY: [60, 0], rotate: [-20, 0], duration: 2500, easing: 'easeOutCirc' },
      idle: { translateY: [-10, 10], rotate: [-3, 3], duration: 4500, easing: 'easeInOutSine' }
    }
  },
  {
    id: '6',
    name: 'Carnation Harmony',
    description: 'تنسيقة رايقة لايقة على بعضها من القرنفل والورد.',
    meaning: 'بتجمع بين الإعجاب الشديد والافتتان، مع الورد اللي بيأكد على العاطفة الحقيقية.',
    story: 'القرنفل من أقدم الزهور اللي تمت زراعتها، وكان بيتسمى "زهرة الآلهة" عند الإغريق. بيرمز للافتتان والتميز. اندماجه مع الورد بيخليه رسالة معناها "أنا معجب بشخصيتك وبوجودك جداً".',
    image: '/Carnation Rose Harmony.png',
    animation: {
      entrance: { scale: [0, 1], translateY: [100, 0], rotate: [10, -5, 0], duration: 2000, easing: 'easeOutElastic(1, .5)' },
      idle: { translateY: [-15, 15], rotate: [-5, 5], duration: 5000, easing: 'easeInOutCubic' }
    }
  },
  {
    id: '7',
    name: 'Classic Carnations',
    description: 'باقة كلاسيكية من القرنفل اللي مليان حيوية.',
    meaning: 'بتعتبر رمز للحب الصافي، الاهتمام اللي مابيقلش، والوفاء اللي بيعيش سنين.',
    story: 'القرنفل معروف بمدى قوة احتماله وعمره الطويل بعد القطف، وعشان كده ارتبط دايماً بالوفاء الدائم والاهتمام اللي مابيقلش. بتُقدم كرسالة أمان معناها "أنا دايماً هنا جنبك وفي ضهرك".',
    image: '/Carnation Roses Bouquet.png',
    animation: {
      entrance: { scale: [0.2, 1], translateY: [20, 0], rotate: [0, 0], duration: 1500, easing: 'easeOutQuart' },
      idle: { translateY: [-6, 6], rotate: [-1, 1], duration: 2800, easing: 'easeInOutQuad' }
    }
  },
];
