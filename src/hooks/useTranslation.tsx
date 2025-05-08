import { languageState } from "atom";
import { TRANSLATIONS } from "constant/language";
import { useRecoilValue } from "recoil";

export default function useTranslation() {
  const lang = useRecoilValue(languageState);
  return (key: keyof typeof TRANSLATIONS) => {
    return TRANSLATIONS[key][lang];
  };
}
