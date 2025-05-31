
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, Square, Send, X } from 'lucide-react'

interface VoiceRecorderProps {
  onRecordingComplete: (file: File) => void
  onClose: () => void
}

export function VoiceRecorder({ onRecordingComplete, onClose }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Erro ao acessar microfone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const sendRecording = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `audio-${Date.now()}.webm`, {
        type: 'audio/webm'
      })
      onRecordingComplete(file)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute bottom-full right-0 mb-2 w-72">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Gravar Áudio</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {isRecording && (
              <div className="text-center">
                <div className="text-lg font-mono text-red-600">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-xs text-muted-foreground">Gravando...</p>
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="space-y-2">
                <audio controls className="w-full">
                  <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                </audio>
              </div>
            )}

            <div className="flex gap-2 justify-center">
              {!isRecording && !audioBlob && (
                <Button onClick={startRecording} className="flex-1">
                  <Mic className="h-4 w-4 mr-2" />
                  Gravar
                </Button>
              )}

              {isRecording && (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  <Square className="h-4 w-4 mr-2" />
                  Parar
                </Button>
              )}

              {audioBlob && !isRecording && (
                <>
                  <Button onClick={() => setAudioBlob(null)} variant="outline">
                    Gravar Novamente
                  </Button>
                  <Button onClick={sendRecording}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
