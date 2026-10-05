import { supabase } from './supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'emoji' | 'image' | 'voice' | 'gif' | 'sticker';
  media_url?: string;
  reply_to_id?: string;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  match_id: string;
  is_pinned: boolean;
  is_muted: boolean;
  is_archived: boolean;
  last_message_at?: string;
}

// Get conversations for a user
export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      match:matches!match_id (
        *,
        user1:profiles!user1_id (id, name, avatar_url, is_verified),
        user2:profiles!user2_id (id, name, avatar_url, is_verified)
      )
    `)
    .in('match_id', 
      (await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true)
      ).data?.map(m => m.id) || []
    )
    .order('last_message_at', { ascending: false, nullsFirst: false });
  
  if (error) throw error;
  return data;
};

// Get messages for a conversation
export const getMessages = async (conversationId: string, limit = 50, offset = 0) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id (id, name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return data?.reverse() || [];
};

// Send a message
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
  messageType: 'text' | 'emoji' | 'image' | 'voice' | 'gif' | 'sticker' = 'text',
  mediaUrl?: string,
  replyToId?: string
) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: messageType,
      media_url: mediaUrl,
      reply_to_id: replyToId,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Update conversation last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  return data as Message;
};

// Edit a message
export const editMessage = async (messageId: string, newContent: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ content: newContent, is_edited: true, updated_at: new Date().toISOString() })
    .eq('id', messageId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Message;
};

// Delete a message (soft delete)
export const deleteMessage = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_deleted: true, content: 'Mensaje eliminado' })
    .eq('id', messageId);
  
  if (error) throw error;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  // Get unread messages
  const { data: unreadMessages } = await supabase
    .from('messages')
    .select('id')
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .not('id', 'in', 
      `(select message_id from message_reads where user_id = '${userId}')`
    );
  
  if (!unreadMessages || unreadMessages.length === 0) return;
  
  const messageIds = unreadMessages.map(m => m.id);
  
  // Insert read receipts
  const reads = messageIds.map(messageId => ({
    message_id: messageId,
    user_id: userId,
  }));
  
  await supabase.from('message_reads').insert(reads);
};

// Get unread count for a conversation
export const getUnreadCount = async (conversationId: string, userId: string) => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .not('id', 'in', 
      `(select message_id from message_reads where user_id = '${userId}')`
    );
  
  if (error) throw error;
  return count || 0;
};

// Pin/unpin conversation
export const togglePinConversation = async (conversationId: string, isPinned: boolean) => {
  const { error } = await supabase
    .from('conversations')
    .update({ is_pinned: isPinned })
    .eq('id', conversationId);
  
  if (error) throw error;
};

// Mute/unmute conversation
export const toggleMuteConversation = async (conversationId: string, isMuted: boolean) => {
  const { error } = await supabase
    .from('conversations')
    .update({ is_muted: isMuted })
    .eq('id', conversationId);
  
  if (error) throw error;
};

// Archive conversation
export const toggleArchiveConversation = async (conversationId: string, isArchived: boolean) => {
  const { error } = await supabase
    .from('conversations')
    .update({ is_archived: isArchived })
    .eq('id', conversationId);
  
  if (error) throw error;
};

// Subscribe to real-time messages
export const subscribeToMessages = (
  conversationId: string,
  onNewMessage: (message: Message) => void
) => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to typing indicators
export const subscribeToTyping = (
  conversationId: string,
  userId: string,
  onTyping: (userId: string, isTyping: boolean) => void
) => {
  const channel = supabase
    .channel(`typing:${conversationId}`, {
      config: {
        presence: { key: userId },
      },
    })
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const typingUsers = Object.entries(state)
        .filter(([_, presences]) => 
          (presences as any[]).some((p: any) => p.typing)
        )
        .map(([uid]) => uid);
      
      typingUsers.forEach(uid => onTyping(uid, true));
    })
    .subscribe();
  
  return {
    setTyping: (isTyping: boolean) => {
      if (isTyping) {
        channel.track({ typing: true, online_at: new Date().toISOString() });
      } else {
        channel.untrack();
      }
    },
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
};
