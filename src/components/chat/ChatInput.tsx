import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (value: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 rounded-full border border-input bg-card/80 backdrop-blur px-2 py-1 shadow-[var(--shadow-elev-1)]">
        <Button type="button" variant="ghost" size="icon" className="rounded-full">
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Attach</span>
        </Button>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything..."
          className="border-0 bg-transparent focus-visible:ring-0 h-12 rounded-full text-base"
          disabled={disabled}
        />
        <Button type="button" variant="ghost" size="icon" className="rounded-full">
          <Mic className="h-4 w-4" />
          <span className="sr-only">Voice</span>
        </Button>
        <Button type="submit" variant="hero" size="pill" aria-label="Send">
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
