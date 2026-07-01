import { useEffect, useRef, useState, useCallback } from "react";

export interface WebSocketMessage {
  type: "transcription" | "translation" | "risk_alert" | "audio_chunk" | "error" | "status";
  sender: "Patient" | "Doctor";
  text?: string;
  translated_text?: string;
  audio_url?: string;
  is_risk_detected?: boolean;
  risk_details?: {
    severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    warning: string;
  };
  is_emergency?: boolean;
}

export function useWebSocket(consultationId: string | null, token: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!consultationId || !token || wsRef.current) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/api/v1/consultations/stream/${consultationId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected successfully");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WebSocketMessage;
        setMessages((prev) => [...prev, msg]);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
      console.log("WebSocket disconnected, scheduling reconnect...");
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };
  }, [consultationId, token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (consultationId && token) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [consultationId, token, connect, disconnect]);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not open. Message queued or dropped:", message);
    }
  }, []);

  const sendAudioChunk = useCallback((base64Audio: string, sender: "Patient" | "Doctor") => {
    sendMessage({
      type: "audio_chunk",
      sender,
      audio: base64Audio,
    });
  }, [sendMessage]);

  const sendTextMessage = useCallback((text: string, sender: "Patient" | "Doctor") => {
    sendMessage({
      type: "text_message",
      sender,
      text,
    });
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    messages,
    sendAudioChunk,
    sendTextMessage,
    clearMessages,
  };
}
