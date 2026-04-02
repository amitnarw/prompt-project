'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { PlaygroundInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [variableInput, setVariableInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    onError: () => {
      toast.error('Failed to run prompt');
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
          <h1 className="text-3xl font-bold tracking-tight">Prompt Playground</h1>
          <p className="text-muted-foreground mt-1">
            Test your prompts with simulated AI responses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt</CardTitle>
                <CardDescription>
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
                  disabled={!prompt.trim() || runMutation.isPending}
                  className="w-full gap-2"
                >
                  {runMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running...
                    </>
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
                <CardTitle>Variables</CardTitle>
                <CardDescription>
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
                        className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2"
                      >
                        <span className="font-mono text-sm">
                          <span className="text-muted-foreground">{key}:</span>{' '}
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
                  <p className="text-sm text-muted-foreground">
                    No variables added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="lg:sticky lg:top-4 h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Response</CardTitle>
                <CardDescription>Simulated AI response</CardDescription>
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
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Run a prompt to see the response here</p>
                </div>
              ) : (
                <pre className="bg-muted/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap overflow-x-auto">
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
