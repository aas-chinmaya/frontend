import api from "@/services/api";

export const subCategoryApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/product-subcategories/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/product-subcategories/getbyid/${id}`);
  },

  create(data: any) {
    return api.post("/product-subcategories/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/product-subcategories/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/product-subcategories/delete/${id}`);
  },

//   restore(id: string) {
//     return api.patch(`/subcategories/${id}/restore`);
//   },
};
