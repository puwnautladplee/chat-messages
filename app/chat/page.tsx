"use client";
import React, { useEffect, useState } from "react";
import ChatMessage from '@/components/ChatMessage';
export default function ChatPage() {
  return (
    <main className="flex min-h-screen overflow-hidden flex-col items-center justify-between p-6 bg-gray-300">
      <ChatMessage />
    </main>
  );
}