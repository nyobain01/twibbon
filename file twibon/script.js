document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const userPhoto = document.getElementById('userPhoto');
    const uploadButton = document.querySelector('.upload-button');
    const downloadButton = document.getElementById('downloadButton');
    const twibbonContainer = document.getElementById('twibbonContainer');
    const photoControls = document.querySelector('.photo-controls');

    // Tombol kontrol foto
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    const moveUpButton = document.getElementById('moveUp');
    const moveDownButton = document.getElementById('moveDown');
    const moveLeftButton = document.getElementById('moveLeft');
    const moveRightButton = document.getElementById('moveRight');

    let currentScale = 1; // Skala awal gambar
    let currentX = 0; // Posisi X gambar
    let currentY = 0; // Posisi Y gambar

    // Fungsi untuk menerapkan transformasi pada gambar
    function applyTransform() {
        userPhoto.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
    }

    // Sembunyikan tombol unduh dan kontrol foto di awal
    downloadButton.style.display = 'none';
    photoControls.style.display = 'none';
    userPhoto.style.display = 'none'; // Sembunyikan placeholder awal

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                userPhoto.src = e.target.result; // Set sumber gambar
                userPhoto.style.display = 'block'; // Tampilkan gambar
                
                // Reset posisi dan skala saat gambar baru diunggah
                currentScale = 1;
                currentX = 0;
                currentY = 0;
                applyTransform();

                // Sembunyikan tombol upload, tampilkan tombol download dan kontrol foto
                uploadButton.style.display = 'none';
                downloadButton.style.display = 'block';
                photoControls.style.display = 'flex'; // Tampilkan kontrol foto
            };

            reader.readAsDataURL(file);
        }
    });

    // Event listeners untuk kontrol foto
    zoomInButton.addEventListener('click', () => {
        currentScale += 0.1; // Perbesar 10%
        applyTransform();
    });

    zoomOutButton.addEventListener('click', () => {
        if (currentScale > 0.2) { // Batasi zoom out agar tidak terlalu kecil
            currentScale -= 0.1;
            applyTransform();
        }
    });

    moveUpButton.addEventListener('click', () => {
        currentY -= 10; // Geser ke atas 10px
        applyTransform();
    });

    moveDownButton.addEventListener('click', () => {
        currentY += 10; // Geser ke bawah 10px
        applyTransform();
    });

    moveLeftButton.addEventListener('click', () => {
        currentX -= 10; // Geser ke kiri 10px
        applyTransform();
    });

    moveRightButton.addEventListener('click', () => {
        currentX += 10; // Geser ke kanan 10px
        applyTransform();
    });

    // Event listener untuk tombol unduh
    downloadButton.addEventListener('click', () => {
        // html2canvas akan mengambil "screenshot" dari elemen twibbon-container
        // Penting: Pastikan gambar sudah dalam posisi dan skala akhir
        // Kita perlu menerapkan transform CSS ke inline style agar html2canvas bisa membacanya
        userPhoto.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;

        html2canvas(twibbonContainer, {
            useCORS: true,
            scale: 2, // Meningkatkan resolusi output untuk kualitas lebih baik
            allowTaint: true,
            backgroundColor: null // Biarkan transparan jika bingkai memiliki transparansi
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'twibbon-sekolah-ceria.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Setelah download, kembalikan tampilan ke keadaan awal
            userPhoto.src = "assets/placeholder-siswa.jpg"; // Kembali ke placeholder
            userPhoto.style.display = 'none'; // Sembunyikan gambar
            
            // Reset skala dan posisi
            currentScale = 1;
            currentX = 0;
            currentY = 0;
            applyTransform();

            uploadButton.style.display = 'block'; // Tampilkan tombol upload
            downloadButton.style.display = 'none'; // Sembunyikan tombol download
            photoControls.style.display = 'none'; // Sembunyikan kontrol foto
        });
    });
});