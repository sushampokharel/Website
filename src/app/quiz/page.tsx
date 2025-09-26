"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flashcard } from '@/components/Flashcard';
import type { Flashcard as FlashcardType } from '@/lib/types';
import { ArrowLeft, ArrowRight, Dices, RotateCcw } from 'lucide-react';

export default function QuizPage() {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [originalOrder, setOriginalOrder] = useState<FlashcardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    const savedFlashcards = localStorage.getItem('studyboost-flashcards');
    if (savedFlashcards) {
      const parsedFlashcards: FlashcardType[] = JSON.parse(savedFlashcards);
      setFlashcards(parsedFlashcards);
      setOriginalOrder(parsedFlashcards);
    }
  }, []);

  const shuffleCards = useCallback(() => {
    setFlashcards(prev => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      setCurrentCardIndex(0);
      setIsShuffled(true);
      return shuffled;
    });
  }, []);

  const unshuffleCards = () => {
    setFlashcards(originalOrder);
    setCurrentCardIndex(0);
    setIsShuffled(false);
  }

  const goToNextCard = () => {
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
  };

  const goToPrevCard = () => {
    setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (flashcards.length === 0) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">No Flashcards Found</h2>
        <p className="text-muted-foreground mb-6">
          You need to generate some flashcards on the main page first.
        </p>
        <Button asChild>
          <Link href="/">Generate Study Aids</Link>
        </Button>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">Quiz Mode</h1>
          <p className="text-muted-foreground">
            Test your knowledge. Click a card to reveal the answer.
          </p>
        </div>
        
        <div className="w-full">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Card {currentCardIndex + 1} of {flashcards.length}
            </p>
            <Flashcard key={currentCardIndex} question={currentCard.question} answer={currentCard.answer} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" size="lg" onClick={goToPrevCard}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" onClick={goToNextCard}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          {isShuffled ? (
            <Button variant="secondary" onClick={unshuffleCards}>
              <RotateCcw className="mr-2 h-4 w-4" /> Unshuffle
            </Button>
          ) : (
            <Button variant="secondary" onClick={shuffleCards}>
              <Dices className="mr-2 h-4 w-4" /> Shuffle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
