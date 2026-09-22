import { hsnSacApi, type HsnSacQueryType } from "../api/hsn-sac.api";

export const hsnSacService = {
  getHsnSacRecords(page = 1, limit = 10, type?: HsnSacQueryType) {
    return hsnSacApi.getAll(page, limit, type);
  },
 

  getHsnSacRecordsForDropdown(
    type: HsnSacQueryType,
    page = 1,
    limit = 10,
    search = ""
  ) {
    return hsnSacApi.getAllForDropdown(type, page, limit, search);
  },

  importExcel(file: File) {
    return hsnSacApi.importExcel(file);
  },
  
  exportExcel() {
    return hsnSacApi.exportExcel();
  },
};
