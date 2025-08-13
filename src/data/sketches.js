export const sketches = [
  {
    id: 1,
    title: "Cute Girl",
    description: "Very cute girl isn't it?? Well, after spending long time i could complete this sketch at last. It took around 48hrs to complete it. Thanks to my friend for giving me the drawing book. This is the first sketch from that book.",
    completedDate: "11 September 2010",
    imagePath: "images/Cute-Girl.jpg",
    category: "Cuteness"
  },
  {
    id: 2,
    title: "Old Women",
    description: "My Favorite and complex sketch till date. This sketch has a mix of complexity in face (wrinkles) and hair, cloth texture. It took around 60hrs to complete it.",
    completedDate: "30 March 2008",
    imagePath: "/images/Old-Women.jpg",
    category: "Pain"
  },
  {
    id: 3,
    title: "Cow Boy",
    description: "This is the first attempt I have done to sketch a complex picture and it is one of my favorite sketch.",
    completedDate: "2023-07-10",
    imagePath: "/images/Old-Man.jpg",
    category: "Rough"
  },
  {
    id: 4,
    title: "Hutch Girls",
    description: "For the first time, i have done the sketch with two faces. This pic is from the ad of Hutch Mobile network posted in the new paper. A challenging work.",
    completedDate: "8 March 2007",
    imagePath: "/images/Hutch-Girls.jpg",
    category: "Happiness"
  },
  {
    id: 5,
    title: "Gayathri Devi",
    description: "My Oldest sketch.",
    completedDate: "2023-09-12",
    imagePath: "/images/Gayathri-Devi.jpg",
    category: "Beauty"
  },
  {
    id: 6,
    title: "Swapna",
    description: "Well, after a span of 2 years, i attempted to do sketch again and this time the picture of my better half. It took around 60hrs of time for around 2 months time span.",
    completedDate: "2 Novemmber 2012",
    imagePath: "/images/Swapna.jpg",
    category: "Cuteness"
  },
  {
    id: 7,
    title: "Boggarapu Rama Rao",
    description: "Sketch of my father's 1980s picture. Done on the behalf of his 60th birthday. Completed it in 42hrs over a period of 2 months.",
    completedDate: "7 June 2014",
    imagePath: "/images/Ramarao.jpg",
    category: "Legacy"
  },
  {
    id: 8,
    title: "African Boy",
    description: "African Kid. Random picture got from internet. Completed it in 55hrs in a rough time period of 3 months.",
    completedDate: "2024-01-15",
    imagePath: "/images/African-Boy.jpg",
    category: "Innocent"
  },
  {
    id: 9,
    title: "Juliana",
    description: "Done this sketch of cute girl, Juliana, a church member in Dublin. Took 76 hrs to complete it and worked for around 4 months. The hair was the complex part of the pic.",
    completedDate: "14 October 2015",
    imagePath: "/images/Juliana.jpg",
    category: "Cuteness"
  },
  {
    id: 10,
    title: "SuryaKumari",
    description: "Done this sketch of cute girl, Juliana, a church member in Dublin. Took 76 hrs to complete it and worked for around 4 months. The hair was the complex part of the pic.",
    completedDate: "25 November 2018",
    imagePath: "/images/SuryaKumari.jpg",
    category: "Mother"
  },
  {
    id: 11,
    title: "Oliver Solomon with Swapna",
    description: "Privileged to do the sketch of my Son, Oliver Solomon, with his mother, Swapna. One of the complex work (two faces) I have done. It took 84hrs in the span of 5.5 months.",
    completedDate: "27 July 2020",
    imagePath: "/images/OliverWithSwapna.jpg",
    category: "Kids Over Loaded"
  },
  {
    id: 12,
    title: "Oliver Solomon with Sateesh",
    description: "Privileged to do the sketch of my Son, Oliver Solomon, with me. He was 2 months old when I took a selfie with him. \nMy first sketch of my own portrait. It took 48hrs time to complete in the span of 4 months.",
    completedDate: "21 June 2020",
    imagePath: "/images/OliverWithSateesh.jpg",
    category: "Kids Over Loaded"
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
