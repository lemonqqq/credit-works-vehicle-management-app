import {
  PiCarProfileBold,
  PiVanBold,
  PiTruckBold,
  PiPersonSimpleBikeBold,
} from "react-icons/pi";
import { useCategory } from "./useCategory";

const iconsKV = [
  {
    id: "bike",
    icon: <PiPersonSimpleBikeBold />,
  },
  {
    id: "car",
    icon: <PiCarProfileBold />,
  },
  {
    id: "van",
    icon: <PiVanBold />,
  },
  {
    id: "truck",
    icon: <PiTruckBold />,
  },
];

const getCategorySection = (id = null, weight = -1) => {
  const categories = useCategory.getList();
  const category = categories.find((item) => {
    if (id !== null) return item.id === id;
    const min = item.minWeightKg ?? item.minWeight;
    const max = "maxWeightKg" in item ? item.maxWeightKg : item.maxWeight;
    return weight >= min && (max === null || weight < max);
  });
  if (!category) return <span>Uncategorised</span>;

  const icon =
    iconsKV.find((x) => x.id === category.iconKey.toLowerCase()) ?? iconsKV[0];
  return (
    <div>
      <span>{icon.icon}</span>
      {category.name}
    </div>
  );
};

export const categoryIcon = {
  icons: () => iconsKV,
  getSection: (id, weight) => getCategorySection(id, weight),
};
