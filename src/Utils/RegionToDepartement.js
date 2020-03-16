export class RegionToDepartement {
    static getByRegion(region){
        switch (region) {
            case "Auvergne-Rhône-Alpes":
                return [15, 63, 3, 42, 43, 69, 7, 26, 1, 38, 74, 73];
            case "Bourgogne-Franche-Comté":
                return [89, 58, 71, 21, 39, 25, 70, 90];
            case "Bretagne":
                return [29, 22, 56, 35];
            case "Centre-Val de Loire":
                return [28, 41, 37, 36, 18, 45];
            case "Corse":
                return ["2B", "2A"];
            case "Hauts-de-France":
                return [62, 59, 2, 60, 80];
            case "Ile-de-France":
                return [78, 85, 77, 91, 92, 75, 94, 93];
            case "Normandie":
                return [50, 14, 61, 27, 76];
            case "Nouvelle-Aquitaine":
                return [79, 86, 87, 23, 19, 87, 16, 17, 33, 24, 47, 40, 64];
            case "Occitanie":
                return [46, 12, 48, 30, 34, 81, 82, 32, 31, 11, 65, 9, 66];
            case "Pays de la Loire":
                return [44, 85, 49, 53, 72];
            case "Provence-Alpes-Côte d’Azur":
                return [84, 13, 83, 4, 5, 6];
            case "Guadeloupe":
                return [971];
            case "Guyane":
                return [973];
            case "Martinique":
                return [972];
            case "Mayotte":
                return [976];
            case "La Réunion":
                return [974];
            default:
                return [];
        }
    }

    static getColorByIntensity(intensity){
        switch (intensity) {
            case 0:
                return "rgba(255,255,255,0)";
            case 4:
                return "rgba(255,54,0,0.19)";
            case 3:
                return "rgba(255,54,0,0.40)";
            case 2:
                return "rgba(255,54,0,0.60)";
            case 1:
                return "rgba(255,54,0,0.80)";
        }
    }
}