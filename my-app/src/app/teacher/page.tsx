"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import {
  Loader2,
  Sparkles,
  Trash2,
  Users,
  TrendingUp,
  Brain,
} from "lucide-react";
import { AnimatedBackground } from "@components/ui/AnimatedBackground";
import {
  projectId,
  publicAnonKey,
} from "@components/utils/info";


interface Confusion {
  id: string;
  roomId: string;
  topic: string;
  details: string;
  timestamp: string;
}

interface TeacherDashboardProps {
  onBack: () => void;
}

export default function TeacherDashboard({
  onBack,
}: TeacherDashboardProps) {
  const [step, setStep] = useState<"create" | "view">("create");
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [confusions, setConfusions] = useState<Confusion[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const joinRoom = async () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/rooms/${roomId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Room not found");
      }

      setCurrentRoomId(roomId.trim());
      setRoomName(data.room.name);
      setStep("submit");
      loadRecentSubmissions(roomId.trim());
    } catch (err: any) {
      console.error("Error joining room:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!roomId.trim() || !roomName.trim()) {
      setError("Please provide both room ID and room name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/rooms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            roomId: roomId.trim(),
            roomName: roomName.trim(),
            teacherName: teacherName.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create room");
      }

      setCurrentRoomId(roomId.trim());
      setStep("view");
      loadConfusions(roomId.trim());
    } catch (err: any) {
      console.error("Error creating room:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadConfusions = async (rId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/rooms/${rId}/confusions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load confusions",
        );
      }

      setConfusions(data.confusions || []);
    } catch (err: any) {
      console.error("Error loading confusions:", err);
      setError(err.message);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/rooms/${currentRoomId}/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate summary",
        );
      }

      setSummary(data.summary);
    } catch (err: any) {
      console.error("Error generating summary:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteConfusion = async (confusionKey: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b107cdc9/confusions/${encodeURIComponent(confusionKey)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete confusion");
      }

      loadConfusions(currentRoomId);
    } catch (err: any) {
      console.error("Error deleting confusion:", err);
      setError(err.message);
    }
  };

  // Auto-refresh confusions every 5 seconds when enabled
  useState(() => {
    let interval: number;
    if (autoRefresh && currentRoomId && step === "view") {
      interval = setInterval(() => {
        loadConfusions(currentRoomId);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  const getConfusionKey = (confusion: Confusion) => {
    return `confusion:${confusion.roomId}:${new Date(confusion.timestamp).getTime()}:${confusion.id}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (step === "create") {
    return (
      <div className="min-h-screen relative overflow-hidden p-8">
        <AnimatedBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <motion.div whileHover={{ x: -5 }}>
            <Button
              variant="outline"
              onClick={onBack}
              className="mb-6 backdrop-blur-sm bg-white/80"
            >
              ← Back to Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Users className="h-6 w-6 text-blue-600" />
                  </motion.div>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Create Teacher Room
                  </CardTitle>
                </div>
                <CardDescription className="text-black">
                  Create a room where students can submit their
                  confusion points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomId">
                    Room ID (Custom)
                  </Label>
                  <Input
                    id="roomId"
                    placeholder="e.g., CS101-Fall2025"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="e.g., Computer Science 101"
                    value={roomName}
                    onChange={(e) =>
                      setRoomName(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherName">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="teacherName"
                    placeholder="e.g., Prof. Smith"
                    value={teacherName}
                    onChange={(e) =>
                      setTeacherName(e.target.value)
                    }
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={createRoom}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Room...
                      </>
                    ) : (
                      "Create Room"
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
          "Join Room"
        )}
      </Button>
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-6 relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <motion.div whileHover={{ x: -5 }}>
            <Button
              variant="outline"
              onClick={onBack}
              className="backdrop-blur-sm bg-white/80"
            >
              ← Back to Home
            </Button>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 backdrop-blur-sm bg-white/90 border-2 border-purple-300"
              >
                Room ID:{" "}
                <span className="font-mono text-purple-600">
                  {currentRoomId}
                </span>
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={
                  autoRefresh
                    ? "bg-gradient-to-r from-green-500 to-teal-500"
                    : ""
                }
              >
                {autoRefresh
                  ? "Auto-refresh ON"
                  : "Auto-refresh OFF"}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => loadConfusions(currentRoomId)}
              >
                Refresh
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Total Submissions",
              icon: Users,
              value: confusions.length.toString(),
              gradient: "from-blue-500 to-cyan-500",
              delay: 0.1,
            },
            {
              title: "Latest Submission",
              icon: TrendingUp,
              value:
                confusions.length > 0
                  ? formatTime(confusions[0].timestamp)
                  : "N/A",
              gradient: "from-purple-500 to-pink-500",
              delay: 0.2,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 border-2 hover:shadow-xl transition-all overflow-hidden relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: stat.delay + 0.2,
                      type: "spring",
                    }}
                  >
                    {stat.value}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 hover:shadow-xl transition-all relative overflow-hidden group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">
                  AI Summary
                </CardTitle>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Brain className="h-5 w-5 text-purple-600" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={generateSummary}
                    disabled={
                      loading || confusions.length === 0
                    }
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
            >
              <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      AI-Generated Summary
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-white/50 p-4 rounded-lg">
                    {summary}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Confusion Submissions
              </CardTitle>
              <CardDescription className="text-black">
                Anonymous submissions from students in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {confusions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 text-gray-500"
                >
                  No confusion submissions yet. Share the room
                  ID with your students!
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {confusions.map((confusion, index) => (
                      <motion.div
                        key={confusion.id}
                        initial={{
                          opacity: 0,
                          x: -20,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          height: "auto",
                        }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                              >
                                {confusion.topic}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatTime(
                                  confusion.timestamp,
                                )}
                              </span>
                            </div>
                            {confusion.details && (
                              <p className="text-gray-700">
                                {confusion.details}
                              </p>
                            )}
                          </div>
                          <motion.div
                            whileHover={{
                              scale: 1.2,
                              rotate: 10,
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deleteConfusion(
                                  getConfusionKey(confusion),
                                )
                              }
                              className="ml-4 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}