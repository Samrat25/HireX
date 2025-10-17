import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIInterviewProps {
  onInterviewComplete: (score: number) => void;
}

const interviewQuestions = [
  "Tell me about your teaching philosophy.",
  "Describe your research interests and experience.",
  "How do you handle classroom challenges?"
];

export const AIInterview = ({ onInterviewComplete }: AIInterviewProps) => {
  const [mode, setMode] = useState<'chat' | 'audio'>('chat');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      toast({
        title: "Please provide a response",
        variant: "destructive",
      });
      return;
    }

    const newResponses = [...responses, response];
    setResponses(newResponses);
    setResponse('');

    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = Math.floor(Math.random() * 20) + 80; // 80-100
      setIsComplete(true);
      onInterviewComplete(score);
      toast({
        title: "Interview Complete!",
        description: `Your interview score: ${score}%`,
      });
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
      // Simulate recording for 3-5 seconds then auto-stop
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          toast({
            title: "Recording stopped",
            description: "Processing your response...",
          });
          // Simulate AI transcription and processing
          setTimeout(() => {
            setResponse("This is a simulated transcription of your audio response. In a real implementation, this would be the actual transcribed text from your speech.");
            setTimeout(handleSubmitResponse, 1000);
          }, 2000);
        }
      }, Math.random() * 3000 + 2000); // 2-5 seconds
    } else {
      toast({
        title: "Recording stopped",
        description: "Processing your response...",
      });
      setTimeout(() => {
        setResponse("This is a simulated transcription of your audio response.");
        setTimeout(handleSubmitResponse, 1000);
      }, 1500);
    }
    setIsRecording(!isRecording);
  };

  if (isComplete) {
    return (
      <Card className="p-6 border-border/50 shadow-soft">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">AI Interview Complete!</h3>
          <p className="text-muted-foreground">
            Your responses have been analyzed by our AI system.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border/50 shadow-soft">
      <h3 className="text-lg font-semibold mb-4">AI Interview</h3>

      <Tabs value={mode} onValueChange={(v) => setMode(v as 'chat' | 'audio')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="chat">Text Chat</TabsTrigger>
          <TabsTrigger value="audio">Audio Interview</TabsTrigger>
        </TabsList>

        <div className="mb-6 p-4 bg-gradient-card rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Question {currentQuestion + 1} of {interviewQuestions.length}
          </p>
          <p className="font-medium">{interviewQuestions[currentQuestion]}</p>
        </div>

        <TabsContent value="chat" className="space-y-4">
          <Textarea
            placeholder="Type your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <Button onClick={handleSubmitResponse} className="w-full" variant="hero">
            <Send className="h-4 w-4 mr-2" />
            Submit Response
          </Button>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-8">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "hero"}
              onClick={toggleRecording}
              className="h-20 w-20 rounded-full"
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording... Click to stop" : "Click to start recording"}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
