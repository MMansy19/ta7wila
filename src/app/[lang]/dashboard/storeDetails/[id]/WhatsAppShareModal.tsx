"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/[lang]/ui/sheet";
import { Textarea } from "@/components/[lang]/ui/textarea";
import { MessageCircle } from "lucide-react";

interface Props {
  storeName: string;
  paymentLink: string;
}

export default function WhatsAppShareModal({ storeName, paymentLink }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const messageTemplates = [
    {
      id: 1,
      name: "رابط بسيط",
      template: `مرحباً بك في ${storeName}!\nيمكنك الدفع من خلال الرابط التالي:\n{link}`,
    },
    {
      id: 2,
      name: "وصف",
      template: `مرحباً بك في ${storeName}!\nيسعدنا خدمتك. للدفع، يرجى استخدام الرابط أدناه:\n{link}\nشكراً لثقتك بنا!`,
    },
    {
      id: 3,
      name: "احترافي",
      template: `مرحباً بك في ${storeName}!\nنشكرك على اختيارنا. يمكنك إتمام عملية الدفع بكل سهولة وأمان من خلال الرابط التالي:\n{link}\nإذا كان لديك أي استفسار، لا تتردد في التواصل معنا.\nنسعد بخدمتك دائماً!`,
    },
  ];

  useEffect(() => {
    if (selectedTemplate !== null) {
      const template = messageTemplates.find((t) => t.id === selectedTemplate);
      if (template) {
        setEditedMessage(template.template.replace("{link}", paymentLink));
      }
    }
  }, [selectedTemplate, paymentLink]);

  const handleShare = () => {
    const cleanPhone = phoneNumber.trim().replace(/[^0-9]/g, "");
    const fullPhoneNumber = cleanPhone.startsWith("2") ? cleanPhone : `2${cleanPhone}`;
    const message = isCustomMode ? customMessage : editedMessage;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${fullPhoneNumber}?text=${encodedMessage}`, "_blank");
    setIsOpen(false); // Close the modal after sharing
  };

  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleShare();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span>مشاركة عبر واتساب</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-[500px] p-6 bg-slate-900 border-slate-800">
        <SheetHeader className="text-right mb-6">
          <SheetTitle className="text-2xl font-bold text-white">مشاركة عبر واتساب</SheetTitle>
        </SheetHeader>

        {/* Message Templates */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap gap-2">
            {messageTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setIsCustomMode(false);
                  setEditedMessage(template.template.replace("{link}", paymentLink));
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTemplate === template.id && !isCustomMode
                    ? "bg-green-500 text-white"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {template.name}
              </button>
            ))}
            <button
              onClick={() => {
                setIsCustomMode(true);
                setSelectedTemplate(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isCustomMode
                  ? "bg-green-500 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              رسالة مخصصة
            </button>
          </div>

          {/* Message Preview/Edit */}
          <div className="w-full">
            <Textarea
              value={isCustomMode ? customMessage : editedMessage}
              onChange={(e) =>
                isCustomMode
                  ? setCustomMessage(e.target.value)
                  : setEditedMessage(e.target.value)
              }
              className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-slate-200 placeholder-slate-400"
              dir="rtl"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="flex flex-col gap-2 w-full mt-6">
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={handlePhoneKeyPress}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-slate-200 placeholder-slate-400"
            dir="rtl"
          />
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-lg"
        >
          مشاركة
        </button>
      </SheetContent>
    </Sheet>
  );
} 