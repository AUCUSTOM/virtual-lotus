export type Character = {
  id: string;
  name: string;
  age: number;
  tags: string[];
  avatar: string;
  premium: boolean;
  gender: "f" | "m" | "nb";
};

export const CHARACTERS: Character[] = [
  { id: "aurora", name: "Aurora", age: 26, tags: ["deep","poetic","mysterious"], avatar: "/avatars/Aurora_26.jpg", premium: false, gender: "f" },
  { id: "mila",   name: "Mila",   age: 23, tags: ["fun","direct","flirty"],      avatar: "/avatars/Mila_23.jpg",   premium: false, gender: "f" },
  { id: "sofia",  name: "Sofia",  age: 27, tags: ["romantic","caring","empathetic"], avatar: "/avatars/Sofia_27.jpg", premium: false, gender: "f" },
  { id: "luca",   name: "Luca",   age: 28, tags: ["charismatic","warm","witty"], avatar: "/avatars/Luca_28.jpg",   premium: false, gender: "m" },
  { id: "noah",   name: "Noah",   age: 30, tags: ["calm","wise","reliable"],     avatar: "/avatars/Noah_30.jpg",   premium: false, gender: "m" },
  { id: "elena",  name: "Elena",  age: 29, tags: ["elegant","sharp","demanding"],avatar: "/avatars/Elena_29.jpg",  premium: true,  gender: "f" },
  { id: "zara",   name: "Zara",   age: 24, tags: ["bold","honest","alternative"],avatar: "/avatars/Zara_24.jpg",   premium: true,  gender: "f" },
  { id: "ren",    name: "Ren",    age: 25, tags: ["mysterious","minimal","sharp"],avatar: "/avatars/Ren_25.jpg",    premium: true,  gender: "m" },
  { id: "alex",   name: "Alex",   age: 26, tags: ["creative","fluid","surprising"],avatar: "/avatars/Alex_26.jpg", premium: true,  gender: "nb" },
  { id: "kai",    name: "Kai",    age: 25, tags: ["enigmatic","intelligent","rare"],avatar: "/avatars/Kai_25.jpg", premium: true,  gender: "nb" },
];