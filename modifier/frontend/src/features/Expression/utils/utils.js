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

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");

        const jawOpen = getScore("jawOpen");

        const browInnerUp = getScore("browInnerUp");
        const browOuterUpLeft = getScore("browOuterUpLeft");
        const browOuterUpRight = getScore("browOuterUpRight");

        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");

        let currentExpression = "neutral";

        // average values for stability
        const smile = (smileLeft + smileRight) / 2;
        const frown = (frownLeft + frownRight) / 2;

        const browRaise = Math.max(
            browInnerUp,
            browOuterUpLeft,
            browOuterUpRight
        );

        // DEBUG values (helps tuning)
        console.log({
            smile,
            frown,
            jawOpen,
            browRaise
        });

        // EXPRESSION DETECTION (sensitive)
        if (jawOpen > 0.30 && browRaise > 0.20) {
            currentExpression = "surprise";
        }

        else if (smile > 0.22) {
            // detects even slight smile
            currentExpression = "happy";
        }

        else if (frown > 0.32) {
            currentExpression = "angry";
        }

        else if (frown > 0.13) {
            currentExpression = "sad";
        }

        setExpression(currentExpression);

        return currentExpression
    }
};