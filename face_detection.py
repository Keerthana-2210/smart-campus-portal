import cv2
import sys
import time
from urllib.request import urlopen
import numpy as np

# Load the pre-trained Haar Cascade classifier for face detection
# OpenCV provides these XML files. Make sure you install opencv-python!
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def process_frame(frame):
    # Convert the frame to grayscale for better detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    # scaleFactor=1.1, minNeighbors=5 are standard parameters for face detection
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    num_faces = len(faces)
    
    status = "OK"
    if num_faces == 0:
        status = "NO_FACE_DETECTED"
    elif num_faces > 1:
        status = "MULTIPLE_FACES_DETECTED"
        
    return num_faces, status, faces

def start_detection():
    # Attempt to open the default camera (index 0)
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        sys.exit()

    print("--- OpenCV Face Detection Service Started ---")
    print("Press 'q' to quit the application.")

    # In a real system, you would periodically send a POST request 
    # to your Node.js backend (`/api/cheating`) if status != "OK"
    
    while True:
        # Read a frame from the webcam
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break
            
        # Process the frame
        num_faces, status, faces = process_frame(frame)
        
        # Draw rectangles around detected faces
        for (x, y, w, h) in faces:
            color = (0, 255, 0) if num_faces == 1 else (0, 0, 255) # Green if 1 face, Red if multiple
            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            
        # Display the status on the video feed
        cv2.putText(frame, f"Faces: {num_faces} | Status: {status}", (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255) if status != "OK" else (0, 255, 0), 2)
        
        cv2.imshow('Smart Campus - Proctoring Service', frame)
        
        # Output warnings to console (or, in production, trigger API call)
        if status != "OK":
            print(f"[{time.strftime('%H:%M:%S')}] WARNING: {status}")
            
        # Wait for 1ms and check if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    # Release resources
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    start_detection()
