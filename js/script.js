// =======================
// 1. DATA COLLECTION HELPERS
// =======================
const urlParams = new URLSearchParams(window.location.search);
const houseParam = urlParams.get("house") || "Not selected";

// =======================
// 2. FORM SUBMISSION LOGIC
// =======================
const form = document.getElementById("rentForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page reload

        // Handle File Names
        const fileFront = document.getElementById("fileUploadFront");
        const fileBack = document.getElementById("fileUploadBack");
        const fileNameFront = fileFront?.files[0]?.name || "No file uploaded";
        const fileNameBack = fileBack?.files[0]?.name || "No file uploaded";

        // Build the Data Object (Make sure keys match your Mongoose Schema)
        const data = {
            
            fullName:       document.getElementById("fullName").value,
            email:          document.getElementById("email").value,
            phone:          document.getElementById("phone").value,
            carType:        document.getElementById("carType").value,
            currentAddress: document.getElementById("currentAddress").value,
            occupation:     document.getElementById("occupation").value,
            income:         document.getElementById("income").value,
            otherIncome:    document.getElementById("otherIncome").value,
            moveDate:       document.getElementById("moveDate").value,
            numMoving:      document.getElementById("numMoving").value,
            prevLandlord:   document.getElementById("prevLandlord").value,
            tenancyLength:  document.getElementById("tenancyLength").value,
            paymentMethod:  document.getElementById("paymentMethod").value,
            otherApplicant: document.getElementById("otherApplicant").value,
            // Radio Buttons
            pets:           document.querySelector('input[name="pets"]:checked')?.value || "N/A",
            married:        document.querySelector('input[name="married"]:checked')?.value || "N/A",
            brokenLease:    document.querySelector('input[name="brokenLease"]:checked')?.value || "N/A",
            felony:         document.querySelector('input[name="felony"]:checked')?.value || "N/A",
            lockout:        document.querySelector('input[name="lockout"]:checked')?.value || "N/A",
            alcohol:        document.querySelector('input[name="alcohol"]:checked')?.value || "N/A",
            smoke:          document.querySelector('input[name="smoke"]:checked')?.value || "N/A",
            suing:          document.querySelector('input[name="suing"]:checked')?.value || "N/A",
            idFront:        fileNameFront,
            idBack:         fileNameBack
        };

        // --- SAVE TO LOCALSTORAGE (Optional Backup) ---
        try {
            let apps = JSON.parse(localStorage.getItem("rentApplications") || "[]");
            apps.unshift(data);
            if (apps.length > 20) apps.pop();
            localStorage.setItem("rentApplications", JSON.stringify(apps));
        } catch(err) {
            console.error("Local storage error:", err);
        }

        // --- SEND TO BACKEND ---
        try {
            console.log("Sending data to server...", data);

            // REPLACE the entire fetch section with:
var formData = new FormData();
Object.keys(data).forEach(function(key) {
  formData.append(key, data[key]);
});

var fileFrontEl = document.getElementById("fileUploadFront");
var fileBackEl  = document.getElementById("fileUploadBack");
if (fileFrontEl && fileFrontEl.files[0]) formData.append("fileUploadFront", fileFrontEl.files[0]);
if (fileBackEl  && fileBackEl.files[0])  formData.append("fileUploadBack",  fileBackEl.files[0]);

const response = await fetch("https://djrentals-1.onrender.com/application/submit", {

  method: "POST",
  body: formData  // NO headers — browser sets them automatically
});

           // 1. Check if the server responded at all (200-299)
if (!response.ok) {
    // If we are HERE, something went wrong. DO NOT put a success alert here.
    const errorData = await response.json();
    throw new Error(errorData.message || "Server error occurred");
}

// 2. If we reach here, the server responded. Now check our custom 'success' flag.
const result = await response.json();

if (result.success) {
    console.log("✅ Application saved!");
    alert("Submission Successful!"); // Move the alert HERE
    window.location.href = "thanks.html"; 
} else {
    // This handles cases where the server is up but rejected the data (e.g., validation)
    alert("Submission failed: " + result.message);
}

        } catch (err) {
            console.error("Submission Error:", err);
             alert("Submission failed: " + err.message);
        }
    });
}

// =======================
// 3. AUTO-FILL LISTINGS
// =======================
function updateListings() {
    try {
        const savedApps = JSON.parse(localStorage.getItem("rentApplications") || "[]");
        savedApps.forEach((app, index) => {
            const card = document.getElementById(`house-${index + 1}`);
            if (card) {
                card.innerHTML = `
                    <img src="images/house${index + 1}.jpg" alt="House ${index + 1}">
                    <h3>${app.fullName}</h3>
                    <p><strong>Email:</strong> ${app.email}</p>
                    <p><strong>Phone:</strong> ${app.phone}</p>
                    <p><strong>Income:</strong> $${app.income}/mo</p>
                    <p><strong>Move-in:</strong> ${app.moveDate}</p>
                  
                `;
            }
        });
    } catch(err) {
        console.error("Listings display error:", err);
    }
}

updateListings();