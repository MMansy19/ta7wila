"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { Params } from "./types";


export default function UploadLogo({ params, logo }: { params: Params; logo: string | null }) {
  const translations = useTranslation();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (logo) {
      setLogoPreview(`https://api.ta7wila.com/${logo}`);
    }
  }, [logo]);

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (file && /\.(png|jpe?g)$/i.test(file.name)) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setLogoPreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Invalid file type. Only .png, .jpg, and .jpeg are allowed.");
      }
    },
    []
  );

  const handleLogoUpload = async () => {
    if (!logoPreview) {
      toast.error("Please select a logo to upload.");
      return;
    }

    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"]'
    );
    if (!fileInput || !fileInput.files?.[0]) {
      toast.error("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", fileInput.files[0]);

    setUploadingLogo(true);
    try {
      const response = await axios.post(
        `${apiUrl}/applications/${params.id}/logo`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Failed to upload logo.");
      }
    } catch (error: unknown) {
      let errorMessage = translations.errors?.developerMode || "An error occurred during logo upload.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { 
          response: { 
            data?: { 
              errorMessage?: string;
              message?: string;
              result?: Record<string, string>;
            } | string;
          }
        };

        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data?.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.result) {
          errorMessage = Object.values(err.response.data.result).join(", ");
        }
      }

      toast.error(errorMessage);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="justify-center text-center items-center mb-2">
      <h3 className="text-lg font-semibold mb-3">{translations.storeUpdate.logoUpload.updateLogo}</h3>
      <div className="h-40 bg-neutral-800 rounded-lg flex items-center justify-center relative cursor-pointer overflow-hidden">
        {logoPreview ? (
          <Image
            width={200}
            height={200}
            src={logoPreview}
            alt="Logo Preview"
            priority={true}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-400 bg-[#444444] rounded-full p-4">
            <svg width="35" height="35" viewBox="0 0 75 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.625 18.75C25.8027 18.75 30 14.5527 30 9.375C30 4.19733 25.8027 0 20.625 0C15.4473 0 11.25 4.19733 11.25 9.375C11.25 14.5527 15.4473 18.75 20.625 18.75ZM74.1985 29.4656L54.9556 16.6371C53.5278 15.6852 51.6266 15.8735 50.4131 17.0869L24.5869 42.9131C23.3734 44.1266 21.4722 44.3148 20.0444 43.3629L1.39923 30.9328C0.801131 30.5341 0 30.9628 0 31.6817V56.4C0 58.3882 1.61177 60 3.6 60H71.4C73.3882 60 75 58.3882 75 56.4V30.9633C75 30.3615 74.6992 29.7995 74.1985 29.4656Z" fill="#7E7E7E" />
            </svg>
          </span>
        )}
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleLogoChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {translations.storeUpdate.logoUpload.acceptedFormats}
      </p>
      <button
        type="button"
        className="px-5 py-2 bg-[#53B4AB] text-sm text-black rounded-lg mt-2"
        onClick={handleLogoUpload}
        disabled={uploadingLogo}
      >
        {uploadingLogo ? translations.storeUpdate.logoUpload.uploading : translations.storeUpdate.logoUpload.updateLogo}
      </button>
    </div>
  )
}