let startX, startY, endX, endY, isDrawing = false;
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

document.getElementById('imageUpload').addEventListener('change', loadImage);
document.getElementById('removeWatermarkBtn').addEventListener('click', removeWatermark);
document.getElementById('downloadImageBtn').addEventListener('click', downloadImage);
document.getElementById('resizeImageBtn').addEventListener('click', showResizeOptions);
document.getElementById('applyResizeBtn').addEventListener('click', applyResize);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function startDrawing(event) {
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
}

function draw(event) {
    if (!isDrawing) return;
    endX = event.offsetX;
    endY = event.offsetY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function endDrawing(event) {
    if (!isDrawing) return;
    isDrawing = false;
    endX = event.offsetX;
    endY = event.offsetY;
}

function removeWatermark() {
    const width = endX - startX;
    const height = endY - startY;

    // Get image data
    const imageData = ctx.getImageData(startX, startY, width, height);
    const data = imageData.data;

    // Apply a simple algorithm to remove the watermark
    for (let i = 0; i < data.length; i += 4) {
        // Example: make pixels transparent
        data[i + 3] = 0; // Set alpha to 0
    }

    ctx.putImageData(imageData, startX, startY);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'image_without_watermark.png';
    link.href = canvas.toDataURL();
    link.click();
}

function showResizeOptions() {
    document.getElementById('resizeOptions').style.display = 'block';
}

function applyResize() {
    const newWidth = parseInt(document.getElementById('newWidth').value);
    const newHeight = parseInt(document.getElementById('newHeight').value);

    if (newWidth && newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
    }
}
