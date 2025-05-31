
import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, X } from 'lucide-react'

interface MediaUploadProps {
  onUpload: (file: File, type: 'image' | 'audio') => void
  onClose: () => void
}

export function MediaUpload({ onUpload, onClose }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      onUpload(file, 'image')
    }
  }

  return (
    <div className="absolute bottom-full right-0 mb-2 w-72">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Enviar Imagem</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-4 w-4 mr-2" />
            Selecionar Imagem
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Formatos suportados: JPG, PNG, GIF
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
