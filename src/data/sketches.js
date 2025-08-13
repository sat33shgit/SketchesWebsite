export const sketches = [
  {
    id: 1,
    title: "Cute Girl",
    description: "Very cute girl isn't it?? Well, after spending long time i could complete this sketch at last. It took around 48hrs to complete it. Thanks to my friend for giving me the drawing book. This is the first sketch from that book.",
    completedDate: "11 September 2010",
    imagePath: "/images/Cute-Girl.jpg",
    category: "Portrait"
  },
  {
    id: 2,
    title: "Still Life with Fruit",
    description: "A classic still life composition featuring various fruits, showcasing texture and light through pencil techniques.",
    completedDate: "2023-06-20",
    imagePath: "/images/still-life-fruit.jpg",
    category: "Still Life"
  },
  {
    id: 3,
    title: "Landscape with Mountains",
    description: "A serene mountain landscape capturing the majestic beauty of nature with detailed shading and perspective.",
    completedDate: "2023-07-10",
    imagePath: "/images/landscape-mountains.jpg",
    category: "Landscape"
  },
  {
    id: 4,
    title: "Abstract Shapes",
    description: "An exploration of geometric forms and abstract compositions, playing with light, shadow, and form.",
    completedDate: "2023-08-05",
    imagePath: "/images/abstract-shapes.jpg",
    category: "Abstract"
  },
  {
    id: 5,
    title: "Cityscape at Night",
    description: "An urban nighttime scene showcasing the interplay of artificial light and shadow in a metropolitan setting.",
    completedDate: "2023-09-12",
    imagePath: "/images/cityscape-night.jpg",
    category: "Cityscape"
  },
  {
    id: 6,
    title: "Animal Study",
    description: "A detailed study of animal anatomy and expression, focusing on capturing the essence of the subject.",
    completedDate: "2023-10-20",
    imagePath: "/images/animal-study.jpg",
    category: "Animal"
  },
  {
    id: 7,
    title: "Floral Composition",
    description: "A delicate arrangement of flowers showcasing botanical details and natural beauty.",
    completedDate: "2023-11-08",
    imagePath: "/images/floral-composition.jpg",
    category: "Nature"
  },
  {
    id: 8,
    title: "Architectural Study",
    description: "A detailed drawing of architectural elements, focusing on perspective and structural details.",
    completedDate: "2023-12-03",
    imagePath: "/images/architectural-study.jpg",
    category: "Architecture"
  },
  {
    id: 9,
    title: "Human Figure Study",
    description: "An anatomical study exploring human form and proportion through careful observation and technique.",
    completedDate: "2024-01-15",
    imagePath: "/images/figure-study.jpg",
    category: "Figure"
  },
  {
    id: 10,
    title: "Seascape",
    description: "A coastal scene capturing the movement and power of ocean waves against rocky cliffs.",
    completedDate: "2024-02-28",
    imagePath: "/images/seascape.jpg",
    category: "Landscape"
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
