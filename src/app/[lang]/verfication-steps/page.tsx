"use client";

import React, { useState, useEffect, ChangeEvent, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCameraAlt,
  faCloudUpload,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import axios from "axios";
import getAuthHeaders from "../dashboard/Shared/getAuth";
import { useTranslation } from "@/context/translation-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


interface FilePreview {
  file: File;
  preview: string;
}

export default function VerificationSteps() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [frontDoc, setFrontDoc] = useState<FilePreview | null>(null);
  const [backDoc, setBackDoc] = useState<FilePreview | null>(null);
  const [selfieDoc, setSelfieDoc] = useState<FilePreview | null>(null);
const router = useRouter();
  const translation = useTranslation();


  const steps = [
    {
      title: translation.verification.stepTitles.step1,
      description: translation.verification.stepDescriptions.step1,
    },
    {
      title: translation.verification.stepTitles.step2,
      description: translation.verification.stepDescriptions.step2,
    },
    {
      title: translation.verification.stepTitles.step3,
      description: translation.verification.stepDescriptions.step3,
    },
    {
      title: translation.verification.stepTitles.step4,
      description: translation.verification.stepDescriptions.step4,
    },
  ];

  useEffect(() => {
    return () => {
      [frontDoc, backDoc, selfieDoc].forEach((doc) => {
        if (doc) URL.revokeObjectURL(doc.preview);
      });
    };
  }, [frontDoc, backDoc, selfieDoc]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      submitVerification();
    } else {
      setActiveStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setDoc: (doc: FilePreview | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setDoc({ file, preview });
      // setTimeout(handleNext, 1500);
    }
  };

  const submitVerification = async () => {
    const formData = new FormData();
    if (frontDoc) formData.append("front_photo", frontDoc.file);
    if (backDoc) formData.append("back_photo", backDoc.file);
    if (selfieDoc) formData.append("selfie_photo", selfieDoc.file);

    try {
      const response = await axios.post(
        `${apiUrl}/identity-verification/create`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

       const pathSegments = window.location.pathname.split("/");
      const locale = pathSegments[1] || "en";

      if (response.status === 200) {
        setActiveStep((prev) => prev + 1);
        router.push(`/${locale}/dashboard/plans`);
      }
    } catch (err) {
      console.error("Error submitting verification:", err);
       toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the verification."
      );
      
    }
  };

  const VisuallyHiddenInput = (props: any) => (
    <input
      {...props}
      className="absolute inset-0 w-full h-full opacity-0 overflow-hidden cursor-pointer"
    />
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-300 mb-4">
                {translation.verification.secureVerification}
              </h2>
              <p className="text-gray-200 mb-8">
                {translation.verification.secureVerificationDesc}
              </p>
              <button
                onClick={handleNext}
                className="bg-[#53B4AB] text-white px-8 py-3 rounded-lg hover:bg-[#86d7cf] transition-colors text-sm"
              >
                {translation.verification.startVerification}
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid md:grid-cols-2 gap-6 py-8">
            {/* Front ID Section */}
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-[#53B4AB] transition-colors relative">
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center min-h-[200px] justify-center">
                  {frontDoc ? (
                    <>
                      <img
                        src={frontDoc.preview}
                        alt="Front ID preview"
                        className="w-full max-w-[240px] h-48 object-contain mb-4 rounded-lg"
                      />
                      <div className="text-[#53B4AB]">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="inline mr-2"
                        />
                        {translation.verification.frontUploaded}
                      </div>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faCloudUpload}
                        className="text-[#53B4AB] text-4xl mb-4"
                      />
                      <h3 className="font-medium text-gray-300 mb-2">
                        {translation.verification.frontSide}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {translation.verification.fileNote}
                      </p>
                    </>
                  )}
                </div>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileUpload(e, setFrontDoc)
                  }
                />
              </label>
            </div>

            {/* Back ID Section */}
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-[#53B4AB] transition-colors relative">
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center min-h-[200px] justify-center">
                  {backDoc ? (
                    <>
                      <img
                        src={backDoc.preview}
                        alt="Back ID preview"
                        className="w-full max-w-[240px] h-48 object-contain mb-4 rounded-lg"
                      />
                      <div className="text-[#53B4AB]">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="inline mr-2"
                        />
                        {translation.verification.backUploaded}
                      </div>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faCloudUpload}
                        className="text-[#53B4AB] text-4xl mb-4"
                      />
                      <h3 className="font-medium text-gray-300 mb-2">
                        {translation.verification.backSide}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {translation.verification.fileNote}
                      </p>
                    </>
                  )}
                </div>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileUpload(e, setBackDoc)
                  }
                />
              </label>
            </div>

            {(!frontDoc || !backDoc) && (
              <div className="col-span-2 text-center mt-4 text-red-500">
                <p>{translation.verification.bothSidesRequired}</p>
              </div>
            )}
          </div>
        );
        return (
          <div className="grid md:grid-cols-2 gap-6 py-8">
            {/* Front Side Section */}
            <div
              key="front"
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#53B4AB] transition-colors"
            >
              <label className="cursor-pointer">
                <div className="flex flex-col items-center">
                  {frontDoc ? (
                    <img
                      src={frontDoc?.preview}
                      alt="Document preview"
                      className="w-48 h-32 object-contain mb-4 rounded-lg"
                    />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faCloudUpload}
                        className="text-[#53B4AB] text-4xl mb-4"
                      />
                      <h3 className="font-medium text-gray-700 mb-2">
                        Front Side of ID
                      </h3>
                      <p className="text-sm text-gray-500">
                        JPEG, PNG, or PDF (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileUpload(e, setFrontDoc)
                  }
                />
              </label>
              {frontDoc && (
                <div className="mt-4 text-[#53B4AB]">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="inline mr-2"
                  />
                  Upload Successful
                </div>
              )}
            </div>

            {/* Back Side Section */}
            <div
              key="back"
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#53B4AB] transition-colors"
            >
              <label className="cursor-pointer">
                <div className="flex flex-col items-center">
                  {backDoc ? (
                    <img
                      src={backDoc?.preview}
                      alt="Document preview"
                      className="w-48 h-32 object-contain mb-4 rounded-lg"
                    />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faCloudUpload}
                        className="text-[#53B4AB] text-4xl mb-4"
                      />
                      <h3 className="font-medium text-gray-700 mb-2">
                        Back Side of ID
                      </h3>
                      <p className="text-sm text-gray-500">
                        JPEG, PNG, or PDF (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileUpload(e, setBackDoc)
                  }
                />
              </label>
              {backDoc && (
                <div className="mt-4 text-[#53B4AB]">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="inline mr-2"
                  />
                  Upload Successful
                </div>
              )}
            </div>

            {(!frontDoc || !backDoc) && (
              <div className="col-span-2 text-center mt-4 text-red-500">
                <p>Please upload both front and back sides of your ID</p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="py-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6 text-white">
                {translation.verification.liveSelfie}
              </h2>
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="absolute inset-0 border-2 border-gray-200 rounded-full overflow-hidden">
                  {selfieDoc ? (
                    <img
                      src={selfieDoc.preview}
                      alt="Selfie preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faCameraAlt}
                        className="text-gray-400 text-3xl"
                      />
                    </div>
                  )}
                </div>
              </div>
              <label className="bg-[#53B4AB] text-white px-6 py-2 rounded-lg hover:bg-[#a8d4d0] inline-flex items-center cursor-pointer transition-colors">
                <FontAwesomeIcon icon={faCameraAlt} className="mr-2" />
                {selfieDoc
                  ? translation.verification.retakePhoto
                  : translation.verification.takePhoto}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileUpload(e, setSelfieDoc)
                  }
                />
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="py-12 text-center">
            <div className="max-w-xl mx-auto">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-6xl mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold mb-4 text-white">
                {translation.verification.verificationComplete}
              </h2>
              <p className="text-gray-300 mb-8">
                {translation.verification.confirmationMessage}
              </p>
            </div>
          </div>
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <div className="min-h-screen bg-imgg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <Image
            width={160}
            height={40}
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/82abf788e81d00493505b733772e69127dd1ec73b52053d9ddbb4f60508f2764" // Update with your logo path
            alt="Company Logo"
            className="mx-auto"
          />
        </div>

        {/* Progress Steps */}
        <div className="mb-12" dir="ltr">
          <div className="flex justify-between items-start relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Step circle and number/icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors z-50
                     ${index <= activeStep ? "bg-[#53B4AB] text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {index < activeStep ? (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="w-5 h-5 "
                    />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step labels */}
                <div className="text-center px-2">
                  <p
                    className={`text-sm font-medium ${index <= activeStep ? "text-gray-300" : "text-gray-300"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-full -ml-[calc(50%+20px)] w-full h-1 
            ${index < activeStep ? "bg-[#53B4AB]" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[#1F1F1F] rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          {activeStep >= steps.length ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Verification Successful!
              </h2>
              <p className="text-gray-300 mb-8">
                You'll receive a confirmation email with transaction details
                shortly.
              </p>
            </div>
          ) : (
            <>{getStepContent(activeStep)}</>
          )}
        </div>

        {/* Navigation Controls */}
        {activeStep < steps.length && activeStep > 0 && (
          <div
            className="flex justify-between items-center bg-[#1F1F1F] rounded-xl shadow-sm p-6"
            dir="ltr"
          >
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />{" "}
              {translation.verification.back}
            </button>
            <button
              onClick={handleNext}
              disabled={
                (activeStep === 1 && (!frontDoc || !backDoc)) ||
                (activeStep === 2 && !selfieDoc)
              }
              className="bg-[#53B4AB] text-white px-6 py-2 rounded-lg hover:bg-[#7de7dc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {activeStep === steps.length - 1
                ? translation.verification.submit
                : translation.verification.continue}
              <FontAwesomeIcon icon={faArrowRight} className="inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
