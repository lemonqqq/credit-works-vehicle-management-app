import { useCategory } from "../../categories/utils/useCategory";

export const YearOptions = (onSelectHandler) => {
  const minYear = 2000;
  return (
    <select defaultValue="null" onClick={(e) => onSelectHandler(e, "year")}>
      <option value="null">All years</option>
      {Array(26)
        .keys()
        .map((year, key) => (
          <option key={key} value={minYear + year}>
            {minYear + year}
          </option>
        ))}
      ;
    </select>
  );
};

export const ManufacturerOptions = (onSelectHandler) => {
  return (
    <select
      defaultValue="null"
      onClick={(e) => onSelectHandler(e, "manufacturer")}
    >
      <option value="null">All manufacturers</option>
      <option value="Mazda">Mazda</option>
      <option value="Mercedes">Mercedes</option>
      <option value="Honda">Honda</option>
      <option value="Ferrari">Ferrari</option>
      <option value="Toyota">Toyota</option>
    </select>
  );
};

export const CategoryOptions = (onSelectHandler) => {
  return (
    <select defaultValue="null" onClick={(e) => onSelectHandler(e, "category")}>
      <option value="null">All categories</option>
      {useCategory.getList().map((category, key) => (
        <option key={key} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
