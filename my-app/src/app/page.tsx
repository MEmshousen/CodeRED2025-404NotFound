// app/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Sparkles, Brain, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-6xl mx-auto px-8 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse" />
              <GraduationCap className="h-20 w-20 text-purple-600 relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ClArIty
          </motion.h1>

          <motion.p
            className="text-xl text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            A real-time platform powered by <span className="text-purple-600 font-semibold">AI</span> for students to
            anonymously share confusion points
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Teachers card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group"
          >
            <Card className="border-2 border-blue-300 hover:border-blue-500 transition-all hover:shadow-2xl backdrop-blur-sm bg-white/90 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <motion.div
                  className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="h-7 w-7 text-white" />
                </motion.div>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  For Teachers
                </CardTitle>
                <CardDescription>
                  Create a room, share the ID with students, and get real-time insights into what's confusing your class
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Create custom room IDs for your classes</span>
                  </motion.li>
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>View anonymous student submissions in real-time</span>
                  </motion.li>
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Get AI-powered summaries of common confusion themes</span>
                  </motion.li>
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Perfect for large lecture halls and hybrid classes</span>
                  </motion.li>
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/teacher" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                      <Users className="mr-2 h-4 w-4" />
                      Teacher Dashboard
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Students card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group"
          >
            <Card className="border-2 border-green-300 hover:border-green-500 transition-all hover:shadow-2xl backdrop-blur-sm bg-white/90 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <motion.div
                  className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mb-4 shadow-lg"
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6 }}
                >
                  <GraduationCap className="h-7 w-7 text-white" />
                </motion.div>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  For Students
                </CardTitle>
                <CardDescription>Join your class room and anonymously share topics you're confused about</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Join with the room ID from your teacher</span>
                  </motion.li>
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Submit confusion points completely anonymously</span>
                  </motion.li>
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>See what other classmates are confused about</span>
                  </motion.li>
                  <motion.li className="flex items-start gap-2" whileHover={{ x: 5 }}>
                    <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Help your teacher focus on topics that need attention</span>
                  </motion.li>
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/student" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Student Access
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-300 backdrop-blur-sm bg-white/80 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-20 -z-0" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  How It Works
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    num: 1,
                    title: 'Teacher creates a room',
                    desc: 'with a custom ID and shares it with the class',
                    color: 'from-blue-500 to-purple-500',
                    delay: 0.8,
                  },
                  {
                    num: 2,
                    title: 'Students submit confusion points',
                    desc: 'anonymously during or after class',
                    color: 'from-purple-500 to-pink-500',
                    delay: 0.9,
                  },
                  {
                    num: 3,
                    title: 'AI analyzes and summarizes',
                    desc: 'common themes to help teachers focus their efforts',
                    color: 'from-pink-500 to-teal-500',
                    delay: 1.0,
                  },
                ].map((step) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: step.delay }}
                    className="text-center group"
                  >
                    <motion.div
                      className={`bg-gradient-to-br ${step.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-2xl">{step.num}</span>
                    </motion.div>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">{step.title}</strong> {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
