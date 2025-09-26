"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateStudyAidsAction } from '@/lib/actions';
import type { Flashcard as FlashcardType } from '@/lib/types';
import { Flashcard } from '@/components/Flashcard';
import { Download, Loader2, Sparkles, Trash2, Copy } from 'lucide-react';

export default function Home() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const savedContent = localStorage.getItem('studyboost-content');
    const savedSummary = localStorage.getItem('studyboost-summary');
    const savedFlashcards = localStorage.getItem('studyboost-flashcards');
    if (savedContent) setContent(savedContent);
    if (savedSummary) setSummary(savedSummary);
    if (savedFlashcards) setFlashcards(JSON.parse(savedFlashcards));
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    localStorage.setItem('studyboost-content', newContent);
  };

  const handleGenerate = () => {
    if (content.trim().length < 50) {
      toast({
        variant: 'destructive',
        title: 'Content too short',
        description: 'Please enter at least 50 characters to generate study aids.',
      });
      return;
    }

    startTransition(async () => {
      setSummary('');
      setFlashcards([]);
      const result = await generateStudyAidsAction({ content });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Study Aids',
          description: result.error,
        });
      } else if (result.summary && result.flashcards) {
        setSummary(result.summary);
        setFlashcards(result.flashcards);
        localStorage.setItem('studyboost-summary', result.summary);
        localStorage.setItem('studyboost-flashcards', JSON.stringify(result.flashcards));
        toast({
          title: 'Success!',
          description: 'Your new study aids are ready.',
        });
      }
    });
  };

  const clearAll = () => {
    setContent('');
    setSummary('');
    setFlashcards([]);
    localStorage.removeItem('studyboost-content');
    localStorage.removeItem('studyboost-summary');
    localStorage.removeItem('studyboost-flashcards');
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    toast({ title: 'Summary copied to clipboard!' });
  };
  
  const exportToCSV = () => {
    if (flashcards.length === 0) return;
    const headers = 'question,answer\n';
    const rows = flashcards
      .map(fc => `"${fc.question.replace(/"/g, '""')}","${fc.answer.replace(/"/g, '""')}"`)
      .join('\n');
    const csvContent = headers + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-s-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'flashcards.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showResults = summary || flashcards.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight">Supercharge Your Studies</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Paste your lecture notes, articles, or any text to instantly generate concise summaries and interactive flashcards.
        </p>
      </section>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Your Content</CardTitle>
          <CardDescription>Paste your text here. Minimum 50 characters required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your lecture notes or text here..."
            value={content}
            onChange={handleContentChange}
            className="min-h-[200px] text-base"
            disabled={isPending}
          />
          <div className="flex flex-wrap gap-2 mt-4 justify-end">
            <Button variant="outline" onClick={clearAll} disabled={isPending || !content}><Trash2 /> Clear</Button>
            <Button onClick={handleGenerate} disabled={isPending || content.trim().length < 50}>
              {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isPending ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {!isPending && showResults && (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
          {summary && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>Your concise, AI-generated notes.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={copySummary}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{summary}</p>
              </CardContent>
            </Card>
          )}

          {flashcards.length > 0 && (
            <Card>
              <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Flashcards</CardTitle>
                      <CardDescription>Click on a card to flip it. Review your key concepts.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={exportToCSV}>
                      <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flashcards.map((fc, index) => (
                    <Flashcard key={index} question={fc.question} answer={fc.answer} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
