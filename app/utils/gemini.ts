import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
export const initGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate a response using Gemini
export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

      const graceCollegeInfo = `
🏛️ INSTITUTIONAL OVERVIEW
Name: Grace College of Engineering
Established: 2009
Affiliation: Anna University, Chennai
Approval: All India Council for Technical Education (AICTE)
Type: Private, Self-Financed, Non-Minority, Co-Educational
Counseling Code: 4931
Campus Size: 10.24 acres
Location: Tiruchendur Road, Mullakkadu, Thoothukudi, Tamil Nadu - 628005
Contact: 📞 +91 461 235 6953 / +91 95855 11757
Email: 📧 info@gracecoe.org
Website: 🌐 www.gracecoe.org

👥 LEADERSHIP TEAM
Chairman: Mr. P. Selvaraj
Vice Chairman: Mr. S. P. Chandy, B.E., M.B.A.
Managing Director: Mr. C.M. Joshua, M.Sc. (Botany)
Director: Mr. S. Stephen, M.Sc. (Botany)
Secretary: Mrs. J. Rajkamal Petro, M.A. (English)
Principal: Dr. S. Richard, B.E., M.Tech., Ph.D. (Engineering Design)

🎓 ACADEMIC PROGRAMS
Undergraduate Courses (B.E./B.Tech):
- Computer Science and Engineering – 120 seats
- Electronics and Communication Engineering – 30 seats
- Electrical and Electronics Engineering – 30 seats
- Mechanical Engineering – 30 seats
- Marine Engineering – 30 seats
- Artificial Intelligence and Data Science – 30 seats

Postgraduate Courses (M.E.):
- Computer Science and Engineering – 12 seats
- Power Systems Engineering – 12 seats
- Applied Electronics – 12 seats

Management Program:
- Master of Business Administration (MBA) – 60 seats

🏫 FACILITIES
- Library: Central library with extensive collections, digital resources, and NPTEL video links
- Laboratories: Well-equipped labs for all departments, including a 3D Printing Lab
- Internet: 100 Mbps connectivity with campus-wide Wi-Fi
- Hostels: Separate accommodations for boys and girls with necessary amenities
- Cafeteria: Air-conditioned cafeteria serving a variety of cuisines
- Sports: Facilities for basketball, badminton, chess, cricket, carrom, table tennis, tennis, volleyball, and yoga
- Gym: Fitness centers equipped with modern equipment
- Transport: Fleet of buses covering nearby cities, towns, and villages
- Communication Laboratory: Equipped with computers, LCD projectors, and software to enhance LSRW skills

📚 ADMISSION PROCESS
Undergraduate (B.E./B.Tech):
- Eligibility: Pass in 10+2 with Physics, Chemistry, and Mathematics
- Admission Through: Tamil Nadu Engineering Admissions (TNEA) counseling conducted by Anna University
- Alternative: Joint Entrance Examination (JEE) Main scores may also be considered

Postgraduate (M.E.):
- Eligibility: B.E./B.Tech. in relevant discipline
- Admission Through: Tamil Nadu Common Entrance Test (TANCET) or Common Engineering Entrance Test and Admission (CEETA-PG) scores

MBA:
- Eligibility: Any bachelor's degree
- Admission Through: TANCET scores followed by counseling

Required Documents:
- 10th & 12th Mark Sheets
- Transfer Certificate
- Community Certificate (if applicable)
- Entrance Exam Scorecard (TNEA/JEE for B.E./B.Tech., TANCET/CEETA-PG for M.E./MBA)
- Graduation Mark Sheets and Provisional Certificates (for postgraduate programs)
- Passport-size Photographs
- Aadhaar Card

🏆 ACHIEVEMENTS & RECOGNITIONS
1. International Conference on Recent Innovation in Technologies (ICRIT'25):
   Grace College of Engineering organized ICRIT'25 on May 14–15, 2025. This event provided a platform for students and faculty to interact with leading researchers in areas such as Artificial Intelligence, Robotics, Signal Processing, and Renewable Energy.

2. Student Placement Success:
   The college's Placement & Training Cell has facilitated student placements in various established MNCs and startups. Notable placement includes a student placed at OneYes Infotech Solutions with a competitive salary package of ₹8 LPA.

3. Cultural Fest - GRACIA '22:
   The college organized "GRACIA '22," a cultural fest that showcased student talents across various domains with performances and competitions.

4. Workshops and Training Programs:
   Regular workshops on Artificial Intelligence tools, IoT automation using Raspberry Pi & Node-red, Data Science, Java and Python automation, Web Development, and strategies for innovation in education.

💼 PLACEMENTS
Recruiters: Companies like Infosys, Wipro, TCS, and Flipkart participate in campus placements
Placement Cell: Provides aptitude training and career guidance
Placement Statistics:
- Highest Package: ₹8 LPA
- Average Package: ₹5 LPA
- Placement Rate: Approximately 50% of students placed in 2022

🎓 SCHOLARSHIPS
- First Graduate Students: Eligible for a government scholarship of ₹25,000
- BC Scholarship: ₹5,000 provided by the government
- Additional Fees: Semester exam fees are ₹150 per paper; arrear exam fees are also ₹150 per paper

📍 LOCATION & ACCESSIBILITY
Address: Tiruchendur Road, Mullakkadu, Thoothukudi, Tamil Nadu - 628005
Nearest Railway Station: Thoothukudi (12 km)
Nearest Airport: Thoothukudi (Vagaikulam) Airport (15 km)
`;
    
    const graceContextPrompt = `You are the AI assistant for Grace College of Engineering in Tamil Nadu, India.
      Provide helpful, accurate information about the college's programs, admissions, faculty, 
      and facilities. Use the following information about Grace College in your responses:
      
      ${graceCollegeInfo}
      
      If you don't know something specific about Grace College beyond what's provided, acknowledge that
      you don't have that specific information but offer to help with general engineering education questions.
      Be friendly, professional and concise in your responses.
      
      User question: ${prompt}`;
    
    const result = await model.generateContent(graceContextPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm sorry, I encountered an error. Please try again later.";
  }
};

// Convert speech to text using Gemini API
export const speechToText = async (audioBlob: Blob): Promise<string> => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });

    // Convert blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: audioBlob.type
        }
      },
      "Please transcribe this audio to text. Only return the transcribed text without any additional commentary."
    ]);

    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return "Sorry, I couldn't transcribe the audio. Please try again.";
  }
};

// Use Web Speech API for real-time speech recognition
export const startSpeechRecognition = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Speech recognition is only available in the browser'));
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      // Recognition session ended
    };

    recognition.start();
  });
};

// Record audio using MediaRecorder API
export const recordAudio = (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Audio recording is only available in the browser'));
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          stream.getTracks().forEach(track => track.stop());
          resolve(audioBlob);
        });

        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 10000);

        mediaRecorder.start();
      })
      .catch(error => {
        reject(new Error(`Failed to access microphone: ${error.message}`));
      });
  });
};