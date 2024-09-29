// src/components/Elements/AddressForm.js
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddressForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      country: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      streetAddress: "",
      aptSuite: "",
      city: "",
      province: "",
      postalCode: "",
      deliveryInstructions: "",
      sameAsMailing: false,
    },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      streetAddress: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      province: Yup.string().required("Province/State is required"),
      postalCode: Yup.string()
        .matches(/^[A-Za-z0-9 ]{3,10}$/, "Invalid postal code")
        .required("Postal code is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Country */}
      <div>
        <label className="block text-gray-700">Country</label>
        <select
          name="country"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.country}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          {/* Add other countries here */}
        </select>
        {formik.touched.country && formik.errors.country ? (
          <div className="text-red-500 text-sm">{formik.errors.country}</div>
        ) : null}
      </div>

      {/* Full Name */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            className="w-full mt-1 p-2 border rounded"
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
          ) : null}
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            className="w-full mt-1 p-2 border rounded"
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
          ) : null}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-gray-700">Phone Number</label>
        <input
          name="phoneNumber"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNumber}
          className="w-full mt-1 p-2 border rounded"
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
          <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
        ) : null}
      </div>

      {/* Address */}
      <div>
        <label className="block text-gray-700">Street Address</label>
        <input
          name="streetAddress"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.streetAddress}
          className="w-full mt-1 p-2 border rounded"
        />
        {formik.touched.streetAddress && formik.errors.streetAddress ? (
          <div className="text-red-500 text-sm">{formik.errors.streetAddress}</div>
        ) : null}
      </div>
      <div>
        <label className="block text-gray-700">Apt/Suite (Optional)</label>
        <input
          name="aptSuite"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.aptSuite}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="flex space-x-4">
        {/* City */}
        <div>
          <label className="block text-gray-700">City</label>
          <input
            name="city"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className="w-full mt-1 p-2 border rounded"
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="text-red-500 text-sm">{formik.errors.city}</div>
          ) : null}
        </div>

        {/* Province/State */}
        <div>
          <label className="block text-gray-700">Province/State</label>
          <input
            name="province"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.province}
            className="w-full mt-1 p-2 border rounded"
          />
          {formik.touched.province && formik.errors.province ? (
            <div className="text-red-500 text-sm">{formik.errors.province}</div>
          ) : null}
        </div>
      </div>

      {/* Postal Code */}
      <div>
        <label className="block text-gray-700">Postal Code</label>
        <input
          name="postalCode"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.postalCode}
          className="w-full mt-1 p-2 border rounded"
        />
        {formik.touched.postalCode && formik.errors.postalCode ? (
          <div className="text-red-500 text-sm">{formik.errors.postalCode}</div>
        ) : null}
      </div>

      {/* Delivery Instructions */}
      <div>
        <label className="block text-gray-700">Delivery Instructions</label>
        <textarea
          name="deliveryInstructions"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.deliveryInstructions}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      {/* Checkbox for same shipping and mailing address */}
      <div className="flex items-center">
        <input
          name="sameAsMailing"
          type="checkbox"
          onChange={formik.handleChange}
          checked={formik.values.sameAsMailing}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-gray-900">
          Shipping address is the same as mailing address
        </label>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded mt-4 hover:bg-blue-700"
      >
        Submit Address
      </button>
    </form>
  );
};

export default AddressForm;

