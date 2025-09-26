"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

interface FlashcardProps {
  question: string;
  answer: string;
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-64 w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full transform-style-preserve-3d transition-transform duration-700 ease-in-out ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of the card */}
        <Card className="absolute flex h-full w-full flex-col items-center justify-center p-6 text-center backface-hidden">
          <div className="flex-grow flex items-center justify-center">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Question</p>
              <p className="text-lg font-semibold">{question}</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <RefreshCw size={16} />
          </div>
        </Card>
        
        {/* Back of the card */}
        <Card className="absolute flex h-full w-full flex-col items-center justify-center p-6 text-center backface-hidden rotate-y-180">
          <div className="flex-grow flex items-center justify-center">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Answer</p>
              <p className="text-md">{answer}</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <RefreshCw size={16} />
          </div>
        </Card>
      </div>
    </div>
  );
}
