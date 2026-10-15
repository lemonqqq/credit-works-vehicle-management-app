import { PiCarProfileBold, PiVanBold, PiTruckBold, PiPersonSimpleBikeBold } from "react-icons/pi";

const iconsKV = [
    {
        id: 'bike',
        icon: <PiPersonSimpleBikeBold />
    },
    {
        id: 'car',
        icon: <PiCarProfileBold />
    },
    {
        id: 'van',
        icon: <PiVanBold />
    },
    {
        id: 'truck',
        icon: <PiTruckBold />
    }
];

let categories = [];
let draftCategories = null;
let draftHasError = false;

const getCategorySection = (id = null, weight = null) => {
    var category = categories.find(x => x.id === id 
        || (x.minWeight <= weight && x.maxWeight >= weight));
    var icon = iconsKV.find(x => x.id === (category?.iconKey?.toLowerCase() ?? 'bike')) ?? iconsKV[0];
    return (
        <div>
            <span>{icon.icon}</span>
            {category?.name}
        </div>
    );
};

const validate = (item) => {
    var list = (draftCategories ?? categories).filter(x => x.id !== item.id);
    list = [...list, item];
    var startingWeight = 0;
    var sortedList = list.sort((a, b) => a.minWeight - b.minWeight);
    for (var i = 0; i < list.length; i++) {
        var listItem = sortedList[i];
        if (listItem.minWeight > startingWeight) {
            listItem.invalid = true;
            listItem.validationMessage = `Missing weight between ${startingWeight} to ${listItem.minWeight} kg`;
        }
        else if (listItem.minWeight <= startingWeight) {
            listItem.invalid = true;
            listItem.validationMessage = `Overlap weight`;
        }
        startingWeight = listItem.maxWeight + 0.01;
        if (i < list.length-1) continue;
        if (listItem.maxWeight !== null) {
            listItem.invalid = true;
            listItem.validationMessage = `Incomplete weight range, missing maximum weight`;
        }
    }
    draftCategories = sortedList;
    draftHasError = sortedList.filter(x => x.invalid).length > 0;
}

const clearDraft = () => {
    draftCategories = null;
}

const setCategories = (list) => {
    categories = list;
}

export const categoryFn = {
    icons: () => iconsKV,
    getSection: (id = null, weight = null) => getCategorySection(id, weight),
    get: () => categories,
    getDraft: () => draftCategories,
    draftWithError: () => draftHasError,
    clearDraft: () => clearDraft,
    set: (list) => setCategories(list),
    validate: (list) => validate(list)
};