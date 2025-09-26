import { useEffect, useRef } from 'react';

interface Detection {
  bbox: number[];
  class: string;
  score: number;
}

interface DetectionOverlayProps {
  detections: Detection[];
  videoWidth: number;
  videoHeight: number;
  isVisible: boolean;
}

export function DetectionOverlay({
  detections,
  videoWidth,
  videoHeight,
  isVisible,
}: DetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || detections.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up drawing style
    ctx.strokeStyle = '#10B981'; // Green-500
    ctx.fillStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.font = '12px Inter, sans-serif';

    detections.forEach((detection) => {
      const [x, y, width, height] = detection.bbox;

      // Draw bounding box
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      const label = `${detection.class} (${Math.round(detection.score * 100)}%)`;
      const textWidth = ctx.measureText(label).width;
      const textHeight = 16;

      ctx.fillRect(
        x,
        y - textHeight - 4,
        textWidth + 8,
        textHeight + 4,
      );

      // Draw label text
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 4, y - 6);
      ctx.fillStyle = '#10B981';
    });
  }, [detections, isVisible]);

  if (!isVisible || detections.length === 0) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth}
      height={videoHeight}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
