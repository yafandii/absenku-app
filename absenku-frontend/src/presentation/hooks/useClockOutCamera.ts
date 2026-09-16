import { useState, useRef, useCallback, useEffect } from "react";

export function useClockOutCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);

  const stopMediaTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    stopMediaTracks();
    setIsCameraStreaming(false);
  }, [stopMediaTracks]);

  const startCamera = useCallback(() => {
    stopMediaTracks();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Kamera tidak didukung di peramban ini.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      .then((stream) => {
        streamRef.current = stream;
        setIsCameraStreaming(true);
        setIsPermissionBlocked(false);
        setCameraError(null);
        setPhotoPreview(null);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((err: unknown) => {
        setIsCameraStreaming(false);
        const isBlocked =
          (err instanceof DOMException &&
            (err.name === "NotAllowedError" ||
              err.name === "PermissionDeniedError")) ||
          (typeof err === "object" &&
            err !== null &&
            "name" in err &&
            (err as { name: string }).name === "NotAllowedError");

        if (isBlocked) {
          setIsPermissionBlocked(true);
          setCameraError("Izin akses kamera diblokir oleh browser.");
        } else {
          setIsPermissionBlocked(false);
          setCameraError(
            "Kamera sedang digunakan aplikasi lain atau tidak tersedia.",
          );
        }
      });
  }, [stopMediaTracks]);

  const captureSnapshot = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const size = Math.min(vWidth, vHeight);
    const startX = (vWidth - size) / 2;
    const startY = (vHeight - size) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL("image/png");
    setPhotoPreview(dataUrl);
    stopStream();
  }, [stopStream]);

  const retakePhoto = useCallback(() => {
    setPhotoPreview(null);
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

  return {
    videoRef,
    photoPreview,
    isCameraStreaming,
    cameraError,
    isPermissionBlocked,
    startCamera,
    stopStream,
    captureSnapshot,
    retakePhoto,
  };
}
