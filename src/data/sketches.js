export const sketches = [
  {
    id: 11,
    title: "Oliver Solomon (Son) with Swapna",
    description: "Privileged to do the sketch of my Son, Oliver Solomon, with his mother, Swapna. One of the complex work (two faces) I have done. It took 84hrs in the span of 5.5 months.",
    completedDate: "2020-07-27",
    imagePath: "/images/OliverWithSwapna.jpg",
    category: "Kids Over Loaded"
  },
  {
    id: 12,
    title: "Oliver Solomon (Son) with Sateesh",
    description: "Privileged to do the sketch of my Son, Oliver Solomon, with me. He was 2 months old when I took a selfie with him. \nMy first sketch of my own portrait. It took 48hrs time to complete in the span of 4 months.",
    completedDate: "2020-06-21",
    imagePath: "/images/OliverWithSateesh.jpg",
    category: "Kids Over Loaded"
  },
  {
    id: 10,
    title: "Boggarapu Surya Kumari (Mother)",
    description: "I was honored to create a sketch of my mother from one of her pictures from the 1980s and gave it to her as a gift on her 60th birthday. It took me 45hrs to complete it in a span of 2months 10days.",
    completedDate: "2018-11-25",
    imagePath: "/images/SuryaKumari.jpg",
    category: "Mother"
  },
  {
    id: 9,
    title: "Juliana",
    description: "Done this sketch of cute girl, Juliana, a church member in Dublin. Took 76 hrs to complete it and worked for around 4 months. The hair was the complex part of the pic.",
    completedDate: "2015-10-14",
    imagePath: "/images/Juliana.jpg",
    category: "Cuteness"
  },
  {
    id: 8,
    title: "African Boy",
    description: "African Kid. Random picture got from internet. Completed it in 55hrs in a rough time period of 3 months.",
    completedDate: "2015-05-24",
    imagePath: "/images/African-Boy.jpg",
    category: "Innocent"
  },
  {
    id: 7,
    title: "Boggarapu Rama Rao (Father)",
    description: "Sketch of my father's 1980s picture. Done on the behalf of his 60th birthday. Completed it in 42hrs over a period of 2 months.",
    completedDate: "2014-06-07",
    imagePath: "/images/Ramarao.jpg",
    category: "Legacy"
  },
  {
    id: 6,
    title: "Swapna (Spouse)",
    description: "Well, after a span of 2 years, i attempted to do sketch again and this time the picture of my better half, Swapna. It took around 60hrs of time for around 2 months time span.",
    completedDate: "2012-11-02",
    imagePath: "/images/Swapna.jpg",
    category: "Cuteness"
  },
  {
    id: 1,
    title: "Cute Girl",
    description: "Very cute girl isn't it?? Well, after spending long time i could complete this sketch at last. It took around 48hrs to complete it. Thanks to my friend for giving me the drawing book. This is the first sketch from that book.",
    completedDate: "2010-09-11",
    imagePath: "images/Cute-Girl.jpg",
    category: "Cuteness"
  },
  {
    id: 2,
    title: "Old Women",
    description: "My Favorite and complex sketch till date. This sketch has a mix of complexity in face (wrinkles) and hair, cloth texture. It took around 60hrs to complete it.",
    completedDate: "2009-11-22",
    imagePath: "/images/Old-Women.jpg",
    category: "Pain"
  },
  {
    id: 3,
    title: "Cow Boy",
    description: "This is the first attempt I have done to sketch a complex picture and it is one of my favorite sketch.",
    completedDate: "2008-03-30",
    imagePath: "/images/Old-Man.jpg",
    category: "Rough"
  },
  {
    id: 4,
    title: "Hutch Girls",
    description: "For the first time, i have done the sketch with two faces. This pic is from the ad of Hutch Mobile network posted in the new paper. A challenging work.",
    completedDate: "2007-03-08",
    imagePath: "/images/Hutch-Girls.jpg",
    category: "Happiness"
  },
  {
    id: 5,
    title: "Gayathri Devi",
    description: "My Oldest sketch.",
    completedDate: "2006-03-12",
    imagePath: "/images/Gayathri-Devi.jpg",
    category: "Beauty"
  }
]

export const getSketchById = (id) => {
  return sketches.find(sketch => sketch.id === parseInt(id))
}

export const getSketchesByCategory = (category) => {
  return sketches.filter(sketch => sketch.category === category)
}

export const getAllCategories = () => {
  return [...new Set(sketches.map(sketch => sketch.category))]
}
