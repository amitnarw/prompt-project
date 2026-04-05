'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { PlaygroundInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/AuthGuard';

export default function PlaygroundPage() {
  return (
    <AuthGuard>
      <PlaygroundContent />
    </AuthGuard>
  );
}

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [variableInput, setVariableInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: usageData } = useQuery({
    queryKey: ['playground-usage'],
    queryFn: () => api.playground.getUsage(),
  });

  const usage = usageData?.data;
  const isLimitReached = usage && usage.remaining <= 0 && usage.limit !== -1;

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setPrompt(promptParam);
    }
  }, [searchParams]);

  const runMutation = useMutation({
    mutationFn: (data: PlaygroundInput) => api.playground.run(data),
    onSuccess: (result) => {
      if (result.data) {
        setResponse(result.data.response);
      }
    },
    onError: (error: any) => {
      if (error?.message?.includes('Daily limit')) {
        toast.error('Daily limit reached. Upgrade your plan for more prompts.');
      } else {
        toast.error('Failed to run prompt');
      }
    },
  });

  const handleRun = () => {
    runMutation.mutate({
      prompt,
      variables: Object.keys(variables).length > 0 ? variables : undefined,
    });
  };

  const handleAddVariable = () => {
    if (variableInput.trim()) {
      const [key, ...valueParts] = variableInput.split('=');
      const keyTrimmed = key.trim();
      const valueTrimmed = valueParts.join('=').trim();

      if (keyTrimmed && !keyTrimmed.match(/^{{.+}}$/)) {
        setVariables((prev) => ({
          ...prev,
          [`{{${keyTrimmed}}}`]: valueTrimmed,
        }));
      } else if (keyTrimmed) {
        setVariables((prev) => ({
          ...prev,
          [keyTrimmed]: valueTrimmed,
        }));
      }
      setVariableInput('');
    }
  };

  const handleRemoveVariable = (key: string) => {
    setVariables((prev) => {
      const newVars = { ...prev };
      delete newVars[key];
      return newVars;
    });
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#e7e5e4]">Prompt Playground</h1>
              <p className="text-[#acabaa] mt-1">
                Test your prompts with simulated AI responses
              </p>
            </div>

            {/* Usage Stats */}
            {usage && (
              <div className="flex items-center gap-3">
                <Badge variant={isLimitReached ? 'destructive' : 'secondary'} className="px-3 py-1.5 text-sm">
                  {isLimitReached ? (
                    <><AlertCircle className="h-4 w-4 mr-1" /> Limit Reached</>
                  ) : usage.limit === -1 ? (
                    'Unlimited'
                  ) : (
                    `${usage.remaining} of ${usage.limit} prompts remaining`
                  )}
                </Badge>
                {usage.limit !== -1 && !isLimitReached && (
                  <span className="text-xs text-[#acabaa]">
                    Resets at {new Date(usage.resetsAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#e7e5e4]">Prompt</CardTitle>
                <CardDescription className="text-[#acabaa]">
                  Enter your prompt. Use {'{{variable}}'} syntax for variables.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  rows={10}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleRun}
                  disabled={!prompt.trim() || runMutation.isPending || isLimitReached}
                  className="w-full gap-2"
                >
                  {runMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : isLimitReached ? (
                    'Daily Limit Reached'
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#e7e5e4]">Variables</CardTitle>
                <CardDescription className="text-[#acabaa]">
                  Add variable values to replace {'{{placeholder}}'} in your prompt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    placeholder="variableName=value"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddVariable();
                      }
                    }}
                  />
                  <Button onClick={handleAddVariable} variant="secondary">
                    Add
                  </Button>
                </div>
                {Object.keys(variables).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(variables).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-[#131313] px-3 py-2"
                      >
                        <span className="font-mono text-sm text-[#e7e5e4]">
                          <span className="text-[#acabaa]">{key}:</span>{' '}
                          {value}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariable(key)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {Object.keys(variables).length === 0 && (
                  <p className="text-sm text-[#acabaa]">
                    No variables added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="lg:sticky lg:top-4 h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#e7e5e4]">Response</CardTitle>
                <CardDescription className="text-[#acabaa]">Simulated AI response</CardDescription>
              </div>
              {response && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyResponse}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!response ? (
                <div className="flex items-center justify-center h-64 text-[#acabaa]">
                  <p>Run a prompt to see the response here</p>
                </div>
              ) : (
                <pre className="bg-[#131313] p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto text-[#e7e5e4]">
                  {response}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
