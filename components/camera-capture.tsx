"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  isLoading?: boolean
}

export function CameraCapture({ onCapture, isLoading = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isUnsupported, setIsUnsupported] = useState(false)

  useEffect(() => {
    const requestCameraAccess = async () => {
      if (
        typeof navigator.mediaDevices === "undefined" ||
        typeof navigator.mediaDevices.getUserMedia === "undefined"
      ) {
        console.error("Camera API is not supported in this browser.");
        setIsUnsupported(true);
        setHasPermission(false);
        return;
      }

      try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current && videoRef.current instanceof HTMLVideoElement) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        if (err instanceof DOMException) {
          console.error("DOMException type:", err.name, err.message);
        }
        setHasPermission(false);
      }
    };

    requestCameraAccess();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        // Define the dimensions of the highlighted rectangle
        const rectWidth = 256; // w-64
        const rectHeight = 96; // h-24

        // Calculate the position of the rectangle to be in the center
        const sx = (videoRef.current.videoWidth - rectWidth) / 2
        const sy = (videoRef.current.videoHeight - rectHeight) / 2

        // Set canvas dimensions to the size of the rectangle
        canvasRef.current.width = rectWidth
        canvasRef.current.height = rectHeight

        // Draw the cropped image from the video onto the canvas
        context.drawImage(
          videoRef.current,
          sx,
          sy,
          rectWidth,
          rectHeight,
          0,
          0,
          rectWidth,
          rectHeight
        )
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        onCapture(imageData)
      }
    }
  }

  if (isUnsupported) {
    // Check if the browser is Brave on Android
    if (navigator.userAgent.includes("Brave") && navigator.userAgent.includes("Android")) {
      return (
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">
            Camera is not fully supported on this version of Brave for Android. Please try a different browser.
          </p>
        </Card>
      );
    }
  }
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 mb-4">
          Camera is not supported on this browser. Please use a different browser.
        </p>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 mb-4">
          Camera permission denied. Please enable camera access in your browser settings.
        </p>
      </Card>
    )
  }

  if (hasPermission === null) {
    return <Card className="p-8 text-center">Requesting camera access...</Card>
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border-2 border-primary/30 bg-black">
        <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-24 border-2 border-yellow-400 rounded-lg opacity-75"></div>
          </div>
        </div>
      </div>
      <Button onClick={handleCapture} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90" size="lg">
        {isLoading ? "Processing..." : "Capture License Plate"}
      </Button>
    </div>
  )
}
