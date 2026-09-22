"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from "@/components/ui";

import { FormField } from "@/components/form";

const branchSchema = z.object({
  // Basic
  branchName: z
    .string()
    .min(2, "Branch name is required"),

  branchCode: z.string().optional(),

  status: z.string(),

  // Address
  address1: z
    .string()
    .min(3, "Address is required"),

  country: z.string(),

  state: z.string(),

  city: z.string(),

  pincode: z.string(),

  // Contact
  phone: z.string(),
  email: z.string().email(),
  branchManager: z.string().optional(),
  GSTIN: z.string().optional(),
  PAN: z.string().optional(),
  licenseNumber: z.string().optional(),

  // Other
  openingDate: z.string().optional(),

  note: z.string().optional(),
});

export type BranchFormData =
  z.infer<typeof branchSchema>;

interface BranchFormProps {
  loading?: boolean;
  initialValues?: BranchFormData;
  onCancel: () => void;
  onSubmit: (
    data: BranchFormData
  ) => void | Promise<void>;
}

export default function BranchForm({
  loading,
  initialValues,
  onCancel,
  onSubmit,
}: BranchFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),

    defaultValues: {
      status: "Active",
      country: "India",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-6"
    >

      {/* Basic Information */}

      <Card>

        <CardHeader>

          <h3 className="text-lg font-semibold">
            Basic Information
          </h3>

          <p className="text-sm text-muted">
            Enter branch details.
          </p>

        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">

          <FormField
            label="Branch Name"
            required
            error={errors.branchName?.message}
          >
            <Input
              placeholder="Main Branch"
              {...register("branchName")}
            />
          </FormField>

          <FormField
            label="Branch Code"
            error={errors.branchCode?.message}
          >
            <Input
              placeholder="BR001"
              {...register("branchCode")}
            />
          </FormField>

          <FormField
            label="Status"
            error={errors.status?.message}
          >
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue(
                  "status",
                  value
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="Active">
                  Active
                </SelectItem>

                <SelectItem value="Inactive">
                  Inactive
                </SelectItem>

              </SelectContent>

            </Select>

          </FormField>

        </CardContent>

      </Card>

            {/* Address Information */}

      <Card>

        <CardHeader>

          <h3 className="text-lg font-semibold">
            Address Information
          </h3>

          <p className="text-sm text-muted">
            Enter the complete branch address.
          </p>

        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">

          <div className="md:col-span-2">

            <FormField
              label="Address "
              required
              error={errors.address1?.message}
            >
              <Input
                placeholder="Street, Area, Building"
                {...register("address1")}
              />
            </FormField>

          </div>

          {/* <div className="md:col-span-2">

            <FormField
              label="Address Line 2"
              error={errors.address2?.message}
            >
              <Input
                placeholder="Landmark (Optional)"
                {...register("address2")}
              />
            </FormField>

          </div> */}

          {/* Country */}

          <FormField
            label="Country"
            error={errors.country?.message}
          >
            <Select
              value={watch("country")}
              onValueChange={(value) =>
                setValue("country", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="India">
                  India
                </SelectItem>

                <SelectItem value="UAE">
                  UAE
                </SelectItem>

                <SelectItem value="USA">
                  USA
                </SelectItem>

                <SelectItem value="United Kingdom">
                  United Kingdom
                </SelectItem>

                <SelectItem value="Canada">
                  Canada
                </SelectItem>

                <SelectItem value="Australia">
                  Australia
                </SelectItem>

              </SelectContent>

            </Select>

          </FormField>

          {/* State */}

          <FormField
            label="State"
            error={errors.state?.message}
          >
            <Input
              placeholder="Odisha"
              {...register("state")}
            />
          </FormField>

          {/* City */}

          <FormField
            label="City"
            error={errors.city?.message}
          >
            <Input
              placeholder="Bhubaneswar"
              {...register("city")}
            />
          </FormField>

          {/* Pincode */}

          <FormField
            label="Pincode"
            error={errors.pincode?.message}
          >
            <Input
              placeholder="751024"
              {...register("pincode")}
            />
          </FormField>

        </CardContent>

      </Card>

            {/* Contact Information */}

      <Card>

        <CardHeader>

          <h3 className="text-lg font-semibold">
            Contact Information
          </h3>

          <p className="text-sm text-muted">
            Branch communication details.
          </p>

        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">

          <FormField
            label="Branch Manager"
            error={errors.branchManager?.message}
          >
            <Input
              placeholder="John Doe"
              {...register("branchManager")}
            />
          </FormField>

          <FormField
            label="Phone Number"
            error={errors.phone?.message}
          >
            <Input
              placeholder="0674-1234567"
              {...register("phone")}
            />
          </FormField>

          <FormField
            label="Email Address"
            error={errors.email?.message}
          >
            <Input
              type="email"
              placeholder="branch@company.com"
              {...register("email")}
            />
          </FormField>

        </CardContent>

      </Card>

      {/* Tax & Licence Information */}

      <Card>

        <CardHeader>

          <h3 className="text-lg font-semibold">
            Tax & Licence Information
          </h3>

          <p className="text-sm text-muted">
            Branch registration and tax details.
          </p>

        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">

          <FormField
            label="GSTIN"
            error={errors.GSTIN?.message}
          >
            <Input
              placeholder="22AAAAA0000A1Z5"
              {...register("GSTIN")}
            />
          </FormField>

          <FormField
            label="PAN Number"
            error={errors.PAN?.message}
          >
            <Input
              placeholder="ABCDE1234F"
              {...register("PAN")}
            />
          </FormField>

          <div className="md:col-span-2">

            <FormField
              label="Licence Number"
              error={errors.licenseNumber?.message}
            >
              <Input
                placeholder="Trade / Shop / FSSAI Licence"
                {...register("licenseNumber")}
              />
            </FormField>

          </div>

        </CardContent>

      </Card>

            {/* Additional Information */}

      <Card>

        <CardHeader>

          <h3 className="text-lg font-semibold">
            Additional Information
          </h3>

          <p className="text-sm text-muted">
            Optional branch information.
          </p>

        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">

          <FormField
            label="Opening Date"
            error={errors.openingDate?.message}
          >
            <Input
              type="date"
              {...register("openingDate")}
            />
          </FormField>

          <div />

          <div className="md:col-span-2">

            <FormField
              label="Notes"
              error={errors.note?.message}
            >
              <Textarea
                rows={5}
                placeholder="Additional information about this branch..."
                {...register("note")}
              />
            </FormField>

          </div>

        </CardContent>

      </Card>

      {/* Footer */}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialValues
            ? "Save Branch"
            : "Create Branch"}
        </Button>

      </div>

    </form>
  );
}