"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
(_a = document.getElementById("resumeForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        // Fetch input values
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const education = document.getElementById("education").value;
        const skills = document.getElementById("skills").value.split(",");
        const experience = document.getElementById("experience").value;
        // Log values here to check if data is being captured
        console.log(name, email, education, skills, experience);
        // Fetch the profile picture
        const profilePicInput = document.getElementById("profilePicInput");
        const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
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
        document.getElementById("displayName").innerText = name;
        document.getElementById("displayEmail").innerText = email;
        document.getElementById("displayEducation").innerText = education;
        // Update skills list
        const skillsList = document.getElementById("displaySkills");
        skillsList.innerHTML = ""; // Clear existing skills
        skills.forEach(skill => {
            const listItem = document.createElement("li");
            listItem.innerText = skill.trim();
            skillsList.appendChild(listItem);
        });
        document.getElementById("displayExperience").innerText = experience;
        // Display the profile picture
        if (profilePicFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                document.getElementById("displayProfilePic").src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            };
            reader.readAsDataURL(profilePicFile);
        }
        // Generate base64 string for profile picture
        const profilePicBase64 = yield new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            if (profilePicFile) {
                reader.readAsDataURL(profilePicFile);
            }
            else {
                resolve(""); // No image provided
            }
        });
        // Generate a unique ID for each resume
        const uniqueId = Date.now().toString(); // Generate a unique ID based on timestamp
        // Save the resume data in local storage
        try {
            localStorage.setItem(uniqueId, JSON.stringify({ name, email, education, skills, experience, profilePic: profilePicBase64 }));
        }
        catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                alert("Local storage limit exceeded. Please clear some space.");
            }
            else {
                console.error("Failed to save to localStorage:", error);
            }
        }
        // Generate and display the unique URL for sharing the resume
        const uniqueUrl = generateUniqueResumeUrl(uniqueId);
        document.getElementById("resumeLink").innerText = uniqueUrl;
        // Enable and show the download button
        const downloadBtn = document.getElementById("downloadResumeBtn");
        downloadBtn.style.display = "block"; // Make the download button visible
        // Attach click event for downloading the resume as a PDF
        downloadBtn.onclick = () => downloadResumeAsPDF();
    });
});
// Function to generate a unique URL for the resume
function generateUniqueResumeUrl(uniqueId) {
    const currentUrl = window.location.href; // Get the current page URL
    return `${currentUrl}?resumeId=${uniqueId}`;
}
// Function to download the resume as a PDF
function downloadResumeAsPDF() {
    var _a;
    const resumeContent = (_a = document.getElementById("resumeDisplay")) === null || _a === void 0 ? void 0 : _a.innerHTML;
    const pdfWindow = window.open("", "_blank");
    if (pdfWindow) {
        pdfWindow.document.write(`<html><head><title>Resume PDF</title></head><body>${resumeContent}</body></html>`);
        pdfWindow.document.close();
        pdfWindow.print();
    }
    else {
        alert("Please allow popups for this site to download the PDF.");
    }
}
// Function to validate email format
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
