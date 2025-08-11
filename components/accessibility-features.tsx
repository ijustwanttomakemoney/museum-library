"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accessibility, Volume2, VolumeX, Type, Contrast, MousePointer, Keyboard } from "lucide-react"

interface AccessibilityFeaturesProps {
  className?: string
}

export default function AccessibilityFeatures({ className = "" }: AccessibilityFeaturesProps) {
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)

  useEffect(() => {
    // Apply font size changes
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  useEffect(() => {
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [reducedMotion])

  useEffect(() => {
    // Keyboard navigation detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  return (
    <Card className={`border-0 shadow-lg rounded-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          Options d'accessibilité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Size Control */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            <Type className="w-4 h-4 inline mr-2" />
            Taille du texte
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              disabled={fontSize <= 12}
              aria-label="Diminuer la taille du texte"
              className="rounded-lg"
            >
              A-
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{fontSize}px</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              disabled={fontSize >= 24}
              aria-label="Augmenter la taille du texte"
              className="rounded-lg"
            >
              A+
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(16)}
              className="text-blue-600 hover:text-blue-700"
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4" />
            <span className="font-semibold">Contraste élevé</span>
          </div>
          <Button
            variant={highContrast ? "default" : "outline"}
            size="sm"
            onClick={() => setHighContrast(!highContrast)}
            aria-pressed={highContrast}
            className="rounded-lg"
          >
            {highContrast ? "Activé" : "Désactivé"}
          </Button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            <span className="font-semibold">Réduire les animations</span>
          </div>
          <Button
            variant={reducedMotion ? "default" : "outline"}
            size="sm"
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-pressed={reducedMotion}
            className="rounded-lg"
          >
            {reducedMotion ? "Activé" : "Désactivé"}
          </Button>
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {screenReaderMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="font-semibold">Mode lecteur d'écran</span>
          </div>
          <Button
            variant={screenReaderMode ? "default" : "outline"}
            size="sm"
            onClick={() => setScreenReaderMode(!screenReaderMode)}
            aria-pressed={screenReaderMode}
            className="rounded-lg"
          >
            {screenReaderMode ? "Activé" : "Désactivé"}
          </Button>
        </div>

        {/* Keyboard Navigation Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            <span className="font-semibold">Navigation clavier</span>
          </div>
          <Badge variant={keyboardNavigation ? "default" : "secondary"}>
            {keyboardNavigation ? "Détectée" : "Inactive"}
          </Badge>
        </div>

        {/* Accessibility Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">Conseils d'accessibilité</h3>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Utilisez Tab pour naviguer entre les éléments</li>
            <li>• Appuyez sur Entrée ou Espace pour activer les boutons</li>
            <li>• Utilisez les flèches pour naviguer dans les carrousels</li>
            <li>• Échap ferme les modales et menus</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
