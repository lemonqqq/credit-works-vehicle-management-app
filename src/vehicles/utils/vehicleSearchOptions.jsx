import { categoryService } from "../../categories/categoryService";

export const YearOptions = (onSelectHandler, value = "") => {
  const minYear = 2000;
  return (
    <select
      value={value}
      onChange={(e) => onSelectHandler("year", e.target.value)}
    >
      <option value="">All years</option>
      {Array.from(
        { length: new Date().getFullYear() - minYear + 1 },
        (_, year) => (
          <option key={minYear + year} value={minYear + year}>
            {minYear + year}
          </option>
        ),
      )}
    </select>
  );
};

export const ManufacturerOptions = (onSelectHandler, value = "") => {
  return (
    <select
      value={value}
      onChange={(e) => onSelectHandler("manufacturer", e.target.value)}
    >
      <option value="">All manufacturers</option>
      <option value="Mazda">Mazda</option>
      <option value="Mercedes">Mercedes</option>
      <option value="Honda">Honda</option>
      <option value="Ferrari">Ferrari</option>
      <option value="Toyota">Toyota</option>
    </select>
  );
};

export const CategoryOptions = (onSelectHandler, value = "") => {
  return (
    <select
      value={value}
      onChange={(e) => onSelectHandler("category", e.target.value)}
    >
      <option value="">All categories</option>
      {categoryService.getList().map((category, key) => (
        <option key={key} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
