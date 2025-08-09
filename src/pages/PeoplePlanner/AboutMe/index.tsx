import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Check, X } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  description: string;
  supportedBy?: string;
  emoji?: string;
}

export default function AboutMe() {
  const userName = "Ainna Begum Khan Zadran";
  const reviewerInfo = "Reviewed: 27-06-2025 - Kishour Zadd";

  const initialQuestions: Question[] = [
    {
      id: 'important-to-me',
      title: 'What is important to me',
      description: 'It is important to me that I feel safe, respected, and understood. I value my family\'s involvement in my care and appreciate when people take the time to build trust with me. I enjoy going for short walks, visiting coffee shops, and participating in light shopping, as this helps me stay connected and reduce feelings of isolation. I also need my daily routine to be consistent, calm, and structured, especially because I struggle with anxiety, confusion, and sleep issues. I value the close relationship I have with my family, particularly my daughters, sons and husband, who play a central role in my care and wellbeing. Building trust and maintaining a calm, familiar routine are key to helping me feel secure, especially during times when my mental health symptoms are heightened.',
      supportedBy: 'My son Shaquile Noor who knows me well and understands my care needs and the staff from Everycare Romford.',
      emoji: '😊'
    },
    {
      id: 'important-people',
      title: 'People who are important to me',
      description: 'My family is very important to me, especially my daughter Hanifa, who lives with me and provides daily support, and my son Shaquile Noor, who is actively involved in my care. My husband also plays a few roles in my care for our life, contributing to both emotional and practical support.',
            supportedBy: 'My son Shaquile Noor who knows me well and understands my care needs and the staff from Everycare Romford.',

      emoji: '😊'
    },
    {
      id: 'daily-routine',
      title: 'My daily routine',
      description: 'I prefer waking up at 8am and having breakfast with my family. I enjoy light activities in the morning and need an afternoon rest. Evenings are for family time and relaxation.',
      emoji: '⏰',
            supportedBy: 'My son Shaquile Noor who knows me well and understands my care needs and the staff from Everycare Romford.',

    },
    {
      id: 'communication',
      title: 'How I communicate best',
      description: 'I communicate best when people speak clearly and give me time to respond. I sometimes struggle to find words, so patience is appreciated.',
      emoji: '💬',
            supportedBy: 'My son Shaquile Noor who knows me well and understands my care needs and the staff from Everycare Romford.',

    }
  ];

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, {description: string, supportedBy?: string}>>({});

  const handleEdit = (question: Question) => {
    setTempValues({
      ...tempValues,
      [question.id]: {
        description: question.description,
        supportedBy: question.supportedBy
      }
    });
    setEditingId(question.id);
  };

  const handleSave = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { 
        ...q, 
        description: tempValues[id].description,
        supportedBy: tempValues[id].supportedBy
      } : q
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (id: string, field: 'description' | 'supportedBy', value: string) => {
    setTempValues({
      ...tempValues,
      [id]: {
        ...tempValues[id],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">About {userName}</h1>
        <div className="text-sm text-gray-500">{reviewerInfo}</div>
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  {question.title} {question.emoji && <span className="ml-2">{question.emoji}</span>}
                </CardTitle>
                {editingId !== question.id ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(question)}
                    className="shrink-0"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSave(question.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                {editingId === question.id ? (
                  <Textarea
                    value={tempValues[question.id]?.description || ''}
                    onChange={(e) => handleChange(question.id, 'description', e.target.value)}
                    className="min-h-[150px]"
                  />
                ) : (
                  <p className="whitespace-pre-line text-gray-700">{question.description}</p>
                )}
              </div>

              {question.supportedBy && (
                <div>
                  <h3 className="font-medium mb-2">Supported to write this by</h3>
                  {editingId === question.id ? (
                    <Input
                      value={tempValues[question.id]?.supportedBy || ''}
                      onChange={(e) => handleChange(question.id, 'supportedBy', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-700">{question.supportedBy}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}