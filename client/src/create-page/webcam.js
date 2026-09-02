function getVideoMetrics() {
  const videoContainer = document.querySelector(".video-container");
  const rect = videoContainer.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(240, Math.floor(rect.height));
  return { width, height };
}

async function watchCameraPermission() {
  try {
    const permission = await navigator.permissions.query({ name: "camera" });

    permission.onchange = () => {
      if (permission.state === "granted" && !UPLOADED_BG) startWebcamStream();
      else if (IS_RECORDING) stopWebcam();
    };
  } catch {}
}

async function startWebcamStream() {
  const videoContainer = document.querySelector(".video-container");
  const video = document.querySelector("video");
  const spinner = document.querySelector(".spinner-container");

  if (!videoContainer || !video) return;

  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }

  spinner.hidden = false;

  const { width, height } = getVideoMetrics();

  const constraints = {
    audio: false,
    video: {
      width: { ideal: width },
      height: { ideal: height },
      facingMode: "user",
    },
  };

  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    video.srcObject = mediaStream;
    video.onloadedmetadata = () => video.play();

    video.width = width;
    video.height = height;
    // video.style.width = "100%";
    // video.style.height = "100%";
    // video.style.objectFit = "cover";

    IS_RECORDING = true;
    CAN_USE_RECORDER = true;

    setClassVisibility("video-error-message", false);
    spinner.hidden = true;

    toggleCaptureButton(true);
  } catch {
    CAN_USE_RECORDER = false;
    spinner.hidden = true;
    setClassVisibility("video-error-message", true);
  }
}

function toggleCaptureButton(active) {
  const captureButton = document.querySelector(".capture-webcam-button");
  captureButton.disabled = !active;
}

function stopWebcam() {
  const video = document.querySelector("video");

  if (!video?.srcObject) return;

  const stream = video.srcObject;

  stream.getTracks().forEach((track) => {
    track.stop();
  });

  video.srcObject = null;
  IS_RECORDING = false;
  toggleCaptureButton(false);
}

function togglePhotoWait() {
	playAudio(AUDIO.click)
  USE_PHOTO_WAIT = !USE_PHOTO_WAIT;
  const el = document.querySelector(".video-wait-button");

  if (USE_PHOTO_WAIT) el.classList.add("on");
  else el.classList.remove("on");
}
