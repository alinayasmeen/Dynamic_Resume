document.getElementById("resumeForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Fetch input values
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const education = (document.getElementById("education") as HTMLInputElement).value;
    const skills = (document.getElementById("skills") as HTMLInputElement).value.split(",");
    const experience = (document.getElementById("experience") as HTMLTextAreaElement).value;

    // Log values here to check if data is being captured
    console.log(name, email, education, skills, experience);

    // Fetch the profile picture
    const profilePicInput = document.getElementById("profilePicInput") as HTMLInputElement;
    const profilePicFile = profilePicInput.files?.[0];

    // Input validation
    if (!name || !email || !education) {
        alert("Please fill out all required fields.");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Update resume display in real-time
    (document.getElementById("displayName") as HTMLSpanElement).innerText = name;
    (document.getElementById("displayEmail") as HTMLSpanElement).innerText = email;
    (document.getElementById("displayEducation") as HTMLParagraphElement).innerText = education;

    // Update skills list
    const skillsList = document.getElementById("displaySkills") as HTMLUListElement;
    skillsList.innerHTML = ""; // Clear existing skills
    skills.forEach(skill => {
        const listItem = document.createElement("li");
        listItem.innerText = skill.trim();
        skillsList.appendChild(listItem);
    });

    (document.getElementById("displayExperience") as HTMLParagraphElement).innerText = experience;

    // Display the profile picture
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            (document.getElementById("displayProfilePic") as HTMLImageElement).src = e.target?.result as string;
        };
        reader.readAsDataURL(profilePicFile);
    }

    // Generate base64 string for profile picture
    const profilePicBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;

        if (profilePicFile) {
            reader.readAsDataURL(profilePicFile);
        } else {
            resolve(""); // No image provided
        }
    });

    // Generate a unique ID for each resume
    const uniqueId = Date.now().toString(); // Generate a unique ID based on timestamp

    // Save the resume data in local storage
    try {
        localStorage.setItem(uniqueId, JSON.stringify({ name, email, education, skills, experience, profilePic: profilePicBase64 }));
    } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            alert("Local storage limit exceeded. Please clear some space.");
        } else {
            console.error("Failed to save to localStorage:", error);
        }
    }

    // Generate and display the unique URL for sharing the resume
    const uniqueUrl = generateUniqueResumeUrl(uniqueId);
    (document.getElementById("resumeLink") as HTMLParagraphElement).innerText = uniqueUrl;

    // Enable and show the download button
    const downloadBtn = document.getElementById("downloadResumeBtn") as HTMLButtonElement;
    downloadBtn.style.display = "block"; // Make the download button visible

    // Attach click event for downloading the resume as a PDF
    downloadBtn.onclick = () => downloadResumeAsPDF();
});

// Function to generate a unique URL for the resume
function generateUniqueResumeUrl(uniqueId: string): string {
    const currentUrl = window.location.href; // Get the current page URL
    return `${currentUrl}?resumeId=${uniqueId}`;
}

// Function to download the resume as a PDF
function downloadResumeAsPDF() {
    const resumeContent = document.getElementById("resumeDisplay")?.innerHTML;
    const pdfWindow = window.open("", "_blank");
    if (pdfWindow) {
        pdfWindow.document.write(`<html><head><title>Resume PDF</title></head><body>${resumeContent}</body></html>`);
        pdfWindow.document.close();
        pdfWindow.print();
    } else {
        alert("Please allow popups for this site to download the PDF.");
    }
}

// Function to validate email format
function validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
