"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/[lang]/ui/sheet";
import { Button } from "@/components/[lang]/ui/button";
import { Input } from "@/components/[lang]/ui/input";
import { MessageCircle } from "lucide-react";

const messageTemplates = [
  {
    id: 1,
    name: "Simple Link",
    template: "Check out this link: {link}",
  },
  {
    id: 2,
    name: "With Description",
    template: "Hi! I'd like to share this with you: {link}\n\nThis is a great resource that might interest you.",
  },
  {
    id: 3,
    name: "Professional",
    template: "Greetings,\n\nI wanted to share an important resource with you: {link}\n\nPlease take a look when you have a moment.\n\nBest regards",
  },
];

interface WhatsAppShareModalProps {
  link: string;
}

export default function WhatsAppShareModal({ link }: WhatsAppShareModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(messageTemplates[0]);
  const [customMessage, setCustomMessage] = useState("");

  const handleShare = () => {
    // Format phone number by removing any non-digit characters
    const formattedPhone = phoneNumber.replace(/\D/g, "");
    
    // Get the final message (either custom or from template)
    const message = customMessage || selectedTemplate.template.replace("{link}", link);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          Share via WhatsApp
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Share via WhatsApp</SheetTitle>
          <SheetDescription>
            Send this link to someone via WhatsApp
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="Enter phone number with country code"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Message Template
            </label>
            <div className="space-y-2">
              {messageTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTemplate.id === template.id
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.template.replace("{link}", "...")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Custom Message (Optional)
            </label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              placeholder="Write your own message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to use the selected template
            </p>
          </div>

          <Button className="w-full" onClick={handleShare}>
            Open WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 