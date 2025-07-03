import html2canvas from 'html2canvas'

export default function handleTakeScreenshot(canvasRef,download=true) {
  setTimeout(() => {
    if (canvasRef.current) {
      console.log(canvasRef.current);
      html2canvas(canvasRef.current).then(function (canvas) {
        if(download){
          const link = document.createElement('a')
          link.download = 'screenshot.png'
          link.href = canvas.toDataURL()
          link.click()
        }
        else{
          return canvas.toDataURL()
        }
      })
    }
  }, 100)
}