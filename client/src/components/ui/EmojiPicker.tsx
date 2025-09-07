import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmojiPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
  placeholder?: string;
  className?: string;
}

const EMOJI_CATEGORIES = {
  food: {
    name: "Food & Drink",
    emojis: [
      "🍽️", "🍕", "🍔", "🍟", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆",
      "🥘", "🍝", "🍜", "🍲", "🍛", "🍣", "🍤", "🍙", "🥟", "🍘",
      "🍚", "🥠", "🥡", "🧀", "🥚", "🥓", "🥩", "🍖", "🍗", "🥖",
      "🥨", "🥯", "🧈", "🥞", "🧇", "🍰", "🎂", "🧁", "🍮", "🍭",
      "🍬", "🍫", "🍿", "🍩", "🍪", "🥜", "🍯", "🥛", "🍼", "☕",
      "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸",
      "🍹", "🍾", "🧊", "🥄", "🍴", "🥢"
    ]
  },
  activity: {
    name: "Activity & Sports",
    emojis: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
      "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥊", "🥋",
      "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂",
      "🏋️", "🤼", "🤸", "⛹️", "🤺", "🏌️", "🏇", "🧘", "🏄", "🏊",
      "🤽", "🚣", "🧗", "🚴", "🚵", "🏃", "🚶", "🧎", "🧍", "🤾"
    ]
  },
  objects: {
    name: "Objects",
    emojis: [
      "🎯", "🎪", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷",
      "🎺", "🎸", "🪕", "🎻", "🪘", "🎲", "♠️", "♥️", "♦️", "♣️",
      "♟️", "🃏", "🀄", "🎴", "🎭", "🖼️", "🎨", "🧵", "🪢", "🧶",
      "🪡", "🧷", "📎", "🖇️", "📏", "📐", "✂️", "📌", "📍", "🗺️",
      "⛽", "🚨", "🚥", "🚦", "🛑", "🚧", "⚓", "⛵", "🛶", "🚤",
      "🛥️", "🛳️", "⛴️", "🚁", "🛸", "🚀", "🛰️", "💺", "🧳", "⌛"
    ]
  },
  symbols: {
    name: "Symbols",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
      "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐",
      "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐",
      "♑", "♒", "♓", "🆔", "⚡", "💥", "💫", "⭐", "🌟", "✨",
      "⚡", "💧", "🌊", "🔥", "💨", "❄️", "☁️", "🌈", "☀️", "🌞"
    ]
  },
  faces: {
    name: "Smileys",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
      "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚",
      "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭",
      "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😶‍🌫️", "😏", "😒",
      "🙄", "😬", "😮‍💨", "🤥", "😔", "😪", "🤤", "😴", "😷", "🤒"
    ]
  }
};

export default function EmojiPicker({ value, onChange, placeholder = "🎯", className }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("food");

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setOpen(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-20 text-center text-lg"
        data-testid="emoji-input"
      />
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            data-testid="emoji-picker-trigger"
          >
            😊
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="food" className="text-xs">🍕</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">⚽</TabsTrigger>
              <TabsTrigger value="objects" className="text-xs">🎯</TabsTrigger>
              <TabsTrigger value="symbols" className="text-xs">❤️</TabsTrigger>
              <TabsTrigger value="faces" className="text-xs">😀</TabsTrigger>
            </TabsList>
            
            {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
              <TabsContent key={key} value={key} className="p-4">
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-700">{category.name}</h4>
                </div>
                <ScrollArea className="h-48">
                  <div className="grid grid-cols-8 gap-2">
                    {category.emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => handleEmojiSelect(emoji)}
                        data-testid={`emoji-${emoji}`}
                      >
                        <span className="text-lg">{emoji}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}