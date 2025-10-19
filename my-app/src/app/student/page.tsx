"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Loader2, AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

interface Confusion {
  id: string;
  roomId: string;
  topic: string;
  details: string;
  timestamp: string;
}

interface StudentViewProps {
  onBack: () => void;
}

export default function StudentView({ onBack }: StudentViewProps) {
  const [step, setStep] = useState<'join' | 'submit'>('join');
  const [roomId, setRoomId] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<Confusion[]>([]);

  const joinRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/rooms/${roomId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Room not found');
      }

      setCurrentRoomId(roomId.trim());
      setRoomName(data.room.name);
      setStep('submit');
      loadRecentSubmissions(roomId.trim());
    } catch (err: any) {
      console.error('Error joining room:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentSubmissions = async (rId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/rooms/${rId}/confusions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Get last 5 submissions
        setRecentSubmissions((data.confusions || []).slice(0, 5));
      }
    } catch (err: any) {
      console.error('Error loading recent submissions:', err);
    }
  };

  const submitConfusion = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/confusions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            roomId: currentRoomId,
            topic: topic.trim(),
            details: details.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit confusion');
      }

      setSuccess(true);
      setTopic('');
      setDetails('');
      
      // Reload recent submissions
      loadRecentSubmissions(currentRoomId);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error submitting confusion:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh recent submissions every 10 seconds
  useEffect(() => {
    let interval: number;
    if (currentRoomId && step === 'submit') {
      interval = setInterval(() => {
        loadRecentSubmissions(currentRoomId);
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentRoomId, step]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  if (step === 'join') {
    return (
      <div className="min-h-screen relative overflow-hidden p-8">
        <AnimatedBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <motion.div whileHover={{ x: -5 }}>
            <Button variant="outline" onClick={onBack} className="mb-6 backdrop-blur-sm bg-white/80">
              ← Back to Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Join a Class Room
                  </CardTitle>
                </div>
                <CardDescription>
                  Enter the room ID provided by your teacher to submit confusion points anonymously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomId">Room ID</Label>
                  <Input
                    id="roomId"
                    placeholder="e.g., CS101-Fall2025"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                    className="border-2"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={joinRoom} 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'Join Room'
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-6 relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <motion.div whileHover={{ x: -5 }}>
            <Button variant="outline" onClick={onBack} className="backdrop-blur-sm bg-white/80">
              ← Back to Home
            </Button>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Badge variant="outline" className="text-lg px-4 py-2 backdrop-blur-sm bg-white/90 border-2 border-green-300">
              {roomName}
            </Badge>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-green-300 bg-white/90 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Submit Your Confusion
              </CardTitle>
              <CardDescription>
                Your submission is completely anonymous. Let your teacher know what topics are confusing you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="topic">What topic are you confused about?</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Recursion, Pointers, Derivatives..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border-2 focus:border-green-400"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="details">Additional details (Optional)</Label>
                <Textarea
                  id="details"
                  placeholder="Describe what specifically is confusing you..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className="border-2 focus:border-green-400"
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confusion submitted successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={submitConfusion} 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Confusion
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {recentSubmissions.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 border-2 border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="h-5 w-5 text-teal-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Recent Class Submissions
                  </span>
                </CardTitle>
                <CardDescription>
                  See what other students are confused about (all anonymous)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {recentSubmissions.map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                            {submission.topic}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTime(submission.timestamp)}
                          </span>
                        </div>
                        {submission.details && (
                          <p className="text-sm text-gray-700 mt-2">{submission.details}</p>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
