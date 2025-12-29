"use client"

import { useEffect, useRef, useState } from "react"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  isLoading?: boolean
}

export function CameraCapture({ onCapture, isLoading = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isUnsupported, setIsUnsupported] = useState(false)

  useEffect(() => {
    const requestCameraAccess = async () => {
      if (
        typeof navigator === "undefined" ||
        typeof navigator.mediaDevices === "undefined" ||
        typeof navigator.mediaDevices.getUserMedia === "undefined"
      ) {
        console.warn("Camera API is not supported in this browser.  Please ensure your browser supports the camera API and that it is enabled.");
        setIsUnsupported(true);
        setHasPermission(false);
        return;
      }

      try {
        console.log("Requesting camera access...")
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasPermission(true)
        }
      } catch (err) {
        console.error("Camera access denied:", err)
        if (err instanceof DOMException) {
          console.error("DOMException type:", err.name, err.message)
        }
        setHasPermission(false)
      }
    }

    requestCameraAccess()

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
        const rectWidth = 256
        const rectHeight = 96

        const sx = (videoRef.current.videoWidth - rectWidth) / 2
        const sy = (videoRef.current.videoHeight - rectHeight) / 2

        canvasRef.current.width = rectWidth
        canvasRef.current.height = rectHeight

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
    const ua = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : ""
    const isBraveAndroid = ua.includes("brave") && ua.includes("android")

    return (
      <div className="p-8 text-center border rounded-md">
        <p className="text-red-500 mb-4">
          {isBraveAndroid
            ? "Camera is not fully supported on this version of Brave for Android. Please try a different browser."
            : "Camera is not supported on this browser. Please use a different browser."}
        </p>
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <div className="p-8 text-center border rounded-md">
        <p className="mb-4">Please allow camera permission in your browser.</p>
      </div>
    )
  }

  if (hasPermission === null) {
    return <div className="p-8 text-center border rounded-md">Requesting camera access...</div>
  }

  return (
    <div>
      <div className="p-4 text-center border rounded-md space-y-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="mx-auto rounded-md max-w-full"
        />
        <canvas ref={canvasRef} className="hidden" />
        <button
          type="button"
          onClick={handleCapture}
          disabled={isLoading}
          className="px-4 py-2 rounded-md border disabled:opacity-50"
        >
          {isLoading ? "Capturing..." : "Capture"}
        </button>
      </div>
    </div>
  )
}
