import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";


export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        }
    );

    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    if (results.faceBlendshapes?.[0]?.categories) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        // Essential blendshapes for natural detection
        const smile = (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
        const frown = (getScore("mouthFrownLeft") + getScore("mouthFrownRight")) / 2;
        const browInnerUp = getScore("browInnerUp") / 2 ; // Key for Sad
        const browDown = (getScore("browDownLeft") + getScore("browDownRight")) / 2; // Key for Angry
        const noseSneer = (getScore("noseSneerLeft") + getScore("noseSneerRight")) / 2; // Key for Angry
        const jawOpen = getScore("jawOpen");
        const browOuterUp = (getScore("browOuterUpLeft") + getScore("browOuterUpRight")) / 2;

        let currentExpression = "Neutral";

        // 1. Happy: Trigger on light smile OR eye squinting with mouth lift
        if (smile > 0.15) {
            currentExpression = "happy";
        } 
        // 2. Angry: As seen in your image, nose wrinkles and brows go down
        else if (browDown > 0.2 || noseSneer > 0.2) {
            currentExpression = "angry";
        }
        // 3. Sad: Inner brows raised + slight frown (very sensitive)
        else if (browInnerUp > 0.2 || frown > 0.1) {
            currentExpression = "surprised";
        }
        // 4. Surprised: High brows or dropping jaw
        else if (jawOpen > 0.1 || browOuterUp > 0.2) {
            currentExpression = "sad";
        }

        setExpression(currentExpression);
        return currentExpression;
    }
};