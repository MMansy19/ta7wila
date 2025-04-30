"use client";

import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  CheckCircle,
  CameraAlt,
  CloudUpload,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import Image from "next/image";

const steps = [
  "Verify Identity",
  "Upload Documents",
  "Take Selfie",
  "Confirm Transfer",
];

export default function VerificationSteps() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [frontId, setFrontId] = useState<string | null>(null);
  const [backId, setBackId] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  const handleNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setFile: Dispatch<SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      setTimeout(handleNext, 1500);
    }
  };

  const VisuallyHiddenInput = (props: any) => (
    <input
      {...props}
      className="absolute inset-0 w-1 h-1 opacity-0 overflow-hidden -z-10"
    />
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="text-white text-center rounded-lg-lg my-10">
            <h2 className="text-xl font-semibold mb-2">
              Identity Verification Required
            </h2>
            <p className="text-gray-600 mb-4">
              To complete your transfer, we need to verify your identity. Please
              have your government-issued ID ready.
            </p>
            <button
              onClick={handleNext}
              className="bg-[#53B4AB] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Begin Verification <ArrowForward className="inline ml-2" />
            </button>
          </div>
        );
      case 1:
        return (
          <div className="mt-6 flex gap-4 justify-center">
            {[
              { label: "Front of ID", file: frontId, setFile: setFrontId },
              { label: "Back of ID", file: backId, setFile: setBackId },
            ].map(({ label, file, setFile }, idx) => (
              <div
                key={idx}
                className="text-white p-6 w-60 text-center rounded-lg-lg"
              >
                <label className="cursor-pointer inline-block">
                  <CloudUpload fontSize="large" />
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFileUpload(e, setFile)
                    }
                  />
                </label>
                <p className="text-sm text-gray-600 mt-2">{label}</p>
                {file && <CheckCircle className="text-[#53B4AB] mt-2" />}
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Take a Live Selfie</h2>
            <div className="w-48 h-48 mx-auto mb-4 rounded-lg-full border-2 flex items-center justify-center">
              <CameraAlt fontSize="large" />
            </div>
            <label className="bg-[#53B4AB] text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center cursor-pointer">
              <CameraAlt className="mr-2" /> Take Photo
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(e, setSelfie)
                }
              />
            </label>
            {selfie && (
              <div className="mt-4 flex justify-center items-center gap-2">
                <img
                  src={selfie}
                  alt="Selfie"
                  className="w-36 h-auto rounded-lg-md"
                />
                <CheckCircle className="text-[#53B4AB]" />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="bg-white shadow-md p-6 text-center rounded-lg-lg">
            <CheckCircle className="text-[#53B4AB] text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Verification Complete!
            </h2>
            <p className="text-gray-600">
              Your transfer of $1,500.00 to John Doe has been processed.
            </p>
            <p className="text-gray-600">Estimated arrival: 2 business days</p>
            <button
              onClick={handleNext}
              className="bg-[#53B4AB] text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-700"
            >
              Finish
            </button>
          </div>
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-imgg p-6">
      <div>
        <Image
          width={200}
          height={200}
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/82abf788e81d00493505b733772e69127dd1ec73b52053d9ddbb4f60508f2764"
          className="object-contain w-36 mx-auto"
          alt="Company Logo"
        />
        <div className="flex flex-col items-center max-w-4xl mx-auto py-6">
          <div className="flex justify-between w-full mb-8">
            {steps.map((label, index) => (
              <div
                key={index}
                className={`flex-1 text-center py-2 border-b-4 transition-all ${
                  index === activeStep
                    ? "border-[#53B4AB] text-[#53B4AB] font-semibold"
                    : index < activeStep
                      ? "border-[#53B4AB] text-[#53B4AB]"
                      : "border-gray-300 text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="w-full min-h-[400px] text-white p-6 py-6">
            {activeStep >= steps.length ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  🎉 Transfer Successful!
                </h2>
                <p className="text-gray-600">
                  Your funds have been transferred. You'll receive a
                  confirmation email shortly.
                </p>
              </div>
            ) : (
              <>{getStepContent(activeStep)}</>
            )}
          </div>
          {activeStep < steps.length && (
            <div className="flex justify-between items-center w-full mt-6 px-6 pb-6">
              <button
                onClick={handleBack}
                disabled={activeStep === 0}
                className="border border-gray-300 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ArrowBack className="inline mr-1" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (activeStep === 1 && (!frontId || !backId)) ||
                  (activeStep === 2 && !selfie)
                }
                className="bg-[#53B4AB] text-white px-6 py-2 rounded-lg hover:bg-[#4acabd] disabled:opacity-50"
              >
                {activeStep === 0 ? "Start Verification" : "Continue"}{" "}
                <ArrowForward className="inline ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
