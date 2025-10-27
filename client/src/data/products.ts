import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Red Perla ',
    description: 'Exclusiva. Atemporal. Feita para brilhar com contigo!✨',
    price: 0.00,
    images: [
      'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E',
      'https://scontent.cdninstagram.com/v/t51.82787-15/570859846_17864229018493048_2816922628920293927_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTQ4NTE5NDMyOQ%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=UwGnMTu28-AQ7kNvwGfgJZM&_nc_oc=Adm3WM2Epz9JFTpHY2sTLzhEpgnwgthCTTqdJ6dqVNm2ER_tIzKyOjlmE7C8hgZbibI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_Afd67iTGKiGW0W5IO68tCuNzuwPgja9mUw-IRxF_a_keGQ&oe=69032BAB',
      'https://scontent.cdninstagram.com/v/t51.82787-15/570200481_17864229051493048_1105992910835487228_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&ig_cache_key=Mzc1MTE2NDAwMDcxODMxNTA2NA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=nq3c5Feel6wQ7kNvwH-Ykfr&_nc_oc=AdkGYqunGrNqir2Sxc08G8Ta9iY9KC6pRzsxrVvfCJS4vsJYbgjHOq6V3GxT4zh3C-o&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffsOXLen7dBgh7hAnpsmpyYzAJhQnFFZpJAIwsLQXMI7Q&oe=690349FD'
      
    ],
    category: 'Carteiras',
    colors: ['Vermelho'],
    inStock: true,
    featured: true,
    new: false,
    tags: ['red', 'lovely', 'artist']
  },
  {
    id: '2',
    name: 'Bolsa Chocolate 🍫',
    description: 'Mas quem é que consegue resistir? 😋',
    price: 0.00,
    images: [
      'https://scontent.cdninstagram.com/v/t51.82787-15/567628441_17863835031493048_4828064288014291491_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&ig_cache_key=Mzc0ODUwODI1MzMzMzI2MDM2OA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=0l2IsDNnq00Q7kNvwGKi5vf&_nc_oc=AdkQfYtj14fw-xmalhfuKXZOS8H0qJueVt7BgfyectnCnY1LyRgcX2-rtRkF4445RL8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=Tn3r_Qqsie9ws4MLPq_jSA&oh=00_AfcqbqQSoJOl_StgXOZNxVOwY0E6boizgTn-m8fE60zZEg&oe=69056BA7',
      'https://scontent.cdninstagram.com/v/t51.82787-15/567628441_17863835031493048_4828064288014291491_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&ig_cache_key=Mzc0ODUwODI1MzMzMzI2MDM2OA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=0l2IsDNnq00Q7kNvwGKi5vf&_nc_oc=AdkQfYtj14fw-xmalhfuKXZOS8H0qJueVt7BgfyectnCnY1LyRgcX2-rtRkF4445RL8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=Tn3r_Qqsie9ws4MLPq_jSA&oh=00_AfcqbqQSoJOl_StgXOZNxVOwY0E6boizgTn-m8fE60zZEg&oe=69056BA7',
      'https://scontent.cdninstagram.com/v/t51.82787-15/567622612_17863835052493048_2593931618051327113_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc0ODUwODI1MzA1NjQzNTAyNg%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=_0oEwSZtN_cQ7kNvwHqX1Qo&_nc_oc=Adnh1EG01Dt8IaLiIwGXbMjGQ53SFUTNspcs_HRuqbKqpnnVh5FbKX20ZQQxsHEQD6I&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=Tn3r_Qqsie9ws4MLPq_jSA&oh=00_AfeDxCPpogvh0yzenRpmTiCzNikrSACIRDuqVE2EBR-dxw&oe=69053F46'
    ],
    category: 'Carteiras',
    colors: ['Chocolate'],
    inStock: true,
    featured: false,
    new: true,
    tags: ['autumnvibes', 'crochet', 'amão']
  },
  
];