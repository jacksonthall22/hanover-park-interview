export type ChatMessage = {
  isHuman: boolean;
  text: string;
  links?: Link[];
};

export type Link = {
  title: string;
  url: string;
  content: string;
}