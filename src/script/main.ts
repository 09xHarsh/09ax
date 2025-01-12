import "../css/style.css";

const formElement = document.getElementById("email-subscribe-form") as HTMLFormElement | null;

if (formElement) {
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInputElement = document.getElementById("input-email") as HTMLInputElement | null;
    const formSubmitBtn = document.getElementById("form-submit-btn") as HTMLButtonElement | null;

    if (!emailInputElement || !formSubmitBtn) {
      console.error("Required form elements not found.");
      alert("An error occurred. Please try again later.");
      return;
    }

    const email = emailInputElement.value.trim();

    if (email === "") {
      alert("Email is required");
      return;
    }
    const formData = new FormData(formElement);
    // Disable input and button
    emailInputElement.setAttribute("disabled", "true");
    emailInputElement.setAttribute("aria-disabled", "true");

    formSubmitBtn.setAttribute("disabled", "true");
    formSubmitBtn.setAttribute("aria-disabled", "true");
    formSubmitBtn.innerText = "Submitting...";

    try {
      const url = (import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL as string) || "";
      if (!url) {
        throw new Error("Submission URL is not configured.");
      }

      const options: RequestInit = {
        method: "POST",
        mode: "cors",
        body: formData,
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Failed to submit email. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data?.error || "Unknown error occurred.");
      }

      emailInputElement.value = "";
      alert("Email submitted successfully");
    } catch (error: unknown) {
      console.error("Error: ", error);

      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "An unexpected error occurred";

      alert(errorMessage);
    } finally {
      // Re-enable input and button
      emailInputElement.removeAttribute("disabled");
      emailInputElement.setAttribute("aria-disabled", "false");

      formSubmitBtn.removeAttribute("disabled");
      formSubmitBtn.setAttribute("aria-disabled", "false");
      formSubmitBtn.innerText = "Submit";
    }
  });
} else {
  console.error("Form element with ID 'email-subscribe-form' not found.");
}
