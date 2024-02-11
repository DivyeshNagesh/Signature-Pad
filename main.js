document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("signature-canvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Touch events
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", stopDrawing);

    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.addEventListener("click", downloadSignature);

    const clearBtn = document.getElementById("clear-btn"); // Add a reference to the clear button
    clearBtn.addEventListener("click", clearSignature); // Add an event listener for the clear button

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";

        ctx.lineTo(clientX - canvas.offsetLeft, clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(clientX - canvas.offsetLeft, clientY - canvas.offsetTop);
    }

    // Touch events handlers
    function handleTouchStart(e) {
        e.preventDefault();
        startDrawing(e.touches[0]);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        draw(e.touches[0]);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    function downloadSignature() {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.fillStyle = "#fff"; // Set background color to white
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the signature on the new canvas
        tempCtx.drawImage(canvas, 0, 0);

        // Create a download link
        const a = document.createElement("a");
        a.href = tempCanvas.toDataURL("image/jpeg");
        a.download = "signature.jpeg";

        // Add an event listener to clear the canvas after the download is complete
        a.addEventListener("click", function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        // Trigger the click event on the download link
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function clearSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});