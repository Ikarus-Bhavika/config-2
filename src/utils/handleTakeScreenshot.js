import html2canvas from 'html2canvas'

export default function handleTakeScreenshot(canvasRef) {
  setTimeout(() => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current).then(function (canvas) {
        const link = document.createElement('a')
        link.download = 'screenshot.png'
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }, 100)
}