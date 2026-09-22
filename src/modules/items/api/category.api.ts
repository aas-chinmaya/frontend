import api from "@/services/api";

export const categoryApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/product-categories/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/product-categories/getby/${id}`);
  },

  create(data: any) {
    return api.post("/product-categories/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/product-categories/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/product-categories/delete/${id}`);
  },

  // restore(id: string) {
  //   return api.patch(`/categories/${id}/restore`);
  // },
};
