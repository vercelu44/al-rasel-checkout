'use client';
import { ChatUser, identifyChat, loadChat, logoutChat } from '@/lib/omnichannel'
import { useEffect, useRef } from 'react'

export function ChatWidget({ user }: { user: ChatUser | null }): any {
  const signedIn = useRef(false)

  useEffect(() => {
    loadChat('wk_12Kp8TTDAzYJBukuFnv9Srwx5tbDcBqs')
  }, [])

  useEffect(() => {
    if (user) identifyChat(user)
    else if (signedIn.current) logoutChat()   // only on sign-out, so anonymous visitors keep their chat
    signedIn.current = Boolean(user)
  }, [user])

  return null
}