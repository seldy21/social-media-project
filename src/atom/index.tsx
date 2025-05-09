import { atom } from "recoil";
export type LanguageType = "ko" | "en";

export const languageState = atom<LanguageType>({
  key: "language",
  default: localStorage.getItem("myProjectLanguage") as LanguageType || "ko",
});
