import { baseApi } from "@/services/baseApi";

import type {
  PaymentReceipt,
  PaymentReceiptListResponse,
  PaymentReceiptQueryParams,
  PaymentReceiptResponse,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,
} from "../types/payment-receipt.types";

const PAYMENT_RECEIPT_ENDPOINT = "/payment-receipts";

export const paymentReceiptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentReceipts: builder.query<
      PaymentReceiptListResponse,
      PaymentReceiptQueryParams | undefined
    >({
      query: (params) => ({
        url: PAYMENT_RECEIPT_ENDPOINT,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.length
          ? [
              ...result.data.map(({ id }) => ({
                type: "PaymentReceipt" as const,
                id,
              })),
              { type: "PaymentReceipt" as const, id: "LIST" },
            ]
          : [{ type: "PaymentReceipt" as const, id: "LIST" }],
    }),

    getPaymentReceiptById: builder.query<PaymentReceiptResponse, string>({
      query: (id) => ({
        url: `${PAYMENT_RECEIPT_ENDPOINT}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "PaymentReceipt" as const, id },
      ],
    }),

    createPaymentReceipt: builder.mutation<
      PaymentReceiptResponse,
      CreatePaymentReceiptPayload
    >({
      query: (data) => ({
        url: PAYMENT_RECEIPT_ENDPOINT,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "PaymentReceipt", id: "LIST" }],
    }),

    updatePaymentReceipt: builder.mutation<
      PaymentReceiptResponse,
      { id: string; data: UpdatePaymentReceiptPayload }
    >({
      query: ({ id, data }) => ({
        url: `${PAYMENT_RECEIPT_ENDPOINT}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PaymentReceipt", id },
        { type: "PaymentReceipt", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPaymentReceiptsQuery,
  useGetPaymentReceiptByIdQuery,
  useCreatePaymentReceiptMutation,
  useUpdatePaymentReceiptMutation,
} = paymentReceiptApi;
