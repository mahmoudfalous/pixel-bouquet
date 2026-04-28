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
    story: 'زي نسمة هوا دافية في يوم برد، الباقة دي معمولة عشان تعبر عن حب مش محتاج دوشة عشان يتسمع، حب بيكبر في هدوء وبيملا القلب براحة وسلام.',
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
    story: 'ميكس بين رقة الورد وشياكة الليليوم، حكاية كلها احترام وتقدير بجد. باقة اتعملت عشان تكون تاج من الرقة يليق بقلبك الأبيض.',
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
    story: 'زي أغنية رومانسية قديمة، كل بتلة فيها بتنبض بمشاعر مفيش كلام يوصفها. الورد ده متقطفش وبس، ده اختاروه مخصوص عشان يبقى لغة لقلب مليان شوق.',
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
    story: 'الورد ده شايل جواه دفا الشمس وضحكات الأيام الحلوة، جاي عشان ينور أي لحظة ضلمة ويقولك إن الحياة بوجودك ألوانها أحلى بكتير.',
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
    story: 'بالظبط زي ألوان الغروب الساحرة، المشاعر هنا سايحة في بعضها في لوحة واحدة، عشان تقولك إن كل تفاصيلك لايقة على بعضها كأنها مزيكا اتعزفت عشانك بس.',
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
    story: 'باقة بتعزف لحن الإعجاب في صمت، بتهمسلك باللي الكلام مقدرش يوصله، عشان تأكدلك إن مكانتك في القلب غالية وأصيلة زي جذور الورد ده.',
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
    story: 'حلاوة مابتتأثرش بالوقت، ووفاء بيتجدد كل يوم الصبح. الباقة دي مجرد عهد من غير صوت إن الاهتمام بيك هيفضل دايم على طول.',
    image: '/Carnation Roses Bouquet.png',
    animation: {
      entrance: { scale: [0.2, 1], translateY: [20, 0], rotate: [0, 0], duration: 1500, easing: 'easeOutQuart' },
      idle: { translateY: [-6, 6], rotate: [-1, 1], duration: 2800, easing: 'easeInOutQuad' }
    }
  },
];
