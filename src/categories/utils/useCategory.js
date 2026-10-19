import { categoriesApi } from "../../services/api";

let categories = [];
let draftCategories = [];

const load = async (signal) => {
  const list = await categoriesApi.list(signal);
  draftCategories = list;
  categories = list;
  return list;
};

const confirm = (categories) => {
  return categoriesApi.confirm(categories);
};

const setDraft = (draft) => {
  draftCategories = draft;
};

export const useCategory = {
  get: (id) => categories.find((x) => x.id == id),
  getList: () => categories,
  getDraft: () => draftCategories.sort((a, b) => a.minWeight - b.minWeight),
  load: (signal) => load(signal),
  confirm: (categories) => confirm(categories),
  setDraft: (draft) => setDraft(draft),
};
