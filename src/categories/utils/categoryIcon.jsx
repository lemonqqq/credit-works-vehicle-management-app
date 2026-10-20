import {
  PiCarProfileBold,
  PiVanBold,
  PiTruckBold,
  PiPersonSimpleBikeBold,
} from "react-icons/pi";
import { categoryService } from "../categoryService";

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
  const categories = categoryService.getDraft();
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

const getIcon = (iconKey) => {
  return iconsKV.find((x) => x.id === iconKey)?.icon ?? iconsKV[0].icon;
};

export const categoryIcon = {
  icons: () => iconsKV,
  get: (iconKey) => getIcon(iconKey),
  getSection: (id = null, weight = -1) => getCategorySection(id, weight),
};
