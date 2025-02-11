export type Channel = {
  id: string;
  name: string;
  fullName: string;
  youtubeUrl: string;
};

export type Idol = {
  id: string;
  name: string;
  fullName: string;
  color: string;
  youtubeUrl: string;
};

export const mieru: Idol = {
  id: "mieru",
  name: "みえる",
  fullName: "姫乃みえる",
  color: "#f097a7",
  youtubeUrl: "https://www.youtube.com/@himeno-mieru",
} as const;

export const meh: Idol = {
  id: "meh",
  name: "メエ",
  fullName: "真未夢メエ",
  color: "#5b6f97",
  youtubeUrl: "https://www.youtube.com/@mamimu-meh",
} as const;

/** ぱりぱり、ぱりーん！ */
export const parin: Idol = {
  id: "parin",
  name: "パリン",
  fullName: "和央パリン",
  color: "#fcd005",
  youtubeUrl: "https://www.youtube.com/@wao-parin",
} as const;

export const taimu: Idol = {
  id: "taimu",
  name: "たいむ",
  fullName: "凛堂たいむ",
  color: "#a28ec1",
  youtubeUrl: "https://www.youtube.com/@rindou-taimu",
} as const;

export const bu = {
  id: "bu",
  name: "配信部",
  fullName: "アイカツアカデミー配信部",
  youtubeUrl: "https://www.youtube.com/@aikatsu-academy",
};

export const allIdols: Idol[] = [mieru, meh, parin, taimu];

export const findIdolById = (id: string): Idol | null => {
  return allIdols.find((idol) => idol.id === id) || null;
};

export const findIdolByName = (name: string): Idol | null => {
  return allIdols.find((idol) => idol.name === name) || null;
};

export const allChannels: Channel[] = [...allIdols, bu];

export const findChannelById = (id: string): Channel | null => {
  return allChannels.find((channel) => channel.id === id) || null;
};

export const findChannelByName = (name: string): Channel | null => {
  return allChannels.find((channel) => channel.name === name) || null;
};
