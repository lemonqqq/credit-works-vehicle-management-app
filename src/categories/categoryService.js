import { categoriesApi } from "../services/api";

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

const setDraft = (list) => {
  draftCategories = list;
};

const update = (item) => {
  const index = draftCategories.findIndex((x) => x.id === item.id);
  if (index >= 0) {
    draftCategories[index] = item;
    return;
  }
  draftCategories = [...draftCategories, item];
};

const remove = (item) => {
  draftCategories = draftCategories.filter((x) => x.id !== item.id);
};

export const categoryService = {
  get: (id) => categories.find((x) => x.id == id),
  getList: () => categories,
  getDraft: () => draftCategories.sort((a, b) => a.minWeightKg - b.minWeightKg),
  load: (signal) => load(signal),
  confirm: (categories) => confirm(categories),
  setDraft: (draft) => setDraft(draft),
  remove: (item) => remove(item),
  update: (item) => update(item),
};
